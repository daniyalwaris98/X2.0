from app.uam.site_utils import *

@app.route("/addSite", methods=["POST"])
@token_required
def addSite(user_data):
    try:
        siteObj = request.get_json()
        msg, status = AddSite(siteObj)

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
        msg, status = EditSite(siteObj)

        print(msg, file=sys.stderr)

        return msg, status
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/deleteSite", methods=["POST"])
@token_required
def deleteSite(user_data):
    try:
        site_names = request.get_json()
        
        responseList = []
        errorList = []
        
        for site_name in site_names:
            msg, status = DeleteSite(site_name)
            
            if status == 200:
                responseList.append(msg)
            else:
                errorList.append(msg)

        responseDict = {
            "success": len(responseList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": responseList,
        }
            
        return jsonify(responseDict), 200
        
    except Exception as e:
        traceback.print_exc()
        return "Server Error While Deleting Site", 500
    

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


@app.route("/totalSites", methods=["GET"])
@token_required
def TotalSites(user_data):
    try:
        queryString = f"select count(distinct SITE_NAME) from site_table;"
        result = db.session.execute(queryString).scalar()
        queryString1 = f"select count(distinct DEVICE_NAME) from uam_device_table join atom_table on uam_device_table.atom_id = atom_table.atom_id;"
        result1 = db.session.execute(queryString1).scalar()
        queryString2 = f"select count(distinct MANUFACTURER) from uam_device_table;"
        result2 = db.session.execute(queryString2).scalar()
        objList = [
            {"name": "Sites", "value": result},
            {"name": "Devices", "value": result1},
            {"name": "Vendors", "value": result2},
        ]
        print(objList, file=sys.stderr)
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500
