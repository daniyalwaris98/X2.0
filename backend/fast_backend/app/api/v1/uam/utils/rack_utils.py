import traceback

from app.models.atom_models import *
from app.models.site_rack_models import *
from app.utils.db_utils import *


def format_date(date):
    result = datetime(2000, 1, 1)
    try:
        result = date.strftime("%d-%m-%Y")
    except Exception:
        traceback.print_exc()
    return result


def get_all_rack():
    rack_obj_list = []
    results = (
        configs.db.query(RackTable, SiteTable)
        .join(SiteTable, RackTable.site_id == SiteTable.site_id)
        .all()
    )

    for result in results:
        rack_obj, site_obj = result
        rack_data_dict = {
            "rack_id": rack_obj.rack_id,
            "rack_name": rack_obj.rack_name,
            "site_name": site_obj.site_name,
            "serial_number": rack_obj.serial_number,
            "manufacturer_date": format_date(rack_obj.manufacture_date),
            "unit_position": rack_obj.unit_position,
            "creation_date": format_date(rack_obj.creation_date),
            "modification_date": format_date(rack_obj.modification_date),
            "status": rack_obj.status,
            "ru": rack_obj.ru,
            "rfs_date": format_date(rack_obj.rfs_date),
            "height": rack_obj.height,
            "width": rack_obj.width,
            "pn_code": rack_obj.pn_code,
            "rack_model": rack_obj.rack_model,
            "brand": rack_obj.floor,
        }
        rack_obj_list.append(rack_data_dict)

    return rack_obj_list


def get_rack_details_by_rack_name(rack_name):
    rack_obj_list = []
    try:
        results = (
            configs.db.query(RackTable, SiteTable)
            .join(SiteTable, RackTable.site_id == SiteTable.site_id)
            .filter(RackTable.rack_name == rack_name)
            .all()
        )
        for result in results:
            try:
                rack_obj, site_obj = result
                rack_data_dict = {
                    "rack_id": rack_obj.rack_id,
                    "rack_name": rack_obj.rack_name,
                    "site_name": site_obj.site_name,
                    "serial_number": rack_obj.serial_number,
                    "manufacturer_date": format_date(rack_obj.manufacture_date),
                    "unit_position": rack_obj.unit_position,
                    "creation_date": format_date(rack_obj.creation_date),
                    "modification_date": format_date(rack_obj.modification_date),
                    "status": rack_obj.status,
                    "ru": rack_obj.ru,
                    "rfs_date": format_date(rack_obj.rfs_date),
                    "height": rack_obj.height,
                    "width": rack_obj.width,
                    "pn_code": rack_obj.pn_code,
                    "rack_model": rack_obj.rack_model,
                    "brand": rack_obj.floor,
                }
                rack_obj_list.append(rack_data_dict)

            except Exception:
                traceback.print_exc()
    except Exception:
        traceback.print_exc()
        return "Server Error While Fetching Rack Data", 500

    return rack_obj_list, 200


def check_rack_name(rack_obj):
    rack_obj["rack_name"] = rack_obj["rack_name"].strip()

    if rack_obj["rack_name"] == "" or rack_obj["rack_name"] == 'string':
        return "Rack Name Can Not Be Empty or string", 400

    if rack_obj["rack_name"].lower() == "default_rack":
        return "Rack Name (default_rack) Is Not Allowed", 400

    rack_exist = configs.db.query(RackTable).filter(RackTable.rack_name == rack_obj["rack_name"]).first()

    return rack_exist, 200


def check_rack_status(rack_obj):
    rack_obj["status"] = str(rack_obj["status"]).strip().title()

    if rack_obj["status"] == "":
        return "Status Must Be Defined (Production / Not Production)", 400

    if rack_obj["status"] != "Production" and rack_obj["status"] != "Not Production":
        return "Status Must Be Defined (Production / Not Production)", 400

    return rack_obj["status"], 200


def check_rack_optional_data(rack_obj, rack_exist):
    rack_obj = dict(rack_obj)
    if "ru" in rack_obj.keys():
        if rack_obj["ru"] is not None:
            try:
                rack_exist.ru = int(rack_obj["ru"])
            except Exception:
                rack_exist.ru = None

    if "height" in rack_obj.keys():
        if rack_obj["height"] is not None:
            try:
                rack_exist.height = int(rack_obj["height"])
            except Exception:
                rack_exist.height = None

    if "width" in rack_obj.keys():
        if rack_obj["width"] is not None:
            try:
                rack_exist.width = int(rack_obj["width"])
            except Exception:
                rack_exist.width = None

    if "serial_number" in rack_obj.keys():
        if rack_obj["serial_number"] is not None:
            rack_exist.serial_number = rack_obj["serial_number"]

    if "rack_model" in rack_obj.keys():
        if rack_obj["rack_model"] is not None:
            rack_exist.rack_model = rack_obj["rack_model"]

    if "floor" in rack_obj.keys():
        if rack_obj["floor"] is not None:
            rack_exist.floor = rack_obj["floor"]
    if "manufacture_date" in rack_obj.keys():
        if rack_obj['manufacture_date'] is not None:
            print("manufactureer date in rack obj is:::::::::::::::::;",rack_obj['manufacture_date'],file=sys.stderr)
            rack_exist.manufacture_date = rack_obj['manufacture_date']
    if "rfs_date" in rack_obj.keys():
        if rack_obj['rfs_date'] is not None:
            rack_exist.rfs_date = rack_obj['rfs_date'].isoformat()

    return rack_exist


