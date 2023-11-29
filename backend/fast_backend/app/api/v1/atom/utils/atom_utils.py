from app.api.v1.atom.utils.atom_import import *
import ipaddress


def validate_site(device):
    # Site Check
    default_site = configs.db.query(SiteTable).filter(SiteTable.site_name == "default_site").first()

    if device["site_name"] is None:
        pass
    else:
        device["site_name"] = device["site_name"].strip()

        if device["site_name"] == "":
            pass
        else:
            site_exist = configs.db.query(SiteTable).filter(
                SiteTable.site_name == device["site_name"]
            ).first()
            if site_exist is None:
                return f"{device['ip_address']} : Site Does Not Exists", 400
            else:
                return site_exist, 200

    return default_site, 200


def validate_rack(device, site):
    # Rack Check
    default_rack = configs.db.query(RackTable).filter(RackTable.rack_name == "default_rack").first()

    if device["rack_name"] is None:
        pass
    else:
        device["rack_name"] = device["rack_name"].strip()

        if device["rack_name"] == "":
            pass
        else:
            rack = configs.db.query(RackTable).filter(
                RackTable.rack_name == device["rack_name"]).first()
            if rack is None:
                return f"{device['ip_address']} : Rack Does Not Exists", 400

            elif rack.site_id != site.site_id:
                return f"{device['ip_address']} : Rack And Site Does Not Match", 400

            else:
                return rack, 200

    return default_rack, 200


def validate_password_group(device):
    if device["password_group"] is None:
        pass
    else:
        device["password_group"] = device["password_group"].strip()

        if device["password_group"] == "":
            pass
        else:
            password = configs.db.query(PasswordGroupTable).filter(
                PasswordGroupTable.password_group == device["password_group"]
            ).first()
            if password is None:
                return f"{device['ip_address']} : Password Group Does Not Exist", 400
            else:
                return password, 200

    password = configs.db.query(PasswordGroupTable).filter(
        PasswordGroupTable.password_group == "default_password"
    ).first()

    return password, 200


def validate_atom(device, update):
    try:
        if device["ip_address"].strip() == "" or device['ip_address'] == 'string':
            return f"Ip Address Can Not be Empty", 400
        if device['ip_address'] !="" or device['ip_address']!='string':
            try:
                validate_ip_address = ipaddress.ip_address(device['ip_address'])
            except ValueError:
                print("IP address is not a valid IP address")
                return f"{device['ip_address']} : IP Address is not valid", 400

        if not update:
            if (
                    configs.db.query(AtomTable).filter(
                        AtomTable.ip_address == device["ip_address"]).first()
                    is not None
            ):
                return f"{device['ip_address']} : IP Address Is Already Assigned", 400

            if (
                    configs.db.query(AtomTransitionTable).filter(
                        AtomTransitionTable.ip_address == device["ip_address"]
                    ).first()
                    is not None
            ):
                return f"{device['ip_address']} : IP Address Is Already Assigned", 400

        if device["device_name"] is None or device['device_name'] == 'string':
            return f"{device['ip_address']} : Device Name Can Not be Empty", 400

        device["device_name"] = device["device_name"].strip()
        if device["device_name"] == "":
            return f"{device['ip_address']} : Device Name Can Not be Empty", 400

        atom = configs.db.query(AtomTable).filter(
            AtomTable.device_name == device["device_name"]).first()
        if atom is not None:
            if atom.ip_address != device["ip_address"].strip():
                return f"{device['ip_address']} : Device Name Already Assigned To An Other Device", 400

        if device["function"] is None or device['function'] == 'string':
            return f"{device['ip_address']} : Function Can Not be Empty", 400

        elif device["function"].strip() == "":
            return f"{device['ip_address']} : Function Can Not be Empty", 400

        if device["device_type"] is None or device['device_type'] == 'string':
            return f"{device['ip_address']} : Device Type Can Not be Empty", 400

        device["device_type"] = device["device_type"].strip()
        device["device_type"] = device["device_type"].lower()

        if device["device_type"] == "":
            return f"{device['ip_address']} : Device Type Can Not be Empty", 400

        if device["device_type"] not in device_type_list:
            return f"{device['ip_address']} : Device Type Is Not Supported - {device['device_type']}", 400

        if device["vendor"] is None:
            return f"{device['ip_address']} : Vendor Can Not be Empty", 400

        device["vendor"] = str(device["vendor"]).strip().capitalize()
        if device["vendor"] not in vendor_list:
            return f"{device['ip_address']} : Unknown Vendor - {device['vendor']}", 400

        site_exist, site_status = validate_site(device)
        if site_status != 200:
            return site_exist, site_status

        rack_exist, rack_status = validate_rack(device, site_exist)
        if rack_status != 200:
            return rack_exist, rack_status

        password_exist, password_status = validate_password_group(device)
        if password_status != 200:
            return password_exist, password_status

        return {"rack": rack_exist, "password_group": password_exist}, 200

    except Exception:
        error = f"Error : Exception Occurred"
        print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500


