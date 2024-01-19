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
    200:{"model":Response200},
    400:{"model":str},
    500:{"model":str}
})
def add_user_role(role:AddUserRoleScehma):
    try:
        print("user role with its configuration is:::::::::::::::::",role,file=sys.stderr)
        response,status = add_user_role_to_db(role)
        print("response of the user role is:::",response,file=sys.stderr)
        print("status is::::::",status,file=sys.stderr)
        print("type of user role is::",type(response),file=sys.stderr)
        print("status is :::::::::",type(status),file=sys.stderr)
        if status == 200:
            return JSONResponse(content=response,status_code=200)
            print("respinse of the add user is:::::::::::::;",response,file=sys.stderr)
            print("response of the add user role is::::::::::::::::;;",status,file=sys.stderr)
        elif status ==400:
            return JSONResponse(content=response,status_code=400)
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
        configs.db.rollback()
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Getting user role",status_code=500)



@router.get('/get_all_end_users',responses={
    200:{"model":str},
    400:{"model":str},
    500:{"model":str}
},
summary="API to get all the end users",
description="API to get all the end users"
)
def get_all_end_users():
    try:
        end_user_list = []
        end_users = configs.db.query(EndUserTable).all()
        for users in end_users:
            end_user_dict = {
                "end_user_id":users.end_user_id,
                "company_name":users.company_name,

            }
            end_user_list.append(end_user_dict)
        return JSONResponse(content=end_user_list,status_code=200)
    except Exception as e:
        configs.db.rollback()
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Getting end users",status_code=500)


@router.post('/add_user',responses={
    200:{"model":str},
    400:{"model":str},
    500:{"model":str}
},
summary="API to add the user and updated the user",
description="API to add the user and updated the user"
)
def add_user_db(user_data:AddUserSchema):
    try:
        data,status = AddUserInDB(user_data)
        return JSONResponse(content=data,status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While adding the user in db",status_code=500)

@router.get('/get_all_users',responses={
    200:{"model":list[GetUserResponseScehma]},
    500:{"model":str}
},
summary="API to Get all the users",
description="API to Get all the users"
)
def get_all_users():
    try:
        user_list = []
        users = configs.db.query(UserTableModel).all()
        for user in users:
            print("user is::::::::::::::::::",user,file=sys.stderr)
            user_dict = {
                "user_id":user.user_id,
                "user_name":user.name,
                "email":user.email,
                "status":user.status,
                "account_type":user.account_type
            }
            user_list.append(user_dict)
        return JSONResponse(content=user_list,status_code=200)
    except Exception as e:
        configs.db.rollback()
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Getting All the Users",status_code=500)

@router.post('/edit_user_role',responses = {
    200:{"model":Response200},
    400:{"model":str},
    500:{"model":str}
},
summary="API to edit the end user role",
description="API to edit the end user role"
)
def edit_user_role(user_data:EditUserRoleScehma):
    try:
        user_data ={}
        user_data = dict(user_data)
        user_role_exsist = configs.db.query(UserRoleTableModel).filter_by(role_id = user_data['role_id']).first()
        if user_role_exsist:
            user_role_exsist.role = user_data['role']
            UpdateDBData(user_role_exsist)
            # user_role_exsist.configuration = user_data['configuration']
            data = {
                "role_id":user_role_exsist.role_id,
                "role":user_role_exsist.role,
                "configuration":user_role_exsist.configuration
            }
            message = f"{user_role_exsist.role} : Updated Successfully"
            user_data['data'] = data
            user_data['message'] = message
            return JSONResponse(content=user_data,status_code=200)
        else:
            return JSONResponse(content="Error Ocuured While Updating the User role",status_code=500)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Editing the user",status_code=500)

@router.post('/edit_role_configuration',responses = {
    200:{"model":Response200},
    400:{"model":str},
    500:{"model":str}
},
summary="API to edit the end user role",
description="API to edit the end user role"
)
def edit_user_role(user_data:EditConfigurationRoleScehma):
    try:
        user_data ={}
        user_data = dict(user_data)
        user_role_exsist = configs.db.query(UserRoleTableModel).filter_by(role_id = user_data['role_id']).first()
        if user_role_exsist:
            user_role_exsist.configuration = user_data['configuration']
            UpdateDBData(user_role_exsist)
            # user_role_exsist.configuration = user_data['configuration']
            data = {
                "role_id":user_role_exsist.role_id,
                "role":user_role_exsist.role,
                "configuration":user_role_exsist.configuration
            }
            message = f"{user_role_exsist.role} : Updated Successfully"
            user_data['data'] = data
            user_data['message'] = message
            return JSONResponse(content=user_data,status_code=200)
        else:
            return JSONResponse(content="Error Ocuured While Updating the User role",status_code=500)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Editing the user",status_code=500)


@router.post('/delete_role',responses = {
    200:{"model":DeleteResponseSchema},
    400:{"model":str},
    500:{"model":str}
},
summary="API to delete the user role",
description="API to delete the user role"
)
def user_role(role_data : list[int]):
    try:
        data_list = []
        success_list = []
        error_list = []
        for role in role_data:
            print("role is::::::::::::::::::::::",role,file=sys.stderr)
            role_exsist = configs.db.query(UserRoleTableModel).filter_by(role_id=role).first()
            if role_exsist:
                data_list.append(role)
                DeleteDBData(role_exsist)
                success_list.append(f"{role_exsist.role} : Deleted Successfully")
            else:
                error_list.append(f"Role {role} does not Exists")
        responses = {
            "data":data_list,
            "success_list":success_list,
            "error_list":error_list,
            "success":len(success_list),
            "error":len(error_list)
        }
        return JSONResponse(content=responses,status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Deleting the user role",status_code=500)



@router.post('/delete_user',responses={
    200:{"model":str},
    400:{"model":str},
    500:{"model":str}
},
summary="API to delete the user based on the ID",
description="API to Delete the user based on the ID"
)
def delete_user(user_id :list[int]):
    try:
        deleted_ids = []
        success_list = []
        error_list = []
        for data in user_id:
            print("data is ::::::::::::::::::;",data,file=sys.stderr)
            user_exsist = configs.db.query(UserTableModel).filter_by(user_id=data).first()
            if user_exsist:
                deleted_ids.append(data)
                DeleteDBData(user_exsist)
                success_list.append(f"{data} : Is deleted")
            else:
                error_list.append(f"{data} : Not Found")
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Deleting the User",status_code=500)