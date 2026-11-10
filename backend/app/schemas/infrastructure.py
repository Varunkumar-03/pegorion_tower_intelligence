from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class PropertyBase(BaseModel):
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class PropertyCreate(PropertyBase):
    pass

class Property(PropertyBase):
    id: str
    organization_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TowerSiteBase(BaseModel):
    site_id_code: str
    site_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[str] = "active"

class TowerSiteCreate(TowerSiteBase):
    property_id: str

class TowerSite(TowerSiteBase):
    id: str
    property_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class EquipmentBase(BaseModel):
    name: str
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    capacity_kw: Optional[float] = None
    installed_date: Optional[datetime] = None

class Equipment(EquipmentBase):
    id: str
    tower_site_id: str

    class Config:
        from_attributes = True

class CarrierBase(BaseModel):
    name: str
    mno_code: Optional[str] = None
    logo_url: Optional[str] = None

class CarrierCreate(CarrierBase):
    pass

class Carrier(CarrierBase):
    id: str

    class Config:
        from_attributes = True

class SiteAssetBase(BaseModel):
    name: str
    asset_type: str
    serial_number: Optional[str] = None
    installed_date: Optional[datetime] = None

class SiteAsset(SiteAssetBase):
    id: str
    tower_site_id: str

    class Config:
        from_attributes = True

class TowerSiteSchema(TowerSite):
    """Extended tower site schema with property info."""
    property: Optional[Property] = None
    equipment: Optional[List[Equipment]] = None
    carriers: Optional[List[Carrier]] = None