from app import db
from sqlalchemy import ForeignKey
from datetime import datetime



class Monitoring(db.Model):
    __tablename__ = 'monitoring_table'
    device_id = db.Column(db.Integer, primary_key=True)
    device_ip = db.Column(db.String(50))
    device_type = db.Column(db.String(50))
    community = db.Column(db.String(50))
    snmp_version = db.Column(db.String(50))
    auth_protocol = db.Column(db.String(50))
    encryp_protocol = db.Column(db.String(50))
    status = db.Column(db.String(50))
 

