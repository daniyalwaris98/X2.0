import traceback

from flask_jsonpify import jsonify
from flask import request

from app import app, db
from app.utilities.db_utils import *
from app.models.uam_models import *
from app.models.atom_models import *
from app.middleware import token_required



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


def GetAllUamDevices():
    deviceList = []
    try:
        devices = (
            db.session.query(UAM_Device_Table, Atom_Table,Rack_Table,Site_Table)
            .join(Atom_Table, Atom_Table.atom_id == UAM_Device_Table.atom_id)
            .join(Rack_Table, Rack_Table.rack_id == Atom_Table.rack_id)
            .join(Site_Table, Site_Table.site_id == Rack_Table.site_id)
            .all()
        )

        for uam, atom, rack, site in devices:
            try:
                deviceDataDict = {}
                deviceDataDict["device_name"] = atom.device_name
                deviceDataDict["site_name"] = site.site_name
                deviceDataDict["rack_name"] = rack.rack_name
                deviceDataDict["ip_address"] = atom.ip_address
                deviceDataDict["device_type"] = atom.device_type
                deviceDataDict["software_type"] = uam.software_type
                deviceDataDict["software_version"] = uam.software_version
                deviceDataDict["creation_date"] = FormatDate((uam.creation_date))
                deviceDataDict["modification_date"] = FormatDate(
                    (uam.modification_date)
                )
                deviceDataDict["status"] = uam.status
                deviceDataDict["ru"] = atom.device_ru
                deviceDataDict["department"] = atom.department
                deviceDataDict["section"] = atom.section
                deviceDataDict["function"] = atom.function
                deviceDataDict["manufacturer"] = uam.manufacturer
                deviceDataDict["hw_eos_date"] = FormatDate((uam.hw_eos_date))
                deviceDataDict["hw_eol_date"] = FormatDate((uam.hw_eol_date))
                deviceDataDict["sw_eos_date"] = FormatDate((uam.sw_eos_date))
                deviceDataDict["sw_eol_date"] = FormatDate((uam.sw_eol_date))
                deviceDataDict["virtual"] = atom.virtual
                deviceDataDict["rfs_date"] = FormatDate((uam.rfs_date))
                deviceDataDict["authentication"] = uam.authentication
                deviceDataDict["serial_number"] = uam.serial_number
                deviceDataDict["pn_code"] = uam.pn_code
                deviceDataDict["manufacturer_date"] = FormatDate(
                    (uam.manufacturer_date)
                )
                deviceDataDict["source"] = uam.source
                deviceDataDict["stack"] = uam.stack
                deviceDataDict["contract_number"] = uam.contract_number
                deviceDataDict["hardware_version"] = uam.hardware_version
                deviceDataDict["contract_expiry"] = FormatDate((uam.contract_expiry))
                deviceDataDict["uptime"] = uam.uptime
                
                deviceList.append(deviceDataDict)
            except Exception:
                traceback.print_exc()

    except Exception:
        traceback.print_exc()
    
    return deviceList


def DeleteUamDevice(ip_address):
    try:
        device = (
            db.session.query(UAM_Device_Table, Atom_Table)
            .join(Atom_Table, Atom_Table.atom_id == UAM_Device_Table.atom_id).filter(Atom_Table.ip_address==ip_address)
            .first()
        )
        
        if device is None:
            return f"{ip_address} : Device Not Found", 500
        
        uam, atom = device
        
        if uam.status is not None:
            if uam.status == 'Production':
                return f"{ip_address} : Device Is In Production Therefore Can Not Be Deleted", 500
        
        
        if DeleteDBData(uam) == 200:
            return f"{ip_address} : Device Deleted Successfully", 200
        else:
            return f"{ip_address} : Error While Deleting Device", 500
        
    except Exception:
        traceback.print_exc()
        return f"{ip_address} : Exceprtion Occured", 500
    
    
