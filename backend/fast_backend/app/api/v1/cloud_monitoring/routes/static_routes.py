import traceback

from fastapi import FastAPI,APIRouter
from fastapi.responses import JSONResponse
from app.api.v1.cloud_monitoring.utils.static_list_utils import *




router = APIRouter(
    tags=['cloud_monitoring_static_route'],
    prefix='/cloud_monitoring_static_list'
)


@router.get('/get_aws_region_dropdown',responses={
    200:{"model":str},
    500:{"model":str}
},
summary="API for the aws region",
description="API for the aws region"
)
def get_aws_region_dropdown():
    try:
        return JSONResponse(content=aws_region_list,status_code=200)
    except Exception as e:
        traceback.print_exc()
        print("error in aws get region dropdown",str(e))
        return JSONResponse(content="Error Occurred While Getting The Aws Region",status_code=500)