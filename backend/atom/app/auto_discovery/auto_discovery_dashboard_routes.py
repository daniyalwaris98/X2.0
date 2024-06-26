import sys
import traceback
from datetime import datetime

from flask import jsonify

from app import app, db
from app.middleware import token_required

from app.models.auto_discovery_models import *
from app.utilities.db_utils import *


def FormatDate(date):
    # print(date, file=sys.stderr)
    if date is not None:
        result = date.strftime("%d-%m-%Y")
    else:
        # result = datetime(2000, 1, 1)
        result = datetime(1, 1, 2000)

    return result


def FormatStringDate(date):
    print(date, file=sys.stderr)

    try:
        if date is not None:
            if "-" in date:
                result = datetime.strptime(date, "%d-%m-%Y")
            elif "/" in date:
                result = datetime.strptime(date, "%d/%m/%Y")
            else:
                print("incorrect date format", file=sys.stderr)
                result = datetime(2000, 1, 1)
        else:
            # result = datetime(2000, 1, 1)
            result = datetime(2000, 1, 1)
    except:
        result = datetime(2000, 1, 1)
        print("date format exception", file=sys.stderr)

    return result


@app.route("/getTopOsForDiscovery", methods=["GET"])
@token_required
def GetTopOsForDiscovery(user_data):
    if True:
        try:
            queryString = f"select OS_TYPE,count(OS_TYPE) as count from auto_discovery_table group by OS_TYPE ORDER by count DESC LIMIT 10;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                objDict = {}
                objDict["name"] = row[0]
                objDict["value"] = row[1]
                objList.append(objDict)
            return jsonify(objList), 200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
        else:
            print("Service not Available", file=sys.stderr)
            return jsonify({"Response": "Service not Available"}), 503


@app.route("/getTopVendorsForDiscovery", methods=["GET"])
@token_required
def GetTopVendorsForDiscovery(user_data):
    if True:
        try:
            queryString = f"select VENDOR,count(VENDOR) as count from auto_discovery_table group by VENDOR ORDER by count DESC LIMIT 10;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                objDict = {}
                objDict["name"] = row[0]
                objDict["value"] = row[1]
                objList.append(objDict)
            return jsonify(objList), 200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
        else:
            print("Service not Available", file=sys.stderr)
            return jsonify({"Response": "Service not Available"}), 503


@app.route("/getSnmpStatusGraph", methods=["GET"])
@token_required
def GetSnmpStatusGraph(user_data):
    try:
        queryString = f"select snmp_status, count(snmp_status) from auto_discovery_table group by snmp_status;"
        result = db.session.execute(queryString)

        enable = 0
        disable = 0

        for row in result:
            if row[0] == "Enabled":
                enable += row[1]
            else:
                disable += row[1]

        objList = [
            {"name": "SNMP Enabled", "value": enable},
            {"name": "SNMP Disabled", "value": disable},
        ]

        return jsonify(objList), 200

    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Server Error While Fetching Data", 500


@app.route("/getTopFunctionsForDiscovery", methods=["GET"])
@token_required
def GetTopFunctionsForDiscovery(user_data):
    if True:
        try:
            queryString = f"select `FUNCTION`,count(`FUNCTION`) as count from auto_discovery_table group by `FUNCTION` ORDER by count DESC LIMIT 5;"
            result = db.session.execute(queryString)
            objList = {"name": [], "value": []}
            for row in result:
                objList["name"].append(row[0].capitalize())
                objList["value"].append(row[1])
            return jsonify(objList), 200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
        else:
            print("Service not Available", file=sys.stderr)
            return jsonify({"Response": "Service not Available"}), 503


@app.route("/getCredentialsGraph", methods=["GET"])
@token_required
def GetCredentailsGraph(user_data):
    if True:
        try:
            objDict = {
                "name": ["SNMP V1/V2", "SNMP V3", "SSH Login"],
                "value": [0, 0, 0],
            }

            queryString = f"select SNMP_VERSION,count(SNMP_VERSION) from auto_discovery_table group by SNMP_VERSION;"
            result = db.session.execute(queryString)

            for row in result:
                if (row[0]) == "SNMPv2-MIB":
                    objDict["value"][0] = row[1]
                elif (row[0]) == "SNMPv3-MIB":
                    objDict["value"][1] = row[1]

            queryString = f"select SSH_STATUS,count(SSH_STATUS) from auto_discovery_table group by SSH_STATUS;"
            result = db.session.execute(queryString)

            for row in result:
                if (row[0]) == "True":
                    objDict["value"][2] = row[1]

            print(objDict, file=sys.stderr)

            return jsonify(objDict), 200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
        else:
            print("Service not Available", file=sys.stderr)
            return jsonify({"Response": "Service not Available"}), 503
