from app import db
from sqlalchemy import ForeignKey
from datetime import datetime

from app.models.atom_models import *


class Monitoring_Credentails_Table(db.Model):
    __tablename__ = "monitoring_credentials_table"
    monitoring_credentials_id = db.Column(db.Integer, primary_key=True)
    
    category = db.Column(db.String(100))
    credentials = db.Column(db.String(100))
    profile_name = db.Column(db.String(250))
    description = db.Column(db.String(250))
    snmp_read_community = db.Column(db.String(50))
    snmp_port = db.Column(db.String(100))
    username = db.Column(db.String(100))
    password = db.Column(db.String(100))
    encryption_password = db.Column(db.String(100))
    authentication_method = db.Column(db.String(50))
    encryption_method = db.Column(db.String(50))
    
    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Monitoring_Devices_Table(db.Model):
    __tablename__ = "monitoring_devices_table"
    monitoring_device_id = db.Column(db.Integer, primary_key=True)
    atom_id = db.Column(db.Integer, ForeignKey("atom_table.atom_id"))

    source = db.Column(db.String(50))
    vendor = db.Column(db.String(50))
    active = db.Column(db.String(50))
    ping_status = db.Column(db.String(40))
    snmp_status = db.Column(db.String(40))
    active_id = db.Column(db.String(80))
    device_heatmap = db.Column(db.String(40))

    monitoring_credentials_id = db.Column(
        db.Integer, ForeignKey("monitoring_credentials_table.monitoring_credentials_id")
    )
    
    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}



class Monitoring_Alerts_Table(db.Model):
    __tablename__ = 'monitoring_alerts_table'
    monitoring_alert_id = db.Column(db.Integer, primary_key=True)
    monitoring_device_id = db.Column(db.Integer, ForeignKey('monitoring_devices_table.monitoring_device_id'))
    
    description = db.Column(db.String(2000))
    alert_type = db.Column(db.String(50))
    category = db.Column(db.String(50))
    alert_status = db.Column(db.String(50))
    mail_status = db.Column(db.String(50))
    start_date = db.Column(db.DateTime, default=datetime.now())
    
    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )
    
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

