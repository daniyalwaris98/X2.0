# Utility Functions
from app import db
from app.models.inventory_models import FAILED_DEVICES_TABLE
from app.monitoring.common_utils.ping_parse import *
from app.monitoring.common_utils.alerts import *

from pysnmp.hlapi import *
from influxdb_client.client.write_api import SYNCHRONOUS

import re
import traceback
import sys
from datetime import datetime
import time


#
# Method to create SNMP V1/V2 Object
#
def createSnmpObjectV2(ip, string, port):
    try:
        print(f"{ip}: Creating SNMP V1/V2 Object", file=sys.stderr)
        engin = SnmpEngine()
        community = CommunityData(
            mpModel=1, communityIndex=ip, communityName=string)
        transport = UdpTransportTarget((ip, port), timeout=5.0, retries=1)
        context = ContextData()

        return [engin, community, transport, context]
    except Exception as e:
        print(f"{ip}: Exception While Creating SNMP V1/V2 Object", file=sys.stderr)
        traceback.print_exc()
        return None

#
# Method to create SNMP V3 Object
#


def createSnmpObjectV3(host):
    try:
        auth_proc = None
        encryp_proc = None
        if host[24] == "MD5":
            auth_proc = usmHMACMD5AuthProtocol
        if host[24] == "SHA":
            auth_proc = usmHMACSHAAuthProtocol
        if host[24] == "SHA-128":
            auth_proc =usmHMAC128SHA224AuthProtocol
        if host[24] == "SHA-256":
            auth_proc = usmHMAC192SHA256AuthProtocol
        if host[24] == "SHA-512":
            auth_proc = usmHMAC384SHA512AuthProtocol

        if host[25] == "DES":
            encryp_proc = usmDESPrivProtocol
        if host[25] == "AES-128" or host[25] == "AES":
            encryp_proc = usmAesCfb128Protocol
        if host[25] == "AES-192":
            encryp_proc = usmAesCfb192Protocol
        if host[25] == "AES-256":
            encryp_proc = usmAesCfb256Protocol

        engin = SnmpEngine()
        # community = CommunityData(mpModel=1,communityIndex=host[1], communityName= host[13])# snmp community
        community = UsmUserData(userName=host[21], authKey=host[22], privKey=host[23],
                                authProtocol=auth_proc, privProtocol=encryp_proc)  # snmp community
        transport = UdpTransportTarget(
            (host[1], host[20]), timeout=5.0, retries=1)
        context = ContextData()

        return [engin, community, transport, context]

    except Exception as e:
        print(
            f"{host[1]}: Exception While Creating SNMP V3 Object", file=sys.stderr)
        traceback.print_exc()
        return None

#
# Method to Test SNMP V2 Connection
#


def testSnmpConnection(snmp):
    try:
        engn = snmp[0]
        community = snmp[1]
        transport = snmp[2]
        cnxt = snmp[3]

        oid = ObjectIdentity('SNMPv2-MIB', 'sysDescr', 0)

        error_indication, error_status, error_index, var_binds = next(getCmd(engn,
                                                                             community,
                                                                             transport,
                                                                             cnxt,
                                                                             ObjectType(oid)))
        # Check if SNMP query was successful
        if error_indication:
            print(f"SNMP query failed: {error_indication}",file=sys.stderr)
        elif error_status:
            print(f"SNMP query failed: {error_status.prettyPrint()}",file=sys.stderr)
        else:
            return True

        return False
    except Exception as e:
        traceback.print_exc()
        return False


def get_oid_data(engn, community, transport, cnxt, oid):

    try:
        print(f"\nSNMP walk started for OID {oid}", file=sys.stderr)

        oid = ObjectType(ObjectIdentity(oid))
        all = []

        for (errorIndication, errorStatus, errorIndex, varBinds) in nextCmd(engn, community, transport, cnxt, oid, lexicographicMode=False):

            if errorIndication:
                print(f'error=>{errorIndication}', file=sys.stderr)
                return "NA"

            elif errorStatus:
                print('%s at %s' % (errorStatus.prettyPrint(),
                                    errorIndex and varBinds[int(errorIndex) - 1][0] or '?'))
                return "NA"
            else:
                for varBind in varBinds:
                    all.append(varBind)
        return all
    except Exception as e:
        print(f"Failed to run SNMP walk: {e}", file=sys.stderr)
        traceback.print_exc()
        return "NA"


