from app import app
from app.models.inventory_models import *
from app.middleware import token_required
from app.uam.uam_utils import *
from app.uam.module_utils import *

from flask_jsonpify import jsonify
from flask import request


import traceback


@app.route("/getBoardDetailsByIpAddress", methods=["GET"])
@token_required
def GetBoardDetailsByIpAddress(user_data):
    try:
        ip_address = None
        try:
            ip_address = request.args.get("ipaddress")
        except Exception:
            traceback.print_exc()
            return "Ip Address Is Missing From URL", 500

        if ip_address is not None:

            results = (
                db.session.query(Board_Table, UAM_Device_Table, Atom_Table)
                .join(UAM_Device_Table, Board_Table.uam_id == UAM_Device_Table.uam_id)
                .join(Atom_Table, UAM_Device_Table.atom_id == Atom_Table.atom_id)
                .filter(Atom_Table.ip_address == ip_address)
                .all()
            )

            objList = []

            for board, uam, atom in results:
                try:
                    objDict = {}
                    objDict["board_name"] = board.board_name
                    objDict["device_name"] = atom.device_name
                    objDict["device_slot_id"] = board.device_slot_id
                    objDict["software_version"] = board.software_version
                    objDict["serial_number"] = board.serial_number
                    objDict["creation_date"] = FormatDate(board.creation_date)
                    objDict["modification_date"] = FormatDate(board.modification_date)
                    objDict["status"] = board.status
                    objDict["eos_date"] = FormatDate(board.eos_date)
                    objDict["eol_date"] = FormatDate(board.eol_date)
                    objDict["pn_code"] = board.pn_code
                    objList.append(objDict)

                except Exception as e:
                    traceback.print_exc()

            return jsonify(objList), 200
        else:
            print("Ip Address Missing From URL", file=sys.stderr)
            return "Ip Address Missing From URL", 500
    except Exception as e:
        traceback.print_exc()
        return "Erro While Fetching Board Data", 500


@app.route("/getSubBoardDetailsByIpAddress", methods=["GET"])
@token_required
def GetSubBoardDetailsByIpAddress(user_data):
    try:
        ip_address = None
        try:
            ip_address = request.args.get("ipaddress")
        except Exception:
            traceback.print_exc()
            return "Ip Address Is Missing From URL", 500

        if ip_address is not None:
            results = (
                db.session.query(Subboard_Table, UAM_Device_Table, Atom_Table)
                .join(
                    UAM_Device_Table,
                    Subboard_Table.uam_id == UAM_Device_Table.uam_id,
                )
                .join(Atom_Table, UAM_Device_Table.atom_id == Atom_Table.atom_id)
                .filter(Atom_Table.ip_address == ip_address)
                .all()
            )

            objList = []
            for suboard, uam, atom in results:
                try:
                    objDict = {}
                    objDict["subboard_name"] = suboard.subboard_name
                    objDict["device_name"] = atom.device_name
                    objDict["subboard_type"] = suboard.subboard_type
                    objDict["subrack_id"] = suboard.subrack_id
                    objDict["slot_number"] = suboard.slot_number
                    objDict["subslot_number"] = suboard.subslot_number
                    objDict["software_version"] = suboard.software_version
                    # objDict['hardware_version'] = hardware_version
                    objDict["serial_number"] = suboard.serial_number
                    objDict["creation_date"] = FormatDate(suboard.creation_date)
                    objDict["modification_date"] = FormatDate(suboard.modification_date)
                    objDict["status"] = suboard.status
                    objDict["eos_date"] = FormatDate(suboard.eos_date)
                    objDict["eol_date"] = FormatDate(suboard.eol_date)
                    # objDict['rfs_date'] = FormatDate((rfs_date))
                    objDict["pn_code"] = suboard.pn_code
                    objList.append(objDict)

                except Exception as e:
                    traceback.print_exc()

            return jsonify(objList), 200

        else:
            print("Can not Get Ip Address from URL", file=sys.stderr)
            return "Ip Address Missing From URL", 500
    except Exception:
        traceback.print_exc()
        return "Server Error While Fetching Sub-Board Data", 500


