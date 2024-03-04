from app.schema.base_schema import *




class AwsCredentialsResponseSchema(BaseSchema):
    aws_access_key_id : str
    aws_secret_access_key : str
    region_name : str



class GetAwsCredentialsResponseSchema(AwsCredentialsResponseSchema):
    cloud_credential_id : int