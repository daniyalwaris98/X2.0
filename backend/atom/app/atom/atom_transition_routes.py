from flask_jsonpify import jsonify
from flask import request

from app import app
from app.middleware import token_required
from app.models.inventory_models import *
from app.atom.atom_utils import *

import traceback
import sys


# @app.route("/addTransitionAtom", methods=["POST"])
# @token_required
# def AddTransitionAtom(user_data):
#     try:
#         deviceObjs = request.get_json()
#         errorList = []
#         successList = []
#         try:
#             row = 0
#             for device in deviceObjs:
#                 row = row + 1

#                 msg, status = AddTansitionAtom(device, row)

#                 if status == 200:
#                     successList.append(msg)
#                 else:
#                     errorList.append(msg)

#             responseDict = {
#                 "success": len(successList),
#                 "error": len(errorList),
#                 "error_list": errorList,
#                 "success_list": successList,
#             }

#             return jsonify(responseDict), 200
#         except Exception as e:
#             traceback.print_exc()
#             print(f"Error While Fetching Transition Table", file=sys.stderr)
#             return "Error While Moving Data", 500

#     except Exception:
#         traceback.print_exc()
#         return "Error While Moving Data", 500


@app.route("/transitDicoveryData", methods=["POST"])
@token_required
def TransitDicoveryData(user_data):
    try:
        ipList = request.get_json()
        errorList = []
        successList = []
        
        deviceObjs = []
        try:
            for ip in ipList:
                device = AUTO_DISCOVERY_TABLE.query.filter_by(ip_address=ip).first()
                if device is None:
                    errorList.append(f"{device['ip_address']} : Error - IP Address Not Found In Discovery Data")
                else:
                    deviceObjs.append(device.as_dict())
        except Exception:
            traceback.print_exc()
            print(f"Error While Fetching Discovery Data", file=sys.stderr)
            return "Error While Fetching Discovery Data", 500

        try:
            row = 0
            for device in deviceObjs:
                device['device_type'] = device['os_type']
                row = row + 1

                msg, status = AddTansitionAtom(device, row)

                if status == 200:
                    successList.append(msg)
                else:
                    errorList.append(msg)

            responseDict = {
                "success": len(successList),
                "error": len(errorList),
                "error_list": errorList,
                "success_list": successList,
            }

            return jsonify(responseDict), 200
        except Exception as e:
            traceback.print_exc()
            print(f"Error While Fetching Transition Table Data", file=sys.stderr)
            return "Error While Moving Data", 500

    except Exception:
        traceback.print_exc()
        return "Error While Moving Data", 500



# @app.route("/getTransitionData", methods=["GET"])
# @token_required
# def GetTransitionData(user_data):
#     try:
#         objList = []
#         results = Atom_Transition_Table.query.all()

#         for result in results:
#             objDict = result.as_dict()
#             msg, status = ValidateAtom(objDict,1)
#             objDict['message'] = msg
#             objDict['status'] = status
#             objList.append(objDict)

#         return jsonify(objList), 200

#     except Exception:
#         traceback.print_exc()
#         return "Error While Fetching Data", 500


# @app.route("/transitToAtom", methods=["GET"])
# @token_required
# def TransitToAtom(user_data):
#     try:
#         ipList = request.get_json()
#         errorList = []
#         successList = []
        
#         deviceObjs = []
#         try:
#             for ip in ipList:
#                 device = Atom_Transition_Table.query.filter_by(ip_address=ip).first()
#                 if device is None:
#                     errorList.append(f"{device['ip_address']} : Error - IP Address Not Found In Atom Transition Table")
#                 else:
#                     deviceObjs.append(device.as_dict())
#         except Exception:
#             traceback.print_exc()
#             print(f"Error While Fetching Transition Data", file=sys.stderr)
#             return "Error While Fetching Transition Data", 500

#         try:
#             row = 0
#             for device in deviceObjs:
#                 row = row + 1

#                 msg, status = TransitToAtom(device, row)

#                 if status == 200:
#                     successList.append(msg)
#                 else:
#                     errorList.append(msg)

#             responseDict = {
#                 "success": len(successList),
#                 "error": len(errorList),
#                 "error_list": errorList,
#                 "success_list": successList,
#             }

#             return jsonify(responseDict), 200
#         except Exception as e:
#             traceback.print_exc()
#             print(f"Error While Fetching Transition Table Data", file=sys.stderr)
#             return "Error While Moving Data", 500

#     except Exception:
#         traceback.print_exc()
#         return "Error While Moving Data", 500


# @app.route("/editTransitionData", methods=["POST"])
# @token_required
# def EditTransitionData(user_data):
#     pass




def GetAtomList():
    atomList = []
    try:
        devices = Atom.query.all()
        for device in devices:
            atomList.append(device.ip_address)
    except Exception:
        traceback.print_exc()

    return atomList

def GetTransitionAtomList():
    atomList = []
    try:
        devices = Atom_Transition_Table.query.all()
        for device in devices:
            atomList.append(device.ip_address)
    except Exception:
        traceback.print_exc()

    return atomList


@app.route("/getDiscoveryForTransition", methods=['POST'])
@token_required
def GetDiscoveryForTransition(user_data):
    try:
        data = request.get_json()
        if 'subnet' not in data.keys(): 
            return "Subnet is missing", 500

        discoveryList = []
        atomList = GetAtomList()
        transitionList = GetTransitionAtomList()
        
        results = None
        if data['subnet'].strip() == 'All' or data['subnet'].strip() == '':
            results = AUTO_DISCOVERY_TABLE.query.all()
        else:
            results = AUTO_DISCOVERY_TABLE.query.filter_by(subnet=data['subnet']).all()

        for result in results:

            if result.ip_address not in atomList:
                discoveryList.append(result.as_dict())

        return jsonify(discoveryList), 200
    except Exception:
        traceback.print_exc()
        return "Error While Fetching Data", 500
