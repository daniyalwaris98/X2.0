import traceback

from app.models.atom_models import *
from app.models.ncm_models import *

from app.atom.atom_utils import *


def AddNCMDevice(ncmObj, row, update):
    try:
        response, status = AddCompleteAtom(ncmObj, row, update)

        if status == 500:
            return response, 500

        atom = Atom_Table.query.filter(
            Atom_Table.ip_address == ncmObj["ip_address"]
        ).first()

        ncm = NCM_Device_Table.query.filter(
            NCM_Device_Table.atom_id == atom.atom_id
        ).first()
        
        exist = True
        if ncm is None:
            exist = False

        if not update:
            if exist:
                return f"{atom.ip_address} : Device Already Exists In NCM", 500
            else:
                ncm = NCM_Device_Table()
                ncm.atom_id = atom.atom_id

        if "status" in ncmObj.keys():
            if ncmObj["status"] is not None:
                ncmObj["status"] = str(ncmObj["status"]).strip()
                if ncmObj["status"].lower() == "active":
                    ncm.status = "Active"
                else:
                    ncm.status = "InActive"
            else:
                ncm.status = "InActive"
        else:
            ncm.status = "InActive"

        msg = ""
        status = 500
        if exist:
            status = UpdateDBData(ncm)
            if status == 200:
                msg = f"{atom.ip_address} : NCM Device Updated Successfully"
                print(msg, file=sys.stderr)
            else:
                msg = f"{atom.ip_address} : Error While Updating NCM Device"
        else:
            status = InsertDBData(ncm)
            if status == 200:
                msg = f"{atom.ip_address} : NCM Device Inserted Successfully"
                print(msg, file=sys.stderr)
            else:
                msg = f"{atom.ip_address} : Error While Inserting NCM Device"
                print(msg, file=sys.stderr)

        return msg, status

    except Exception:
        traceback.print_exc()
        return f"Error - Row {row} : Exception", 500


def EditNCMDevice(ncmObj):
    try:
        response, status = EditAtom(ncmObj, 0)

        if status == 500:
            return response, 500

        atom = Atom_Table.query.filter(
            Atom_Table.ip_address == ncmObj["ip_address"]
        ).first()

        ncm = NCM_Device_Table.query.filter(
            NCM_Device_Table.atom_id == atom.atom_id
        ).first()
        
        exist = True
        if ncm is None:
            exist = False
            ncm = NCM_Device_Table()
            ncm.atom_id = atom.atom_id

        if "status" in ncmObj.keys():
            if ncmObj["status"] is not None:
                ncmObj["status"] = str(ncmObj["status"]).strip()
                if ncmObj["status"].lower() == "active":
                    ncm.status = "Active"
                else:
                    ncm.status = "InActive"
            else:
                ncm.status = "InActive"
        else:
            ncm.status = "InActive"

        msg = ""
        status = 500
        if exist:
            status = UpdateDBData(atom)
            if status == 200:
                msg = f"{atom.ip_address} : NCM Device Updated Successfully"
                print(msg, file=sys.stderr)
            else:
                msg = f"{atom.ip_address} : Error While Updating NCM Device"
        else:
            status = InsertDBData(atom)
            if status == 200:
                msg = f"{atom.ip_address} : NCM Device Inserted Successfully"
                print(msg, file=sys.stderr)
            else:
                msg = f"{atom.ip_address} : Error While Inserting NCM Device"
                print(msg, file=sys.stderr)

        return msg, status
    
    except Exception:
        traceback.print_exc()
        return f"Error : Exception Occurred", 500