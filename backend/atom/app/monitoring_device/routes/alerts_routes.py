from app import app, db
import sys
from flask import Flask
import traceback
from flask_jsonpify import jsonify
from app.monitoring_device.alerts_utils import *
from flask import request, make_response, Response, session
from flask_jsonpify import jsonify
import sys
from flask import request, make_response, Response, session
from app.middleware import token_required
import threading
from datetime import datetime
from app import client


@app.route("/updateMonitoringAlertCPUThreshold", methods=["POST"])
@token_required
def updateMonitoringAlertCPUThreshold(user_data):
    try:
        pass
    except Exception as e:
        print("Error While Udating Monitoring CPU Alert Threshold", file=sys.stderr)
        traceback.print_exc()


@app.route("/getLowMonitoringAlerts", methods=["GET"])
# @token_required
def lowalerts():
    try:
        
        return jsonify(GetLevelAlert("low")), 200

    except Exception as e:
        traceback.print_exc()
        return "Something Went Wrong!", 500


@app.route("/getMedMonitoringAlerts", methods=["GET"])
@token_required
def medalerts(user_data):
    try:
        
        return jsonify(GetLevelAlert("medium")), 200
    
    except Exception as e:
        traceback.print_exc()
        return "Something Went Wrong!", 500


@app.route("/getCriticalAlerts", methods=["GET"])
# @token_required
def criticalalerts():
    try:
        
        return jsonify(GetLevelAlert("critical")), 200

    except Exception as e:
        traceback.print_exc()
        return "Something Went Wrong!", 500


@app.route("/getInformationalAlerts", methods=["GET"])
@token_required
def informationalalerts(user_data):
    try:
        
        return jsonify(GetLevelAlert("informational")), 200

    except Exception as e:
        traceback.print_exc()
        return "Something Went Wrong!", 500


@app.route("/getAllAlerts", methods=["GET"])
@token_required
def hialerts(user_data):
    if True:
        try:
            MonitoringObjList = []

            queryString = f"select * from monitoring_alerts_table where modification_date > now() - interval 1 day order by `modification_date` desc;"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict["alarm_id"] = MonitoringObj[0]
                MonitoringDataDict["ip_address"] = MonitoringObj[1]
                MonitoringDataDict["description"] = MonitoringObj[2]
                MonitoringDataDict["alert_type"] = MonitoringObj[3]
                MonitoringDataDict["function"] = MonitoringObj[4]
                MonitoringDataDict["alert_status"] = MonitoringObj[5]
                MonitoringDataDict["mail_status"] = MonitoringObj[6]
                MonitoringDataDict["date"] = MonitoringObj[8]

                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getIPAlerts", methods=["GET"])
@token_required
def ipalerts(user_data):
    try:
        ipaddress = request.args.get("ipaddress")

        MonitoringObjList = []
        results = (
            db.session.query(
                Monitoring_Alerts_Table, Monitoring_Devices_Table, Atom_Table
            )
            .join(
                Monitoring_Devices_Table,
                Monitoring_Devices_Table.monitoring_device_id
                == Monitoring_Alerts_Table.monitoring_device_id,
            )
            .join(Atom_Table, Atom_Table.atom_id == Monitoring_Devices_Table.atom_id)
            .filter(Atom_Table.ip_address == ipaddress)
            .order_by(Monitoring_Alerts_Table.modification_date.desc())
            .all()
        )

        for alert, monitoring, atom in results:
            MonitoringDataDict = {}
            MonitoringDataDict["alarm_id"] = alert.monitoring_alert_id
            MonitoringDataDict["ip_address"] = atom.ip_address
            MonitoringDataDict["description"] = alert.description
            MonitoringDataDict["alert_type"] = alert.alert_type
            MonitoringDataDict["mail_status"] = alert.mail_status
            MonitoringDataDict["date"] = alert.modification_date

            MonitoringObjList.append(MonitoringDataDict)

        return jsonify(MonitoringObjList), 200

    except Exception as e:
        traceback.print_exc()
        return "Something Went Wrong!", 500


@app.route("/getTotalAlerts", methods=["GET"])
@token_required
def totalalerts(user_data):
    try:
        MonitoringObjList = []

        results = (
            db.session.query(
                Monitoring_Alerts_Table, Monitoring_Devices_Table, Atom_Table
            )
            .join(
                Monitoring_Devices_Table,
                Monitoring_Devices_Table.monitoring_device_id
                == Monitoring_Alerts_Table.monitoring_device_id,
            )
            .join(Atom_Table, Atom_Table.atom_id == Monitoring_Devices_Table.atom_id)
            .order_by(Monitoring_Alerts_Table.modification_date.desc())
            .all()
        )

        for alert, monitoring, atom in results:
            MonitoringDataDict = {}
            MonitoringDataDict["alarm_id"] = alert.monitoring_alert_id
            MonitoringDataDict["ip_address"] = atom.ip_address
            MonitoringDataDict["description"] = alert.description
            MonitoringDataDict["alert_type"] = alert.alert_type
            MonitoringDataDict["mail_status"] = alert.mail_status
            MonitoringDataDict["date"] = alert.modification_date

            MonitoringObjList.append(MonitoringDataDict)

        return jsonify(MonitoringObjList), 200

    except Exception as e:
        traceback.print_exc()
        return "Something Went Wrong!", 500


