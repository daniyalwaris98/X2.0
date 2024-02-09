from fastapi import FastAPI,APIRouter
from fastapi.responses import JSONResponse
import sys
import traceback

from sqlalchemy.exc import SQLAlchemyError

from app.models.users_models import *
from app.utils.db_utils import *
from app.core.config import *
import asyncio
from app.api.v1.users.routes.license_routes import generate_license

def add_user_role_to_db(role):
    try:
        role = dict(role)
        print("start of the add user role to db is::::::::",file=sys.stderr)
        roleData = UserRoleTableModel()
        if 'role' in role:
            role_exsist = configs.db.query(UserRoleTableModel).filter_by(role = role['role']).first()
            print("role exsist is:::::::::::::::::::::::::",role_exsist,file=sys.stderr)
            if role_exsist:
                return "Role Already Exists",400
            else:
                roleData.role = role['role']
        else:
            return "Role ID Is Missing"
        if 'configuration' in role:
            configuration = role['configuration'].strip()
            if configuration !="":
                print("configuration for the role is::::::::::::;;;;;;;",configuration,file=sys.stderr)
                roleData.configuration = configuration
            else:
                return "Role COnfiguration Cannot be Null",400
        else:
            return "Role Cconfiguration Is Missing",400
        status = InsertDBData(roleData)
        print("data isnerted to the role is::::::::::::::",status,file=sys.stderr)
        if status==200:
            role_data = {}
            data = {
                "role_id":roleData.role_id,
                "configuration":roleData.configuration,
                "role":roleData.role
            }
            print("data is:::::::::::::::::::::::",data,file=sys.stderr)
            role_data['data']=data
            role_data['message'] = f"{roleData.role} : Inserted Successfully"
            print("Role data is::::::::::::::::",role_data,file=sys.stderr)
            return role_data,200
        else:
            return "Error Occred While Role Insertion",400
    except Exception as e:
        return JSONResponse(content="Error Occured While Adding role to DB",status_code=500)




def AddUserInDB(user_data):
    try:
        user_data_dict = user_data.dict()
        user = UserTableModel()
        end_user_exsist = configs.db.query(EndUserTable).filter_by(end_user_id=user_data_dict['end_user_id']).first()
        if not end_user_exsist:
            return "End User Not Found", 400
        end_user_id = end_user_exsist.end_user_id

        role_exsist = configs.db.query(UserRoleTableModel).filter_by(role=user_data_dict['role']).first()
        if not role_exsist:
            return "Role Not Found", 400
        role_id = role_exsist.role_id

        user_name_exsist = configs.db.query(UserTableModel).filter_by(user_name=user_data_dict['user_name']).first()
        if user_name_exsist:
            for key, value in user_data_dict.items():
                setattr(user_name_exsist, key, value)
            user_name_exsist.end_user_id = end_user_id
            user_name_exsist.role_id = role_id
            UpdateDBData(user_name_exsist)
            data = {
                "user_id": user_name_exsist.id,
                "name": user.name,
                "password": user.password,
                "role": role_exsist.role,
                "company_name": end_user_exsist.company_name,
                "status": user.status,
                "teams": user.teams
            }
            message = f"{user_name_exsist.user_name} : Updated Successfully"
        else:

            for key, value in user_data_dict.items():
                setattr(user, key, value)
            user.end_user_id = end_user_id
            user.role_id = role_id
            InsertDBData(user)
            message = f"{user.user_name} : Inserted Successfully"

        # Construct the response data
        data = {
            "user_id":user.id,
            "user_name":user.name,
            "email_address":user.email,
            "status":user.status,
            "account_type":user.account_type,
            "team":user.teams,
            "role":user.role,
            "name":user.name,
            "password":user.password
        }
        data_dict = {'data': data, 'message': message}
        return data_dict, 200

    except Exception as e:
        print("error in Add user in DB is:", str(e))
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Inserting User In Database", status_code=500)




def EditUserInDB(user_data):
    try:
        user_data_dict = user_data.dict()
        user = UserTableModel()
        # end_user_exsist = configs.db.query(EndUserTable).filter_by(company_name=user_data_dict['company_name']).first()
        # if not end_user_exsist:
        #     return "End User Not Found", 400
        # end_user_id = end_user_exsist.end_user_id

        role_exsist = configs.db.query(UserRoleTableModel).filter_by(role=user_data_dict['role']).first()
        if not role_exsist:
            return "Role Not Found", 400
        role_id = role_exsist.role_id

        user_name_exsist = configs.db.query(UserTableModel).filter_by(user_name=user_data_dict['name']).first()
        if user_name_exsist:
            for key, value in user_data_dict.items():
                setattr(user_name_exsist, key, value)
            # user_name_exsist.end_user_id = end_user_id
            user_name_exsist.role_id = role_id
            UpdateDBData(user_name_exsist)
            message = f"{user_name_exsist.user_name} : Updated Successfully"

        # Construct the response data
        data = {
            "user_id":user.id,
            "user_name":user.name,
            "email_address":user.email,
            "status":user.status,
            "account_type":user.account_type,
            "team":user.teams,
            "role":user.role,
            "name":user.name,
            "password":user.password
        }
        data_dict = {'data': data, 'message': message}
        return data_dict, 200

    except Exception as e:
        print("error in Add user in DB is:", str(e))
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Inserting User In Database", status_code=500)



def add_end_user_registration(user_obj: dict):
    try:
        print("user obj is::::::::::::::::::::",user_obj,file=sys.stderr)
        # Check if the end user already exists
        company_name = user_obj['company_name']
        license_data = {}
        print("company_name:::::::::::::::::::::::::", company_name,file=sys.stderr)
        end_user_exists = configs.db.query(EndUserTable).filter_by(company_name=company_name).first()
        if end_user_exists:
            print("end user exsist is:::::::::::::::::",file=sys.stderr)
            return JSONResponse(content="End User Already Exsists",status_code=400)

        # Create a new EndUserTable instance and populate it
        new_end_user = EndUserTable()
        for key, value in user_obj.items():
            if hasattr(new_end_user, key):
                setattr(new_end_user, key, value)
            if key=='license_start_date':
                license_data['start_date'] = value
            if key=='license_end_date':
                license_data['end_date'] =value
            if key=='device_onboard_limit':
                license_data['device_onboard_limit'] = value

        # Insert the new end user into the database
        InsertDBData(new_end_user)
        print("data inserted for the end user::",file=sys.stderr)
        print("step 2 liscence generation :::::::::::::::::::",file=sys.stderr)
        # Prepare the data for the license generation if needed
        license_data['end_user_id'] = new_end_user.end_user_id
        license_data['company_name'] = new_end_user.company_name
        generate_license(license_data)

        # Construct and return the response data
        data = {
            "end_user_id": new_end_user.end_user_id,
            "company_name": new_end_user.company_name,
            # Include other fields as necessary
        }
        return {"data": data, "message": "End user inserted successfully"}

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content="An unexpected error occurred")