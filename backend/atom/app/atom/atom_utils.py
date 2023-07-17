import sys
import traceback

from app.utilities.db_utils import *

def addAtomComplete(atomObj, row):
    try:
        if 'ip_address' not in atomObj:
            return f"Row {row} : Ip Address Cannot be Empty", 500

        # row 0 means single row is being added statically and ip_address can not be updated through Insertion
        # else multiple row are being added by using file import and row will be updated if ip address already exists
        if row == 0:
            if AtomTable.query.filter_by(ip_address=atomObj['ip_address']).first() is not None:
                return f"{atomObj['ip_address']} : IP Address Is Already Assigned", 500

        if 'device_name' not in atomObj:
            return f"{atomObj['ip_address']} : Device Name Cannot be Empty", 500

        if AtomTable.query.filter_by(device_name=atomObj['device_name']).first() is not None:
            return f"{atomObj['ip_address']} : {atomObj['device_name']} : Device Name Is Already Assigned", 500

        if 'device_type' not in atomObj:
            return f"{atomObj['ip_address']} : Device Type Cannot be Empty", 500

        else:
            if atomObj['device_type'] == '':
                return f"{atomObj['ip_address']} : Device Type Cannot be Empty", 500

        # Site Check
        site_exist = None
        if 'site_name' not in atomObj:
            return f"{atomObj['ip_address']} : Site Name Cannot be Empty", 500

        else:
            if atomObj['site_name'] == '':
                return f"{atomObj['ip_address']} : Site Name Cannot be Empty", 500

            else:
                site_exist = SiteTable.query.with_entities(SiteTable.site_name).filter_by(
                    site_name=atomObj['site_name']).first()
                if site_exist is None:
                    return f"{atomObj['ip_address']} : Site Name Does Not Exists", 500

        # Rack Check
        if 'rack_name' not in atomObj:
            return f"{atomObj['ip_address']} : Rack Name Cannot be Empty", 500
        else:
            if atomObj['rack_name'] == '':
                return f"{atomObj['ip_address']} : Rack Name Cannot be Empty", 500
            else:
                if RackTable.query.with_entities(RackTable.rack_name).filter_by(
                        rack_name=atomObj['rack_name'], site_id=site_exist.site_id).first() is None:
                    return f"{atomObj['ip_address']} : Rack Name And Site Name Does Not Match", 500

        if 'password_group' not in atomObj:
            return f"{atomObj['ip_address']} : Password Group Cannot be Empty", 500

        else:
            if PasswordGroupTable.query.with_entities(PasswordGroupTable.password_group).filter_by(
                    password_group=atomObj['password_group']).first() is None:
                return f"{atomObj['ip_address']} : Password Group Does Not Exist", 500

        atom = AtomTable()
        atom.rack_name = atomObj['rack_name']
        atom.device_name = atomObj['device_name']
        atom.ip_address = atomObj['ip_address']
        atom.password_group = atomObj['password_group']
        if 'device_ru' in atomObj:
            atom.device_ru = atomObj['device_ru']
        else:
            atom.device_ru = 'N/A'
        if 'department' in atomObj:
            atom.department = atomObj['department']
        else:
            atom.department = 'N/A'
        if 'section' in atomObj:
            atom.section = atomObj['section']
        else:
            atom.section = 'N/A'

        if 'function' in atomObj:
            atom.function = atomObj['function']
        else:
            atom.function = 'N/A'

        if 'virtual' in atomObj:
            atom.virtual = atomObj['virtual']
        else:
            atom.virtual = 'N/A'

        atom.device_type = atomObj['device_type']

        atom.onboard_status = "False"

        if AtomTable.query.with_entities(AtomTable.atom_id).filter_by(
                ip_address=atomObj['ip_address']).first() is not None:
            atom.atom_id = \
                AtomTable.query.with_entities(AtomTable.atom_id).filter_by(ip_address=atomObj['ip_address']).first()[0]
            status = UpdateDBData(atom)
            if status == 200:
                response = f"{atomObj['ip_address']} : Atom Updated Successfully", 200
                print(response, file=sys.stderr)
                return response, 200
            else:
                return f"{atomObj['ip_address']} : Error While Updating Atom", 500

        else:
            status = InsertDBData(atom)
            if status == 200:
                response = f"{atomObj['ip_address']} : Atom Inserted Successfully", 200
                print(response, file=sys.stderr)
                return response, 200
            else:
                return f"{atomObj['ip_address']} : Error While Inserting Atom", 500

    except Exception:
        traceback.print_exc()
        return f"{atomObj['ip_address']} : Server Error", 500


