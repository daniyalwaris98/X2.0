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