def add_complete_atom(device, update):
    try:
        response, status = validate_atom(device, update)

        if status != 200:
            return response, status

        rack = response["rack"]
        password = response["password_group"]

        atom = configs.db.query(AtomTable).filter(
            AtomTable.ip_address == device["ip_address"].strip()).first()

        exist = False
        if atom is not None:
            exist = True
            # uam_exist = Device_Table.query.filter_by(ip_address=atom.ip_address, status='Production').first()
            # if uam_exist is not None:
            #     return f"{device['ip_address']} : Device is already in production", 500
        else:
            atom = AtomTable()
            atom.ip_address = device["ip_address"].strip()
            atom.onboard_status = False

        atom.rack_id = rack.rack_id
        atom.device_name = device["device_name"].strip()
        atom.device_type = device["device_type"].strip()
        if password is not None:
            atom.password_group_id = password.password_group_id

        atom.function = device["function"].strip()
        atom.vendor = str(device["vendor"]).capitalize()
        atom.device_ru = device["device_ru"]

        if device["department"] is None:
            atom.department = "N/A"
        elif device["department"].strip() != "":
            atom.department = device["department"].strip()
        else:
            atom.department = "N/A"

        if device["section"] is None:
            atom.section = "N/A"
        elif device["section"].strip() != "":
            atom.section = device["section"].strip()
        else:
            atom.section = "N/A"

        if device["criticality"] is None:
            atom.criticality = "N/A"
        elif device["criticality"].strip() != "":
            atom.criticality = device["criticality"].strip()
        else:
            atom.criticality = "N/A"

        if device["domain"] is None:
            atom.domain = "N/A"
        elif device["domain"].strip() != "":
            atom.domain = device["domain"].strip()
        else:
            atom.domain = "N/A"

        if device["virtual"] is None:
            atom.virtual = "N/A"
        elif device["virtual"].strip() != "":
            atom.virtual = device["virtual"].strip()
        else:
            atom.virtual = "N/A"
        atom_data = {}
        msg = ""
        status = 500
        if exist:
            status = UpdateDBData(atom)
            if status == 200:
                msg = f"{device['ip_address']} : Atom Updated Successfully"
                devices_data = dict(device)
                devices_data['atom_id'] = atom.atom_id
                print("devices data for atom is:::::::::::::::::::::::::::::::",devices_data,file=sys.stderr)
                atom_data = {
                    "data":devices_data,
                    "message":msg
                }
                # print(msg, file=sys.stderr)
            else:
                msg = f"{device['ip_address']} : Error While Updating Atom"
        else:
            status = InsertDBData(atom)
            if status == 200:
                msg = f"{device['ip_address']} : Atom Inserted Successfully"
                devices_data = dict(device)
                devices_data['atom_id'] = atom.atom_id
                print("devices data for atom is:::::::::::::::::::::::::::::::",devices_data,file=sys.stderr)
                atom_data = {
                    "data":devices_data,
                    "message":msg
                }
                # print(msg, file=sys.stderr)
            else:
                msg = f"{device['ip_address']} : Error While Inserting Atom"
                # print(msg, file=sys.stderr)

        if status == 200:
            try:
                transit_obj = configs.db.query(AtomTransitionTable).filter(
                    AtomTransitionTable.ip_address == atom.ip_address
                ).first()

                if transit_obj is not None:
                    DeleteDBData(transit_obj)

            except Exception:
                traceback.print_exc()

        return (atom_data),status

    except Exception:
        error = f"Error : Exception Occurred"
        print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500


