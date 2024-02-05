from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.schema.base_schema import FindBase, ModelBaseInfo, SearchOptions
from app.utils.schema import AllOptional

from pydantic import validator

from app.schema.base_schema import BaseSchema

class DeletePnCodeSchema(BaseSchema):
    pn_code : str

class SummeryResponseSchema(BaseSchema):
    data: list[dict]
    success: int
    error: int
    success_list: list[str]
    error_list: list[str]

class Response200(BaseSchema):
    data: dict
    message: str


class DeleteResponseSchema(BaseSchema):
    data: dict
    success: int
    error: int
    success_list: list[str]
    error_list: list[str]

class EndUserResponseScehma(BaseSchema):
    company_name:str
    po_box:str
    address:str
    street_name:str
    city:str
    country:str
    contact_person:str
    contact_number:str
    email:str
    domain_name:str
    industry_type:str
    license_start_date: datetime
    license_end_date: datetime
    device_onboard_limit: int

class GenerateLicenseResponseScehma(BaseSchema):
    start_date:datetime
    end_date:datetime
    device_onboard_limit:int
    company_name:str

class AddUserRoleScehma(BaseSchema):
    role:str
    configuration:str

class AddUserSchema(BaseSchema):
    name:str
    email_address:str
    password:str |None = None
    email_address:str
    password:str |None = None
    status:str
    user_name:str
    team:str
    account_type:str
    role:str
    end_user_id:int

class GetUserResponseScehma(BaseSchema):
    user_id:int
    user_name:str
    email:str
    status:str
    account_type:str
class EditUserRoleScehma(BaseSchema):
    role_id:int
    role:str


class EditConfigurationRoleScehma(BaseSchema):
    role_id:int
    configuration:str


class FailedDevicesResponseSchema(BaseSchema):
    failure_id:int
    ip_address:str
    device_type:str
    date:datetime
    failure_reason:str
    module:str


class BaseUser(BaseSchema):
    email: str
    user_token: str
    name: str
    is_active: bool
    is_superuser: bool
    class Config:
        orm_mode = True

class BaseUserWithPassword(BaseUser):
    password: str

class User(ModelBaseInfo, BaseUser, metaclass=AllOptional):
    ...

class FindUser(FindBase, BaseUser, metaclass=AllOptional):
    email__eq: str
    user_name: str
    ...

class UpsertUser(BaseUser, metaclass=AllOptional):
    ...

class FindUserResult(BaseModel):
    founds: Optional[List[User]]
    search_options: Optional[SearchOptions]