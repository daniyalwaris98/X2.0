from app import db
from sqlalchemy import ForeignKey
from datetime import datetime

#
#
#

# ** Auto Discovery Models **

#
#
#


class Auto_Discovery_Table(db.Model):
    __tablename__ = "auto_discovery_table"
    discovery_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ip_address = db.Column(db.String(50), nullable=False)
    subnet = db.Column(db.String(50), nullable=False)
    os_type = db.Column(db.String(500), nullable=True)
    make_model = db.Column(db.String(500), nullable=True)
    function = db.Column(db.String(500), nullable=True)
    vendor = db.Column(db.String(500), nullable=True)
    snmp_status = db.Column(db.String(50), nullable=True)
    snmp_version = db.Column(db.String(50), nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Auto_Discovery_Network_Table(db.Model):
    __tablename__ = "auto_discovery_network_table"
    network_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    network_name = db.Column(db.String(50), nullable=False)
    subnet = db.Column(db.String(50), nullable=False)
    no_of_devices = db.Column(db.Integer, default=0, nullable=True)
    scan_status = db.Column(db.String(50), default="InActive", nullable=False)
    excluded_ip_range = db.Column(db.String(200), default="0", nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

