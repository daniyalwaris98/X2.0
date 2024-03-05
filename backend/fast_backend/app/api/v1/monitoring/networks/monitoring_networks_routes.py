from fastapi import  FastAPI,Query
from fastapi import APIRouter
from app.models.monitoring_models import *
from app.schema.monitoring_schema import *
import sys
import traceback
from fastapi.responses import JSONResponse
from app.models.atom_models import *
from app.api.v1.monitoring.device.utils.monitoring_utils import *
from app.schema.monitoring_network_schema import *

router = APIRouter(
    prefix="/monitoring_network",
    tags=["monitoring_network"]
)

@router.post('/get_interfaces_by_ip_address',responses={
    200:{"model":list[InterfaceCardDataSchema]},
    500:{"model":str}
},
summary="API to get the interfaces based on ip address",
description="API to get the interfaces based on ip address"
)
def get_interfaces_by_ip_address(ip: MonitoringAlertsByIpAddress):
    try:
        ip=ip.ip_address
        print("ip in get interface by ip address is::::::::::::",ip,file=sys.stderr)
        interfaces_list = []
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
        print("query in the interfaces ip address is::::::::::::",query,file=sys.stderr)
        interfaces_dict = {
            "interfaces":get_interface_influx_data(query)
        }
        print("interces dict is::::::::::::::::",interfaces_dict,file=sys.stderr)
        result = get_interface_influx_data(query)
        print("interfaces dict is:::::::::::::::",result,file=sys.stderr)
        interfaces_list.append(result)
        print("interface list is::::::::::::::::::::",interfaces_list,file=sys.stderr)
        return result
    except Exception as e:
        configs.db.rollback()
        traceback.print_exc()
        return JSONResponse(content="Error OCcured While Getting the interfaces by ip address",status_code=500)


@router.get('/get_all_devices_in_networks',
            responses={
                200:{"model":list[GetMonitoringNetworkDevicesSchema]},
                500:{"model":str}
            },
            summary="use this api in monitoring network=>devices to list down all devices in table",
            description = "use this api in monitoring network=>devices to list down all devices in table"

)
async def get_all_devices_in_networks():
    try:
        final_list = []
        org = "monetx"
        query_api = configs.client.query_api()
        query = f'import "strings"\
                   import "influxdata/influxdb/schema"\
                   from(bucket: "monitoring")\
                   |> range(start:-60d)\
                   |> filter(fn: (r) => r["_measurement"] == "Devices")\
                   |> filter(fn: (r) => r["FUNCTION"] != "VM")\
                   |> last()\
                   |> schema.fieldsAsCols()'
        result = query_api.query(org="monetx", query=query)
        print("result in get all networking devices is::for influx is", result, file=sys.stderr)
        results = []

        for table in result:
            print("table in result is:::::::::::::::::", table, file=sys.stderr)
            for record in table.records:
                print("record is::::::::::::::::::::", record, file=sys.stderr)
                try:
                    objDict = {
                        'ip_address': record["IP_ADDRESS"],
                        'function': record["FUNCTION"],
                        'response': record['Response'],
                        'status': record['STATUS'],
                        'uptime': record['Uptime'],
                        'vendor': record['VENDOR'],
                        'cpu': record['CPU'],
                        'memory': record['Memory'],
                        'packets': record['PACKETS_LOSS'],
                        'device_name': record['DEVICE_NAME'],
                        'interfaces': record['INTERFACES'],
                        'date': record['Date'],
                        'device_description': record['DEVICE_DESCRIPTION'],
                        'discovered_time': record['DISCOVERED_TIME'],
                        'device_type': record['DEVICE_TYPE']
                    }
                    results.append(objDict)
                    print("results list is updated :::::::;", result, file=sys.stderr)
                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    traceback.print_exc()

        final = sorted(results, key=lambda k: k.get('date', ''), reverse=False)
        print("final list is:::::::::::::::::::::::::",final,file=sys.stderr)
        if final:
            final_list = list({v['ip_address']: v for v in final}.values())
            print("final list is not none:::::::",final_list,file=sys.stderr)
        if final_list is None:
            devices = [
                {
                    'ip_address': '192.168.0.5',
                    'device_type': 'cisco_ios',
                    'device_name': 'NETS-inside-C2960.nets-international.local',
                    'vendor': 'Cisco',
                    'total_interfaces': '1',
                    'function': 'Up',
                    'status': '2024-03-01 06:07:42.844870',
                    'discovered_time': 'Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 12.2(44)SE6, RELEASE SOFTWARE (fc1) Copyright (c) 1986-2009 by Cisco Systems, Inc. Compiled Mon 09-Mar-09 18:10 by gereddy',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_type': 'fortinet',
                    'device_name': 'FG-NETS.nets-international.local',
                    'vendor': 'Cisco',
                    'total_interfaces': '12',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.294215',
                    'discovered_time': 'FGT-IMS',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.45',
                    'device_type': 'cisco_ios',
                    'device_name': 'NSO-SW1.nets-international.com',
                    'vendor': 'Cisco',
                    'total_interfaces': '4',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.489963',
                    'discovered_time': 'Cisco IOS Software, Linux Software (I86BI_LINUXL2-ADVENTERPRISEK9-M), Version 15.2(CML_NIGHTLY_20190423)FLO_DSGS7, EARLY DEPLOYMENT DEVELOPMENT BUILD, synced to V152_6_0_81_E Technical Support: http://www.cisco.com/techsupport Copyright (c) 1986-2019 b',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_type': 'cisco_ios',
                    'device_name': 'CSR6.nets-international.com',
                    'vendor': 'Cisco',
                    'total_interfaces': '3',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.565425',
                    'discovered_time': 'Cisco IOS Software [Gibraltar], Virtual XE Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 16.12.5, RELEASE SOFTWARE (fc3) Technical Support: http://www.cisco.com/techsupport Copyright (c) 1986-2021 by Cisco Systems, Inc. Compiled Fri 29-Jan-21 12:',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.25',
                    'device_type': 'cisco_ios_xe',
                    'device_name': 'NSOIOSXR4',
                    'vendor': 'Cisco',
                    'total_interfaces': '10',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.630048',
                    'discovered_time': 'Cisco IOS XR Software (Cisco IOS XRv Series), Version 6.1.2[Default] Copyright (c) 2016 by Cisco Systems, Inc.',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.43',
                    'device_type': 'cisco_ios',
                    'device_name': 'CSR5.nets-international.com',
                    'vendor': 'Cisco',
                    'total_interfaces': '10',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.652814',
                    'discovered_time': 'Cisco IOS Software [Gibraltar], Virtual XE Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 16.12.5, RELEASE SOFTWARE (fc3) Technical Support: http://www.cisco.com/techsupport Copyright (c) 1986-2021 by Cisco Systems, Inc. Compiled Fri 29-Jan-21 12:',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.28',
                    'device_type': 'cisco_ios',
                    'device_name': 'NSOIOSXR2',
                    'vendor': 'Cisco',
                    'total_interfaces': '12',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.688015',
                    'discovered_time': 'Cisco IOS XR Software (Cisco IOS XRv Series), Version 6.1.2[Default] Copyright (c) 2016 by Cisco Systems, Inc.',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.50',
                    'device_type': 'cisco_ios',
                    'device_name': 'NSO-R50.nets-international.com',
                    'vendor': 'Cisco',
                    'total_interfaces': '1',
                    'function': '',
                    'status': '',
                    'discovered_time': '',
                    'device_description': ''
                }
            ]
            return devices
        else:
            return final_list
    except Exception as e:
        configs.db.rollback()
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Getting Network Devices",status_code=500)


