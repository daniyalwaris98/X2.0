from datetime import datetime

from pydantic import validator

from app.schema.base_schema import BaseSchema


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