def addPasswordGroup(passObj, row):
    try:

        if 'password_group' not in passObj.keys():
            return f"Row {row} : Password group Cannot be Empty", 500

        if passObj['password_group'].strip() == "":
            return f"Row {row} : Password group Cannot be Empty", 500

        # row 0 means single row is being added statically and password group can not be updated through Insertion
        # else multiple row are being added by using file import and row will be updated if password group already
        # exists

        password_group = PasswordGroupTable.query.filter_by(password_group=passObj['password_group']).first()
        print(password_group,file=sys.stderr)
        if row == 0:
            if password_group is not None:
                return f"{passObj['password_group']} : Password Group Already Exists", 500

        update = True
        if password_group is None:
            update = False
            password_group = PasswordGroupTable()
            password_group.password_group = passObj['password_group']

        if 'password' not in passObj.keys():
            return f"{passObj['password_group']} : Password Field Cannot be Empty", 500

        password_group.password = passObj['password']

        if 'password_group_type' in passObj.keys():
            if passObj['password_group_type'] == 'Telnet':
                password_group.password_group_type = 'Telnet'

                if 'secret_password' not in passObj.keys():
                    return f"{passObj['password_group']} : Secret Password Field Cannot Be Empty For Telnet", 500

                if passObj['secret_password'].strip() == "":
                    return f"{passObj['password_group']} : Secret Password Field Cannot Be Empty For Telnet", 500

                password_group.secret_password = passObj['secret_password']

            else:
                password_group.password_group_type = 'SSH'
                if 'username' not in passObj.keys():
                    return f"{passObj['password_group']} : Username Field Cannot Be Empty For SSH", 500

                if passObj['username'].strip() == "":
                    return f"{passObj['password_group']} : Username Field Cannot Be Empty For SSH", 500

                password_group.username = passObj['username']

        else:
            password_group.password_group_type = 'SSH'
            if 'username' not in passObj.keys():
                return f"{passObj['password_group']} : Username Field Cannot Be Empty For SSH", 500

            if passObj['username'].strip() == "":
                return f"{passObj['password_group']} : Username Field Cannot Be Empty For SSH", 500

            password_group.username = passObj['username']

        if update:
            status = UpdateDBData(password_group)
            if status == 200:
                return f"{passObj['password_group']} : Password Group Updated Successfully", 200
        else:
            status = InsertDBData(password_group)
            if status == 200:
                return f"{passObj['password_group']} : Password Group Inserted Successfully", 200

        return f"{passObj['password_group']} : Server Error", 500

    except Exception:
        traceback.print_exc()
        return f"Row {row} : Server Error", 500




from app import db
from app.models.inventory_models import *

import traceback
import sys
from app.common_utils import common_utils



