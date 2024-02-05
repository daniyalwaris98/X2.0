from fastapi import FastAPI,APIRouter
from fastapi.responses import JSONResponse
import sys
import traceback
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
            "user_id": user.id,
            "name": user.name,
            "password": user.password,
            "role": role_exsist.role,
            "company_name": end_user_exsist.company_name,
            "status": user.status,
            "teams": user.teams
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
        end_user_exsist = configs.db.query(EndUserTable).filter_by(company_name=user_data_dict['company_name']).first()
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
            message = f"{user_name_exsist.user_name} : Updated Successfully"

        # Construct the response data
        data = {
            "user_id": user.user_id,
            "name": user.name,
            "password": user.password,
            "role": role_exsist.role,
            "company_name": end_user_exsist.company_name,
            "status": user.status,
            "teams": user.teams
        }
        data_dict = {'data': data, 'message': message}
        return data_dict, 200

    except Exception as e:
        print("error in Add user in DB is:", str(e))
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Inserting User In Database", status_code=500)



def add_end_user_registration(Userobj):
    try:
        users_dict = {}
        users = EndUserTable()
        end_user = dict(Userobj)
        end_user_exsists = configs.db.query(EndUserTable).filter_by(company_name=Userobj['company_name']).first()
        if end_user_exsists:
            return JSONResponse(content="End User Already Exsists",status_code=400)
        for key,value in end_user.items():
            print("key in end user is:::::::::::::",key,file=sys.stderr)
            print("value in end user is::::::::::::",value,file=sys.stderr)
            if hasattr(users,key):
                print("has attribute true for the end user model",file=sys.stderr)
                setattr(users,key,value)
                print("set attribute is true for the table")
                InsertDBData(users)
                print("Data Inserted into the end user table is:::::::::::::::",file=sys.stderr)
                data = {
                    "end_user_id":users.end_user_id,
                    "company_name":users.company_name,
                    "po_box":users.po_box,
                    "email":users.email,
                    "address":users.address,
                    "street_name":users.street_name,
                    "city":users.city,
                    "country":users.country,
                    "contact_person":users.contact_person
                }
                users_dict['data']= data
                users_dict['message']  =f"End user Inserted"
            else:
                print("has attribute false for the end user model and the key not found",file=sys.stderr)
            end_user_verify = configs.db.query(EndUserTable).filter_by(company_name=Userobj['company_name']).first()
            if end_user_verify:
                if key =='liscence_statrt_date' or key=="liscence_end_date" or key =="device_onboard_limit":
                    license_data = {
                        "start_date":Userobj.license_start_date,
                        "end_date":Userobj.license_end_date,
                        "device_onboard_limit":Userobj['device_onboard_limit'],
                        "end_user_id":end_user_verify.end_user_id,
                        "company_name":Userobj.company_name
                    }
                    result = asyncio.run(generate_license(license_data))
                    print("Result of generate_license:", result)
            else:
                return JSONResponse(content="Company Didnt Exsists",status_code=400)
        return users_dict
    except Exception as e:
        traceback.print_exc()