from app.uam.uam_utils import *


def FormatDate(date):
    result = datetime(2000, 1, 1)
    try:
        result = date.strftime("%d-%m-%Y")
    except Exception:
        traceback.print_exc()

    return result


def checkSiteName(siteObj):
    if "site_name" not in siteObj.keys():
        return "Site Name Can Not Be Empty", 500

    if siteObj["site_name"] is None:
        return "Site Name Can Not Be Empty", 500

    siteObj["site_name"] = siteObj["site_name"].strip()

    if siteObj["site_name"] == "":
        return "Site Name Can Not Be Empty", 500

    if siteObj["site_name"].lower() == "na":
        return "Site Name (NA) Is Not Allowed", 500

    site_exist = Site_Table.query.filter_by(site_name=siteObj["site_name"]).first()

    return site_exist, 200


def checkSiteID(siteObj):
    if "site_id" not in siteObj.keys():
        return "Site ID Is Missing", 500

    if siteObj["site_id"] is None:
        return "Site ID Is Missing", 500

    site_exist = Site_Table.query.filter_by(site_id=siteObj["site_id"]).first()

    return site_exist, 200


def checkSiteStatus(siteObj):
    if "status" not in siteObj.keys():
        return "Status Must Be Defined", 500

    if siteObj["status"] is None:
        return "Status Must Be Defined", 500

    siteObj["status"] = str(siteObj["status"]).strip().title()

    if siteObj["status"] == "":
        return "Status Must Be Defined (Production / Not Production)", 500

    if siteObj["status"] != "Production" and siteObj["status"] != "Not Production":
        return "Status Must Be Defined (Production / Not Production)", 500

    return siteObj["status"], 200


def checkSiteOptionalData(siteObj, site_exist):
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

    return site_exist


def AddSite(siteObj):
    try:
        site_exist, status = checkSiteName(siteObj)

        if status == 500:
            return site_exist, status

        if site_exist is not None:
            return "Site Name Is Already Assigned", 500

        site_exist = Site_Table()
        site_exist.site_name = siteObj["site_name"]

        site_status, status = checkSiteStatus(siteObj)
        if status == 500:
            return site_status, 500

        site_exist.status = site_status

        site_exist = checkSiteOptionalData(siteObj, site_exist)

        msg = ""
        status = 500

        status = InsertDBData(site_exist)
        if status == 200:
            msg = "Site Inserted Successfully"
        else:
            msg = "Error While Inserting Site"

        return msg, status

    except Exception:
        traceback.print_exc()
        return "Server Error", 500


def EditSite(siteObj):
    try:
        site_exist, status = checkSiteID(siteObj)

        if status == 500:
            return site_exist, 500

        if site_exist is None:
            return "Site Does Not Exist", 500

        response, status = checkSiteName(siteObj)

        if status == 500:
            return response, status
        
        if response is not None:
            if response.site_id != site_exist.site_id:
                return "Site Name Is Already Assigned", 500
            
        site_exist.site_name = siteObj["site_name"]
        
        site_status, status = checkSiteStatus(siteObj)
        if status == 500:
            return site_status, 500

        site_exist.status = site_status
        site_exist = checkSiteOptionalData(siteObj, site_exist)
        
        msg = ""
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


def DeleteSite(site_name):
    try:
        site = Site_Table.query.filter_by(site_name=site_name).first()

        if site is None:
            return f"{site_name} : Site Name Not Found", 500

        racks = Rack_Table.query.filter_by(site_id=site.site_id).all()
        for rack in racks:
            atoms = Atom_Table.query.filter_by(rack_id=rack.rack_id).all()
            if len(atoms) > 0:
                return f"{site_name} : Site Is In Use. Site Can Not Be Deleted", 500
            else:
                DeleteDBData(rack)

        if DeleteDBData(site) == 200:
            return f"{site_name} : Site & Its Racks Deleted Successfully", 200
        else:
            return f"{site_name} : Error While Deleting Site", 500

    except Exception as e:
        traceback.print_exc()
        return f"{site_name} : Exeption Occured While Deleting Site", 500
