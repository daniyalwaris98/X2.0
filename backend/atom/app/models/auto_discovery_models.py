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
    discovery_id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String(50))
    subnet = db.Column(db.String(50))
    os_type = db.Column(db.String(500))
    make_model = db.Column(db.String(500))
    function = db.Column(db.String(500))
    vendor = db.Column(db.String(500))
    snmp_status = db.Column(db.String(50))
    snmp_version = db.Column(db.String(50))

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Auto_Discovery_Network_Table(db.Model):
    __tablename__ = "auto_discovery_network_table"
    network_id = db.Column(db.Integer, primary_key=True)
    network_name = db.Column(db.String(50))
    subnet = db.Column(db.String(50))
    no_of_devices = db.Column(db.Integer, default=0)
    scan_status = db.Column(db.String(50), default="InActive")
    excluded_ip_range = db.Column(db.String(200), default="0")

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

