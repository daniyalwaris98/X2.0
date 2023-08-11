from app import db
from sqlalchemy import ForeignKey
from datetime import datetime
from app.models.atom_models import *




# ** NCM Models **






class NCM_Device_Table(db.Model):
    __tablename__ = "ncm_device_table"
    ncm_device_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    atom_id = db.Column(db.Integer, ForeignKey("atom_table.atom_id", ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    
    status = db.Column(db.String(50), default='InActive', nullable=False)
    config_change_date = db.Column(db.DateTime, nullable=True)
    backup_status = db.Column(db.Boolean, nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class NCM_History_Table(db.Model):
    __tablename__ = "ncm_history_table"
    ncm_history_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ncm_device_id = db.Column(db.Integer, ForeignKey("ncm_device_table.ncm_device_id", ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    
    file_name = db.Column(db.String(500), nullable=False)
    configuration_date = db.Column(db.DateTime, default=datetime.now(), nullable=False)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}



class NCM_Alarm_Table(db.Model):
    __tablename__ = "ncm_alarm_table"
    
    ncm_alarm_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ncm_device_id = db.Column(db.Integer, ForeignKey("ncm_device_table.ncm_device_id", ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    
    alarm_category = db.Column(db.String(50), nullable=False)
    alarm_title = db.Column(db.String(200), nullable=False)
    alarm_description = db.Column(db.String(500), nullable=False)
    alarm_status = db.Column(db.String(50), default='Open', nullable=False)
    mail_status = db.Column(db.String(50), default='no', nullable=False)
    resolve_remarks = db.Column(db.String(500), nullable=True)
    
    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
