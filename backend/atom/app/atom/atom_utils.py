import sys
import traceback

from app.utilities.db_utils import *
from app.atom.static_list import *

from app.models.atom_models import *
from app.models.auto_discovery_models import *
from app.models.uam_models import *
from app.models.monitoring_models import *




def EditAtom(device, row):
    try:
        if 'ip_address' not in device:
            return f"Row {row} : Ip Address Is Missing", 500

        if device['ip_address'] is None:
            error = f"Row {row} : Ip Address Is Missing"
            return error, 500
        
        device['ip_address'] = device['ip_address'].strip()
        if device['ip_address'] == "":
            return f"Row {row} : Ip Address Is Missing", 500
        
        if Atom_Table.query.filter_by(ip_address=device['ip_address']).first() is not None:
            return AddCompleteAtom(device, 1, True)

        elif Atom_Transition_Table.query.filter_by(ip_address=device['ip_address']).first() is not None:
            return AddTansitionAtom(device, 1, True)
        
        else:
            return f"{device['ip_address']} : Device Not Found", 500
    except Exception:
        error = f"Error - Row {row} : Exception"
        print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500
    
def ValidateSite(device):
    # Site Check
    site_exist = None
    default_site = Site_Table.query.filter(Site_Table.site_id == 1).first()
    
    if 'site_name' not in device:
        pass
    elif device['site_name'] is None:
        pass
    else:
        device['site_name'] = device['site_name'].strip()
        
        if device['site_name'] == '':
            pass
        else:
            site_exist = Site_Table.query.filter_by(
                site_name=device['site_name']).first()
            if site_exist is None:
                return f"{device['ip_address']} : Site Does Not Exists", 500
            else:
                return site_exist, 200
            
    return default_site, 200

def ValidateRack(device, site):
    # Rack Check
    default_rack = Rack_Table.query.filter(Rack_Table.rack_id == 1).first()
    
    if 'rack_name' not in device:
        pass
    elif device['rack_name'] is None:
        pass
    else:
        
        device['rack_name'] = device['rack_name'].strip()
        if device['rack_name'] == '':
            pass
        else:
            rack = Rack_Table.query.filter_by(
                    rack_name=device['rack_name']).first()
            if rack is None:
                return f"{device['ip_address']} : Rack Does Not Exists", 500
                
            elif rack.site_id != site.site_id:
                return f"{device['ip_address']} : Rack And Site Does Not Match", 500
            
            else:
                return rack, 200
            
    return default_rack, 200


def ValidatePasswordGroup(device):
    if 'password_group' not in device:
        pass
    elif device['password_group'] is None:
        pass
    else:
        device['password_group'] = device['password_group'].strip()
        
        if device['password_group'] == "":
            pass
        else:
            password = Password_Group_Table.query.filter_by(password_group=device['password_group']).first()
            if password is None:
                return f"{device['ip_address']} : Password Group Does Not Exist", 500
            else:
                return password, 200
    
    password = Password_Group_Table.query.filter(Password_Group_Table.password_group == 'NA').first()
    return password, 200