def add_transition_atom(device, update):
    try:

        device["ip_address"] = device["ip_address"].strip()

        if device["ip_address"] == "" or device['ip_address'] == 'string':
            print("ip address is empty or a string::::::::::::::::::::::::",file=sys.stderr)
            return f"IP Address Can Not Be Empty", 400
        
        if device['ip_address'] !="" or device['ip_address']!='string':
            try:
                validate_ip_address = ipaddress.ip_address(device['ip_address'])
            except ValueError:
                print("IP address is not a valid IP address")
                return f"{device['ip_address']} : IP Address is not valid", 400

        if not update:
            if (
                    configs.db.query(AtomTable).filter(
                        AtomTable.ip_address == device["ip_address"]).first()
                    is not None
            ):
                return f"{device['ip_address']} : IP Address Is Already Assigned", 400

            if (
                    configs.db.query(AtomTransitionTable).filter(
                        AtomTransitionTable.ip_address == device["ip_address"]
                    ).first()
                    is not None
            ):
                return f"{device['ip_address']} : IP Address Is Already Assigned", 400

        # msg, status = ValidateAtom(device, row, update)

        trans_obj = configs.db.query(AtomTransitionTable).filter(
            AtomTransitionTable.ip_address == device["ip_address"]
        ).first()
        attributes_dict = {}
        processed_ips = {}
        exist = True
        if trans_obj is None:
            exist = False
            trans_obj = AtomTransitionTable()

            trans_obj.ip_address = device["ip_address"]

        trans_obj = fill_transition_data(device, trans_obj)

        if exist:
            status = UpdateDBData(trans_obj)
            if status == 200:
                msg = f"{device['ip_address']} : Atom Updated Successfully"
                # devices = device
                # data = []
                # devices_data =dict(devices)
                # devices_data['atom_transition_id'] = trans_obj.atom_transition_id
                # data.append(devices_data)
                # attributes_dict = {}

                # Check if trans_obj exists
                if trans_obj:
                    
                    inspector = inspect(trans_obj.__class__)
                    columns = inspector.columns
                    
                    # Iterate through columns and fetch values
                    for column in columns:
                        column_name = column.key
                        
                        # Exclude 'creation_date' and 'modification_date'
                        if column_name not in ['creation_date', 'modification_date']:
                            value = getattr(trans_obj, column_name, None)
                            attributes_dict[column_name] = value
                            
                # print("attribute dict isssssssssssssssssssssssssssssssssssssssssss",attributes_dict,file=sys.stderr)
                transition_data = {
                        "data":attributes_dict,
                        "message":str(msg)
                }
                # print("transition data is::::::::::::::::::::::::::::::::::::::",transition_data,file=sys.stderr)
                    # print(msg, file=sys.stderr)
                return (transition_data), 200
            else:
                msg = f"{device['ip_address']} : Error While Updating Atom"
                print(msg, file=sys.stderr)
                return msg, 500
        else:
            status = InsertDBData(trans_obj)
            if status == 200:
                msg = f"{device['ip_address']} : Atom Inserted Successfully"

                
                # print('data in atom tranistion while inserting is:::::::::::::::::',data,file=sys.stderr)
                devices = device
                devices_data =dict(devices)
                devices_data['atom_transition_id'] = trans_obj.atom_transition_id

                # print("devices data is:::::::::::::::::::::::::::",devices_data,file=sys.stderr)
                data = {"transition id":trans_obj.atom_transition_id}
                transition_data = {
                    "data":devices_data,
                    "message":msg
                }
                
                # print("atom transition id is:::::::::::::::::::::::::::",transition_id,file=sys.stderr)
                # print("data is:::::::::::::::::::::::::::::::::::",data,file=sys.stderr)
                # print(msg, file=sys.stderr)
                return (transition_data), 200
            else:
                msg = f"{device['ip_address']} : Error While Inserting Atom"
                # print(msg, file=sys.stderr)
                return msg, 500

    except Exception:
        error = f"Error : Exception Occurred"
        # print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500


