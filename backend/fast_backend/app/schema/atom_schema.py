from pydantic import BaseModel


class AddAtomSchema(BaseModel):
    ip_address: str
    device_name: str
    device_type: str
    function: str
    site_name: str
    rack_name: str

    vendor: str = None
    device_ru: int = None
    department: str = None
    section: str = None
    criticality: str = None
    domain: str = None
    virtual: str = None
    onboard_status: bool = None
    scop: str = None


class GetAtomSchema(BaseModel):
    ip_address: str
    device_name: str
    device_type: str
    function: str
    site_name: str
    rack_name: str

    vendor: str = None
    device_ru: int = None
    department: str = None
    section: str = None
    criticality: str = None
    domain: str = None
    virtual: str = None
    onboard_status: bool = None
    scop: str = None

    creation_date: str
    modification_date: str
