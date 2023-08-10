from app.uam.rack_utils import *


@app.route("/addRack", methods=["POST"])
@token_required
def addRack(user_data):
    try:
        rackObj = request.get_json()
        msg, status = AddRack(rackObj, False)

        print(msg, file=sys.stderr)

        return msg, status
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/editRack", methods=["POST"])
@token_required
def editRack(user_data):
    try:
        rackObj = request.get_json()
        msg, status = AddRack(rackObj, True)

        print(msg, file=sys.stderr)

        return msg, status
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/deleteRack", methods=["POST"])
@token_required
def deleteRack(user_data):
    try:
        rackNames = request.get_json()

        response, status = DeleteRack(rackNames)

        if status == 200:
            return jsonify(response), 200
        else:
            return response, 500

    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/getRacksBySiteDropdown", methods=["GET"])
@token_required
def GetRacksBySiteDropdown(user_data):
    try:
        site_name = request.args.get("site_name")
        print(f"Site Name: {site_name}", file=sys.stderr)
        objList = []

        result = (
            db.session.query(Rack_Table, Site_Table)
            .join(Site_Table, Rack_Table.site_id == Site_Table.site_id)
            .filter(Site_Table.site_name == site_name)
            .all()
        )

        for rack, site in result:
            rack_name = rack.rack_name
            objList.append(rack_name)

        print(objList, file=sys.stderr)
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error While Getting Racks", 500


@app.route("/getRackByRackName", methods=["GET"])
@token_required
def getRackDetailsByRackName(user_data):
    try:
        rack_name = request.args.get("rackname")
        if rack_name:
            rackList = GetRackDetailsByRackName(rack_name)
            print(rackList, file=sys.stderr)
            return jsonify(rackList), 200
        else:
            return "Please Provid Rack Name", 500
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return "Server Error", 500


@app.route("/getAllRacks", methods=["GET"])
@token_required
def getAllRacks(user_data):
    try:
        rackObjList = GetAllRacks()
        return jsonify(rackObjList), 200
    except Exception as e:
        traceback.print_exc()
        return "Error While Fetching Data", 500


@app.route("/totalRacks", methods=["GET"])
@token_required
def TotalRacks(user_data):
    try:
        queryString = f"select count(distinct RACK_NAME) from rack_table;"
        result = db.session.execute(queryString).scalar()
        queryString1 = f"select count(*) from uam_device_table;"
        result1 = db.session.execute(queryString1).scalar()
        queryString2 = f"select sum(RU) from rack_table;"
        result2 = db.session.execute(queryString2).scalar()
        objList = [
            {"name": "Racks", "value": result if result is not None else 0},
            {"name": "Devices", "value": result1 if result1 is not None else 0},
            {"name": "Total RU", "value": result2 if result2 is not None else 0},
        ]
        print(objList, file=sys.stderr)
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/rackLeaflet", methods=["GET"])
@token_required
def RackLeaflet(user_data):
    try:
        queryString = f"select LONGITUDE,LATITUDE from site_table where site_id in (select site_id from rack_table);"
        result = db.session.execute(queryString)
        objList = []
        for row in result:
            longitude = row[0]
            latitude = row[1]
            objDict = {}
            objDict["longitude"] = longitude
            objDict["latitude"] = latitude
            objList.append(objDict)
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/allFloors", methods=["GET"])
@token_required
def AllFloors(user_data):
    try:
        
        objList = []
        queryString = f"select FLOOR from rack_table;"
        result = db.session.execute(queryString)
        
        for row in result:
            floor = row[0]
            objList.append(floor)
        print(objList, file=sys.stderr)
        return jsonify(objList), 200
    
    except Exception as e:
        traceback.print_exc()
        return "Server Error While Getting Floors", 500


@app.route("/allRacks", methods=["GET"])
@token_required
def AllRacks(user_data):
    try:
        rackList = []
        racks = GetAllRacks()
        for rack in racks:
            rackList.append(rack["rack_name"])
        print(rackList, file=sys.stderr)

        return jsonify(rackList), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/topRacks", methods=["GET"])
@token_required
def TopRacks(user_data):
    try:
        queryString = f"select site_table.site_name,count(rack_name) from rack_table inner join site_table on rack_table.site_id = site_table.site_id group by site_name order by count(rack_name) DESC;"
        result = db.session.execute(queryString)
        objList = []
        for row in result:
            sites = row[0]
            count = row[1]
            objDict = {}
            objDict["name"] = sites
            objDict["value"] = count
            objList.append(objDict)
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500
