from app import db
import traceback
import sys
from datetime import datetime, timedelta

from app.utilities.db_utils import *
from app.models.monitoring_models import *


def snmpAlert(monitoring_device_id, flag):
    try:
        alert = Monitoring_Alerts_Table.query.filter(
            Monitoring_Alerts_Table.monitoring_device_id
            == monitoring_device_id,
            Monitoring_Alerts_Table.category == "snmp",
            Monitoring_Alerts_Table.alert_status == "Open",
        ).first()
        
        if flag == False:
            if alert is None:
                query = f"insert into monitoring_alerts_table (`monitoring_device_id`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`) values ({monitoring_device_id},'Check SNMP Credentials Or Status','informational','snmp','Open','no');"
                db.session.execute(query)
                db.session.commit()
        else:
            if alert is not None:
                query = f"DELETE FROM monitoring_alerts_table WHERE monitoring_device_id = {monitoring_device_id} AND CATEGORY='snmp';"
                db.session.execute(query)
                db.session.commit()
    except Exception:
        traceback.print_exc()


def statusAlert(monitoring_device, status):
    pause_min = 60

    heatmap = "Active"
    if status == "down":
        heatmap = "Device Down"
    else:
        heatmap = "Active"

    monitoring_device.device_heatmap = heatmap
    UpdateDBData(monitoring_device)

    alert = None
    try:
        alert = Monitoring_Alerts_Table.query.filter(
            Monitoring_Alerts_Table.monitoring_device_id
            == monitoring_device.monitoring_device_id,
            Monitoring_Alerts_Table.category == "device_down",
            Monitoring_Alerts_Table.alert_status == "Open",
        ).first()
        
    except Exception as e:
        traceback.print_exc()

    if alert is None:
        if status == "down":
            try:
                query = f"insert into monitoring_alerts_table (`MONITORING_DEVICE_ID`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`) values ({monitoring_device.monitoring_device_id},'Device is down','critical','device_down','Open','no');"
                db.session.execute(query)
                db.session.commit()
            except Exception as e:
                traceback.print_exc()
    else:
        if status == "up":
            try:
                # close previous alert
                alert.alert_status = 'Close'
                UpdateDBData(alert)

                # create new informational alert for device up
                query = f"insert into monitoring_alerts_table (`MONITORING_DEVICE_ID`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`) values ({monitoring_device.monitoring_device_id},'Device is now up','informational','device_up','Close','no');"
                db.session.execute(query)
                db.session.commit()
            except Exception as e:
                traceback.print_exc()
        else:
            # date_format = "%Y-%m-%d %H:%M:%S"

            difference = datetime.now() - alert.modification_date
            sec = int((difference.total_seconds()) / 60)
            if sec < pause_min:
                pass
            else:
                mins = int((datetime.now() - alert.creation_date).total_seconds() / 60)
                hours = 0
                days = 0
                if mins >= 60:
                    hours = int(mins / 60)
                    mins = mins % 60

                if hours >= 24:
                    days = int(hours / 24)
                    hours = hours % 24

                desc = f"Device is down since {days} days, {hours} hours and {mins} minutes"
                # close previous alert
                try:
                    alert.alert_status = 'Open'
                    alert.description = desc
                    alert.mail_status = 'no'
                    UpdateDBData(alert)
                except Exception as e:
                    traceback.print_exc()


def cpuNullAlert(host, cpu_threshold):
    pass


# cpu Utilization Alert
def cpuUtilizationAlert(monitoring_device_id, alert_type, cpu_util, cpu_threshold):
    try:
        
        alert = Monitoring_Alerts_Table.query.filter(
            Monitoring_Alerts_Table.monitoring_device_id
            == monitoring_device_id,
            Monitoring_Alerts_Table.category == "cpu",
            Monitoring_Alerts_Table.alert_status == "Open",
        ).first()
        
        
        if alert is None:
            # create new alert for cpu
            if alert_type is not None:
                query = f"insert into monitoring_alerts_table (`monitoring_device_id`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`) values ({monitoring_device_id},'High CPU Utilization : {cpu_util}%','{alert_type}','cpu','Open','no');"
                db.session.execute(query)
                db.session.commit()
        else:
            if alert_type is None:
                # close previous alert
                alert.alert_status = 'Close'
                UpdateDBData(alert)

                # create new informational alert for device up
                query = f"insert into monitoring_alerts_table (`monitoring_device_id`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`) values ({monitoring_device_id},'CPU Utilization is now stable at {cpu_util}%','informational','cpu','Close','no');"
                db.session.execute(query)
                db.session.commit()
            else:
                # date_format = "%Y-%m-%d %H:%M:%S"

                difference = datetime.now() - alert.modification_date
                difference = int(difference.total_seconds() / 60)
                if difference < cpu_threshold["pause"]:
                    pass
                else:
                    try:
                        
                        alert.description = f'High CPU Utilization : {cpu_util}%'
                        alert.alert_type = alert_type
                        alert.alert_status = 'Open'
                        alert.mail_status = 'no'
                        UpdateDBData(alert)
                    except Exception as e:
                        traceback.print_exc()
    except Exception as e:
        traceback.print_exc()
        print(f"Error While Alert Data", file=sys.stderr)


