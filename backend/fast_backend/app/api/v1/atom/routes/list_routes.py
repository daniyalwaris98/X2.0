import traceback

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.utils.static_list import *

router = APIRouter(
    prefix="/static-list",
    tags=["static-list"],
)


@router.get("/get-vendor-list", responses={
    200: {"model": list[str]},
    500: {"model": str}
})
async def get_vendor_list():
    try:
        return JSONResponse(content=vendor_list, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Vendor List", status_code=500)


@router.get("/get-device-type-list", responses={
    200: {"model": list[str]},
    500: {"model": str}
})
async def get_device_type_list():
    try:
        return JSONResponse(content=device_type_list, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Device Type List", status_code=500)



@router.get("/get-function-list", responses={
    200: {"model": list[str]},
    500: {"model": str}
})
async def get_function_list():
    try:
        return JSONResponse(content=function_list, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Fucntion List", status_code=500)
