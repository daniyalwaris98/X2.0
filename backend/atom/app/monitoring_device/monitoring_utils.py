import traceback
from ipaddress import ip_address
import requests
import gzip
import json
from datetime import datetime
import sys

from flask import request, make_response
from flask_jsonpify import jsonify

from influxdb_client.client.write_api import SYNCHRONOUS, ASYNCHRONOUS
import influxdb_client
from influxdb_client.client.util.date_utils import get_date_helper

from app import client
from app import app, db
from app.middleware import token_required
from app.models.monitoring_models import *
from app.utilities.db_utils import *

from app.monitoring_device.common_puller import *


def AddMonitoringDevice(MonitoringObj, row, update):
    return "Currently Device Can Not Be Added Directly In Monitoring", 500
    try:
        if "ip_address" not in MonitoringObj.keys():
            return f"Row {row} : Ip Address Is Missing", 500

        if MonitoringObj["ip_address"] is None:
            return f"Row {row} : Ip Address Can Not Be Empty", 500

        MonitoringObj["ip_address"] = MonitoringObj["ip_address"].strip()
        if MonitoringObj["ip_address"] == "":
            return f"Row {row} : Ip Address Can Not Be Empty", 500

        atom = Atom_Table.query.filter_by(
            ip_address=MonitoringObj["ip_address"]
        ).first()

        if atom is None:
            return f"{MonitoringObj['ip_address']} : Ip Address Not Found In Atom", 500

    except Exception:
        traceback.print_exc()
        return "Exception", 500

    MonitoringObj["active"] = MonitoringObj["active"].title()
    print(MonitoringObj, file=sys.stderr)
    status = ping(MonitoringObj["ip_address"])[0]

    # ip = MonitoringObj['ip_address']
    # ip_test = ip.split(".")
    # for i in ip_test:
    #     if int(i) > 255:
    #         return "Wrong IP Address", 500
    #     else:
    #         pass

    Monitoringdb = Monitoring_Devices_Table()
    if "ip_address" in MonitoringObj:
        Monitoringdb.ip_address = MonitoringObj["ip_address"]
    if MonitoringObj["device_name"] == "":
        MonitoringObj["device_name"] = "NA"
    else:
        Monitoringdb.device_name = MonitoringObj["device_name"]
    Monitoringdb.source = "Static"
    Monitoringdb.vendor = MonitoringObj["vendor"]
    Monitoringdb.device_type = MonitoringObj["device_type"]
    Monitoringdb.function = MonitoringObj["function"]
    Monitoringdb.credentials = MonitoringObj["credentials"]
    Monitoringdb.active = MonitoringObj["active"]
    Monitoringdb.device_heatmap = MonitoringObj["active"]
    if MonitoringObj["active"] == "Active":
        Monitoringdb.status = status
    else:
        Monitoringdb.status = "NA"

    id = None
    queryString = f"select monitoring_id from monitoring_devices_table where ip_address='{MonitoringObj['ip_address']}';"
    result = db.session.execute(queryString)
    for row in result:
        id = row[0]
    if id == None:
        InsertDBData(Monitoringdb)
        print("Inserted ", MonitoringObj["ip_address"], file=sys.stderr)
        return "Inserted Successfully", 200
    else:
        Monitoringdb.monitoring_id = id
        UpdateDBData(Monitoringdb)
        print("Updated ", MonitoringObj["monitoring_id"], file=sys.stderr)

        return "Updated Successfully", 200


def GetDeviceMonitoringData(function, device_type, equal):
    if equal:
        query = f'import "strings"\
                import "influxdata/influxdb/schema"\
                from(bucket: "monitoring")\
                |> range(start:-60d)\
                |> filter(fn: (r) => r["_measurement"] == "Devices")\
                |> filter(fn: (r) => r["FUNCTION"] == "{function}")\
                |> last()\
                |> schema.fieldsAsCols()'

        if device_type is not None:
            query = f'import "strings"\
                import "influxdata/influxdb/schema"\
                from(bucket: "monitoring")\
                |> range(start:-60d)\
                |> filter(fn: (r) => r["_measurement"] == "Devices")\
                |> filter(fn: (r) => r["FUNCTION"] == "{function}")\
                |> filter(fn: (r) => r["DEVICE_TYPE"] == "{device_type}")\
                |> last()\
                |> schema.fieldsAsCols()'
    else:
        query = f'import "strings"\
                import "influxdata/influxdb/schema"\
                from(bucket: "monitoring")\
                |> range(start:-60d)\
                |> filter(fn: (r) => r["_measurement"] == "Devices")\
                |> filter(fn: (r) => r["FUNCTION"] != "{function}")\
                |> last()\
                |> schema.fieldsAsCols()'
    
    return GetDeviceInfluxData(query)




