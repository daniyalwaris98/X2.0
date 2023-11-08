import traceback
from datetime import timedelta

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.core.config import configs
from app.models.atom_models import *
from app.models.ncm_models import *
from app.schema.base_schema import *
from app.schema.ncm_schema import *

router = APIRouter(
    prefix="/ncm-dashboard",
    tags=["ncm-dashboard"]
)


@router.get("/ncm-change-summery-by-time", responses={
    200: {"model": NameValueDictResponseSchema},
    500: {"model": str}
})
async def ncm_change_summery_by_time():
    current_time = datetime.now()
    pre_time = datetime.now() - timedelta(days=1)
    try:
        query = (f"SELECT COUNT(*) AS backup_count, "
                 f"DATE_FORMAT(config_change_date, '%Y-%m-%d %H:00:00') "
                 f"AS hour_interval FROM NcmDeviceTable "
                 f"WHERE config_change_date IS NOT NULL "
                 f"GROUP BY hour_interval ORDER BY backup_count DESC LIMIT 5;")

        result = configs.db.execute(query)

        name_list = []
        value_list = []
        for row in result:
            name_list.append(row[1])
            value_list.append(int(row[0]))

        if len(name_list) <= 0:
            for i in range(5):
                temp_time = current_time - timedelta(hours=i)
                name_list.append(f"{temp_time.date()} {temp_time.hour}:00")
                value_list.append(0)

        obj_dict = {"name": name_list, "value": value_list}

        return JSONResponse(content=obj_dict, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
            "Error While Fetching The Data\nFor Configuration Change Count By Timw Garph",
            500,
        )


@router.get("/ncm-change-summery-by-device", responses={
    200: {"model": NameValueDictResponseSchema},
    500: {"model": str}
})
async def ncm_change_summery_by_device():
    pre_time = datetime.now() - timedelta(days=1)
    try:
        query = (f"SELECT count(*) AS backup_count, AtomTable.vendor "
                 f"FROM NcmDeviceTable INNER JOIN AtomTable "
                 f"ON NcmDeviceTable.atom_id = AtomTable.atom_id "
                 f"WHERE config_change_date >'{pre_time}' "
                 f"GROUP BY AtomTable.vendor ORDER BY backup_count DESC LIMIT 5;")

        result = configs.db.execute(query)

        name_list = []
        value_list = []
        for row in result:
            if row[1] is None:
                name_list.append("Undefined")

            elif row[1] == "":
                name_list.append("Undefined")
            else:
                name_list.append(row[1])

            value_list.append(int(row[0]))

        if len(name_list) <= 0:
            name_list = ["Cisco", "Huawei", "Juniper", "Fortinet", "Other"]
            value_list = [0, 0, 0, 0, 0]

        obj_dict = {"name": name_list, "value": value_list}

        return JSONResponse(content=obj_dict, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
            "Error While Fetching The Data\nFor Configuration Change Count By Timw Garph",
            500,
        )


@router.get("/ncm-alarm-summery", responses={
    200: {"model": list[NcmAlarmSchema]},
    500: {"model": str}
})
async def ncm_alarm_summery():
    try:
        results = (
            configs.db.query(NCM_Alarm_Table, NcmDeviceTable, AtomTable)
            .join(
                NcmDeviceTable,
                NcmDeviceTable.ncm_device_id == NCM_Alarm_Table.ncm_alarm_id,
            )
            .join(AtomTable, AtomTable.atom_id == NcmDeviceTable.atom_id)
            .filter(NCM_Alarm_Table.alarm_status == "Open")
            .limit(5)
            .all()
        )

        objList = []
        for alarm, ncm, atom in results:
            obj_dict = {"ip_address": atom.ip_address, "device_name": atom.device_name,
                        "alarm_category": alarm.alarm_category, "alarm_title": alarm.alarm_title,
                        "alarm_description": alarm.alarm_description,
                        "alarm_status": alarm.alarm_status, "creation_date": alarm.creation_date,
                        "modification_date": alarm.modification_date,
                        "resolve_remarks": alarm.resolve_remarks, "mail_status": alarm.mail_status}

            objList.append(obj_dict)

        return JSONResponse(content=objList, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
            "Error While Fetching The Data\nFor Configuration Change Count By Time Graph",
            500,
        )



# @app.route("/perFunctionCountNcm", methods=["GET"])
# @token_required
# def PerFunctionCountNcm(user_data):
#     try:
#         queryString = f"SELECT AtomTable.`FUNCTION`, COUNT(AtomTable.`FUNCTION`) FROM NcmDeviceTable INNER JOIN AtomTable ON NcmDeviceTable.atom_id = AtomTable.atom_id GROUP  BY AtomTable.`FUNCTION`;"
#         result = db.session.execute(queryString)
#         objList = []
#         for row in result:
#             objDict = {}
#             function = row[0]
#             count = row[1]
#             objDict["name"] = function
#             objDict["value"] = count
#             objList.append(objDict)
#         return jsonify(objList), 200
#     except Exception as e:
#         print(str(e), file=sys.stderr)
#         traceback.print_exc()
#         return "Server Error", 500
#
#
# @app.route("/ncmBackupCounts", methods=["GET"])
# @token_required
# def NcmBackupCounts(user_data):
#     try:
#         results = NcmDeviceTable.query.all()
#
#         not_backup = 0
#         fail = 0
#         success = 0
#         for ncm in results:
#             if ncm.backup_status is None:
#                 not_backup += 1
#             elif ncm.backup_status is False:
#                 fail += 1
#             elif ncm.backup_status is True:
#                 success += 1
#
#         objDict = {
#             "backup_successful": success,
#             "backup_failure": fail,
#             "not_backup": not_backup,
#         }
#
#         return objDict, 200
#     except Exception as e:
#         print(str(e), file=sys.stderr)
#         traceback.print_exc()
#         return str(e), 500
#
#
#
#
# @app.route("/ncmAlarmDashboard", methods=["GET"])
# @token_required
# def NCMAlarmDashboard(user_data):
#     try:
#         query = f"SELECT * FROM failed_devices_table t1  WHERE t1.date = (SELECT MAX(t2.date) FROM failed_devices_table t2 WHERE t2.ip_address = t1.ip_address and module ='NCM')  AND t1.module = 'NCM';"
#         return "OK", 200
#     except Exception as e:
#         traceback.print_exc()
#         return "Error While Fetching The Data\nFor Configuration Summery Garph", 500
#
#
# @app.route("/ncmDeviceSummryDashboard", methods=["GET"])
# @token_required
# def NCMDeviceSummryDashboard(user_data):
#     if True:
#         try:
#             query = f"SELECT AtomTable.device_type, AtomTable.`function`, COUNT(*) AS device_count FROM NcmDeviceTable INNER JOIN AtomTable ON NcmDeviceTable.atom_id = AtomTable.atom_id GROUP BY AtomTable.device_type, AtomTable.`function`;"
#             result = db.session.execute(query)
#             objList = []
#             for row in result:
#                 objDict = {}
#                 objDict["device_type"] = row[0]
#                 objDict["function"] = row[1]
#                 objDict["device_count"] = row[2]
#                 objList.append(objDict)
#
#             return jsonify(objList), 200
#         except Exception as e:
#             traceback.print_exc()
#             return "Error While Fetching The Data\nFor Configuration Summery Garph", 500
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({"message": "Authentication Failed"}), 401
#
#

#
#
#
#
#

