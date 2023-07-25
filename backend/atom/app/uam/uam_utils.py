from app import db
from app.utilities.db_utils import *
from app.models.inventory_models import *

import traceback


def FormatDate(date):
    result = None
    try:
        result = date.strftime("%d-%m-%Y")
    except Exception:
        traceback.print_exc()

    return result


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


def DeleteUamDevice(device_name):
    try:
        device = (
            db.session.query(UAM_Device_Table, Atom_Table)
            .join(Atom_Table, Atom_Table.atom_id == UAM_Device_Table.atom_id).filter(Atom_Table.device_name==device_name)
            .first()
        )
        
        if device is None:
            return f"{device_name} : Device Not Found", 500
        
        uam, atom = device
        
        if DeleteDBData(uam) == 200:
            return f"{device_name} : Device Deleted Successfully", 200
        else:
            return f"{device_name} : Error While Deleting Device", 500
        
    except Exception:
        traceback.print_exc()
        return f"{device_name} : Exceprtion Occured", 500