def ValidateAtom(device, row, update):
    try:
        if 'ip_address' not in device:
            return f"Row {row} : Ip Address Can Not be Empty", 500

        if device['ip_address'] is None:
            error = f"Row {row} : Ip Address Can Not be Empty"
            return error, 500

        if device['ip_address'].strip() == "":
            return f"Row {row} : Ip Address Can Not be Empty", 500

        # row 0 means single row is being added statically and ip_address can not be updated through Insertion
        # else multiple row are being added by using file import and row will be updated if ip address already exists
        if not update:
            if Atom_Table.query.filter_by(ip_address=device['ip_address']).first() is not None:
                return f"{device['ip_address']} : IP Address Is Already Assigned", 500

            if Atom_Transition_Table.query.filter_by(ip_address=device['ip_address']).first() is not None:
                return f"{device['ip_address']} : IP Address Is Already Assigned", 500

        if 'device_name' not in device:
            return f"{device['ip_address']} : Device Name Can Not be Empty", 500

        if device['device_name'] is None:
            error = f"Row {row} : Device Name Can Not be Empty"
            return error, 500

        device['device_name'] = device['device_name'].strip()
        if device['device_name'] == "":
            return f"Row {row} : Device Name Can Not be Empty", 500

        atom = Atom_Table.query.filter_by(
            device_name=device['device_name']).first()
        if atom is not None:
            if atom.ip_address != device['ip_address'].strip():
                error = f"{device['ip_address']} : Device Name Already Assigned To An Other Device"
                return error, 500

        if 'function' not in device:
            error = f"{device['ip_address']} : Function Can Not be Empty"
            return error, 500
        elif device['function'] is None:
            error = f"Row {row} : Function Can Not be Empty"
            return error, 500
        elif device['function'].strip() == "":
            error = f"{device['ip_address']} : Function Can Not be Empty"
            return error, 500

        if 'device_type' not in device:
            return f"{device['ip_address']} : Device Type Can Not be Empty", 500

        if device['device_type'] is None:
            error = f"Row {row} : Device Type Can Not be Empty"
            return error, 500

        device['device_type'] = device['device_type'].strip()
        device['device_type'] = device['device_type'].lower()

        if device['device_type'] == "":
            return f"Row {row} : Device Type Can Not be Empty", 500

        if device['device_type'] not in device_type_list:
            return f"Row {row} : Device Type Is Not Supported - {device['device_type']}", 500

        site_exist, site_status = ValidateSite(device)
        if site_status == 500:
            return site_exist, 500

        rack_exist, rack_status = ValidateRack(device, site_exist)
        if rack_status == 500:
            return rack_exist, 500
        
        password_exist, passowrd_status = ValidatePasswordGroup(device)
        if passowrd_status == 500:
            return password_exist, passowrd_status

        return {"rack" : rack_exist,
                "password_group" : password_exist
                }, 200

    except Exception:
        error = f"Error - Row {row} : Exception"
        print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500


def AddCompleteAtom(device, row, update):

    try:

        response, status = ValidateAtom(device, row, update)

        if status == 500:
            return response, status
        
        rack = response['rack']
        password = response['password_group']

        atom = Atom_Table.query.filter_by(
            ip_address=device['ip_address'].strip()).first()

        exist = False
        if atom is not None:
            exist = True
            # uam_exist = Device_Table.query.filter_by(ip_address=atom.ip_address, status='Production').first()
            # if uam_exist is not None:
            #     return f"{device['ip_address']} : Device is already in production", 500
        else:
            atom = Atom_Table()
            atom.ip_address = device['ip_address'].strip()
            atom.onboard_status = "False"

        
        atom.rack_id = rack.rack_id
        atom.device_name = device['device_name'].strip()
        atom.device_type = device['device_type'].strip()
        if password is not None:
            atom.password_group_id = password.password_group_id
            
        atom.function = device['function'].strip()

        if "device_ru" in device.keys():
            if device['device_ru'] is None:
                atom.device_ru = None
            else:
                atom.device_ru = device["device_ru"]
        else:
            atom.device_ru = None

        if "department" in device.keys():
            if device['department'] is None:
                atom.department = 'N/A'
            elif device["department"].strip() != "":
                atom.department = device["department"].strip()
            else:
                atom.department = 'N/A'
        else:
            atom.department = 'N/A'

        if "section" in device.keys():
            if device['section'] is None:
                atom.section = 'N/A'
            elif device["section"].strip() != "":
                atom.section = device["section"].strip()
            else:
                atom.section = 'N/A'
        else:
            atom.section = 'N/A'

        if "criticality" in device.keys():
            if device['criticality'] is None:
                atom.criticality = 'N/A'
            elif device["criticality"].strip() != "":
                atom.criticality = device["criticality"].strip()
            else:
                atom.criticality = 'N/A'
        else:
            atom.criticality = 'N/A'

        if "domain" in device.keys():
            if device['domain'] is None:
                atom.domain = 'N/A'
            elif device["domain"].strip() != "":
                atom.domain = device["domain"].strip()
            else:
                atom.domain = 'N/A'
        else:
            atom.domain = 'N/A'

        if "virtual" in device.keys():
            if device['virtual'] is None:
                atom.virtual = 'N/A'
            elif device["virtual"].strip() != "":
                atom.virtual = device["virtual"].strip()
            else:
                atom.virtual = 'N/A'
        else:
            atom.virtual = 'N/A'
        
        if "vendor" in device.keys():
            if device['vendor'] is not None:
                device['vendor'] = str(device['vendor']).strip()
                if device['vendor'] != "" and device['vendor'] != "Unknown":
                    atom.vendor = device['vendor']
            

        msg = ""
        status = 500
        if exist:
            status = UpdateDBData(atom)
            if status == 200:
                msg = f"{device['ip_address']} : Atom Updated Successfully"
                print(msg, file=sys.stderr)
            else:
                msg = f"{device['ip_address']} : Error While Updating Atom"
        else:
            status = InsertDBData(atom)
            if status == 200:
                msg = f"{device['ip_address']} : Atom Inserted Successfully"
                print(msg, file=sys.stderr)
            else:
                msg = f"{device['ip_address']} : Error While Inserting Atom"
                print(msg, file=sys.stderr)

        if status == 200:
            try:
                transitObj = Atom_Transition_Table.query.filter_by(
                    ip_address=atom.ip_address).first()
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