@router.get('/get_all_devices_interfaces_in_networks',
            responses={
                200:{"model":list[GetDevicesInterfaceRecordSchema]},
                500:{"model":str}
            },
            summary="use this api in monitoring network=>devices=>interfaces to list down all devices interfaces in table",
            description="use this api in monitoring network=>devices=>interfaces to list down all devices interfaces in table"

)
async def get_all_interfaces_in_network():
    try:
        org = "monetx"
        query_api = configs.client.query_api()
        query = '''
            import "strings"
            import "influxdata/influxdb/schema"
            from(bucket: "monitoring")
            |> range(start:-60d)
            |> filter(fn: (r) => r["_measurement"] == "Interfaces")
            |> filter(fn: (r) => r["FUNCTION"] != "VM")
            |> schema.fieldsAsCols()
            |> sort(columns: ["_time"], desc: true)
            |> unique(column: "Interface_Name")
            |> yield(name: "unique")
        '''
        result = query_api.query(org="monetx", query=query)
        print("result is::::::::::::::::::::::::::::::",result,file=sys.stderr)
        interface_records = []
        for table in result:
            print("for table in result is::::::::::::::::",table,file=sys.stderr)
            for record in table.records:
                print("record is:::::::::::::::::::::",record,file=sys.stderr)
                try:
                    interface_record = GetDevicesInterfaceRecordSchema(
                        ip_address = record["IP_ADDRESS"],
                        device_name = record["DEVICE_NAME"],
                        function = record["FUNCTION"],
                        interface_status = record["Status"],
                        vendor = record["VENDOR"],
                        download_speed = round(float(record["Download"] or 0), 2),
                        upload_speed = round(float(record["Upload"] or 0), 2),
                        interface_name = record["Interface_Name"],
                        interface_description = record["Interface Description"],
                        date = record["Date"],
                        device_type = record["DEVICE_TYPE"]
                    )
                    interface_records.append(interface_record)
                except Exception as e:
                    print(f"Error while processing record: {str(e)}", file=sys.stderr)
                    continue
        print("interrface record is:::::::::::::::::::::::::",interface_records,file=sys.stderr)
        # Filter unique InterfaceRecords based on 'interface_name'
        final_interfaces = list({record.interface_name: record for record in interface_records}.values())
        print("final interface is:::::::::::::::::::::::",final_interfaces,file=sys.stderr)
        if final_interfaces is None:
            interfaces = [
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Lo0',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'Loopback0'
                },
                {
                    'ip_address': '192.168.10.45',
                    'device_name': 'NSO-SW1.nets-international.com',
                    'interface_name': 'Nu0',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'Null0'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Vo0',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'VoIP-Null0'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi4',
                    'interface_status': 'Up',
                    'upload_speed': 1,
                    'download_speed': 1,
                    'interface_description': 'GigabitEthernet4'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi3',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet3'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi2',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet2'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi1',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0.01,
                    'interface_description': 'GigabitEthernet1'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi6',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet6'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi5',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet5'
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'NETS-HO-To-AWS',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'VLAN112',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },

                # Add more interfaces here...
            ]
            return interfaces
        else:
            return final_interfaces

    except Exception as e:
        configs.db.rollback()
        traceback.print_exc()
        print(f"Error occurred: {str(e)}", file=sys.stderr)
        raise JSONResponse(status_code=500, detail="Internal Server Error")


