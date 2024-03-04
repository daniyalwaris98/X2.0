from fastapi import FastAPI
from sqlalchemy import ForeignKey, Column, Boolean, Integer, String, DateTime, Date
from datetime import datetime

from app.core.config import Base
from app.models.users_models import *


class CloudCredentials(Base):
    __tablename__ = "cloud_credentials_table"

    cloud_credential_id = Column(Integer,primary_key=True,autoincrement=True,nullable=False)
    access_key = Column(String(255),nullable=False)
    secret_access_key = Column(String(255),nullable=False)
    account_service_provider = Column(String(255))
    region_name = Column(String(155))
    creation_date = Column(DateTime,default=datetime.now())
    modification_date = Column(DateTime,default=datetime.now())

    user_id = Column(Integer,ForeignKey(
        'user_table.id',ondelete='CASCADE',onupdate="CASCADE")
        )
    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data


class CloudDiscovery(Base):
    __tablename__ = 'cloud_discovery_table'

    cloud_discovery_id = Column(Integer,primary_key=True,autoincrement=True,nullable=False)
    discovered_service_name = Column(String(255),nullable=False)
    running_instance_count = Column(Integer,default=0,nullable=False)
    service_state = Column(String(255))
    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(DateTime, default=datetime.now())

    user_id = Column(Integer, ForeignKey(
        'user_table.id', ondelete='CASCADE', onupdate="CASCADE")
        )

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data



class AwsEc2(Base):
    __tablename__ = 'aws_ec2_table'

    aws_ec2_id = Column(Integer,primary_key=True,autoincrement=True,nullable=False)
    ec2_instance_id =Column(String(256))
    name_by_user = Column(String(256))
    instance_state = Column(String(256))
    instance_id = Column(String(555))
    instance_type = Column(String(255))
    availability_zone = Column(String(255))
    elastic_ip = Column(String(255))
    public_ipv4_address = Column(String(55))
    security_group_name = Column(String(555))
    launch_time = Column(DateTime)
    platform_name = Column(String(255))
    key_name = Column(String(55))

    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(DateTime, default=datetime.now())

    cloud_discovery_id = Column(Integer, ForeignKey(
        'cloud_discovery_table.cloud_discovery_id', ondelete='CASCADE', onupdate='CASCADE'),
                                nullable=False
                                )
    # user_id = Column(Integer, ForeignKey(
    #     'user_table.id', ondelete='CASCADE', onupdate="CASCADE"))

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data







class AWSS3(Base):
    __tablename__ ='aws_s3_table'

    aws_s3_id = Column(Integer,primary_key=True,autoincrement=True,nullable=False)

    bucket_name = Column(String(255))
    region = Column(String(255))
    access = Column(String(255))
    bucket_creation_date = Column(String(255))

    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(DateTime, default=datetime.now())

    cloud_discovery_id = Column(Integer, ForeignKey(
        'cloud_discovery_table.cloud_discovery_id', ondelete='CASCADE', onupdate='CASCADE'),
                                nullable=False
                                )
    user_id = Column(Integer, ForeignKey(
        'user_table.id', ondelete='CASCADE', onupdate="CASCADE"))

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data



class AwsVpcServiceDiscovery(Base):
    __tablename__ = 'aws_vpc_service_discovery_table'

    vpc_service_discovery_id = Column(Integer,primary_key=True,autoincrement=True)
    vpc_count = Column(Integer)
    nat_gateway_count = Column(Integer)
    subnets_count = Column(Integer)
    vpc_peering_connection_count = Column(Integer)
    route_table_count = Column(Integer)
    network_acl_count = Column(Integer)
    internet_gateway_count = Column(Integer)
    security_group_count = Column(Integer)
    virtual_private_gateway_count = Column(Integer)
    site_to_site_vpn_connection_count = Column(Integer)

    cloud_discovery_id = Column(Integer, ForeignKey(
        'cloud_discovery_table.cloud_discovery_id', ondelete='CASCADE', onupdate='CASCADE'),
                                nullable=False
                                )
    user_id = Column(Integer, ForeignKey(
        'user_table.id', ondelete='CASCADE', onupdate="CASCADE"))

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data


class AwsElasticLoadBalancer(Base):
    __tablename__ = 'aws_elastic_load_balancer_table'

    aws_elastic_load_balancer_id = Column(Integer,primary_key=True,autoincrement=True,nullable=False)
    load_balancer_name = Column(String(255))
    vpc_id = Column(String(255))
    virtual_private_gateway = Column(String(255))
    transit_gateway = Column(String(255))
    customer_gateway = Column(String(255))
    state = Column(String(255))
    availability_zones = Column(String(255))
    dns_name = Column(String(255))
    elb_created_date = Column(DateTime)
    type = Column(String(255))
    date_created = Column(DateTime)
    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(DateTime, default=datetime.now())

    user_id = Column(Integer, ForeignKey(
        'user_table.id', ondelete='CASCADE', onupdate="CASCADE")
                     )
    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data