def getSnmpData(host, oids):
    print(f"\n---------->>>>>>>> {host[1]} : Start <<<<<<<<-----------\n",file=sys.stderr)
    
    status = dict()
    try:
        status['status'], status['response'], status['packets'] = ping(host[1])
        if status['status'] == "Up":
            statusAlert(host,'Up')
        else:
            statusAlert(host,'Down')
    except Exception as e:
        traceback.print_exc()
        print(f"{host[1]}: Error In Ping0", file=sys.stderr)
        status['status'] = "Down"
        status['response'] = 'NA'
        try:
            statusAlert(host,'Down')
        except:
            traceback.print_exc()
    
    # if status['status'] == 'Down':
    #     return

    snmp = None
    connection = False

    if host[14].lower() == "v3":
        snmp = createSnmpObjectV3(host)
        connection = testSnmpConnection(snmp)
    elif host[14].lower() == "v1/v2":
        snmp = createSnmpObjectV2(host[1], host[19], host[20])
        connection = testSnmpConnection(snmp)
    else:
        print(f"{host[1]}: Error : SNMP Version Unkwon",file=sys.stderr)


    # check snmp credentials
    if connection is False:
        print(f"{host[1]}: Error : Check SNMP Credentials",file=sys.stderr)
        snmpAlert(host,False)
        snmp = None
    else:
        print(f"{host[1]}: SNMP Connection Successfull",file=sys.stderr)
        snmpAlert(host,True)

    # check if snmp is not set up successfully
    if snmp is None:
        print(f"{host[1]}: Exiting Poll. Failed",file=sys.stderr)
        return None

    device = dict()
    try:
        print(
            f"\n---------->>>>>>>\n{host[1]}: Device Data Extraction/Insertion Started\n",file=sys.stderr)
        device = getDeviceData(host, snmp, oids)
        device.update(status)
        dumpDeviceData(host, device)
    except Exception as e:
        traceback.print_exc()
        print(f"{host[1]}: Device Data Extraction/Insertion Failed",file=sys.stderr)
    print(
        f"\n{host[1]}: Device Data Extraction/Insertion Complete\n<<<<<---------------\n",file=sys.stderr)

    interface = dict()
    try:
        print(
            f"\n---------->>>>>>>\n{host[1]}: Interface Data Extraction/Insertion Started\n",file=sys.stderr)
        interface = getInterfaceData(host, snmp, oids)
        if interface is not None:
            dumpInterfaceData(host, device, interface)
    except Exception as e:
        traceback.print_exc()
        print(f"{host[1]}: Interface Data Extraction/Insertion Failed",file=sys.stderr)
    print(
        f"\n{host[1]}: Interface Data Extraction/Insertion Complete\n<<<<<---------------\n",file=sys.stderr)


def getDeviceData(host, snmp, oids):
    output = dict()

    

    # Uptime
    output['uptime'] = getUpTime(host, snmp, oids['uptime'])

    # CPU Utilization
    output['cpu'] = getCpuUtilization(host, snmp, oids['cpu_utilization'])
    try:
        cpuAlert(host,output["cpu"])
    except:
        traceback.print_exc()

    # Memory Utilization
    output['memory'] = 0.0
    output['memory'] = getMemoryUtilization(host, snmp, oids)
    try:
        memoryAlert(host,int(output["memory"]))
    except:
        traceback.print_exc()

    # Device Description
    output['device_name'] = getDeviceName(host, snmp, oids['device_name'])

    # Device Description
    output['device_description'] = getDeviceDescription(
        host, snmp, oids['device_description'])

    return output