def AddTansitionAtom(device, row, update):
    try:
        if "ip_address" not in device.keys():
            return f"Row {row} : IP Address Can Not Be Empty", 500

        if device['ip_address'] is None:
            return f"Row {row} : IP Address Can Not Be Empty", 500

        device["ip_address"] = device["ip_address"].strip()

        if device["ip_address"] == "":
            return f"Row {row} : IP Address Can Not Be Empty", 500

        if not update:
            if Atom_Table.query.filter_by(ip_address=device['ip_address']).first() is not None:
                return f"{device['ip_address']} : IP Address Is Already Assigned", 500

            if Atom_Transition_Table.query.filter_by(ip_address=device['ip_address']).first() is not None:
                return f"{device['ip_address']} : IP Address Is Already Assigned", 500

        # msg, status = ValidateAtom(device, row, update)

        transObj = Atom_Transition_Table.query.filter_by(
            ip_address=device["ip_address"]
        ).first()

        exist = True
        if transObj is None:
            exist = False
            transObj = Atom_Transition_Table()

            transObj.ip_address = device["ip_address"]

        if "device_name" in device.keys():
            if device['device_name'] is not None:
                if device["device_name"].strip() != "":
                    transObj.device_name = device["device_name"].strip()

        if "vendor" in device.keys():
            if device['vendor'] is not None:
                if device["vendor"].strip() != "":
                    transObj.vendor = device["vendor"].strip()

        if "function" in device.keys():
            if device["function"].strip() != "":
                transObj.function = device["function"].strip()

        if "device_type" in device.keys():
            if device['device_type'] is not None:
                if device["device_type"].strip() != "":
                    transObj.device_type = device["device_type"].strip()

        if "site_name" in device.keys():
            if device['site_name'] is not None:
                if device["site_name"].strip() != "":
                    transObj.site_name = device["site_name"].strip()

        if "rack_name" in device.keys():
            if device['rack_name'] is not None:
                if device["rack_name"].strip() != "":
                    transObj.rack_name = device["rack_name"].strip()

        if "password_group" in device.keys():
            if device['password_group'] is not None:
                if device["password_group"].strip() != "":
                    transObj.password_group = device["password_group"].strip()

        if "device_ru" in device.keys():
            transObj.device_ru = device["device_ru"]

        if "department" in device.keys():
            if device['department'] is not None:
                if device["department"].strip() != "":
                    transObj.department = device["department"].strip()

        if "section" in device.keys():
            if device['section'] is not None:
                if device["section"].strip() != "":
                    transObj.section = device["section"].strip()

        if "criticality" in device.keys():
            if device['criticality'] is not None:
                if device["criticality"].strip() != "":
                    transObj.criticality = device["criticality"].strip()

        if "domain" in device.keys():
            if device['domain'] is not None:
                if device["domain"].strip() != "":
                    transObj.domain = device["domain"].strip()

        if "virtual" in device.keys():
            if device['virtual'] is not None:
                if device["virtual"].strip() != "":
                    transObj.virtual = device["virtual"].strip()

        if exist:
            status = UpdateDBData(transObj)
            if status == 200:
                msg = f"{device['ip_address']} : Atom Updated Successfully"
                print(msg, file=sys.stderr)
                return msg, 200
            else:
                msg = f"{device['ip_address']} : Error While Updating Atom"
                print(msg, file=sys.stderr)
                return msg, 500
        else:
            status = InsertDBData(transObj)
            if status == 200:
                msg = f"{device['ip_address']} : Atom Inserted Successfully"
                print(msg, file=sys.stderr)
                return msg, 200
            else:
                msg = f"{device['ip_address']} : Error While Inserting Atom"
                print(msg, file=sys.stderr)
                return msg, 500
    except Exception:
        error = f"Error - Row {row} : Exception"
        print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500