@app.route("/getAllBoards", methods=["GET"])
@token_required
def GetAllBoards(user_data):
    try:
        boardObjList = []

        results = (
            db.session.query(Board_Table, UAM_Device_Table, Atom_Table)
            .join(UAM_Device_Table, Board_Table.uam_id == UAM_Device_Table.uam_id)
            .join(Atom_Table, UAM_Device_Table.atom_id == Atom_Table.atom_id)
            .all()
        )

        for boardObj, uam, atom in results:
            try:
                boardDataDict = {}
                boardDataDict["module_name"] = boardObj.board_name
                boardDataDict["device_name"] = atom.device_name
                boardDataDict["device_slot_id"] = boardObj.device_slot_id
                boardDataDict["software_version"] = boardObj.software_version
                # boardDataDict['hardware_version'] = boardObj.hardware_version
                boardDataDict["serial_number"] = boardObj.serial_number
                # boardDataDict['manufacturer_date'] = FormatDate(
                #     (boardObj.manufacturer_date))
                boardDataDict["creation_date"] = FormatDate(boardObj.creation_date)
                boardDataDict["modification_date"] = FormatDate(
                    boardObj.modification_date
                )

                boardDataDict["status"] = boardObj.status
                boardDataDict["eos_date"] = FormatDate(boardObj.eos_date)
                boardDataDict["eol_date"] = FormatDate(boardObj.eol_date)
                # boardDataDict['rfs_date'] = FormatDate((boardObj.rfs_date))
                boardDataDict["pn_code"] = boardObj.pn_code

                boardObjList.append(boardDataDict)
            except Exception:
                traceback.print_exc()

        return jsonify(boardObjList), 200

    except Exception as e:
        traceback.print_exc()
        return "Error While Getting Board Data", 500


@app.route("/getAllSubBoards", methods=["GET"])
@token_required
def GetAllSubBoards(user_data):
    try:
        subboardObjList = []

        results = (
            db.session.query(Subboard_Table, UAM_Device_Table, Atom_Table)
            .join(
                UAM_Device_Table,
                Subboard_Table.uam_id == UAM_Device_Table.uam_id,
            )
            .join(Atom_Table, UAM_Device_Table.atom_id == Atom_Table.atom_id)
            .all()
        )

        for subboardObj, uam, atom in results:
            try:
                subboardDataDict = {}
                subboardDataDict["subboard_name"] = subboardObj.subboard_name
                subboardDataDict["device_name"] = atom.device_name
                subboardDataDict["subboard_type"] = subboardObj.subboard_type
                subboardDataDict["subrack_id"] = subboardObj.subrack_id
                subboardDataDict["slot_number"] = subboardObj.slot_number
                subboardDataDict["subslot_number"] = subboardObj.subslot_number
                subboardDataDict["software_version"] = subboardObj.software_version
                # subboardDataDict['hardware_version'] = subboardObj.hardware_version
                subboardDataDict["serial_number"] = subboardObj.serial_number
                subboardDataDict["creation_date"] = FormatDate(
                    subboardObj.creation_date
                )

                subboardDataDict["modification_date"] = FormatDate(
                    subboardObj.modification_date
                )

                subboardDataDict["status"] = subboardObj.status
                subboardDataDict["eos_date"] = FormatDate(subboardObj.eos_date)
                subboardDataDict["eol_date"] = FormatDate(subboardObj.eol_date)
                # subboardDataDict['rfs_date'] = FormatDate(
                #     (subboardObj.rfs_date))
                subboardDataDict["pn_code"] = subboardObj.pn_code

                subboardObjList.append(subboardDataDict)
            except Exception:
                traceback.print_exc()

        return jsonify(subboardObjList), 200

    except Exception as e:
        traceback.print_exc()
        return "Error While Getting Sub-Board Data", 500


@app.route("/addBoard", methods=["POST"])
@token_required
def addBoard(user_data):
    try:
        boardObj = request.get_json()
        
        msg, status = AddBoard(boardObj)
        
        print(msg, file=sys.stderr)
        
        return msg, status
        
    except Exception:
        traceback.print_exc()
        return "Server Error", 500    


@app.route("/editBoard", methods=["POST"])
@token_required
def EditBoard(user_data):
    try:
        boardObj = request.get_json()
        print(boardObj, file=sys.stderr)

        board = (
            Board_Table.query.with_entities(Board_Table)
            .filter_by(board_name=boardObj["board_name"])
            .first()
        )

        board.rfs_date = FormatStringDate(boardObj["rfs_date"])
        
        if UpdateDBData(board) == 200:
            return "Board Updated Successfully", 200
        else:
            return "Error While Updating Board", 500
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500




@app.route("/editSubBoard", methods=["POST"])
@token_required
def EditSubBoard(user_data):
    try:
        subBoardObj = request.get_json()
        print(subBoardObj, file=sys.stderr)

        subBoard = (
            Subboard_Table.query.with_entities(Subboard_Table)
            .filter_by(subboard_name=subBoardObj["subboard_name"])
            .first()
        )

        subBoard.rfs_date = FormatStringDate(subBoardObj["rfs_date"])

        if UpdateDBData(subBoard) == 200:
            return "Sub-Board Updated Successfully", 200
        else:
            return "Error While Updating Sub-Board", 500
    
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500

    