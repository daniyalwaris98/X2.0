import sys
from datetime import datetime, timedelta
import traceback

from flask_jsonpify import jsonify
from app.middleware import token_required

from app import app, db
from app.models.ncm_models import *
from app.models.atom_models import *


@app.route("/perFunctionCountNcm", methods=["GET"])
@token_required
def PerFunctionCountNcm(user_data):
    try:
        queryString = f"SELECT atom_table.`FUNCTION`, COUNT(atom_table.`FUNCTION`) FROM ncm_device_table INNER JOIN atom_table ON ncm_device_table.atom_id = atom_table.atom_id GROUP  BY atom_table.`FUNCTION`;"
        result = db.session.execute(queryString)
        objList = []
        for row in result:
            objDict = {}
            function = row[0]
            count = row[1]
            objDict["name"] = function
            objDict["value"] = count
            objList.append(objDict)
        return jsonify(objList), 200
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Server Error", 500


@app.route("/ncmBackupCounts", methods=["GET"])
@token_required
def NcmBackupCounts(user_data):
    try:
        results = NCM_Device_Table.query.all()

        not_backup = 0
        fail = 0
        success = 0
        for ncm in results:
            if ncm.backup_status is None:
                not_backup += 1
            elif ncm.backup_status is False:
                fail += 1
            elif ncm.backup_status is True:
                success += 1

        objDict = {
            "backup_successful": success,
            "backup_failure": fail,
            "not_backup": not_backup,
        }

        return objDict, 200
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return str(e), 500


@app.route("/ncmBackupSummeryDashboard", methods=["GET"])
@token_required
def NcmBackupSummeryDashboard(user_data):
    try:
        results = NCM_Device_Table.query.all()

        not_backup = 0
        fail = 0
        success = 0

        for ncm in results:
            if ncm.backup_status is None:
                not_backup += 1
            elif ncm.backup_status is False:
                fail += 1
            elif ncm.backup_status is True:
                success += 1

        objList = [
            {"name": "Backup Successful", "value": success},
            {"name": "Backup Failure", "value": fail},
            {"name": "Not Backup", "value": not_backup},
        ]

        return jsonify(objList), 200
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return str(e), 500


@app.route("/ncmAlarmDashboard", methods=["GET"])
@token_required
def NCMAlarmDashboard(user_data):
    try:
        query = f"SELECT * FROM failed_devices_table t1  WHERE t1.date = (SELECT MAX(t2.date) FROM failed_devices_table t2 WHERE t2.ip_address = t1.ip_address and module ='NCM')  AND t1.module = 'NCM';"
        return "OK", 200
    except Exception as e:
        traceback.print_exc()
        return "Error While Fetching The Data\nFor Configuration Summery Garph", 500


@app.route("/ncmDeviceSummryDashboard", methods=["GET"])
@token_required
def NCMDeviceSummryDashboard(user_data):
    if True:
        try:
            query = f"SELECT atom_table.device_type, atom_table.`function`, COUNT(*) AS device_count FROM ncm_device_table INNER JOIN atom_table ON ncm_device_table.atom_id = atom_table.atom_id GROUP BY atom_table.device_type, atom_table.`function`;"
            result = db.session.execute(query)
            objList = []
            for row in result:
                objDict = {}
                objDict["device_type"] = row[0]
                objDict["function"] = row[1]
                objDict["device_count"] = row[2]
                objList.append(objDict)

            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return "Error While Fetching The Data\nFor Configuration Summery Garph", 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({"message": "Authentication Failed"}), 401


@app.route("/ncmChangeSummryByDevice", methods=["GET"])
@token_required
def NCMChangeSummryByDevice(user_data):
    pre_time = datetime.now() - timedelta(days=1)
    try:
        query = f"SELECT count(*) AS backup_count, atom_table.vendor FROM ncm_device_table INNER JOIN atom_table ON ncm_device_table.atom_id = atom_table.atom_id WHERE config_change_date >'{pre_time}' GROUP BY atom_table.vendor ORDER BY backup_count DESC LIMIT 5;"
        result = db.session.execute(query)

        nameList = []
        valueList = []
        for row in result:
            if row[1] is None:
                nameList.append("Undefined")

            elif row[1] == "":
                nameList.append("Undefined")
            else:
                nameList.append(row[1])

            valueList.append(int(row[0]))

        if len(nameList) <= 0:
            nameList = ["Cisco", "Huawei", "Juniper", "Fortinet", "Other"]
            valueList = [0, 0, 0, 0, 0]

        objDict = {"name": nameList, "value": valueList}

        return jsonify(objDict), 200
    except Exception as e:
        traceback.print_exc()
        return (
            "Error While Fetching The Data\nFor Configuration Change Count By Vendors Garph",
            500,
        )


@app.route("/ncmChangeSummryByTime", methods=["GET"])
@token_required
def NCMChangeSummryByTime(user_data):
    current_time = datetime.now()
    pre_time = datetime.now() - timedelta(days=1)
    try:
        query = f"SELECT COUNT(*) AS backup_count, DATE_FORMAT(config_change_date, '%Y-%m-%d %H:00:00') AS hour_interval FROM ncm_device_table WHERE config_change_date IS NOT NULL  GROUP BY hour_interval ORDER BY backup_count DESC LIMIT 5;"

        result = db.session.execute(query)

        nameList = []
        valueList = []
        for row in result:
            nameList.append(row[1])
            valueList.append(int(row[0]))

        if len(nameList) <= 0:
            for i in range(5):
                temp_time = current_time - timedelta(hours=i)
                nameList.append(f"{temp_time.date()} {temp_time.hour}:00")
                valueList.append(0)

        objDict = {"name": nameList, "value": valueList}

        return jsonify(objDict), 200
    except Exception as e:
        traceback.print_exc()
        return (
            "Error While Fetching The Data\nFor Configuration Change Count By Timw Garph",
            500,
        )


@app.route("/ncmAlarmSummery", methods=["GET"])
@token_required
def NCMAlarmSummry(user_data):
    try:
        results = (
            db.session.query(NCM_Alarm_Table, NCM_Device_Table, Atom_Table)
            .join(
                NCM_Device_Table,
                NCM_Device_Table.ncm_device_id == NCM_Alarm_Table.ncm_alarm_id,
            )
            .join(Atom_Table, Atom_Table.atom_id == NCM_Device_Table.atom_id)
            .filter(NCM_Alarm_Table.alarm_status == "Open")
            .limit(5)
            .all()
        )

        objList = []
        for alarm, ncm, atom in results:
            objDict = {}
            objDict["ip_address"] = atom.ip_address
            objDict["device_name"] = atom.device_name
            objDict["alarm_category"] = alarm.alarm_category
            objDict["alarm_title"] = alarm.alarm_title
            objDict["alarm_description"] = alarm.alarm_description
            objDict["alarm_status"] = alarm.alarm_status
            objDict["creation_date"] = alarm.creation_date
            objDict["modification_date"] = alarm.modification_date
            objDict["resolve_remarks"] = alarm.resolve_remarks
            objDict["mail_status"] = alarm.mail_status

            objList.append(objDict)

        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return (
            "Error While Fetching The Data\nFor Configuration Change Count By Timw Garph",
            500,
        )
