from datetime import datetime

from app.schema.base_schema import BaseSchema, SummeryResponseSchema


class AddDiscoveryNetworkRequestSchema(BaseSchema):
    network_name: str
    subnet: str
    scan_status: str | None = None
    excluded_ip_range: str | None = None


class EditDiscoveryNetworkRequestSchema(BaseSchema):
    network_id: int
    network_name: str
    subnet: str
    scan_status: str | None = None
    excluded_ip_range: str | None = None


class GetDiscoveryNetworkResponseSchema(EditDiscoveryNetworkRequestSchema):
    no_of_devices: int | None = None
    creation_date: datetime
    modification_date: datetime


class DiscoveryFunctionCountResponseSchema(BaseSchema):
    devices: int
    firewall: int
    router: int
    switch: int
    other: int


class GetFunctionDiscoveryDataRequestSchema(BaseSchema):
    subnet: str
    function: str


class GetDiscoveryDataResponseSchema(BaseSchema):
    discovery_id: int
    ip_address: str
    subnet: str
    os_type: str | None = None
    make_model: str | None = None
    function: str | None = None
    vendor: str | None = None
    snmp_status: str | None = None
    snmp_version: str | None = None
    ssh_status: str | None = None

    creation_date: datetime
    modification_date: datetime


class AutoDiscoveryFunctionCountResponseSchema(BaseSchema):
    switches: int
    firewalls: int
    routers: int
    others: int
