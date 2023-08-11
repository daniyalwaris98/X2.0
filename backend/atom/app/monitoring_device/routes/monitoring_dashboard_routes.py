from ipaddress import ip_address
import sys
import json
import traceback
from flask_jsonpify import jsonify
from flask import Flask, request, make_response, Response, session
from app import app, db
from app.models.inventory_models import *
from sqlalchemy import func
from datetime import datetime
from app.middleware import token_required
from app import client

from app.monitoring_device.monitoring_utils import *


@app.route("/getavailabilityTimeline", methods=["POST"])
# @token_required
def GetAvailabilityTimeline():
    try:
        x = request.get_json()
        ip_address = x.get("ip_address")
        days = x.get("days")

        query_api = client.query_api()
        query = f'import "strings"\
        import "influxdata/influxdb/schema"\
        from(bucket: "monitoring")\
        |> range(start:-{days}d)\
        |> filter(fn: (r) => r["_measurement"] == "Devices")\
        |> filter(fn: (r) => r["IP_ADDRESS"] == "{ip_address}")\
        |> last()\
        |> schema.fieldsAsCols()\
        |> sort(columns: ["_time"], desc: false)'

        results = query_api.query(org="monetx", query=query)

        for table in results:
            for record in table.records:
                if record["Date"]:
                    print(f"{record['Date']} : {record['STATUS']}")

                    if record["STATUS"]:
                        if record["STATUS"] == "Up":
                            pass
                        elif record["STATUS"] == "Down":
                            pass

        return "OK", 200
    except Exception:
        traceback.print_exc()
        return "Can not provide timeline for Up Time", 500


@app.route("/getMonitoringDevicesCards", methods=["GET", "POST"])
# @token_required
def GetMonitoringDevicesCards():
    try:
        ip_address = "None"

        try:
            x = request.get_json()
            ip_address = x.get("ip_address")
        except Exception:
            traceback.print_exc()
            return "Ip Address Not Found In URL", 500

        globalDict = {"device": [], "interfaces": [], "alerts": []}
        try:
            query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "monitoring")\
            |> range(start:-60d)\
            |> filter(fn: (r) => r["_measurement"] == "Devices")\
            |> filter(fn: (r) => r["IP_ADDRESS"] == "{ip_address}")\
            |> last()\
            |> schema.fieldsAsCols()\
            |> highestMax(n:1,column: "_time")'

            globalDict["device"] = GetDeviceInfluxData(query)

        except Exception:
            traceback.print_exc()
            return "Server Error While Getting Device Data", 500

        if len(globalDict["device"]) > 0:
            try:
                query = f'import "strings"\
                import "influxdata/influxdb/schema"\
                from(bucket: "monitoring")\
                |> range(start: -1d)\
                |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
                |> filter(fn: (r) => r["IP_ADDRESS"] == "{ip_address}")\
                |> schema.fieldsAsCols()\
                |> sort(columns: ["_time"], desc: true)\
                |> unique(column: "Interface_Name")\
                |> yield(name: "unique")'

                globalDict["interfaces"] = GetInterfaceInfluxData(query)

            except Exception:
                traceback.print_exc()

            try:
                MonitoringAlertsList = []

                results = (
                    db.session.query(
                        Monitoring_Alerts_Table, Monitoring_Devices_Table, Atom_Table
                    )
                    .join(
                        Monitoring_Devices_Table,
                        Monitoring_Alerts_Table.monitoring_device_id
                        == Monitoring_Devices_Table.monitoring_device_id,
                    )
                    .join(
                        Atom_Table,
                        Monitoring_Devices_Table.atom_id == Atom_Table.atom_id,
                    )
                    .filter(Atom_Table.ip_address == ip_address)
                    .all()
                )
                
                MonitoringAlertsList = []
                for alert, monitoring, atom in results:
                    MonitoringDataDict = {}
                    MonitoringDataDict["alarm_id"] = alert.monitoring_alert_id
                    MonitoringDataDict["ip_address"] = atom.ip_address
                    MonitoringDataDict["description"] = alert.description
                    MonitoringDataDict["alert_type"] = alert.alert_type
                    MonitoringDataDict["function"] = atom.function
                    MonitoringDataDict["mail_status"] = alert.mail_status
                    MonitoringDataDict["date"] = alert.start_date

                    MonitoringAlertsList.append(MonitoringDataDict)
                
                globalDict["alerts"] = MonitoringAlertsList    
            except Exception:
                traceback.print_exc()

        return jsonify(globalDict), 200

    except Exception:
        traceback.print_exc()
        return "Server Error", 500



