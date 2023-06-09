from app import db
import traceback
import sys
from datetime import datetime, timedelta

def snmpAlert(host,flag):
    try:
        query = f"select * from alerts_table where ip_address='{host[1]}' and category='snmp' and alert_status='Open';"
        results = db.session.execute(query)
        if results is not None:
            result = results.fetchone()
    except Exception as e:
        traceback.print_exc()

    if flag == False:
        if result is None:
            query = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{host[1]}','Check SNMP Credentials Or Status','informational','snmp','Open','no','{datetime.now()}','{datetime.now()}','{host[7]}');"
            db.session.execute(query)
            db.session.commit()
    else:
        if result is not None:
            query = f"DELETE FROM ALERTS_TABLE WHERE IP_ADDRESS='{host[1]}' AND CATEGORY='snmp';"
            db.session.execute(query)
            db.session.commit()



def statusAlert(host, status):
    pause_min = 60

    heatmap = 'Active'
    if status == 'down':
        heatmap = "Device Down"
    else:
        heatmap = "Active"

    try:
        sqlquery1 = f"update monitoring_devices_table set `DEVICE_HEATMAP`='{heatmap}' where ip_address='{host[1]}';"
        db.session.execute(sqlquery1)
        db.session.commit()
    except Exception as e:
        traceback.print_exc()
        print(
            f"{host[1]}: Error While Updating Heatmap: Device Status", file=sys.stderr)

    result = None
    try:
        query = f"select * from alerts_table where ip_address='{host[1]}' and category='device_down' and alert_status='Open';"
        results = db.session.execute(query)
        if results is not None:
            result = results.fetchone()
    except Exception as e:
        traceback.print_exc()

    if result is None:
        if status == 'down':
            try:
                query = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{host[1]}','Device is down','critical','device_down','Open','no','{datetime.now()}','{datetime.now()}','{host[7]}');"
                db.session.execute(query)
                db.session.commit()
            except Exception as e:
                traceback.print_exc()
    else:
        if status == 'up':
            try:
                # close previous alert
                query = f"update alerts_table set alert_status='Close' , `DATE`='{datetime.now()}' where ip_address = '{host[1]}' and category='device_down' and alert_status = 'Open';"
                db.session.execute(query)
                db.session.commit()

                # create new informational alert for device up
                query = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{host[1]}','Device is now up','informational','device_up','Close','no','{datetime.now()}','{datetime.now()}','{host[7]}');"
                db.session.execute(query)
                db.session.commit()
            except Exception as e:
                traceback.print_exc()
        else:
            # date_format = "%Y-%m-%d %H:%M:%S"

            difference = datetime.now() - result[8]
            sec = int((difference.total_seconds())/60)
            if sec < pause_min:
                pass
            else:
                mins = int(
                    (datetime.now() - result[7]).total_seconds()/60)
                hours = 0
                days = 0
                if mins >= 60:
                    hours = int(mins/60)
                    mins = mins % 60

                if hours >= 24:
                    days = int(hours/24)
                    hours = hours % 24

                desc = f"Device is down since {days} days, {hours} hours and {mins} minutes"
                # close previous alert
                try:
                    query = f"update alerts_table set `DESCRIPTION`='{desc}' , alert_status='Open' , `DATE`='{datetime.now()}' , mail_status='no' where ip_address = '{host[1]}' and category='device_down' and alert_status = 'Open';"
                    db.session.execute(query)
                    db.session.commit()
                except Exception as e:
                    traceback.print_exc()


def cpuNullAlert(host, cpu_threshold):
    pass