def GetInterfaceMonitoringData(function, device_type, equal):
    if equal:
        query = f'import "strings"\
                import "influxdata/influxdb/schema"\
                from(bucket: "monitoring")\
                |> range(start: -60d)\
                |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
                |> filter(fn: (r) => r["FUNCTION"] == "{function}")\
                |> schema.fieldsAsCols()\
                |> sort(columns: ["_time"], desc: true)\
                |> unique(column: "Interface_Name")\
                |> yield(name: "unique")'

        if device_type is not None:
            query = f'import "strings"\
                import "influxdata/influxdb/schema"\
                from(bucket: "monitoring")\
                |> range(start: -60d)\
                |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
                |> filter(fn: (r) => r["FUNCTION"] == "{function}")\
                |> filter(fn: (r) => r["DEVICE_TYPE"] == "{device_type}")\
                |> schema.fieldsAsCols()\
                |> sort(columns: ["_time"], desc: true)\
                |> unique(column: "Interface_Name")\
                |> yield(name: "unique")'
    else:
        query = f'import "strings"\
                import "influxdata/influxdb/schema"\
                from(bucket: "monitoring")\
                |> range(start: -60d)\
                |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
                |> filter(fn: (r) => r["FUNCTION"] != "{function}")\
                |> schema.fieldsAsCols()\
                |> sort(columns: ["_time"], desc: true)\
                |> unique(column: "Interface_Name")\
                |> yield(name: "unique")'
    
    return GetInterfaceInfluxData(query)


def GetDeviceInfluxData(query):
    query_api = client.query_api()
    result = query_api.query(org="monetx", query=query)
    resultList = []
    finalList = []
    try:
        for table in result:
            for record in table.records:
                try:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
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
                        if record["Response"]:
                            objDict["response"] = record["Response"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["STATUS"]:
                            objDict["status"] = record["STATUS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["Uptime"]:
                            objDict["uptime"] = record["Uptime"]
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
                        if record["CPU"]:
                            objDict["cpu"] = record["CPU"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Memory"]:
                            objDict["memory"] = record["Memory"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["PACKETS_LOSS"]:
                            objDict["packets"] = record["PACKETS_LOSS"]
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
                        if record["INTERFACES"]:
                            objDict["interfaces"] = record["INTERFACES"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_DESCRIPTION"]:
                            objDict["device_description"] = record["DEVICE_DESCRIPTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DISCOVERED_TIME"]:
                            objDict["discovered_time"] = record["DISCOVERED_TIME"]

                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    resultList.append(objDict)

                except Exception:
                    traceback.print_exc()

        finalList = sorted(resultList, key=lambda k: k["date"], reverse=False)

    except Exception:
        traceback.print_exc()

    return finalList



def GetInterfaceInfluxData(query):
    query_api = client.query_api()
    result = query_api.query(org="monetx", query=query)
    resultList = []
    finalList = []
    try:
        for table in result:
            for record in table.records:
                try:
                    objDict = {}
                    objDict = {}
                    print(record, file=sys.stderr)
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
                        if record["Download"] == None or record["Download"] == "":
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
                            objDict["upload_speed"] = round(float(record["Upload"]), 2)
                    except Exception as e:
                        objDict["upload_speed"] = 0
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
                        if record["Interface_Des"]:
                            objDict["interface_description"] = record["Interface_Des"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
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
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    resultList.append(objDict)

                except Exception:
                    traceback.print_exc()
                    

        finalList = list(
            {
                dictionary["interface_name"]: dictionary for dictionary in resultList
            }.values()
        )

    except Exception:
        traceback.print_exc()

    return finalList
