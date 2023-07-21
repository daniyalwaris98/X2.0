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
        response, status = AddCompleteAtom(atomObj, 0, False)

        if status == 500:
            response, status = AddTansitionAtom(atomObj,0, False)

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
            if 'ip_address' not in atomObj:
                errorList.append(f"Row {row} : IP Address Can Not Be Empty")
                continue
        
            if atomObj['ip_address'] is None:
                errorList.append(f"Row {row} : IP Address Can Not Be Empty")
                continue
            
            atomObj['ip_address'] = atomObj['ip_address'].strip()
            if atomObj['ip_address'] == "":
                errorList.append(f"Row {row} : IP Address Can Not Be Empty")
                continue

            atom = Atom_Table.query.filter_by(ip_address=atomObj['ip_address']).first()
            transitAtom = Atom_Transition_Table.query.filter_by(ip_address=atomObj['ip_address']).first()

            status = 500
            msg = ""
            if atom is not None:
                msg, status = AddCompleteAtom(atomObj, row, True)
            elif transitAtom is not None:
                msg, status = AddTansitionAtom(atomObj, row, True)
            else:
                msg, status = AddCompleteAtom(atomObj, row, False)

                if status == 500:
                    msg, status = AddTansitionAtom(atomObj, row, False)

            if status == 200:
                responseList.append(msg)
            else:
                errorList.append(msg)


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
        result = db.session.query(Atom_Table, Rack_Table, Site_Table, Password_Group_Table). \
            join(Password_Group_Table, Atom_Table.password_group == Password_Group_Table.password_group). \
            join(Rack_Table, Atom_Table.rack_id == Rack_Table.rack_id). \
            join(Site_Table, Rack_Table.site_id == Site_Table.site_id).all()

        for atomObj, rackObj, siteObj, passObj in result:
            atomDataDict = {'atom_id': atomObj.atom_id, 'site_name': siteObj.site_name,
                            'rack_name': rackObj.rack_name, 'device_name': atomObj.device_name,
                            'ip_address': atomObj.ip_address, 'device_ru': atomObj.device_ru,
                            'department': atomObj.department, 'section': atomObj.section,
                            'function': atomObj.function, 'virtual': atomObj.virtual,
                            'device_type': atomObj.device_type, 'password_group': passObj.password_group,
                            'creation_date': str(atomObj.creation_date), 'modification_date' : str(atomObj.modification_date)}
            
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
        response, status = AddCompleteAtom(atomObj, 1, True)

        if status == 500:
            response, status = AddTansitionAtom(atomObj,1, True)

        return response, status
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return "Server Error", 500
    

@app.route('/deleteAtom', methods=['POST'])
@token_required
def DeleteAtom(user_data):
    if True:
        try:
            ips = request.get_json()
            ipList = []
            deletionResponse = False
            errorResponse = False
            responses = []
            queryString = "select IP_ADDRESS from device_table;"
            result = db.session.execute(queryString)
            for row in result:
                ipList.append(row[0])

            for ip in ips:
                if ip in ipList:
                    queryString = f"select STATUS from device_table where IP_ADDRESS='{ip}';"
                    result = db.session.execute(queryString)
                    for row in result:
                        if row[0] == 'Dismantled':
                            queryString = f"delete from atom_table where ip_address='{ip}';"
                            db.session.execute(queryString)
                            db.session.commit()
                            queryString = f"delete from device_table where ip_address='{ip}';"
                            db.session.execute(queryString)
                            db.session.commit()
                            deletionResponse = 'deletionResponse'
                            responses.append(deletionResponse)
                        if row[0] == 'Production':
                            errorResponse = 'errorResponse'
                            responses.append(errorResponse)
                else:
                    queryString = f"delete from atom_table where ip_address='{ip}';"
                    db.session.execute(queryString)
                    db.session.commit()
                    deletionResponse = 'deletionResponse'
                    responses.append(deletionResponse)
            responses = set(responses)
            responses = list(responses)
            if len(responses) == 1:
                if responses[0] == 'deletionResponse':
                    return "ATOMS DELETED SUCCESSFULLY", 200
                if responses[0] == 'errorResponse':
                    return "ERROR! DEVICE IS IN PRODUCTION", 500
            elif len(responses) > 1:
                return "SOME ATOMS ARE DELETED", 200

            return "DELETE SUCCESSFULLY", 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503