def EditUamDevice(deviceObj):
    try:
        
        
        
        result = (
            db.session.query(UAM_Device_Table, Atom_Table)
            .join(Atom_Table, Atom_Table.atom_id == UAM_Device_Table.atom_id)
            .filter(Atom_Table.device_name == deviceObj["device_name"])
            .first()
        )
        
        if result is None:
            return "Device Not Found", 500
        
        device, atom = result
        
        
        
        if 'rack_name' not in deviceObj.keys():
            atom.rack_id = 1
        elif deviceObj["rack_name"] is None:
            atom.rack_id = 1
        else:
            rack = Rack_Table.query.filter(Rack_Table.rack_name == deviceObj["rack_name"]).first()
            if rack is None:
                return "Invalid Rack Name", 500  
            else:
                atom.rack_id = rack.rack_id
            
        if "function" not in deviceObj.keys():
            return "Function Can Not Be Empty", 500
        
        if deviceObj['function'] is None:
            return "Function Can Not Be Empty", 500
        
        deviceObj['function'] = str(deviceObj['function']).strip()
        if deviceObj['function'] == "":
            return "Function Can Not Be Empty", 500
        
        atom.function = deviceObj["function"]
        atom.ru = deviceObj["ru"]
        atom.department = deviceObj["department"]
        atom.section = deviceObj["section"]
        atom.criticality = deviceObj["criticality"]
        atom.virtual = deviceObj["virtual"]
        
        UpdateDBData(atom)
        
        if "software_version" in deviceObj.keys():
            device.software_version = deviceObj["software_version"]
        
        if "manufacturer" in deviceObj.keys():
            device.manufacturer = deviceObj["manufacturer"]
        
        if "authentication" in deviceObj.keys():
            device.authentication = deviceObj["authentication"]
        
        if "serial_number" in deviceObj.keys():
            device.serial_number = deviceObj["serial_number"]
        
        if "pn_code" in deviceObj.keys():
            device.pn_code = deviceObj["pn_code"]
        
        if "subrack_id_number" in deviceObj.keys():
            device.subrack_id_number = deviceObj["subrack_id_number"]
        
        if "source" in deviceObj.keys():
            device.source = deviceObj["source"]
        
        if "stack" in deviceObj.keys():
            device.stack = deviceObj["stack"]
        
        if "contract_number" in deviceObj.keys():
            device.contract_number = deviceObj["contract_number"]
        
        
        if 'status' not in deviceObj.keys():
            return "Status Is Missing", 500
        
        if deviceObj['status'] is None:
            return "Status Is Missing", 500
        
        deviceObj['status'] = str(deviceObj['status']).strip()
        
        if deviceObj['status'] == 'Production':
            pass
        elif deviceObj['status'] == 'Dismantled':
            pass
        elif deviceObj['status'] == 'Maintenance':
            pass
        elif deviceObj['status'] == 'Undefined':
            pass
        else:
            return "Status Is Invalid", 500
        
        UpdateUAMStatus(atom.ip_address, deviceObj['status'])

        UpdateDBData(device)
        
        return "Device Updated Successfully", 200
    except Exception:
        traceback.print_exc()
        return "Exeception Occured", 500



def UpdateUAMStatus(ip, status):
    try:
        result = (
            db.session.query(UAM_Device_Table, Atom_Table)
            .join(Atom_Table, UAM_Device_Table.atom_id == Atom_Table.atom_id)
            .filter(Atom_Table.ip_address == ip)
            .first()
        )

        if result is None:
            return f"{ip} : No Device Found", 500

        uam, atom = result
        
        if status != "Production":
            atom.onboard_status = "False"

        if UpdateDBData(atom) == 200:
            print(
                f"\n{ip} : Device ONBOARDED STATUS UPDATED IN ATOM", file=sys.stderr
            )

            # change status to dismantle in device table
            uam.status = status
            if UpdateDBData(uam) == 200:
                print(
                    f"{ip} : {atom.device_name} : Device Status Updated Successfully",
                    file=sys.stderr,
                )
                # change all board status
                boardObjs = (
                    db.session.query(Board_Table)
                    .filter(Board_Table.uam_id == uam.uam_id)
                    .all()
                )

                for boardObj in boardObjs:
                    boardObj.status = status
                    UpdateDBData(boardObj)
                    print(
                        f"{ip} : {boardObj.board_name} : Module Status Updated Succedssfully",
                        file=sys.stderr,
                    )

                # change all sub-board status
                subboardObjs = (
                    db.session.query(Subboard_Table)
                    .filter(Subboard_Table.uam_id == uam.uam_id)
                    .all()
                )

                for subboardObj in subboardObjs:
                    subboardObj.status = status
                    UpdateDBData(subboardObj)
                    print(
                        f"{ip} : {subboardObj.subboard_name} : Stack Switche Updated Successfully",
                        file=sys.stderr,
                    )

                # change all SFP status
                sfpObjs = (
                    db.session.query(Sfps_Table)
                    .filter(Sfps_Table.uam_id == uam.uam_id)
                    .all()
                )

                for sfpObj in sfpObjs:
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
        return f"{ip} : Error Occured While Status Update", 500