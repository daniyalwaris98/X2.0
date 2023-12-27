from app.models.ipam_models import *
from app.api.v1.ipam.utils import *
from app.api.v1.ipam.routes.device_routes import *
from app.api.v1.ipam.utils.ipam_utils import *
from app.models.common_models import *
import sys
import traceback
from app.models.ipam_models import *
from app.schema.ipam_schema import *
from app.schema.base_schema import *
# from app.schema.
from app.schema.ipam_schema import *
from app.core.config import configs
from app.models.atom_models import *
from app.utils.db_utils import *
import threading
import subprocess
# from ping3 import ping, verbose_ping
import os
from subprocess import *
import re
import gzip
import json
from fastapi.responses import JSONResponse
import base64
import socket
import nmap
from netaddr import IPNetwork
import platform
from app.models.uam_models import *
from io import BytesIO
# from app.ipam_scripts.f5 import F5
# from app.ipam_scripts.fortigate_vip import FORTIGATEVIP
# from app.ipam_scripts.ipam import IPAM
# from app.ipam_scripts.ipam_physical_mapping import IPAMPM
from fastapi import FastAPI,APIRouter,Query
from starlette.responses import Response
from fastapi.responses import JSONResponse
router = APIRouter(
    prefix = '/ipam_device',
    tags = ['ipam_device']
)


@router.get('/test')
def test_route():
    try:
        return {"messgae":"This is testing routes"}
    except Exception as e:
        traceback.print_exc()

@router.get('/get_atom_in_ipam',
            responses = {
                200:{"model":list[GetAtomInIpamSchema]},
                400:{"model":str},
                500:{"model":str}
            },
            summary="Use this API in IPAM devices page to list down all the atom the atoms in add device from atom.This API is of get method",
            description="Use this API in IPAM devices page to list down all the atom the atoms in add device from atom.This API is of get method"
            )
def get_atom_in_ipam():
    try:
        atom_list = []
        atom_exist = configs.db.query(AtomTable).all()

        for atom in atom_exist:
            ipam_atom = configs.db.query(IpamDevicesFetchTable).filter_by(atom_id=atom.atom_id).first()
            if not ipam_atom:
                atom_obj = {
                    "atom_id": atom.atom_id,
                    "ip_address":atom.ip_address,
                    "device_name": atom.device_name,
                    "function": atom.function,
                    "vendor": atom.vendor,
                    "on_board_status":atom.onboard_status
                }
                atom_list.append(atom_obj)

        return JSONResponse(content=atom_list, status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Getting Atom In Ipam", status_code=500)


@router.post('/add_atom_in_ipam',responses={
    200:{"model":SummeryResponseSchema},
    400:{"model":str},
    500:{"model":str}
},
summary="API to add atom in IPAM",
description="API to add atom in IPAM"
)
async def add_atom_in_ipam(ipam_obj: list[int]):
    try:
        data = []
        success_lst = []
        error_list = []
        for atom_data in ipam_obj:
            atom_id = atom_data
            print("atom_id is:", atom_id, file=sys.stderr)
            # atom_ip = configs.db.query(AtomTable).filter_by(atom_id = atom_id).first=()
            # ip_address = atom_ip.ip_address
            # print("ip address is::::",ip_address,file=sys.stderr)
            # failed_ip = configs.db.query(FailedDevicesTable).filter_by(ip_address = ip_address).first()
            # if failed_ip:
            #     error_list.append(f"{failed_ip.ip_address} : failed due to {failed_ip.failure_reason}")
            # else:

            atom_exists = configs.db.query(IpamDevicesFetchTable).filter_by(atom_id=atom_id).first()

            if atom_exists:
                pass
                return JSONResponse(status_code=400, content="Atom Already Exists")
            else:
                new_atom = IpamDevicesFetchTable(atom_id=atom_id)  # Create a new atom object
                print("new atom is ::::::::::::::",new_atom,file=sys.stderr)
                print("Atom added to the IPAM devices fetch table", file=sys.stderr)
                from app.api.v1.ipam.utils.ipam_utils import FetchIpamDevices
                resposne = FetchIpamDevices(atom_id)

                print("repsonse of the fetch ipam devices is::::",resposne,file=sys.stderr)
        return JSONResponse(content = "Atom Added ",status_code=200)

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content="Error Occurred While Adding Atom in IPAM")


