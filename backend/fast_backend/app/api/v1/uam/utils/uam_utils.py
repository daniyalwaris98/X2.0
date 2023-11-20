from app.utils.db_utils import *
from app.models.uam_models import *
from app.models.atom_models import *
from app.models.site_rack_models import *


def FormatDate(date):
    print(f"String Date : {date}", file=sys.stderr)

    result = None
    try:
        result = date.strftime("%d-%m-%Y")
    except Exception:
        traceback.print_exc()

    return result


def FormatStringDate(date):
    print(f"String Date : {date}", file=sys.stderr)

    try:
        if date is not None:
            if "-" in date:
                return datetime.strptime(date, "%d-%m-%Y")
            elif "/" in date:
                return datetime.strptime(date, "%d/%m/%Y")
            else:
                print("Incorrect date format", file=sys.stderr)
    except Exception as e:
        traceback.print_exc()
        print(f"Date format exception - {e}", file=sys.stderr)

    return None


def get_all_uam_devices_util():
    deviceList = []
    try:
        devices = (
            configs.db.query(UamDeviceTable, AtomTable, RackTable, SiteTable)
            .join(AtomTable, AtomTable.atom_id == UamDeviceTable.atom_id)
            .join(RackTable, RackTable.rack_id == AtomTable.rack_id)
            .join(SiteTable, SiteTable.site_id == RackTable.site_id)
            .all()
        )

        for uam, atom, rack, site in devices:
            try:
                deviceDataDict = {}
                deviceDataDict["atom_id"] = atom.atom_id
                deviceDataDict["uam_id"] = uam.uam_id
                deviceDataDict["device_name"] = atom.device_name
                deviceDataDict["site_name"] = site.site_name
                deviceDataDict["rack_name"] = rack.rack_name
                deviceDataDict["ip_address"] = atom.ip_address
                deviceDataDict["device_type"] = atom.device_type
                deviceDataDict["software_type"] = uam.software_type
                deviceDataDict["software_version"] = uam.software_version
                deviceDataDict["creation_date"] = str(uam.creation_date)
                deviceDataDict["modification_date"] = str(uam.modification_date)
                deviceDataDict["status"] = uam.status
                deviceDataDict["ru"] = atom.device_ru
                deviceDataDict["department"] = atom.department
                deviceDataDict["section"] = atom.section
                deviceDataDict["function"] = atom.function
                deviceDataDict["manufacturer"] = uam.manufacturer
                deviceDataDict["hw_eos_date"] = str(uam.hw_eos_date)
                deviceDataDict["hw_eol_date"] = str(uam.hw_eol_date)
                deviceDataDict["sw_eos_date"] = str(uam.sw_eos_date)
                deviceDataDict["sw_eol_date"] = str(uam.sw_eol_date)
                deviceDataDict["virtual"] = atom.virtual
                deviceDataDict["rfs_date"] = str(uam.rfs_date)
                deviceDataDict["authentication"] = uam.authentication
                deviceDataDict["serial_number"] = uam.serial_number
                deviceDataDict["pn_code"] = uam.pn_code
                deviceDataDict["manufacturer_date"] = str(uam.manufacture_date)

                deviceDataDict["source"] = uam.source
                deviceDataDict["stack"] = uam.stack
                deviceDataDict["contract_number"] = uam.contract_number
                deviceDataDict["hardware_version"] = uam.hardware_version
                deviceDataDict["contract_expiry"] = str(uam.contract_expiry)
                deviceDataDict["uptime"] = uam.uptime

                deviceList.append(deviceDataDict)
            except Exception:
                traceback.print_exc()

    except Exception:
        traceback.print_exc()

    return deviceList


def delete_uam_device_util(ip_address):
    try:
        device = (
            configs.db.query(UamDeviceTable, AtomTable)
            .join(AtomTable, AtomTable.atom_id == UamDeviceTable.atom_id)
            .filter(AtomTable.ip_address == ip_address)
            .first()
        )

        if device is None:
            return (f"{ip_address} : Device Not Found"),200

        uam, atom = device

        if uam.status is not None:
            if uam.status == "Production":
                return (
                    f"{ip_address} : Device Is In Production Therefore Can Not Be Deleted"
                    
                ),400
        devices_id = uam.uam_id
        if DeleteDBData(uam) == 200:
            data = {
                "data":devices_id,
                "message":f"{ip_address} : Device Deleted Successfully"
            }
            return data,200
        else:
            return f"{ip_address} : Error While Deleting Device", 500

    except Exception:
        traceback.print_exc()
        return f"{ip_address} : Exceprtion Occured", 500


