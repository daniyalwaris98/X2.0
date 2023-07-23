from app import app
from app.models.inventory_models import *
from app.middleware import token_required
from app.uam.site_utils import *

from flask_jsonpify import jsonify
from flask import request

import traceback
import sys


@app.route("/addSite", methods=["POST"])
@token_required
def addSite(user_data):
    try:
        siteObj = request.get_json()
        msg, status = AddSite(siteObj, False)

        print(msg, file=sys.stderr)

        return msg, status
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/editSite", methods=["POST"])
@token_required
def editSite(user_data):
    try:
        siteObj = request.get_json()
        msg, status = AddSite(siteObj, True)

        print(msg, file=sys.stderr)

        return msg, status
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/deleteSite", methods=["POST"])
@token_required
def DeleteSite(user_data):
    if True:
        try:
            response = False
            siteIds = request.get_json()
            print("SITEEEEEEEEE", siteIds, file=sys.stderr)
            for siteId in siteIds:
                queryString1 = f"select count(*) from atom_table where SITE_NAME=(select SITE_NAME from phy_table where SITE_ID={siteId});"
                result1 = db.session.execute(queryString1).scalar()
                queryString2 = f"select count(*) from device_table where SITE_NAME=(select SITE_NAME from phy_table where SITE_ID ={siteId});"
                result2 = db.session.execute(queryString2).scalar()
                queryString3 = f"select count(*) from rack_table where SITE_NAME= (select SITE_NAME from phy_table where SITE_ID ={siteId});"
                result3 = db.session.execute(queryString3).scalar()
                print("RESULTSSSSSSSSS", result1, result2, result3, file=sys.stderr)
                if result1 > 0 and result2 > 0 and result3 > 0:
                    return "Site Name Found in Atom, Rack and Device", 500
                if result1 > 0 and result2 > 0:
                    return "Site Name Found in Atom and Device", 500
                if result1 > 0 and result3 > 0:
                    return "Site Name Found in Atom and Rack", 500
                if result2 > 0 and result3 > 0:
                    return "Site Name Found in Device and Rack", 500
                if result1 > 0:
                    return "Site Name Found in Atom", 500
                if result2 > 0:
                    return "Site Name Found in Device", 500
                if result3 > 0:
                    return "Site Name Found in Rack", 500
                else:
                    queryString = f"delete from phy_table where site_id = '{siteId}';"
                    db.session.execute(queryString)
                    db.session.commit()
                    response = True
            if response == True:
                return "Site Deleted Successfully", 200
        except Exception as e:
            traceback.print_exc()
            return "Site name is already in use\nSite can not be deleted", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getSiteBySiteName", methods=["GET"])
@token_required
def GetSiteBySiteName(user_data):
    try:
        site_name = request.args.get("site_name")
        siteList = []
        if site_name:
            siteObj = Site_Table.query.filter_by(site_name=site_name).all()
            if siteObj:
                for site in siteObj:
                    siteDataDict = {
                        "site_name": site.site_name,
                        "region": site.region,
                        "latitude": site.latitude,
                        "longitude": site.longitude,
                        "city": site.city,
                        "modification_date": site.modification_date,
                        "creation_date": site.creation_date,
                        "status": site.status,
                        "total_count": site.total_count,
                    }
                    siteList.append(siteDataDict)
                print(siteList, file=sys.stderr)
                return jsonify(siteList), 200
            else:
                print("Site Data not found in DB", file=sys.stderr)
                return jsonify({"response": "Site Data not found in DB"}), 500
        else:
            print("Can not Get Site Name from URL", file=sys.stderr)
            return jsonify({"response": "Can not Get Site Name from URL"}), 500
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/getSitesForDropdown", methods=["GET"])
@token_required
def GetSitesForDropDown(user_data):
    try:
        result = Site_Table.query.all()
        objList = []
        for site in result:
            site_name = site.site_name
            objList.append(site_name)
        print(objList, file=sys.stderr)
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/getAllSites", methods=["GET"])
@token_required
def getAllSites(user_data):
    try:
        siteObjList, status = GetAllSites()
        print(siteObjList, file=sys.stderr)
        if status == 200:
            return jsonify(siteObjList), 200
        else:
            return "Server Error", 500
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/phyLeaflet", methods=["GET"])
@token_required
def PhyLeaflet(user_data):
    try:
        objList = []
        sites, status = GetAllSites()

        print(sites, file=sys.stderr)

        if status != 200:
            return "Server Error", 500

        for site in sites:
            objDict = {}
            objDict["site_name"] = site["site_name"]
            objDict["longitude"] = site["longitude"]
            objDict["latitude"] = site["latitude"]
            objDict["city"] = site["city"]
            objList.append(objDict)

        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/topSites", methods=["GET"])
@token_required
def TopSites(user_data):
    try:
        queryString = "SELECT s.SITE_NAME, COUNT(u.UAM_ID) AS DEVICE_COUNT FROM site_table s LEFT JOIN rack_table r ON s.SITE_ID = r.SITE_ID LEFT JOIN atom_table a ON r.RACK_ID = a.RACK_ID LEFT JOIN uam_device_table u ON a.ATOM_ID = u.ATOM_ID GROUP BY s.SITE_NAME;"
        result = db.session.execute(queryString)
        objList = []
        for row in result:
            site = row[0]
            count = row[1]
            objDict = {}
            objDict[site] = count
            objList.append(objDict)
        y = {}
        for i in objList:
            for j in i:
                y[j] = i[j]

        print(objList, file=sys.stderr)
        return (y), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/dataCentreStatus", methods=["GET"])
@token_required
def DataCentreStatus(user_data):
    try:
        queryString = (
            f"select distinct STATUS, count(STATUS) from site_table group by STATUS;"
        )
        result = db.session.execute(queryString)
        objList = []

        for row in result:
            objDict = {}
            status = row[0]
            count = row[1]

            objDict[status] = count
            # objDict["value"] = count
            objList.append(objDict)
        y = {}
        for i in objList:
            for j in i:
                y[j] = i[j]

        print(objList, file=sys.stderr)
        return (y), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500
