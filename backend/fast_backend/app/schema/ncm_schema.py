from app.schema.atom_schema import AddAtomRequestSchema, GetAtomResponseSchema


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
