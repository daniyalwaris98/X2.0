import sys
import traceback
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.schema.cloud_monitoring_schema.aws_schema import *
from app.models.cloud_monitoring_models import *
from app.api.v1.cloud_monitoring.routes.cloud_aws_services_routes import account_details





router = APIRouter(prefix="/aws_credentials", tags=["aws_credentials"])





@router.post('/add_aws_credential',responses = {
    200:{"model":Response200},
    400:{"model":str},
    500:{"model":str}
},
summary="API to add the AWS credentials cloud credentials",
description="API to add the AWS credentials cloud credentials"
)
async def add_aws_credentials(aws_data:AwsCredentialsResponseSchema):
    try:
        account_details['aws_access_key_id'] = aws_data.access_key
        account_details['aws_secret_access_key'] = aws_data.secret_access_key
        account_details['region_name'] = aws_data.region_name
        aws_credentials = CloudCredentials(
            access_key = aws_data.access_key,
            secret_access_key = aws_data.secret_access_key,
            region_name = aws_data.region_name,
            account_service_provider = 'AWS'
        )
        InsertDBData(aws_credentials)
        print("data insertd to the aws credentials database",file=sys.stderr)
        serialized_data = aws_credentials.as_dict()
        serialized_data['cloud_credentials_id'] = aws_credentials.cloud_credential_id
        print("serialized data is::::::::::::::::::::::::::::",serialized_data,file=sys.stderr)
        return Response200(data = serialized_data ,message="AWS credentials added successfully")
    except Exception as e:
        traceback.print_exc()
        print("error in add aws credentials",str(e))
        return JSONResponse(content="Error Occured while adding aws credentials",status_code=500)


@router.post('/update_aws_credential', responses={
    200: {"model": Response200},
    400: {"model": str},
    500: {"model": str}
},
             summary="API to add the AWS credentials cloud credentials",
             description="API to add the AWS credentials cloud credentials"
             )
async def update_aws_credentials(aws_data: GetAwsCredentialsResponseSchema):
    try:
        aws_credentials = configs.db.query(CloudCredentials).filter_by(
            cloud_credential_id=aws_data.cloud_credential_id).first()
        if aws_credentials:
            aws_credentials.access_key = aws_data.access_key
            aws_credentials.secret_access_key = aws_data.secret_access_key
            aws_credentials.region_name = aws_data.region_name
            aws_credentials.account_service_provider = 'AWS'
            aws_credentials.modification_date = datetime.now()
            UpdateDBData(aws_credentials)
            print("AWS credentials updated in the database", file=sys.stderr)
            serialized_data = aws_credentials.as_dict()
            serialized_data['cloud_credentials_id'] = aws_credentials.cloud_credential_id
            print("Serialized data is: ", serialized_data, file=sys.stderr)

            return Response200(data=serialized_data, message="AWS credentials updated successfully")
        else:
            return JSONResponse(content="AWS credentials do not exist", status_code=400)
    except Exception as e:
        traceback.print_exc()
        print("Error in updating AWS credentials", str(e))
        return JSONResponse(content="Error occurred while updating AWS credentials", status_code=500)


@router.post('/delete_aws_credentials',responses = {
    200:{"model":str},
    400:{"model":str},
    500:{"model":str}
},
summary="API to delete aws credentials",
description="API to delete aws credentials"
)
async def delete_aws_credentials(cloud_credentials:list[int]):
    try:
        data = []
        suucess_list = []
        error_list = []
        for credential in cloud_credentials:
            aws_credentials_exist = configs.db.query(CloudCredentials).filter_by(cloud_credential_id = credential).first()
            if aws_credentials_exist:
                data.append(credential)
                DeleteDBData(aws_credentials_exist)
                suucess_list.append("AWS Credentials Deleted Successfully")
            else:
                error_list.append("No relevent account found to delete")
        response = {
            "data":data,
            "suucess_list":suucess_list,
            "error_list":error_list,
            "success":len(suucess_list),
            "error":len(error_list)
        }
        return response
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error OCcurd while deleting aws credentials",status_code=500)


@router.get('/get_all_aws_credentials',responses = {
    200:{"model":str},
    500:{"model":str}
})
async def get_all_aws_credentials():
    try:
        aws_credentials_list = []
        aws_credentials = configs.db.query(CloudCredentials).all()
        for aws_credentials in aws_credentials:
            aws_credentials_list.append(aws_credentials.as_dict())
        print("aws credentials list is::::::::::",aws_credentials_list,file=sys.stderr)
        return aws_credentials_list
    except Exception as e:
        configs.db.rollback()
        traceback.print_exc()
        return JSONResponse(content="Error OCcured while getting all the aws credentials",status_code=500)