# @app.route("/getAvailabilityStatus", methods=["GET"])
# @token_required
# def GetAvailabilityStatus(user_data):
#     if True:
#         try:
#             queryString = f"select STATUS from monitoring_network_devices_table  where date > now() - interval 1 day;"
#             result = db.session.execute(queryString)
#             for row in result:
#                 pass
#         except Exception as e:
#             print(str(e), file=sys.stderr)
#             traceback.print_exc()
#             return str(e), 500
#     else:
#         print("Service not Available", file=sys.stderr)
#         return jsonify({"Response": "Service not Available"}), 503


# @app.route("/getCpuUtilization", methods=["GET"])
# @token_required
# def GetCpuUtilization(user_data):
#     if True:
#         try:
#             queryString = f"select CPU from monitoring_network_devices_table  where date > now() - interval 1 day;"
#             result = db.session.execute(queryString)
#             for row in result:
#                 pass
#         except Exception as e:
#             print(str(e), file=sys.stderr)
#             traceback.print_exc()
#             return str(e), 500
#     else:
#         print("Service not Available", file=sys.stderr)
#         return jsonify({"Response": "Service not Available"}), 503


# @app.route("/getMemoryUtilization", methods=["GET"])
# @token_required
# def GetMemoryUtilization(user_data):
#     if True:
#         try:
#             queryString = f"select MEMORY from monitoring_network_devices_table  where date > now() - interval 1 day;"
#             result = db.session.execute(queryString)
#             for row in result:
#                 pass
#         except Exception as e:
#             print(str(e), file=sys.stderr)
#             traceback.print_exc()
#             return str(e), 500
#     else:
#         print("Service not Available", file=sys.stderr)
#         return jsonify({"Response": "Service not Available"}), 503


# @app.route("/getinterfacedata", methods=["POST"])
# def int_fetching1():
#     jsonObj = request.get_json()

#     # 1
#     # Store the URL of your InfluxDB instance

#     org = "monetx"

#     # 2
#     # Query script
#     ip = jsonObj["ip_address"]
#     query_api = client.query_api()
#     query = f'import "strings"\
#     import "influxdata/influxdb/schema"\
#     from(bucket: "monitoring")\
#     |> range(start: -60d)\
#     |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
#     |> filter(fn: (r) => r["IP_ADDRESS"] == "{ip}")\
#     |> schema.fieldsAsCols()'

#     result = query_api.query(org="monetx", query=query)
#     resultd = []
#     resultu = []
#     resulta = []
#     objDict = {}

#     try:
#         for table in result:
#             for record in table.records:
#                 if record["Interface_Name"] == jsonObj["interface_name"]:
#                     print("printing record:", record, file=sys.stderr)
#                     objDict1 = {}
#                     objDict2 = {}
#                     objDict3 = {}
#                     if record["Download"]:
#                         objDict1["name"] = record["Interface_Name"]
#                         objDict1["value"] = record["Download"]
#                         objDict3["name"] = record["Interface_Name"]
#                         objDict3["download"] = record["Download"]
#                         objDict3["date"] = record["Date"]
#                         objDict1["date"] = record["Date"]

#                     if record["Upload"]:
#                         objDict2["name"] = record["Interface_Name"]
#                         objDict2["value"] = record["Upload"]
#                         objDict3["upload"] = record["Upload"]
#                         objDict2["date"] = record["Date"]

#                     # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

#                     resultd.append(objDict1)
#                     resultu.append(objDict2)
#                     resulta.append(objDict3)
#                     objDict["Download"] = resultd
#                     objDict["Upload"] = resultu
#                     objDict["All"] = resulta

#         # print(results,file= sys.stderr)
#         return jsonify(objDict)

#     except Exception as e:
#         print("Error", str(e), file=sys.stderr)
#         traceback.print_exc()
#         return "Error ", 500


