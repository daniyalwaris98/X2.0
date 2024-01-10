from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Query
from app.api.v1.monitoring.device.utils.monitoring_utils import *
from app.models.atom_models import *
from app.models.monitoring_models import *
from app.schema.monitoring_schema import *

router = APIRouter(
    prefix="/device_dashboard",
    tags=["monitoring-device-dashboard"],
)


@router.post("/get_monitoring_devices_cards", responses={
    200: {"model": GetMonitoringDevicesCardsResponseSchema},
    500: {"model": str}
},
summary= "Integrate the specified API into the monitoring device page to fetch and showcase data in summary and interfaces",
description = "Integrate the specified API into the monitoring device page to fetch and showcase data sumary and interfaces"


)
def get_monitoring_devices_cards(ip: str = Query(..., description="IP address of the device")):
    try:

        global_dict = {"device": [], "interfaces": [], "alerts": []}
        try:
            query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "monitoring")\
            |> range(start:-60d)\
            |> filter(fn: (r) => r["_measurement"] == "Devices")\
            |> filter(fn: (r) => r["IP_ADDRESS"] == "{ip}")\
            |> last()\
            |> schema.fieldsAsCols()\
            |> highestMax(n:1,column: "_time")'

            global_dict["device"] = get_device_influx_data(query)
            print('query is::::::::::::::::::::::::::::::::::::::::::',query,file=sys.stderr)
        except Exception:
            traceback.print_exc()
            return "Server Error While Getting Device Data", 500

        if len(global_dict["device"]) > 0:
            try:
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

                global_dict["interfaces"] = get_interface_influx_data(query)

            except Exception:
                traceback.print_exc()

            try:

                results = (
                    configs.db.query(
                        Monitoring_Alerts_Table, Monitoring_Devices_Table, AtomTable
                    )
                    .join(
                        Monitoring_Devices_Table,
                        Monitoring_Alerts_Table.monitoring_device_id
                        == Monitoring_Devices_Table.monitoring_device_id,
                    )
                    .join(
                        AtomTable,
                        Monitoring_Devices_Table.atom_id == AtomTable.atom_id,
                    )
                    .filter(AtomTable.ip_address == ip)
                    .all()
                )
                print('results is::::::::::::::::::::::::::::',results,file=sys.stderr)
                monitoring_alerts_list = []
                for alert, monitoring, atom in results:
                    print("alert in monitoring result is:::::::",alert,file=sys.stderr)
                    print("monitriing in result is:::::::::::::::::::",monitoring,file=sys.stderr)
                    print("atom in monitoring is:::::::::::::::::::",atom,file=sys.stderr)
                    monitoring_data_dict = {"alarm_id": alert.monitoring_alert_id,
                                            "ip_address": atom.ip_address,
                                            "description": alert.description,
                                            "alert_type": alert.alert_type,
                                            "category": atom.function,
                                            "mail_status": alert.mail_status,
                                            "date": alert.start_date}

                    monitoring_alerts_list.append(monitoring_data_dict)

                global_dict["alerts"] = monitoring_alerts_list
            except Exception:
                traceback.print_exc()

        return JSONResponse(content=global_dict, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Monitoring Data", status_code=500)


@router.get("/get_ip_alerts", responses={
    200: {"model": list[MonitoringAlertSchema]},
    500: {"model": str}
})
def ip_alerts(ip: str = Query(..., description="IP address of the device")):
    try:

        monitoring_obj_list = []
        results = (
            configs.db.query(
                Monitoring_Alerts_Table, Monitoring_Devices_Table, AtomTable
            )
            .join(
                Monitoring_Devices_Table,
                Monitoring_Devices_Table.monitoring_device_id
                == Monitoring_Alerts_Table.monitoring_device_id,
            )
            .join(AtomTable, AtomTable.atom_id == Monitoring_Devices_Table.atom_id)
            .filter(AtomTable.ip_address == ip)
            .order_by(Monitoring_Alerts_Table.modification_date.desc())
            .all()
        )
        print("ip alerts result is::::::::::::::::::::::::::::::::::::::::",ip_alerts,file=sys.stderr)
        for alert, monitoring, atom in results:
            print("alert is::::::::::::::::::::::::::::::::::",alert,file=sys.stderr)
            print("monitoring is:::::::::::::::::::::::::::::::",monitoring,file=sys.stderr)
            print("atom is:::::::::::::::::::::::::::::::::",atom,file=sys.stderr)
            monitoring_data_dict = {}
            monitoring_data_dict["alarm_id"] = alert.monitoring_alert_id
            monitoring_data_dict["ip_address"] = atom.ip_address
            monitoring_data_dict["description"] = alert.description
            monitoring_data_dict["category"] = alert.category
            monitoring_data_dict["alert_type"] = alert.alert_type
            monitoring_data_dict["mail_status"] = alert.mail_status
            monitoring_data_dict["date"] = alert.modification_date

            monitoring_obj_list.append(monitoring_data_dict)

        return JSONResponse(content=monitoring_obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Alerts", status_code=500)


@router.get("/get_interface_band/{ip, interface_name}", responses={
    200: {"model": str},
    500: {"model": str}
})
async def int_band(ip: str = Query(..., description="IP address of the device"),
                   interface_name: str = Query(..., description="Interface name")):
    org = "monetx"
    query_api = configs.client.query_api()
    query = f'import "strings"\
    import "influxdata/influxdb/schema"\
    from(bucket: "monitoring")\
    |> range(start: -1d)\
    |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
    |> filter(fn: (r) => r["IP_ADDRESS"] == "{ip}")\
    |> schema.fieldsAsCols()'

    result = query_api.query(org="monetx", query=query)

    response_dict = {
        "all": [],
        "table": []
    }
    upload = []
    download = []
    all_list = []

    try:
        for table in result:
            for record in table.records:
                if record["Interface_Name"] == interface_name:

                    obj_dict = {"name": record["Interface_Name"]}

                    try:
                        obj_dict["date"] = datetime.strptime(
                            record["Date"], "%Y-%m-%d %H:%M:%S.%f"
                        ).strftime("%Y-%m-%d %H:%M:%S")
                        print(obj_dict["date"], file=sys.stderr)
                    except Exception as e:
                        traceback.print_exc()
                        continue

                    if record["Download"]:
                        download.append(round(float(record["Download"]), 2))
                        obj_dict["download"] = round(float(record["Download"]), 2)

                    if record["Upload"]:
                        upload.append(round(float(record["Upload"]), 2))
                        obj_dict["upload"] = round(float(record["Upload"]), 2)

                    if record["Download"] and record["Upload"]:
                        obj_dict["total"] = round(
                            float(record["Upload"]) + float(record["Download"]), 2
                        )
                        all_list.append(obj_dict["total"])

                    response_dict["all"].append(obj_dict)

        table_stats = []
        if len(download) > 0 and len(upload) > 0:
            table_stats.append(
                {
                    "bandwidth": "Download",
                    "min": min(download),
                    "max": max(download),
                    "avg": round(sum(download) / len(download), 2),
                }
            )
            table_stats.append(
                {
                    "bandwidth": "Upload",
                    "min": min(upload),
                    "max": max(upload),
                    "avg": round(sum(upload) / len(upload), 2),
                }
            )
            table_stats.append(
                {
                    "bandwidth": "Average",
                    "min": min(all_list),
                    "max": max(all_list),
                    "avg": round(sum(all_list) / len(all_list), 2),
                }
            )

        elif len(download) == 0 or len(upload) == 0:
            table_stats.append({"bandwidth": "Download", "min": 0, "max": 0, "avg": 0})
            table_stats.append({"bandwidth": "Upload", "min": 0, "max": 0, "avg": 0})
            table_stats.append({"bandwidth": "Average", "min": 0, "max": 0, "avg": 0})

        response_dict["table"] = table_stats

        return JSONResponse(content=response_dict, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)
