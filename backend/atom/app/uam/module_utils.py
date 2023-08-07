
from app.uam.uam_utils import *

def AddBoard(boardObj):
    try:
            
        if "device_name" in boardObj.keys():
            return "Device Name Can Not Be Empty", 500

        if boardObj["device_name"] is None:
            return "Device Name Can Not Be Empty", 500

        results = (
            db.session.query(UAM_Device_Table, Atom_Table)
            .join(Atom_Table, UAM_Device_Table.atom_id == Atom_Table.atom_id)
            .filter(Atom_Table.device_name == boardObj["device_name"])
            .first()
        )
        
        if results is None:
            return "No Device Found With Given Name", 500
        
        uam, atom = results

        board = Board_Table()
        board.board_name = boardObj["board_name"]
        board.uam_id = uam.uam_id
        board.device_slot_id = boardObj["device_slot_id"]
        board.software_version = boardObj["software_version"]
        # board.hardware_version = boardObj['hardware_version']
        board.serial_number = boardObj["serial_number"]
        # board.manufacturer_date = boardObj['manufacturer_date']
        board.status = boardObj["status"]
        board.eos_date = boardObj["eos_date"]
        board.eol_date = boardObj["eol_date"]
        # board.rfs_date = boardObj['rfs_date']
        board.pn_code = boardObj["pn_code"]
        
        if InsertDBData(board) == 200:
            return "Board Added Successfully", 200
        else:
            return "Error While Adding Board Data", 500
        
    except Exception:
        traceback.print_exc()
        return "Error While Adding Board Data", 500