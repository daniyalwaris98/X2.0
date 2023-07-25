from app import app
from app.models.inventory_models import *
from app.middleware import token_required
from app.uam.uam_utils import *

from flask_jsonpify import jsonify
from flask import request

import traceback


@app.route("/getAllDevices", methods=["GET"])
@token_required
def getAllUamDevices(user_data):
    try:
        return jsonify(GetAllUamDevices()), 200
    except Exception:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/deleteDevice", methods=["POST"])
@token_required
def deleteUamDevice(user_data):
    try:
        success_list = []
        error_list = []
        deviceNames = request.get_json()

        for deviceName in deviceNames:
            msg, status = DeleteUamDevice(deviceName)
            if status == 200:
                success_list.append(msg)
            else:
                error_list.append(msg)
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


# @app.route("/addDevice", methods=["POST"])
# @token_required
# def AddDevice(user_data):
#     if True:
#         try:
#             deviceObj = request.get_json()
#             device = Device_Table()
#             device.device_name = deviceObj["device_name"]
#             device.site_name = deviceObj["site_name"]
#             device.rack_name = deviceObj["rack_name"]
#             device.ip_address = deviceObj["ip_address"]
#             # device.device_type = deviceObj['device_type']
#             device.software_type = deviceObj["software_type"]
#             device.software_version = deviceObj["software_version"]
#             # device.patch_version = deviceObj['patch_version']
#             device.creation_date = datetime.now()
#             device.modification_date = datetime.now()
#             device.status = deviceObj["status"]
#             device.ru = deviceObj["ru"]
#             device.department = deviceObj["department"]
#             device.section = deviceObj["section"]
#             # device.criticality = deviceObj['criticality']
#             device.function = deviceObj["function"]
#             # device.domain = deviceObj['domain']
#             device.manufacturer = deviceObj["manufacturer"]
#             device.virtual = deviceObj["virtual"]
#             device.authentication = deviceObj["authentication"]
#             device.serial_number = deviceObj["serial_number"]
#             device.pn_code = deviceObj["pn_code"]
#             device.subrack_id_number = deviceObj["subrack_id_number"]
#             # device.max_power = deviceObj['max_power']
#             # device.site_type = deviceObj['site_type']
#             device.source = deviceObj["source"]
#             device.stack = deviceObj["stack"]
#             device.contract_number = deviceObj["contract_number"]

#             if (
#                 Device_Table.query.with_entities(Device_Table.ip_address)
#                 .filter_by(ip_address=deviceObj["ip_address"])
#                 .first()
#                 is not None
#             ):
#                 device.device_name = (
#                     Device_Table.query.with_entities(Device_Table.device_name)
#                     .filter_by(ip_address=deviceObj["ip_address"])
#                     .first()[0]
#                 )
#                 print(
#                     f"UPDATED {deviceObj['device_name']} WITH IP ",
#                     deviceObj["ip_address"],
#                     "SUCCESSFULLY",
#                     file=sys.stderr,
#                 )
#                 UpdateData(device)

#             else:
#                 print(
#                     f"Inserted {deviceObj['device_name']} WITH IP ",
#                     deviceObj["ip_address"],
#                     "SUCCESSFULLY",
#                     file=sys.stderr,
#                 )
#                 InsertData(device)

#             flag = "False"
#             if deviceObj["status"] == "Production":
#                 flag = "true"

#             query = f"update atom_table set `ONBOARD_STATUS`='{flag}' where `device_name`='{deviceObj['device_name']}';"
#             db.session.execute(query)
#             db.session.commit()

#             return jsonify({"response": "success", "code": "200"}), 200
#         except Exception as e:
#             traceback.print_exc()
#             return jsonify({"response": "Error", "code": "500"}), 500
#     else:
#         print("Service not Available", file=sys.stderr)
#         return jsonify({"Response": "Service not Available"}), 503


# @app.route("/editDevice", methods=["POST"])
# @token_required
# def EditDevice(user_data):
#     if True:
#         try:
#             deviceObj = request.get_json()

#             device = (
#                 Device_Table.query.with_entities(Device_Table)
#                 .filter_by(device_name=deviceObj["device_name"])
#                 .first()
#             )

#             # device.device_name = deviceObj['device_name']
#             device.site_name = deviceObj["site_name"]
#             device.rack_name = deviceObj["rack_name"]
#             # device.ip_address = deviceObj['ip_address']
#             # device.software_type = deviceObj['software_type']
#             device.software_version = deviceObj["software_version"]
#             # device.patch_version = deviceObj['patch_version']
#             device.modification_date = datetime.now()
#             # device.status = deviceObj['status']
#             device.ru = deviceObj["ru"]
#             device.department = deviceObj["department"]
#             device.section = deviceObj["section"]
#             device.criticality = deviceObj["criticality"]
#             device.function = deviceObj["function"]
#             # device.domain = deviceObj['domain']
#             device.manufacturer = deviceObj["manufacturer"]
#             # device.hw_eos_date = (deviceObj['hw_eos_date'])
#             # device.hw_eol_date = (deviceObj['hw_eol_date'])
#             # device.sw_eos_date = (deviceObj['sw_eos_date'])
#             # device.sw_eol_date = (deviceObj['sw_eol_date'])
#             device.virtual = deviceObj["virtual"]
#             # device.rfs_date = (deviceObj['rfs_date'])
#             device.authentication = deviceObj["authentication"]
#             device.serial_number = deviceObj["serial_number"]
#             device.pn_code = deviceObj["pn_code"]
#             device.subrack_id_number = deviceObj["subrack_id_number"]
#             # device.manufacturer_date = (deviceObj['manufacturer_date'])
#             # device.max_power = deviceObj['max_power']
#             # device.site_type = deviceObj['site_type']
#             device.source = deviceObj["source"]
#             device.stack = deviceObj["stack"]
#             device.contract_number = deviceObj["contract_number"]
#             # device.contract_expiry = deviceObj['contract_expiry']