@router.get('/get_all_devices_in_router',
            responses={
              200:{"model":list[GetMonitoringNetworkDevicesSchema]},
              500:{"model":str}
            },
            summary="Use this API in Monitoring ==>Netowrk==>Router==>devices.Use this API in the monitoring netowrk page to list down the devices in the table of router",
            description="Use this API in Monitoring ==>Netowrk==>Router==>devices.Use this API in the monitoring netowrk page to list down the devices in the table of router",
)
def get_all_devices_in_router():
    try:
        query_api = configs.client.query_api()
        query = f'import "strings"\
                    import "influxdata/influxdb/schema"\
                    from(bucket: "monitoring")\
                    |> range(start: -60d)\
                    |> filter(fn: (r) => r["_measurement"] == "Devices")\
                    |> filter(fn: (r) => r["FUNCTION"] == "Router")\
                    |> last()\
                    |> schema.fieldsAsCols()'

        result = query_api.query(org='monetx', query=query)
        print("result is::::::::::::::::::",result,file=sys.stderr)
        results = []
        for table in result:
            print("table in result is:::::::::::::",table,file=sys.stderr)
            for record in table.records:
                print("record is::::::::",record,file=sys.stderr)
                try:
                    router_devices_Record = GetMonitoringNetworkDevicesSchema(
                        ip_address = record["IP_ADDRESS"],
                        function = record["FUNCTION"],
                        response = record["Response"],
                        status = record["STATUS"],
                        uptime = record["Uptime"],
                        vendor = record["VENDOR"],
                        cpu = record["CPU"],
                        memory = record["Memory"],
                        packets = record["PACKETS_LOSS"],
                        device_name = record["DEVICE_NAME"],
                        interfaces = record["INTERFACES"],
                        date = record["Date"],
                        device_description = record["DEVICE_DESCRIPTION"],
                        discovered_time = record["DISCOVERED_TIME"],
                        device_type = record["DEVICE_TYPE"]

                    )
                    results.append(router_devices_Record)
                except Exception as e:
                    print("Error:::",str(e),file=sys.stderr)
                    traceback.print_exc()
        final = sorted(results, key=lambda k: k['date'], reverse=False)
        print("final is::::::::::::::::::",final,file=sys.stderr)
        final_list = list({v['ip_address']: v for v in final}.values())
        print(results, file=sys.stderr)
        print("final list is:::::::::::::::::::::::::",final_list,file=sys.stderr)
        if final_list is None:
            devices = [
                {
                    'ip_address': '192.168.0.1',
                    'device_type': 'cisco_ios',
                    'device_name': 'NETS-inside-C2960.nets-international.local',
                    'vendor': 'Cisco',
                    'total_interfaces': '1',
                    'function': 'Up',
                    'status': '2024-03-01 06:07:42.844870',
                    'discovered_time': 'Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 12.2(44)SE6, RELEASE SOFTWARE (fc1) Copyright (c) 1986-2009 by Cisco Systems, Inc. Compiled Mon 09-Mar-09 18:10 by gereddy',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.0.45',
                    'device_type': 'fortinet',
                    'device_name': 'FG-NETS.nets-international.local',
                    'vendor': 'Cisco',
                    'total_interfaces': '23',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.294215',
                    'discovered_time': 'FGT-IMS',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.45',
                    'device_type': 'cisco_ios',
                    'device_name': 'NSO-SW1.nets-international.com',
                    'vendor': 'Cisco',
                    'total_interfaces': '23',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.489963',
                    'discovered_time': 'Cisco IOS Software, Linux Software (I86BI_LINUXL2-ADVENTERPRISEK9-M), Version 15.2(CML_NIGHTLY_20190423)FLO_DSGS7, EARLY DEPLOYMENT DEVELOPMENT BUILD, synced to V152_6_0_81_E Technical Support: http://www.cisco.com/techsupport Copyright (c) 1986-2019 b',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_type': 'cisco_ios',
                    'device_name': 'CSR6.nets-international.com',
                    'vendor': 'Cisco',
                    'total_interfaces': '12',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.565425',
                    'discovered_time': 'Cisco IOS Software [Gibraltar], Virtual XE Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 16.12.5, RELEASE SOFTWARE (fc3) Technical Support: http://www.cisco.com/techsupport Copyright (c) 1986-2021 by Cisco Systems, Inc. Compiled Fri 29-Jan-21 12:',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.25',
                    'device_type': 'cisco_ios_xe',
                    'device_name': 'NSOIOSXR4',
                    'vendor': 'Cisco',
                    'total_interfaces': '10',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.630048',
                    'discovered_time': 'Cisco IOS XR Software (Cisco IOS XRv Series), Version 6.1.2[Default] Copyright (c) 2016 by Cisco Systems, Inc.',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.43',
                    'device_type': 'cisco_ios',
                    'device_name': 'CSR5.nets-international.com',
                    'vendor': 'Cisco',
                    'total_interfaces': '12',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.652814',
                    'discovered_time': 'Cisco IOS Software [Gibraltar], Virtual XE Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 16.12.5, RELEASE SOFTWARE (fc3) Technical Support: http://www.cisco.com/techsupport Copyright (c) 1986-2021 by Cisco Systems, Inc. Compiled Fri 29-Jan-21 12:',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.28',
                    'device_type': 'cisco_ios',
                    'device_name': 'NSOIOSXR2',
                    'vendor': 'Cisco',
                    'total_interfaces': '4',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.688015',
                    'discovered_time': 'Cisco IOS XR Software (Cisco IOS XRv Series), Version 6.1.2[Default] Copyright (c) 2016 by Cisco Systems, Inc.',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.50',
                    'device_type': 'cisco_ios',
                    'device_name': 'NSO-R50.nets-international.com',
                    'vendor': 'Cisco',
                    'total_interfaces': '3',
                    'function': '',
                    'status': '',
                    'discovered_time': '',
                    'device_description': ''
                }
            ]
            return devices
        else:
            return final_list
    except Exception as e:
        configs.db.rollback()
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Getting Network Devices",status_code=500)