def getInterfaceData(host, snmp, oids):
    interfaces = getInterfaceList(host, snmp, oids['interfaces'])
    if interfaces == None:
        return None

    interface_description = getInterfaceList(
        host, snmp, oids['interface_description'])
    if interface_description == None:
        return None

    interface_status = getInterfaceList(host, snmp, oids['interface_status'])
    if interface_status == None:
        interface_status = dict()
        for key in interfaces.keys():
            interface_status[key] = ['NA']

    # Get first snapshot
    start_time = datetime.now()
    print(f"{host[1]}: Taking 1st Snapshot : {str(start_time)}",
          file=sys.stderr)
    download_counter_start = getInterfaceList(host, snmp, oids['download'])
    if download_counter_start == None:
        print(f"{host[1]}: Error in Interface Download", file=sys.stderr)

    upload_counter_start = getInterfaceList(host, snmp, oids['upload'])
    if upload_counter_start == None:
        print(f"{host[1]}: Error in Interface Upload", file=sys.stderr)

    print(f"{host[1]}: Waiting For 2nd Snapshot", file=sys.stderr)
    try:
        time.sleep(10)
    except Exception as e:
        traceback.print_exc()
        print(f"{host[1]}: Error in Waiting", file=sys.stderr)

    end_time = datetime.now()
    print(f"{host[1]}: Taking 2nd Snapshot : {str(end_time)}", file=sys.stderr)

    download_counter_end = getInterfaceList(host, snmp, oids['download'])
    if download_counter_end == None:
        print(f"{host[1]}: Error in Interface Download", file=sys.stderr)

    upload_counter_end = getInterfaceList(host, snmp, oids['upload'])
    if upload_counter_end == None:
        print(f"{host[1]}: Error in Interface Upload", file=sys.stderr)

    time_difference = (end_time - start_time).total_seconds()
    print(f"{host[1]}: Time Difference : {str(time_difference)}",
          file=sys.stderr)

    interfaceList = dict()
    for key in interfaces.keys():
        description = 'NA'
        status = 'NA'
        download = 0.0
        upload = 0.0

        if key in interface_description.keys():
            description = interface_description[key][0]

        if key in interface_status.keys():
            if interface_status[key][0] == '1':
                status = 'Up'
            else:
                status = 'Down'

        try:
            if download_counter_start is not None and download_counter_end is not None:
                if key in download_counter_start.keys() and key in download_counter_end.keys():
                    download = int(
                        download_counter_end[key][0]) - int(download_counter_start[key][0])
                    if download < 0:
                        print(
                            f"{host[1]}: Error In Download Difference : {interfaces[key]} : {download}", file=sys.stderr)
                    else:
                        download = (download * 8) / time_difference  # bps
                        download = download / 1000  # Kbps
                        download = download / 1000  # Mps
                        download = round(download, 2)

        except Exception as e:
            traceback.print_exc()
            print(
                f"{host[1]}: Error In Download Calculation : {interfaces[key]}", file=sys.stderr)

        try:
            if upload_counter_start is not None and upload_counter_end is not None:
                if key in upload_counter_start.keys() and key in upload_counter_end.keys():
                    upload = int(
                        upload_counter_end[key][0]) - int(upload_counter_start[key][0])
                    if upload < 0:
                        print(
                            f"{host[1]}: Error In Upload Difference : {interfaces[key]} : {upload}", file=sys.stderr)
                    else:
                        upload = (upload * 8) / time_difference  # bps
                        upload = upload/1000  # Kbps
                        upload = upload/1000  # Mbps
                        upload = round(upload, 2)

        except Exception as e:
            traceback.print_exc()
            print(
                f"{host[1]}: Error In Upload Calculation : {interfaces[key]}", file=sys.stderr)

        interfaceObj = {
            'name': interfaces[key][0],
            'status': status,
            'description': description,
            'download': download,
            'upload': upload
        }

        interfaceList[key] = interfaceObj

    return interfaceList


def getInterfaceList(host, snmp, oid):
    engn = snmp[0]
    community = snmp[1]
    transport = snmp[2]
    cnxt = snmp[3]

    interfaces = None
    try:
        value = get_oid_data(
            engn, community, transport, cnxt, oid)
        interfaces = parse_snmp_output(value)
    except:
        print(f"{host[1]}: Error in Interfaces", file=sys.stderr)
        traceback.print_exc()
        return None

    print(f"{host[1]}: Interfaces : {interfaces}", file=sys.stderr)
    return interfaces


def getUpTime(host, snmp, oid):
    engn = snmp[0]
    community = snmp[1]
    transport = snmp[2]
    cnxt = snmp[3]

    uptime = 0
    try:
        value = get_oid_data(
            engn, community, transport, cnxt, oid)
        uptime = int(parse_general(value))
        uptime = convert_time(uptime)
    except:
        print(f"{host[1]}: Error in Up Time", file=sys.stderr)
        traceback.print_exc()
        uptime = "NULL"

    print(f"{host[1]}: Up Time : {uptime}", file=sys.stderr)
    return uptime