#             UpdateData(device)
#             print("Updated Device " + deviceObj["device_name"], file=sys.stderr)

#             # Updating device parameters in Atom
#             queryString = f"update atom_table set SITE_NAME='{deviceObj['site_name']}' where DEVICE_NAME='{deviceObj['device_name']}';"
#             db.session.execute(queryString)
#             db.session.commit()
#             print(
#                 f"SITE NAME SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}",
#                 file=sys.stderr,
#             )

#             queryString = f"update atom_table set RACK_NAME='{deviceObj['rack_name']}' where DEVICE_NAME='{deviceObj['device_name']}';"
#             db.session.execute(queryString)
#             db.session.commit()
#             print(
#                 f"RACK NAME SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}",
#                 file=sys.stderr,
#             )

#             # queryString = f"update atom_table set STATUS='{device.status}' where DEVICE_NAME='{deviceObj['device_name']}';"
#             # db.session.execute(queryString)
#             # db.session.commit()
#             # print(f"STATUS SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}",file=sys.stderr)

#             queryString = f"update atom_table set DEPARTMENT='{deviceObj['department']}' where DEVICE_NAME='{deviceObj['device_name']}';"
#             db.session.execute(queryString)
#             db.session.commit()
#             print(
#                 f"DEPARTMENT SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}",
#                 file=sys.stderr,
#             )

#             queryString = f"update atom_table set SECTION='{deviceObj['section']}' where DEVICE_NAME='{deviceObj['device_name']}';"
#             db.session.execute(queryString)
#             db.session.commit()
#             print(
#                 f"SECTION SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}",
#                 file=sys.stderr,
#             )

#             queryString = f"update atom_table set `FUNCTION`='{deviceObj['function']}' where DEVICE_NAME='{deviceObj['device_name']}';"
#             db.session.execute(queryString)
#             db.session.commit()
#             print(
#                 f"FUNCTION SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}",
#                 file=sys.stderr,
#             )

#             queryString = f"update atom_table set `VIRTUAL`='{deviceObj['virtual']}' where DEVICE_NAME='{deviceObj['device_name']}';"
#             db.session.execute(queryString)
#             db.session.commit()
#             print(
#                 f"VIRTUAL SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}",
#                 file=sys.stderr,
#             )

#             # Updating Modules
#             queryString = f"update board_table set SOFTWARE_VERSION='{deviceObj['software_version']}' DEVICE_NAME='{deviceObj['device_name']}';"
#             db.session.execute(queryString)
#             db.session.commit()
#             print(
#                 f"SOFTWARE VERSION SUCCESSFULLY UPDATED IN MODULES FOR {deviceObj['device_name']}"
#             )

#             return "Device Updated Successfully", 200

#         except Exception as e:
#             traceback.print_exc()
#             return str(e), 500

#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({"message": "Authentication Failed"}), 401


@app.route("/deviceStatus", methods=["GET"])
@token_required
def DeviceStatus(user_data):
    try:
        objList = [
            {"name": "Production", "value": 0},
            {"name": "Dismantled", "value": 0},
            {"name": "Maintenance", "value": 0},
            {"name": "Undefined", "value": 0},
        ]

        query = f"select count(*) from uam_device_table;"
        result0 = db.session.execute(query).scalar()
        if result0 != 0:
            
            queryString = (
                f"select count(status) from uam_device_table where STATUS='Production';"
            )
            result = db.session.execute(queryString).scalar()
            queryString1 = (
                f"select count(status) from uam_device_table where STATUS='Dismantled';"
            )
            result1 = db.session.execute(queryString1).scalar()
            queryString2 = (
                f"select count(status) from uam_device_table where STATUS='Maintenance';"
            )
            result2 = db.session.execute(queryString2).scalar()
            queryString3 = (
                f"select count(status) from uam_device_table where STATUS='Undefined';"
            )
            result3 = db.session.execute(queryString3).scalar()
            objList = [
                {"name": "Production", "value": round(((result / result0) * 100), 2)},
                {"name": "Dismantled", "value": round(((result1 / result0) * 100), 2)},
                {"name": "Maintenance", "value": round(((result2 / result0) * 100), 2)},
                {"name": "Undefined", "value": round(((result3 / result0) * 100), 2)},
            ]

        print(objList, file=sys.stderr)
        
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/topFunctions", methods=["GET"])
@token_required
def TopFunctions(user_data):
    try:
        objList = []
        queryString = f"select `FUNCTION`,count(`FUNCTION`) from uam_device_table join atom_table on uam_device_table.atom_id = atom_table.atom_id where `FUNCTION`is not NULL and `FUNCTION`!='' group by `FUNCTION`;"
        result = db.session.execute(queryString)
        for row in result:
            objDict = {}
            function = row[0]
            count = row[1]
            objDict[function] = count
            objList.append(objDict)
        y = {}
        for i in objList:
            for j in i:
                y[j] = i[j]

        print(objList, file=sys.stderr)
        return (y), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500