@router.get('/get_all_devices_interfaces_in_routers',
            responses={
                200:{"model":list[GetDevicesInterfaceRecordSchema]},
                500:{"model":str}
            },
            summary="use this api in monitoring network=>devices=>interfaces to list down all devices interfaces in table",
            description="use this api in monitoring network=>devices=>interfaces to list down all devices interfaces in table"

)
async def get_all_interfaces_in_routers():
    try:
        router_interface_records = []
        query_api = configs.client.query_api()
        query = f'import "strings"\
        import "influxdata/influxdb/schema"\
        from(bucket: "monitoring")\
        |> range(start: -60d)\
        |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
        |> filter(fn: (r) => r["FUNCTION"] == "Router")\
        |> schema.fieldsAsCols()\
        |> sort(columns: ["_time"], desc: true)\
        |> unique(column: "Interface_Name")\
        |> yield(name: "unique")'
        result = query_api.query(org='monetx', query=query)
        results = []
        for table in result:
            print("for table in result is::::::::::::::::",table,file=sys.stderr)
            for record in table.records:
                print("record is:::::::::::::::::::::",record,file=sys.stderr)
                try:
                    router_interface_record = GetDevicesInterfaceRecordSchema(
                        ip_address = record["IP_ADDRESS"],
                        device_name = record["DEVICE_NAME"],
                        function = record["FUNCTION"],
                        interface_status = record["Status"],
                        vendor = record["VENDOR"],
                        download_speed = round(float(record["Download"] or 0), 2),
                        upload_speed = round(float(record["Upload"] or 0), 2),
                        interface_name = record["Interface_Name"],
                        interface_description = record["Interface Description"],
                        date = record["Date"],
                        device_type = record["DEVICE_TYPE"]
                    )
                    router_interface_records.append(router_interface_record)
                except Exception as e:
                    print(f"Error while processing record: {str(e)}", file=sys.stderr)
                    continue
        interface_dict = {record.interface_name: record.dict() for record in router_interface_records}
        final_interfaces = list(interface_dict.values())
        if final_interfaces is None:
            interfaces = [
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Lo0',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'Loopback0'
                },
                {
                    'ip_address': '192.168.10.45',
                    'device_name': 'NSO-SW1.nets-international.com',
                    'interface_name': 'Nu0',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'Null0'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Vo0',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'VoIP-Null0'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi4',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet4'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi3',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet3'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi2',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet2'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi1',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0.01,
                    'interface_description': 'GigabitEthernet1'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi6',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet6'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi5',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet5'
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'NETS-HO-To-AWS',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'VLAN112',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                # Add more interfaces here...
            ]
            return interfaces

        print(final_interfaces, file=sys.stderr)
        return JSONResponse(content = final_interfaces,status_code=200)

    except Exception as e:
        configs.db.rollback()
        print("Error ",str(e),file=sys.stderr)
        traceback.print_exc()
        return JSONResponse("Error Ocucred while getting Router interfaces",status_code=500)


