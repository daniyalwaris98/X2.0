from app.schema.base_schema import *



class AwsCredentialScehma(BaseSchema):
    account_label:str
    access_key: str
    secret_key : str

class GetAwsSchema(BaseSchema):
    aws_access_key : str
    account_label :str
    access_type : str
    status : bool

class GetEC2Schema(BaseSchema):
    instance_id : int
    instance_name : str
    region_id : str
    access_key : str
    account_label : str
    monitoring_status : str

class AddEc2Schema(BaseSchema):
    access_key : str
    instance_id : int
    instance_name : str
    region_id : int
    access_key :str

class UpdateEc2Status(BaseSchema):
    instance_id : str

class ReloadEc2(BaseSchema):
    aws_access_key : str

class GetEc3Schema(BaseSchema):
    bucket_name : str
    region_id : int
    account_label : str
    monitoring_status : str