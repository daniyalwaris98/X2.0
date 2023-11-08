from app.models.ncm_models import *
from app.api.v1.atom.utils.atom_utils import *


def add_ncm_device_util(ncm_obj, update):
    try:
        response, status = add_complete_atom(ncm_obj, update)

        if status != 200:
            return response, status

        atom = AtomTable.query.filter(
            AtomTable.ip_address == ncm_obj["ip_address"]
        ).first()

        ncm = NcmDeviceTable.query.filter(
            NcmDeviceTable.atom_id == atom.atom_id
        ).first()

        exist = True
        if ncm is None:
            exist = False

        if not update:
            if exist:
                return f"{atom.ip_address} : Device Already Exists In NCM", 400
            else:
                ncm = NcmDeviceTable()
                ncm.atom_id = atom.atom_id

            ncm_obj["status"] = str(ncm_obj["status"]).strip()
            if ncm_obj["status"].lower() == "active":
                ncm.status = "Active"
            else:
                ncm.status = "InActive"


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
        return f"Error : Exception", 500


def edit_ncm_device_util(ncm_obj):
    try:
        response, status = edit_atom_util(ncm_obj)

        if status != 200:
            return response, status

        ncm = NcmDeviceTable.query.filter(
            NcmDeviceTable.ncm_device_id == ncm_obj["ncm_device_id"]
        ).first()

        if ncm is None:
            return "Device Not Found In NCM", 400

        ncm_obj["status"] = str(ncm_obj["status"]).strip()
        if ncm_obj["status"].lower() == "active":
            ncm.status = "Active"
        else:
            ncm.status = "InActive"

        status = UpdateDBData(ncm)
        if status == 200:
            msg = f"{ncm_obj['ip_address']} : NCM Device Updated Successfully"
            print(msg, file=sys.stderr)
        else:
            msg = f"{ncm_obj['ip_address']} : Error While Updating NCM Device"

        return msg, status

    except Exception:
        traceback.print_exc()
        return f"Error : Exception Occurred", 500
