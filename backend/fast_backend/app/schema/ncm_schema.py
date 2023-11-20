from datetime import datetime

from app.schema.atom_schema import AddAtomRequestSchema, GetAtomResponseSchema, BaseSchema


class NcmDeviceId(BaseSchema):
    ncm_device_id: int


class AddNcmRequestSchema(AddAtomRequestSchema):
    status: str


class EditNcmRequestSchema(AddNcmRequestSchema):
    ncm_device_id: int
    atom_id: int
    status: str


class GetAllNcmResponseSchema(GetAtomResponseSchema):
    ncm_device_id: int
    status: str
    backup_status: str | None = None
    password_group: str


class GetAtomInNcmResponseSchema(BaseSchema):
    atom_id: int
    ip_address: str
    device_name: str
    device_type: str
    password_group: str
    vendor: str | None = None
    function: str


class NcmAlarmSchema(BaseSchema):
    ip_address: str
    device_name: str
    alarm_category: str
    alarm_title: str
    alarm_description: str
    alarm_status: str
    creation_date: datetime
    modification_date: datetime
    resolve_remarks: str | None
    mail_status: str


class NcmConfigHistorySchema(BaseSchema):
    ncm_history_id: int
    date: datetime
    file_name: str


class SendCommandRequestSchema(NcmDeviceId):
    cmd: str