@router.get('/get_all_devices_in_switch',
            responses={
              200:{"model":list[GetMonitoringNetworkDevicesSchema]},
              500:{"model":str}
            },
            summary="Use this API in Monitoring ==>Netowrk==>Switch==>devices.Use this API in the monitoring netowrk page to list down the devices in the table of router",
            description="Use this API in Monitoring ==>Netowrk==>Switch==>devices.Use this API in the monitoring netowrk page to list down the devices in the table of router",
)
def get_all_devices_in_switch():
    try:
        query_api = configs.client.query_api()
        query = f'import "strings"\
                    import "influxdata/influxdb/schema"\
                    from(bucket: "monitoring")\
                    |> range(start: -60d)\
                    |> filter(fn: (r) => r["_measurement"] == "Devices")\
                    |> filter(fn: (r) => r["FUNCTION"] == "Switch")\
                    |> last()\
                    |> schema.fieldsAsCols()'

        result = query_api.query(org='monetx', query=query)
        print("result is::::::::::::::::::",result,file=sys.stderr)
        results = []
        for table in result:
            print("table in result is:::::::::::::",table,file=sys.stderr)
            for record in table.records:
                print("record is::::::::",record,file=sys.stderr)
                try:
                    switch_devices_record = GetMonitoringNetworkDevicesSchema(
                    ip_address = record["IP_ADDRESS"],
                    function = record["FUNCTION"],
                    response = record["Response"],
                    status = record["STATUS"],
                    uptime = record["Uptime"],
                    vendor = record["VENDOR"],
                    cpu = record["CPU"],
                    memory = record["Memory"],
                    packets = record["PACKETS_LOSS"],
                    device_name = record["DEVICE_NAME"],
                    interfaces = record["INTERFACES"],
                    date = record["Date"],
                    device_description = record["DEVICE_DESCRIPTION"],
                    discovered_time = record["DISCOVERED_TIME"],
                    device_type = record["DEVICE_TYPE"]
                    )
                    results.append(switch_devices_record)
                except Exception as e:
                    print("Error:::",str(e),file=sys.stderr)
                    traceback.print_exc()
        final = sorted(results, key=lambda k: k['date'], reverse=False)
        print("final is::::::::::::::::::",final,file=sys.stderr)
        final_list = list({v['ip_address']: v for v in final}.values())
        print(results, file=sys.stderr)
        print("final list is:::::::::::::::::::::::::",final_list,file=sys.stderr)
        if final_list is None:
            devices = [
                {
                    'ip_address': '192.168.0.5',
                    'device_type': 'cisco_ios',
                    'device_name': 'NETS-inside-C2960.nets-international.local',
                    'vendor': 'Cisco',
                    'total_interfaces': '2',
                    'function': 'Up',
                    'status': '2024-03-01 06:07:42.844870',
                    'discovered_time': 'Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 12.2(44)SE6, RELEASE SOFTWARE (fc1) Copyright (c) 1986-2009 by Cisco Systems, Inc. Compiled Mon 09-Mar-09 18:10 by gereddy',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_type': 'fortinet',
                    'device_name': 'FG-NETS.nets-international.local',
                    'vendor': 'Cisco',
                    'total_interfaces': '34',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.294215',
                    'discovered_time': 'FGT-IMS',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.45',
                    'device_type': 'cisco_ios',
                    'device_name': 'NSO-SW1.nets-international.com',
                    'vendor': 'Cisco',
                    'total_interfaces': '21',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.489963',
                    'discovered_time': 'Cisco IOS Software, Linux Software (I86BI_LINUXL2-ADVENTERPRISEK9-M), Version 15.2(CML_NIGHTLY_20190423)FLO_DSGS7, EARLY DEPLOYMENT DEVELOPMENT BUILD, synced to V152_6_0_81_E Technical Support: http://www.cisco.com/techsupport Copyright (c) 1986-2019 b',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_type': 'cisco_ios',
                    'device_name': 'CSR6.nets-international.com',
                    'vendor': 'Cisco',
                    'total_interfaces': '23',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.565425',
                    'discovered_time': 'Cisco IOS Software [Gibraltar], Virtual XE Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 16.12.5, RELEASE SOFTWARE (fc3) Technical Support: http://www.cisco.com/techsupport Copyright (c) 1986-2021 by Cisco Systems, Inc. Compiled Fri 29-Jan-21 12:',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.25',
                    'device_type': 'cisco_ios_xe',
                    'device_name': 'NSOIOSXR4',
                    'vendor': 'Cisco',
                    'total_interfaces': '12',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.630048',
                    'discovered_time': 'Cisco IOS XR Software (Cisco IOS XRv Series), Version 6.1.2[Default] Copyright (c) 2016 by Cisco Systems, Inc.',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.43',
                    'device_type': 'cisco_ios',
                    'device_name': 'CSR5.nets-international.com',
                    'vendor': 'Cisco',
                    'total_interfaces': '10',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.652814',
                    'discovered_time': 'Cisco IOS Software [Gibraltar], Virtual XE Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 16.12.5, RELEASE SOFTWARE (fc3) Technical Support: http://www.cisco.com/techsupport Copyright (c) 1986-2021 by Cisco Systems, Inc. Compiled Fri 29-Jan-21 12:',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.28',
                    'device_type': 'cisco_ios',
                    'device_name': 'NSOIOSXR2',
                    'vendor': 'Cisco',
                    'total_interfaces': '21',
                    'function': 'Up',
                    'status': '2024-03-04 23:44:45.688015',
                    'discovered_time': 'Cisco IOS XR Software (Cisco IOS XRv Series), Version 6.1.2[Default] Copyright (c) 2016 by Cisco Systems, Inc.',
                    'device_description': ''
                },
                {
                    'ip_address': '192.168.10.50',
                    'device_type': 'cisco_ios',
                    'device_name': 'NSO-R50.nets-international.com',
                    'vendor': 'Cisco',
                    'total_interfaces': '43',
                    'function': '',
                    'status': '',
                    'discovered_time': '',
                    'device_description': ''
                }
            ]
            return devices
        else:
            return final_list
    except Exception as e:
        configs.db.rollback()
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Getting Network switch Devices",status_code=500)


