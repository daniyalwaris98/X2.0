import traceback

from flask_jsonpify import jsonify
from flask import request

from app import app, db
from app.utilities.db_utils import *
from app.models.uam_models import *
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
        
        if DeleteDBData(uam) == 200:
            return f"{ip_address} : Device Deleted Successfully", 200
        else:
            return f"{ip_address} : Error While Deleting Device", 500
        
    except Exception:
        traceback.print_exc()
        return f"{ip_address} : Exceprtion Occured", 500