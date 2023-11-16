from app.api.v1.atom.utils.atom_utils import *

router = APIRouter(
    prefix="/password_group",
    tags=["password_group"],
)


@router.post("/add_password_group", responses={
    200: {"model": Response200},
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


@router.post("/add_password_groups", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
def add_password_groups(pass_list: list[AddPasswordGroupRequestSchema]):
    try:

        success_list = []
        error_list = []
        data_lst = []
        for pass_obj in pass_list:
            pass_obj = pass_obj.dict()

            msg, status = add_password_group_util(pass_obj, True)
            # print("message in fields ossssssssssss:::::::::::::::::::::::",msg,file=sys.stderr)
            # print("status is::::::::::::::::::::::",status,file=sys.stderr)
            if status == 200:
                for key,value in msg.items():
                                # print("key for msg ares::::::::::::::::::::",key,file=sys.stderr)
                                # print("values are:::::::::::::::::::::::::::::",value,file=sys.stderr)

                                if key =='data':
                                    data_lst.append(value)
                                if key == 'message':
                                    if value not in success_list:
                                        # print("values for the message is::::::::::::::::::::::",value,file=sys.stderr)
                                        success_list.append(value)
                # success_list.append(msg)
            # else:
            #     error_list.append(msg)

        response = SummeryResponseSchema(
            data = data_lst,
            success=len(success_list),
            error=len(error_list),
            success_list=success_list,
            error_list=error_list
        )

        return response
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Adding Password Groups", status_code=500)


@router.post("/edit_password_group", responses={
    200: {"model": Response200},
    400: {"model": str},
    500: {"model": str}
})
def edit_password_group(pass_obj: EditPasswordGroupRequestSchema):
    try:
        pass_obj = pass_obj.dict()

        response, status = edit_password_group_util(pass_obj)

        return JSONResponse(content=response, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Updating Password Group", status_code=500)


@router.post("/delete_password_group", responses={
    200: {"model": DeleteResponseSchema},
    500: {"model": str}
})
def delete_password_groups(pass_list: list[DeletePasswordGroupRequestSchema]):
    try:

        success_list = []
        error_list = []
        deleted_password_group = []
        for pass_obj in pass_list:
            pass_obj = pass_obj.dict()
            print("password obj is::::::::::::::::::::::::::::",pass_obj,file=sys.stderr)
            passworg_grp_id = pass_obj['password_group_id']
            print("password group id for deletion::::::::::::::::::::::::::::::::::::::::::::::::",passworg_grp_id,file=sys.stderr)
            deleted_passw_group = {}
            password = configs.db.query(PasswordGroupTable).filter(
                    PasswordGroupTable.password_group_id == passworg_grp_id).first()
            print("password is:::::::::::::::::::::::::::::::::::::",password,file=sys.stderr)
            if password:
                deleted_password_group_id = password.password_group_id
                print("delted password id is:::::::::::::::::::::::::::::::::::::::",deleted_password_group_id,file=sys.stderr)

                if DeleteDBData(password) == 200:
                    deleted_passw_group['password_group_id'] = deleted_password_group_id
                
                    deleted_password_group.append(deleted_passw_group)
                    success_list.append(
                        f"{password.password_group} : Password Group Deleted Successfully")
                    
                else:
                    error_list.append(
                        f"{password.password_group} : Error While Deleting Password Group")
            else:
                error_list.append(f"{passworg_grp_id} : Password Group ID Not Found")

        response = {
            "data":deleted_password_group,
            "success": len(success_list),
            "error": len(error_list),
            "success_list": success_list,
            "error_list": error_list
        }

        return JSONResponse(content=response, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Deleting Password Groups",
                            status_code=500)


@router.get("/get_password_groups", responses={
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
        return JSONResponse(content="Error Occurred While Fetching Password Groups",
                            status_code=500)


@router.get("/get_password_group_dropdown", responses={
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
        return JSONResponse(content="Error Occurred While Fetching Password Groups",
                            status_code=500)
