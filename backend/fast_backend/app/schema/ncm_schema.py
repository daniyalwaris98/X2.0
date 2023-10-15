from app.schema.atom_schema import AddAtomRequestSchema, GetAtomResponseSchema, BaseSchema


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
