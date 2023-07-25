from app import app
from app.models.inventory_models import *
from app.middleware import token_required


from flask_jsonpify import jsonify
from flask import request

import traceback
import sys
from datetime import datetime


def FormatDate(date):
    # print(date, file=sys.stderr)
    if date is not None:
        result = date.strftime("%d-%m-%Y")
    else:
        # result = datetime(2000, 1, 1)
        result = datetime(2000, 1, 1)

    return result



@app.route("/getAllBoards", methods=["GET"])
@token_required
def GetAllBoards(user_data):
    return jsonify(list()), 200
    try:
        boardObjList = []
        boardObjs = Board_Table.query.all()
        for boardObj in boardObjs:
            boardDataDict = {}
            boardDataDict["module_name"] = boardObj.board_name
            boardDataDict["device_name"] = boardObj.device_name
            boardDataDict["device_slot_id"] = boardObj.device_slot_id
            boardDataDict["software_version"] = boardObj.software_version
            # boardDataDict['hardware_version'] = boardObj.hardware_version
            boardDataDict["serial_number"] = boardObj.serial_number
            # boardDataDict['manufacturer_date'] = FormatDate(
            #     (boardObj.manufacturer_date))
            boardDataDict["creation_date"] = FormatDate((boardObj.creation_date))
            boardDataDict["modification_date"] = FormatDate(
                (boardObj.modification_date)
            )
            boardDataDict["status"] = boardObj.status
            boardDataDict["eos_date"] = FormatDate((boardObj.eos_date))
            boardDataDict["eol_date"] = FormatDate((boardObj.eol_date))
            # boardDataDict['rfs_date'] = FormatDate((boardObj.rfs_date))
            boardDataDict["pn_code"] = boardObj.pn_code

            boardObjList.append(boardDataDict)
        return jsonify(boardObjList), 200
    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route("/addBoard", methods=["POST"])
@token_required
def AddBoard(user_data):
    if True:
        try:
            boardObj = request.get_json()
            if (
                Device_Table.query.with_entities(Device_Table.device_name)
                .filter_by(device_name=boardObj["device_name"])
                .first()
                is not None
            ):
                board = Board_Table()
                board.board_name = boardObj["board_name"]
                board.device_name = boardObj["device_name"]
                board.device_slot_id = boardObj["device_slot_id"]
                board.software_version = boardObj["software_version"]
                # board.hardware_version = boardObj['hardware_version']
                board.serial_number = boardObj["serial_number"]
                # board.manufacturer_date = boardObj['manufacturer_date']
                board.creation_date = datetime.now()
                board.modification_date = datetime.now()
                board.status = boardObj["status"]
                board.eos_date = boardObj["eos_date"]
                board.eol_date = boardObj["eol_date"]
                # board.rfs_date = boardObj['rfs_date']
                board.pn_code = boardObj["pn_code"]
                InsertData(board)
                print("Inserted " + boardObj["board_name"], file=sys.stderr)
                return jsonify({"response": "success", "code": "200"})
            else:
                print("Service not Available", file=sys.stderr)
                return jsonify({"Response": "Service not Available"}), 503
        except Exception as e:
            traceback.print_exc()
            return str(e), 500


# @app.route('/addBoard',methods = ['POST'])
# def AddBoard():
#     if True:
#         boardObj = request.get_json()
#         if Device_Table.query.with_entities(Device_Table.board_name).filter_by(device_name=boardObj['device_name']).first() is not None:
#             board = Board_Table()
#             board.board_name = boardObj['board_name']
#             board.device_name = boardObj['device_name']
#             board.device_slot_id = boardObj['device_slot_id']
#             board.software_version = boardObj['software_version']
#             board.hardware_version = boardObj['hardware_version']
#             board.serial_number= boardObj['serial_number']
#             board.manufacturer_date = boardObj['manufacturer_date']
#             board.creation_date = datetime.now()
#             board.modification_date = datetime.now()
#             board.status = boardObj['status']
#             board.eos_date = boardObj['eos_date']
#             board.eol_date = boardObj['eol_date']
#             board.rfs_date = boardObj['rfs_date']
#             board.pn_code = boardObj['pn_code']
#             InsertData(board)
#             print("Inserted " +boardObj['board_name'],file=sys.stderr)
#             return jsonify({'response': "success","code":"200"})
#         else:
#             print("Service not Available",file=sys.stderr)
#             return jsonify({"Response":"Service not Available"}),503


@app.route("/editBoard", methods=["POST"])
@token_required
def EditBoard(user_data):
    if True:
        try:
            boardObj = request.get_json()
            print(boardObj, file=sys.stderr)

            board = (
                Board_Table.query.with_entities(Board_Table)
                .filter_by(board_name=boardObj["board_name"])
                .first()
            )

            board.rfs_date = FormatStringDate(boardObj["rfs_date"])

            board.modification_date = datetime.now()
            UpdateData(board)

            return jsonify({"response": "success", "code": "200"})
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({"message": "Authentication Failed"}), 401


