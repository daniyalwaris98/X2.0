from datetime import datetime
from app.schema.base_schema import *

class Response200(BaseSchema):
    data: dict
    message: str

class DeleteResponseSchema(BaseSchema):
    data: dict
    success: int
    error: int
    success_list: list[str]
    error_list: list[str]

class GetAtomInIpamSchema(BaseSchema):
    atom_id:int
    ip_address:str
    device_name:str | None = None
    function:str | None = None
    vendor:str | None = None

class AddAtomInIpamSchema(BaseSchema):
    atom_id:int

class AddSubnetManually(BaseSchema):
    subnet:str
    subnet_mask:str
    subnet_name:str | None = None
    location:str | None = None

class AddSubnetInSubnetSchema(BaseSchema):
    subnet:str


class GetIpBySubnetSchema(BaseSchema):
    subnet:str

class IpHistoryBySubnetSchema(BaseSchema):
    ip_id:int
    mac_address:str | None = None
    status:str | None = None
    vip:str
    asset_tag:str
    configuration_switch:str
    configuration_interface:str
    open_ports:str
    ip_dns:str
    dns_ip:str
    creation_date:datetime
    modification_date:datetime
    ip_address:str
    subnet:str

class DiscoveredSubnetSchema(BaseSchema):
    subnet_id:int
    subnet:str
    subnet_mask:str
    subnet_name:str
    location:str
    discovered_from:str
    subnet_usage:str
    subnet_size:str

class AddDnsSchema(BaseSchema):
    ip_address:str
    server_name:str
    username:str
    password:str

class GetallDnsServers(BaseSchema):
    dns_server_id : int
    server_name:str
    number_of_zones:str
    type:str
class getDnsZones(BaseSchema):
    dns_id:int
    zone_name:str
    zone_status:str
    zone_type:str
    lookup_type:str

class GetDnsRecoed(BaseSchema):
    dns_record_id:int
    server_name:str
    server_ip:str