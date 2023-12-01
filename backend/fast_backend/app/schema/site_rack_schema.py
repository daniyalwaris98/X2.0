from datetime import datetime

from app.schema.base_schema import *


class AddSiteRequestSchema(BaseSchema):
    site_name: str
    status: str

    region_name: str | None = None
    latitude: str | None = None
    longitude: str | None = None
    city: str | None = None


class EditSiteRequestSchema(AddSiteRequestSchema):
    site_id: int


class GetSiteResponseSchema(EditSiteRequestSchema):
    creation_date: str
    modification_date: str

class GetTotalRacksSchema(BaseSchema):
    name: str
    value: int


class RackLeafLetSchema(BaseSchema):
    longitude: str
    latitude: str

class TopRacksSchema(BaseSchema):
    name: str
    value: int

class AddRackRequestSchema(BaseSchema):
    rack_name: str
    site_name: str
    status: str
    manufacture_date: constr(regex=r"\d{4}-\d{2}-\d{2}")  # Date format: YYYY-MM-DD
    rfs_date: constr(regex=r"\d{4}-\d{2}-\d{2}")
    serial_number: str | None = None
    # manufacture_date: datetime | None = None
    unit_position: str | None = None
    ru: int | None = None
    # rfs_date: datetime | None = None
    height: int | None = None
    width: int | None = None
    depth: int | None = None
    pn_code: str | None = None
    rack_model: str | None = None
    floor: str | None = None


class EditRackRequestSchema(AddRackRequestSchema):
    rack_id: int


class GetRackResponseSchema(EditRackRequestSchema):
    creation_date: str
    modification_date: str


class GetRackBySiteRequestSchema(BaseSchema):
    site_name: str


class GetRackByRackNameRequestSchema(BaseSchema):
    rackname: str
