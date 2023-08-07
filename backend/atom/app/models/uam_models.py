from app import db
from sqlalchemy import ForeignKey
from datetime import datetime

from app.models.atom_models import *

#
#
#

# ** UAM Models **

#
#
#


class UAM_Device_Table(db.Model):
    __tablename__ = "uam_device_table"
    uam_id = db.Column(db.Integer, primary_key=True)
    atom_id = db.Column(db.Integer, ForeignKey("atom_table.atom_id"))

    software_type = db.Column(db.String(50))
    software_version = db.Column(db.String(50))
    patch_version = db.Column(db.String(50))
    status = db.Column(db.String(50))
    manufacturer = db.Column(db.String(50))
    hw_eos_date = db.Column(db.Date)
    hw_eol_date = db.Column(db.Date)
    sw_eos_date = db.Column(db.Date)
    sw_eol_date = db.Column(db.Date)
    rfs_date = db.Column(db.Date)
    authentication = db.Column(db.String(10))
    serial_number = db.Column(db.String(50))
    pn_code = db.Column(db.String(50))
    subrack_id_number = db.Column(db.String(50))
    manufacturer_date = db.Column(db.Date)
    hardware_version = db.Column(db.String(50))
    max_power = db.Column(db.String(50))
    site_type = db.Column(db.String(50))
    source = db.Column(db.String(50))
    stack = db.Column(db.String(50))
    contract_number = db.Column(db.String(50))
    contract_expiry = db.Column(db.Date)
    uptime = db.Column(db.Date)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Board_Table(db.Model):
    __tablename__ = "board_table"
    board_id = db.Column(db.Integer, primary_key=True)
    uam_id = db.Column(db.Integer, ForeignKey("uam_device_table.uam_id"))

    board_name = db.Column(db.String(250))
    hardware_version = db.Column(db.String(50))
    device_slot_id = db.Column(db.String(50))
    software_version = db.Column(db.String(50))
    serial_number = db.Column(db.String(50))
    manufacturer_date = db.Column(db.Date)
    status = db.Column(db.String(50))
    eos_date = db.Column(db.Date)
    eol_date = db.Column(db.Date)
    rfs_date = db.Column(db.Date)
    pn_code = db.Column(db.String(50))

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Subboard_Table(db.Model):
    __tablename__ = "subboard_table"
    subboard_id = db.Column(db.Integer, primary_key=True)
    uam_id = db.Column(db.Integer, ForeignKey("uam_device_table.uam_id"))

    subboard_name = db.Column(db.String(250))
    subboard_type = db.Column(db.String(150))
    subrack_id = db.Column(db.String(250))
    slot_number = db.Column(db.String(250))
    subslot_number = db.Column(db.String(250))
    hardware_version = db.Column(db.String(50))
    software_version = db.Column(db.String(50))
    serial_number = db.Column(db.String(50))
 
    status = db.Column(db.String(50))
    eos_date = db.Column(db.Date)
    eol_date = db.Column(db.Date)
    rfs_date = db.Column(db.Date)
    pn_code = db.Column(db.String(50))

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Sfps_Table(db.Model):
    __tablename__ = "sfp_table"
    sfp_id = db.Column(db.Integer, primary_key=True)
    uam_id = db.Column(db.Integer, ForeignKey("uam_device_table.uam_id"))

    media_type = db.Column(db.String(50))
    port_name = db.Column(db.String(250))
    port_type = db.Column(db.String(50))
    connector = db.Column(db.String(50))
    mode = db.Column(db.String(50))
    speed = db.Column(db.String(50))
    wavelength = db.Column(db.String(50))
    manufacturer = db.Column(db.String(250))
    optical_direction_type = db.Column(db.String(50))
    pn_code = db.Column(db.String(50))
    status = db.Column(db.String(50))
    eos_date = db.Column(db.Date)
    eol_date = db.Column(db.Date)
    rfs_date = db.Column(db.Date)
    serial_number = db.Column(db.String(50))

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class License_Table(db.Model):
    __tablename__ = "license_table"
    uam_id = db.Column(db.Integer, ForeignKey("uam_device_table.uam_id"))

    license_name = db.Column(db.String(250), primary_key=True)
    license_description = db.Column(db.String(250))
    rfs_date = db.Column(db.Date)
    activation_date = db.Column(db.Date)
    expiry_date = db.Column(db.Date)
    grace_period = db.Column(db.String(10))
    serial_number = db.Column(db.String(50))
    status = db.Column(db.String(50))
    capacity = db.Column(db.String(50))
    usage = db.Column(db.String(50))
    pn_code = db.Column(db.String(50))

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class SNTC_TABLE(db.Model):
    __tablename__ = "sntc_table"
    sntc_id = db.Column(db.Integer, primary_key=True)
    pn_code = db.Column(db.String(50))
    
    hw_eos_date = db.Column(db.Date)
    hw_eol_date = db.Column(db.Date)
    sw_eos_date = db.Column(db.Date)
    sw_eol_date = db.Column(db.Date)
    manufacturer_date = db.Column(db.Date)
    
    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )
    
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}




class APS_TABLE(db.Model):
    __tablename__ = 'aps_table'
    ap_id = db.Column(db.Integer, primary_key=True)
    controller_name = db.Column(db.String(50))
    ap_ip = db.Column(db.String(50))
    ap_name = db.Column(db.String(50))
    serial_number = db.Column(db.String(50))
    ap_model = db.Column(db.String(50))
    hardware_version = db.Column(db.String(50))
    software_version = db.Column(db.String(50))
    description = db.Column(db.String(200))
    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now())
    
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
