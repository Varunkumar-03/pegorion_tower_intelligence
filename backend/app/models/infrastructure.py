from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .base_class import Base

class Property(Base):
    __tablename__ = "properties"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zip_code = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    organization_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TowerSite(Base):
    __tablename__ = "tower_sites"
    id = Column(String, primary_key=True)
    property_id = Column(String, ForeignKey("properties.id"))
    site_id_code = Column(String, unique=True)
    site_name = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    property = relationship("Property", back_populates="tower_sites")

Property.tower_sites = relationship("TowerSite", back_populates="property")

class SiteAsset(Base):
    __tablename__ = "site_assets"
    id = Column(String, primary_key=True)
    tower_site_id = Column(String, ForeignKey("tower_sites.id"))
    name = Column(String)
    asset_type = Column(String)
    serial_number = Column(String)
    installed_date = Column(DateTime)

class Equipment(Base):
    __tablename__ = "equipment"
    id = Column(String, primary_key=True)
    tower_site_id = Column(String, ForeignKey("tower_sites.id"))
    manufacturer = Column(String)
    model = Column(String)
    serial_number = Column(String)
    capacity_kw = Column(Float)
    installed_date = Column(DateTime)

class Carrier(Base):
    __tablename__ = "carriers"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    mno_code = Column(String, unique=True)
    logo_url = Column(String)

class CarrierRelationship(Base):
    __tablename__ = "carrier_relationships"
    id = Column(String, primary_key=True)
    tower_site_id = Column(String, ForeignKey("tower_sites.id"))
    carrier_id = Column(String, ForeignKey("carriers.id"))
    relationship_type = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String, default="active")
