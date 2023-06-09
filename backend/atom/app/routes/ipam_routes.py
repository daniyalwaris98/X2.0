from distutils.file_util import move_file
import time
from ipaddress import ip_address
from operator import mod
from os import stat
from re import subn
import site
from socketserver import ThreadingUDPServer
import sys
import json
import traceback
import gzip
from unittest.util import _count_diff_all_purpose
from wsgiref.simple_server import software_version
from flask_jsonpify import jsonify
from flask import Flask, request, make_response, Response, session
from app import app, db
from app.models.inventory_models import *
from sqlalchemy import func
from datetime import datetime
from dateutil.relativedelta import relativedelta
from flask_cors import CORS, cross_origin
import ipaddress
from subprocess import Popen, PIPE
import threading
from app.middleware import token_required
from app.ipam_scripts.ipam import IPAM
import ipaddress
import nmap
from netaddr import IPNetwork
import socket
import platform
import subprocess
from app.ipam_scripts.ipam_physical_mapping import IPAMPM
from app.ipam_scripts.f5 import F5
from app.ipam_scripts.fortigate_vip import FORTIGATEVIP
import re
from threading import Thread
from pywinos import WinOSClient


upIpsQueue=  []
totalPingThreads= 200
totalDnsNameThreads= 200
totalDnsIpThreads= 200
totalPortScanThreads= 50
totalNmapScanningThreads= 200
startPort=1
endPort=200

def DnsName(ip):  
    data=""
    try:
        data = (str(socket.gethostbyaddr(ip)))
        #return host
    except Exception as e:
        data = 'Not Found'
        #return error
    
    if data:
        if data!= "Not Found":
            try: 
                #ExecuteDBQuery(f"update ip_table set ip_to_dns='{data}' where IP_ADDRESS='{ip}';")
                ExecuteDBQuery(f"update ip_table set dns_to_ip='{data}' where IP_ADDRESS='{ip}';")
                print(f"DNS NAME {data} INSERTED SUCCESSFULLY AGAINST {ip}",file=sys.stderr)
            except Exception as e :
                print(f"Error in Update Dns Name {e}", file=sys.stderr)
                traceback.print_exc()
        elif data=="Not Found":
            try:
                ExecuteDBQuery(f"update ip_table set ip_to_dns='{data}' where IP_ADDRESS='{ip}';")
                #ExecuteDBQuery(f"update ip_table set dns_to_ip='{data}' where IP_ADDRESS='{ip}';")
                print(f"DNS IP {data} INSERTED SUCCESSFULLY AGAINST {ip}",file=sys.stderr)
            except Exception as e :
                print(f"Error in Update Dns IP {e}", file=sys.stderr)
                traceback.print_exc()

def DnsIp(ip):
    data=""  
    try:
        result=socket.gethostbyaddr(ip)
        data= list(result)[0]
    except Exception as e:
        data= 'Not Found'
        #return error
    
    if data:
        if data!= "Not Found":
            try:
                ExecuteDBQuery(f"update ip_table set ip_to_dns='{data}' where IP_ADDRESS='{ip}';")
                #ExecuteDBQuery(f"update ip_table set dns_to_ip='{data}' where IP_ADDRESS='{ip}';")
                print(f"DNS IP {data} INSERTED SUCCESSFULLY AGAINST {ip}",file=sys.stderr)
            except Exception as e :
                print(f"Error in Update Dns IP {e}", file=sys.stderr)
        elif data=="Not Found":
            try:
                ExecuteDBQuery(f"update ip_table set ip_to_dns='{data}' where IP_ADDRESS='{ip}';")
                #ExecuteDBQuery(f"update ip_table set dns_to_ip='{data}' where IP_ADDRESS='{ip}';")
                print(f"DNS IP {data} INSERTED SUCCESSFULLY AGAINST {ip}",file=sys.stderr)
            except Exception as e :
                print(f"Error in Update Dns IP {e}", file=sys.stderr)
                traceback.print_exc()

def FormatDate(date):
    #print(date, file=sys.stderr)
    if date is not None:
        result = date.strftime('%d-%m-%Y')
    else:
        #result = datetime(2000, 1, 1)
        result = datetime(1, 1, 2000)

    return result

def FormatStringDate(date):
    print(date, file=sys.stderr)

    try:
        if date is not None:
            if '-' in date:
                result = datetime.strptime(date, '%d-%m-%Y')
            elif '/' in date:
                result = datetime.strptime(date, '%d/%m/%Y')
            else:
                print("incorrect date format", file=sys.stderr)
                result = datetime(2000, 1, 1)
        else:
            #result = datetime(2000, 1, 1)
            result = datetime(2000, 1, 1)
    except:
        result = datetime(2000, 1, 1)
        print("date format exception", file=sys.stderr)

    return result