def getCpuUtilization(host, snmp, oid):
    engn = snmp[0]
    community = snmp[1]
    transport = snmp[2]
    cnxt = snmp[3]

    cpu = 0
    try:
        value = get_oid_data(
            engn, community, transport, cnxt, oid)
        if value == 'NA':
            cpu = 'NA'
        else:
            cpu_list = parse_snmp_output(value)
            for key in cpu_list.keys():
                cpu += int(cpu_list[key][0])
    except:
        print(f"{host[1]}: Error in CPU", file=sys.stderr)
        traceback.print_exc()
        cpu = "NA"

    print(f"{host[1]}: CPU Utilization : {cpu}", file=sys.stderr)
    return cpu


# Method to get memory utilization by extracting used and free memory
def getMemoryUtilization(host, snmp, oids):

    engn = snmp[0]
    community = snmp[1]
    transport = snmp[2]
    cnxt = snmp[3]

    memory_util = 0.0
    if host[2].lower() == 'fortinet':
        if 'memory' in oids.keys():
            try:
                memory = get_oid_data(
                    engn, community, transport, cnxt, oids['memory'])
                memory_util = float(parse_general(memory))

            except Exception as e:
                print(f"{host[1]}: Error in Memory Utilization",
                      file=sys.stderr)
                traceback.print_exc()
        else:
            print(
                f"{host[1]}: Error : Memory Percent Utilization OID Not Given", file=sys.stderr)

    elif host[2].lower() == 'cisco_ios' or host[2].lower() == 'cisco_ios_xe':
        try:
            if 'memory_used' in oids.keys() and 'memory_free' in oids.keys():
                memory_used = get_oid_data(
                    engn, community, transport, cnxt, oids['memory_used'])
                memory_used = float(parse_general(memory_used))
                print(f"{host[1]}: Memory Used: {memory_used}",
                      file=sys.stderr)

                memory_free = get_oid_data(
                    engn, community, transport, cnxt, oids['memory_free'])
                memory_free = float(parse_general(memory_free))
                print(f"{host[1]}: Memory Free: {memory_free}",
                      file=sys.stderr)

                memory_util = (memory_used*100)/(memory_used+memory_free)
            else:
                print(
                    f"{host[1]}: Error : Memory Used Or Memory Free OID Not Given", file=sys.stderr)
        except Exception as e:
            print(f"{host[1]}: Error in Memory Utilization", file=sys.stderr)
            traceback.print_exc()

    elif host[2].lower() == 'window':
        try:

            if 'memory_used' in oids.keys() and 'memory_total' in oids.keys():
                memory_used = get_oid_data(
                    engn, community, transport, cnxt, oids['memory_used'])
                memory_used = float(parse_general(memory_used))
                print(f"{host[1]}: Memory Used: {memory_used}",
                      file=sys.stderr)

                memory_total = get_oid_data(
                    engn, community, transport, cnxt, oids['memory_total'])
                memory_total = int(parse_general(memory_total))
                print(f"{host[1]}: Memory Total: {memory_total}",
                      file=sys.stderr)

                memory_util = (memory_used*100)/(memory_total)
            else:
                print(
                    f"{host[1]}: Error : Memory Used Or Memory Total OID Not Given", file=sys.stderr)

        except Exception as e:
            print(f"{host[1]}: Error in Memory Utilization", file=sys.stderr)
            traceback.print_exc()

    elif host[2].lower() == 'extream':
        try:

            if 'memory_free' in oids.keys() and 'memory_total' in oids.keys():
                memory_free = get_oid_data(
                    engn, community, transport, cnxt, oids['memory_free'])
                memory_free = float(parse_general(memory_free))
                print(f"{host[1]}: Memory Free: {memory_free}",
                      file=sys.stderr)

                memory_total = get_oid_data(
                    engn, community, transport, cnxt, oids['memory_total'])
                memory_total = int(parse_general(memory_total))
                print(f"{host[1]}: Memory Total: {memory_total}",
                      file=sys.stderr)

                memory_util = (memory_total-memory_free*100)/(memory_total)
            else:
                print(
                    f"{host[1]}: Error : Memory Used Or Memory Total OID Not Given", file=sys.stderr)

        except Exception as e:
            print(f"{host[1]}: Error in Memory Utilization", file=sys.stderr)
            traceback.print_exc()

    memory_util = round(memory_util, 2)
    print(f"{host[1]}: Memory Utilization : {memory_util}", file=sys.stderr)
    return memory_util