# overall CPU alert
def cpuAlert(ip_address, monitoring_device, cpu_util):
    # try:
    query = f"select * from alert_cpu_threshold_table where ip_address='{ip_address}';"
    result = db.session.execute(query).fetchone()
    
    if result is None:
        query = f"select * from alert_cpu_threshold_table where ip_address='All';"
        result = db.session.execute(query).fetchone()

    cpu_threshold = {
        "low_threshold": 50,
        "medium_threshold": 70,
        "critical_threshold": 90,
        "pause": 30,
    }
    if result is not None:
        cpu_threshold = {
            "low_threshold": int(result[2]),
            "medium_threshold": int(result[3]),
            "critical_threshold": int(result[4]),
            "pause": int(result[5]),
        }

    print(f"{ip_address}: {cpu_threshold}", file=sys.stderr)

    heatmap = "Active"
    alert_type = None

    if cpu_util == "NA":
        print(
            f"{ip_address}: Error: Doesn't provide data for cpu utilization",
            file=sys.stderr,
        )
        heatmap = "Critical"
        # cpuNullAlert(host, cpu_threshold)
    else:
        if (
            cpu_util > cpu_threshold["low_threshold"]
            and cpu_util <= cpu_threshold["medium_threshold"]
        ):
            alert_type = "low"
        elif (
            cpu_util > cpu_threshold["medium_threshold"]
            and cpu_util <= cpu_threshold["critical_threshold"]
        ):
            alert_type = "medium"
            heatmap = "Attention"
        elif cpu_util > cpu_threshold["critical_threshold"]:
            alert_type = "critical"
            heatmap = "Critical"

        print(
            f"{ip_address}: {alert_type} Alert: CPU Utilization = {cpu_util}",
            file=sys.stderr,
        )

        cpuUtilizationAlert(monitoring_device.monitoring_device_id, alert_type, cpu_util, cpu_threshold)

    # update heatmap
    try:
        monitoring_device.device_heatmap = heatmap
        UpdateDBData(monitoring_device)
    except Exception as e:
        traceback.print_exc()
        print(f"{ip_address}: Error While Updating Heatmap", file=sys.stderr)


def memoryNullAlert(host, memory_threshold):
    pass


# memory Utilization Alert
def memoryUtilizationAlert(monitoring_device_id, alert_type, memory_util, memory_threshold):
    try:
        
        alert = Monitoring_Alerts_Table.query.filter(
            Monitoring_Alerts_Table.monitoring_device_id
            == monitoring_device_id,
            Monitoring_Alerts_Table.category == "memory",
            Monitoring_Alerts_Table.alert_status == "Open",
        ).first()
        

        if alert is None:
            # create new alert for memory
            if alert_type is not None:
                query = f"insert into monitoring_alerts_table (`MONITORING_DEVICE_ID`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`) values ('{monitoring_device_id}','High Memory Utilization : {memory_util}%','{alert_type}','memory','Open','no');"
                db.session.execute(query)
                db.session.commit()
        else:
            if alert_type is None:
                # close previous alert
                alert.alert_status = 'Close'
                UpdateDBData(alert)

                # create new informational alert for memory
                query = f"insert into monitoring_alerts_table (`MONITORING_DEVICE_ID`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`) values ({monitoring_device_id},'Memory Utilization is now stable at {memory_util}%','informational','memory','Close','no');"
                db.session.execute(query)
                db.session.commit()
            else:
                # date_format = "%Y-%m-%d %H:%M:%S"

                difference = datetime.now() - alert.modification_date
                difference = int(difference.total_seconds() / 60)
                if difference < memory_threshold["pause"]:
                    pass
                else:
                    try:
                        alert.decription = f'High Memory Utilization : {memory_util}%'
                        alert.alert_type = alert_type
                        alert.alert_status = 'Open'
                        alert.mail_status = 'no'
                        UpdateDBData(alert)
                    except Exception as e:
                        traceback.print_exc()
    except Exception as e:
        traceback.print_exc()
        print(f"Error While Alert Data", file=sys.stderr)


# overall memory alert
def memoryAlert(ip_address, monitoring_device, memory_util):
    # try:
    query = f"select * from alert_memory_threshold_table where ip_address='{ip_address}';"
    result = db.session.execute(query).fetchone()

    if result is None:
        query = f"select * from alert_memory_threshold_table where ip_address='All';"
        result = db.session.execute(query).fetchone()

    memory_threshold = {
        "low_threshold": 50,
        "medium_threshold": 70,
        "critical_threshold": 90,
        "pause": 30,
    }
    if result is not None:
        memory_threshold = {
            "low_threshold": int(result[2]),
            "medium_threshold": int(result[3]),
            "critical_threshold": int(result[4]),
            "pause": int(result[5]),
        }

    print(f"{ip_address}: {memory_threshold}", file=sys.stderr)

    heatmap = "Active"
    alert_type = None

    if memory_util == "NA":
        print(
            f"{ip_address}: Error: Doesn't provide data for memory utilization",
            file=sys.stderr,
        )
        heatmap = "Critical"
        # memoryNullAlert(host, memory_threshold)
    else:
        if (
            memory_util > memory_threshold["low_threshold"]
            and memory_util <= memory_threshold["medium_threshold"]
        ):
            alert_type = "low"
        elif (
            memory_util > memory_threshold["medium_threshold"]
            and memory_util <= memory_threshold["critical_threshold"]
        ):
            alert_type = "medium"
            heatmap = "Attention"
        elif memory_util > memory_threshold["critical_threshold"]:
            alert_type = "critical"
            heatmap = "Critical"

        print(
            f"{ip_address}: {alert_type} Alert: Memory Utilization = {memory_util}",
            file=sys.stderr,
        )

        memoryUtilizationAlert(monitoring_device.monitoring_device_id, alert_type, memory_util, memory_threshold)

    # update heatmap
    try:
        monitoring_device.device_heatmap = heatmap
        UpdateDBData(monitoring_device)
    except Exception as e:
        traceback.print_exc()
        print(f"{ip_address}: Error While Updating Heatmap", file=sys.stderr)



def GetLevelAlert(alert_type):
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
            .filter(Monitoring_Alerts_Table.alert_type == alert_type)
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
            
    except Exception:
        traceback.print_exc()
        return []