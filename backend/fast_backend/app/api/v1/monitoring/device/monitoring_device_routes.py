from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.api.v1.monitoring.device.utils.monitoring_utils import *
from app.models.monitoring_models import *
from app.schema.monitoring_schema import *

router = APIRouter(
    prefix="/devices",
    tags=["monitoring-devices"],
)


@router.get("/get-all-monitoring-vendors", responses={
    200: {"model": list[NameValueListOfDictResponseSchema]},
    500: {"model": str}
})
async def get_all_monitoring_vendors():
    try:
        query_string = (f"SELECT vendor,COUNT(*) FROM monitoring_devices_table "
                        f"INNER JOIN atom_table ON monitoring_devices_table.atom_id = "
                        f"atom_table.atom_id  GROUP BY vendor;")
        result = configs.db.execute(query_string)

        obj_list = []
        for row in result:
            obj_dict = {"name": row[0], "value": row[1]}

            if row[0] is None:
                obj_dict["name"] = "Other"

            obj_list.append(obj_dict)

        return JSONResponse(content=obj_list, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)


@router.get("/get-all-monitoring-functions", responses={
    200: {"model": list[NameValueListOfDictResponseSchema]},
    500: {"model": str}
})
async def get_all_monitoring_functions():
    try:
        query_string = (f"SELECT `function`,count(*) FROM monitoring_devices_table INNER "
                        f"JOIN atom_table ON monitoring_devices_table.atom_id = "
                        f"atom_table.atom_id GROUP BY `function`;")
        result = configs.db.execute(query_string)
        obj_list = []

        for row in result:
            objDict = {"name": row[0], "value": row[1]}
            obj_list.append(objDict)

        return JSONResponse(content=obj_list, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)


@router.post("/add-monitoring-device", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
def add_monitoring_device(monitoring_obj):
    try:

        msg, status = AddMonitoringDevice(monitoring_obj, 0, False)
        return JSONResponse(content=msg, status_code=status)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)