def getDeviceDescription(host, snmp, oid):
    engn = snmp[0]
    community = snmp[1]
    transport = snmp[2]
    cnxt = snmp[3]

    device = "NA"
    try:
        value = get_oid_data(
            engn, community, transport, cnxt, oid)
        device = parse_general(value)
    except:
        print(f"{host[1]}: Error in Device Description", file=sys.stderr)
        traceback.print_exc()

    print(f"{host[1]}: Device Description : {device}", file=sys.stderr)
    return device


def getDeviceName(host, snmp, oid):
    engn = snmp[0]
    community = snmp[1]
    transport = snmp[2]
    cnxt = snmp[3]

    device = 'NA'
    try:
        value = get_oid_data(
            engn, community, transport, cnxt, oid)
        device = parse_general(value)
    except:
        print(f"{host[1]}: Error in Device Name", file=sys.stderr)
        traceback.print_exc()

    print(f"{host[1]}: Device Name : {device}", file=sys.stderr)
    return device


def parse_snmp_output(varbinds):
    intefaces_val = dict()
    for varbind in varbinds:
        out = re.search(r'\d* .*', str(varbind)).group()
        value = out.split('=')
        intefaces_val[value[0]] = [value[1].strip()]

    return intefaces_val


def parse_general(varbinds):
    for varBind in varbinds:
        res = ' = '.join([x.prettyPrint() for x in varBind])
        if 'No Such Instance' not in res:
            result = res.split('=')[1].strip()
            return result


def dumpDeviceData(host, output):

    from app import client
    print(f"{host[1]}: Dumping Device Data",file=sys.stderr)
    write_api = client.write_api(write_options=SYNCHRONOUS)

    dictionary = [
        {
            "measurement": "Devices",
            "tags":
            {"DEVICE_NAME": output['device_name'],
                "STATUS": output['status'],
                "IP_ADDRESS": host[1],
                "FUNCTION": host[7],
                "VENDOR": host[6],
                "DEVICE_TYPE":host[2],
             },
            "time": datetime.now(),
            "fields":
            {
                "INTERFACES": 22,
                "DISCOVERED_TIME": str(datetime.now()),
                "DEVICE_DESCRIPTION": output['device_description'],
                "CPU": output['cpu'],
                "Memory": output['memory'],
                "PACKETS_LOSS": output['packets'],
                "Response": output['response'],
                "Uptime": output['uptime'],
                "Date": str(datetime.now())
            }
        }]
    if dictionary[0]['fields']['CPU'] == 'NA':
        dictionary[0]['fields']['CPU'] = 0

    if dictionary[0]['fields']['Memory'] == 'NA':
        dictionary[0]['fields']['Memory'] = 0.0

    try:
        write_api.write(bucket='monitoring', record=dictionary)
    except Exception as e:
        traceback.print_exc()
        print(
            f"{host[1]}: Influx Connection Issue For Device: {e}", file=sys.stderr)


def dumpInterfaceData(host, output, interfaces):
    from app import client
    write_api = client.write_api(write_options=SYNCHRONOUS)

    if len(interfaces.items()) > 0:

        for k in interfaces.keys():
            dictionary1 = [{
                "measurement": "Interfaces",
                "tags":
                {"DEVICE_NAME": output['device_name'],
                 "STATUS": output['status'],
                 "IP_ADDRESS": host[1],
                 "FUNCTION": host[7],
                 "VENDOR": host[6],
                 "DEVICE_TYPE":host[2],
                 },
                "time": datetime.now(),
                "fields":
                {
                    "Interface_Name": interfaces[k]['name'],
                    "Status": interfaces[k]['status'],
                    "Download": float(interfaces[k]['download']),
                    "Upload": float(interfaces[k]['upload']),
                    "Interface Description":interfaces[k]['description'],
                    "Date": str(datetime.now())

                }}]

            try:
                write_api.write(bucket='monitoring', record=dictionary1)
            except Exception as e:
                print(
                    f"{host[1]}: Influx Connection Issue For Interface: {interfaces[k]['name']}: {e}", file=sys.stderr)