def GetTransitionAtoms():
    objList = []
    try:
        results = Atom_Transition_Table.query.all()

        for result in results:
            objDict = result.as_dict()

            msg, status = AddCompleteAtom(objDict, 1, True)

            if status == 500:
                objDict['creation_date'] = str(objDict['creation_date'])
                objDict['modification_date'] = str(
                    objDict['modification_date'])

                objDict['message'] = msg
                objDict['status'] = status
                objList.append(objDict)

    except Exception:
        traceback.print_exc()

    return objList


def AddPasswordGroup(passObj, row, update):
    try:

        if 'password_group' not in passObj.keys():
            return f"Row {row} : Password Group Can Not be Empty", 500

        if passObj['password_group'] is None:
            return f"Row {row} : Password Group Can Not be Empty", 500

        passObj['password_group'] = passObj['password_group'].strip()

        if passObj['password_group'] == "":
            return f"Row {row} : Password Group Can Not be Empty", 500
        
        if passObj['password_group'] == "NA":
            return f"{passObj['password_group']} : Password Group Name Is Not Allowed", 500

        # row 0 means single row is being added statically and password Group can not be updated through Insertion
        # else multiple row are being added by using file import and row will be updated if password Group already
        # exists

        password_group = Password_Group_Table.query.filter_by(
            password_group=passObj['password_group']).first()
        print(password_group, file=sys.stderr)
        
        exit = False
        if password_group is not None:
            if not update:
                return f"{passObj['password_group']} : Password Group Already Exists", 500
            else:
                exit = True
                
        
        if not exit:
            password_group = Password_Group_Table()
            password_group.password_group = passObj['password_group']

        # if not (passObj.get('password') and passObj.get('password', '').strip()):
        #     pass
        
        if 'password' not in passObj.keys():
            return f"{passObj['password_group']} : Password Field Can Not be Empty", 500

        if passObj['password'] is None:
            return f"{passObj['password_group']} : Password Field Can Not be Empty", 500

        passObj['password'] = passObj['password'].strip()
        if passObj['password'] == '':
            return f"{passObj['password_group']} : Password Field Can Not be Empty", 500

        password_group.password = passObj['password']

        ssh = False
        if 'password_group_type' in passObj.keys():
            if passObj['password_group_type'] is not None:
                
                if str(passObj['password_group_type']).lower() == 'telnet':
                    password_group.password_group_type = 'Telnet'

                    if 'secret_password' not in passObj.keys():
                        return f"{passObj['password_group']} : Secret Password Field Can Not Be Empty For Telnet", 500

                    if passObj['secret_password'] is None:
                        return f"{passObj['password_group']} : Secret Password Field Can Not Be Empty For Telnet", 500

                    passObj['secret_password'] = passObj['secret_password'].strip()

                    if passObj['secret_password'].strip() == "":
                        return f"{passObj['password_group']} : Secret Password Field Can Not Be Empty For Telnet", 500

                    password_group.secret_password = passObj['secret_password']
                else:
                    ssh = True

            else:
                ssh = True

        else:
            ssh = True
            
        # for ssh
        if ssh:
            password_group.password_group_type = 'SSH'
            if 'username' not in passObj.keys():
                return f"{passObj['password_group']} : Username Field Can Not Be Empty For SSH", 500

            if passObj['username'] is None:
                return f"{passObj['password_group']} : Username Field Can Not Be Empty For SSH", 500

            passObj['username'] = passObj['username'].strip()

            if passObj['username'] == "":
                return f"{passObj['password_group']} : Username Field Can Not Be Empty For SSH", 500

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



