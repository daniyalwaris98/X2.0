from fastapi import FastAPI,APIRouter
from fastapi.responses import JSONResponse
import sys
import traceback
from app.utils.common_state_utils import *
from app.models.common_models import *
from app.schema.common_schema import *
router = APIRouter(
    prefix='/common_routes',
    tags=['common_routes']
)


@router.get('/test_common_router')
def test_common_router():
    return {"message":"test common router"}


@router.post('/get_latest_function_state',
             responses={
                 200:{"model":Response200},
                 400:{"model":str},
                 500:{"model":str}
             },
summary="API to get the latest function",
description="API to get the latest"
)
def get_latest_function_state(function:FunctionResponseScehma):
    try:
        check_function_existence = configs.db.query(FucntionStateTable).filter_by(function_name = function.function_name).first()
        if check_function_existence:
            data = check_function_existence.as_dict()
            print("data for the latest fucntion state:::",data,file=sys.stderr)
            return Response200(
                data=data,
                message=f"{check_function_existence.function_name} is now {check_function_existence.running}"
            )

        else:
            return JSONResponse(content="No Matching Function Name Found",status_code=400)

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Get latest Function State",status_code=500)