from app.api.v1.atom.atom_utils import *

router = APIRouter(
    prefix="/atom",
    tags=["atom"],
)


@router.post("/addPasswordGroup", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
def add_password_group(pass_obj: AddPasswordGroupRequestSchema):
    try:
        pass_obj = pass_obj.dict()

        response, status = add_password_group_util(pass_obj, False)

        return JSONResponse(content=response, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Adding Password Group", status_code=500)


@router.post("/addPasswordGroups", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
def add_password_groups(pass_list: list[AddPasswordGroupRequestSchema]):
    try:

        success_list = []
        error_list = []
        for pass_obj in pass_list:
            pass_obj = pass_obj.dict()

            msg, status = add_password_group_util(pass_obj, True)
            if status == 200:
                success_list.append(msg)
            else:
                error_list.append(msg)

        response = SummeryResponseSchema(
            success=len(success_list),
            error=len(error_list),
            success_list=success_list,
            error_list=error_list
        )

        return JSONResponse(content=response, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Adding Password Groups", status_code=500)


@router.post("/editPasswordGroup", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
def edit_password_group(pass_obj: AddPasswordGroupRequestSchema):
    try:
        pass_obj = pass_obj.dict()

        response, status = edit_password_group_util(pass_obj)

        return JSONResponse(content=response, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Updating Password Group", status_code=500)


@router.post("/deletePasswordGroup", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
def delete_password_groups(pass_list: list[DeletePasswordGroupRequestSchema]):
    try:

        success_list = []
        error_list = []
        for pass_obj in pass_list:
            pass_obj = pass_obj.dict()

            password = configs.db.query(PasswordGroupTable).filter(
                PasswordGroupTable.password_group_id == pass_obj["password_group_id"]).first()

            if password is None:
                error_list.append(f"{pass_obj['password_group_id']} : No Password Group Found")
                continue

            if DeleteDBData(password) == 200:
                success_list.append(f"{password.password_group} : Password Group Deleted Successfully")
            else:
                error_list.append(f"{password.password_group} : Error While Deleting Password Group")

        response = SummeryResponseSchema(
            success=len(success_list),
            error=len(error_list),
            success_list=success_list,
            error_list=error_list
        )

        return JSONResponse(content=response, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Deleting Password Groups", status_code=500)


@router.get("/getPasswordGroups", responses={
    200: {"model": list[GetPasswordGroupResponseSchema]},
    500: {"model": str}
})
async def get_password_groups():
    try:
        response = list()
        results = configs.db.query(PasswordGroupTable).all()
        for result in results:
            response.append(result.as_dict())

        return JSONResponse(content=response, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Password Groups", status_code=500)


@router.get("/getPasswordGroupDropdown", responses={
    200: {"model": list[str]},
    500: {"model": str}
})
async def get_password_group_dropdown():
    try:
        response = list()
        results = configs.db.query(PasswordGroupTable).all()
        for result in results:
            response.append(result.password_group)

        return JSONResponse(content=response, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Password Groups", status_code=500)
