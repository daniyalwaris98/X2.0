import sys
import traceback

from app.utilities.db_utils import *
from atom.static_list import *


def ValidateAtom(device, row):
    try:
        if 'ip_address' not in device:
            return f"Row {row} : Ip Address Cannot be Empty", 500
        
        if device['ip_address'] is None:
            error = f"Row {row} : Ip Address Can Not be Empty"
            return error, 500
        
        if device['ip_address'].strip() == "":
            return f"Row {row} : Ip Address Cannot be Empty", 500

        # row 0 means single row is being added statically and ip_address can not be updated through Insertion
        # else multiple row are being added by using file import and row will be updated if ip address already exists
        if row == 0:
            if AtomTable.query.filter_by(ip_address=device['ip_address']).first() is not None:
                return f"{device['ip_address']} : IP Address Is Already Assigned", 500
        
            if Atom_Transition_Table.query.filter_by(ip_address=device['ip_address']).first() is not None:
                return f"{device['ip_address']} : IP Address Is Already Assigned", 500

        if 'device_name' not in device:
            return f"{device['ip_address']} : Device Name Cannot be Empty", 500
        
        if device['device_name'] is None:
            error = f"Row {row} : Device Name Can Not be Empty"
            return error, 500

        device['device_name'] = device['device_name'].strip()
        if device['device_name'] == "":
            return f"Row {row} : Device Name Cannot be Empty", 500

        atom =  AtomTable.query.filter_by(device_name=device['device_name']).first()
        if atom is not None:
            if atom.ip_address != device['ip_address'].strip():
                error = f"{device['ip_address']} : Device Already Assigned To An Other Device"
                return error, 500
            
        if  'function' not in device:
            error = f"{device['ip_address']} : Function Can Not be Empty"
            return error, 500
        elif device['function'] is None:
            error = f"Row {row} : Function Can Not be Empty"
            return error, 500
        elif device['function'].strip() == "":
            error = f"{device['ip_address']} : Function Can Not be Empty"
            return error, 500

        if 'device_type' not in device:
            return f"{device['ip_address']} : Device Type Cannot be Empty", 500
        
        if device['device_type'] is None:
            error = f"Row {row} : Device Type Can Not be Empty"
            return error, 500

        device['device_type'] = device['device_type'].strip()
        device['device_type'] = device['device_type'].lower()
        
        
        if device['device_type'] == "":
            return f"Row {row} : Device Type Cannot be Empty", 500
        
        if device['device_type'] not in device_type_list:
            return f"Row {row} : Device Type Is Not Supported - {device['device_type']}", 500


        # Site Check
        site_exist = None
        if 'site_name' not in device:
            return f"{device['ip_address']} : Site Name Cannot be Empty", 500
        if device['site_name'] is None:
            error = f"{device['ip_address']} : Site Name Can Not be Empty"
            return error, 500
        
        device['site_name'] = device['site_name'].strip()
        if device['site_name'] == '':
            return f"{device['ip_address']} : Site Name Cannot be Empty", 500

        else:
            site_exist = SiteTable.query.with_entities(SiteTable.site_name).filter_by(
                site_name=device['site_name']).first()
            if site_exist is None:
                return f"{device['ip_address']} : Site Name Does Not Exists", 500

        # Rack Check
        if 'rack_name' not in device:
            return f"{device['ip_address']} : Rack Name Cannot be Empty", 500
        if device['rack_name'] is None:
            error = f"{device['ip_address']} : Rack Name Can Not be Empty"
            return error, 500

        device['rack_name'] = device['rack_name'].strip()
        if device['rack_name'] == '':
            return f"{device['ip_address']} : Rack Name Cannot be Empty", 500
        else:
            if RackTable.query.with_entities(RackTable.rack_name).filter_by(
                    rack_name=device['rack_name'], site_id=site_exist.site_id).first() is None:
                return f"{device['ip_address']} : Rack Name And Site Name Does Not Match", 500

        if 'password_group' not in device:
            return f"{device['ip_address']} : Password Group Cannot be Empty", 500
        
        device['password_group'] = device['password_group'].strip()
        if device['password_group'] == "":
            return f"{device['ip_address']} : Password Group Cannot be Empty", 500
        elif device['password_group'] is None:
            error = f"{device['ip_address']} : Password Group Can Not be Empty"
            return error, 500
        else:
            if PasswordGroupTable.query.with_entities(PasswordGroupTable.password_group).filter_by(
                    password_group=device['password_group']).first() is None:
                return f"{device['ip_address']} : Password Group Does Not Exist", 500
        
        return "Complete", 200
        
    except Exception:
        error = f"Error - Row {row} : Exception"
        print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500



def AddCompleteAtom(device, row):

    try:

        msg , status = ValidateAtom(device,row)
        
        if status == 500:
            return msg, status
        
        atom = AtomTable.query.filter_by(ip_address=device['ip_address'].strip()).first()

        exist = False
        if atom is not None:
            exist = True
            # uam_exist = Device_Table.query.filter_by(ip_address=atom.ip_address, status='Production').first()
            # if uam_exist is not None:
            #     return f"{device['ip_address']} : Device is already in production", 500
        else:
            atom = AtomTable()
            atom.ip_address = device['ip_address'].strip()

        rack = RackTable.query.filter_by(rack_name=device['rack_name'].strip()).first()
        atom.rack_id = rack.rack_id
        atom.device_name = device['device_name'].strip()
        atom.device_type = device['device_type'].strip()
        atom.password_group = device['password_group'].strip()
        atom.function = device['function'].strip()
        
        if "device_ru" in device.keys():
            if device['device_ru'] is None:
                atom.device_ru = 'N/A'
            elif device["device_ru"].strip() != "":
                atom.device_ru = device["device_ru"].strip()
            else:
                atom.device_ru = 'N/A'
        else:
            atom.device_ru = 'N/A'

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

        atom.onboard_status = "False"
    
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
        

def AddTansitionAtom(device, row):
    try:
        if "ip_address" not in device.key():
            return f"Row {row} : IP Address Can Not Be Empty", 500
        
        if device['ip_address'] is None:
            return f"Row {row} : IP Address Can Not Be Empty", 500

        device["ip_address"] = device["ip_address"].strip()


        if device["ip_address"] == "":
            return f"Row {row} : IP Address Can Not Be Empty", 500
        
        if row == 0:
            if AtomTable.query.filter_by(ip_address=device['ip_address']).first() is not None:
                return f"{device['ip_address']} : IP Address Is Already Assigned", 500
        
            if Atom_Transition_Table.query.filter_by(ip_address=device['ip_address']).first() is not None:
                return f"{device['ip_address']} : IP Address Is Already Assigned", 500
        
        msg, status = ValidateAtom(device, row)

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
            if device["device_ru"].strip() != "":
                transObj.device_ru = device["device_ru"].strip()

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

            msg, status = AddCompleteAtom(objDict, 1)
            
            if status == 500:
                objDict['message'] = msg
                objDict['status'] = status
                objList.append(objDict)

    except Exception:
        traceback.print_exc()
    
    return objList


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