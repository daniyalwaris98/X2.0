from fastapi import FastAPI,APIRouter
from fastapi.responses import JSONResponse
import sys
import traceback
from app.models.users_models import *
from app.utils.db_utils import *
from app.core.config import *


def add_user_to_db(role):
    try:
        roleData = UserRoleTableModel()
        if 'role_id' in role:
            role_exsist = configs.db.query(UserRoleTableModel).filter_by(role_id = role['role_id']).first()
            if role_exsist:
                return JSONResponse(content="Role Already Exsist",status_code=400)
            else:
                roleData.role = role['role_id']
        else:
            return JSONResponse(content="Role ID IS Missing",status_code=400)
        if 'configuration' in role:
            configuration = role['configuration'].strip()
            if configuration !="":
                roleData.configuration = configuration
            else:
                return JSONResponse(content="Role Configuration Cannot Be Null",status_code=400)
        else:
            return JSONResponse(content="Role Configuration Is Missing",status_code=400)
        status = InsertDBData(roleData)
        if status==200:
            role_data = {}
            data = {
                "role_id":roleData.role_id,
                "configuration":roleData.configuration,
                "role":role
            }
            role_data['data']=data
            role_data['message'] = f"{roleData.role} : Inserted Successfully"
            return role_data
        else:
            return JSONResponse(content="Error Occured While Role Insertion",status_code=400)
    except Exception as e:
        return JSONResponse(content="Error Occured While Adding role to DB",status_code=500)
