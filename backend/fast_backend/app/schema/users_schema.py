from datetime import datetime

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
    email:str
    password:str
    status:str
    user_name:str
    teams:str
    account_type:str
    role:str
    company_name:str

class GetUserResponseScehma(BaseSchema):
    user_id:int
    user_name:str
    email:str
    status:str
    account_type:str
class EditUserRoleScehma(BaseSchema):
    role_id:int
    role:str
    configuration:str


class FailedDevicesResponseSchema(BaseSchema):
    failure_id:int
    ip_address:str
    device_type:str
    date:datetime
    failure_reason:str
    module:str