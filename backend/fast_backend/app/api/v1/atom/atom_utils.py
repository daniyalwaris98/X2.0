from app.api.v1.atom.atom_import import *


def edit_atom(device, row):
    try:
        if "ip_address" not in device:
            return f"Row {row} : Ip Address Is Missing", 500

        if device["ip_address"] is None:
            error = f"Row {row} : Ip Address Is Missing"
            return error, 500

        device["ip_address"] = device["ip_address"].strip()
        if device["ip_address"] == "":
            return f"Row {row} : Ip Address Is Missing", 500

        if (
                configs.db.query(AtomTable).filter(AtomTable.ip_address == device["ip_address"]).first()
                is not None
        ):
            return add_complete_atom(device, True)

        elif (
                configs.db.query(AtomTransitionTable).filter(
                    AtomTransitionTable.ip_address == device["ip_address"]
                ).first()
                is not None
        ):
            return add_transition_atom(device, True)

        else:
            return f"{device['ip_address']} : Device Not Found", 500
    except Exception:
        error = f"Error - Row {row} : Exception"
        print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500


def validate_site(device):
    # Site Check
    default_site = configs.db.query(SiteTable).filter(SiteTable.site_name == "NA").first()

    if device["site_name"] is None:
        pass
    else:
        device["site_name"] = device["site_name"].strip()

        if device["site_name"] == "":
            pass
        else:
            site_exist = configs.db.query(SiteTable).filte(
                SiteTable.site_name == device["site_name"]
            ).first()
            if site_exist is None:
                return f"{device['ip_address']} : Site Does Not Exists", 400
            else:
                return site_exist, 200

    return default_site, 200


def validate_rack(device, site):
    # Rack Check
    default_rack = configs.db.query(RackTable).filter(RackTable.rack_name == "NA").first()

    if device["rack_name"] is None:
        pass
    else:
        device["rack_name"] = device["rack_name"].strip()

        if device["rack_name"] == "":
            pass
        else:
            rack = configs.db.query(RackTable).filter(RackTable.rack_name == device["rack_name"]).first()
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
            password = PasswordGroupTable.query.filter_by(
                password_group=device["password_group"]
            ).first()
            if password is None:
                return f"{device['ip_address']} : Password Group Does Not Exist", 400
            else:
                return password, 200

    password = configs.db.query(PasswordGroupTable).filter(
        PasswordGroupTable.password_group == "NA"
    ).first()

    return password, 200


