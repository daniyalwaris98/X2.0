from sqlalchemy import ForeignKey,Column,Boolean,String,Integer,DateTime,Date
from datetime import datetime
from app.core.config import Base
from app.models.atom_models import AtomTable


class IpamDevicesFetchTable(Base):
    __tablename__ = "ipam_devices_fetch_table"
    ipam_device_id = Column(Integer,primary_key=True,autoincrement=True)
    interface = Column(String(150),nullable=True)
    interface_ip = Column(String(156),nullable=True)
    interface_description = Column(String(256),nullable=True)
    virtual_ip = Column(String(256),nullable=True)
    vlan = Column(String(256),nullable=True)
    vlan_number = Column(String(256),nullable=True)
    interface_status = Column(String(256),nullable = True)
    fetch_date = Column(DateTime,defualt = '2000-0-0',nullable = True)
    user_id = Column(Integer,nullable=True)

    atom_id = Column(Integer,ForeignKey(
        "atom_table.atom_id",ondelete="CASCAADE",
        onupdate="CASCADE",

    ),
    nullable=False
    )

    def as_dict(self):
        data = {c.name:getattr(self,c.name) for c in self.__table__.columns}
        for key,value in data.items():
            if isinstance(value,datetime):
                data[key] = str(value)
        return data


class IpTable(Base):
    __tablename__ = 'ip_table'
    ip_id = Column(Integer,primary_key=True,autoincrement=True)
    mac_address = Column(String(256),nullable=True)
    status = Column(String(256),nullable=True)
    vip = Column(String(256),nullable=True)
    asset_tag = Column(String(256),nullable=True)
    configuration_switch = Column(String(256),nullable=True)
    configuration_interface = Column(String(256),nullable=True)
    open_ports = Column(String(256),nullable=True)
    ip_dns = Column(String(256),nullable=True)
    dns_ip =  Column(String(256),nullable=True)
    user_id = Column(Integer,nullable=True)
    atom_id = Column(Integer,
        ForeignKey(
            'atom_table.aatom_id',
            ondelete='CASCADE',
            onupdate='CASCADE'
        ),
        nullable =False
    )
    creation_date = Column(DateTime,default=datetime.now())
    modification_date = Column(DateTime,default=datetime.now())

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data


class subnet_table(Base):
    __tablename__ = 'subnet_table'
    subnet_id = Column(Integer,primary_key=True,autoincrement=True)
    subnet_address = Column(String(256),nullable=True)
    subnet_mask = Column(String(356),nullable=True)
    subnet_name = Column(String(256),nullable=True)
    location = Column(String(256),nulllable=True)
    discovered_from = Column(String(256),nulllable = True)
    user_id = Column(Integer,nullable=True)

    ipam_device_id = Column(Integer,
        ForeignKey('ipam_devices_fetch_table.ipam_device_id',
                   ondelete='CASCADE',
                   onupdate='CASCADE'
                   ),
    nullable=False
    )

    ip_id = Column(Integer,
        ForeignKey('ip_table.ip_id',
                   ondelete='CASCADE',
                   onupdate='CASCADE'
                   ),
                   nullable=False
                   )

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data


class subnet_usage_table(Base):
    __tablename__ = 'subent_usage_table'
    subnet_usage_id = Column(Integer,primary_key=True,autoincrement=True)
    subnet_usage = Column(String(256),nullable=True)
    subnet_size = Column(String(256),nullable=True)
    subnet_id = Column(
        Integer,
        ForeignKey('subnet_table.subnet_id',
                   ondelete='CASCADE',
                   onupdate='CASCADE'
                   ),
        nullable=False
    )
    creation_date = Column(DateTime,default=datetime.now())
    modification_date = Column(DateTime,default=datetime.now())

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data

class ip_interface_table(Base):
    __tablename__ = 'ip_interface_table'
    ip_interface_id = Column(Integer,primary_key=True,autoincrement=True)
    interface_ip = Column(String(256),nullable=True)
    interface_location = Column(String(256),nullable = True)
    discovered_from = Column(String(256),nullable=True)

    ip_id = Column(Integer,
                   ForeignKey('ip_table.ip_id',ondelete='CASCADE',onupdate='CASCADE')
                   ,nullable=False
                   )

    creation_date = Column(DateTime,default=datetime.now())
    modification_date = Column(DateTime,default=datetime.now())

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data

class DnsServerTable(Base):
    __tablename__ = 'dns_server_table'
    dns_server_id = Column(Integer,primary_key=True,autoincrement=True)
    server_name = Column(String(256),nullable=True)
    type = Column(String(256),nullable=True)
    status = Column(String(256),nullable = True)
    number_of_zones = Column(Integer,nullable=True)
    user_id = Column(Integer,nullable=True)

    creation_date = Column(DateTime,defualt = datetime.now())
    modification_date = Column(DateTime,defualt = datetime.now() )

    ip_table = Column(Integer,
                      ForeignKey('ip_table.ip_id',ondelete='CASCADE',onupdate='CASCADE')
                      ,nullable=False
                      )

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data

class DnsZonesTable(Base):
    __tablename__ = 'dns_zones'
    dns_zone_id = Column(Integer,primary_key=True,autoincrement=True)
    zone_name = Column(String(256),nullable=True)
    zone_type = Column(String(256),nullable=True)
    lookup_type = Column(String(256),nullable=True)
    zone_status = Column(String(256),nullable=True)
    dns_server_id = Column(Integer,
                           ForeignKey('')
                           )
    creation_date = Column(DateTime,defualt = datetime.now())
    modification_date = Column(DateTime,defualt = datetime.now())
    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data


class DnsRecordTable(Base):
    __tablename__ = 'dns_record_table'
    dns_record_id = Column(Integer,primary_key=True,autoincrement=True)
    server_name = Column(String(256),nullable=True)
    server_ip = Column(String(256),nullable=True)
    dns_zone_id = Column(Integer,
                         ForeignKey('dns_zone_table.dns_zone_id',ondelete='CASCADE',onupdate='CASCADE')
                         ,nullable=False
                         )
    creation_date = Column(DateTime,defualt = datetime.now())
    modification_date = Column(DateTime,defualt = datetime.now())

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data