def UpdateData(obj):
    # add data to db
    #print(obj, file=sys.stderr)
    try:
        db.session.flush()

        db.session.merge(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(
            f"Something else went wrong during Database Update {e}", file=sys.stderr)

    return True

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

def nmapPortScanning(ip, port):
    print(f"Scanning Port {port} of IP {ip}", file=sys.stderr) 
    try:
        scanner = nmap.PortScanner()
        res = scanner.scan(ip,str(port))
        res = res['scan'][ip]['tcp'][port]['state']
        
        if res=='open':
            #print(port, file=sys.stderr)
            new_port=""
            result10= SelectFromDB(f"SELECT OPEN_PORTS FROM ip_table where IP_ADDRESS='{ip}';")
            for row in result10:
                old_ports = row[0]
                if old_ports:
                    new_port= str(old_ports)+", "+str(port)
                else:
                    new_port=port
            print(f"New Portssss {new_port}", file=sys.stderr)
            ExecuteDBQuery(f"update ip_table set open_ports='{new_port}' where IP_ADDRESS='{ip}';")
            print(f"PORT  {port}  ADDED SUCCESSFULLY FOR IP {ip}",file=sys.stderr)
    except Exception as e:
        traceback.print_exc()
        print(f"Error Occured in NMAP Scanning {e}", file=sys.stderr)            


def PortScanner(target):
    print(f"Scanning Ports for IP {target}", file=sys.stderr)
    try:
        open_ports = ""
        begin = startPort
        end = endPort
        threads=[]
        for i in range(begin,end+1): 
            th = threading.Thread(target=nmapPortScanning, args=(target, i,))
            th.start()
            threads.append(th)
            if len(threads) == totalNmapScanningThreads: 
                for t in threads:
                    t.join()
                threads =[]

        else:
            for t in threads: # if request is less than connections_limit then join the threads and then return data
                t.join()
            # print(f"Scanning Port {i} of IP {target}", file=sys.stderr) 
            # scanner = nmap.PortScanner()
            # res = scanner.scan(target,str(i))
            # res = res['scan'][target]['tcp'][i]['state']
            
            # if res=='open':
            #     print(i, file=sys.stderr)
                #open_ports+=str(i)+","

        # if "," in open_ports:
        #     open_ports = open_ports[0:-1]
        
        # ExecuteDBQuery(f"update ip_table set open_ports='{open_ports}' where IP_ADDRESS='{target}';")
        # print(f"OPEN PORTS ARE ADDED SUCCESSFULLY FOR {open_ports}",file=sys.stderr)
    
    except Exception as e:
        print(f"Exceptin Occured in Port Scanning {e}", file=sys.stderr)    

def scanPorts(subnet):    
    threads =[]
    result= SelectFromDB (f"select IP_ADDRESS from ip_table WHERE STATUS='Used' and SUBNET= '{subnet}';")
    for row in result:
        ip = row[0]
        PortScanner(ip)


        
        # th = threading.Thread(target=PortScanner, args=(ip,))
        # th.start()
        # threads.append(th)
        # if len(threads) == totalPortScanThreads: 
        #     for t in threads:
        #         t.join()
        #     threads =[]

    # else:
    #     for t in threads: # if request is less than connections_limit then join the threads and then return data
    #         t.join()
'''        
def GetIps(subnet):
    ips = []
    try:
       
        for ip in IPNetwork(subnet):
            ips.append(ip.ip)
        return ips
    except Exception as e:
        return pass
        pass
'''

def GetIps(subnet):
    ips = []
    try:

        
        for ip in IPNetwork(subnet):
            ipStr= ""+str(ip)
            #if ipStr=="192.168.30.2" or ipStr=="192.168.30.20" or ipStr=="192.168.30.30" or ipStr=="192.168.30.40" or ipStr=="192.168.18.37" or ipStr=="192.168.30.186" or ipStr=="192.168.30.167" or ipStr=="192.168.30.151" or ipStr=="192.168.30.152" or ipStr=="192.168.30.168"  or ipStr=="192.168.30.171" or ipStr=="192.168.30.190" or ipStr=="192.168.30.192" or ipStr=="192.168.30.195" or ipStr=="192.168.30.200" or ipStr=="192.168.30.225" or ipStr=="192.168.30.31":
            ips.append(ipStr)
        ips.pop(0)
        ips.pop(-1)
        return ips
    except Exception as e:
        print(e)
        return ips

def sizeCalculator(subnet):
    subnetCdrs= {'/32':1,'/31':2,'/30':2,'/29':6,'28/':14,'/27':30,'/26':62,'/25':126,'/24':254,'/23':510,'/22':1022,'/21':2046,'/20':4094,'/19':8190,'/18':16382,'/17':32766,'/16':65534,'/15':131070,'/14':262142,'/13':524286,'/12':1048574,'/11':2097150,'/10':4194302,'/9':8388606,'/8':16777214,'/7':33554430,'/6':67108862,'/5':134217726,'/4':268435454,'/3':536870910,'/2':1073741822,'/1':2147483646,'/0':4294967294}
    temp_size = 0
    for subnetCdr in subnetCdrs:
        if subnet[-3:]==subnetCdr or subnet[-2:]==subnetCdr:
            temp_size = subnetCdrs[subnetCdr]
    return temp_size

def SubnetMaskCalculator(subnet):
    net = ipaddress.ip_network(subnet, strict=False)
    return str(net.netmask)

def UpIps(subnet):
    availabe_ips=[]
    nm = nmap.PortScanner()
    nm.scan(hosts=subnet, arguments='-n -sP')
    hosts_list = [(x, nm[x]['status']['state']) for x in nm.all_hosts()]
    print(f"Host List is {hosts_list}", file=sys.stderr)
    count=0
    for host, status in hosts_list:
        if status=='up':
            print(host + ' ' + status,file=sys.stderr)
            count+=1
            availabe_ips.append(host)
    return availabe_ips

@app.route('/getAllIpam2', methods=['GET'])
def test22():
    ava=UpIps("192.168.30.0/24")
    
    return str(ava)

def UsageCalculator(available_ips,total_ips):
        # count = 20
    if total_ips==0:
        total_ips=1
    usage = f"{round(available_ips/(total_ips)*100,2)}"
    return usage

@app.route('/getAllIpam', methods=['GET'])
@token_required
def GetAllIpam(user_data):
    if True:
        try:
            ipamObjList = []
            ipamObjs = IPAM_TABLE.query.all()
            for ipamObj in ipamObjs:
                ipamDataDict = {}
                ipamDataDict['region'] = ipamObj.region
                ipamDataDict['site_name'] = ipamObj.site_name
                ipamDataDict['device_name'] = ipamObj.device_name
                ipamDataDict['ip_address'] = ipamObj.ip_address
                ipamDataDict['subnet_mask'] = ipamObj.subnet_mask
                ipamDataDict['subnet'] = ipamObj.subnet
                ipamDataDict['protocol_status'] = ipamObj.protocol_status
                ipamDataDict['admin_status'] = ipamObj.admin_status
                ipamDataDict['vlan'] = ipamObj.vlan
                ipamDataDict['interface_name'] = ipamObj.interface_name
                ipamDataDict['vlan_name'] = ipamObj.vlan_name
                ipamDataDict['virtual_ip'] = ipamObj.virtual_ip
                ipamDataDict['description'] = ipamObj.description
                ipamDataDict['creation_date'] = FormatDate(
                    (ipamObj.creation_date))
                ipamDataDict['modification_date'] = FormatDate(
                    (ipamObj.modification_date))
                ipamDataDict['management_ip'] = ipamObj.management_ip
                ipamDataDict['site_type'] = ipamObj.site_type
                ipamObjList.append(ipamDataDict)
            print(ipamObjList, file=sys.stderr)
            return jsonify(ipamObjList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/addIpam', methods=['POST'])
@token_required
def AddIpam(user_data):
    if True:
        try:
            ipamObj = request.get_json()
            print(ipamObj, file=sys.stderr)
            ipam = IPAM_TABLE()
            ipam.region = ipamObj['region']
            ipam.site_name = ipamObj['site_name']
            ipam.device_name = ipamObj['device_name']
            # match = re.match(r"[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}", ipamObj['ip_address'])
            # value = (bool(match))
            # if value:
            #     ipam.ip_address = ipamObj['ip_address']
            # else:
            #     return "Invalid IP Address",500
            ipam.ip_address = ipamObj['ip_address']
            ipam.subnet_mask = ipamObj['subnet_mask']
            ipam.subnet = ipamObj['subnet']
            ipam.protocol_status = ipamObj['protocol_status']
            ipam.admin_status = ipamObj['admin_status']
            ipam.vlan = ipamObj['vlan']
            ipam.interface_name = ipamObj['interface_name']
            ipam.vlan_name = ipamObj['vlan_name']
            ipam.virtual_ip = ipamObj['virtual_ip']
            ipam.description = ipamObj['description']
            ipam.creation_date = datetime.now()
            ipam.modification_date = datetime.now()
            ipam.management_ip = ipamObj['management_ip']
            ipam.site_type = ipamObj['site_type']
            InsertData(ipam)
            print("Inserted " + ipamObj['site_name'], file=sys.stderr)

            return jsonify({'response': "success", "code": "200"})
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/editIpam', methods=['POST'])
@token_required
def EditIpam(user_data):
    if True:
        try:
            ipamObj = request.get_json()
            print(ipamObj, file=sys.stderr)
            ipam = IPAM_TABLE()
            ipam.region = ipamObj['region']
            ipam.site_name = ipamObj['site_name']
            ipam.device_name = ipamObj['device_name']
            # match = re.match(r"[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}", ipamObj['ip_address'])
            # value = (bool(match))
            # if value:
            #     ipam.ip_address = ipamObj['ip_address']
            # else:
            #     return "Invalid IP Address"
            ipam.ip_address = ipamObj['ip_address']
            ipam.subnet_mask = ipamObj['subnet_mask']
            ipam.subnet = ipamObj['subnet']
            ipam.protocol_status = ipamObj['protocol_status']
            ipam.admin_status = ipamObj['admin_status']
            ipam.vlan = ipamObj['vlan']
            ipam.interface_name = ipamObj['interface_name']
            ipam.vlan_name = ipamObj['vlan_name']
            ipam.virtual_ip = ipamObj['virtual_ip']
            ipam.description = ipamObj['description']
            ipam.modification_date = datetime.now()
            ipam.management_ip = ipamObj['management_ip']
            ipam.site_type = ipamObj['site_type']
            print("Updated " + ipamObj['site_name'], file=sys.stderr)
            UpdateData(site)
            return jsonify({"RESPONSE": "OK"}), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/ipamCards', methods=['GET'])
@token_required
def IpamCard(user_data):
    if True:
        try:
            queryString = f"select count(distinct SUBNET) from ipam_table;"
            result = db.session.execute(queryString).scalar()
            queryString1 = f"select count(distinct IP_ADDRESS) from ipam_table;"
            result1 = db.session.execute(queryString).scalar()
            queryString2 = f"select count(distinct DEVICE_NAME) from ipam_table;"
            result2 = db.session.execute(queryString2).scalar()
            objList = [
                {
                    "name": "Total Subnets",
                    "value": result
                },
                {
                    "name": "Total IP Addresses",
                    "value": result1
                },
                {
                    "name": "Total Devices",
                    "value": result2
                }
            ]
            print(objList, file=sys.stderr)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/publicSubnet', methods=['GET'])
@token_required
def PublicSubnet(user_data):
    if True:
        try:
            ips = []
            startswith_10 = []
            endswith_1 = []
            publicips = []
            queryString = f"select IP_ADDRESS from ipam_table;"
            result = db.session.execute(queryString)
            for row in result:
                ip_address = row[0]
                ips.append(ip_address)
            for ipadd in ips:
                # ipadd = x
                # #print(ipadd)    #run this to confirm all elements of mylist
                # if ipadd.startswith("10"):
                #     startswith_10.append(ipadd)
                # else:
                #     pass
                # if ipadd.endswith("1"):
                #     endswith_1.append(ipadd)
                # else:
                #     pass
                if ipadd.startswith("10") or ipadd.startswith("192.168") or ipadd.startswith("172.16") or ipadd.startswith("172.17") or ipadd.startswith("172.18") or ipadd.startswith("172.19") or ipadd.startswith("172.2") or ipadd.startswith("172.30") or ipadd.startswith("172.31"):
                    pass
                else:
                    publicips.append(ipadd)
            print(len(publicips), file=sys.stderr)
            objList = []
            for public_ip in publicips:
                queryString1 = f"select SUBNET,SUBNET_MASK from ipam_table where IP_ADDRESS='{public_ip}';"
                result1 = db.session.execute(queryString1)
                for row in result1:
                    objDict = {}
                    subnet = row[0]
                    subnet_mask = row[1]
                    # public_ip_address = row[2]
                    objDict['subnet'] = subnet
                    objDict['subnet_mask'] = subnet_mask
                    # objDict['public_ip_address'] = public_ip_address
                    objDict['ip_percentage_used'] = 0
                    objDict['ip_used'] = 0
                    objList.append(objDict)
                    break
            print(len(objList), file=sys.stderr)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/privateSubnet', methods=['GET'])
@token_required
def PrivateSubnet(user_data):
    if True:
        try:
            ips = []
            startswith_10 = []
            endswith_1 = []
            privateips = []
            queryString = f"select IP_ADDRESS from ipam_table;"
            result = db.session.execute(queryString)
            for row in result:
                ip_address = row[0]
                ips.append(ip_address)
            for ipadd in ips:
                # ipadd = x
                # #print(ipadd)    #run this to confirm all elements of mylist
                # if ipadd.startswith("10"):
                #     startswith_10.append(ipadd)
                # else:
                #     pass
                # if ipadd.endswith("1"):
                #     endswith_1.append(ipadd)
                # else:
                #     pass
                if ipadd.startswith("10") or ipadd.startswith("192.168") or ipadd.startswith("172.16") or ipadd.startswith("172.17") or ipadd.startswith("172.18") or ipadd.startswith("172.19") or ipadd.startswith("172.2") or ipadd.startswith("172.30") or ipadd.startswith("172.31"):
                    privateips.append(ipadd)
                else:
                    pass
            print(len(privateips), file=sys.stderr)
            objList = []
            for private_ip in privateips:
                queryString1 = f"select SUBNET,SUBNET_MASK from ipam_table where IP_ADDRESS='{private_ip}';"
                result1 = db.session.execute(queryString1)
                for row in result1:
                    objDict = {}
                    subnet = row[0]
                    subnet_mask = row[1]
                    # private_ip_address = row[2]
                    objDict['subnet'] = subnet
                    objDict['subnet_mask'] = subnet_mask
                    # objDict['private_ip_address'] = private_ip_address
                    objDict['ip_percentage_used'] = 100
                    objDict['ip_used'] = 2
                    objList.append(objDict)
                    break
            print(len(objList), file=sys.stderr)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/getSubnetInformation', methods=['GET'])
@token_required
def GetSubnetInformation(user_data):

    connections_limit = 254
    if True:
        try:
            objList = []
            threads = []
            subnet = request.args.get('subnet')
            # subnet = '192.168.10.0/24'
            queryString = f"select SUBNET from ipam_table where SUBNET='{subnet}';"
            result = db.session.execute(queryString)
            for row in result:

                subnet = str(row[0])
                net4 = ipaddress.ip_network(subnet, False)
                for ip in net4.hosts():

                    th = threading.Thread(target=ping, args=(ip, objList,))
                    th.start()
                    threads.append(th)
                    if len(threads) == connections_limit:
                        for t in threads:
                            t.join()
                        threads = []
                else:
                    for t in threads:  # if request is less than connections_limit then join the threads and then return data
                        t.join()

                return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

def ping(ip, objList):
    print(f"PINGING the IP {ip}", file=sys.stderr)

    objDict = {}
    ip = str(ip)
    hostup = Popen(["ping", '-c', '1', ip], stdout=PIPE)
    output = hostup.communicate()[0]
    val1 = hostup.returncode
    if val1 == 0:
        print(ip, "is pinging", file=sys.stderr)
        objDict['ip_address'] = ip
        objDict['status'] = 'Used'
    else:
        print(ip, "is not responding", file=sys.stderr)
        objDict['ip_address'] = ip
        objDict['status'] = 'Unused'
    objList.append(objDict)

@app.route('/getAllIpamDevices', methods=['GET'])
@token_required
def GetAllIpamDevices(user_data):
    if True:
        try:
            objList = []
            queryString = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,SOURCE,DEVICE_NAME,IPAM_ID from ipam_devices_table;"
            result = db.session.execute(queryString)
            for row in result:
                ip_address = row[0]
                device_type = row[1]
                password_group = row[2]
                source = row[3]
                device_name = row[4]
                ipam_id = row[5]
                objDict = {}
                objDict['ipam_id'] = ipam_id
                objDict['ip_address'] = ip_address
                objDict['device_type'] = device_type
                objDict['password_group'] = password_group
                objDict['source'] = source
                objDict['device_name'] = device_name
                objList.append(objDict)
            # print(objList, file=sys.stderr)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/addIpamStatically', methods=['POST'])
@token_required
def AddIpamStatically(user_data):
    if True:
        try:
            ipamObj = request.get_json()
            if IPAM_DEVICES_TABLE.query.with_entities(IPAM_DEVICES_TABLE.ip_address).filter_by(ip_address=ipamObj['ip_address']).first() is None:

                if IPAM_DEVICES_TABLE.query.with_entities(IPAM_DEVICES_TABLE.device_name).filter_by(device_name=ipamObj['device_name']).first() is not None:
                    return jsonify({"Response": "Device Name Already Exists"}), 500
                

                ipam = IPAM_DEVICES_TABLE()

                if 'ip_address' in ipamObj:
                    # match = re.match(r"[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}", ipamObj['ip_address'])
                    # value = (bool(match))
                    # if value:
                    ipam.ip_address = ipamObj['ip_address']
                    # else:
                    #     return "Invalid IP Address",500
                else:
                    pass
                if 'device_type' in ipamObj:
                    ipam.device_type = ipamObj['device_type']
                else:
                    pass
                if 'password_group' in ipamObj:
                    ipam.password_group = ipamObj['password_group']
                else:
                    ipam.password_group = 'N/A'
                ipam.source = 'Static'
                ipam.device_name = ipamObj['device_name']
                InsertData(ipam)

                print(ipamObj['ip_address'],
                      "Added Successfully in IPAM", file=sys.stderr)
            else:
                print("IP ADDRESS/DEVICE NAME IS DUPLICATE", file=sys.stderr)
                return jsonify({"Response": "IP Address Already Exists"}), 500
            return jsonify({"Response": "Added Successfully in IPAM"}), 200

        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/addIpamByAtom', methods=['POST'])
@token_required
def AddIpamByAtom(user_data):
    if True:
        response = False
        response1 = False
        
        try:
            responses = []
            ips = request.get_json()
            for ip in ips:
                # if IPAM_DEVICES_TABLE.query.with_entities(IPAM_DEVICES_TABLE.ip_address).filter_by(ip_address=ip).first() is None:
                queryString = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,DEVICE_NAME from atom_table where IP_ADDRESS='{ip}';"
                result = db.session.execute(queryString)
                for row in result:
                    ipam = IPAM_DEVICES_TABLE()
                    ipam.ip_address = row[0]
                    ipam.device_type = row[1]
                    ipam.password_group = row[2]
                    ipam.device_name = row[3]
                    ipam.source = 'Atom'
                    if IPAM_DEVICES_TABLE.query.with_entities(IPAM_DEVICES_TABLE.ipam_id).filter_by(ip_address=ip).first() is not None:
                        ipam.ipam_id = IPAM_DEVICES_TABLE.query.with_entities(IPAM_DEVICES_TABLE.ipam_id).filter_by(ip_address=ip).first()[0]
                        UpdateData(ipam)
                        print("IP ADDRESS/DEVICE NAME IS DUPLICATE", file=sys.stderr)
                        response1 = 'response1'
                        responses.append(response1)
                    else:
                        InsertData(ipam)
                        print(ip, "INSERTION FROM ATOM WAS SUCCESSFUL",file=sys.stderr)
                        response = 'response'
                        
                        responses.append(response)
                            
            print(f"%%%%%%RESPONSES ARE {responses}",file=sys.stderr)
            responses1 = set(responses)
            responses = list(responses1)
            if True or False in responses:
                pass
            if len(responses)==1:
                if responses[0]=='response':
                    print(f"RETURNED INSERTION FROM ATOM",file=sys.stderr)
                    return "Device Added Successfully", 200
                elif responses[0]=='response1':
                    print(f"RETURNED UPDATION FROM ATOM",file=sys.stderr)
                    return "Device Updated Successfully",200
            elif len(responses)>1:
                print(f"RETURNED INSERTION/UPDATION FROM ATOM",file=sys.stderr)
                return "Device Added/Updated Successfully", 200
            else:
                print(f"RETURNED SOMETHING WENT WRONG",file=sys.stderr)
                return "Something Went Wrong",500

                
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/addIpamByDevice', methods=['POST'])
@token_required
def AddIpamByDevice(user_data):
    if True:
        response = False
        try:

            ips = request.get_json()
            print(ips, 'outside loop', file=sys.stderr)
            for ip in ips:
                print('inside loop', file=sys.stderr)
                if IPAM_DEVICES_TABLE.query.with_entities(IPAM_DEVICES_TABLE.ip_address).filter_by(ip_address=ip).first() is None:
                    queryString = f"select IP_ADDRESS,DEVICE_TYPE,DEVICE_NAME from device_table where IP_ADDRESS='{ip}';"
                    result = db.session.execute(queryString)
                    for row in result:
                        ipam = IPAM_DEVICES_TABLE()
                        match = re.match(r"[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}", row[0])
                        value = (bool(match))
                        if value:
                            ipam.ip_address = row[0]
                        else:
                            return "Invalid IP Address",500
                        ipam.device_type = row[1]
                        ipam.device_name = row[2]
                        ipam.source = 'Device'
                        InsertData(ipam)
                        print(ip, "INSERTION FROM DEVICE WAS SUCESSFUL",
                              file=sys.stderr)
                        response = True

                else:
                    print("IP ADDRESS/DEVICE NAME IS DUPLICATE", file=sys.stderr)
                    return jsonify({"Response": "IP ADDRESS IS DUPLICATE"}), 500
            if response == True:
                return jsonify({"Response": "OK"}), 200

        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/getAtominIpam', methods=['GET'])
@token_required
def GetAtomInIpam(user_data):
    if True:
        try:

            objList = []
            query = f"select IP_ADDRESS from ipam_devices_table;"
            res = db.session.execute(query)
            ipList = []
            for r in res:

                ipList.append(r[0])
            
            queryString = f"SELECT IP_ADDRESS,DEVICE_TYPE,DOMAIN,`FUNCTION`,ONBOARD_STATUS,DEVICE_NAME from atom_table;"
            result = db.session.execute(queryString)
            for row in result:
                if row[0] in ipList:
                    pass
                else:

                    ip_address = row[0]
                    device_type = row[1]
                    function = row[3]
                    onboard_status = row[4]
                    device_name = row[5]
                    objDict = {}
                    objDict['ip_address'] = ip_address
                    objDict['device_type'] = device_type
                    objDict['function'] = function
                    if onboard_status==None:
                        onboard_status='False'
                    elif onboard_status=='false':
                        onboard_status='False'
                    elif onboard_status=='true':
                        onboard_status='True'
                    
                    objDict['onboard_status'] = onboard_status
                    objDict['device_name'] = device_name
                    objList.append(objDict)
            print(objList, file=sys.stderr)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/getDeviceinIpam', methods=['GET'])
@token_required
def GetDeviceInIpam(user_data):
    if True:
        try:

            objList = []
            queryString = f"SELECT IP_ADDRESS,DEVICE_TYPE,DOMAIN,`FUNCTION`,STATUS,DEVICE_NAME from device_table;"
            result = db.session.execute(queryString)
            for row in result:
                ip_address = row[0]
                device_type = row[1]
                # domain = row[2]
                function = row[3]
                status = row[4]
                device_name = row[5]
                objDict = {}
                objDict['ip_address'] = ip_address
                objDict['device_type'] = device_type
                # objDict['domain'] = domain
                objDict['function'] = function
                objDict['status'] = status
                objDict['device_name'] = device_name
                objList.append(objDict)
            print(objList, file=sys.stderr)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route("/fetchIpamDevices", methods=['GET'])
@token_required
def FetchIpamDevices(user_data):
    if True:
        try:
            FetchIpamDevices(user_data)
            return jsonify("Success"), 200

        except Exception as e:
            traceback.print_exc()
            print(
                f"Exception Occured for  IPAM Devices {str(e)}", file=sys.stderr)
            return jsonify("Failure"), 500

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

def FetchIpamDevices(user_data):
    IpamList = []

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    query_string = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,SOURCE,DEVICE_NAME from ipam_devices_table;"
    result = db.session.execute(query_string)
    for row in result:
        ipamDict = {}
        ip_address = row[0]
        device_type = row[1]
        password_group = row[2]
        source = row[3]
        device_name = row[4]
        ipamDict['ip_address'] = ip_address
        ipamDict['device_type'] = device_type
        ipamDict['device_name'] = device_name
        if source == 'Atom' or source == 'Static':
            queryString1 = f"select USERNAME,PASSWORD from password_group_table where PASSWORD_GROUP='{password_group}'"
            result1 = db.session.execute(queryString1)
            for row in result1:
                username = row[0]
                password = row[1]
                ipamDict['username'] = username
                ipamDict['password'] = password
        if source == 'Device':
            queryString2 = f"select USERNAME,PASSWORD from password_group_table where PASSWORD_GROUP in (select PASSWORD_GROUP from atom_table);"
            result2 = db.session.execute(queryString2)
            for row in result2:
                username = row[0]
                password = row[1]
                ipamDict['username'] = username
                ipamDict['password'] = password

        IpamList.append(ipamDict)

    
    ############################## F5   ######################
    f5List=[]
    query_string = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,SOURCE,DEVICE_NAME from ipam_devices_table where device_type='f5_ltm';"
    result = db.session.execute(query_string)
    for row in result:
        ipamDict = {}
        ip_address = row[0]
        device_type = row[1]
        password_group = row[2]
        source = row[3]
        device_name = row[4]
        ipamDict['ip_address'] = ip_address
        ipamDict['device_type'] = device_type
        ipamDict['device_name'] = device_name
        ipamDict['time'] = current_time
        if source == 'Atom' or source == 'Static':
            queryString1 = f"select USERNAME,PASSWORD from password_group_table where PASSWORD_GROUP='{password_group}'"
            result1 = db.session.execute(queryString1)
            for row in result1:
                username = row[0]
                password = row[1]
                ipamDict['username'] = username
                ipamDict['password'] = password
        if source == 'Device':
            queryString2 = f"select USERNAME,PASSWORD from password_group_table where PASSWORD_GROUP in (select PASSWORD_GROUP from atom_table);"
            result2 = db.session.execute(queryString2)
            for row in result2:
                username = row[0]
                password = row[1]
                ipamDict['username'] = username
                ipamDict['password'] = password

        f5List.append(ipamDict)
 
    
    ############################## Firtinet VIP   ######################
    fortinetList=[]
    query_string = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,SOURCE,DEVICE_NAME from ipam_devices_table where device_type='fortinet';"
    result = db.session.execute(query_string)
    for row in result:
        ipamDict = {}
        ip_address = row[0]
        device_type = row[1]
        password_group = row[2]
        source = row[3]
        device_name = row[4]
        ipamDict['ip_address'] = ip_address
        ipamDict['device_type'] = device_type
        ipamDict['device_name'] = device_name
        ipamDict['time'] = current_time
        if source == 'Atom' or source == 'Static':
            queryString1 = f"select USERNAME,PASSWORD from password_group_table where PASSWORD_GROUP='{password_group}'"
            result1 = db.session.execute(queryString1)
            for row in result1:
                username = row[0]
                password = row[1]
                ipamDict['username'] = username
                ipamDict['password'] = password
        if source == 'Device':
            queryString2 = f"select USERNAME,PASSWORD from password_group_table where PASSWORD_GROUP in (select PASSWORD_GROUP from atom_table);"
            result2 = db.session.execute(queryString2)
            for row in result2:
                username = row[0]
                password = row[1]
                ipamDict['username'] = username
                ipamDict['password'] = password

        fortinetList.append(ipamDict)
 
    try:
        
        ipam = IPAM()
    except Exception as e:
        traceback.print_exc()
        print("Exception Occured In IPAM", file=sys.stderr)
    
    try:
    
        f5 = F5()

    except Exception as e:
        traceback.print_exc()
        print("Exception Occured In IPAM", file=sys.stderr)

    try:
    
        fortigate = FORTIGATEVIP()

    except Exception as e:
        traceback.print_exc()
        print("Exception Occured In IPAM", file=sys.stderr)


    #Update Script Status
    
    ipamStatus = INVENTORY_SCRIPTS_STATUS.query.filter(INVENTORY_SCRIPTS_STATUS.script=="IPAM").first()

    try:
        ipamStatus.script = "IPAM"
        ipamStatus.status = "Running"
        ipamStatus.creation_date= current_time
        ipamStatus.modification_date= current_time
        
        InsertData(ipamStatus)
    
    except Exception as e:
        db.session.rollback()
        print(f"Error while updating script status {e}", file=sys.stderr)
    try:
        ipam.getIpam(IpamList)
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
    
    try:
        print("Scanning  F5", file=sys.stderr)
        f5.getF5(f5List)
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)

    try:
        print("Scanning Fortinet Firewalls", file=sys.stderr)
        fortigate.getFirewallVip(fortinetList)
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)

    try:
        ipamStatus.script = "IPAM"
        ipamStatus.status = "Completed"
        ipamStatus.creation_date= current_time
        ipamStatus.modification_date= current_time
        db.session.add(ipamStatus)
        db.session.commit() 
    
    except Exception as e:
        db.session.rollback()
        print(f"Error while updating script status {e}", file=sys.stderr)

