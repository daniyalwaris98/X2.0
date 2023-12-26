from datetime import datetime
from app.schema.base_schema import *



class GetAtomInIpamSchema(BaseSchema):
    atom_id:int
    ip_address:str
    device_name:str | None = None
    function:str | None = None
    vendor:str | None = None

class AddAtomInIpamSchema(BaseSchema):
    atom_id:int