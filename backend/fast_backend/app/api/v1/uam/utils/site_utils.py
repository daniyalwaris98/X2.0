import traceback

from app.models.atom_models import *
from app.models.site_rack_models import *
from app.utils.db_utils import *
from app.schema.response_schema import CustomResponse
custom_response = CustomResponse(data= "",message="",status="")


def FormatDate(date):
    result = datetime(2000, 1, 1)
    try:
        result = date.strftime("%d-%m-%Y")
    except Exception:
        traceback.print_exc()

    return result


def check_site_name(site_obj):
    site_obj["site_name"] = site_obj["site_name"].strip()

    if site_obj["site_name"] == "":
        custom_response.data = []
        custom_response.message = f"Site Name Can Not Be Empty"
        custom_response.status   = 400
        # return custom_response.as_tuple(),400
        
        return "Site Name Can Not Be Empty", 400

    if site_obj["site_name"].lower() == "default_site":
        custom_response.data = []
        custom_response.message = f"Site Name (default_site) Is Not Allowed"
        custom_response.status = 400
        # return "Site Name (default_site) Is Not Allowed", 400

    site_exist = configs.db.query(SiteTable).filter(SiteTable.site_name == site_obj["site_name"]).first()

    return site_exist, 200


def check_site_status(site_obj):
    site_obj["status"] = str(site_obj["status"]).strip().title()

    if site_obj["status"] == "":
        custom_response.data = []
        custom_response.message = f"Status Must Be Defined (Production / Not Production)"
        custom_response.status = 400
        return custom_response.as_tuple()
        # return "Status Must Be Defined (Production / Not Production)", 400

    if site_obj["status"] != "Production" and site_obj["status"] != "Not Production":
        custom_response.data = []
        custom_response.message = f"Status Must Be Defined (Production / Not Production)"
        custom_response.status = 400
        return custom_response.as_tuple()
        # return "Status Must Be Defined (Production / Not Production)", 400

    return site_obj["status"], 200


def check_site_optional_data(site_obj, site_exist):
    print("site obj is::::::::::::::::::::",site_obj,file=sys.stderr)
    if "region_name" in site_obj:
        if site_obj["region"] is not None:
            site_exist.region_name = site_obj["region"]

    if "city" in site_obj:
        if site_obj["city"] is not None:
            site_exist.city = site_obj["city"]

    if "longitude" in site_obj:
        if site_obj["longitude"] is not None:
            site_exist.longitude = site_obj["longitude"]

    if "latitude" in site_obj:
        if site_obj["latitude"] is not None:
            site_exist.latitude = site_obj["latitude"]

    return site_exist


def add_site_util(site_obj):
    try:
        site_exist, status = check_site_name(site_obj)

        if status == 400:
            return site_exist, status

        if site_exist is not None:
            custom_response.data = []
            custom_response.message = f"Site Name Is Already Assigned"
            custom_response.status = 400
            return custom_response.as_tuple(),400

        site_exist = SiteTable()
        site_exist.site_name = site_obj["site_name"]

        site_status, status = check_site_status(site_obj)
        if status != 200:
            return site_status, status

        site_exist.status = site_status

        site_exist = check_site_optional_data(site_obj, site_exist)

        status = InsertDBData(site_exist)
        if status == 200:
            msg = "Site Inserted Successfully"
            custom_response.data = []
            custom_response.message = msg
            custom_response.status = 200
            return custom_response.as_tuple()
        else:
            msg = "Error While Inserting Site"
            custom_response.data = []
            custom_response.message = msg
            custom_response.status = 500
            return custom_response.as_tuple()

        # return msg, status

    except Exception:
        traceback.print_exc()
        return "Server Error", 500


def edit_site_util(site_obj):
    try:
        site_exist = configs.db.query(SiteTable).filter(SiteTable.site_id == site_obj["site_id"]).first()
        default_rack = configs.db.query(RackTable).filter(RackTable.rack_name == "default_rack").first()

        if site_exist is None:
            return "Site Does Not Exist", 400

        if site_exist.site == default_rack.site_id:
            return "Default Site Is Not Editable", 400

        response, status = check_site_name(site_obj)

        if status != 200:
            return response, status

        if response is not None:
            if response.site_id != site_exist.site_id:
                return "Site Name Is Already Assigned", 400

        site_exist.site_name = site_obj["site_name"]

        site_status, status = check_site_status(site_obj)
        if status != 200:
            return site_status, status

        site_exist.status = site_status
        site_exist = check_site_optional_data(site_obj, site_exist)

        status = UpdateDBData(site_exist)
        if status == 200:
            msg = "Site Updated Successfully"
        else:
            msg = "Error While Updating Site"

        return msg, status

    except Exception:
        traceback.print_exc()
        return "Server Error", 500


def GetAllSites():
    try:
        siteObjList = []
        siteObjs = configs.db.query(SiteTable).all()
        for siteObj in siteObjs:
            siteDataDict = {
                "site_id": siteObj.site_id,
                "site_name": siteObj.site_name,
                "region": siteObj.region_name,
                "longitude": siteObj.longitude,
                "latitude": siteObj.latitude,
                "city": siteObj.city,
                "creation_date": FormatDate(siteObj.creation_date),
                "modification_date": FormatDate(siteObj.modification_date),
                "status": siteObj.status,
            }

            siteObjList.append(siteDataDict)
        #
        # return siteObjList, 200
    except Exception:
        traceback.print_exc()
        return "Server Error", 500


def delete_site_util(site_id):
    try:
        site = configs.db.query(SiteTable).filter(SiteTable.site_id == site_id).first()
        default_rack = configs.db.query(RackTable).filter(RackTable.rack_name == 'default_rack').first()

        if site is None:
            return f"{site_id} : Site Not Found", 400

        if site.site_id == default_rack.site_id:
            return f"{site_id} : Default Site Can Not Be Deleted", 400

        site_name = site.site_name

        racks = configs.db.query(RackTable).filter(RackTable.site_id == site_id).all()
        for rack in racks:
            atoms = configs.db.query(AtomTable).filter(AtomTable.rack_id == rack.rack_id).all()

            for atom in atoms:
                atom.rack_id = default_rack.rack_id
                UpdateDBData(atom)

            DeleteDBData(rack)

        if DeleteDBData(site) == 200:
            return f"{site_name} : Site & Its Racks Deleted Successfully", 200
        else:
            return f"{site_name} : Error While Deleting Site", 500

    except Exception:
        traceback.print_exc()
        return f"{site_id} : Exception Occurred While Deleting Site", 500