@app.route("/getIpamFetchStatus", methods = ['GET'])
@token_required
def GetIpamFetchStatus(user_data):
    if True:#request.headers.get('X-Auth-Key') == session.get('token', None):
        ipam={}
        
        #Getting status of script
        script_status=""
        script_modifiation_date=""
        ipamStatus = INVENTORY_SCRIPTS_STATUS.query.filter(INVENTORY_SCRIPTS_STATUS.script== "IPAM").first()
        if ipamStatus:
            script_status= ipamStatus.status
            script_modifiation_date= str(ipamStatus.modification_date)
        ipam["fetch_status"] = script_status
        ipam["fetch_date"]= script_modifiation_date

        content = gzip.compress(json.dumps(ipam).encode('utf8'), 5)
        response = make_response(content)
        response.headers['Content-length'] = len(content)
        response.headers['Content-Encoding'] = 'gzip'
        return response
    else: 
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

        
@app.route('/getAllIpamFetchDevices', methods=['GET'])
@token_required
def HetAllIpamFetchDevices(user_data):
    if True:
        try:
            objList = []
            queryString = f"select IPAM_ID,IP_ADDRESS,DEVICE_NAME,INTERFACE,INTERFACE_IP,SUBNET,SUBNET_MASK,INTERFACE_DESCRIPTION,VIRTUAL_IP,VLAN,VLAN_NUMBER,INTERFACE_STATUS,FETCH_DATE FROM ipam_devices_fetch_table where FETCH_DATE=(select MAX(FETCH_DATE) from ipam_devices_fetch_table);"
            ipamObjs = db.session.execute(queryString)
            for ipamObj in ipamObjs:
                # print(ipamObj,file=sys.stderr)
                objDict = {}
                objDict['ipam_id'] = ipamObj[0]
                objDict['ip_address'] = ipamObj[1]
                objDict['device_name'] = ipamObj[2]
                objDict['interface'] = ipamObj[3]
                objDict['interface_ip'] = ipamObj[4]
                objDict['subnet'] = ipamObj[5]
                objDict['subnet_mask'] = ipamObj[6]
                objDict['interface_description'] = ipamObj[7]
                objDict['virtual_ip'] = ipamObj[8]
                objDict['vlan'] = ipamObj[9]
                objDict['vlan_number'] = ipamObj[10]
                objDict['interface_status'] = ipamObj[11]
                objDict['fetch_date'] = FormatDate(ipamObj[12])
                objList.append(objDict)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/getAllIpamDates', methods=['GET'])
