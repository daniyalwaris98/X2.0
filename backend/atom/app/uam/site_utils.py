import traceback

from app.models.inventory_models import Site_Table
from app.utilities.db_utils import *


def FormatDate(date):
    result = datetime(2000, 1, 1)
    try:
        result = date.strftime("%d-%m-%Y")
    except Exception:
        traceback.print_exc()

    return result


def AddSite(siteObj, update):
    try:
        if "site_name" not in siteObj.keys():
            return "Site Name Can Not Be Empty", 500

        if siteObj["site_name"] is None:
            return "Site Name Can Not Be Empty", 500

        siteObj["site_name"] = siteObj["site_name"].strip()

        if siteObj["site_name"] == "":
            return "Site Name Can Not Be Empty", 500

        site_exist = Site_Table.query.filter_by(site_name=siteObj["site_name"]).first()
        if update:
            if site_exist is None:
                return "Site Does Not Exist", 500
        else:
            if site_exist is not None:
                return "Site Already Exists", 500

            site_exist = Site_Table()
            site_exist.site_name = siteObj["site_name"]

        if "status" not in siteObj.keys():
            return "Status Must Be Defined", 500

        if siteObj["status"] is None:
            return "Status Must Be Defined", 500

        siteObj["status"] = siteObj["status"].strip()

        if siteObj["status"] == "":
            return "Status Must Be Defined (Production / Not Production)", 500

        if (
            siteObj["status"].capitalize() != "Production"
            and siteObj["status"].capitalize() != "Not Production"
        ):
            return "Status Must Be Defined (Production / Not Production)", 500

        site_exist.status = siteObj["status"]

        if "region" in siteObj.keys():
            if siteObj["region"] is not None:
                site_exist.region_name = siteObj["region"]

        if "city" in siteObj.keys():
            if siteObj["city"] is not None:
                site_exist.city = siteObj["city"]

        if "longitude" in siteObj.keys():
            if siteObj["longitude"] is not None:
                site_exist.longitude = siteObj["longitude"]

        if "latitude" in siteObj.keys():
            if siteObj["latitude"] is not None:
                site_exist.latitude = siteObj["latitude"]

        msg = ""
        status = 500
        if update:
            status = UpdateDBData(site_exist)
            if status == 200:
                msg = "Site Updated Successfully"
            else:
                msg = "Error While Updating Site"
        else:
            status = InsertDBData(site_exist)
            if status == 200:
                msg = "Site Inserted Successfully"
            else:
                msg = "Error While Inserting Site"

        return msg, status

    except Exception:
        traceback.print_exc()
        return "Server Error", 500


def GetAllSites():
    try:
        siteObjList = []
        siteObjs = Site_Table.query.all()
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
        
        return siteObjList, 200
    except Exception:
        traceback.print_exc()
        return "Server Error", 500
        