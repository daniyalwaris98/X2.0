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
    uam_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    atom_id = db.Column(
        db.Integer,
        ForeignKey("atom_table.atom_id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    status = db.Column(db.String(50), nullable=False)

    software_type = db.Column(db.String(50), nullable=True)
    software_version = db.Column(db.String(50), nullable=True)
    patch_version = db.Column(db.String(50), nullable=True)
    manufacturer = db.Column(db.String(50), nullable=True)
    hw_eos_date = db.Column(db.Date, nullable=True)
    hw_eol_date = db.Column(db.Date, nullable=True)
    sw_eos_date = db.Column(db.Date, nullable=True)
    sw_eol_date = db.Column(db.Date, nullable=True)
    rfs_date = db.Column(db.Date, nullable=True)
    authentication = db.Column(db.String(10), nullable=True)
    serial_number = db.Column(db.String(50), nullable=True)
    pn_code = db.Column(db.String(50), nullable=True)
    subrack_id_number = db.Column(db.String(50), nullable=True)
    manufacturer_date = db.Column(db.Date, nullable=True)
    hardware_version = db.Column(db.String(50), nullable=True)
    max_power = db.Column(db.String(50), nullable=True)
    site_type = db.Column(db.String(50), nullable=True)
    source = db.Column(db.String(50), nullable=True)
    stack = db.Column(db.String(50), nullable=True)
    contract_number = db.Column(db.String(50), nullable=True)
    contract_expiry = db.Column(db.Date, nullable=True)
    uptime = db.Column(db.Date, nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Board_Table(db.Model):
    __tablename__ = "board_table"
    board_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uam_id = db.Column(
        db.Integer,
        ForeignKey("uam_device_table.uam_id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    board_name = db.Column(db.String(250), nullable=False)
    status = db.Column(db.String(50), nullable=False)

    hardware_version = db.Column(db.String(50), nullable=True)
    device_slot_id = db.Column(db.String(50), nullable=True)
    software_version = db.Column(db.String(50), nullable=True)
    serial_number = db.Column(db.String(50), nullable=True)
    manufacturer_date = db.Column(db.Date, nullable=True)
    eos_date = db.Column(db.Date, nullable=True)
    eol_date = db.Column(db.Date, nullable=True)
    rfs_date = db.Column(db.Date, nullable=True)
    pn_code = db.Column(db.String(50), nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Subboard_Table(db.Model):
    __tablename__ = "subboard_table"
    subboard_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uam_id = db.Column(
        db.Integer,
        ForeignKey("uam_device_table.uam_id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    subboard_name = db.Column(db.String(250), nullable=False)
    status = db.Column(db.String(50), nullable=False)

    subboard_type = db.Column(db.String(150), nullable=True)
    subrack_id = db.Column(db.String(250), nullable=True)
    slot_number = db.Column(db.String(250), nullable=True)
    subslot_number = db.Column(db.String(250), nullable=True)
    hardware_version = db.Column(db.String(50), nullable=True)
    software_version = db.Column(db.String(50), nullable=True)
    serial_number = db.Column(db.String(50), nullable=True)

    eos_date = db.Column(db.Date, nullable=True)
    eol_date = db.Column(db.Date, nullable=True)
    rfs_date = db.Column(db.Date, nullable=True)
    pn_code = db.Column(db.String(50), nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Sfps_Table(db.Model):
    __tablename__ = "sfp_table"
    sfp_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uam_id = db.Column(
        db.Integer,
        ForeignKey("uam_device_table.uam_id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    serial_number = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)

    media_type = db.Column(db.String(50), nullable=True)
    port_name = db.Column(db.String(250), nullable=True)
    port_type = db.Column(db.String(50), nullable=True)
    connector = db.Column(db.String(50), nullable=True)
    mode = db.Column(db.String(50), nullable=True)
    speed = db.Column(db.String(50), nullable=True)
    wavelength = db.Column(db.String(50), nullable=True)
    manufacturer = db.Column(db.String(250), nullable=True)
    optical_direction_type = db.Column(db.String(50), nullable=True)
    pn_code = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(50), nullable=True)
    eos_date = db.Column(db.Date, nullable=True)
    eol_date = db.Column(db.Date, nullable=True)
    rfs_date = db.Column(db.Date, nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class License_Table(db.Model):
    __tablename__ = "license_table"
    license_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uam_id = db.Column(
        db.Integer,
        ForeignKey("uam_device_table.uam_id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    license_name = db.Column(db.String(250), nullable=False)
    status = db.Column(db.String(50), nullable=False)

    license_description = db.Column(db.String(250), nullable=True)
    rfs_date = db.Column(db.Date, nullable=True)
    activation_date = db.Column(db.Date, nullable=True)
    expiry_date = db.Column(db.Date, nullable=True)
    grace_period = db.Column(db.String(10), nullable=True)
    serial_number = db.Column(db.String(50), nullable=True)
    capacity = db.Column(db.String(50), nullable=True)
    usage = db.Column(db.String(50), nullable=True)
    pn_code = db.Column(db.String(50), nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class SNTC_TABLE(db.Model):
    __tablename__ = "sntc_table"
    sntc_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pn_code = db.Column(db.String(50), nullable=False)

    hw_eos_date = db.Column(db.Date, nullable=True)
    hw_eol_date = db.Column(db.Date, nullable=True)
    sw_eos_date = db.Column(db.Date, nullable=True)
    sw_eol_date = db.Column(db.Date, nullable=True)
    manufacturer_date = db.Column(db.Date, nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class APS_TABLE(db.Model):
    __tablename__ = "aps_table"
    ap_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uam_id = db.Column(
        db.Integer,
        ForeignKey("uam_device_table.uam_id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    ap_ip = db.Column(db.String(50), nullable=False)

    ap_name = db.Column(db.String(50), nullable=True)
    serial_number = db.Column(db.String(50), nullable=True)
    ap_model = db.Column(db.String(50), nullable=True)
    hardware_version = db.Column(db.String(50), nullable=True)
    software_version = db.Column(db.String(50), nullable=True)
    description = db.Column(db.String(200), nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
