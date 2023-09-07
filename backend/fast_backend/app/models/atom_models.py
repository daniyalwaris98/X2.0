from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import ForeignKey, Column, Boolean, Integer, String, DateTime, Date
from datetime import datetime

Base = declarative_base()


class PasswordGroupTable(Base):
    __tablename__ = "password_group_table"
    password_group_id = Column(Integer, primary_key=True, autoincrement=True)
    password_group = Column(String(50), nullable=False)
    username = Column(String(50), nullable=True)
    password = Column(String(50), nullable=True)
    secret_password = Column(String(50), nullable=True)
    password_group_type = Column(String(50), nullable=True)

    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(
        DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class SiteTable(Base):
    __tablename__ = "site_table"
    site_id = Column(Integer, primary_key=True, autoincrement=True)

    site_name = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False)

    region_name = Column(String(50), nullable=True, default="N/A")
    latitude = Column(String(70), nullable=True, default="0")
    longitude = Column(String(70), nullable=True, default="0")
    city = Column(String(50), nullable=True, default="N/A")

    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(
        DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class RackTable(Base):
    __tablename__ = "rack_table"

    rack_id = Column(Integer, primary_key=True, autoincrement=True)
    site_id = Column(
        Integer,
        ForeignKey("site_table.site_id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
    )

    rack_name = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False)

    serial_number = Column(String(50), nullable=True, default="N/A")
    manufacture_date = Column(Date, default=datetime(2000, 1, 1), nullable=True)
    unit_position = Column(String(20), nullable=True, default="N/A")
    ru = Column(String(50), nullable=True, default="N/A")
    rfs_date = Column(Date, default=datetime(2000, 1, 1), nullable=True)
    height = Column(Integer, nullable=True, default=0)
    width = Column(Integer, nullable=True, default=0)
    depth = Column(Integer, nullable=True, default=0)
    pn_code = Column(String(50), nullable=True, default="N/A")
    rack_model = Column(String(50), nullable=True, default="N/A")
    floor = Column(String(50), nullable=True, default="N/A")

    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(
        DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class AtomTable(Base):
    __tablename__ = "atom_table"

    atom_id = Column(Integer, primary_key=True, autoincrement=True)
    rack_id = Column(
        Integer,
        ForeignKey("rack_table.rack_id", ondelete="SET DEFAULT", onupdate="CASCADE"),
        nullable=True,
        default=1,
    )
    password_group_id = Column(
        Integer,
        ForeignKey(
            "password_group_table.password_group_id",
            ondelete="SET DEFAULT",
            onupdate="CASCADE",
        ),
        nullable=True,
    )

    device_name = Column(String(50), nullable=False)
    ip_address = Column(String(50), nullable=False)
    device_type = Column(String(50), nullable=False)
    function = Column(String(50), nullable=False)

    vendor = Column(String(50))
    device_ru = Column(Integer, nullable=True)
    department = Column(String(50), nullable=True)
    section = Column(String(50), nullable=True)
    criticality = Column(String(20), nullable=True)
    domain = Column(String(50), nullable=True)
    virtual = Column(String(20), nullable=True)
    onboard_status = Column(Boolean, default="False", nullable=True)
    scop = Column(String(50), default="Atom", nullable=True)

    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(
        DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class AtomTransitionTable(Base):
    __tablename__ = "atom_transition_table"

    atom_transition_id = Column(Integer, primary_key=True)
    ip_address = Column(String(50), nullable=False)
    site_name = Column(String(50), nullable=True)
    rack_name = Column(String(50), nullable=True)
    device_name = Column(String(50), nullable=True)
    vendor = Column(String(50), nullable=True)
    device_ru = Column(String(50), nullable=True)
    department = Column(String(50), nullable=True)
    section = Column(String(50), nullable=True)
    criticality = Column(String(20), nullable=True)
    function = Column(String(50), nullable=True)
    domain = Column(String(50), nullable=True)
    virtual = Column(String(20), nullable=True)
    device_type = Column(String(50), nullable=True)
    password_group = Column(String(50), nullable=True)
    onboard_status = Column(String(50), nullable=True)

    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(
        DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