@token_required
def GetAllIpamDates(user_data):

    if True:  # session.get('token', None):
        try:

            dates = []
            queryString = "select distinct(FETCH_DATE) from  ipam_devices_fetch_table ORDER BY FETCH_DATE DESC;"

            result = db.session.execute(queryString)

            for row in result:
                # print(row[0], file=sys.stderr)
                dates.append(row[0])

            return jsonify(dates), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route("/getIpamByDate", methods=['POST'])
@token_required
def GetPnCodeByDate(user_data):

    # request.headers.get('X-Auth-Key') == session.get('token', None):
    if True:
        try:

            dateObj = request.get_json()
            # print(type(dateObj['date']), file=sys.stderr)
            print(dateObj,file=sys.stderr)
        
            utc = datetime.strptime(
                dateObj['dict'], '%a, %d %b %Y %H:%M:%S GMT')
            print(utc, file=sys.stderr)
            current_time = utc.strftime("%Y-%m-%d %H:%M:%S")
            print('current_time is :',current_time,file=sys.stderr)
            print(current_time, file=sys.stderr)
            objList = []
            # ipamObjs = db.session.query(IPAM_DEVICES_FETCH_TABLE).filter_by(fetch_date=current_time).all()
            queryString = f"SELECT IP_ADDRESS,FETCH_DATE,DEVICE_NAME,INTERFACE,INTERFACE_DESCRIPTION,INTERFACE_IP,INTERFACE_STATUS,SUBNET,SUBNET_MASK,VIRTUAL_IP,VLAN,VLAN_NUMBER from ipam_devices_fetch_table where FETCH_DATE='{utc}';"
            ipamObjs = db.session.execute(queryString)
            for ipamObj in ipamObjs:

                objDict = {}


                objDict['ip_address'] = ipamObj[0]
                objDict["fetch_date"] = FormatDate(ipamObj[1])
                objDict["device_name"] = ipamObj[2]
                objDict["interface"] = ipamObj[3]
                objDict["interface_description"] = ipamObj[4]
                objDict["interface_ip"] = ipamObj[5]
                objDict["interface_status"] = ipamObj[6]
                objDict["subnet"] = ipamObj[7]
                objDict["subnet_mask"] = ipamObj[8]
                objDict["virtual_ip"] = ipamObj[9]
                objDict["vlan"] = ipamObj[10]
                objDict["vlan_number"] = ipamObj[11]
                objList.append(objDict)
            print(objList, file=sys.stderr)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route('/addSubnetStatically',methods = ['POST'])
@token_required
def AddSubnetStatically(user_data):
    if True:
        try:
            response = False
            subnetObj = request.get_json()
            subnet = SUBNET_DATA_TABLE()
            if SUBNET_DATA_TABLE.query.with_entities(SUBNET_DATA_TABLE.subnet).filter_by(subnet=subnetObj['subnet']).first() is None:
                subnet.subnet = subnetObj['subnet']
                subnet.subnet_mask = subnetObj['subnet_mask']
                if 'subnet_name' in subnetObj:

                    subnet.subnet_name = subnetObj['subnet_name']
                else:
                    subnet.subnet_name = 'N/A'
                if 'location' in subnetObj:

                    subnet.location = subnetObj['location']
                else:
                    subnet.location = 'N/A'
                InsertData(subnet)
                print(f"Subnet {subnetObj['subnet']} Inserted Succesfully",file=sys.stderr)
                response = True
            else:
                return jsonify({"Reponse":"Duplicate Subnet Found"}),500
        except Exception as e:
            traceback.print_exc()
            print(str(e),file=sys.stderr)
            return str(e),500
        if response:
            return jsonify({"Response": "OK"}), 200
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route('/addSubnetsByExcel',methods = ['POST'])
@token_required
def AddSubnetsByExcel(user_data):
    if True:
        response = False
        try:
            subnetObjs = request.get_json()
            for subnetObj in subnetObjs:
                subnet = SUBNET_DATA_TABLE()
            if SUBNET_DATA_TABLE.query.with_entities(SUBNET_DATA_TABLE.subnet).filter_by(subnet=subnetObj['subnet']).first() is None:
                subnet.subnet = subnetObj['subnet']
                subnet.subnet = subnetObj['subnet_mask']
                if 'subnet_name' in subnetObj:

                    subnet.subnet = subnetObj['subnet_name']
                else:
                    subnet.subnet = 'N/A'
                if 'location' in subnetObj:

                    subnet.location = subnetObj['location']
                else:
                    subnet.location = 'N/A'
                InsertData(subnet)
                print(f"Subnet {subnetObj['subnet']} Inserted Succesfully",file=sys.stderr)
                response = True
            else:
                print(f"Duplicate Subnet Found for Subnet {subnetObj['subnet']}",file=sys.stderr)
                return jsonify({"Reponse":f"Duplicate Subnet Found for Subnet {subnetObj['subnet']}"}),500

        except Exception as e:
            traceback.print_exc()
            print(str(e),file=sys.stderr)
            return str(e),500
        if response:
            return jsonify({"Response": "OK"}), 200
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route('/getSubnetsFromDevice',methods = ['GET'])
def GetSubnetsFromDevice():
    if True:
        try:
            response = False
            
            objList = []

            queryString = f"select DISTINCT IP_ADDRESS, ANY_VALUE(DEVICE_NAME) from ipam_devices_fetch_table where DISCOVERED='Not Discovered';"
            result = db.session.execute(queryString)
            
            for row in result:
                objDict = {}
                objDict['subnet_address'] = row[0]
                objDict['device_name'] = row[1]
                objList.append(objDict)
            response=True
                        
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
        if response==True:
            return jsonify(objList),200
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401
@app.route('/scanSubnets',methods=['POST'])
@token_required
def ScanSubnets(user_data):
    if True:
        try:
            subnetObjs = request.get_json()
            print(subnetObjs,file=sys.stderr)
            for subnet in subnetObjs.get('subnets'):
                ExecuteDBQuery(f"UPDATE subnet_display_table set STATUS='Waiting' WHERE SUBNET_ADDRESS= '{subnet}';")
                ExecuteDBQuery(f"UPDATE ip_table SET MAC_ADDRESS='', CONFIGURATION_INTERFACE='', CONFIGURATION_SWITCH='', STATUS='', OPEN_PORTS='', IP_TO_DNS='', DNS_TO_IP='', VIP, STATUS_HISTORY='' where SUBNET='{subnet}';")

        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500 
        Thread(target=MultiPurpose, args=(subnetObjs.get('options'),)).start()
        return jsonify({'RESPONSE':"OK"}),200
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route('/addSubnetInSubnet',methods=['POST'])
@token_required
def AddSubnetInSubnet(user_data):
    if True:
        try:
            response = False
            subnetObjs = request.get_json()
            print(subnetObjs,file=sys.stderr)
            for subnetObj in subnetObjs:

                subnetDb = SUBNET_DISPLAY_TABLE()
                
                if 'subnet_address' in subnetObj:
                    subnet = subnetObj['subnet_address']
                    
                    queryString2 = f"select DEVICE_NAME from device_table where IP_ADDRESS in(select distinct IP_ADDRESS from ipam_devices_fetch_table where SUBNET='{subnetObj['subnet_address']}');"
                    result2 = db.session.execute(queryString2)
                    subnetDb.discover_from=''
                    for row in result2:
                        subnetDb.discover_from = row[0]
                    subnetDb.subnet_address = subnet
                if 'subnet_name' in subnetObj:
                    subnetDb.subnet_name = subnetObj['subnet_name']
                if 'location' in subnetObj:
                    subnetDb.location = subnetObj['location']
                if 'subnet_mask' in subnetObj:
                    subnetDb.subnet_mask = subnetObj['subnet_mask']
                if 'size' in subnetObj:
                    subnetDb.size = subnetObj['size']
                if 'usage' in subnetObj:
                    subnetDb.size = 0
                subnetDb.status = 'Waiting'            
                subnetDb.scan_date = datetime.now()         
                if SUBNET_DATA_TABLE.query.with_entities(SUBNET_DISPLAY_TABLE.subnet_address).filter_by(subnet_address=subnetObj['subnet_address']).first() !=None:
                    
                    ExecuteDBQuery(f"UPDATE subnet_display_table set SUBNET_MASK='{subnetDb.subnet_mask}', SUBNET_NAME='{subnetDb.subnet_name}', LOCATION='{subnetDb.location}', DISCOVER_FROM='{subnetDb.discover_from}', SIZE='', `USAGE`='', STATUS='Not Scanned' WHERE SUBNET_ADDRESS= '{subnet}';")
                    #InsertData(subnetDb)
                    print(f'{subnetDb.subnet_address} Inserted Successfully')
                    queryString1 = f"select DISCOVERED from ipam_devices_fetch_table where SUBNET='{subnetObj['subnet_address']}';"
                    result1 = db.session.execute(queryString1)
                    for row in result1:
                        if row[0]=='Discovered':
                            queryString2 = f"update ipam_devices_fetch_table set DISCOVERED='Not Discovered' where DISCOVERED='Discovered' and SUBNET='{subnetObj['subnet_address']}';"
                            db.session.execute(queryString2)
                            db.session.commit()
                    response = True
                else:
                    InsertData(subnetDb)
                    print(f'{subnetDb.subnet_address} Updated Successfully')
                    response = True

                try:
                    ips = GetIps(subnet)
                    for ip in ips:
                        ipExists=False
                        result10= SelectFromDB(f"SELECT IP_ADDRESS FROM ip_table where IP_ADDRESS='{ip}' and SUBNET= '{subnet}';")
                        for row in result10:
                            if ip== row[0]:
                                ipExists=True
                        
                        if ipExists:
                            ExecuteDBQuery(f"UPDATE ip_table SET MAC_ADDRESS='', CONFIGURATION_INTERFACE='', CONFIGURATION_SWITCH='', STATUS='', OPEN_PORTS='', IP_TO_DNS='', DNS_TO_IP='', STATUS_HISTORY='', VIP='' ;")
                            print(f"IP {ip} AND SUBNET {subnet} Reset SUCCESSFULLY",file=sys.stderr)
                        #else:
                        #    ExecuteDBQuery(f"INSERT INTO ip_table (IP_ADDRESS, SUBNET) VALUES ('{ip}','{subnet}');")
                        #    print(f"IP {ip} AND SUBNET {subnet} INSERTED SUCCESSFULLY",file=sys.stderr)
                        
                except Exception as e:
                    ExecuteDBQuery(f"update subnet_display_table set status='Waiting' where subnet_address='{subnet}' and status='Scanning';")
                    traceback.print_exc()
            return jsonify({'RESPONSE':"OK"}),200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500 
        #if response==True:
        #    Thread(target=MultiPurpose).start()
            return jsonify({'RESPONSE':"OK"}),200
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route('/getAllSubnets',methods = ['GET'])
@token_required
def GetAllSubnets(user_data):
    if True:
        try:
            objList = []
            queryString = f"select distinct subnet_address,subnet_name,subnet_mask,size,`usage`,location,discover_from,scan_date,status,subnet_id from subnet_display_table;"
            subnetObjs=db.session.execute(queryString)
            for subnetObj in subnetObjs:
                objDict = {}
                objDict['subnet_address'] = subnetObj[0]
                objDict['subnet_name'] = subnetObj[1]
                objDict['subnet_mask'] = subnetObj[2]
                objDict['size'] = subnetObj[3]
                objDict['usage'] = subnetObj[4]
                objDict['location'] = subnetObj[5]
                objDict['discover_from'] = subnetObj[6]
                
                
                objDict['scan_date'] = (subnetObj[7])
                objDict['status'] = subnetObj[8]
                objDict['subnet_id'] = subnetObj[9]
                objList.append(objDict)
            print(objList,file=sys.stderr)
            return jsonify(objList),200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500 
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route('/addSubnetFromDevice',methods = ['POST'])
@token_required
def AddSubnetFromDevice(user_data):
    if True:
        try:
            response = False
            subnetObjs = request.get_json()
            ipamDb = IPAM_DEVICES_FETCH_TABLE()
            for subnetObj in subnetObjs:
                print(subnetObj,file=sys.stderr)
                ipam = IPAM_DEVICES_FETCH_TABLE().query.with_entities(IPAM_DEVICES_FETCH_TABLE.ip_address).filter_by(ip_address=subnetObj).first()[0]
                if ipam is not None:
                    print(ipam,file=sys.stderr)
                    queryString = f"update ipam_devices_fetch_table set DISCOVERED='Discovered' where DISCOVERED='Not Discovered' and IP_ADDRESS='{ipam}';"
                    db.session.execute(queryString)
                    db.session.commit()
                    print(f"Discovery Status Updated for {subnetObj} Successfully",file=sys.stderr)
                    response=True
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
        if response==True:
            return jsonify({"Response":"OK"}),200 
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401                
                
