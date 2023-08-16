from app import db
from sqlalchemy import ForeignKey
from datetime import datetime


class Password_Group_Table(db.Model):
    __tablename__ = "password_group_table"
    password_group_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    password_group = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), nullable=True)
    password = db.Column(db.String(50), nullable=True)
    secret_password = db.Column(db.String(50), nullable=True)
    password_group_type = db.Column(db.String(50), nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Site_Table(db.Model):
    __tablename__ = "site_table"
    site_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    site_name = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)

    region_name = db.Column(db.String(50), nullable=True)
    latitude = db.Column(db.String(70), default="", nullable=True)
    longitude = db.Column(db.String(70), default="", nullable=True)
    city = db.Column(db.String(50), nullable=True)
    total_count = db.Column(db.Integer, nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Rack_Table(db.Model):
    __tablename__ = "rack_table"
    rack_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    site_id = db.Column(
        db.Integer,
        ForeignKey("site_table.site_id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
    )

    rack_name = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)

    serial_number = db.Column(db.String(50), nullable=True)
    manufacturer_date = db.Column(db.Date, default=datetime(2000, 1, 1), nullable=True)
    unit_position = db.Column(db.String(20), nullable=True)
    ru = db.Column(db.String(50), nullable=True)
    rfs_date = db.Column(db.Date, default=datetime(2000, 1, 1), nullable=True)
    height = db.Column(db.Integer, nullable=True)
    width = db.Column(db.Integer, nullable=True)
    depth = db.Column(db.Integer, nullable=True)
    pn_code = db.Column(db.String(50), nullable=True)
    rack_model = db.Column(db.String(50), nullable=True)
    floor = db.Column(db.String(50), nullable=True)
    total_count = db.Column(db.Integer, nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Atom_Table(db.Model):
    __tablename__ = "atom_table"
    atom_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rack_id = db.Column(
        db.Integer,
        ForeignKey("rack_table.rack_id", ondelete="SET DEFAULT", onupdate="CASCADE"),
        nullable=True,
        default=1,
    )
    password_group_id = db.Column(
        db.Integer,
        ForeignKey(
            "password_group_table.password_group_id",
            ondelete="SET DEFAULT",
            onupdate="CASCADE",
        ),
        nullable=True,
    )

    device_name = db.Column(db.String(50), nullable=False)
    ip_address = db.Column(db.String(50), nullable=False)
    device_type = db.Column(db.String(50), nullable=False)
    function = db.Column(db.String(50), nullable=False)

    vendor = db.Column(db.String(50))
    device_ru = db.Column(db.String(50), nullable=True)
    department = db.Column(db.String(50), nullable=True)
    section = db.Column(db.String(50), nullable=True)
    criticality = db.Column(db.String(20), nullable=True)
    domain = db.Column(db.String(50), nullable=True)
    virtual = db.Column(db.String(20), nullable=True)
    onboard_status = db.Column(db.String(50), default="False", nullable=True)
    scop = db.Column(db.String(50), default="Atom", nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Atom_Transition_Table(db.Model):
    __tablename__ = "atom_transition_table"
    atom_transition_id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String(50), nullable=False)
    site_name = db.Column(db.String(50), nullable=True)
    rack_name = db.Column(db.String(50), nullable=True)
    device_name = db.Column(db.String(50), nullable=True)
    vendor = db.Column(db.String(50), nullable=True)
    device_ru = db.Column(db.String(50), nullable=True)
    department = db.Column(db.String(50), nullable=True)
    section = db.Column(db.String(50), nullable=True)
    criticality = db.Column(db.String(20), nullable=True)
    function = db.Column(db.String(50), nullable=True)
    domain = db.Column(db.String(50), nullable=True)
    virtual = db.Column(db.String(20), nullable=True)
    device_type = db.Column(db.String(50), nullable=True)
    password_group = db.Column(db.String(50), nullable=True)
    onboard_status = db.Column(db.String(50), nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