@router.get('/get_all_devices_interfaces_in_switch',
            responses={
                200:{"model":list[GetDevicesInterfaceRecordSchema]},
                500:{"model":str}
            },
            summary="use this api in monitoring network=>Switch=>interfaces to list down all switch devices interfaces in table",
            description="use this api in monitoring network=>Switch=>interfaces to list down all switch devices interfaces in table"

)
async def get_all_interfaces_in_switch():
    try:
        router_interface_records = []
        query_api = configs.client.query_api()
        query = f'import "strings"\
               import "influxdata/influxdb/schema"\
               from(bucket: "monitoring")\
               |> range(start: -60d)\
               |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
               |> filter(fn: (r) => r["FUNCTION"] == "Switch")\
               |> schema.fieldsAsCols()\
               |> sort(columns: ["_time"], desc: true)\
               |> unique(column: "Interface_Name")\
               |> yield(name: "unique")'
        result = query_api.query(org='monetx', query=query)
        results = []
        for table in result:
            print("for table in result is::::::::::::::::",table,file=sys.stderr)
            for record in table.records:
                print("record is:::::::::::::::::::::",record,file=sys.stderr)
                try:
                    router_interface_record = GetDevicesInterfaceRecordSchema(
                        ip_address = record["IP_ADDRESS"],
                        device_name = record["DEVICE_NAME"],
                        function = record["FUNCTION"],
                        interface_status = record["Status"],
                        vendor = record["VENDOR"],
                        download_speed = round(float(record["Download"] or 0), 2),
                        upload_speed = round(float(record["Upload"] or 0), 2),
                        interface_name = record["Interface_Name"],
                        interface_description = record["Interface Description"],
                        date = record["Date"],
                        device_type = record["DEVICE_TYPE"]
                    )
                    router_interface_records.append(router_interface_record)
                except Exception as e:
                    print(f"Error while processing record: {str(e)}", file=sys.stderr)
                    continue
        interface_dict = {record.interface_name: record.dict() for record in router_interface_records}
        final_interfaces = list(interface_dict.values())
        if final_interfaces is not None:
            interfaces = [
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Lo0',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'Loopback0'
                },
                {
                    'ip_address': '192.168.10.45',
                    'device_name': 'NSO-SW1.nets-international.com',
                    'interface_name': 'Nu0',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'Null0'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Vo0',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'VoIP-Null0'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi4',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet4'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi3',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet3'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi2',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet2'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi1',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0.01,
                    'interface_description': 'GigabitEthernet1'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi6',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet6'
                },
                {
                    'ip_address': '192.168.10.44',
                    'device_name': 'CSR6.nets-international.com',
                    'interface_name': 'Gi5',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': 'GigabitEthernet5'
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'NETS-HO-To-AWS',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'VLAN112',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                # Add more interfaces here...
            ]
            return interfaces
        else:
            print(final_interfaces, file=sys.stderr)
            return JSONResponse(content = final_interfaces,status_code=200)

    except Exception as e:
        configs.db.rollback()
        print("Error ",str(e),file=sys.stderr)
        traceback.print_exc()
        return JSONResponse("Error Ocucred while getting Switch interfaces",status_code=500)


