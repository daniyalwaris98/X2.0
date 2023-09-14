from app.schema.base_schema import *


class AddAtomRequestSchema(BaseModel):
    def __getitem__(self, key):
        return getattr(self, key, None)

    def __setitem__(self, key, value):
        return setattr(self, key, value)

    ip_address: str

    device_name: str | None = None
    device_type: str | None = None
    function: str | None = None
    site_name: str | None = None
    rack_name: str | None = None
    password_group: str | None = None

    vendor: str | None = None
    device_ru: int | None = None
    department: str | None = None
    section: str | None = None
    criticality: str | None = None
    domain: str | None = None
    virtual: str | None = None


class EditAtomRequestSchema(AddAtomRequestSchema):
    def __getitem__(self, key):
        return getattr(self, key, None)

    def __setitem__(self, key, value):
        return setattr(self, key, value)

    atom_id: int | None = None
    atom_transition_id: int | None = None


class GetAtomResponseSchema(BaseModel):
    def __getitem__(self, key):
        return getattr(self, key, None)

    def __setitem__(self, key, value):
        return setattr(self, key, value)

    atom_id: int = Field(None, title="Atom ID", description="ID for Atom Record")
    atom_transition_id: int = Field(None, title="Transition Atom ID", description="ID for Transition Atom Record")
    ip_address: str
    status: int
    message: str

    device_name: str | None = None
    device_type: str | None = None
    function: str | None = None
    site_name: str | None = None
    rack_name: str | None = None
    password_group: str | None = None

    vendor: str | None = None
    device_ru: int | None = None
    department: str | None = None
    section: str | None = None
    criticality: str | None = None
    domain: str | None = None
    virtual: str | None = None
    onboard_status: bool | None = None

    creation_date: str
    modification_date: str


class DeleteAtomRequestSchema(BaseModel):
    def __getitem__(self, key):
        return getattr(self, key, None)

    def __setitem__(self, key, value):
        return setattr(self, key, value)

    atom_id: int | None = None
    atom_transition_id: int | None = None


class PasswordGroupTypeEnum(str, Enum):
    ssh = "SSH"
    telnet = "Telnet"


class AddPasswordGroupRequestSchema(BaseModel):
    def __getitem__(self, key):
        return getattr(self, key, None)

    def __setitem__(self, key, value):
        return setattr(self, key, value)

    password_group: str
    username: str
    password: str
    secret_password: str | None = None
    password_group_type: PasswordGroupTypeEnum


class GetPasswordGroupResponseSchema(BaseModel):
    def __getitem__(self, key):
        return getattr(self, key, None)

    def __setitem__(self, key, value):
        return setattr(self, key, value)

    password_group_id: int
    password_group: str
    username: str
    password: str
    secret_password: str | None = None
    password_group_type: PasswordGroupTypeEnum

    creation_date: str
    modification_date: str


class DeletePasswordGroupRequestSchema(BaseModel):
    def __getitem__(self, key):
        return getattr(self, key, None)

    def __setitem__(self, key, value):
        return setattr(self, key, value)

    password_group_id: int