@app.route('/getAllDiscoveredSubnets',methods = ['GET'])
@token_required
def GetAllDiscoveredSubnets(user_data):
    if True:
        try:
            objList = []
            queryString = f"select DISTINCT SUBNET,SUBNET_MASK,SIZE,DEVICE_NAME,SUBNET_NAME from ipam_devices_fetch_table where Discovered='Discovered';"
            result = db.session.execute(queryString)
            for row in result:
                objDict = {}
                objDict['subnet_address'] = row[0]
                objDict['subnet_mask'] = row[1]
                objDict['size'] = row[2]
                objDict['discover_from'] = row[3]
                objDict['subnet_name'] = row[4]
                objDict['status'] = 'Yet to Approve'
                objList.append(objDict)
            return jsonify(objList),200
        
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
        if response==True:
            return jsonify({"Response":"OK"}),200 
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  

@app.route('/getDataInIpDetails',methods = ['GET'])
@token_required
def GetDataInIpDetails(user_data):
    if True:
        try:

            ipObjs = IP_TABLE.query.all()
            objList = []
            for ipObj in ipObjs:
                objDict = {}
                objDict['ip_address'] = ipObj.ip_address
                objDict['subnet'] = ipObj.subnet
                objDict['mac_address'] = ipObj.mac_address
                objDict['status'] = ipObj.status
                objDict['asset_tag'] = ipObj.asset_tag
                objDict['configuration_switch'] = ipObj.configuration_switch
                objDict['configuration_interface'] = ipObj.configuration_interface
                objDict['open_ports'] = ipObj.open_ports
                objDict['ip_to_dns'] = ipObj.ip_to_dns
                objDict['dns_to_ip'] = ipObj.dns_to_ip
                objDict['asset_tag'] = ipObj.asset_tag
                objDict['vip'] = ipObj.vip
                objList.append(objDict)
                
            return jsonify(objList),200
        except Exception as e:
            print(str(e))
            traceback.print_exc()
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  

def ExecuteDBQuery(query_string):
    try:
        db.session.execute(query_string)
        db.session.commit()

    except Exception as e:
        print(f"Exception Occured in Executing Database Query {e}", file=sys.stderr)

def SelectFromDB(query_string):
    try:
        result = db.session.execute(query_string)
        return result
    except Exception as e:
        print(f"Exception Occured in Executing Select Query {e}",file=sys.stderr)

def PingTest(host, subnet):
    global upIpsQueue
    try:
        parameter = '-n' if platform.system().lower()=='windows' else '-c'

        command = ['ping', parameter, '3', host]
        response = subprocess.call(command)

        if response == 0:
            #return True
            upIpsQueue.append(host)
            time = datetime.now()
            ExecuteDBQuery(f"update ip_table set STATUS='Used', STATUS_HISTORY='UP',LAST_USED='{time}' where IP_ADDRESS='{host}' and SUBNET='{subnet}';")
            ExecuteDBQuery(f"insert into ip_details_history_table (`IP_ADDRESS`,`STATUS`,`DATE`) VALUES ('{host}','Used','{time}');")
            usage =UsageCalculator(len(upIpsQueue),sizeCalculator(subnet))
            ExecuteDBQuery(f"update subnet_display_table set `usage`='{usage}' where subnet_address='{subnet}';")
        else:
            #return False
            time = datetime.now()
            ExecuteDBQuery(f"update ip_table set STATUS='Available',LAST_USED='{time}' where IP_ADDRESS='{host}' and SUBNET='{subnet}';")  
            ExecuteDBQuery(f"insert into ip_details_history_table (`IP_ADDRESS`,`STATUS`,`DATE`) VALUES ('{host}','Available','{time}');")
    except Exception as e:
        print("Exception Occured in Ping")
        return False

def CheckUpIps(subnet):
    upCount=0
    upIpsList= []
    ips = GetIps(subnet)
    '''
    for ip in ips:
        status=PingTest(str(ip))
        if status:
            upCount+=1
            upIpsList.append(ip)
            ExecuteDBQuery(f"update ip_table set STATUS='Used' where IP_ADDRESS='{ip}' and SUBNET='{subnet}';")

            usage =UsageCalculator(len(upIpsList),sizeCalculator(subnet))
            ExecuteDBQuery(f"update subnet_display_table set `usage`='{usage}' where subnet_address='{subnet}';")
        else:
            ExecuteDBQuery(f"update ip_table set STATUS='Available' where IP_ADDRESS='{ip}' and SUBNET='{subnet}';")    
    
    '''
    threads =[]
    global upIpsQueue
    upIpsQueue= []
    
    for ip in ips:
        th = threading.Thread(target=PingTest, args=(str(ip), subnet,))
        th.start()
        threads.append(th)
        if len(threads) == CheckUpIps: 
            for t in threads:
                t.join()
            threads =[]
    
    else:
        for t in threads: # if request is less than connections_limit then join the threads and then return data
            t.join()
        #return upIpsList
    upIpsList= upIpsQueue.copy()
    
    return upIpsQueue

def calculateDnsName(subnet):
    #for row in result:
        #ip = row[0]
        #dns_name=DnsName(ip)
        #ExecuteDBQuery(f"update ip_table set ip_to_dns='{dns_name}' where IP_ADDRESS='{ip}';")
    
        #print(f"DNS NAME {dns_name} INSERTED SUCCESSFULLY AGAINST {ip}",file=sys.stderr)

    threads =[]
    result= SelectFromDB (f"select IP_ADDRESS from ip_table WHERE STATUS='Used' and SUBNET= '{subnet}';")
    for row in result:
        ip = row[0]
        th = threading.Thread(target=DnsName, args=(ip,))
        th.start()
        threads.append(th)
        if len(threads) == totalDnsNameThreads: 
            for t in threads:
                t.join()
            threads =[]

    else:
        for t in threads: # if request is less than connections_limit then join the threads and then return data
            t.join()

def calculateDnsIp(subnet):
    #for row in result:
        #ip = row[0]
        #dns_name=DnsName(ip)
        #ExecuteDBQuery(f"update ip_table set ip_to_dns='{dns_name}' where IP_ADDRESS='{ip}';")
    
        #print(f"DNS NAME {dns_name} INSERTED SUCCESSFULLY AGAINST {ip}",file=sys.stderr)

    threads =[]
    result= SelectFromDB (f"select IP_ADDRESS from ip_table WHERE STATUS='Used' and SUBNET= '{subnet}';")
    for row in result:
        ip = row[0]
        th = threading.Thread(target=DnsIp, args=(ip,))
        th.start()
        threads.append(th)
        if len(threads) == totalDnsIpThreads: 
            for t in threads:
                t.join()
            threads =[]

    else:
        for t in threads: # if request is less than connections_limit then join the threads and then return data
            t.join()

def getPhysicalMapping(subnet_list):
    threads =[]
    pm= IPAMPM()

    for subnet in subnet_list:
        hosts= []
        #result= SelectFromDB (f"SELECT DISCOVER_FROM from subnet_display_table where SUBNET_ADDRESS='{subnet}';")
        result= SelectFromDB (f"SELECT DEVICE_NAME from ipam_devices_fetch_table where SUBNET='{subnet}';")
        #print(result, file=sys.stderr)
        for row in result:
            device_name = row[0]
            if device_name:
                ip_address=password_group=device_type=user_name=password=""
                result2= SelectFromDB (f"SELECT IP_ADDRESS from ipam_devices_fetch_table where device_name='{device_name}';")
                for row in result2:
                    ip_address= row[0]
                    print(ip_address, file=sys.stderr)
                
                if ip_address:
                    result3= SelectFromDB (f"SELECT PASSWORD_GROUP, DEVICE_TYPE from atom_table where ip_address='{ip_address}';")
                    for row in result3:
                        password_group= row[0]
                        device_type= row[1]
                    print(ip_address, file=sys.stderr)

                    if password_group:
                        result4= SelectFromDB (f"SELECT USERNAME, PASSWORD FROM password_group_table WHERE PASSWORD_GROUP='{password_group}';")
                        for row in result4:
                            user_name= row[0]
                            password= row[1]
                        print(ip_address, file=sys.stderr)

                    host={
                        "ip_address": ip_address,
                        "user": user_name,
                        "pwd": password,
                        "sw_type": device_type,
                        #"time":(datetime.now())
                        "device_name":device_name
                        }
                    hosts.append(host)
                    print(f'Host Is {host}', file=sys.stderr)
        pm.get_inventory_data(hosts)        
                    #th = threading.Thread(target=pm.poll, args=(host,))
                    #th.start()
                    #threads.append(th)
                    #if len(threads) == totalDnsIpThreads: 
                    #    for t in threads:
                    #        t.join()
                    #    threads =[]
        
    #else:
    #    for t in threads: # if request is less than connections_limit then join the threads and then return data
    #        t.join()