def fill_transition_data(device, trans_obj):
    try:
        # print("device in fill tranistion data is:::::::::::::::::::",device,file=sys.stderr)
        # print("trans obj error in fill tranistion data is::::::::::::::::::::::::",trans_obj,file=sys.stderr)
        if device["device_name"] is not None:
            if device["device_name"].strip() != "":
                trans_obj.device_name = device["device_name"].strip()

        if device["vendor"] is not None:
            if device["vendor"].strip() != "":
                trans_obj.vendor = device["vendor"].strip()

        if device["function"] is not None and device["function"].strip() != "":
            trans_obj.function = device["function"].strip()

        if device["device_type"] is not None:
            if device["device_type"].strip() != "":
                trans_obj.device_type = device["device_type"].strip()

        if device["site_name"] is not None:
            if device["site_name"].strip() != "":
                trans_obj.site_name = device["site_name"].strip()

        if device["rack_name"] is not None:
            if device["rack_name"].strip() != "":
                trans_obj.rack_name = device["rack_name"].strip()

        if device["password_group"] is not None:
            if device["password_group"].strip() != "":
                trans_obj.password_group = device["password_group"].strip()

        trans_obj.device_ru = device["device_ru"]

        if device["department"] is not None:
            if device["department"].strip() != "":
                trans_obj.department = device["department"].strip()

        if device["section"] is not None:
            if device["section"].strip() != "":
                trans_obj.section = device["section"].strip()

        if device["criticality"] is not None:
            if device["criticality"].strip() != "":
                trans_obj.criticality = device["criticality"].strip()

        if device["domain"] is not None:
            if device["domain"].strip() != "":
                trans_obj.domain = device["domain"].strip()

        if device["virtual"] is not None:
            if device["virtual"].strip() != "":
                trans_obj.virtual = device["virtual"].strip()

        if device['device_ru'] is None:
            trans_obj.device_ru =0
        else:
            trans_obj.device_ru = device['device_ru']

        return trans_obj
    except Exception as e:
        traceback.print_exc()


def edit_atom_util(device):
    try:

        atom = None
        trans_atom = None
        transition_data = {}

        if "atom_id" not in device and "atom_transition_id" not in device:
            return "Atom ID Or Atom Transition ID is Missing", 400

        if "atom_id" in device:
            if device["atom_id"] is not None:
                atom = configs.db.query(AtomTable).filter(
                    AtomTable.atom_id == device["atom_id"]).first()

        if "atom_transition_id" in device:
            print("atom tranistion id in devices is::::::::",file=sys.stderr)
            if device["atom_transition_id"] is not None:
                trans_atom = configs.db.query(AtomTransitionTable).filter(
                    AtomTransitionTable.atom_transition_id == device["atom_transition_id"]).first()
                print("trans atom is:::::::::::::testing:::::::::",trans_atom,file=sys.stderr)

        device["ip_address"] = device["ip_address"].strip()
        if device["ip_address"] == "":
            return f"Ip Address Can Not be Empty", 400

        if atom is not None:
            atom, status = edit_complete_atom(device, atom)

            if status != 200:
                return atom, status

            status = UpdateDBData(atom)

        elif trans_atom is not None:
            if configs.db.query(AtomTransitionTable).filter(
                    AtomTransitionTable.ip_address == device["ip_address"],
                    AtomTransitionTable.atom_transition_id != device["atom_transition_id"]
            ).first() is not None:
                return f"{device['ip_address']} : IP Address Is Already Assigned To An Other Device", 400

            if configs.db.query(AtomTable).filter(
                    AtomTable.ip_address == device["ip_address"]).first() is not None:
                return f"{device['ip_address']} : IP Address Is Already Assigned To An Other Device", 400

            trans_atom.ip_address = device['ip_address']
            trans_atom = fill_transition_data(device, trans_atom)
            attributes_dict = {}
            status = UpdateDBData(trans_atom)
            try:
                # attributes_dict = {}

                # Check if trans_obj exists
                if trans_atom:
                    inspector = inspect(trans_atom.__class__)
                    columns = inspector.columns
                    
                    # Iterate through columns and fetch values
                    for column in columns:
                        column_name = column.key
                        if column_name not in ['creation_date', 'modification_date']:
                            value = getattr(trans_atom, column_name, None)
                            attributes_dict[column_name] = value
                    print("attribute dict is:::::::::::::::::::::::::::::111111111111",attributes_dict,file=sys.stderr)
            except Exception as e:
                            traceback.print_exc()
                            print("error occured while getting the attribute of trans atom::::::::::::",file=sys.stderr)

        else:
            return "Device Not Found", 400

        if status == 200:
            msg = f"{device['ip_address']} : Atom Updated Successfully"
            devices_data =dict(device)
            devices_data['atom_transition_id'] = trans_atom.atom_transition_id

            print("devices data is:::::::::::::::::::::::::::",devices_data,file=sys.stderr)
            data = {"transition id":trans_atom.atom_transition_id}
            transition_data = {
                    "data":attributes_dict,
                    "message":msg
            }
        else:
            msg = f"{device['ip_address']} : Error While Updating Atom"

        return transition_data, status

    except Exception:
        error = f"Error : Exception Occurred"
        # print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500