def validate_atom(device, update):
    try:
        if device["ip_address"].strip() == "":
            return f"Ip Address Can Not be Empty", 400

        if not update:
            if (
                    configs.db.query(AtomTable).filter(AtomTable.ip_address == device["ip_address"]).first()
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

        if device["device_name"] is None:
            return f"{device['ip_address']} : Device Name Can Not be Empty", 400

        device["device_name"] = device["device_name"].strip()
        if device["device_name"] == "":
            return f"{device['ip_address']} : Device Name Can Not be Empty", 400

        atom = configs.db.query(AtomTable).filter(AtomTable.device_name == device["device_name"]).first()
        if atom is not None:
            if atom.ip_address != device["ip_address"].strip():
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

        atom = configs.db.query(AtomTable).filter(AtomTable.ip_address == device["ip_address"].strip()).first()

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
                transit_obj = configs.db.query(AtomTransitionTable).filter(
                    AtomTransitionTable.ip_address == atom.ip_address
                ).first()

                if transit_obj is not None:
                    DeleteDBData(transit_obj)

            except Exception:
                traceback.print_exc()

        return msg, status

    except Exception:
        error = f"Error : Exception Occurred"
        print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500


def add_transition_atom(device, update):
    try:

        device["ip_address"] = device["ip_address"].strip()

        if device["ip_address"] == "":
            return f"IP Address Can Not Be Empty", 400

        if not update:
            if (
                    configs.db.query(AtomTable).filter(AtomTable.ip_address == device["ip_address"]).first()
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

        exist = True
        if trans_obj is None:
            exist = False
            trans_obj = AtomTransitionTable()

            trans_obj.ip_address = device["ip_address"]

        if device["device_name"] is not None:
            if device["device_name"].strip() != "":
                trans_obj.device_name = device["device_name"].strip()

        if device["vendor"] is not None:
            if device["vendor"].strip() != "":
                trans_obj.vendor = device["vendor"].strip()

        if device["function"].strip() != "":
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

        if exist:
            status = UpdateDBData(trans_obj)
            if status == 200:
                msg = f"{device['ip_address']} : Atom Updated Successfully"
                print(msg, file=sys.stderr)
                return msg, 200
            else:
                msg = f"{device['ip_address']} : Error While Updating Atom"
                print(msg, file=sys.stderr)
                return msg, 500
        else:
            status = InsertDBData(trans_obj)
            if status == 200:
                msg = f"{device['ip_address']} : Atom Inserted Successfully"
                print(msg, file=sys.stderr)
                return msg, 200
            else:
                msg = f"{device['ip_address']} : Error While Inserting Atom"
                print(msg, file=sys.stderr)
                return msg, 500

    except Exception:
        error = f"Error : Exception Occurred"
        print(error, file=sys.stderr)
        traceback.print_exc()
        return error, 500


def get_transition_atoms():
    obj_list = []
    try:
        results = configs.db.query(AtomTransitionTable).all()

        for result in results:
            print(result.as_dict(), file=sys.stderr)
            obj_dict = result.as_dict()

            msg, status = add_complete_atom(obj_dict, True)

            if status != 200:
                obj_dict["creation_date"] = str(obj_dict["creation_date"])
                obj_dict["modification_date"] = str(obj_dict["modification_date"])

                obj_dict["message"] = msg
                obj_dict["status"] = status
                obj_list.append(obj_dict)

    except Exception:
        traceback.print_exc()

    return obj_list


def validate_password_group_name(pass_obj):
    pass_obj["password_group"] = pass_obj["password_group"].strip()

    if pass_obj["password_group"] == "":
        return f"Password Group Can Not be Empty", 400

    if pass_obj["password_group"] == "NA":
        return f"{pass_obj['password_group']} : Password Group Name (NA) Is Not Allowed", 400

    return pass_obj["password_group"], 200


def validate_password_group_credentials(pass_obj, password_exist):
    pass_obj["username"] = pass_obj["username"].strip()
    if pass_obj["username"] == "":
        return (
            f"{pass_obj['password_group']} : Username Field Can Not Be Empty",
            400,
        )
    password_exist.username = pass_obj["username"]

    pass_obj["password"] = pass_obj["password"].strip()
    if pass_obj["password"] == "":
        return f"{pass_obj['password_group']} : Password Field Can Not be Empty", 400

    password_exist.password = pass_obj["password"]

    if str(pass_obj["password_group_type"]).lower() == "telnet":
        password_exist.password_group_type = "Telnet"

        if pass_obj["secret_password"] is None:
            return (
                f"{pass_obj['password_group']} : Secret Password Field Can Not Be Empty For Telnet",
                400,
            )

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


def add_password_group(pass_obj, update):
    try:
        name_response, status = validate_password_group_name(pass_obj)

        if status != 200:
            return name_response, status

        password_group = configs.db.query(PasswordGroupTable).filter(
            PasswordGroupTable.password_group == name_response
        ).first()

        exist = False
        if password_group is not None:
            if not update:
                return (
                    f"{pass_obj['password_group']} : Password Group Already Exists",
                    400,
                )
            else:
                exist = True

        if not exist:
            password_group = PasswordGroupTable()
            password_group.password_group = name_response

        password_group, status = validate_password_group_credentials(
            pass_obj, password_group
        )
        if status != 200:
            return password_group, status

        if update:
            status = UpdateDBData(password_group)
            if status == 200:
                return (
                    f"{pass_obj['password_group']} : Password Group Updated Successfully",
                    200,
                )
        else:
            status = InsertDBData(password_group)
            if status == 200:
                return (
                    f"{pass_obj['password_group']} : Password Group Inserted Successfully",
                    200,
                )

        return f"{pass_obj['password_group']} : Server Error", 500

    except Exception:
        traceback.print_exc()
        return f"Server Error", 500


def edit_password_group(pass_obj):
    try:

        password_exist = configs.db.query(PasswordGroupTable).filter(
            PasswordGroupTable.password_group_id == pass_obj["password_group_id"]).first()

        if password_exist is None:
            return f"Password Group Does Not Found", 400

        if password_exist.password_group == "NA":
            return f"Password Group (NA) Is Not Editable", 400

        name_response, status = validate_password_group_name(pass_obj)

        if status != 200:
            return name_response, status

        password_group = configs.db.query(PasswordGroupTable).filter(
            PasswordGroupTable.password_group == name_response).first()

        if password_group is not None:
            if password_exist.password_group_id != password_group.password_group_id:
                return (
                    f"{pass_obj['password_group']} : Password Group Name Is Already Assigned",
                    400,
                )

        password_exist.password_group = name_response

        password_exist, status = validate_password_group_credentials(
            pass_obj, password_exist
        )
        if status != 200:
            return password_exist, status

        status = UpdateDBData(password_exist)
        if status == 200:
            return (
                f"{pass_obj['password_group']} : Password Group Updated Successfully",
                200,
            )

        return f"{pass_obj['password_group']} : Server Error", 500

    except Exception:
        traceback.print_exc()
        return f"Server Error", 500
