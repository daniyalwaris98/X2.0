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

from app import app, db
from app.middleware import token_required
from app.models.monitoring_models import *
from app.utilities.db_utils import *

from app.monitoring.device_monitoring.common_puller import *



def AddMonitoringDevice(MonitoringObj, row):
    
    try:
        
        if 'ip_address' not in MonitoringObj.keys():
            return f"Row {row} : Ip Address Is Missing", 500
        
        if MonitoringObj['ip_address'] is None:
            return f"Row {row} : Ip Address Can Not Be Empty", 500
        
        MonitoringObj['ip_address'] = MonitoringObj['ip_address'].strip()
        if MonitoringObj['ip_address'] == "":
            return f"Row {row} : Ip Address Can Not Be Empty", 500
        
        atom = Atom_Table.query.filter_by(ip_address=MonitoringObj['ip_address']).first()
        
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