def edit_complete_atom(device, atom):
    if configs.db.query(AtomTable).filter(
            AtomTable.ip_address == device["ip_address"], AtomTable.atom_id != device[
                "atom_id"]).first() is not None:
        return f"{device['ip_address']} : IP Address Is Already Assigned To An Other Device", 400

    if configs.db.query(AtomTransitionTable).filter(
            AtomTransitionTable.ip_address == device["ip_address"]).first() is not None:
        return f"{device['ip_address']} : IP Address Is Already Assigned To An Other Device", 400

    # Device Name Check
    if device["device_name"] is None:
        return f"{device['ip_address']} : Device Name Can Not be Empty", 400

    device["device_name"] = device["device_name"].strip()
    if device["device_name"] == "":
        return f"{device['ip_address']} : Device Name Can Not be Empty", 400

    if configs.db.query(AtomTable).filter(
            AtomTable.device_name == device["device_name"], AtomTable.atom_id != device[
                "atom_id"]).first() is not None:
        return f"{device['ip_address']} : Device Name Already Assigned To An Other Device", 400

    if device["function"] is None:
        return f"{device['ip_address']} : Function Can Not be Empty", 400

    elif device["function"].strip() == "":
        return f"{device['ip_address']} : Function Can Not be Empty", 400

    if device["device_type"] is None:
        return f"{device['ip_address']} : Device Type Can Not be Empty", 400

    device["device_type"] = device["device_type"].strip()
    device["device_type"] = device["device_type"].lower()

    if device["device_type"] == "":
        return f"{device['ip_address']} : Device Type Can Not be Empty", 400

    if device["device_type"] not in device_type_list:
        return f"{device['ip_address']} : Device Type Is Not Supported - {device['device_type']}", 400

    site_exist, site_status = validate_site(device)
    if site_status != 200:
        return site_exist, site_status

    rack_exist, rack_status = validate_rack(device, site_exist)
    if rack_status != 200:
        return rack_exist, rack_status

    password_exist, password_status = validate_password_group(device)
    if password_status != 200:
        return password_exist, password_status

    atom.rack_id = rack_exist.rack_id
    atom.ip_address = device["ip_address"]
    atom.device_name = device["device_name"].strip()
    atom.device_type = device["device_type"].strip()
    atom.password_group_id = password_exist.password_group_id
    atom.function = device["function"].strip()
    atom.device_ru = device["device_ru"]

    if device["department"] is None:
        atom.department = "N/A"
    elif device["department"].strip() != "":
        atom.department = device["department"].strip()
    else:
        atom.department = "N/A"

    if device["section"] is None:
        atom.section = "N/A"
    elif device["section"].strip() != "":
        atom.section = device["section"].strip()
    else:
        atom.section = "N/A"

    if device["criticality"] is None:
        atom.criticality = "N/A"
    elif device["criticality"].strip() != "":
        atom.criticality = device["criticality"].strip()
    else:
        atom.criticality = "N/A"

    if device["domain"] is None:
        atom.domain = "N/A"
    elif device["domain"].strip() != "":
        atom.domain = device["domain"].strip()
    else:
        atom.domain = "N/A"

    if device["virtual"] is None:
        atom.virtual = "N/A"
    elif device["virtual"].strip() != "":
        atom.virtual = device["virtual"].strip()
    else:
        atom.virtual = "N/A"

    if "vendor" in device.keys():
        if device["vendor"] is not None:
            device["vendor"] = str(device["vendor"]).strip()
            if device["vendor"] != "" and device["vendor"] != "Unknown":
                atom.vendor = device["vendor"]

    return atom, 200