@router.get('/get_all_ipam_devices',
            responses={
                200: {"model": list[GetIpamDevicesSchema]},
                400: {"model": str},
                500: {"model": str}
            },
            summary = "Use This API to list down all the IPAM devices in a table",
            description="Use This API to list down all the IPAM devices in a table"
            )
def get_ipam_fetch_devices():
    try:
        devices_list =[]
        ipam_devices = configs.db.query(IpamDevicesFetchTable).all()
        for devices in ipam_devices:
            interfaces = configs.db.query(ip_interface_table).filter_by(ipam_device_id = devices.ipam_device_id).first()
            subnet = configs.db.query(subnet_table).filter_by(ipam_device_id = devices.ipam_device_id).first()
            subnet_usage = configs.db.query(subnet_usage_table).filter_by(subnet_id = subnet.subnet_id).first()
            devices_dict = {
                "ipam_device_id":devices.ipam_device_id,
                "interface":devices.interface,
                "interface_ip":devices.interface_ip,
                "interface_descripton":devices.interface_description,
                "virtual_ip":devices.virtual_ip,
                "vlan":devices.vlan,
                "vlan_number":devices.vlan_number,
                "interface_status":devices.interface_status,
                "fetch_date":devices.fetch_date,
                "interface_location":interfaces.interface_location,
                "discovered_from":interfaces.discovered_from,
                "interface_ststus":interfaces.interface_status,
                "subnet":subnet.subnet_address,
                "subnet_mask":subnet.subnet_mask,
                "subnet_name":subnet.subnet_name,
                "scan_date":subnet.scan_date,
                "subnet_usage":subnet_usage.subnet_usage,
                "subnet_size":subnet_usage.subnet_size
            }
            devices_list.append(devices_dict)
        return devices_list
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Getting IPAM devices",status_code=500)