# cpu Utilization Alert
def cpuUtilizationAlert(host, alert_type, cpu_util, cpu_threshold):
    try:
        query = f"select * from alerts_table where ip_address = '{host[1]}' and category='cpu' and alert_status='Open';"
        results = db.session.execute(query)
        result = None
        if results is not None:
            result = results.fetchone()

        if result is None:
            # create new alert for cpu
            if alert_type is not None:
                query = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{host[1]}','High CPU Utilization : {cpu_util}%','{alert_type}','cpu','Open','no','{datetime.now()}','{datetime.now()}','{host[7]}');"
                db.session.execute(query)
                db.session.commit()
        else:
            if alert_type is None:
                # close previous alert
                query = f"update alerts_table set alert_status='Close' , `DATE`='{datetime.now()}' where ip_address = '{host[1]}' and category='cpu' and alert_status = 'Open';"
                db.session.execute(query)
                db.session.commit()

                # create new informational alert for device up
                query = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{host[1]}','CPU Utilization is now stable at {cpu_util}%','informational','cpu','Close','no','{datetime.now()}','{datetime.now()}','{host[7]}');"
                db.session.execute(query)
                db.session.commit()
            else:
                # date_format = "%Y-%m-%d %H:%M:%S"

                difference = datetime.now() - result[8]
                difference = int(difference.total_seconds()/60)
                if difference < cpu_threshold['pause']:
                    pass
                else:
                    try:
                        query = f"update alerts_table set `DESCRIPTION`='High CPU Utilization : {cpu_util}%' , alert_type='{alert_type}' , alert_status='Open' , `DATE`='{datetime.now()}' , mail_status='no' where ip_address = '{host[1]}' and category='cpu' and alert_status = 'Open';"
                        db.session.execute(query)
                        db.session.commit()
                    except Exception as e:
                        traceback.print_exc()
    except Exception as e:
        traceback.print_exc()
        print(f"{host[1]}: Error While Alert Data", file=sys.stderr)


# overall CPU alert
def cpuAlert(host, cpu_util):
    # try:
    query = f"select * from alert_cpu_threshold_table where ip_address='{host[1]}';"
    result = db.session.execute(query).fetchone()

    if result is None:
        query = f"select * from alert_cpu_threshold_table where ip_address='All';"
        result = db.session.execute(query).fetchone()

    cpu_threshold = {
        'low_threshold': 50,
        'medium_threshold': 70,
        'critical_threshold': 90,
        'pause': 30
    }
    if result is not None:
        cpu_threshold = {
            'low_threshold': int(result[2]),
            'medium_threshold': int(result[3]),
            'critical_threshold': int(result[4]),
            'pause': int(result[5])
        }

    print(f"{host[1]}: {cpu_threshold}", file=sys.stderr)

    heatmap = 'Active'
    alert_type = None

    if cpu_util == 'NA':
        print(
            f"{host[1]}: Error: Doesn't provide data for cpu utilization", file=sys.stderr)
        heatmap = 'Critical'
        cpuNullAlert(host, cpu_threshold)
    else:

        if cpu_util > cpu_threshold['low_threshold'] and cpu_util <= cpu_threshold['medium_threshold']:
            alert_type = 'low'
        elif cpu_util > cpu_threshold['medium_threshold'] and cpu_util <= cpu_threshold['critical_threshold']:
            alert_type = 'medium'
            heatmap = 'Attention'
        elif cpu_util > cpu_threshold['critical_threshold']:
            alert_type = 'critical'
            heatmap = 'Critical'

        print(
            f"{host[1]}: {alert_type} Alert: CPU Utilization = {cpu_util}", file=sys.stderr)

        cpuUtilizationAlert(host, alert_type, cpu_util, cpu_threshold)

    # update heatmap
    try:
        sqlquery1 = f"update monitoring_devices_table set `DEVICE_HEATMAP`='{heatmap}' where ip_address='{host[1]}';"
        db.session.execute(sqlquery1)
        db.session.commit()
    except Exception as e:
        traceback.print_exc()
        print(f"{host[1]}: Error While Updating Heatmap", file=sys.stderr)


def memoryNullAlert(host, memory_threshold):
    pass