@app.route("/getDeviceAlerts", methods=["GET"])
@token_required
def devicealerts(user_data):
    if True:
        try:
            ipobj = request.get_json()
            MonitoringObjList = []

            queryString = f"select * from monitoring_alerts_table where (alert_type='device_down' or alert_type='device_up') and modification_date > now() - interval 1 day order by `modification_date` desc;"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                if MonitoringObj[1] is None:
                    continue

                device = (
                    db.session.query(Monitoring_Devices_Table, Atom_Table)
                    .join(
                        Atom_Table,
                        Atom_Table.atom_id == Monitoring_Devices_Table.atom_id,
                    )
                    .filter(
                        Monitoring_Devices_Table.monitoring_device_id
                        == MonitoringObj[1]
                    )
                    .first()
                )

                if device is None:
                    continue

                monitoring_device, atom = device

                MonitoringDataDict = {}
                MonitoringDataDict["alarm_id"] = MonitoringObj[0]
                MonitoringDataDict["ip_address"] = atom.ip_address
                MonitoringDataDict["description"] = MonitoringObj[2]
                MonitoringDataDict["alert_type"] = MonitoringObj[3]
                MonitoringDataDict["function"] = atom.function
                MonitoringDataDict["mail_status"] = MonitoringObj[5]
                MonitoringDataDict["date"] = MonitoringObj[8]

                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/alertStatus", methods=["GET"])
# @token_required
def alertstatus():
    try:
        MonitoringObjList = []
        total = 0
        queryString1 = f"select count(alert_type) from monitoring_alerts_table where modification_date > now() - interval 1 day;"
        result = db.session.execute(queryString1).scalar()
        total = result
        queryString = f"select alert_type,count(alert_type) from monitoring_alerts_table where modification_date > now() - interval 1 day group by alert_type;"
        results = db.session.execute(queryString)
        for result in results:
            alertDict = {}

            alertDict[result[0]] = result[1]
            MonitoringObjList.append(alertDict)

        alert_dict = {}
        for i in MonitoringObjList:
            for j in i:
                alert_dict[j] = i[j]
        if "critical" in alert_dict.keys():
            pass
        else:
            alert_dict["critical"] = 0

        if "informational" in alert_dict.keys():
            pass
        else:
            alert_dict["informational"] = 0
        if "device_down" in alert_dict.keys():
            pass
        else:
            alert_dict["device_down"] = 0

        alert_dict["total"] = total

        return alert_dict, 200
        # return jsonify(MonitoringObjList),200

    except Exception as e:
        traceback.print_exc()
        return "Something Went Wrong!", 500


@app.route("/getIPAlerts", methods=["POST"])
@token_required
def GetIPAlerts(user_data):
    try:
        jsonObj = request.get_json()
        # 1
        # Store the URL of your InfluxDB instance
        ip_address = jsonObj["ip_address"]
        MonitoringAlertsList = []

        results = (
            db.session.query(
                Monitoring_Alerts_Table, Monitoring_Devices_Table, Atom_Table
            )
            .join(
                Monitoring_Devices_Table,
                Monitoring_Devices_Table.monitoring_device_id
                == Monitoring_Alerts_Table.monitoring_device_id,
            )
            .join(Atom_Table, Atom_Table.atom_id == Monitoring_Devices_Table.atom_id)
            .filter(Atom_Table.ip_address == ip_address)
            .all()
        )
        
        for alert, device, atom in results:
            
            MonitoringDataDict = {}
            MonitoringDataDict["alarm_id"] = alert.monitoring_alert_id
            MonitoringDataDict["ip_address"] = atom.ip_address
            MonitoringDataDict["description"] = alert.description
            MonitoringDataDict["alert_type"] = alert.alert_type
            MonitoringDataDict["function"] = atom.function
            MonitoringDataDict["mail_status"] = alert.mail_status
            MonitoringDataDict["date"] = alert.modification_date

            MonitoringAlertsList.append(MonitoringDataDict)

        return jsonify(MonitoringAlertsList), 200
    except Exception as e:
        print("Error", str(e), file=sys.stderr)
        traceback.print_exc()
        return "Error ", 500