#
#
class AwSecurityGroup(Base):
    __tablename__ = 'aws_security_group_table'

    aws_security_group_id = Column(Integer,primary_key=True,autoincrement=True,nullable=False)
    aws_security_group_name_by_user = Column(String(255))
    security_group_id = Column(String(255))
    security_group_name = Column(String(255))
    vpc_id = Column(String(255))
    owner_id = Column(String(255))
    inbound_rules_count = Column(Integer)
    outbound_rules_count = Column(Integer)
    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(DateTime, default=datetime.now())

    cloud_discovery_id = Column(Integer,ForeignKey(
        'cloud_discovery_table.cloud_discovery_id',ondelete='CASCADE',onupdate='CASCADE'),
        nullable=False
        )
    user_id = Column(Integer, ForeignKey(
        'user_table.id', ondelete='CASCADE', onupdate="CASCADE")
                     )
    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data

class AwsNetworkAcl(Base):
    __tablename__ = 'aws_netowrk_acl_table'

    aws_network_acl_id = Column(Integer,primary_key=True,autoincrement=True,nullable=False)
    network_acl_name_by_user = Column(String(255))
    network_acl_id  =Column(Integer)
    associated_with_count = Column(Integer)
    default_state = Column(Boolean, default=False)
    vpc_id = Column(String(255))
    owner_id = Column(String(255))
    inbound_rules_count = Column(Integer)
    outbound_rules_count = Column(Integer)
    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(DateTime, default=datetime.now())

    cloud_discovery_id = Column(Integer, ForeignKey(
        'cloud_discovery_table.cloud_discovery_id', ondelete='CASCADE', onupdate='CASCADE'),
                                nullable=False
                                )
    user_id = Column(Integer, ForeignKey(
        'user_table.id', ondelete='CASCADE', onupdate="CASCADE")
                     )

#
#     def as_dict(self):
#         data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
#         for key, value in data.items():
#             if isinstance(value, datetime):
#                 data[key] = str(value)
#         return data
#
class AwsPeeringConnection(Base):
    __tablename__ = 'aws_peering_connection_table'

    aws_peering_connection_id = Column(Integer,primary_key=True,autoincrement=True,nullable=False)
    peering_connection_name_by_user = Column(String(255))
    peering_connection_id = Column(Integer)
    status = Column(String(255))
    requestor_vpc = Column(String(255))
    acceptor_vpc = Column(String(255))
    requestor_cidrs = Column(String(255))
    acceptor_cidrs = Column(String(255))
    requestor_owner_id  = Column(String(255))
    acceptor_owner_id  =Column(String(255))
    requestor_region = Column(String(255))
    acceptor_region = Column(String(255))
    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(DateTime, default=datetime.now())

    cloud_discovery_id = Column(Integer, ForeignKey(
        'cloud_discovery_table.cloud_discovery_id', ondelete='CASCADE', onupdate='CASCADE'),
                                nullable=False
        )
    user_id = Column(Integer, ForeignKey(
        'user_table.id', ondelete='CASCADE', onupdate="CASCADE"))


    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data

class AwsNatGateway(Base):
    __tablename__ = 'aws_nat_gateway_table'

    aws_nat_gateway_id = Column(Integer,primary_key=True,autoincrement=True,nullable=False)
    nat_gateway_id = Column(Integer)
    nat_gateway_by_user = Column(String(255))
    connectivity_type =  Column(String(55))
    primary_public_ipv4_address = Column(String(255))
    primary_private_ipv4_address = Column(String(255))
    vpc = Column(String(255))
    subnet_id = Column(Integer)
    created_at = Column(DateTime)
    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(DateTime, default=datetime.now())

    cloud_discovery_id = Column(Integer, ForeignKey(
        'cloud_discovery_table.cloud_discovery_id', ondelete='CASCADE', onupdate='CASCADE'),
                                nullable=False
                                )
    user_id = Column(Integer, ForeignKey(
        'user_table.id', ondelete='CASCADE', onupdate="CASCADE"))
    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data
#
#
class AwsInternetGateway(Base):
    __tablename__ = 'aws_internet_gateway_table'

    aws_internet_gateway_id = Column(Integer,primary_key=True,autoincrement=True,nullable=False)
    internet_gateway_name_by_user = Column(String(255))
    internet_gateway_id = Column(Integer)
    state = Column(String(55))
    connectivity = Column(String(55))
    vpc_id = Column(String(255))
    owner_id = Column(String(255))

    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(DateTime, default=datetime.now())

    cloud_discovery_id = Column(Integer, ForeignKey(
        'cloud_discovery_table.cloud_discovery_id', ondelete='CASCADE', onupdate='CASCADE'),
                                nullable=False
                                )
    user_id = Column(Integer, ForeignKey(
        'user_table.id', ondelete='CASCADE', onupdate="CASCADE"))

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data


class AwsRouteTable(Base):
    __tablename__ = 'aws_route_table'

    rout_id = Column(Integer, primary_key=True,autoincrement=True)
    name = Column(String(255))
    route_table_id = Column(String(255), unique=True)
    main = Column(String(255))
    vpc_id = Column(String(255))
    owner_id = Column(Integer)

    creation_date = Column(DateTime, default=datetime.now())
    modification_date = Column(DateTime, default=datetime.now())

    cloud_discovery_id = Column(Integer, ForeignKey(
        'cloud_discovery_table.cloud_discovery_id', ondelete='CASCADE', onupdate='CASCADE'),
                                nullable=False
    )
    user_id = Column(Integer, ForeignKey(
        'user_table.id', ondelete='CASCADE', onupdate="CASCADE"))

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data