# memory Utilization Alert
def memoryUtilizationAlert(host, alert_type, memory_util, memory_threshold):
    try:
        query = f"select * from alerts_table where ip_address = '{host[1]}' and category='memory' and alert_status='Open';"
        results = db.session.execute(query)
        result = None
        if results is not None:
            result = results.fetchone()

        if result is None:
            # create new alert for memory
            if alert_type is not None:
                query = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{host[1]}','High Memory Utilization : {memory_util}%','{alert_type}','memory','Open','no','{datetime.now()}','{datetime.now()}','{host[7]}');"
                db.session.execute(query)
                db.session.commit()
        else:
            if alert_type is None:
                # close previous alert
                query = f"update alerts_table set alert_status='Close' , `DATE`='{datetime.now()}' where ip_address = '{host[1]}' and category='memory' and alert_status = 'Open';"
                db.session.execute(query)
                db.session.commit()

                # create new informational alert for memory
                query = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{host[1]}','Memory Utilization is now stable at {memory_util}%','informational','memory','Close','no','{datetime.now()}','{datetime.now()}','{host[7]}');"
                db.session.execute(query)
                db.session.commit()
            else:
                # date_format = "%Y-%m-%d %H:%M:%S"

                difference = datetime.now() - result[8]
                difference = int(difference.total_seconds()/60)
                if difference < memory_threshold['pause']:
                    pass
                else:
                    try:
                        query = f"update alerts_table set `DESCRIPTION`='High Memory Utilization : {memory_util}%' , alert_type='{alert_type}' , alert_status='Open' , `DATE`='{datetime.now()}' , mail_status='no' where ip_address = '{host[1]}' and category='memory' and alert_status = 'Open';"
                        db.session.execute(query)
                        db.session.commit()
                    except Exception as e:
                        traceback.print_exc()
    except Exception as e:
        traceback.print_exc()
        print(f"{host[1]}: Error While Alert Data", file=sys.stderr)


# overall memory alert
def memoryAlert(host, memory_util):
    # try:
    query = f"select * from alert_memory_threshold_table where ip_address='{host[1]}';"
    result = db.session.execute(query).fetchone()

    if result is None:
        query = f"select * from alert_memory_threshold_table where ip_address='All';"
        result = db.session.execute(query).fetchone()

    memory_threshold = {
        'low_threshold': 50,
        'medium_threshold': 70,
        'critical_threshold': 90,
        'pause': 30
    }
    if result is not None:
        memory_threshold = {
            'low_threshold': int(result[2]),
            'medium_threshold': int(result[3]),
            'critical_threshold': int(result[4]),
            'pause': int(result[5])
        }

    print(f"{host[1]}: {memory_threshold}", file=sys.stderr)

    heatmap = 'Active'
    alert_type = None

    if memory_util == 'NA':
        print(
            f"{host[1]}: Error: Doesn't provide data for memory utilization", file=sys.stderr)
        heatmap = 'Critical'
        memoryNullAlert(host, memory_threshold)
    else:

        if memory_util > memory_threshold['low_threshold'] and memory_util <= memory_threshold['medium_threshold']:
            alert_type = 'low'
        elif memory_util > memory_threshold['medium_threshold'] and memory_util <= memory_threshold['critical_threshold']:
            alert_type = 'medium'
            heatmap = 'Attention'
        elif memory_util > memory_threshold['critical_threshold']:
            alert_type = 'critical'
            heatmap = 'Critical'

        print(
            f"{host[1]}: {alert_type} Alert: CPU Utilization = {memory_util}", file=sys.stderr)

        memoryUtilizationAlert(host, alert_type, memory_util, memory_threshold)

    # update heatmap
    try:
        sqlquery1 = f"update monitoring_devices_table set `DEVICE_HEATMAP`='{heatmap}' where ip_address='{host[1]}';"
        db.session.execute(sqlquery1)
        db.session.commit()
    except Exception as e:
        traceback.print_exc()
        print(f"{host[1]}: Error While Updating Heatmap", file=sys.stderr)
