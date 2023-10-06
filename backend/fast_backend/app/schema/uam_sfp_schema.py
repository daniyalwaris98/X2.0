from datetime import datetime

from app.schema.base_schema import BaseSchema


class GetSfpResponseSchema(BaseSchema):
    sfp_id: int
    uam_id: int
    device_name: str
    status: str
    serial_number: str

    media_type: str | None = None
    port_name: str | None = None
    port_type: str | None = None
    connector: str | None = None
    mode: str | None = None
    speed: str | None = None
    wavelength: str | None = None
    optical_direction_type: str | None = None
    pn_code: str | None = None
    eos_date: datetime | None = None
    eol_date: datetime | None = None
    rfs_date: datetime | None = None

    creation_date: datetime
    modification_date: datetime

