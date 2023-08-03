from app import app
from app.models.inventory_models import *
from app.middleware import token_required
from app.uam.uam_utils import *


from flask_jsonpify import jsonify
from flask import request


import traceback


@app.route("/getAllAps", methods=["GET"])
@token_required
def GetAllAps(user_data):
    try:
        apObjs = APS_TABLE.query.all()
        objList = []
        for apObj in apObjs:
            objDict = {}
            objDict["ap_id"] = apObj.ap_id
            objDict["controller_name"] = apObj.controller_name
            objDict["ap_ip"] = apObj.ap_ip
            objDict["ap_name"] = apObj.ap_name
            objDict["serial_number"] = apObj.serial_number
            objDict["ap_model"] = apObj.ap_model
            objDict["hardware_version"] = apObj.hardware_version
            objDict["software_version"] = apObj.software_version
            objDict["description"] = apObj.description
            objDict["creation_date"] = apObj.creation_date
            objDict["modification_date"] = apObj.modification_date
            objList.append(objDict)
            
        print(objList, file=sys.stderr)
        return jsonify(objList), 200

    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500
    