def MultiPurpose(options):
    size = 0
    total_up_ips=0
    subnett = '' 
    print("SCHEDULER STARTED",file=sys.stderr)
    result = SelectFromDB(f"select SUBNET_ADDRESS from subnet_display_table where STATUS='Waiting';")
    subnets_list = []
    for row in result:
        try:
            subnets_list.append(row[0])
        except Exception as e:
            traceback.print_exc()
        
    try:
        
        for subnet in subnets_list:
            subnett = subnet
            # Calculate Size
            try:
                ExecuteDBQuery(f"update subnet_display_table set status='Scanning' where subnet_address='{subnet}';")
                
                print(f"STATUS UPDATE SUCCESSFULLY FOR {subnet}",file=sys.stderr)
                size = sizeCalculator(subnet)
                ExecuteDBQuery(f"update subnet_display_table set size='{size}' where subnet_address='{subnet}';")
                
                print(f"SIZE UPDATE SUCCESSFULLY FOR {subnet}",file=sys.stderr)
            except Exception as e:
                SelectFromDB(f"update subnet_display_table set status='Failed' where subnet_address='{subnet}' and status='Scanning';")
                traceback.print_exc()
        
        for subnet in subnets_list:
            #Get Ips
            print("Getting IP Addresses", file=sys.stderr)
            try:
                ips = GetIps(subnet)
                date = datetime.now()
                for ip in ips:
                    ipExists=False
                    result10= SelectFromDB(f"SELECT IP_ADDRESS FROM ip_table where IP_ADDRESS='{ip}' and SUBNET= '{subnet}';")
                    for row in result10:
                        if ip== row[0]:
                            ipExists=True
                    
                    if ipExists:
                        pass
                    #    ExecuteDBQuery(f"UPDATE ip_table SET MAC_ADDRESS='', CONFIGURATION_INTERFACE='', CONFIGURATION_SWITCH='', STATUS='', OPEN_PORTS='', ASSEt_TAG='', IP_TO_DNS='', DNS_TO_IP='', STATUS_HISTORY='' ;")
                    #    print(f"IP {ip} AND SUBNET {subnet} INSERTED SUCCESSFULLY",file=sys.stderr)
                    else:
                        ExecuteDBQuery(f"INSERT INTO ip_table (IP_ADDRESS, SUBNET) VALUES ('{ip}','{subnet}');")
                        print(f"IP {ip} AND SUBNET {subnet} INSERTED SUCCESSFULLY",file=sys.stderr)
                    
            except Exception as e:
                ExecuteDBQuery(f"update subnet_display_table set status='Failed', scan_date='{datetime.now()}' where subnet_address='{subnet}' and status='Scanning';")
                traceback.print_exc()
            
            print("Finished Getting IP Addresses", file=sys.stderr)

        for subnet in subnets_list:    
            print("Calculating Usage", file=sys.stderr)
            
            try:
                upIpsList= CheckUpIps(subnet) #UpIps(subnet)    

                usage =UsageCalculator(len(upIpsList),sizeCalculator(subnet))

                ExecuteDBQuery(f"update subnet_display_table set `usage`='{usage}' where subnet_address='{subnet}';")
                print(f"USAGE {usage} UPDATED SUCCESSFULLY FOR {subnet}",file=sys.stderr)
                                    
            except Exception as e:
                ExecuteDBQuery(f"update subnet_display_table set status='Failed', scan_date='{datetime.now()}' where subnet_address='{subnet}' and status='Scanning';")
                traceback.print_exc()
            print("Finished Calculating Usage", file=sys.stderr)
        
        ##Populating F5 VIP
        for subnet in subnets_list: 
            print("Populating F5 VIP", file=sys.stderr)
            result= SelectFromDB (f"select IP_ADDRESS from ip_table WHERE SUBNET= '{subnet}';")
            for row in result:
                try:
                    ip = row[0]   
                    result2= SelectFromDB (f"select vip from f5 WHERE NODE= '{ip}';")
                    vip=""
                    for row in result2:
                        vip = row[0] 
                    ExecuteDBQuery(f"update ip_table set vip='{vip}' where IP_ADDRESS='{ip}';")
                except Exception as e:
                    print(str(e))
                    traceback.print_exc()
            print("Finished Populating F5 VIPS", file=sys.stderr)

        ## Populating Firewall VIP
        for subnet in subnets_list: 
            print("Populating Firewall VIP", file=sys.stderr)
            result= SelectFromDB (f"select IP_ADDRESS from ip_table WHERE SUBNET= '{subnet}';")
            for row in result:
                try:
                    ip = row[0]   
                    result2= SelectFromDB (f"select vip from firewall_vip WHERE INTERNAL_IP= '{ip}';")
                    vip=""
                    for row in result2:
                        vip = row[0] 
                    ExecuteDBQuery(f"update ip_table set vip='{vip}' where IP_ADDRESS='{ip}';")
                except Exception as e:
                    print(str(e))
                    traceback.print_exc()
            print("Finished Populating Firewall VIPS", file=sys.stderr)
        
        if "DNS Scan" in options:
            for subnet in subnets_list:    
                print("Resolving Host IP's", file=sys.stderr)
                try:
                    
                    calculateDnsIp(subnet)
                    #for row in result:
                    #    ip = row[0]
                    #    dns_ip=DNSIP(ip)
                    #    ExecuteDBQuery(f"update ip_table set dns_to_ip='{dns_ip}' where IP_ADDRESS='{ip}';")
                    
                    #    print(f"DNS NAME {dns_ip} INSERTED SUCCESSFULLY AGAINST {ip}",file=sys.stderr)
                except Exception as e:
                    print(str(e))
                    traceback.print_exc()
            

            print("Finished Resolving Host IP's", file=sys.stderr)
    
        try:
            print("Getting Physical Mapping", file=sys.stderr)
            getPhysicalMapping(subnets_list)
        except Exception as e:
            print("Exception Occured in Physical Mapping", file=sys.stderr)

            print("Finished Getting Physical Mapping", file=sys.stderr)

        # if "Port Scan" in options:
        #     try:
        #         print("Scanning Ports", file=sys.stderr)
        #         scanPorts(subnet)

        #     except Exception as e:
        #         print("Failed To Scan Ports", file=sys.stderr)
        #     print("Finished Scanning Ports", file=sys.stderr)
        scanPorts(subnet)
            # for subnet in subnets_list:
            #     print("Scanning Ports", file=sys.stderr)
            #     result8 =SelectFromDB(f"select IP_ADDRESS from ip_table where STATUS='Used' and SUBNET='{subnet}';")
            #     try:
            #         for row in result8:
            #             open_ports = PortScanner(row[0])
            #             print("Open Ports Are:  ", file=sys.stderr)

            #             ExecuteDBQuery(f"update ip_table set open_ports='{open_ports}' where IP_ADDRESS='{row[0]}';")
            #             print(f"OPEN PORTS ARE ADDED SUCCESSFULLY FOR {row[0]}",file=sys.stderr)
            #     except Exception as e:
            #         traceback.print_exc()
            #     print("Finished Scanning Ports", file=sys.stderr)
        
        ExecuteDBQuery(f"update subnet_display_table set STATUS='Scanned', scan_date='{datetime.now()}' where SUBNET_ADDRESS='{subnett}';")
        print(f"Finished Subnet {subnett} Scanning", file=sys.stderr)
            
        
    except Exception as e:
        queryString1= f"update subnet_display_table set status='Failed', scan_date='{datetime.now()}' where subnet_address='{subnet}' and status='Scanning';"
        db.session.execute(queryString1)
        db.session.commit()
        traceback.print_exc()

@app.route('/getSubnetByIpAddress',methods=['GET','POST'])
@token_required
def GetSubnetByIpAddress(user_data):
    if True:
        try:
            objList = []
            subnet = request.args.get('ipaddress')
            print(subnet,file=sys.stderr)
            queryString = f"select IP_ADDRESS, STATUS,SUBNET,MAC_ADDRESS,`TYPE`,CONFIGURATION_SWITCH,CONFIGURATION_INTERFACE,OPEN_PORTS,IP_TO_DNS,DNS_TO_IP,ASSET_TAG,LAST_USED from ip_table where SUBNET='{subnet}';"
            result = db.session.execute(queryString)
            for row in result:
                ip_address = row[0]
                status = row[1]
                mac = row[3]
                conf_switch = row[5]
                conf_int = row[6]
                open_ports = row[7]
                dns_to_ip = row[8]
                ip_to_dns = row[9]
                asset_tag = row[10]
                last_used = row[11]
                objDict = {}
                objDict['ip_address'] = ip_address
                objDict['status'] = status
                objDict['mac'] = mac
                objDict['conf_switch'] = conf_switch
                objDict['conf_int'] = conf_int
                objDict['open_ports'] = open_ports
                objDict['dns_to_ip'] = dns_to_ip
                objDict['ip_to_dns'] = ip_to_dns
                objDict['asset_tag'] = asset_tag
                objDict['last_used'] = (last_used)

                objList.append(objDict)
            print(objList,file=sys.stderr)
            return jsonify(objList),200
        
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  

@app.route("/editAssetType", methods = ['POST'])
@token_required
def EditAssetType(user_data):    
    if True:#session.get('token', None):
        try:

            assetTagObj = request.get_json()
            print(assetTagObj,file = sys.stderr)
            
            assetTag= assetTagObj['asset_tag']
            ipAddress= assetTagObj['ip_address']               
            if assetTag and ipAddress:
                ExecuteDBQuery(f"UPDATE ip_table set asset_tag= '{assetTag}' where IP_ADDRESS= '{ipAddress}'")
                ExecuteDBQuery(f"UPDATE ip_history_table set asset_tag= '{assetTag}' where IP_ADDRESS= '{ipAddress}'")
            
            return jsonify({'response': "success","code":"200"})
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else: 
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route('/ipHistory',methods = ['GET'])
@token_required
def GetIpHistory(user_data):
    if True:
        try:
            queryString = f"select IP_ADDRESS,MAC_ADDRESS,ASSET_TAG,`DATE` from ip_history_table;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                ip_address = row[0]
                mac_address = row[1]
                asset_tag = row[2]
                date = row[3]
                objDict = {}
                objDict['ip_address'] = ip_address
                objDict['mac_address'] = mac_address
                objDict['asset_tag'] = (asset_tag)
                objDict['date'] = date
                objList.append(objDict)
            return jsonify(objList),200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  