def get_transition_atoms():
    obj_list = []
    count = 0
    try:
        results = configs.db.query(AtomTransitionTable).all()

        for result in results:
            # print(result.as_dict(), file=sys.stderr)
            obj_dict = result.as_dict()

            msg, status = add_complete_atom(obj_dict, True)

            if status != 200:
                obj_dict["creation_date"] = str(obj_dict["creation_date"])
                obj_dict["modification_date"] = str(obj_dict["modification_date"])
                obj_dict["message"] = msg
                obj_dict["status"] = status
                obj_dict['atom_table_id'] = count
                obj_list.append(obj_dict)
            
            count +=1
    except Exception:
        traceback.print_exc()

    return obj_list


def validate_password_group_name(pass_obj):
    pass_obj["password_group"] = pass_obj["password_group"].strip()

    if pass_obj["password_group"] == "" or pass_obj["password_group"] =='string':
        return f"Password Group Can Not be Empty", 400

    if pass_obj["password_group"] == "default_password":
        return f"{pass_obj['password_group']} : Password Group Name (default_password) Is Not Allowed", 400

    return pass_obj["password_group"], 200


def validate_password_group_credentials(pass_obj, password_exist):
    print("pass obj is::::::::::::::::::::::::::::::::::;",pass_obj,file=sys.stderr)
    print("password exsist is::::::::::::::::::::::::::::::::::::",password_exist,file=sys.stderr)
    pass_obj["username"] = pass_obj["username"].strip()
    if pass_obj["username"] == "":
        return (
            f"{pass_obj['password_group']} : Username Field Can Not Be Empty",
            400,
        )
    password_exist.username = pass_obj["username"]
    if pass_obj['password_group_type'] is None or pass_obj['password_group_type'] == '':
        return f"Password Group Type cannot be empty",400

    if pass_obj['password_group_type'] == 'telnet' or pass_obj['password_group_type'] == 'Telnet':
        print("passowrd gorup type is::::::::::::::::::::::::::;telnet",file=sys.stderr)
        if pass_obj['secret_password'] is None or pass_obj['secret_password'] == '':
            return f"{pass_obj['password_group']} : Secret Password Field Can Not Be Empty For Telnet",400
            # print("password cannot be emoty for telnet:::::::::::::::::::",file=sys.stderr)

    pass_obj["password"] = pass_obj["password"].strip()
    if pass_obj["password"] == "":
        return f"{pass_obj['password_group']} : Password Field Can Not be Empty", 400
    
    password_exist.password = pass_obj["password"]
    

    if pass_obj["password_group_type"] == PasswordGroupTypeEnum.telnet:
        password_exist.password_group_type = "Telnet"
        print("password group type is password exsit.password_group_type============",file=sys.stderr)
        if pass_obj["secret_password"] is None:
            return (
                f"{pass_obj['password_group']} : Secret Password Field Can Not Be Empty For Telnet",
                
            ),400

        pass_obj["secret_password"] = pass_obj["secret_password"].strip()

        if pass_obj["secret_password"].strip() == "":
            return (
                f"{pass_obj['password_group']} : Secret Password Field Can Not Be Empty For Telnet",
                400,
            )

        password_exist.secret_password = pass_obj["secret_password"]
    else:
        password_exist.password_group_type = "SSH"

    return password_exist, 200


