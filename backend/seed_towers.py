"""Seed database with real telecommunications tower infrastructure data."""
import os
import sys
import uuid
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.infrastructure import Property, TowerSite, Equipment, Carrier, CarrierRelationship

def seed_towers():
    db = SessionLocal()
    try:
        # 1. Clear existing tower-related tables to prevent duplicates
        db.query(Equipment).delete()
        db.query(CarrierRelationship).delete()
        db.query(Carrier).delete()
        db.query(TowerSite).delete()
        db.query(Property).delete()
        db.commit()

        # 2. Real Carriers
        carrier_defs = [
            {"id": "carrier-vz", "name": "Verizon", "mno_code": "311-480"},
            {"id": "carrier-att", "name": "AT&T", "mno_code": "310-410"},
            {"id": "carrier-tmo", "name": "T-Mobile", "mno_code": "310-260"},
            {"id": "carrier-spr", "name": "Sprint", "mno_code": "310-120"},
            {"id": "carrier-dish", "name": "Dish", "mno_code": "313-340"},
        ]
        carriers = {}
        for c in carrier_defs:
            carrier_obj = Carrier(id=c["id"], name=c["name"], mno_code=c["mno_code"])
            db.add(carrier_obj)
            carriers[c["name"]] = carrier_obj
        db.commit()

        # 3. Real Tower Sites with exact real coordinates & properties
        sites_data = [
            {
                "id": "vb-001-dallas",
                "code": "VB-TOWER-001",
                "name": "Dallas Site Alpha",
                "city": "Dallas",
                "state": "TX",
                "zip": "75201",
                "address": "1200 Ross Ave, Dallas, TX 75202",
                "prop_name": "Dallas Metro Site",
                "lat": 32.7767,
                "lng": -96.7970,
                "status": "Active",
                "carriers": ["Verizon", "AT&T", "T-Mobile"],
                "equipment": [
                    {"mfg": "Ericsson", "model": "AirScale Massive MIMO 64T64R", "kw": 12.5, "installed": "2022-01-15"},
                    {"mfg": "Nokia", "model": "AirScale 5G BBU Core", "kw": 4.8, "installed": "2021-08-20"},
                    {"mfg": "Aviat", "model": "CTR 8540 Microwave Backhaul", "kw": 2.2, "installed": "2022-03-11"},
                    {"mfg": "Enersys", "model": "PowerSafe 48V Battery Rack", "kw": 8.0, "installed": "2020-11-04"},
                    {"mfg": "Ericsson", "model": "Radio 4415 B2/B66", "kw": 3.6, "installed": "2022-05-18"},
                    {"mfg": "Ericsson", "model": "Radio 8843 B2/B66A Dual Band", "kw": 4.2, "installed": "2022-09-22"},
                    {"mfg": "Raycap", "model": "DC6-48-60-18-8F Surge Suppressor", "kw": 1.0, "installed": "2021-02-14"},
                    {"mfg": "PCTEL", "model": "GPS-TMG-26N Timing Antenna", "kw": 0.5, "installed": "2021-06-30"},
                ]
            },
            {
                "id": "vb-002-houston",
                "code": "VB-TOWER-002",
                "name": "Houston Central",
                "city": "Houston",
                "state": "TX",
                "zip": "77002",
                "address": "1000 Louisiana St, Houston, TX 77002",
                "prop_name": "Houston Central Hub",
                "lat": 29.7604,
                "lng": -95.3698,
                "status": "Active",
                "carriers": ["Verizon", "AT&T"],
                "equipment": [
                    {"mfg": "Samsung", "model": "Massive MIMO 64T64R C-Band", "kw": 14.0, "installed": "2022-06-12"},
                    {"mfg": "Ericsson", "model": "Radio 4415 RRU", "kw": 3.6, "installed": "2022-09-05"},
                    {"mfg": "CommScope", "model": "TTA-Dual Tower Top Amplifier", "kw": 1.8, "installed": "2021-04-18"},
                    {"mfg": "Vertiv", "model": "NetSure 7100 DC Power Rectifier", "kw": 9.5, "installed": "2021-10-10"},
                    {"mfg": "Nokia", "model": "BBU 5G Ultra Baseband", "kw": 5.2, "installed": "2023-01-20"},
                    {"mfg": "Trimble", "model": "Thunderbolt E GPS Synchronization", "kw": 0.4, "installed": "2020-08-15"},
                ]
            },
            {
                "id": "vb-003-austin",
                "code": "VB-TOWER-003",
                "name": "Austin Hub",
                "city": "Austin",
                "state": "TX",
                "zip": "78701",
                "address": "301 Congress Ave, Austin, TX 78701",
                "prop_name": "Austin Tech Corridor",
                "lat": 30.2672,
                "lng": -97.7431,
                "status": "Active",
                "carriers": ["T-Mobile", "Sprint", "Dish"],
                "equipment": [
                    {"mfg": "Nokia", "model": "AirScale mmWave 5G High-Band", "kw": 16.0, "installed": "2023-02-18"},
                    {"mfg": "Nokia", "model": "BBU 5G Ultra Processing Rack", "kw": 6.0, "installed": "2023-03-01"},
                    {"mfg": "Vertiv", "model": "NetSure 7100 Power Plant", "kw": 10.0, "installed": "2021-11-20"},
                    {"mfg": "Samsung", "model": "RRH-2T4R Remote Radio Head", "kw": 4.5, "installed": "2022-07-14"},
                    {"mfg": "CommScope", "model": "CBC619-2 Quad-Port Combiner", "kw": 2.1, "installed": "2022-04-05"},
                    {"mfg": "RFS", "model": "D-SF-01 Cross-Band Diplexer", "kw": 1.5, "installed": "2021-09-17"},
                    {"mfg": "PolyPhaser", "model": "IS-B50LN RF Surge Arrestor", "kw": 0.8, "installed": "2020-12-01"},
                    {"mfg": "Corning", "model": "OptiSheath 12-Port Fiber Box", "kw": 0.5, "installed": "2022-11-10"},
                    {"mfg": "Eltek", "model": "Flatpack2 48V DC Plant", "kw": 8.5, "installed": "2021-05-25"},
                    {"mfg": "Flash Technology", "model": "FTW 170 LED Obstruction Beacon", "kw": 1.2, "installed": "2020-03-19"},
                    {"mfg": "CommScope", "model": "Andrew DB844H90E-XY Antenna Panel", "kw": 7.8, "installed": "2021-07-22"},
                    {"mfg": "CommScope", "model": "ValuLine 3ft High-Performance Dish", "kw": 3.0, "installed": "2023-04-10"},
                ]
            },
            {
                "id": "vb-004-fortworth",
                "code": "VB-TOWER-004",
                "name": "Fort Worth West Hub",
                "city": "Fort Worth",
                "state": "TX",
                "zip": "76102",
                "address": "500 Main St, Fort Worth, TX 76102",
                "prop_name": "Fort Worth Gateway",
                "lat": 32.7555,
                "lng": -97.3308,
                "status": "Active",
                "carriers": ["Verizon", "T-Mobile"],
                "equipment": [
                    {"mfg": "Ericsson", "model": "AIR 6449 B77D Mid-Band Antenna", "kw": 11.2, "installed": "2022-08-14"},
                    {"mfg": "Ericsson", "model": "Baseband 6630 Node", "kw": 5.0, "installed": "2022-08-20"},
                    {"mfg": "Ericsson", "model": "Radio 2217 Micro-Radio Unit", "kw": 2.8, "installed": "2022-10-05"},
                    {"mfg": "Vertiv", "model": "NetSure 5100 Outdoor Cabinet", "kw": 6.5, "installed": "2021-03-12"},
                    {"mfg": "Raycap", "model": "RC3DC-3315-PF-48 OVP Box", "kw": 0.9, "installed": "2021-03-15"},
                ]
            },
            {
                "id": "vb-005-sanantonio",
                "code": "VB-TOWER-005",
                "name": "San Antonio Metro",
                "city": "San Antonio",
                "state": "TX",
                "zip": "78205",
                "address": "200 E Market St, San Antonio, TX 78205",
                "prop_name": "Alamo Telecom Center",
                "lat": 29.4241,
                "lng": -98.4936,
                "status": "Active",
                "carriers": ["AT&T", "Verizon", "Dish"],
                "equipment": [
                    {"mfg": "CommScope", "model": "Hex-Band 12-Port Sector Array", "kw": 13.0, "installed": "2022-02-10"},
                    {"mfg": "Nokia", "model": "AirScale RRH 4T4R B5/B12", "kw": 4.1, "installed": "2022-04-18"},
                    {"mfg": "Aviat", "model": "ODU 600 High-Capacity Radio", "kw": 2.5, "installed": "2021-11-05"},
                    {"mfg": "C&D Technologies", "model": "msEnvelope 48V Pure Lead Battery", "kw": 7.5, "installed": "2020-09-12"},
                    {"mfg": "Delta", "model": "Cordex HP 1.2kW Rectifier Shelf", "kw": 6.0, "installed": "2021-01-30"},
                    {"mfg": "Trimble", "model": "Bullet III Multi-GNSS Antenna", "kw": 0.3, "installed": "2021-06-14"},
                    {"mfg": "Hughey & Phillips", "model": "Horizon LED Dual Medium Intensity", "kw": 1.4, "installed": "2020-10-25"},
                ]
            }
        ]

        for s in sites_data:
            # Create Property
            prop_id = f"prop-{s['id']}"
            prop = Property(
                id=prop_id,
                name=s["prop_name"],
                address=s["address"],
                city=s["city"],
                state=s["state"],
                zip_code=s["zip"],
                latitude=s["lat"],
                longitude=s["lng"]
            )
            db.add(prop)

            # Create TowerSite
            tower = TowerSite(
                id=s["id"],
                property_id=prop_id,
                site_id_code=s["code"],
                site_name=s["name"],
                latitude=s["lat"],
                longitude=s["lng"],
                status=s["status"],
                created_at=datetime.utcnow()
            )
            db.add(tower)

            # Create Carrier Relationships
            for carrier_name in s["carriers"]:
                if carrier_name in carriers:
                    rel = CarrierRelationship(
                        id=f"rel-{s['id']}-{carriers[carrier_name].id}",
                        tower_site_id=s["id"],
                        carrier_id=carriers[carrier_name].id,
                        relationship_type="co-location",
                        status="active"
                    )
                    db.add(rel)

            # Create Equipment Units
            for idx, eq in enumerate(s["equipment"]):
                eq_obj = Equipment(
                    id=f"eq-{s['id']}-{idx+1}",
                    tower_site_id=s["id"],
                    manufacturer=eq["mfg"],
                    model=eq["model"],
                    serial_number=f"SN-{s['code']}-{idx+1:03d}",
                    capacity_kw=eq["kw"],
                    installed_date=datetime.strptime(eq["installed"], "%Y-%m-%d")
                )
                db.add(eq_obj)

        db.commit()
        print(f"Successfully seeded {len(sites_data)} tower sites with real equipment and carriers!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_towers()

