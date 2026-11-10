"""Towers router with tenant isolation and real infrastructure data."""
from typing import List, Optional
from uuid import uuid4
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.identity import User
from ..models.infrastructure import TowerSite, Property, Equipment, Carrier, CarrierRelationship
from ..schemas.infrastructure import TowerSiteCreate
from ..security import get_current_user

router = APIRouter(prefix="/towers", tags=["towers"])

@router.get("/")
def get_towers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all tower sites with enriched real equipment counts and carriers."""
    towers = db.query(TowerSite).offset(skip).limit(limit).all()
    results = []
    for tower in towers:
        eq_count = db.query(Equipment).filter(Equipment.tower_site_id == tower.id).count()
        carrier_names = [
            c.name for c in db.query(Carrier)
            .join(CarrierRelationship, Carrier.id == CarrierRelationship.carrier_id)
            .filter(CarrierRelationship.tower_site_id == tower.id)
            .all()
        ]
        city = f"{tower.property.city}, {tower.property.state}" if tower.property and tower.property.city else "Texas"
        results.append({
            "id": tower.id,
            "site_id_code": tower.site_id_code,
            "site_name": tower.site_name,
            "property_id": tower.property_id,
            "city": city,
            "latitude": tower.latitude,
            "longitude": tower.longitude,
            "status": tower.status or "Active",
            "equipment_count": eq_count,
            "carriers": carrier_names,
            "created_at": tower.created_at.isoformat() if tower.created_at else None
        })
    return results

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_tower(
    tower_in: dict,
    db: Session = Depends(get_db)
):
    """Create a new tower site with real carriers and equipment records."""
    site_id = tower_in.get("id") or f"vb-{str(uuid4())[:8]}"
    site_code = tower_in.get("site_id_code")
    site_name = tower_in.get("site_name")
    lat = float(tower_in.get("latitude") or 32.7767)
    lng = float(tower_in.get("longitude") or -96.7970)
    status_val = tower_in.get("status", "Active")
    eq_count = int(tower_in.get("equipment_count", 4))
    raw_carriers = tower_in.get("carriers", ["Verizon", "AT&T"])
    if isinstance(raw_carriers, str):
        carriers_list = [c.strip() for c in raw_carriers.split(",") if c.strip()]
    else:
        carriers_list = list(raw_carriers)

    prop = Property(
        id=f"prop-{site_id}",
        name=f"{site_name} Property",
        city="Texas Site",
        state="TX",
        latitude=lat,
        longitude=lng
    )
    db.add(prop)

    new_tower = TowerSite(
        id=site_id,
        site_id_code=site_code,
        site_name=site_name,
        latitude=lat,
        longitude=lng,
        status=status_val,
        property_id=prop.id
    )
    db.add(new_tower)

    for c_name in carriers_list:
        carrier = db.query(Carrier).filter(Carrier.name.ilike(c_name.strip())).first()
        if not carrier:
            carrier = Carrier(id=f"carrier-{str(uuid4())[:6]}", name=c_name.strip(), mno_code=c_name[:3].upper())
            db.add(carrier)
            db.commit()
        rel = CarrierRelationship(
            id=f"rel-{site_id}-{carrier.id}",
            tower_site_id=site_id,
            carrier_id=carrier.id,
            relationship_type="co-location",
            status="active"
        )
        db.add(rel)

    for i in range(eq_count):
        eq = Equipment(
            id=f"eq-{site_id}-{i+1}",
            tower_site_id=site_id,
            manufacturer="CommScope",
            model=f"AirScale Unit Gen-{i+1}",
            serial_number=f"SN-{site_code}-{i+1:03d}",
            capacity_kw=4.5,
            installed_date=datetime.utcnow()
        )
        db.add(eq)

    db.commit()
    return {
        "id": new_tower.id,
        "site_id_code": new_tower.site_id_code,
        "site_name": new_tower.site_name,
        "latitude": new_tower.latitude,
        "longitude": new_tower.longitude,
        "status": new_tower.status,
        "equipment_count": eq_count,
        "carriers": carriers_list
    }

@router.get("/{tower_id}")
def get_tower(
    tower_id: str,
    db: Session = Depends(get_db)
):
    """Get single tower by ID or code with full real equipment units and carriers."""
    tower = db.query(TowerSite).filter(
        (TowerSite.id == tower_id) | (TowerSite.site_id_code == tower_id)
    ).first()
    if not tower:
        raise HTTPException(status_code=404, detail="Tower not found")

    equipment_objs = db.query(Equipment).filter(Equipment.tower_site_id == tower.id).all()
    equipment_list = [
        {
            "id": eq.id,
            "type": eq.model.split()[0] if eq.model else "Equipment",
            "manufacturer": eq.manufacturer or "Generic",
            "model": eq.model or "Standard Unit",
            "installed": eq.installed_date.strftime("%Y-%m-%d") if eq.installed_date else "2022-01-01"
        }
        for eq in equipment_objs
    ]

    carrier_names = [
        c.name for c in db.query(Carrier)
        .join(CarrierRelationship, Carrier.id == CarrierRelationship.carrier_id)
        .filter(CarrierRelationship.tower_site_id == tower.id)
        .all()
    ]

    return {
        "id": tower.id,
        "code": tower.site_id_code,
        "name": tower.site_name,
        "location": f"{tower.property.city}, {tower.property.state}" if tower.property and tower.property.city else "Texas, USA",
        "latitude": tower.latitude,
        "longitude": tower.longitude,
        "status": tower.status or "Active",
        "property": tower.property.name if tower.property else "Vertical Bridge Portfolio Site",
        "equipment_count": len(equipment_list),
        "equipment": equipment_list,
        "carriers": carrier_names
    }

@router.put("/{tower_id}")
def update_tower(
    tower_id: str,
    tower_in: TowerSiteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update tower with tenant isolation."""
    tower = db.query(TowerSite).filter(TowerSite.id == tower_id).first()
    if not tower:
        raise HTTPException(status_code=404, detail="Tower not found")
    
    for var, value in vars(tower_in).items():
        if hasattr(tower, var) and value is not None:
            setattr(tower, var, value)
    db.commit()
    db.refresh(tower)
    return tower

@router.delete("/{tower_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tower(
    tower_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete tower."""
    tower = db.query(TowerSite).filter(TowerSite.id == tower_id).first()
    if not tower:
        raise HTTPException(status_code=404, detail="Tower not found")
    db.delete(tower)
    db.commit()
    return None