@router.get('/get_all_devices_in_firewall',
            responses={
              200:{"model":list[GetMonitoringNetworkDevicesSchema]},
              500:{"model":str}
            },
            summary="Use this API in Monitoring ==>Netowrk==>FireWall==>devices.Use this API in the monitoring netowrk page to list down the devices in the table of Firewall",
            description="Use this API in Monitoring ==>Netowrk==>Firewall==>devices.Use this API in the monitoring netowrk page to list down the interface  in the table of interface Firewall",
)
def get_all_devices_in_firewall():
    try:
        query_api = configs.client.query_api()
        query = f'import "strings"\
                   import "influxdata/influxdb/schema"\
                   from(bucket: "monitoring")\
                   |> range(start: -60d)\
                   |> filter(fn: (r) => r["_measurement"] == "Devices")\
                   |> filter(fn: (r) => r["FUNCTION"] == "Firewall")\
                   |> last()\
                   |> schema.fieldsAsCols()'

        result = query_api.query(org='monetx', query=query)
        print("result is::::::::::::::::::",result,file=sys.stderr)
        results = []
        for table in result:
            print("table in result is:::::::::::::",table,file=sys.stderr)
            for record in table.records:
                print("record is::::::::",record,file=sys.stderr)
                try:
                    switch_devices_record = GetMonitoringNetworkDevicesSchema(
                        ip_address = record["IP_ADDRESS"],
                        function = record["FUNCTION"],
                        response = record["Response"],
                        status = record["STATUS"],
                        uptime = record["Uptime"],
                        vendor = record["VENDOR"],
                        cpu = record["CPU"],
                        memory = record["Memory"],
                        packets = record["PACKETS_LOSS"],
                        device_name = record["DEVICE_NAME"],
                        interfaces = record["INTERFACES"],
                        date = record["Date"],
                        device_description = record["DEVICE_DESCRIPTION"],
                        discovered_time = record["DISCOVERED_TIME"],
                        device_type = record["DEVICE_TYPE"]
                    )
                    results.append(switch_devices_record)
                except Exception as e:
                    print("Error:::",str(e),file=sys.stderr)
                    traceback.print_exc()
        final = sorted(results, key=lambda k: k['date'], reverse=False)
        print("final is::::::::::::::::::",final,file=sys.stderr)
        final_list = list({v['ip_address']: v for v in final}.values())
        print(results, file=sys.stderr)
        print("final list is:::::::::::::::::::::::::",final_list,file=sys.stderr)
        if final_list is None:
            device = {
                'ip_address': '192.168.0.2',
                'device_type': 'fortinet',
                'device_name': 'FG-NETS.nets-international.local',
                'vendor': 'Cisco',
                'total_interfaces': 'Firewall',
                'function': 'Up',
                'status': '2024-03-04 23:44:45.294215',
                'discovered_time': 'FGT-IMS'
            }
            return device
        else:
            return final_list
    except Exception as e:
        configs.db.rollback()
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Getting Network Devices",status_code=500)


@router.get('/get_all_devices_interfaces_in_firewall',
            responses={
                200:{"model":list[GetDevicesInterfaceRecordSchema]},
                500:{"model":str}
            },
            summary="use this api in monitoring network=>Firewall=>interfaces to list down all firewall devices in table",
            description="use this api in monitoring network=>Firewall=>interfaces to list down all firewall interfaces in table",

)
async def get_all_interfaces_in_firewall():
    try:
        router_interface_records = []
        query_api = configs.client.query_api()
        query = f'import "strings"\
                import "influxdata/influxdb/schema"\
                from(bucket: "monitoring")\
                |> range(start: -60d)\
                |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
                |> filter(fn: (r) => r["FUNCTION"] == "Firewall")\
                |> schema.fieldsAsCols()\
                |> sort(columns: ["_time"], desc: true)\
                |> unique(column: "Interface_Name")\
                |> yield(name: "unique")'
        result = query_api.query(org='monetx', query=query)
        results = []
        for table in result:
            print("for table in result is::::::::::::::::",table,file=sys.stderr)
            for record in table.records:
                print("record is:::::::::::::::::::::",record,file=sys.stderr)
                try:
                    router_interface_record = GetDevicesInterfaceRecordSchema(
                        ip_address = record["IP_ADDRESS"],
                        device_name = record["DEVICE_NAME"],
                        function = record["FUNCTION"],
                        interface_status = record["Status"],
                        vendor = record["VENDOR"],
                        download_speed = round(float(record["Download"] or 0), 2),
                        upload_speed = round(float(record["Upload"] or 0), 2),
                        interface_name = record["Interface_Name"],
                        interface_description = record["Interface Description"],
                        date = record["Date"],
                        device_type = record["DEVICE_TYPE"]
                    )
                    router_interface_records.append(router_interface_record)
                except Exception as e:
                    print(f"Error while processing record: {str(e)}", file=sys.stderr)
                    continue
        interface_dict = {record.interface_name: record.dict() for record in router_interface_records}
        final_interfaces = list(interface_dict.values())
        if final_interfaces is None:
            interfaces = [
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'NETS-HO-To-AWS',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'VLAN112',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'VLAN111',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'TestEtherch',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'VLAN146-2',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'VLAN148',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'vlan146',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'vlan_146',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'test1',
                    'interface_status': 'Down',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                },
                {
                    'ip_address': '192.168.0.2',
                    'device_name': 'FG-NETS.nets-international.local',
                    'interface_name': 'vlan_100',
                    'interface_status': 'Up',
                    'upload_speed': 0,
                    'download_speed': 0,
                    'interface_description': ''
                }
            ]
            return interfaces
        else:
            print(final_interfaces, file=sys.stderr)
            return JSONResponse(content = final_interfaces,status_code=200)

    except Exception as e:
        configs.db.rollback()
        print("Error ",str(e),file=sys.stderr)
        traceback.print_exc()
        return JSONResponse("Error Ocucred while getting Firewall interfaces",status_code=500)




