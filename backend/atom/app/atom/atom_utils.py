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