@app.route('/deleteIpamDevice',methods = ['POST'])
@token_required
def DeleteIpamDevice(user_data):
    if True:
        try:
            ipObjs = request.get_json()
            for ip in ipObjs:
                queryString = f"delete from ipam_devices_table where IP_ADDRESS='{ip}';"
                db.session.execute(queryString)
                db.session.commit()
                print("DEVICE {ip} DELETED SUCCESSFULLY",file=sys.stderr)
            return "DELETION SUCCESSFUL",200
        except Exception as e:
            print(str(e),file=sys.sytderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  

@app.route('/editIpamDevice',methods = ['POST'])
@token_required
def EditIpamDevice(user_data):
    if True:
        try:
            deviceObj = request.get_json()
            # for deviceObj in deviceObjs:
            queryString = f"update ipam_devices_table set IP_ADDRESS='{deviceObj['ip_address']}' where IPAM_ID='{deviceObj['ipam_id']}';"
            db.session.execute(queryString)
            queryString1 = f"update ipam_devices_table set DEVICE_TYPE='{deviceObj['device_type']}' where IPAM_ID='{deviceObj['ipam_id']}';"
            db.session.execute(queryString1)
            try:
                queryString2 = f"update ipam_devices_table set DEVICE_NAME='{deviceObj['device_name']}' where IPAM_ID='{deviceObj['ipam_id']}';"
                db.session.execute(queryString2)
            except Exception as e:
                print(str(e),file=sys.stderr)
                traceback.print_exc()
                return "Device Name Already Exists",500

            queryString3 = f"update ipam_devices_table set PASSWORD_GROUP='{deviceObj['password_group']}' where IPAM_ID='{deviceObj['ipam_id']}';"
            db.session.execute(queryString3)
            db.session.commit()
            print(f"DEVICE {deviceObj['ip_address']} UPDATED SUCCESSFULLY ",file=sys.stderr)
            return "UPDATED SUCCESSFULLY",200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  

@app.route('/deleteSubnet',methods = ['POST'])
@token_required
def DeleteSubnet(user_data):
    if True:
        try:
            subnetObjs = request.get_json()
            for subnet in subnetObjs:
                queryString = f"delete from subnet_display_table where SUBNET_ADDRESS='{subnet}';"
                db.session.execute(queryString)
                db.session.commit()
                print(f"DEVICE {subnet} DELETED SUCCESSFULLY FROM SUBNET TABLE",file=sys.stderr)
                db.session.execute(f"update ipam_devices_fetch_table set DISCOVERED='Not Discovered' where SUBNET='{subnet}';")
                db.session.commit()
                print(f"DEVICE {subnet} DELETED SUCCESSFULLY FROM DISCOVERED TABLE",file=sys.stderr)
                queryString1 = f"delete from ip_table where SUBNET='{subnet}';"
                db.session.execute(queryString1)
                db.session.commit()
                print("IP Addresses against SUBNET {subnet} DELETED SUCCESSFULLY",file=sys.stderr)
            return "DELETION SUCCESSFUL",200
        except Exception as e:
            print(str(e),file=sys.sytderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  

@app.route('/editSubnet', methods = ['POST'])
@token_required
def EditSubnet(user_data):
    if True:
        try:
            subnetObj = request.get_json()
            queryString1 = f"update subnet_display_table set subnet_address='{subnetObj['subnet_address']}' where subnet_id='{subnetObj['subnet_id']}';"
            queryString2 = f"update subnet_display_table set subnet_name='{subnetObj['subnet_name']}' where subnet_id='{subnetObj['subnet_id']}';"
            queryString3 = f"update subnet_display_table set subnet_mask='{subnetObj['subnet_mask']}' where subnet_id='{subnetObj['subnet_id']}';"
            queryString4 = f"update subnet_display_table set location='{subnetObj['location']}' where subnet_id='{subnetObj['subnet_id']}';"
            db.session.execute(queryString1)
            db.session.execute(queryString2)
            db.session.execute(queryString3)
            db.session.execute(queryString4)
            db.session.commit()
            print(f"SUBNET {subnetObj['subnet_address']} UPDATED SUCCESSFULLY")
            return "UPDATED SUCCESSFULLY",200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401 

@app.route('/editSubnetInDiscoveredSubnets',methods = ['POST'])
@token_required
def EditSubnetInDiscoveredSubnets(user_data):
    if True:
        try:
            subnetObj = request.get_json()
            queryString = f"update ipam_devices_fetch_table set SUBNET_NAME='{subnetObj['subnet_name']}' where SUBNET='{subnetObj['subnet']}';"
            db.session.execute(queryString)
            db.session.commit()
            print(f"SUBNET {subnetObj['subnet_name']} EDITED SUCCESSFULLY")
            return "EDITED SUCCESSFULLY",200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401 

@app.route('/deleteDiscoveredSubnets',methods = ['POST'])
@token_required
def DeleteDiscoveredSubnets(user_data):
    if True:
        try:
            subnetObjs = request.get_json()
            for subnetObj in subnetObjs:

                queryString = f"update ipam_devices_fetch_table set DISCOVERED='Not Discovered' where SUBNET='{subnetObj}';"
                db.session.execute(queryString)
                db.session.commit()
                print(f"SUBNET {subnetObj} DELETED SUCCESSFULLY",file=sys.stderr)
            return "DELETED SUCCESSFULLY",200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401 

@app.route('/addDns',methods = ['POST'])
@token_required
def AddDns(user_data):
    if True:
        try:
            response = False
            response1 = response2= False
            dnsObj = request.get_json()
            queryString = f"select IP_ADDRESS from add_dns_table;"
            result = db.session.execute(queryString)
            inLoop=False
            for row in result:
                inLoop=True
                if row[0]==dnsObj['ip_address']:
                    queryString = f"UPDATE add_dns_table set IP_ADDRESS='{dnsObj['ip_address']}',USERNAME='{dnsObj['username']}',PASSWORD='{dnsObj['password']}',SERVER_NAME='{dnsObj['server_name']}' where IP_ADDRESS='{dnsObj['ip_address']}';"
                    queryString2 = f"UPDATE dns_servers set IP_ADDRESS='{dnsObj['ip_address']}',SERVER_NAME='{dnsObj['server_name']}', NUMBER_OF_ZONES=0, TYPE='' where IP_ADDRESS='{dnsObj['ip_address']}';"
                    db.session.execute(queryString)
                    db.session.execute(queryString2)
                    db.session.commit()
                    print(f"DNS {dnsObj['server_name']} UPDATED SUCCESSFULLY",file=sys.stderr)
                    response = True
                else:

                    queryString1 = f"INSERT INTO add_dns_table (`IP_ADDRESS`,`USERNAME`,`PASSWORD`,`SERVER_NAME`) VALUES ('{dnsObj['ip_address']}','{dnsObj['username']}','{dnsObj['password']}','{dnsObj['server_name']}');"
                    queryString2 = f"INSERT INTO dns_servers (IP_ADDRESS,SERVER_NAME) VALUES ('{dnsObj['ip_address']}','{dnsObj['server_name']}');"
                    db.session.execute(queryString1)
                    db.session.execute(queryString2)
                    db.session.commit()
                    print(f"DNS {dnsObj['server_name']} ADDED SUCCESSFULLY IN ADD DNS TABLE",file=sys.stderr)
                    print(f"DNS {dnsObj['server_name']} ADDED SUCCESSFULLY IN DNS SERVERS",file=sys.stderr)
                    response1 = True
                
            if not inLoop:
                queryString1 = f"INSERT INTO add_dns_table (`IP_ADDRESS`,`USERNAME`,`PASSWORD`,`SERVER_NAME`) VALUES ('{dnsObj['ip_address']}','{dnsObj['username']}','{dnsObj['password']}','{dnsObj['server_name']}');"
                queryString2 = f"INSERT INTO dns_servers (IP_ADDRESS,SERVER_NAME) VALUES ('{dnsObj['ip_address']}','{dnsObj['server_name']}');"
                db.session.execute(queryString1)
                db.session.execute(queryString2)
                db.session.commit()
                print(f"DNS {dnsObj['server_name']} ADDED SUCCESSFULLY IN ADD DNS TABLE",file=sys.stderr)
                print(f"DNS {dnsObj['server_name']} ADDED SUCCESSFULLY IN DNS SERVERS",file=sys.stderr)
                response2 = True

            if response==True:

                return "UPDATED SUCCESSFULLY",200
            if response1==True or response2:
                return "INSERTED SUCCESSFULLY",200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401 

@app.route('/getAllDnsServers',methods = ['GET'])
@token_required
def GetAllDnsServers(user_data):
    if True:
        try:
            objList = []
            dnsServersObjs = DNS_SERVERS.query.all()
            for dnsServerObj in dnsServersObjs:
                objDict = {}
                objDict['dns_id'] = dnsServerObj.dns_id
                objDict['ip_address'] = dnsServerObj.ip_address
                objDict['server_name'] = dnsServerObj.server_name
                objDict['number_of_zones'] = dnsServerObj.number_of_zones
                objDict['type'] = dnsServerObj.type
                objList.append(objDict)
            print(objList,file=sys.stderr)
            return jsonify(objList),200
        
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401 

@app.route('/scanDns',methods = ['POST'])
#@token_required
def ScanDns():
    if True:
        try:
            ipAddresses = request.get_json()
            print(f"AAAAA {ipAddresses}", file=sys.stderr)
            for ipAddress in ipAddresses['ip_address']:
                queryString = f"delete from dns_zones where IP_ADDRESS='{ipAddress}';"
                db.session.execute(queryString)
                db.session.commit()
                print(f"DNS {ipAddress} DELETED SUCCESSFULLY FROM DNS ZONES",file=sys.stderr)

                queryString1 = f"delete from dns_servers_record where IP_ADDRESS='{ipAddress}';"
                db.session.execute(queryString1)
                db.session.commit()
                print(f"DNS {ipAddress} DELETED SUCCESSFULLY FROM DNS SERVERS RECORD",file=sys.stderr)

                status= dnsScan(ipAddress)
            return status
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401 

@app.route('/getAllDnsZones',methods= ['GET'])
@token_required
def GetAllDnsZones(user_data):
    if True:
        try:
            objList = []
            dnsZonesObjs = DNS_ZONES.query.all()
            for dnsZoneObj in dnsZonesObjs:
                objDict = {}
                objDict['dns_id'] = dnsZoneObj.dns_id
                objDict['zone_name'] = dnsZoneObj.zone_name
                objDict['zone_status'] = dnsZoneObj.zone_status
                objDict['zone_type'] = dnsZoneObj.zone_type
                objDict['lookup_type'] = dnsZoneObj.lookup_type
                objDict['server_name'] = dnsZoneObj.server_name
                objDict['server_type'] = dnsZoneObj.server_type
                objDict['ip_address'] = dnsZoneObj.ip_address
                objList.append(objDict)
            print(objList,file=sys.stderr)
            return jsonify(objList),200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401 

@app.route('/getAllDnsServersRecord',methods = ['GET'])
@token_required
def GetAllDnsServersRecord(user_data):
    if True:
        try:
            objList = []
            dnsServersRecordObjs = DNS_SERVERS_RECORD.query.all()
            for dnsServersRecordObj in dnsServersRecordObjs:
                objDict = {}
                objDict['dns_id'] = dnsServersRecordObj.dns_id
                objDict['name'] = dnsServersRecordObj.name
                objDict['ip_address'] = dnsServersRecordObj.ip_address
                objDict['type'] = dnsServersRecordObj.type
                objDict['data'] = dnsServersRecordObj.data
                objDict['server_name'] = dnsServersRecordObj.server_name
                objDict['zone_name'] = dnsServersRecordObj.zone_name
                objList.append(objDict)
            print(objList,file=sys.stderr)
            return jsonify(objList),200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401 

@app.route('/testDns',methods = ['POST'])
@token_required
def TestDns(user_data):
    if True:
        try:
            dnsObj = request.get_json()
            if 'ip_address' in dnsObj and 'username' in dnsObj and 'password' in dnsObj:
                try:
                    tool = WinOSClient(host=dnsObj['ip_address'], username=dnsObj['username'], password=dnsObj['password'], logger_enabled=False)
                    response = tool.run_ps('Get-DnsServerZone | ConvertTo-Json')
                    return "Success",200

                except Exception as e:
                    print("DNS Authentication Failed", file=sys.stderr)
                    print(f"{e}", file=sys.stderr)
                    return str("DNS Authentication Failed"),500
            else: 
                print("Please fill all Required Parameters",file=sys.stderr)
                return str("Please fill all Required Parameters"),500
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

def dnsScan(ipAddress):
    print(f"Scanning DNS Server {ipAddress}", file=sys.stderr)
    
    try:
        userName=password=serverName=""

        result= SelectFromDB(f"select username, password, server_name from add_dns_table where ip_address='{ipAddress}';")
        for row in result:
            userName= row[0]
            password= row[1]
            serverName=row[2]

        if ipAddress and userName and password:
            try:
                tool = WinOSClient(host=ipAddress, username=userName, password=password, logger_enabled=False)
                response = tool.run_ps('Get-DnsServerZone | ConvertTo-Json')
                print("Authenticated Server", file=sys.stderr)
            #return jsonify({'response': "success", "code": "200"})
            except Exception as e:
                print("Authentication Failed", file=sys.stderr)
                return str("Authentication Failed"),500   

            try:
                #Get Zones
                dnsZones = tool.run_ps('Get-DnsServerZone | ConvertTo-Json')
                dnsZones= json.loads(str(dnsZones.stdout))
                ExecuteDBQuery(f"UPDATE  dns_servers SET NUMBER_OF_ZONES='{len(dnsZones)}', TYPE='Windows' where IP_ADDRESS='{ipAddress}'")
                print(f"UPDATE  dns_servers SET NUMBER_OF_ZONES='{len(dnsZones)}', TYPE='Windows' where IP_ADDRESS='{ipAddress}'", file=sys.stderr)
                for zone in dnsZones:
                    try:
                        #Insert Zone
                        lookup= zone.get('IsReverseLookupZone')
                        if lookup=="false":
                            lookup= "Forward"
                        else: 
                            lookup= "Reverse"

                        ExecuteDBQuery(f"INSERT INTO dns_zones (`ZONE_NAME`,`ZONE_STATUS`,`ZONE_TYPE`,`LOOKUP_TYPE`,`SERVER_NAME`, `SERVER_TYPE`,`IP_ADDRESS`) VALUES ('{zone.get('ZoneName')}','{zone.get('status')}','{zone.get('ZoneType')}','{lookup}', '{serverName}', 'Windows', '{ipAddress}');")
                        
                        try:
                            zone= zone.get('ZoneName')
                            print(f"Populating DNS Records for DNS Zone {zone}", file=sys.stderr)
                            zoneRecords = tool.run_ps(f'Get-DnsServerResourceRecord -ZoneName {zone} | ConvertTo-Json')
                            zoneRecords= zoneRecords.stdout
                            #print(type(zoneRecords), file=sys.stderr)
                            zoneRecords= json.loads(zoneRecords)

                            for record in zoneRecords:
                                try:
                                    
                                    print(f"Inserting Record for Zone {zone}", file=sys.stderr)
                                    recordData= record['RecordData'].get('CimInstanceProperties',"")
                                    recordData=recordData.split('"')
                                    if len (recordData)>0:
                                        recordData= recordData[1]
                                    else:
                                        recordData= recordData[0]
                                    recordData=recordData.split('...')
                                    recordData=recordData[0]
                                    
                                    ExecuteDBQuery(f"INSERT INTO dns_servers_record (`IP_ADDRESS`,`NAME`,`TYPE`,`ZONE_NAME`,`DATA`, `SERVER_NAME`) VALUES ('{ipAddress}','{record.get('HostName')}','{record.get('RecordType')}','{zone}', '{recordData}', '{serverName}');")

                                    
                                    #print(record)
                                except Exception as e:
                                    print("Failed DNS Record Update", file=sys.stderr)

                        except Exception as e:
                            traceback.print_exc()
                            print(f"Failed to ADD DNS Zones {e}", file=sys.stderr)
                            return str(f"Failed to ADD DNS Zones {e}"),500  
                    except Exception as e:
                        print("Exception Occured", file=sys.stderr)
                    


            #return jsonify({'response': "success", "code": "200"})
            except Exception as e:
                print(f"Failed to ADD DNS Zones {e}", file=sys.stderr)
                return str(f"Failed to ADD DNS Zones {e}"),500   

        else:
            print("Failed to get Credentials", file=sys.stderr)
            return str("Failed to get Credentials"),500
    except Exception as e:
        print(f"Failed to Scan DNS {e}", file=sys.stderr)
        return str(f"Failed to Scan DNS {e}"),500    
    return jsonify({'response': "success", "code": "200"})

@app.route('/deleteDns',methods = ['POST'])
@token_required
def DeleteDns(user_data):
    if True:
        try:
            ipAddresses = request.get_json()
            for ipAddress in ipAddresses:
                queryString = f"delete from add_dns_table where IP_ADDRESS='{ipAddress}';"
                db.session.execute(queryString)
                db.session.commit()
                print(f"DNS {ipAddress} SUCCESSFULLY DELETED FROM ADD DNS TABLE",file=sys.stderr)
                queryString = f"delete from dns_servers where IP_ADDRESS='{ipAddress}';"
                db.session.execute(queryString)
                db.session.commit()
                print(f"DNS {ipAddress} SUCCESSFULLY DELETED FROM  DNS SERVERS",file=sys.stderr)
                queryString = f"delete from dns_zones where IP_ADDRESS='{ipAddress}';"
                db.session.execute(queryString)
                db.session.commit()
                print(f"DNS {ipAddress} SUCCESSFULLY DELETED FROM DNS ZONES",file=sys.stderr)

                queryString = f"delete from dns_servers_record where IP_ADDRESS='{ipAddress}';"
                db.session.execute(queryString)
                db.session.commit()
                print(f"DNS {ipAddress} SUCCESSFULLY DELETED FROM DNS SERVERS RECORD",file=sys.stderr)

            return "DELETED SUCCESSFULLY",200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route("/getAllFirewallVips", methods = ['GET'])
@token_required
def DetAllFirewallVips(user_data):
    if True:#request.headers.get('X-Auth-Key') == session.get('token', None):
        f5ObjList=[]
        f5Objs = db.session.execute('SELECT * FROM firewall_vip WHERE creation_date = (SELECT max(creation_date) FROM firewall_vip)')
        
        for f5Obj in f5Objs:
            f5DataDict= {}
            f5DataDict['firewall_vip_id']= f5Obj[0]
            f5DataDict['ip_address'] = f5Obj[1]
            f5DataDict['device_name'] = f5Obj[2]
            f5DataDict['internal_ip'] = f5Obj[3]
            f5DataDict['vip'] = f5Obj[4]
            f5DataDict['sport'] = f5Obj[5]
            f5DataDict['dport'] = f5Obj[6]
            f5DataDict['extintf'] = f5Obj[7]
            f5DataDict['creation_date'] = str(f5Obj[8])
            f5DataDict['modification_date'] = str(f5Obj[9])
            f5DataDict['created_by']=  f5Obj[10]
            f5DataDict['modified_by']=  f5Obj[11]
            f5ObjList.append(f5DataDict)

        content = gzip.compress(json.dumps(f5ObjList).encode('utf8'), 5)
        response = make_response(content)
        response.headers['Content-length'] = len(content)
        response.headers['Content-Encoding'] = 'gzip'
        return response
    else: 
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route("/getAllF5", methods = ['GET'])
@token_required
def GetAllF5(user_data):
    if True:#request.headers.get('X-Auth-Key') == session.get('token', None):
        f5ObjList=[]
        f5Objs = db.session.execute('SELECT * FROM f5 WHERE creation_date = (SELECT max(creation_date) FROM f5)')
        
        for f5Obj in f5Objs:
            f5DataDict= {}
            f5DataDict['f5_id']= f5Obj[0]
            f5DataDict['ip_address'] = f5Obj[1]
            f5DataDict['device_name'] = f5Obj[2]
            f5DataDict['vserver_name'] = f5Obj[3]
            f5DataDict['vip'] = f5Obj[4]
            f5DataDict['pool_name'] = f5Obj[5]
            f5DataDict['pool_member'] = f5Obj[6]
            f5DataDict['node'] = f5Obj[7]
            f5DataDict['service_port'] = f5Obj[8]
            f5DataDict['monitor_value'] = f5Obj[9]
            f5DataDict['monitor_status'] = f5Obj[10]
            f5DataDict['lb_method'] = f5Obj[11]
            f5DataDict['creation_date'] = str(f5Obj[12])
            f5DataDict['modification_date'] = str(f5Obj[13])
            f5DataDict['created_by']=  f5Obj[14]
            f5DataDict['modified_by']=  f5Obj[15]
            f5ObjList.append(f5DataDict)

        content = gzip.compress(json.dumps(f5ObjList).encode('utf8'), 5)
        response = make_response(content)
        response.headers['Content-length'] = len(content)
        response.headers['Content-Encoding'] = 'gzip'
        return response
    else: 
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route('/getHistoryFromIpInIpDetails',methods = ['POST'])
@token_required
def getHistoryFromIpInIpDetails(user_data):
    if True:
        try:
            ipObj = request.get_json()
            queryString = f"select * from ip_details_history_table where IP_ADDRESS='{ipObj['ip_address']}';"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                objDict = {}
                ip_id = row[0]
                ip_address = row[1]
                status = row[2]
                date = row[3]
                objDict['ip_id'] = ip_id
                objDict['ip_address'] = ip_address
                objDict['status'] = status
                objDict['date'] = (date)
                objList.append(objDict)
            return jsonify(objList),200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route('/exportIpDetails',methods = ['POST'])
@token_required
def ExportIpDetails(user_data):
    if True:
        try:
            dateObj = request.get_json()
            queryString = ""
            objList = []
            if dateObj['date']=='1hour':
                queryString = f"select  * from ip_table where LAST_USED is not NULL and LAST_USED > now()- interval 1 hour;"
            elif dateObj['date']=='1day':
                queryString = f"select  * from ip_table where LAST_USED is not NULL and LAST_USED > now()- interval 1 day;"
            elif dateObj['date']=='1week':
                queryString = f"select  * from ip_table where LAST_USED is not NULL and LAST_USED > now()- interval 1 week;"
            elif dateObj['date']=='1month':
                queryString = f"select  * from ip_table where LAST_USED is not NULL and LAST_USED > now()- interval 1 month;"
            elif dateObj['date']=='1year':
                queryString = f"select  * from ip_table where LAST_USED is not NULL and LAST_USED > now()- interval 1 year;"
            else:
                if queryString=='':
                    return "Something Went Wrong",500
            if queryString!="":
                result = db.session.execute(queryString)
                for row in result:
                    ip_address = row[1]
                    subnet = row[2]
                    mac_address = row[3]
                    status = row[4]
                    asset_tag = row[5]
                    configuration_switch = row[6]
                    configuration_interface = row[7]
                    open_ports = row[8]
                    ip_to_dns = row[9]
                    status_history = row[10]
                    dns_to_ip = row[11]
                    last_used = row[12]
                    vip = ''
                    if row[13]==None or row[13]=='':
                        pass
                    else:
                        vip = row[13]
                    objDict = {}
                    objDict['ip_address'] = ip_address
                    objDict['subnet'] = subnet
                    objDict['mac_address'] = mac_address
                    objDict['status'] = status
                    objDict['asset_tag'] = asset_tag
                    objDict['configuration_switch'] = configuration_switch
                    objDict['configuration_interface'] = configuration_interface
                    objDict['open_ports'] = open_ports
                    objDict['ip_to_dns'] = ip_to_dns
                    objDict['dns_to_ip'] = dns_to_ip
                    objDict['last_used'] = last_used
                    objDict['vip'] = vip
                    objList.append(objDict)
            return jsonify(objList),200

        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401