@app.route("/getinterfaceband", methods=["POST"])
def int_band():
    jsonObj = request.get_json()
    # 1
    # Store the URL of your InfluxDB instance
    ip = jsonObj["ip_address"]
    org = "monetx"
    # bucket = "monitoring"

    # 2
    # Query script
    query_api = client.query_api()
    query = f'import "strings"\
    import "influxdata/influxdb/schema"\
    from(bucket: "monitoring")\
    |> range(start: -1d)\
    |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
    |> filter(fn: (r) => r["IP_ADDRESS"] == "{ip}")\
    |> schema.fieldsAsCols()'

    result = query_api.query(org="monetx", query=query)
    
    resulta = []
    objDict = {}
    upload = []
    download = []
    all = []
    final = []

    try:
        for table in result:
            for record in table.records:
                if record["Interface_Name"] == jsonObj["interface_name"]:
                    print("printing record:", record, file=sys.stderr)

                    objDict3 = {}

                    try:
                        objDict3["date"] = datetime.strptime(
                            record["Date"], "%Y-%m-%d %H:%M:%S.%f"
                        ).strftime("%Y-%m-%d %H:%M:%S")
                        print(objDict3["date"], file=sys.stderr)
                    except Exception as e:
                        traceback.print_exc()
                        objDict3["date"] = ""

                    if record["Download"]:
                        download.append(round(float(record["Download"]), 2))
                        objDict3["name"] = record["Interface_Name"]
                        objDict3["download"] = round(float(record["Download"]), 2)

                    if record["Upload"]:
                        upload.append(round(float(record["Upload"]), 2))
                        objDict3["upload"] = round(float(record["Upload"]), 2)
                        objDict3["total"] = round(
                            float(record["Upload"]) + float(record["Download"]), 2
                        )
                        all.append(objDict3["total"])
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    resulta.append(objDict3)
                    # objDict['Download'] = resultd
                    # objDict['Upload'] = resultu
        objDict["All"] = resulta[1:]
        print(
            f"@@@@@@@@@#########download{download},Upload{upload},all{all}",
            file=sys.stderr,
        )
        if len(download) > 0 and len(upload) > 0:
            final.append(
                {
                    "bandwidth": "Download",
                    "min": min(download),
                    "max": max(download),
                    "avg": round(sum(download) / len(download), 2),
                }
            )
            final.append(
                {
                    "bandwidth": "Upload",
                    "min": min(upload),
                    "max": max(upload),
                    "avg": round(sum(upload) / len(upload), 2),
                }
            )
            final.append(
                {
                    "bandwidth": "Average",
                    "min": min(all),
                    "max": max(all),
                    "avg": round(sum(all) / len(all), 2),
                }
            )
            objDict["table"] = final
        elif len(download) == 0 or len(upload) == 0:
            final.append({"bandwidth": "Download", "min": 0, "max": 0, "avg": 0})
            final.append({"bandwidth": "Upload", "min": 0, "max": 0, "avg": 0})
            final.append({"bandwidth": "Average", "min": 0, "max": 0, "avg": 0})

        # print(results,file= sys.stderr)
        return objDict, 200
    except Exception as e:
        print("Error", str(e), file=sys.stderr)
        traceback.print_exc()
        return "Error ", 500


@app.route("/getAllMonitoringVendors", methods=["GET"])
@token_required
def GetAllMonitoringVendors(user_data):
    try:
        queryString = f"select vendor,count(*) from monitoring_devices_table inner join atom_table on monitoring_devices_table.atom_id = atom_table.atom_id  group by vendor;"
        result = db.session.execute(queryString)
        objList = []

        for row in result:
            objDict = {}
            objDict["name"] = row[0]
            objDict["value"] = row[1]

            if row[0] is None:
                objDict["name"] = "Other"

            objList.append(objDict)

        return jsonify(objList), 200
    except Exception:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/getAllMonitoringFunctions", methods=["GET"])
@token_required
def GetAllMonitoringFunctions(user_data):
    try:
        queryString = f"select `function`,count(*) from monitoring_devices_table inner join atom_table on monitoring_devices_table.atom_id = atom_table.atom_id group by `function`;"
        result = db.session.execute(queryString)
        objList = []

        for row in result:
            objDict = {}
            objDict["name"] = row[0]
            objDict["value"] = row[1]
            objList.append(objDict)

        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error ", 500

