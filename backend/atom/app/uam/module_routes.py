from app import app
from app.models.inventory_models import *
from app.middleware import token_required
from app.uam.uam_utils import *

from flask_jsonpify import jsonify
from flask import request

import traceback


@app.route("/getBoardDetailsByIpAddress", methods=["GET"])
@token_required
def GetBoardDetailsByIpAddress(user_data):
    try:
        ip_address = request.args.get("ipaddress")
        
        if ip_address:
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
                    objDict["creation_date"] = FormatDate((board.creation_date))
                    objDict["modification_date"] = FormatDate((board.modification_date))
                    objDict["status"] = board.status
                    objDict["eos_date"] = FormatDate((board.eos_date))
                    objDict["eol_date"] = FormatDate((board.eol_date))
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
        ip_address = request.args.get("ipaddress")
        if ip_address:
            try:
                queryString = f"select SUBBOARD_NAME,DEVICE_NAME,SUBBOARD_TYPE,SUBRACK_ID,SLOT_NUMBER,SUBSLOT_NUMBER,SOFTWARE_VERSION,HARDWARE_VERSION,SERIAL_NUMBER,CREATION_DATE,MODIFICATION_DATE,STATUS,EOS_DATE,EOL_DATE,RFS_DATE,PN_CODE from subboard_table where DEVICE_NAME in (select DEVICE_NAME from device_table where IP_ADDRESS='{ip_address}');"
                result = db.session.execute(queryString)
                objList = []
                for row in result:
                    objDict = {}
                    subboard_name = row[0]
                    device_name = row[1]
                    subboard_type = row[2]
                    subrack_id = row[3]
                    slot_number = row[4]
                    subslot_number = row[5]
                    software_version = row[6]
                    # hardware_version = row[7]
                    serial_number = row[8]
                    creation_date = row[9]
                    modification_date = row[10]
                    status = row[11]
                    eos_date = row[12]
                    eol_date = row[13]
                    # rfs_date = row[14]
                    pn_code = row[15]
                    objDict["subboard_name"] = subboard_name
                    objDict["device_name"] = device_name
                    objDict["subboard_type"] = subboard_type
                    objDict["subrack_id"] = subrack_id
                    objDict["slot_number"] = slot_number
                    objDict["subslot_number"] = subslot_number
                    objDict["software_version"] = software_version
                    # objDict['hardware_version'] = hardware_version
                    objDict["serial_number"] = serial_number
                    objDict["creation_date"] = FormatDate((creation_date))
                    objDict["modification_date"] = FormatDate((modification_date))
                    objDict["status"] = status
                    objDict["eos_date"] = FormatDate((eos_date))
                    objDict["eol_date"] = FormatDate((eol_date))
                    # objDict['rfs_date'] = FormatDate((rfs_date))
                    objDict["pn_code"] = pn_code
                    objList.append(objDict)
                return jsonify(objList), 200
            except Exception as e:
                traceback.print_exc()
                
        else:
            print("Can not Get Ip Address from URL", file=sys.stderr)
            return "Ip Address Missing From URL", 500
    except Exception:
        traceback.print_exc()
        return "Server Erro While Fetching Board Data", 500