def add_password_group_util(pass_obj, update):
    try:
        name_response, status = validate_password_group_name(pass_obj)

        if status != 200:
            return name_response, status

        password_group = configs.db.query(PasswordGroupTable).filter(
            PasswordGroupTable.password_group == name_response
        ).first()
        
        # print("password group is::::::::::::::::::::::::::::::",password_group,file=sys.stderr)
        exist = False
        if password_group is not None:
            if not update:
                return f"{pass_obj['password_group']} : Password Group Already Exists",400
            else:
                exist = True

        if not exist:
            password_group = PasswordGroupTable()
            password_group.password_group = name_response
            pass_id = password_group.password_group_id
            # print("pass id issssssssssssssssss:::::::::::::::::::::::::::",pass_id,file=sys.stderr)

        password_group, status = validate_password_group_credentials(
            pass_obj, password_group
        )
        print("password group for validate passowrd group credential is::",password_group)
        if status != 200:
            return password_group, status

        if update:
            
            status = UpdateDBData(password_group)
            # print("password group status is::::::::::::::::::::::::::::::::",status,file=sys.stderr)
            if status == 200:
                
                pass_data = dict(pass_obj)
                passworg_group_update = configs.db.query(PasswordGroupTable).filter_by(password_group = pass_data['password_group']).first()
                if passworg_group_update:
                    password_group_id = passworg_group_update.password_group_id
                    # print("password group id is:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::update",password_group_id,file=sys.stderr)
                    pass_data['password_group_id'] = password_group_id
                    # print(f"{pass_data['password_group_id']} is :::::::::::::::::::::::::::::::::::::::::::::::::::", file=sys.stderr)
                    msg=   f"{pass_obj['password_group']} : Password Group Updated Successfully"
                    password_group_data = {
                        "data":pass_data,
                        "message":msg
                    }
                    # print("password group data for update is:::::::::::::::::::::::::::::::::::::",password_group_data,file=sys.stderr)
                    return (
                        password_group_data
                    ),200
                    # return (
                    #     f"{pass_obj['password_group']} : Password Group Updated Successfully",
                    #     200,
                    # )
                else:
                    print("error in password group updates")
        else:
            
            status = InsertDBData(password_group)
            if status == 200:
                pass_data = dict(pass_obj)
                password_group_id = password_group.password_group_id
                pass_data['password_group_id'] = password_group_id
                msg=   f"{pass_obj['password_group']} : Password Group Inserted Successfully"
                password_group_data = {
                    "data":pass_data,
                    "message":msg
                }
                # print("passwprd group for insertation is:::::::::::::::::::::::::::::::::::::::",password_group_data,file=sys.stderr)
                return (
                    password_group_data
                ),200

        return f"{pass_obj['password_group']} : Server Error", 500

    except Exception:
        traceback.print_exc()
        return f"Server Error", 500


def edit_password_group_util(pass_obj):
    try:

        password_exist = configs.db.query(PasswordGroupTable).filter(
            PasswordGroupTable.password_group_id == pass_obj["password_group_id"]).first()

        if password_exist is None:
            return f"Password Group Does Not Found", 400

        if password_exist.password_group == "default_password":
            return f"Password Group (default_password) Is Not Editable", 400

        name_response, status = validate_password_group_name(pass_obj)

        if status != 200:
            return name_response, status

        password_group = configs.db.query(PasswordGroupTable).filter(
            PasswordGroupTable.password_group == name_response).first()
        
        if password_group is not None:
            if password_exist.password_group_id != password_group.password_group_id:
                return f"{pass_obj['password_group']} : Password Group Name Is Already Assigned",400
                

        password_exist.password_group = name_response

        password_exist, status = validate_password_group_credentials(
            pass_obj, password_exist
        )
        if status != 200:
            return password_exist, status

        status = UpdateDBData(password_exist)
        if status == 200:
            pass_data = dict(pass_obj)
            password_group_id = password_group.password_group_id
            pass_data['password_group_id'] = password_group_id
            msg=   f"{pass_obj['password_group']} : Password Group Updated Successfully"
            password_group_data = {
                    "data":pass_data,
                    "message":msg
            }
            return (
                    password_group_data
                ),200
            # return (
            #     f"{pass_obj['password_group']} : Password Group Updated Successfully",
            #     200,
            # )

        return f"{pass_obj['password_group']} : Server Error", 500

    except Exception:
        traceback.print_exc()
        return f"Server Error", 500
