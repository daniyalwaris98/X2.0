from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sys
import traceback
from app.core.config import *
from app.models.users_models import *
from app.schema.users_schema import *
from app.utils.db_utils import *
from app.api.v1.users.utils.user_utils import *

router = APIRouter(
    prefix="/user",
    tags=["admin_routes"]
)


@router.post('/add_end_user',responses = {
    200:{"model":str},
    400:{"model":str},
    500:{"model":str}
},
description="API to add the end user",
summary="API to add the end user"
)
def add_end_user(Userobj:EndUserResponseScehma):
    try:
        users = EndUserTable()
        end_user = dict(Userobj)
        for key,value in end_user.items():
            print("key in end user is:::::::::::::",key,file=sys.stderr)
            print("value in end user is::::::::::::",value,file=sys.stderr)
            if hasattr(users,key):
                print("has attribute true for the end user model",file=sys.stderr)
                setattr(users,key,value)
                print("set attribute is true for the table")
                InsertDBData(users)
                print("Data Inserted into the end user table is:::::::::::::::",file=sys.stderr)
            else:
                print("has attribute false for the end user model and the key not found",file=sys.stderr)
    except Exception as e:
        traceback.print_exc()



@router.post('/add_user_role',responses = {
    200:{"model":str},
    400:{"model":str},
    500:{"model":str}
})
def add_user_role(role:AddUserRoleScehma):
    try:
        role = dict(role)
        response,status = add_user_role(role)
        return JSONResponse(content=response,status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Adding role in DB",status_code=500)



@router.get('/get_all_user_roles',responses={
    200:{"model":str},
    400:{"model":str},
    500:{"model":str}
},
summary="API to get all the user roles",
description="API to get all the user roles"
)
def get_all_users_role():
    try:
        role_list =[]
        roles = configs.db.query(UserRoleTableModel).all()
        for role in roles:
            role_dict = {
                "role_id":role.role_id,
                "role":role.role,
                "configuration":role.configuration
            }
            role_list.append(role_dict)
        return role_list
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Getting user role",status_code=500)