from flask_jsonpify import jsonify
import json
from flask import request, make_response

import sys
import traceback
import gzip

from app import app
from app.atom.atom_utils import *
from app.middleware import token_required
from app.utilities.db_utils import *


@app.route("/addAtomDevice", methods=['POST'])
@token_required
def AddAtomDevice(user_data):
    try:
        atomObj = request.get_json()
        response, status = AddCompleteAtom(atomObj, 0)

        if status == 500:
            response, status = AddTansitionAtom(atomObj,0)

        return response, status
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return "Server Error", 500


@app.route("/addAtomDevices", methods=['POST'])
@token_required
def AddAtomDevices(user_data):
    errorList = []
    responseList = []

    try:
        atomObjs = request.get_json()
        row = 0
        for atomObj in atomObjs:
            row = row + 1
            response, status = AddCompleteAtom(atomObj, row)

            if status == 200:
                responseList.append(response)
            else:
                response, status = AddTansitionAtom(atomObj, row)
                if status == 200:
                    responseList.append(response)
                else:
                    errorList.append(response)


        responseDict = {
            "success": len(responseList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": responseList
        }

        return jsonify(responseDict), 200
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return "Server Error", 500


@app.route("/getAtoms", methods=['GET'])
@token_required
def GetAtoms(user_data):
    try:

        try:
            transitionList = GetTransitionAtoms()
        except Exception:
            traceback.print_exc()

        atomObjList = []
        result = db.session.query(AtomTable, RackTable, SiteTable, PasswordGroupTable). \
            join(PasswordGroupTable, AtomTable.password_group == PasswordGroupTable.password_group). \
            join(RackTable, AtomTable.rack_id == RackTable.rack_id). \
            join(SiteTable, RackTable.site_id == SiteTable.site_id).all()

        for atomObj, rackObj, siteObj, passObj in result:
            atomDataDict = {'atom_id': atomObj.atom_id, 'site_name': siteObj.site_name,
                            'rack_name': rackObj.rack_name, 'device_name': atomObj.device_name,
                            'ip_address': atomObj.ip_address, 'device_ru': atomObj.device_ru,
                            'department': atomObj.department, 'section': atomObj.section,
                            'function': atomObj.function, 'virtual': atomObj.virtual,
                            'device_type': atomObj.device_type, 'password_group': passObj.password_group,
                            'updated': atomObj.updated, 'inserted': atomObj.inserted,
                            'exception': atomObj.exception}
            if atomObj.onboard_status != '' or atomObj.onboard_status is not None:
                atomDataDict['onboard_status'] = atomObj.onboard_status
            else:
                atomDataDict['onboard_status'] = 'False'
            
            atomDataDict['message'] = "Complete"
            atomDataDict['status'] = 200

            atomObjList.append(atomDataDict)

        # print(atomObjList, file=sys.stderr)
        finalList = atomObjList + transitionList
        content = gzip.compress(json.dumps(finalList).encode('utf8'), 5)
        response = make_response(content)
        response.headers['Content-length'] = len(content)
        response.headers['Content-Encoding'] = 'gzip'
        return response

    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/editAtom", methods=['POST'])
@token_required
def EditAtom(user_data):
    try:
        atomObj = request.get_json()
        response, status = AddCompleteAtom(atomObj, 1)

        if status == 500:
            response, status = AddTansitionAtom(atomObj,1)

        return response, status
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return "Server Error", 500