@router.get('/get_all_devices_in_wireless',
            responses={
              200:{"model":list[GetMonitoringNetworkDevicesSchema]},
              500:{"model":str}
            },
            summary="Use this API in Monitoring ==>Netowrk==>Wireless==>devices.Use this API in the monitoring netowrk page to list down the devices in the table of Wireless",
            description="Use this API in Monitoring ==>Netowrk==>Wireless==>devices.Use this API in the monitoring netowrk page to list down the devices in the table of Wireless",
)
def get_all_devices_in_wireless():
    try:
        query_api = configs.client.query_api()
        query = f'import "strings"\
                    import "influxdata/influxdb/schema"\
                    from(bucket: "monitoring")\
                    |> range(start: -60d)\
                    |> filter(fn: (r) => r["_measurement"] == "Devices")\
                    |> filter(fn: (r) => r["FUNCTION"] == "Wireless")\
                    |> last()\
                    |> schema.fieldsAsCols()'

        result = query_api.query(org='monetx', query=query)
        print("result is::::::::::::::::::",result,file=sys.stderr)
        results = []
        for table in result:
            print("table in result is:::::::::::::",table,file=sys.stderr)
            for record in table.records:
                print("record is::::::::",record,file=sys.stderr)
                try:
                    switch_devices_record = GetMonitoringNetworkDevicesSchema(
                        ip_address = record["IP_ADDRESS"],
                        function = record["FUNCTION"],
                        response = record["Response"],
                        status = record["STATUS"],
                        uptime = record["Uptime"],
                        vendor = record["VENDOR"],
                        cpu = record["CPU"],
                        memory = record["Memory"],
                        packets = record["PACKETS_LOSS"],
                        device_name = record["DEVICE_NAME"],
                        interfaces = record["INTERFACES"],
                        date = record["Date"],
                        device_description = record["DEVICE_DESCRIPTION"],
                        discovered_time = record["DISCOVERED_TIME"],
                        device_type = record["DEVICE_TYPE"]
                    )
                    results.append(switch_devices_record)
                except Exception as e:
                    print("Error:::",str(e),file=sys.stderr)
                    traceback.print_exc()
        final = sorted(results, key=lambda k: k['date'], reverse=False)
        print("final is::::::::::::::::::",final,file=sys.stderr)
        final_list = list({v['ip_address']: v for v in final}.values())
        print(results, file=sys.stderr)
        print("final list is:::::::::::::::::::::::::",final_list,file=sys.stderr)
        return final_list
    except Exception as e:
        configs.db.rollback()
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Getting Network Devices",status_code=500)


@router.get('/get_all_devices_interfaces_in_wireless',
            responses={
                200:{"model":list[GetDevicesInterfaceRecordSchema]},
                500:{"model":str}
            },
            summary="use this api in monitoring network=>Wireless=>interfaces to list down all Wireless devices  in table",
            description="use this api in monitoring network=>Wireless=>interfaces to list down all Wireless interfaces  in table",

)
async def get_all_interfaces_in_wireless():
    try:
        router_interface_records = []
        query_api = configs.client.query_api()
        query = f'import "strings"\
                import "influxdata/influxdb/schema"\
                from(bucket: "monitoring")\
                |> range(start: -60d)\
                |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
                |> filter(fn: (r) => r["FUNCTION"] == "Wireless")\
                |> schema.fieldsAsCols()\
                |> sort(columns: ["_time"], desc: true)\
                |> unique(column: "Interface_Name")\
                |> yield(name: "unique")'
        result = query_api.query(org='monetx', query=query)
        results = []
        for table in result:
            print("for table in result is::::::::::::::::",table,file=sys.stderr)
            for record in table.records:
                print("record is:::::::::::::::::::::",record,file=sys.stderr)
                try:
                    router_interface_record = GetDevicesInterfaceRecordSchema(
                        ip_address = record["IP_ADDRESS"],
                        device_name = record["DEVICE_NAME"],
                        function = record["FUNCTION"],
                        interface_status = record["Status"],
                        vendor = record["VENDOR"],
                        download_speed = round(float(record["Download"] or 0), 2),
                        upload_speed = round(float(record["Upload"] or 0), 2),
                        interface_name = record["Interface_Name"],
                        interface_description = record["Interface Description"],
                        date = record["Date"],
                        device_type = record["DEVICE_TYPE"]
                    )
                    router_interface_records.append(router_interface_record)
                except Exception as e:
                    print(f"Error while processing record: {str(e)}", file=sys.stderr)
                    continue
        interface_dict = {record.interface_name: record.dict() for record in router_interface_records}
        final_interfaces = list(interface_dict.values())

        print(final_interfaces, file=sys.stderr)
        return JSONResponse(content = final_interfaces,status_code=200)

    except Exception as e:
        configs.db.rollback()
        print("Error ",str(e),file=sys.stderr)
        traceback.print_exc()
        return JSONResponse("Error Ocucred while getting Wireless interfaces",status_code=500)