def edit_uam_device_util(device_obj, uam_id):
    try:

        if device_obj["atom_id"] is None:
            return "Atom ID Can Not Be Null", 500

        atom_id = device_obj["atom_id"]

        atom = configs.db.query(AtomTable).filter(AtomTable.atom_id == atom_id).first()
        if atom is None:
            return "Device Not Found In Atom", 500

        exits = False
        if uam_id is not None:
            device = configs.db.query(UamDeviceTable).filter(
                UamDeviceTable.uam_id == uam_id
            ).first()
            if device is None:
                return "Device Not Found In UAM", 500

            exits = True
        else:
            device = UamDeviceTable()
            device.atom_id = atom_id

        if device_obj["rack_name"] is None:
            atom.rack_id = 1
        else:
            rack = configs.db.query(RackTable).filter(
                RackTable.rack_name == device_obj["rack_name"]
            ).first()
            if rack is None:
                return "Invalid Rack Name", 500
            else:
                atom.rack_id = rack.rack_id

        device_obj["function"] = str(device_obj["function"]).strip()
        if device_obj["function"] == "":
            return "Function Can Not Be Empty", 500

        atom.function = device_obj["function"]

        if device_obj["ru"] is not None:
            atom.ru = device_obj["ru"]

        if device_obj["department"] is not None:
            atom.department = device_obj["department"]

        if device_obj["section"] is not None:
            atom.section = device_obj["section"]

        if device_obj["criticality"] is not None:
            atom.criticality = device_obj["criticality"]

        if device_obj["virtual"] is not None:
            atom.virtual = device_obj["virtual"]

        UpdateDBData(atom)

        if device_obj["software_version"] is not None:
            device.software_version = device_obj["software_version"]

        if device_obj["manufacturer"] is not None:
            device.manufacturer = device_obj["manufacturer"]

        if device_obj["authentication"] is not None:
            device.authentication = device_obj["authentication"]

        if device_obj["serial_number"] is not None:
            device.serial_number = device_obj["serial_number"]

        if device_obj["pn_code"] is not None:
            device.pn_code = device_obj["pn_code"]

        if device_obj["subrack_id_number"] is not None:
            device.subrack_id_number = device_obj["subrack_id_number"]

        if device_obj["source"] is not None:
            device.source = device_obj["source"]

        if device_obj["stack"] is not None:
            device.stack = device_obj["stack"]

        if device_obj["contract_number"] is not None:
            device.contract_number = device_obj["contract_number"]

        device_obj["status"] = str(device_obj["status"]).strip()

        if device_obj["status"] == "Production":
            pass
        elif device_obj["status"] == "Dismantled":
            pass
        elif device_obj["status"] == "Maintenance":
            pass
        elif device_obj["status"] == "Undefined":
            pass
        else:
            return "Status Is Invalid", 500

        if not exits:
            device.status = device_obj["status"]
            InsertDBData(device)
        else:
            UpdateDBData(device)

        update_uam_status_utils(atom.ip_address, device_obj["status"])

        return "Device Updated Successfully", 200
    except Exception:
        traceback.print_exc()
        return "Exception Occurred", 500


def update_uam_status_utils(ip, status):
    try:
        result = (
            configs.db.query(UamDeviceTable, AtomTable)
            .join(AtomTable, UamDeviceTable.atom_id == AtomTable.atom_id)
            .filter(AtomTable.ip_address == ip)
            .first()
        )

        if result is None:
            return f"{ip} : No Device Found", 500

        uam, atom = result

        if status != "Production":
            atom.onboard_status = False

        if UpdateDBData(atom) == 200:
            print(f"\n{ip} : Device ONBOARDED STATUS UPDATED IN ATOM", file=sys.stderr)

            # change status to dismantle in device table
            uam.status = status
            if UpdateDBData(uam) == 200:
                print(
                    f"{ip} : {atom.device_name} : Device Status Updated Successfully",
                    file=sys.stderr,
                )
                # change all board status
                board_objs = (
                    configs.db.query(BoardTable)
                    .filter(BoardTable.uam_id == uam.uam_id)
                    .all()
                )

                for boardObj in board_objs:
                    boardObj.status = status
                    UpdateDBData(boardObj)
                    print(
                        f"{ip} : {boardObj.board_name} : Module Status Updated Succedssfully",
                        file=sys.stderr,
                    )

                # change all sub-board status
                subboard_objs = (
                    configs.db.query(SubboardTable)
                    .filter(SubboardTable.uam_id == uam.uam_id)
                    .all()
                )

                for subboardObj in subboard_objs:
                    subboardObj.status = status
                    UpdateDBData(subboardObj)
                    print(
                        f"{ip} : {subboardObj.subboard_name} : Stack Switche Updated Successfully",
                        file=sys.stderr,
                    )

                # change all SFP status
                sfp_objs = (
                    configs.db.query(SfpsTable)
                    .filter(SfpsTable.uam_id == uam.uam_id)
                    .all()
                )

                for sfpObj in sfp_objs:
                    sfpObj.status = status
                    UpdateDBData(sfpObj)
                    print(
                        f"{ip} : {sfpObj.sfp_id} : SFP Status Updated Successfully",
                        file=sys.stderr,
                    )

                return f"{ip} : Device Status Updated Successfully To {status}", 200

            else:
                return f"{ip} : Error While Updating Device Status In UAM", 500

        else:
            return f"{ip} : Error While Updating Device Status In Atom", 500
    except Exception:
        traceback.print_exc()
        return f"{ip} : Error Occurred While Status Update", 500