def InsertData(obj):
    try:
        db.session.add(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(f"Something else went wrong in Database Insertion {e}", file=sys.stderr)
        return False

    return True


def UpdateData(obj):
    try:
        db.session.flush()
        db.session.merge(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(f"Something else went wrong during Database Update {e}", file=sys.stderr)
        return False

    return True


def ValidateAtom(device, row):
    try:
        if  'ip_address' not in device:
            error = f"Row {row} : Ip Address Cannot be Empty"
            return error, 500
        elif device['ip_address'].strip() == "":
            error = f"Row {row} : Ip Address Cannot be Empty"
            return error, 500

        if  'device_name' not in device:
            error = f"{device['ip_address']} : Device Name Cannot be Empty"
            return error, 500
        elif device['device_name'].strip() == "":
            error = f"{device['ip_address']} : Device Name Cannot be Empty"
            return error, 500
        
        atom = Atom.query.filter_by(device_name=device['device_name'].strip()).first()
        if atom is not None:
            if atom.ip_address == device['ip_address'].strip():
                error = f"{device['ip_address']} : Device Already Assigned To An Other Device"
                return error, 500

        
        if  'function' not in device:
            error = f"{device['ip_address']} : Function Cannot be Empty"
            return error, 500
        elif device['function'].strip() == "":
            error = f"{device['ip_address']} : Function Cannot be Empty"
            return error, 500
        
        if  'device_type' not in device:
            error = f"{device['ip_address']} : Device Type Cannot be Empty"
            return error, 500
        else:
            if device['device_type'].strip()=='':
                error = f"{device['ip_address']} : Device Type Cannot be Empty"
                return error, 500
            
            if device['device_type'].strip() not in common_utils.device_types:
                error = f"{device['ip_address']} : Unknown Device Type - {device['device_type'].strip()}"
                return error, 500

        # Site Check
        if  'site_name' not in device:
            error = f"{device['ip_address']} : Site Name Cannot be Empty"
            return error, 500
        else:
            if device['site_name'].strip()=='':
                error = f"{device['ip_address']} : Site Name Cannot be Empty"
                return error, 500
            else:
                if Phy_Table.query.with_entities(Phy_Table.site_name).filter_by(site_name=device['site_name']).first() == None:
                    error = f"{device['ip_address']} : Site Name Does Not Exists"
                    return error, 500
        
        # Rack Check
        if 'rack_name' not in device:
            error = f"{device['ip_address']} : Rack Name Cannot be Empty"
            return error, 500
        else:
            if device['rack_name']=='':
                error = f"{device['ip_address']} : Rack Name Cannot be Empty"
                return error, 500
            else:
                if Rack_Table.query.with_entities(Rack_Table.rack_name).filter_by(rack_name=device['rack_name'], site_name=device['site_name']).first() == None:
                    error = f"{device['ip_address']} : Rack Name And Site Name Does Not Match"
                    return error, 500

            
        if  'password_group' not in device:
            error = f"{device['ip_address']} : Password Group Cannot be Empty"
            return error, 500
        else:
            if Password_Group_Table.query.with_entities(Password_Group_Table.password_group).filter_by(password_group=device['password_group']).first() ==None:
                error = f"{device['ip_address']} : Password Group Does Not Exist"
                return error, 500
        
        return "Complete", 200
        
    except Exception:
        error = f"Error - Row {row} : Exception"
        print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500



def TransitToAtom(device, row):

    try:

        msg , status = ValidateAtom(device,row)
        
        if status == 500:
            return msg, status
        
        atom = Atom.query.filter_by(ip_address=device['ip_address']).first()

        exist = False
        if atom is not None:
            exist = True
            uam_exist = Device_Table.query.filter_by(ip_address=atom.ip_address, status='Production').first()
            if uam_exist is not None:
                return f"{device['ip_address']} : Device is already in production", 500
        else:
            atom = Atom()

        atom.site_name = device['site_name']
        atom.rack_name = device['rack_name']
        atom.device_name = device['device_name']
        atom.device_type = device['device_type']
        atom.ip_address = device['ip_address']
        atom.password_group = device['password_group']
            
        if "function" in device.key():
            if device["function"].strip() != "":
                atom.function = device["function"]
            else:
                atom.function = 'N/A'
        else:
            atom.function = 'N/A'

        
        if "device_ru" in device.key():
            if device["device_ru"].strip() != "":
                atom.device_ru = device["device_ru"]
            else:
                atom.device_ru = 'N/A'
        else:
            atom.device_ru = 'N/A'

        if "department" in device.key():
            if device["department"].strip() != "":
                atom.department = device["department"]
            else:
                atom.department = 'N/A'
        else:
            atom.department = 'N/A'

        if "section" in device.key():
            if device["section"].strip() != "":
                atom.section = device["section"]
            else:
                atom.section = 'N/A'
        else:
            atom.section = 'N/A'

        if "criticality" in device.key():
            if device["criticality"].strip() != "":
                atom.criticality = device["criticality"]
            else:
                atom.criticality = 'N/A'
        else:
            atom.criticality = 'N/A'

        if "domain" in device.key():
            if device["domain"].strip() != "":
                atom.domain = device["domain"]
            else:
                atom.domain = 'N/A'
        else:
            atom.domain = 'N/A'

        if "virtual" in device.key():
            if device["virtual"].strip() != "":
                atom.virtual = device["virtual"]
            else:
                atom.virtual = 'N/A'
        else:
            atom.virtual = 'N/A'
    
        msg = ""
        status = 500
        if exist:
            if UpdateData(atom):
                msg = f"{device['ip_address']} : Updated Successfully"
                print(msg, file=sys.stderr)
                status = 200
            else:
                msg = f"{device['ip_address']} : Error While Updating"
                print(msg, file=sys.stderr)
        else:
            if InsertData(atom):
                msg = f"{device['ip_address']} : Inserted Successfully"
                print(msg, file=sys.stderr)
                status = 200
            else:
                msg = f"{device['ip_address']} : Error While Inserting"
                print(msg, file=sys.stderr)

        if status == 200:
            try:
                transitObj = Atom_Transition_Table.query.filter_by(ip_address=atom.ip_address).first()
                if transitObj is not None:
                    db.session.delete(transitObj)
                    db.session.commit()
            except Exception:
                traceback.print_exc()
        
        return msg, status
            
    except Exception:
        error = f"Error - Row {row} : Exception"
        print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500  
        

def GetTransitionData():
    objList = []
    try:
        results = Atom_Transition_Table.query.all()

        for result in results:
            objDict = result.as_dict()

            msg, status = TransitToAtom(objDict, 1)
            
            if status == 500:
                objDict['message'] = msg
                objDict['status'] = status
                objList.append(objDict)

    except Exception:
        traceback.print_exc()
    
    return objList

def AddTansitionAtom(device, row):
    try:
        if "ip_address" not in device.key():
            return f"Row {row} : IP Address Can Not Be Empty", 500

        device["ip_address"] = device["ip_address"].strip()

        if device["ip_address"] == "":
            return f"Row {row} : IP Address Can Not Be Empty", 500
        
        msg, status = ValidateAtom(device, row)

        transObj = Atom_Transition_Table.query.filter_by(
            ip_address=device["ip_address"]
        ).first()

        exist = True
        if transObj is None:
            exist = False
            transObj = Atom_Transition_Table()

            transObj.ip_address = device["ip_address"]

        if "device_name" in device.key():
            if device["device_name"].strip() != "":
                transObj.device_name = device["device_name"]

        if "vendor" in device.key():
            if device["vendor"].strip() != "":
                transObj.vendor = device["vendor"]

        if "function" in device.key():
            if device["function"].strip() != "":
                transObj.function = device["function"]

        if "device_type" in device.key():
            if device["device_type"].strip() != "":
                transObj.device_type = device["device_type"]

        if "site_name" in device.key():
            if device["site_name"].strip() != "":
                transObj.site_name = device["site_name"]

        if "rack_name" in device.key():
            if device["rack_name"].strip() != "":
                transObj.rack_name = device["rack_name"]

        if "password_group" in device.key():
            if device["password_group"].strip() != "":
                transObj.password_group = device["password_group"]

        if "device_ru" in device.key():
            if device["device_ru"].strip() != "":
                transObj.device_ru = device["device_ru"]

        if "department" in device.key():
            if device["department"].strip() != "":
                transObj.department = device["department"]

        if "section" in device.key():
            if device["section"].strip() != "":
                transObj.section = device["section"]

        if "criticality" in device.key():
            if device["criticality"].strip() != "":
                transObj.criticality = device["criticality"]

        if "domain" in device.key():
            if device["domain"].strip() != "":
                transObj.domain = device["domain"]

        if "virtual" in device.key():
            if device["virtual"].strip() != "":
                transObj.virtual = device["virtual"]

        if exist:
            if UpdateData(transObj):
                msg = f"{device['ip_address']} : Updated Successfully"
                print(msg, file=sys.stderr)
                return msg, 200
            else:
                msg = f"{device['ip_address']} : Error While Updating"
                print(msg, file=sys.stderr)
                return msg, 500
        else:
            if InsertData(transObj):
                msg = f"{device['ip_address']} : Inserted Successfully"
                print(msg, file=sys.stderr)
                return msg, 200
            else:
                msg = f"{device['ip_address']} : Error While Inserting"
                print(msg, file=sys.stderr)
                return msg, 500
    except Exception:
        error = f"Error - Row {row} : Exception"
        print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500