from app.schema.base_schema import *




class AwsCredentialsResponseSchema(BaseSchema):
    access_key : str
    secret_access_key : str
    region_name : str



class GetAwsCredentialsResponseSchema(AwsCredentialsResponseSchema):
    cloud_credential_id : int