@router.post('/add_subnet',responses={
    200:{"model":Response200},
    400:{"model":str},
    500:{"model":str}
},
summary="Use this API to add subnet mnaually",
             description="Use this API to add subnet mnaually"
)
def add_subnet(subnetObj:AddSubnetManually):
    try:
        subnet_list =[]
        subnet_obj = dict(subnetObj)
        print("subnet obj is :::::",file=sys.stderr)
        subnet_exsist = configs.db.query(subnet_table).filter_by(subnet_address = subnet_obj['subnet']).firsst()
        if subnet_exsist:
            return JSONResponse(content=f"{subnet_obj['subnet']} : ALready Exsists",status_code=400)
        else:
            subnet_tab = subnet_table()
            subnet_tab.subnet_address = subnet_obj['subnet']
            subnet_tab.subnet_mask = subnet_obj['subnet_mask']
            subnet_tab.subnet_name = subnet_obj['subnet_name']
            subnet_tab.location =- subnet_obj['location']
            subnet_tab.discovered = 'Not Discovered'
            InsertDBData(subnet_tab)
            subnet_dict = {
                "subnet_id":subnet_tab.subnet_id,
                "subnet_mask":subnet_tab.subnet_mask,
                "subnet": subnet_tab.subnet_address,
                "subnet_name":subnet_tab.subnet_name,
                "location":subnet_tab.location,
                "discovered":subnet_tab.discovered
            }
            subnet_list.append(subnet_dict)
        return JSONResponse(content=subnet_list,status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While adding the subenrt",status_code=500)

@router.post('/addsubnetinsubnet',
             responses={
                 200:{"model":str},
                 400:{"model":str},
                500:{"model":str}
             }
             )
def AddSusbnetInSunet(data:list[AddSubnetInSubnetSchema]):
    try:
        for subnet in data:
            subnet_address = subnet.subnet

            query = (
                configs.db.query(AtomTable.device_name)
                .join(IpamDevicesFetchTable, AtomTable.atom_id == IpamDevicesFetchTable.atom_id)
                .filter(IpamDevicesFetchTable.ipam_device_id == subnet_table.ipam_device_id)
                .distinct()
                .all()
            )

            print("query is:::::::::::",query,file=sys.stderr)
            if query:
                for row in query:
                    print("row is::::::",row,file=sys.stderr)
                    subnet_data = (
                        configs.db.query(subnet_table)
                        .filter_by(discovered_from=row.device_name)
                        .first()
                    )

                    if subnet_data:
                        print("subnet adta is:::::",subnet_data,file=sys.stderr)
                        subnet_usage = (
                            configs.db.query(subnet_usage_table)
                            .filter_by(subnet_id=subnet_data.subnet_id)
                            .first()
                        )

                        if subnet_usage:
                            print("subnet usage is::::",subnet_usage,file=sys.stderr)
                            subnet_usage.subnet_size = subnet_usage.subnet_size
                            subnet_usage.subnet_usage = subnet_usage.subnet_usage

                        subnet_data.discovered_from = row.device_name
                        subnet_data.status = 'Waiting'
                        subnet_data.scan_date = datetime.now()

                        existing_subnet = (
                            configs.db.query(subnet_table)
                            .filter_by(subnet_address=subnet_address)
                            .first()
                        )

                        if existing_subnet:
                            print("exisiting subnet is:::::::::",existing_subnet,file=sys.stderr)
                            existing_subnet.subnet_mask = subnet_data.subnet_mask
                            existing_subnet.subnet_name = subnet_data.subnet_name
                            existing_subnet.location = subnet_data.location
                            existing_subnet.discovered_from = subnet_data.discovered_from
                            existing_subnet.status = 'Not Scanned'

                            if existing_subnet.discovered == 'Discovered':
                                existing_subnet.discovered = 'Not Discovered'
                                configs.db.commit()
                                response = True
                            else:
                                configs.db.add(subnet_data)
                                configs.db.commit()
                                print(f'{subnet_data.subnet_address} Updated Successfully',file=sys.stderr)
                                response = True

                            try:
                                ips = GetIps(subnet)
                                print("ips are:::::::::::::::::",ips,file=sys.stderr)
                                for ip in ips:
                                    print("ips in ip is",ip,file=sys.stderr)
                                    subnet_id = subnet_data.subnet_id
                                    ip_exists = (
                                        configs.db.query(IpTable)
                                        .filter_by(ip_address=ip, subnet_id=subnet_id)
                                        .first()
                                    )
                                    print("ip exsist is::::",ip_exists,file=sys.stderr)
                                    if ip_exists:
                                        ip_exists.mac_address = ''
                                        ip_exists.configuration_interface = ''
                                        ip_exists.configuration_switch = ''
                                        ip_exists.status = ''
                                        ip_exists.ip_to_dns = ''
                                        ip_exists.dns_to_ip = ''
                                        ip_exists.status_history = ''
                                        ip_exists.vip = ''
                                    else:
                                        subnet_id = subnet_data.subnet_id
                                        new_ip = IpTable(ip_address=ip, subnet_id=subnet_id)
                                        configs.db.add(new_ip)

                                configs.db.commit()
                                return {"Response": "Subnet added successfully"}
                            except Exception as e:
                                traceback.print_exc()
                                return {"Response": "Error occurred while processing IP addresses"}
            else:
                return {'Response': "No subnet found"}

    except Exception as e:
        traceback.print_exc()
        return {"Response": "Error Occurred while adding subnet in subnet"}

@router.get('/get_ip_detail_by_subnet',
            responses = {
                200:{"model":list[IpHistoryBySubnetSchema]},
                400:{"model":str},
                500:{"model":str}
            },
            summary = "Use this API in the subnet table while clicking on the subnet get the detail of its ip",
            description="Use this API in the subnet table while clicking on the subnet get the detail of its ip"
            )
def get_ip_detail_by_stubnet(subnet:str=Query(..., description="subnet")):
    try:
        ip_list = []
        data = subnet.strip()
        print("data is::::", data, file=sys.stderr)

        # Fetch subnet detail from the database
        subnet_detail = (
            configs.db.query(subnet_table)
            .filter_by(subnet_address=data)
            .first()
        )

        if subnet_detail:
            # Fetch IP details associated with the found subnet
            print("subnet detai;ls",subnet_detail,file=sys.stderr)
            ip_detail = (
                configs.db.query(IpTable)
                .filter_by(subnet_id=subnet_detail.subnet_id)
                .all()
            )
            print("ip details is",ip_detail,file=sys.stderr)
            for ip in ip_detail:
                print("ip is::",ip,file=sys.stderr)
                print("ip is::",ip,file=sys.stderr)
                ip_dict = {
                    "ip_id": ip.ip_address,
                    "mac_address": ip.mac_address,
                    "status": ip.status,
                    "vip": ip.vip,
                    "asset_tag":ip.asset_tag,
                    "configuration_switch":ip.configuration_switch,
                    "configuration_interface":ip.configuration_interface,
                    "open_ports":ip.open_ports,
                    "ip_dns":ip.ip_dns,
                    "dns_ip":ip.dns_ip,
                    "creation_date":ip.creation_date,
                    "modification_date":ip.modification_date,
                    "ip_address":ip.ip_address,
                    "subnet":subnet_detail.subnet_address
                }
                ip_list.append(ip_dict)

            return ip_list
        else:
            return JSONResponse(content="Subnet detail not found", status_code=404)

    except Exception as e:
        print(f"Error occurred while getting subnet details by subnet: {e}")
        return JSONResponse(
            content="Error Occurred While getting subnet details by subnet",
            status_code=500
        )

@router.get("/get_all_discovered_subnet",
            responses = {
                200:{"model":list[DiscoveredSubnetSchema]},
                400:{"model":str},
                500:{"model":str}
            },
            summary="Use this API to list down all the discovered subnet in subnet page in discovered subnet table",
            description="Use this API to list down all the discovered subnet in subnet page in discovered subnet table"
            )
def get_all_discovered_subnet():
    try:
        subnet_lst = []
        subnets = configs.db.query(subnet_table).filter_by(discovered="Discovered").all()
        for subnet in subnets:
            subnet_usage = configs.db.query(subnet_usage_table).filter_by(subnet_id = subnet.subnet_id).first()
            subnet_dict = {
                "subnet_id":subnet.subnet_id,
                "subnet":subnet.subnet_address,
                "subnet_mask":subnet.subnet_mask,
                "subnet_name":subnet.subnet_name,
                "location":subnet.location,
                "discovered_from":subnet.discovered_from,
                "subnet_usage":subnet_usage.subnet_usage,
                "subnet_size":subnet_usage.subnet_size,
            }
            subnet_lst.append(subnet_dict)
        return subnet_lst
    except Exception as e:
        traceback.print_exc()

@router.post('/add_dns',
             responses={
                 200:{"model":str},
                 400:{"model":str},
                 500:{"model":str}
             },
             summary="API to add dns",
             description="API to add dns"
             )
def AddDNS(data: AddDnsSchema):
    try:
        print("data is::::",data,file=sys.stderr)
        dns_data = dict(data)
        dns_query = configs.db.query(ADD_DNS_TABLE).all()
        print("DNS query is:::::::::::::::::::::", dns_query, file=sys.stderr)
        dns_ip = False
        add_dns = ADD_DNS_TABLE()
        dns_server = DnsServerTable()
        for ip in dns_query:
            print("ip in ip addrres::::::::", ip, file=sys.stderr)
            ip_address = ip.ip_address
            if ip_address:
                dns_ip = True
                if ip_address == dns_data['ip_address']:
                    print("ip_address found in dns ip address True updating executing>>", file=sys.stderr)
                    dns_query1 = configs.db.query(ADD_DNS_TABLE).filter_by(ip_address=dns_data['ip_address']).first()
                    if dns_query1:
                        print("dns query is >>>>>>>>>>>", dns_query1, file=sys.stderr)
                        # updating the add dns table
                        add_dns.ip_address = dns_data['ip_address']
                        add_dns.username = dns_data['username']
                        add_dns.password = dns_data['password']
                        add_dns.server_name = dns_data['server_name']
                        UpdateDBData(add_dns)
                        print("DNS Table Updated >>>>>>>>>>", file=sys.stderr)
                    else:
                        add_dns.ip_address = dns_data['ip_address']
                        add_dns.username = dns_data['username']
                        add_dns.password = dns_data['password']
                        add_dns.server_name = dns_data['server_name']
                        InsertDBData(add_dns)
                        print("Inserted Into ADD DNS TABLE>", file=sys.stderr)

                    dns_query2 = configs.db.query(DnsServerTable).filter_by(server_name=dns_data['server_name']).first()
                    if dns_query2:
                        # dns_server.ip_address = dns_data['ip_address']
                        dns_server.server_name = dns_data['server_name']
                        dns_server.number_of_zones = 0
                        dns_server.type = ''
                        UpdateDBData(dns_server)
                        print("Dns server updated successfully>>>>>>", file=sys.stderr)
                    else:
                        # dns_server.ip_address = dns_data['ip_address']
                        dns_server.server_name = dns_data['server_name']
                        InsertDBData(dns_server)
                        print("Inserted into DNS server table", file=sys.stderr)

        if not dns_ip:
            for key, value in dns_data.items():
                if hasattr(add_dns, key):
                    setattr(add_dns, key, value)

            # add_dns.ip_address = dns_data.ip_address
            # add_dns.username = dns_data.username
            # add_dns.password = dns_data.password
            # add_dns.server_name = dns_data.server_name
            InsertDBData(add_dns)
            print("Inserted Into ADD DNS TABLE::::::::>", file=sys.stderr)
            # dns_server.ip_address = dns_data['ip_address']
            dns_server.server_name = dns_data['server_name']
            InsertDBData(dns_server)
            print("Inserted into DNS server table::::::::::::::::::::", file=sys.stderr)
            return {"Reposne": "DataInserted"}

    except Exception as e:
        traceback.print_exc()
        return {"Reponse": "Error Occured while Adding DNS"}

@router.get('/get_dns_servers',
            responses={
                200:{"model":list[GetallDnsServers]},
                500:{"model":str}
            },
            summary="Use this API to list down all the dns server in the dns server page",
            description="Use this API to list down all the dns server in the dns server page"
            )
def GetAllDnsServers():
    if True:
        try:
            objList = []
            dnsServersObjs = configs.db.query(DnsServerTable).all()
            for dnsServerObj in dnsServersObjs:
                objDict = {}
                objDict['dns_server_id'] = dnsServerObj.dns_server_id
                objDict['server_name'] = dnsServerObj.server_name
                objDict['number_of_zones'] = dnsServerObj.number_of_zones
                objDict['type'] = dnsServerObj.type
                objList.append(objDict)
            print(objList, file=sys.stderr)
            # return jsonify(objList),200
            return objList

        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return JSONResponse(content="Error Occured while Getting dns servers",status_code=500)


@router.get('/get_dns_zones',responses={
    200:{"model":list[getDnsZones]},
    500:{"model":str}
},
summary="Use this api to list down all the dns zones in the table.this api is of get method",
description="Use this api to list down all the dns zones in the table.this api is of get method"
)
def GetAllDnsZones():
    if True:
        try:
            objList = []
            dnsZonesObjs = configs.db.query(DnsZonesTable)
            for dnsZoneObj in dnsZonesObjs:
                objDict = {}
                objDict['dns_id'] = dnsZoneObj.dns_zone_id
                objDict['zone_name'] = dnsZoneObj.zone_name
                objDict['zone_status'] = dnsZoneObj.zone_status
                objDict['zone_type'] = dnsZoneObj.zone_type
                objDict['lookup_type'] = dnsZoneObj.lookup_type
                objList.append(objDict)
            print(objList,file=sys.stderr)
            return objList
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return ({'message': 'Authentication Failed'}), 401

@router.get('/get_dns_records',responses={
    200:{"model":list[GetDnsRecoed]},
    500:{"model":str}
},
summary="Use this API to get all the dns records in the table",
description="Use this API to get all the dns records in the table"
)
def GetAllDnsServersRecord():
    if True:
        try:
            objList = []
            dnsServersRecordObjs = configs.db.query(DnsRecordTable).all()
            for dnsServersRecordObj in dnsServersRecordObjs:
                objDict = {}
                objDict['dns_record_id'] = dnsServersRecordObj.dns_id
                objDict['server_name'] = dnsServersRecordObj.server_name
                objDict['server_ip'] = dnsServersRecordObj.server_ip
                objList.append(objDict)
            print(objList,file=sys.stderr)
            return objList
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return ({'message': 'Authentication Failed'}), 401

@router.get('/get_all_f5',
            responses={
                200:{'model':list[F5Obj]},
                400:{"model":str},
                500:{"model":str}
            })
def get_all_f5():
    try:
        f5ObjList = []
        f5Objs = configs.db.execute('SELECT * FROM f5 WHERE creation_date = (SELECT max(creation_date) FROM f5)')

        for f5Obj in f5Objs:
            f5DataDict = {
                "f5_id":f5Obj.f5_id,
                "ip_address":f5Obj.ip_address,
                "device_name":f5Obj.device_name,
                "vserver_name":f5Obj.vserver_name,
                "vip":f5Obj.vip,
                "pool_name":f5Obj.pool_name,
                "pool_member":f5Obj.pool_member,
                "node":f5Obj.node,
                "service_port":f5Obj.service_port,
                "monitor_value":f5Obj.monitor_value,
                "monitor_status":f5Obj.monitor_status,
                "lb_method":f5Obj.lb_method,
                "creation_date":f5Obj.creation_date,
                "modification_date":f5Obj.modification_date,
                "created_by":f5Obj.created_by,
                "modified_by":f5Obj.modified_by
            }
            f5ObjList.append(f5DataDict)

        content = json.dumps(f5ObjList).encode('utf-8')
        compressed_content = gzip.compress(content)

        # Use BytesIO to wrap the compressed content
        compressed_stream = BytesIO(compressed_content)

        # Extract bytes from BytesIO object using getvalue()
        compressed_bytes = compressed_stream.getvalue()

        # Create FastAPI Response with gzip compression and appropriate headers
        response = Response(
            content=compressed_bytes,
            media_type="application/json",
            headers={
                "Content-Encoding": "gzip",
                "Content-Length": str(len(compressed_bytes)),
            },
        )
        return response
    except Exception as e:
        traceback.print_exc()


@router.get('/get_all_firewall_vip',
            responses = {
                200:{"model":list[GetAllFirewallVIP]},
                500:{"model":str}
            },
            summary="Use this aspi in the VIP to list down all the firewall vip",
            description="Use this aspi in the VIP to list down all the firewall vip"
            )
def get_all_firewall_vip():
    try:
        firewall_lst = []
        firewall = configs.db.query(FIREWALL_VIP).all()
        for row in firewall:
            firewall_dict ={
                "firewall_vip_id":row.firewall_vip_id,
                "ip_address":row.ip_address,
                "device_name":row.device_name,
                "internal_ip":row.internal_ip,
                "vip":row.vip,
                "sport":row.sport,
                "dport":row.dport,
                "extintf":row.extintf,
                "creation_date":row.creation_date,
                "modification_date":row.modification_date
            }
            firewall_lst.append(firewall_dict)
        content = json.dumps(firewall_lst).encode('utf-8')
        compressed_content = gzip.compress(content)

        # Use BytesIO to wrap the compressed content
        compressed_stream = BytesIO(compressed_content)

        # Extract bytes from BytesIO object using getvalue()
        compressed_bytes = compressed_stream.getvalue()

        # Create FastAPI Response with gzip compression and appropriate headers
        response = Response(
            content=compressed_bytes,
            media_type="application/json",
            headers={
                "Content-Encoding": "gzip",
                "Content-Length": str(len(compressed_bytes)),
            },
        )
        return response
    except Exception as e:
        traceback.print_exc()
        return (JSONResponse
                (content="Error occured while getting all firewall vip",status_code=500))

@router.get('/get_all_subnet',
            responses={
                200:{"model":list[GetAllSubnetSchema]},
                500:{"model":str}
            },
            summary="Use this API to list down all the subnet in subnet details",
            description="Use this API to list down all the subnet in subnet details",
            )
def get_all_subnet():
    try:
        subnet_list = []
        subnet = configs.db.query(subnet_table).all()
        for row in subnet:
            subnet_usage = configs.db.query(subnet_usage_table).filter_by(subnet_id = row.subnet_id).first()
            subnet_dict = {
                "subnet_id":row.subnet_id,
                "subnet":row.subnet_address,
                "subnet_mask":row.subnet_mask,
                "subnet_name":row.subnet_name,
                "location":row.location,
                "discovered_from":row.discovered_from,
                "discovered":row.discovered,
                "scan_date":row.scan_date,
                "subnet_usage":subnet_usage.subnet_usage,
                "subnet_size":subnet_usage.subnet_size
            }
            subnet_list.append(subnet_dict)
        return subnet_list
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While getting subnet",status_code=500)

@router.get('/get_all_ip_details',
            responses={
                200:{"model":list[IPDetailScehma]},
                500:{"model":str}
            },
            summary= "use this ip to list down all the ip details",
            description = "use thi api to list down all the ip details in ip details"
            )
def get_all_details():
    try:
        ip_list = []
        ip_detail = configs.db.query(IpTable).all()
        for ip in ip_detail:
            print("ip is::", ip, file=sys.stderr)
            print("ip is::", ip, file=sys.stderr)
            ip_dict = {
                "ip_id": ip.ip_address,
                "mac_address": ip.mac_address,
                "status": ip.status,
                "vip": ip.vip,
                "asset_tag": ip.asset_tag,
                "configuration_switch": ip.configuration_switch,
                "configuration_interface": ip.configuration_interface,
                "open_ports": ip.open_ports,
                "ip_dns": ip.ip_dns,
                "dns_ip": ip.dns_ip,
                "creation_date": ip.creation_date,
                "modification_date": ip.modification_date,
                "ip_address": ip.ip_address,
            }
            ip_list.append(ip_dict)
        return ip_list
    except Exception as e:
        traceback.print_exc()