def add_rack_util(rack_obj):
    try:
        print("rack onj in add rack utils is:::::::::::::::::::::::::::",rack_obj,file=sys.stderr)
        rack_group_data = {}
        rack_exist, status = check_rack_name(rack_obj)
        if status != 200:
            return rack_exist, status

        if rack_exist is not None:
            return "Rack Name Is Already Assigned", 400

        rack_exist = RackTable()
        rack_exist.rack_name = rack_obj["rack_name"]

        rack_obj["site_name"] = rack_obj["site_name"].strip()

        if rack_obj["site_name"] == "":
            return "Site Name Can Not Be Empty", 400

        if rack_obj["site_name"].lower() == "default_site":
            return "Site Name (default_site) Is Not Allowed", 400

        site_exist = configs.db.query(SiteTable).filter(SiteTable.site_name == rack_obj["site_name"]).first()
        if site_exist is None:
            return "Site Does Not Exist", 400

        rack_exist.site_id = site_exist.site_id

        rack_status, status = check_rack_status(rack_obj)
        if status != 200:
            return rack_status, status

        rack_exist.status = rack_status

        rack_exist = check_rack_optional_data(rack_obj, rack_exist)

        status = InsertDBData(rack_exist)
        if status == 200:
            rack_name = rack_exist.rack_name
            msg = f"{rack_name} : Rack Inserted Successfully"
            rack_data = dict(rack_obj)
            rack_data['rack_id'] = rack_exist.rack_id
            rack_group_data = {
                    "data":rack_data,
                    "message":msg
            }
        else:
            msg = "Error While Inserting Rack"

        return rack_group_data, status

    except Exception:
        traceback.print_exc()
        return "Server Error", 500


def edit_rack_util(rack_obj):
    try:

        rack_exist = configs.db.query(RackTable).filter(RackTable.rack_id == rack_obj["rack_id"]).first()

        if rack_exist is None:
            return "Rack Does Not Exist", 400

        response, status = check_rack_name(rack_obj)
        if status != 200:
            return response, status

        if response is not None:
            if response.rack_id != rack_exist.rack_id:
                return "Rack Name Is Already Assigned", 400

        rack_exist.rack_name = rack_obj["rack_name"]

        rack_obj["site_name"] = rack_obj["site_name"].strip()

        if rack_obj["site_name"] == "":
            return "Site Name Can Not Be Empty", 400

        if rack_obj["site_name"].lower() == "default_site":
            return "Site Name (default_site) Is Not Allowed", 400

        site_exist = configs.db.query(SiteTable).filter(SiteTable.site_name == rack_obj["site_name"]).first()

        if site_exist is None:
            return "Site Does Not Exist", 400

        rack_exist.site_id = site_exist.site_id

        rack_status, status = check_rack_status(rack_obj)
        if status != 200:
            return rack_status, status

        rack_exist.status = rack_status

        rack_exist = check_rack_optional_data(rack_obj, rack_exist)

        status = UpdateDBData(rack_exist)
        if status == 200:
            rack_name = rack_exist.rack_name
            msg = f"{rack_name} : Rack Updated Successfully"
            rack_data = dict(rack_obj)
            rack_data['rack_id'] = rack_exist.rack_id
            rack_group_data = {
                    "data":rack_data,
                    "message":msg
            }
            
        else:
            msg = "Error While Updating Rack"

        return rack_group_data, status

    except Exception:
        traceback.print_exc()
        return "Server Error", 500


def delete_rack_util(rack_ids):
    try:
        success_list = []
        error_list = []
        data = []
        default_rack = configs.db.query(RackTable).filter(RackTable.rack_name == "default_rack").first()

        for rack_id in rack_ids:
            try:
                rack = configs.db.query(RackTable).filter(RackTable.rack_id == rack_id).first()
                rack_associated_id = rack.rack_id
                rack_associated_with_atom = configs.db.query(AtomTable).filter_by(rack_id = rack_associated_id).first()
                if rack_associated_with_atom:
                    print("rack assocciate with the atom is:::::::::::::::::::::::",file=sys.stderr)
                    return f"{rack.rack_name} : Is Associated with the {rack_associated_with_atom.ip_address} and cannot be deleted",400
                if rack is None:
                    error_list.append(f"{rack_id} : Rack Does Not Exist"),400
                    continue

                if rack.rack_id == default_rack.rack_id:
                    error_list.append(f"{rack_id} : Default Rack Cannot Not Be Deleted"),400
                    continue
                
                

                devices = configs.db.query(AtomTable).filter(AtomTable.rack_id == rack.rack_id).all()
                for device in devices:
                    device.rack_id = default_rack.rack_id
                    UpdateDBData(device)

                status = DeleteDBData(rack)
                if status == 200:
                    deleted_rack = {
                        "rack_id":rack.rack_id
                    }
                    data.append(deleted_rack)
                    success_list.append(f"{rack.rack_name} : Rack Deleted Successfully"),200
                else:
                    error_list.append(f"{rack.rack_id} : Error While Deleting Rack"),400

            except Exception:
                traceback.print_exc()
                error_list.append(f"{rack_id} : Error While Deleting Rack")

        response_dict = {
            "data":data,
            "success": len(success_list),
            "error": len(error_list),
            "error_list": error_list,
            "success_list": success_list,
        }

        return response_dict, 200
    except Exception:
        traceback.print_exc()
        return "Server Error", 500



#updated rack utils