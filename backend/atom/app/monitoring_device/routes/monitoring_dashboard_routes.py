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
@token_required
def GetMonitoringDevicesCards(user_data):
    if True:
        try:
            x = request.get_json()
            ip_address = x.get("ip_address")

            org = "monetx"

            query_api = client.query_api()
            query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "monitoring")\
            |> range(start:-60d)\
            |> filter(fn: (r) => r["_measurement"] == "Devices")\
            |> filter(fn: (r) => r["IP_ADDRESS"] == "{ip_address}")\
            |> last()\
            |> schema.fieldsAsCols()\
            |> highestMax(n:1,column: "_time")'

            cardsresult = query_api.query(org="monetx", query=query)
            globalDict = {}

            cardslist = []
            objDictip = {}
            objDict2 = {}
            objDict3 = {}
            objDict4 = {}
            objDict5 = {}
            objDict6 = {}
            objDict7 = {}
            objDict8 = {}
            objDict9 = {}
            objDict10 = {}
            objDict11 = {}
            objDict12 = {}
            objDict13 = {}
            objDict14 = {}
            objDict15 = {}
            objDict16 = {}
            objDict17 = {}
            objDictAccess = {}
            objDictClients = {}
            try:
                for table in cardsresult:
                    for record in table.records:
                        try:
                            if record["IP_ADDRESS"]:
                                objDictip["name"] = "IP ADDRESS"
                                objDictip["value"] = record["IP_ADDRESS"]
                                cardslist.append(objDictip)
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["FUNCTION"]:
                                objDict2["name"] = "Function"
                                objDict2["value"] = record["FUNCTION"]
                                cardslist.append(objDict2)
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass

                        try:
                            if record["Response"]:
                                objDict3["name"] = "response_time"
                                objDict3["value"] = round(float(record["Response"]), 2)

                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["STATUS"]:
                                objDict4["name"] = "availability"
                                if record["STATUS"] == "Up":
                                    objDict4["value"] = 100
                                else:
                                    objDict4["value"] = 0

                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass

                        try:
                            if record["Uptime"]:
                                objDict5["name"] = "Uptime"
                                objDict5["value"] = record["Uptime"]

                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass

                        try:
                            if record["Access_Points"]:
                                objDictAccess["name"] = "Access Points"
                                objDictAccess["value"] = record["Access_Points"]
                                cardslist.append(objDictAccess)
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass

                        try:
                            if record["Clients"]:
                                objDictClients["name"] = "Clients"
                                objDictClients["value"] = record["Clients"]
                                cardslist.append(objDictClients)

                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["VENDOR"]:
                                objDict17["name"] = "Vendor"
                                objDict17["value"] = record["VENDOR"]
                                cardslist.append(objDict17)
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["CPU"]:
                                objDict6["name"] = "cpu_utilization"
                                objDict6["value"] = round(float(record["CPU"]), 2)

                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["Memory"]:
                                objDict7["name"] = "memory_utilization"
                                objDict7["value"] = round(float(record["Memory"]), 2)

                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["PACKETS_LOSS"]:
                                objDict8["name"] = "packet_loss"
                                new_packet = record["PACKETS_LOSS"]
                                objDict8["value"] = float(new_packet)

                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["DEVICE_NAME"]:
                                objDict9["name"] = "Device Name"
                                objDict9["value"] = record["DEVICE_NAME"]
                                cardslist.append(objDict9)
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["INTERFACES"]:
                                objDict10["name"] = "interfaces"
                                objDict10["value"] = record["INTERFACES"]
                                # cardslist.append(objDict10)
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["Date"]:
                                objDict11["name"] = "date"
                                objDict11["value"] = record["Date"]
                                # cardslist.append(objDict11)
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["DEVICE_DESCRIPTION"]:
                                objDict12["name"] = "Device Description"
                                objDict12["value"] = record["DEVICE_DESCRIPTION"]
                                cardslist.append(objDict12)
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["DISCOVERED_TIME"]:
                                objDict13["name"] = "discovered time"
                                objDict13["value"] = record["DISCOVERED_TIME"]
                                # cardslist.append(objDict13)
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))
                        try:
                            if record["DEVICE_TYPE"]:
                                objDict15["name"] = "Device Type"
                                objDict15["value"] = record["DEVICE_TYPE"]
                                cardslist.append(objDict15)
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass

                # return jsonify(cardslist),200
            except Exception as e:
                print("Error", str(e), file=sys.stderr)
                traceback.print_exc()
                return "Error ", 500

            finalcardslist = [
                i for n, i in enumerate(cardslist) if i not in cardslist[n + 1 :]
            ]
            globalDict["cards"] = finalcardslist

            # queryString = f"select TYPE from monitoring_devices_table where IP_ADDRESS='{ip_address}';"
            # result = db.session.execute(queryString)
            # for row in result:
            #     objDict14['name'] = 'Fetching Method'
            #     objDict14['value'] = row[0]
            #     cardslist.append(objDict14)
            objDict16["name"] = "Poll Using"
            objDict16["value"] = "IP Address"
            objDict1 = {}
            objDict1["name"] = "Monitoring Via"
            objDict1["value"] = "ICMP"
            cardslist.append(objDict16)
            cardslist.append(objDict1)

            if len(objDict4) >= 1:
                globalDict[objDict4["name"]] = objDict4["value"]
            if len(objDict3) > 1:
                globalDict[objDict3["name"]] = objDict3["value"]
            if len(objDict6) > 1:
                globalDict[objDict6["name"]] = objDict6["value"]
            if len(objDict7) > 1:
                globalDict[objDict7["name"]] = objDict7["value"]
            if len(objDict8) > 1:
                globalDict[objDict8["name"]] = objDict8["value"]
            print(globalDict, file=sys.stderr)

            # 2
            # Query script

            try:
                # if objDict4['value'] == 100:
                ip = x["ip_address"]

                query_api = client.query_api()
                query = f'import "strings"\
                import "influxdata/influxdb/schema"\
                from(bucket: "monitoring")\
                |> range(start: -1d)\
                |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
                |> filter(fn: (r) => r["IP_ADDRESS"] == "{ip}")\
                |> schema.fieldsAsCols()\
                |> sort(columns: ["_time"], desc: true)\
                |> unique(column: "Interface_Name")\
                |> yield(name: "unique")'

                result = query_api.query(org="monetx", query=query)
                interresults = []
                print("$$$$$$$$$$$$$$", result, file=sys.stderr)

                try:
                    for table in result:
                        for record in table.records:
                            print("#####result of recods", record, file=sys.stderr)

                            objDict = {}
                            try:
                                if record["IP_ADDRESS"]:
                                    objDict["ip_address"] = record["IP_ADDRESS"]
                            except Exception as e:
                                print("error", str(e), file=sys.stderr)
                                pass
                            try:
                                if record["DEVICE_NAME"]:
                                    objDict["device_name"] = record["DEVICE_NAME"]
                            except Exception as e:
                                print("error", str(e), file=sys.stderr)
                                pass
                            try:
                                if record["FUNCTION"]:
                                    objDict["function"] = record["FUNCTION"]
                            except Exception as e:
                                print("error", str(e), file=sys.stderr)
                                pass
                            try:
                                if record["Status"]:
                                    objDict["interface_status"] = record["Status"]
                            except Exception as e:
                                print("error", str(e), file=sys.stderr)
                                pass
                            try:
                                if record["VENDOR"]:
                                    objDict["vendor"] = record["VENDOR"]
                            except Exception as e:
                                print("error", str(e), file=sys.stderr)
                                pass
                            try:
                                if (
                                    record["Interface_Name"] == None
                                    or record["Interface_Name"] == ""
                                ):
                                    continue
                                else:
                                    objDict["interface_name"] = record["Interface_Name"]
                            except Exception as e:
                                print("error", str(e), file=sys.stderr)
                                continue
                            try:
                                if record["Interface Description"]:
                                    objDict["interface_description"] = record[
                                        "Interface Description"
                                    ]
                            except Exception as e:
                                print("error", str(e), file=sys.stderr)
                                pass
                            # try:
                            #     if record['Download']:
                            #         objDict['download_speed'] = record['Download']
                            # except Exception as e:
                            #     print("error",str(e),file=sys.stderr)
                            #     pass
                            # try:
                            #     if record['Upload']:
                            #         objDict['upload_speed'] = record['Upload']
                            # except Exception as e:
                            #     print("error",str(e),file=sys.stderr)
                            #     pass
                            try:
                                if (
                                    record["Download"] == None
                                    or record["Download"] == ""
                                ):
                                    objDict["download_speed"] = 0
                                else:
                                    objDict["download_speed"] = round(
                                        float(record["Download"]), 2
                                    )
                            except Exception as e:
                                objDict["download_speed"] = 0
                                print("error", str(e), file=sys.stderr)
                                pass
                            try:
                                if record["Upload"] == None or record["Upload"] == "":
                                    objDict["upload_speed"] = 0
                                else:
                                    objDict["upload_speed"] = round(
                                        float(record["Upload"]), 2
                                    )
                            except Exception as e:
                                objDict["upload_speed"] = 0
                                print("error", str(e), file=sys.stderr)
                                pass
                            try:
                                if record["Date"]:
                                    temp = datetime.strptime(
                                        record["Date"], "%m-%d-%y %H:%M:%S"
                                    )
                                    objDict["date"] = str(temp.time())
                            except Exception as e:
                                try:
                                    temp = datetime.strptime(
                                        record["Date"], "%y-%m-%d %H:%M:%S"
                                    )
                                    objDict["date"] = str(temp.time())
                                except Exception as e:
                                    print("error", str(e), file=sys.stderr)
                                pass
                            try:
                                if record["DEVICE_NAME"]:
                                    objDict["device_name"] = record["DEVICE_NAME"]
                            except Exception as e:
                                print("error", str(e), file=sys.stderr)
                                pass

                            # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                            interresults.append(objDict)

                    # [i for n, i in enumerate(cardslist) if i not in cardslist[n + 1:]]
                    final_interfaces = list(
                        {
                            dictionary["interface_name"]: dictionary
                            for dictionary in interresults
                        }.values()
                    )
                    print("printing interfaces of ", final_interfaces, file=sys.stderr)
                    # list(map(dict, set(tuple(d.items()) for d in interresults)))

                    print(cardslist, file=sys.stderr)
                    globalDict["interfaces"] = final_interfaces
                except Exception as e:
                    print("Error", str(e), file=sys.stderr)
                    traceback.print_exc()
                    return "Error ", 500
                # else:
                #     globalDict['interfaces'] = []
            except:
                globalDict["interfaces"] = []

            MonitoringAlertsList = []

            queryString = f"select * from alerts_table where ip_address='{ip_address}';"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict["alarm_id"] = MonitoringObj[0]
                MonitoringDataDict["ip_address"] = MonitoringObj[1]
                MonitoringDataDict["description"] = MonitoringObj[2]
                MonitoringDataDict["alert_type"] = MonitoringObj[3]
                MonitoringDataDict["function"] = MonitoringObj[4]
                MonitoringDataDict["mail_status"] = MonitoringObj[5]
                MonitoringDataDict["date"] = MonitoringObj[8]

                MonitoringAlertsList.append(MonitoringDataDict)

            globalDict["alerts"] = MonitoringAlertsList
            return globalDict, 200
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/interfacelist", methods=["POST"])
@token_required
def GetPacketLoss(user_data):
    if True:
        try:
            queryString = f"select PACKETS_LOSS from monitoring_network_devices_table  where date > now() - interval 1 day;"
            result = db.session.execute(queryString)
            for row in result:
                pass
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAvailabilityStatus", methods=["GET"])
@token_required
def GetAvailabilityStatus(user_data):
    if True:
        try:
            queryString = f"select STATUS from monitoring_network_devices_table  where date > now() - interval 1 day;"
            result = db.session.execute(queryString)
            for row in result:
                pass
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getCpuUtilization", methods=["GET"])
@token_required
def GetCpuUtilization(user_data):
    if True:
        try:
            queryString = f"select CPU from monitoring_network_devices_table  where date > now() - interval 1 day;"
            result = db.session.execute(queryString)
            for row in result:
                pass
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getMemoryUtilization", methods=["GET"])
@token_required
def GetMemoryUtilization(user_data):
    if True:
        try:
            queryString = f"select MEMORY from monitoring_network_devices_table  where date > now() - interval 1 day;"
            result = db.session.execute(queryString)
            for row in result:
                pass
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getinterfacedata", methods=["POST"])
def int_fetching1():
    jsonObj = request.get_json()

    # 1
    # Store the URL of your InfluxDB instance

    org = "monetx"

    # 2
    # Query script
    ip = jsonObj["ip_address"]
    query_api = client.query_api()
    query = f'import "strings"\
    import "influxdata/influxdb/schema"\
    from(bucket: "monitoring")\
    |> range(start: -60d)\
    |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
    |> filter(fn: (r) => r["IP_ADDRESS"] == "{ip}")\
    |> schema.fieldsAsCols()'

    result = query_api.query(org="monetx", query=query)
    resultd = []
    resultu = []
    resulta = []
    objDict = {}

    try:
        for table in result:
            for record in table.records:
                if record["Interface_Name"] == jsonObj["interface_name"]:
                    print("printing record:", record, file=sys.stderr)
                    objDict1 = {}
                    objDict2 = {}
                    objDict3 = {}
                    if record["Download"]:
                        objDict1["name"] = record["Interface_Name"]
                        objDict1["value"] = record["Download"]
                        objDict3["name"] = record["Interface_Name"]
                        objDict3["download"] = record["Download"]
                        objDict3["date"] = record["Date"]
                        objDict1["date"] = record["Date"]

                    if record["Upload"]:
                        objDict2["name"] = record["Interface_Name"]
                        objDict2["value"] = record["Upload"]
                        objDict3["upload"] = record["Upload"]
                        objDict2["date"] = record["Date"]

                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    resultd.append(objDict1)
                    resultu.append(objDict2)
                    resulta.append(objDict3)
                    objDict["Download"] = resultd
                    objDict["Upload"] = resultu
                    objDict["All"] = resulta

        # print(results,file= sys.stderr)
        return jsonify(objDict)

    except Exception as e:
        print("Error", str(e), file=sys.stderr)
        traceback.print_exc()
        return "Error ", 500


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
    print(
        "##############################%$^%^45printing result value ",
        result,
        file=sys.stderr,
    )
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


@app.route("/getIPAlerts", methods=["POST"])
@token_required
def GetIPAlerts(user_data):
    try:
        jsonObj = request.get_json()
        # 1
        # Store the URL of your InfluxDB instance
        ip_address = jsonObj["ip_address"]
        MonitoringAlertsList = []

        queryString = f"select * from alerts_table where ip_address='{ip_address}';"
        results = db.session.execute(queryString)

        for MonitoringObj in results:
            MonitoringDataDict = {}
            MonitoringDataDict["alarm_id"] = MonitoringObj[0]
            MonitoringDataDict["ip_address"] = MonitoringObj[1]
            MonitoringDataDict["description"] = MonitoringObj[2]
            MonitoringDataDict["alert_type"] = MonitoringObj[3]
            MonitoringDataDict["function"] = MonitoringObj[4]
            MonitoringDataDict["mail_status"] = MonitoringObj[5]
            MonitoringDataDict["date"] = MonitoringObj[8]

            MonitoringAlertsList.append(MonitoringDataDict)

        return jsonify(MonitoringAlertsList), 200
    except Exception as e:
        print("Error", str(e), file=sys.stderr)
        traceback.print_exc()
        return "Error ", 500