#
#
#
#
#
#
#
#


def InsertData(obj):
    # add data to db
    try:
        db.session.add(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(
            f"Something else went wrong in Database Insertion {e}", file=sys.stderr)

    return True


def UpdateData(obj):
    # add data to db
    # print(obj, file=sys.stderr)
    try:
        # db.session.flush()

        db.session.merge(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(
            f"Something else went wrong during Database Update {e}", file=sys.stderr)

    return True


def addFailedDevice(ip, date, device_type, failure_reason, module):
    failed = FAILED_DEVICES_TABLE()
    failed.ip_address = ip
    failed.date = date
    failed.device_type = device_type
    failed.failure_reason = failure_reason
    failed.module = module
    if FAILED_DEVICES_TABLE.query.with_entities(FAILED_DEVICES_TABLE.ip_address).filter_by(ip_address=ip) is not None:

        print("Updated "+ip, file=sys.stderr)
        UpdateData(failed)
    else:
        print("Inserted ", ip, file=sys.stderr)
        InsertData(failed)


def convert_time(seconds):
    seconds = seconds % (24 * 3600)
    hour = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60

    return "%d:%02d:%02d" % (hour, minutes, seconds)


def general(varbinds):
    for varBind in varbinds:
        res = ' = '.join([x.prettyPrint() for x in varBind])
        if 'No Such Instance' not in res:
            result = res.split('=')[1].strip()

            return result


# def date_diff(datedb, datenow):
#     NUM_SECONDS_IN_A_MIN = 60

#     seconds = (datenow-datedb).total_seconds()
#     minutes = seconds / NUM_SECONDS_IN_A_MIN
#     print("//////////////difference in seconds:", seconds, type(seconds),
#           "\n///////////difference in minutes:", minutes, type(minutes), file=sys.stderr)
#     return minutes


# thrushold_list = [30, 60, 120, 300, 1440]


# def alert_check(ip, value, category, func):
#     if category == 'memory' or category == 'cpu':
#         try:
#             if value == "None" or value == "NA" or value == None:
#                 # start_time_query = f"select start_date from alerts_table where IP_ADDRESS='{ip}' and  (ALERT_TYPE='critical' and category='{category}') and ALERT_STATUS='Open';"
#                 # start_time = db.session.execute(start_time_query)
#                 # print("printing start time of alert",start_time,file=sys.stderr)
#                 queryString = f"select IP_ADDRESS,ALERT_TYPE,date,start_date from alerts_table where IP_ADDRESS='{ip}' and (ALERT_TYPE='critical' and ALERT_STATUS='Open') and category='{category}';"
#                 result = db.session.execute(queryString)
#                 check_ip = ""
#                 for row in result:
#                     check_ip = row[0]
#                     if check_ip != "" or check_ip != None:
#                         time = date_diff(row[3], datetime.now())

#                         if int(time) > 30:
#                             sqlquery1 = f"update alerts_table set ALERT_STATUS = 'Close' where IP_ADDRESS='{ip}' and (ALERT_TYPE='critical' and ALERT_STATUS='Open') and category='{category}';"
#                             db.session.execute(sqlquery1)
#                             db.session.commit()
#                             des = f"Not Providing Value of {category.upper()} from the Last {int(time)} Minutes"
#                             sqlquery1 = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{ip}','{des}','critical','{category}','Open','no','{datetime.now()}','{row[3]}','{func}');"
#                             db.session.execute(sqlquery1)
#                             db.session.commit()
#                 if check_ip == "":
#                     des = f"Not Providing Value of {category.upper()}"
#                     sqlquery1 = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{ip}','{des}','critical','{category}','Open','no','{datetime.now()}','{datetime.now()}','{func}');"
#                     db.session.execute(sqlquery1)
#                     db.session.commit()
#                 sqlquery1 = f"update monitoring_devices_table set `DEVICE_HEATMAP`='Critical' where ip_address='{ip}';"
#                 db.session.execute(sqlquery1)
#                 db.session.commit()

#             elif float(value) < 50:
#                 queryString = f"select IP_ADDRESS,ALERT_TYPE,date,start_date from alerts_table where IP_ADDRESS='{ip}' and (ALERT_STATUS='Open' and category='{category}');"
#                 result = db.session.execute(queryString)
#                 check_ip = ""
#                 for row in result:
#                     check_ip = row[0]
#                     if check_ip != "":
#                         sqlquery1 = f"update alerts_table set ALERT_STATUS = 'Close' where IP_ADDRESS='{ip}' and category='{category}';"
#                         db.session.execute(sqlquery1)
#                         db.session.commit()
#                         des = f"Device {category.upper()} Utilization is Clear Now."
#                         sqlquery2 = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{ip}','{des}','clear','{category}','Close','no','{datetime.now()}','{row[3]}','{func}');"
#                         db.session.execute(sqlquery2)
#                         db.session.commit()
#                 sqlquery1 = f"update monitoring_devices_table set `DEVICE_HEATMAP`='Clear' where ip_address='{ip}';"
#                 db.session.execute(sqlquery1)
#                 db.session.commit()

#             if float(value) > 50 and float(value) < 70:
#                 # start_time_query = f"select min(start_date) from alerts_table where IP_ADDRESS='{ip}' and  (ALERT_TYPE='informational' and category='{category}');"
#                 # start_time = db.session.execute(start_time_query)
#                 # print("printing start time of alert",start_time,file=sys.stderr)

#                 queryString = f"select IP_ADDRESS,ALERT_TYPE,date,start_date from alerts_table where IP_ADDRESS='{ip}' and (ALERT_TYPE='informational'and ALERT_STATUS='Open') and category='{category}';"
#                 result = db.session.execute(queryString)
#                 check_ip = ""
#                 for row in result:
#                     check_ip = row[0]
#                     if check_ip != "":
#                         date_db = row[2]
#                         date_now = datetime.now()
#                         time = date_diff(row[3], datetime.now())
#                         if int(time) > 30:
#                             sqlquery1 = f"update alerts_table set ALERT_STATUS = 'Close' where IP_ADDRESS='{ip}' and (ALERT_TYPE='informational' and ALERT_STATUS='Open' and category='{category}');"
#                             db.session.execute(sqlquery1)
#                             db.session.commit()
#                             des = f"Utilizing {value}% of {category.upper()} from the Last {int(time)} Minutes"
#                             sqlquery1 = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{ip}','{des}','critical','{category}','Open','no','{datetime.now()}','{row[3]}','{func}');"
#                             db.session.execute(sqlquery1)
#                             db.session.commit()
#                 if check_ip == "":
#                     des = f"Utilizing {value}% of {category.upper()}"
#                     sqlquery = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{ip}','{des}','informational','{category}','Open','no','{datetime.now()}','{datetime.now()}','{func}');"
#                     db.session.execute(sqlquery)
#                     db.session.commit()
#                 sqlquery1 = f"update monitoring_devices_table set `DEVICE_HEATMAP`='Attention' where ip_address='{ip}';"
#                 db.session.execute(sqlquery1)
#                 db.session.commit()

#             if float(value) > 70:
#                 # start_time_query = f"select min(start_date) from alerts_table where IP_ADDRESS='{ip}' and  (ALERT_TYPE='critical' and category='{category}') and ALERT_STATUS='Open';"
#                 # start_time = db.session.execute(start_time_query)
#                 # print("printing start time of alert",start_time,file=sys.stderr)
#                 queryString = f"select IP_ADDRESS,ALERT_TYPE,date,start_date from alerts_table where IP_ADDRESS='{ip}' and ( ALERT_TYPE='critical'and ALERT_STATUS='Open' ) and category='{category}';"
#                 result = db.session.execute(queryString)
#                 check_ip = ""
#                 for row in result:
#                     check_ip = row[0]
#                     if check_ip != "":
#                         date_db = row[2]
#                         date_now = datetime.now()
#                         time = date_diff(row[3], datetime.now())
#                         if int(time) > 30:
#                             sqlquery1 = f"update alerts_table set ALERT_STATUS = 'Close' where IP_ADDRESS='{ip}' and (ALERT_TYPE='critical' and ALERT_STATUS='Open' and category='{category}');"
#                             db.session.execute(sqlquery1)
#                             db.session.commit()
#                             des = f"Utilizing {value}% of {category.upper()} from the Last {int(time)} Minutes"
#                             sqlquery1 = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{ip}','{des}','critical','{category}','Open','no','{datetime.now()}','{row[3]}','{func}');"
#                             db.session.execute(sqlquery1)
#                             db.session.commit()
#                 if check_ip == "":

#                     des = f"utilizing {value}% of {category}"
#                     sqlquery = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{ip}','{des}','critical','{category}','Open','no','{datetime.now()}','{datetime.now()}','{func}');"
#                     db.session.execute(sqlquery)
#                     db.session.commit()
#                 sqlquery1 = f"update monitoring_devices_table set `DEVICE_HEATMAP`='Critical' where ip_address='{ip}';"
#                 db.session.execute(sqlquery1)
#                 db.session.commit()

#         except Exception as e:
#             print("/////Printing exception in alerts/////",
#                   str(e), file=sys.stderr)
#             traceback.print_exc()

#     if category == 'device_down':
#         # start_time_query = f"select min(start_date) from alerts_table where IP_ADDRESS='{ip}' and  (ALERT_TYPE='critical' and category='{category}') and ALERT_STATUS='Open';"
#         # start_time = db.session.execute(start_time_query)
#         # print("printing start time of alert",start_time,file=sys.stderr)
#         queryString = f"select IP_ADDRESS,ALERT_TYPE,date,start_date from alerts_table where IP_ADDRESS='{ip}' and (ALERT_TYPE='device_down'and ALERT_STATUS='Open') and category='{category}';"
#         result = db.session.execute(queryString)
#         check_ip = ""
#         for row in result:
#             check_ip = row[0]
#             if check_ip != "":
#                 date_db = row[2]
#                 date_now = datetime.now()
#                 time = date_diff(row[3], datetime.now())
#                 if int(time) > 30:
#                     sqlquery1 = f"update alerts_table set ALERT_STATUS = 'Close' where IP_ADDRESS='{ip}' and (ALERT_TYPE='critical' and ALERT_STATUS='Open' and category='{category}');"
#                     db.session.execute(sqlquery1)
#                     db.session.commit()
#                     des = f"Device is Offline from the Last {int(time)} Minutes"
#                     sqlquery1 = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{ip}','{des}','critical','{category}','Open','no','{datetime.now()}','{row[3]}','{func}');"
#                     db.session.execute(sqlquery1)
#                     db.session.commit()
#         if check_ip == "":

#             des = f"Device is Offline"
#             sqlquery = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{ip}','{des}','device_down','{category}','Open','no','{datetime.now()}','{datetime.now()}','{func}');"
#             db.session.execute(sqlquery)
#             db.session.commit()
#         sqlquery1 = f"update monitoring_devices_table set `DEVICE_HEATMAP`='Device Down' where ip_address='{ip}';"
#         db.session.execute(sqlquery1)
#         db.session.commit()

#     if category == 'device_up':
#         queryString = f"select IP_ADDRESS,ALERT_TYPE,date,start_date from alerts_table where IP_ADDRESS='{ip}' and (ALERT_STATUS='Open' and category='device_down');"
#         result = db.session.execute(queryString)
#         check_ip = ""
#         for row in result:
#             check_ip = row[0]
#             if check_ip != "":
#                 sqlquery1 = f"update alerts_table set ALERT_STATUS = 'Close' where IP_ADDRESS='{ip}' and category='device_down';"
#                 db.session.execute(sqlquery1)
#                 db.session.commit()
#                 des = f"Device is Online now."
#                 sqlquery2 = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`CATEGORY`,`ALERT_STATUS`,`MAIL_STATUS`,`DATE`,`START_DATE`,`FUNCTION`) values ('{ip}','{des}','clear','{category}','Close','no','{datetime.now()}','{row[3]}','{func}');"
#                 db.session.execute(sqlquery2)
#                 db.session.commit()

#         sqlquery1 = f"update monitoring_devices_table set `DEVICE_HEATMAP`='Clear' where ip_address='{ip}';"
#         db.session.execute(sqlquery1)
#         db.session.commit()