def EditPasswordGroup(passObj):
    try:
        
        if 'password_group_id' not in passObj.keys():
            return f"Password Group ID Is Missing", 500

        if passObj['password_group_id'] is None:
            return f"Password Group ID Can Not Be Empty", 500
        
        password_exist = Password_Group_Table.query.filter_by(
            password_group_id=passObj['password_group_id']).first()
        
        if password_exist is None:
            return f"Password Group Does Not Found", 500
        
        if password_exist.password_group_id == 1:
            return f"Passowrd Group (NA) Is Not Editable", 500

        if 'password_group' not in passObj.keys():
            return f" Password Group Can Not be Empty", 500

        if passObj['password_group'] is None:
            return f"Password Group Can Not be Empty", 500

        passObj['password_group'] = passObj['password_group'].strip()

        if passObj['password_group'] == "":
            return f"Password Group Can Not be Empty", 500
        
        if passObj['password_group'] == "NA":
            return f"{passObj['password_group']} : Password Group Name Is Not Allowed", 500


        password_group = Password_Group_Table.query.filter_by(
            password_group=passObj['password_group']).first()
        
        if password_group is not None:
            if password_exist.password_group_id != password_group.password_group_id:
                return f"{passObj['password_group']} : Password Group Name Is Already Assigned", 500
        
        
        password_exist.password_group = passObj['password_group']

        # if not (passObj.get('password') and passObj.get('password', '').strip()):
        #     pass
        
        if 'password' not in passObj.keys():
            return f"{passObj['password_group']} : Password Field Can Not be Empty", 500

        if passObj['password'] is None:
            return f"{passObj['password_group']} : Password Field Can Not be Empty", 500

        passObj['password'] = passObj['password'].strip()
        if passObj['password'] == '':
            return f"{passObj['password_group']} : Password Field Can Not be Empty", 500

        password_exist.password = passObj['password']

        ssh = False
        if 'password_group_type' in passObj.keys():
            if passObj['password_group_type'] is not None:
                
                if str(passObj['password_group_type']).lower() == 'telnet':
                    password_exist.password_group_type = 'Telnet'

                    if 'secret_password' not in passObj.keys():
                        return f"{passObj['password_group']} : Secret Password Field Can Not Be Empty For Telnet", 500

                    if passObj['secret_password'] is None:
                        return f"{passObj['password_group']} : Secret Password Field Can Not Be Empty For Telnet", 500

                    passObj['secret_password'] = passObj['secret_password'].strip()

                    if passObj['secret_password'].strip() == "":
                        return f"{passObj['password_group']} : Secret Password Field Can Not Be Empty For Telnet", 500

                    password_exist.secret_password = passObj['secret_password']
                else:
                    ssh = True

            else:
                ssh = True

        else:
            ssh = True
            
        # for ssh
        if ssh:
            password_exist.password_group_type = 'SSH'
            if 'username' not in passObj.keys():
                return f"{passObj['password_group']} : Username Field Can Not Be Empty For SSH", 500

            if passObj['username'] is None:
                return f"{passObj['password_group']} : Username Field Can Not Be Empty For SSH", 500

            passObj['username'] = passObj['username'].strip()

            if passObj['username'] == "":
                return f"{passObj['password_group']} : Username Field Can Not Be Empty For SSH", 500

            password_exist.username = passObj['username']

        status = UpdateDBData(password_exist)
        if status == 200:
            return f"{passObj['password_group']} : Password Group Updated Successfully", 200
    

        return f"{passObj['password_group']} : Server Error", 500

    except Exception:
        traceback.print_exc()
        return f"Server Error", 500