@app.route("/getAllSubBoards", methods=["GET"])
@token_required
def GetAllSubBoards(user_data):
    return jsonify(list()), 200
    if True:
        try:
            subboardObjList = []
            subboardObjs = Subboard_Table.query.all()
            for subboardObj in subboardObjs:
                subboardDataDict = {}
                subboardDataDict["subboard_name"] = subboardObj.subboard_name
                subboardDataDict["device_name"] = subboardObj.device_name
                subboardDataDict["subboard_type"] = subboardObj.subboard_type
                subboardDataDict["subrack_id"] = subboardObj.subrack_id
                subboardDataDict["slot_number"] = subboardObj.slot_number
                subboardDataDict["subslot_number"] = subboardObj.subslot_number
                subboardDataDict["software_version"] = subboardObj.software_version
                # subboardDataDict['hardware_version'] = subboardObj.hardware_version
                subboardDataDict["serial_number"] = subboardObj.serial_number
                subboardDataDict["creation_date"] = FormatDate(
                    (subboardObj.creation_date)
                )
                subboardDataDict["modification_date"] = FormatDate(
                    (subboardObj.modification_date)
                )
                subboardDataDict["status"] = subboardObj.status
                subboardDataDict["eos_date"] = FormatDate((subboardObj.eos_date))
                subboardDataDict["eol_date"] = FormatDate((subboardObj.eol_date))
                # subboardDataDict['rfs_date'] = FormatDate(
                #     (subboardObj.rfs_date))
                subboardDataDict["pn_code"] = subboardObj.pn_code

                subboardObjList.append(subboardDataDict)
            return jsonify(subboardObjList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/editSubBoard", methods=["POST"])
@token_required
def EditSubBoard(user_data):
    if True:
        try:
            subBoardObj = request.get_json()
            print(subBoardObj, file=sys.stderr)

            subBoard = (
                Subboard_Table.query.with_entities(Subboard_Table)
                .filter_by(subboard_name=subBoardObj["subboard_name"])
                .first()
            )

            subBoard.rfs_date = FormatStringDate(subBoardObj["rfs_date"])

            subBoard.modification_date = datetime.now()
            UpdateData(subBoard)

            return jsonify({"response": "success", "code": "200"})
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({"message": "Authentication Failed"}), 401


@app.route("/getAllSfps", methods=["GET"])
@token_required
def GetAllSfps(user_data):
    return jsonify(list()), 200
    if True:
        try:
            sfpObjList = []
            sfpObjs = Sfps_Table.query.all()
            for sfpObj in sfpObjs:
                sfpDataDict = {}
                sfpDataDict["sfp_id"] = sfpObj.sfp_id
                sfpDataDict["device_name"] = sfpObj.device_name
                sfpDataDict["media_type"] = sfpObj.media_type
                sfpDataDict["port_name"] = sfpObj.port_name
                sfpDataDict["port_type"] = sfpObj.port_type
                # sfpDataDict['connector'] = sfpObj.connector
                sfpDataDict["mode"] = sfpObj.mode
                # sfpDataDict['speed'] = sfpObj.speed
                # sfpDataDict['wavelength'] = sfpObj.wavelength
                # sfpDataDict['manufacturer'] = sfpObj.manufacturer
                # sfpDataDict['optical_direction_type'] = sfpObj.optical_direction_type
                # sfpDataDict['pn_code'] = sfpObj.pn_code
                sfpDataDict["creation_date"] = FormatDate((sfpObj.creation_date))
                sfpDataDict["modification_date"] = FormatDate(
                    (sfpObj.modification_date)
                )
                sfpDataDict["status"] = sfpObj.status
                sfpDataDict["eos_date"] = FormatDate((sfpObj.eos_date))
                sfpDataDict["eol_date"] = FormatDate((sfpObj.eol_date))
                # sfpDataDict['rfs_date'] = FormatDate((sfpObj.rfs_date))
                sfpDataDict["serial_number"] = sfpObj.serial_number
                sfpObjList.append(sfpDataDict)
            return jsonify(sfpObjList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/editSfps", methods=["POST"])
@token_required
def EditSfps(user_data):
    if True:
        try:
            sfpsObj = request.get_json()
            print(sfpsObj, file=sys.stderr)
            sfps = (
                Sfps_Table.query.with_entities(Sfps_Table)
                .filter_by(sfp_id=sfpsObj["sfp_id"])
                .first()
            )

            sfps.rfs_date = FormatStringDate(sfpsObj["rfs_date"])

            sfps.modification_date = datetime.now()
            UpdateData(sfps)

            return jsonify({"response": "success", "code": "200"})
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({"message": "Authentication Failed"}), 401


@app.route("/getAllLicenses", methods=["GET"])
@token_required
def GetAllLicenses(user_data):
    return jsonify(list()), 200
    if True:
        try:
            licenseObjList = []
            licenseObjs = License_Table.query.all()
            for licenseObj in licenseObjs:
                licenseDataDict = {}
                licenseDataDict["license_name"] = licenseObj.license_name
                licenseDataDict["license_description"] = licenseObj.license_description
                licenseDataDict["device_name"] = licenseObj.device_name
                # licenseDataDict['rfs_date'] = ((licenseObj.rfs_date))
                licenseDataDict["activation_date"] = licenseObj.activation_date
                licenseDataDict["expiry_date"] = licenseObj.expiry_date
                # licenseDataDict['grace_period'] = ((licenseObj.grace_period))
                # licenseDataDict['serial_number'] = licenseObj.serial_number
                licenseDataDict["creation_date"] = FormatStringDate(
                    (licenseObj.creation_date)
                )
                licenseDataDict["modification_date"] = FormatStringDate(
                    (licenseObj.modification_date)
                )
                licenseDataDict["status"] = licenseObj.status
                # licenseDataDict['capacity'] = licenseObj.capacity
                # licenseDataDict['usage'] = licenseObj.usage
                licenseDataDict["pn_code"] = licenseObj.pn_code

                licenseObjList.append(licenseDataDict)
            return jsonify(licenseObjList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


# @app.route("/editLicenses", methods = ['POST'])
# def EditLicenses():
#     if True:
#         licensesObj = request.get_json()
#         print(licensesObj,file = sys.stderr)
#         licenses = License_Table.query.with_entities(License_Table).filter_by(license_name=licensesObj["license_name"]).first()

#         licenses.item_code = licensesObj['item_code']
#         licenses.item_desc = licensesObj['item_desc']
#         licenses.ciei = licensesObj['ciei']
#         licenses.modification_date= datetime.now()
#         UpdateData(licenses)

#         return jsonify({'response': "success","code":"200"})

#     else:
#         print("Service not Available",file=sys.stderr)
#         return jsonify({"Response":"Service not Available"}),503


@app.route("/dismantleOnBoardedDevice", methods=["POST"])
@token_required
def DismantleOnBoardDevice(user_data):
    if True:
        try:
            deviceIDs = request.get_json()
            print(deviceIDs, file=sys.stderr)
            for ip in deviceIDs:
                atomObj = db.session.query(Atom).filter_by(ip_address=ip).first()
                atomObj.onboard_status = "False"
                UpdateData(atomObj)
                print(f"Device {ip} ONBOARDED STATUS UPDATED IN ATOM", file=sys.stderr)
                deviceObj = (
                    db.session.query(Device_Table).filter_by(ip_address=ip).first()
                )

                # change status to dismantle in device table
                deviceObj.status = "Dismantled"
                deviceObj.modification_date = datetime.now()
                UpdateData(deviceObj)
                print(
                    f"DEVICE {deviceObj.device_name} SUCCESSFULLY DISMANTLED",
                    file=sys.stderr,
                )
                # change all board status
                boardObjs = db.session.query(Board_Table).filter_by(
                    device_name=deviceObj.device_name
                )
                for boardObj in boardObjs:
                    boardObj.status = "Dismantled"
                    boardObj.modification_date = datetime.now()
                    UpdateData(boardObj)
                    print(
                        f"MODULE {boardObj.board_name} SUCCESSFULLY DISMANTLED",
                        file=sys.stderr,
                    )
                # change all sub-board status
                subboardObjs = db.session.query(Subboard_Table).filter_by(
                    device_name=deviceObj.device_name
                )
                for subboardObj in subboardObjs:
                    subboardObj.status = "Dismantled"
                    subboardObj.modification_date = datetime.now()
                    UpdateData(subboardObj)
                    print(
                        f"STACK SWITCH {subboardObj.subboard_name} SUCCESSFULLY DISMANTLED",
                        file=sys.stderr,
                    )

                # change all SFP status
                sfpObjs = db.session.query(Sfps_Table).filter_by(
                    device_name=deviceObj.device_name
                )
                for sfpObj in sfpObjs:
                    sfpObj.status = "Dismantled"
                    sfpObj.modification_date = datetime.now()
                    UpdateData(sfpObj)
                    print(
                        f"DEVICE {sfpObj.sfp_id} SUCCESSFULLY DISMANTLED",
                        file=sys.stderr,
                    )

            return "SUCCESSFULLY DISMANTLED", 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({"message": "Authentication Failed"}), 401


@app.route("/maintenanceOnBoardedDevice", methods=["POST"])
@token_required
def MaintenanceOnBoardDevice(user_data):
    if True:
        try:
            deviceIDs = request.get_json()
            print(deviceIDs, file=sys.stderr)
            for ip in deviceIDs:
                atomObj = db.session.query(Atom).filter_by(ip_address=ip).first()
                atomObj.onboard_status = "False"
                UpdateData(atomObj)
                print(f"Device {ip} ONBOARDED STATUS UPDATED IN ATOM", file=sys.stderr)
                deviceObj = (
                    db.session.query(Device_Table).filter_by(ip_address=ip).first()
                )

                # change status to Maintenance in device table
                deviceObj.status = "Maintenance"
                deviceObj.modification_date = datetime.now()
                UpdateData(deviceObj)
                print(
                    f"DEVICE {deviceObj.device_name} SUCCESSFULLY under Maintenance",
                    file=sys.stderr,
                )
                # change all board status
                boardObjs = db.session.query(Board_Table).filter_by(
                    device_name=deviceObj.device_name
                )
                for boardObj in boardObjs:
                    boardObj.status = "Maintenance"
                    boardObj.modification_date = datetime.now()
                    UpdateData(boardObj)
                    print(
                        f"MODULE {boardObj.board_name} SUCCESSFULLY under Maintenance",
                        file=sys.stderr,
                    )
                # change all sub-board status
                subboardObjs = db.session.query(Subboard_Table).filter_by(
                    device_name=deviceObj.device_name
                )
                for subboardObj in subboardObjs:
                    subboardObj.status = "Maintenance"
                    subboardObj.modification_date = datetime.now()
                    UpdateData(subboardObj)
                    print(
                        f"STACK SWITCH {subboardObj.subboard_name} SUCCESSFULLY under Maintenance",
                        file=sys.stderr,
                    )

                # change all SFP status
                sfpObjs = db.session.query(Sfps_Table).filter_by(
                    device_name=deviceObj.device_name
                )
                for sfpObj in sfpObjs:
                    sfpObj.status = "Maintenance"
                    sfpObj.modification_date = datetime.now()
                    UpdateData(sfpObj)
                    print(
                        f"DEVICE {sfpObj.sfp_id} SUCCESSFULLY under Maintenance",
                        file=sys.stderr,
                    )

            return "SUCCESSFULLY Under Maintenance", 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({"message": "Authentication Failed"}), 401


@app.route("/undefinedOnBoardedDevice", methods=["POST"])
@token_required
def UndefinedOnBoardDevice(user_data):
    if True:
        try:
            deviceIDs = request.get_json()
            print(deviceIDs, file=sys.stderr)
            for ip in deviceIDs:
                atomObj = db.session.query(Atom).filter_by(ip_address=ip).first()
                atomObj.onboard_status = "False"
                UpdateData(atomObj)
                print(f"Device {ip} ONBOARDED STATUS UPDATED IN ATOM", file=sys.stderr)
                deviceObj = (
                    db.session.query(Device_Table).filter_by(ip_address=ip).first()
                )

                # change status to Maintenance in device table
                deviceObj.status = "Undefined"
                deviceObj.modification_date = datetime.now()
                UpdateData(deviceObj)
                print(
                    f"DEVICE {deviceObj.device_name} SUCCESSFULLY under Undefined state",
                    file=sys.stderr,
                )
                # change all board status
                boardObjs = db.session.query(Board_Table).filter_by(
                    device_name=deviceObj.device_name
                )
                for boardObj in boardObjs:
                    boardObj.status = "Undefined"
                    boardObj.modification_date = datetime.now()
                    UpdateData(boardObj)
                    print(
                        f"MODULE {boardObj.board_name} SUCCESSFULLY under Undefined state",
                        file=sys.stderr,
                    )
                # change all sub-board status
                subboardObjs = db.session.query(Subboard_Table).filter_by(
                    device_name=deviceObj.device_name
                )
                for subboardObj in subboardObjs:
                    subboardObj.status = "Undefined"
                    subboardObj.modification_date = datetime.now()
                    UpdateData(subboardObj)
                    print(
                        f"STACK SWITCH {subboardObj.subboard_name} SUCCESSFULLY under Undefined state",
                        file=sys.stderr,
                    )

                # change all SFP status
                sfpObjs = db.session.query(Sfps_Table).filter_by(
                    device_name=deviceObj.device_name
                )
                for sfpObj in sfpObjs:
                    sfpObj.status = "Undefined"
                    sfpObj.modification_date = datetime.now()
                    UpdateData(sfpObj)
                    print(
                        f"DEVICE {sfpObj.sfp_id} SUCCESSFULLY under Undefined state",
                        file=sys.stderr,
                    )

            return "SUCCESSFULLY Under Undefined state", 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({"message": "Authentication Failed"}), 401


@app.route("/getAllAps", methods=["GET"])
@token_required
def GetAllAps(user_data):
    return jsonify(list()), 200
    if True:
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
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({"message": "Authentication Failed"}), 401
