from app import db
from sqlalchemy import ForeignKey
from datetime import datetime


class Monitoring_Credentails_Table(db.Model):
    __tablename__ = "monitoring_credentials_table"
    monitoring_credentials_id = db.Column(
        db.Integer, primary_key=True, autoincrement=True
    )

    profile_name = db.Column(db.String(250), nullable=False)
    category = db.Column(db.String(100), nullable=False)

    credentials = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(250), nullable=True)
    snmp_read_community = db.Column(db.String(50), nullable=True)
    snmp_port = db.Column(db.String(100), nullable=True)
    username = db.Column(db.String(100), nullable=True)
    password = db.Column(db.String(100), nullable=True)
    encryption_password = db.Column(db.String(100), nullable=True)
    authentication_method = db.Column(db.String(50), nullable=True)
    encryption_method = db.Column(db.String(50), nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Monitoring_Devices_Table(db.Model):
    __tablename__ = "monitoring_devices_table"
    monitoring_device_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    atom_id = db.Column(
        db.Integer,
        ForeignKey("atom_table.atom_id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    source = db.Column(db.String(50), nullable=True)
    active = db.Column(db.String(50), nullable=True)
    ping_status = db.Column(db.String(40), nullable=True)
    snmp_status = db.Column(db.String(40), nullable=True)
    active_id = db.Column(db.String(80), nullable=True)
    device_heatmap = db.Column(db.String(40), nullable=True)

    monitoring_credentials_id = db.Column(
        db.Integer,
        ForeignKey(
            "monitoring_credentials_table.monitoring_credentials_id",
            ondelete="SET NULL",
            onupdate="CASCADE",
        ),
        nullable=True,
    )

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Monitoring_Alerts_Table(db.Model):
    __tablename__ = "monitoring_alerts_table"
    monitoring_alert_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    monitoring_device_id = db.Column(
        db.Integer,
        ForeignKey(
            "monitoring_devices_table.monitoring_device_id",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        nullable=False,
    )

    description = db.Column(db.String(2000), nullable=True)
    alert_type = db.Column(db.String(50), nullable=True)
    category = db.Column(db.String(50), nullable=True)
    alert_status = db.Column(db.String(50), nullable=True)
    mail_status = db.Column(db.String(50), nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Alert_Cpu_Threshold_Table(db.Model):
    __tablename__ = "alert_cpu_threshold_table"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    ip_address = db.Column(db.String(100), nullable=False)
    low_threshold = db.Column(db.Integer, nullable=True)
    medium_threshold = db.Column(db.Integer, nullable=True)
    critical_threshold = db.Column(db.Integer, nullable=True)
    pause_min = db.Column(db.Integer, nullable=True)
    alert_active = db.Column(db.String(20), default='Active', nullable=False)
    

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Alert_Memory_Threshold_Table(db.Model):
    __tablename__ = "alert_memory_threshold_table"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ip_address = db.Column(db.String(100), nullable=False)
    low_threshold = db.Column(db.Integer, nullable=True)
    medium_threshold = db.Column(db.Integer, nullable=True)
    critical_threshold = db.Column(db.Integer, nullable=True)
    pause_min = db.Column(db.Integer, nullable=True)
    alert_active = db.Column(db.String(20), default='Active', nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