@router.post("/add-monitoring-devices", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
def add_monitoring_devices(monitoring_objs):
    try:
        success_list = []
        error_list = []

        row = 0
        for monitoringObj in monitoring_objs:
            row = row + 1
            msg, status = AddMonitoringDevice(monitoringObj, row, True)

            if status == 200:
                success_list.append(msg)
            else:
                error_list.append(msg)

        responseDict = {
            "success": len(success_list),
            "error": len(error_list),
            "error_list": error_list,
            "success_list": success_list,
        }

        return JSONResponse(content=responseDict, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)


@router.get("/get-all-monitoring-devices", responses={
    200: {"model": list[MonitoringDeviceSchema]},
    500: {"model": str}
})
async def get_all_monitoring_devices():
    try:
        monitoring_obj_list = []
        results = (
            configs.db.query(Monitoring_Devices_Table, AtomTable)
            .join(AtomTable, Monitoring_Devices_Table.atom_id == AtomTable.atom_id)
            .all()
        )

        for MonitoringObj, atom in results:
            snmp_cred = ""

            if MonitoringObj.monitoring_credentials_id is not None:
                credentials = Monitoring_Credentails_Table.query.filter_by(
                    monitoring_credentials_id=MonitoringObj.monitoring_credentials_id
                ).first()

                if credentials is None:
                    MonitoringObj.monitoring_credentials_id = None
                    UpdateDBData(MonitoringObj)
                else:
                    snmp_cred = credentials.profile_name

            monitoring_data_dict = {"monitoring_id": MonitoringObj.monitoring_device_id,
                                    "ip_address": atom.ip_address, "device_type": atom.device_type,
                                    "device_name": atom.device_name, "vendor": atom.vendor,
                                    "function": atom.function, "source": MonitoringObj.source,
                                    "credentials": snmp_cred, "active": MonitoringObj.active,
                                    "status": MonitoringObj.ping_status,
                                    "snmp_status": MonitoringObj.snmp_status,
                                    "creation_date": str(MonitoringObj.creation_date),
                                    "modification_date": str(
                                        MonitoringObj.modification_date
                                    )}
            monitoring_obj_list.append(monitoring_data_dict)

        return JSONResponse(content=monitoring_obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Monitoring Devices",
                            status_code=500)


@router.get("/get-atom-in-monitoring", responses={
    200: {"model": list[AtomInMonitoringSchema]},
    500: {"model": str}
})
async def get_atom_in_monitoring():
    try:
        monitoring_obj_list = []
        atoms = AtomTable.query.all()

        for atom in atoms:
            monitoringDevice = Monitoring_Devices_Table.query.filter_by(
                atom_id=atom.atom_id
            ).first()

            if monitoringDevice is None:
                monitoring_obj_list.append(
                    {
                        "ip_address": atom.ip_address,
                        "device_name": atom.device_name,
                        "device_type": atom.device_type,
                    }
                )

        return JSONResponse(content=monitoring_obj_list, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Atom Data",
                            status_code=500)


@router.post("/add-atom-in-monitoring", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
async def add_atom_in_monitoring(ip_list: list[str]):
    try:
        success_list = []
        error_list = []
        for ip in ip_list:
            atom = AtomTable.query.filter_by(ip_address=ip).first()

            if atom is None:
                error_list.append(f"{ip} : Device Not Found In Atom")
                continue

            monitoringDevice = Monitoring_Devices_Table.query.filter_by(
                atom_id=atom.atom_id
            ).first()

            if monitoringDevice is None:
                monitoringDevice = Monitoring_Devices_Table()
                monitoringDevice.atom_id = atom.atom_id
                monitoringDevice.ping_status = "NA"
                monitoringDevice.snmp_status = "NA"
                monitoringDevice.active = "Inactive"

                if InsertDBData(monitoringDevice) == 200:
                    success_list.append(f"{ip} : Device Added Successfully")
                else:
                    error_list.append(f"{ip} : Error While Inserting Device")

            else:
                error_list.append(f"{ip} : Device Already Exist In Monitoring")

        response_dict = {
            "success": len(success_list),
            "error": len(error_list),
            "error_list": error_list,
            "success_list": success_list,
        }

        return JSONResponse(content=response_dict, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Atom Data",
                            status_code=500)


#
# @app.route("/deleteDeviceInMonitoring", methods=["POST"])
# @token_required
# def deleteAtomInMonitoring(user_data):
#     if True:
#         try:
#             from app import client
#
#             org = "monetx"
#             bucket = "monitoring"
#             delete_api = client.delete_api()
#             """
#             Delete Data
#             """
#             date_helper = get_date_helper()
#             start = "1970-01-01T00:00:00Z"
#             stop = date_helper.to_utc(datetime.now())
#             MonitoringObj = request.get_json()
#             print(
#                 "#####printing data returned by delete api",
#                 MonitoringObj,
#                 file=sys.stderr,
#             )
#             for mid in MonitoringObj:
#                 queryString = (
#                     f"DELETE FROM monitoring_devices_table WHERE IP_ADDRESS='{mid}';"
#                 )
#                 db.session.execute(queryString)
#                 db.session.commit()
#                 predicatereq1 = f'_measurement="Devices" AND IP_ADDRESS ="{mid}"'
#                 predicatereq2 = f'_measurement="Interfaces" AND IP_ADDRESS ="{mid}"'
#                 delete_api.delete(
#                     start,
#                     stop,
#                     bucket=f"{bucket}",
#                     org=f"{org}",
#                     predicate=predicatereq1,
#                 )
#                 delete_api.delete(
#                     start,
#                     stop,
#                     bucket=f"{bucket}",
#                     org=f"{org}",
#                     predicate=predicatereq2,
#                 )
#             return "Response deleted", 200
#         except Exception as e:
#             traceback.print_exc()
#             return "Something Went Wrong!", 500
#
#
@router.post("/get-device-filter-date", responses={})
async def get_device_filter_date(data_list: list[GetFunctionDataSchema]):
    try:
        final_list = []
        for data in data_list:
            final_list.append(get_device_monitoring_data(data))

        return JSONResponse(content=final_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return "Error While Fetching Data", 500


@router.post("/get-interface-filter-date", responses={})
async def get_interface_filter_date(data_list: list[GetFunctionDataSchema]):
    try:
        final_list = []
        for data in data_list:
            final_list.append(get_interface_monitoring_data(data))

        return JSONResponse(content=final_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return "Error While Fetching Data", 500

#
# @app.route("/deleteMonitoringdata", methods=["POST"])
# def DeleteMonitoringData():
#     try:
#         org = "monetx"
#         bucket = "monitoring"
#         measurement = "Devices"
#         ip_address = "192.168.0.2"
#         url = f"http://localhost:8086/api/v2/delete?org={org}&bucket={bucket}"
#         headers = {
#             "Authorization": "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A==",
#             "Content-Type": "application/json",
#         }
#         data = {
#             "start": "-60d",
#             "predicate": f'measurement="{measurement}" AND IP_ADDRESS="{ip_address}"',
#         }
#
#         requests.post(url, headers=headers, data=data)
#
#         return "deleted"
#
#     except Exception as e:
#         print(
#             "printing exception while deleteing data in influxdb",
#             str(e),
#             file=sys.stderr,
#         )
#         return str(e)
#
#
# @app.route("/deleteAllMonitoringdata", methods=["GET"])
# def DeleteAllMonitoringData():
#     try:
#         org = "monetx"
#         bucket = "monitoring"
#         from app import client
#
#         from influxdb_client import InfluxDBClient
#
#         delete_api = client.delete_api()
#
#         """
#         Delete Data
#         """
#         date_helper = get_date_helper()
#         start = "1970-01-01T00:00:00Z"
#         stop = date_helper.to_utc(datetime.now())
#         delete_api.delete(
#             start, stop, f'_measurement="Devices"', bucket=f"{bucket}", org=f"{org}"
#         )
#         delete_api.delete(
#             start, stop, f'_measurement="Interfaces"', bucket=f"{bucket}", org=f"{org}"
#         )
#
#         """
#         Close client
#         """
#         return "deleted"
#
#     except Exception as e:
#         print(
#             "printing exception while deleteing data in influxdb",
#             str(e),
#             file=sys.stderr,
#         )
#         return str(e)
#
#
# @app.route("/deleteIPMonitoringdata", methods=["GET"])
# def DeleteIPMonitoringData():
#     try:
#         from app import client
#
#         org = "monetx"
#         bucket = "monitoring"
#
#         from influxdb_client import InfluxDBClient
#
#         predicatereq1 = f'_measurement="Devices" AND IP_ADDRESS ="{ip_address}"'
#         predicatereq2 = f'_measurement="Interfaces" AND IP_ADDRESS ="{ip_address}"'
#
#         delete_api = client.delete_api()
#
#         """
#         Delete Data
#         """
#         date_helper = get_date_helper()
#         start = "1970-01-01T00:00:00Z"
#         stop = date_helper.to_utc(datetime.now())
#         delete_api.delete(
#             start, stop, bucket=f"{bucket}", org=f"{org}", predicate=predicatereq1
#         )
#         delete_api.delete(
#             start, stop, bucket=f"{bucket}", org=f"{org}", predicate=predicatereq2
#         )
#
#         """
#         Close client
#         """
#         return "deleted"
#
#     except Exception as e:
#         print(
#             "printing exception while deleteing data in influxdb",
#             str(e),
#             file=sys.stderr,
#         )
#         return str(e)
#
#
# @app.route("/deleteMonitoringAlerts", methods=["POST"])
# @token_required
# def DeleteMonitoringAlerts(user_data):
#     if True:
#         try:
#             monitoringObj = request.get_json()
#             response = False
#             queryString = f"delete from alerts_table where IP_ADDRESS='{monitoringObj['ip_address']}';"
#             db.session.execute(queryString)
#             db.session.commit()
#             response = True
#             if response:
#                 return (
#                     f"Alerts Deleted Successfully for {monitoringObj['ip_address']}",
#                     200,
#                 )
#             else:
#                 return "Deletion was Unsuccessful", 500
#         except Exception as e:
#             print(str(e), file=sys.stderr)
#             traceback.print_exc()
#             return str(e), 500
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({"message": "Authentication Failed"}), 401
#
#
# @app.route("/possibleReasonForAlerts", methods=["POST"])
# @token_required
# def PossibleReasonForAlerts(user_data):
#     if True:
#         try:
#             monitoringObj = request.get_json()
#             output = ""
#             description = (monitoringObj["description"]).lower()
#             if "of cpu" in description:
#                 output = "High CPU due to a broadcast storm\nHigh CPU due to BGP scanner\nHigh CPU Utilization in Exec and Virtual Exec Processes\nHigh CPU due to Non-Reverse Path Forwarding (RPF) traffic\nHigh CPU due to Multicast"
#
#             elif "memory" in description:
#                 output = "Memory leaks\nProcesses running on a device to see what’s using memory\nMemory size not large enough to support OS image (if you upgraded recently)\nMemory fragmentation"
#
#             elif "offline" in description:
#                 output = "Power outage or brownout\nUpstream switch or router on the network is also having issues\nDevice misconfiguration\nICMP traffic to device blocked\nEmergency maintenance\nHardware malfunction\nCrash related to the operating system\nDevice removed from network"
#             if output == "":
#                 return "Nothing to Display", 500
#
#             else:
#                 print(output, file=sys.stderr)
#                 return output, 200
#         except Exception as e:
#             print(str(e), file=sys.stderr)
#             traceback.print_exc()
#             return str(e), 500
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({"message": "Authentication Failed"}), 401
