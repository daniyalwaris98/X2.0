from app import db
from sqlalchemy import ForeignKey
from datetime import datetime


class Password_Group_Table(db.Model):
    __tablename__ = "password_group_table"
    password_group = db.Column(db.String(50), primary_key=True)
    username = db.Column(db.String(50))
    password = db.Column(db.String(50))
    secret_password = db.Column(db.String(50))
    password_group_type = db.Column(db.String(50))

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Site_Table(db.Model):
    __tablename__ = "site_table"
    site_id = db.Column(db.Integer, primary_key=True)
    site_name = db.Column(db.String(50))
    region_name = db.Column(db.String(50))
    latitude = db.Column(db.String(70))
    longitude = db.Column(db.String(70))
    city = db.Column(db.String(50))
    status = db.Column(db.String(50))
    total_count = db.Column(db.Integer)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Rack_Table(db.Model):
    __tablename__ = "rack_table"
    rack_id = db.Column(db.Integer, primary_key=True)
    rack_name = db.Column(db.String(50))
    site_id = db.Column(db.Integer, ForeignKey("site_table.site_id"))
    serial_number = db.Column(db.String(50))
    manufacturer_date = db.Column(db.Date, default=datetime(2000, 1, 1))
    unit_position = db.Column(db.String(20))
    status = db.Column(db.String(50))
    ru = db.Column(db.String(50))
    rfs_date = db.Column(db.Date, default=datetime(2000, 1, 1))
    height = db.Column(db.Integer)
    width = db.Column(db.Integer)
    depth = db.Column(db.Integer)
    pn_code = db.Column(db.String(50))
    rack_model = db.Column(db.String(50))
    floor = db.Column(db.String(50))
    total_count = db.Column(db.Integer)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Atom_Table(db.Model):
    __tablename__ = "atom_table"
    atom_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rack_id = db.Column(db.Integer, ForeignKey("rack_table.rack_id"))
    device_name = db.Column(db.String(50))
    ip_address = db.Column(db.String(50))
    device_ru = db.Column(db.String(50))
    department = db.Column(db.String(50))
    section = db.Column(db.String(50))
    criticality = db.Column(db.String(20))
    function = db.Column(db.String(50))
    domain = db.Column(db.String(50))
    virtual = db.Column(db.String(20))
    device_type = db.Column(db.String(50))
    password_group = db.Column(
        db.String(50), ForeignKey("password_group_table.password_group")
    )
    onboard_status = db.Column(db.String(50))
    scop = db.Column(db.String(50), default="Atom")
    
    vendor = db.Column(db.String(50))

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Atom_Transition_Table(db.Model):
    __tablename__ = "atom_transition_table"
    atom_transition_id = db.Column(db.Integer, primary_key=True)
    site_name = db.Column(db.String(50))
    rack_name = db.Column(db.String(50))
    device_name = db.Column(db.String(50))
    ip_address = db.Column(db.String(50))
    vendor = db.Column(db.String(50))
    device_ru = db.Column(db.String(50))
    department = db.Column(db.String(50))
    section = db.Column(db.String(50))
    criticality = db.Column(db.String(20))
    function = db.Column(db.String(50))
    domain = db.Column(db.String(50))
    virtual = db.Column(db.String(20))
    device_type = db.Column(db.String(50))
    password_group = db.Column(db.String(50))
    onboard_status = db.Column(db.String(50))

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
