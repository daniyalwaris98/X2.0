import traceback
from pysnmp.hlapi import *
import sys 
import re
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS,ASYNCHRONOUS
# from app.monitoring.common_utils.utils import *
import influxdb_client
import time
from sys import platform
import subprocess
import re
import time
import datetime
import threading
import os
from app import db
from app import db 
from app.monitoring.common_utils.utils import *


name = os.path.basename(__file__).split(".")[0]
if "_" in name:
    name = name.replace("_"," ")
else:
    pass

output = dict()
final_interfaces = dict()

host =         {
        'Type':'Cisco ASA',
        'user':'LAB',
        'pwd' : 'nets@1234',
        'auth-key': 'nets@1234',
        'ip_address':'192.168.30.171' }


token = "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A=="
org = "monetx"
bucket = "monitoring"

# token = "Zll2EMReFdi9-p2pmSapnKpIQyQScVVQqHNxQI9xX4Rbn0kP9znktvspXjk6H8xrXnOrMzrTDGtPio8_7efGCg=="
# org = "Extravis"
# bucket = "Monitoring"

oids = {
        'uptime':'1.3.6.1.2.1.1.3',
        'cpu':'1.3.6.1.4.1.9.9.109.1.1.1.1.2.2',
        'memory1': '1.3.6.1.4.1.9.9.48.1.1.1.5',
        'memory2': '1.3.6.1.4.1.9.9.48.1.1.1.6',
        'interfaces':'1.3.6.1.2.1.31.1.1.1.1',
        'interfacec_status' :'1.3.6.1.2.1.2.2.1.8',
        'download':'1.3.6.1.2.1.2.2.1.10',
        'upload': '1.3.6.1.2.1.2.2.1.11',
        'device_description':'1.3.6.1.2.1.1.1',
        'device_name':'1.3.6.1.2.1.1.5',
        'interface_status':'1.3.6.1.2.1.2.2.1.7',
        'interface_description':'1.3.6.1.2.1.2.2.1.2'


        # 'temprature' : '1.3.6.1.4.1.2636.3.1.13.1.7',
        # 'product_id': 'iso.3.6.1.4.1.9.9.156.1.1.8.1.3',
        #'description': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.4',
        #'firmware': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.25',
        }



class ASAPuller(object):
    
    def __init__(self):
        self.inv_data = {}
        self.connections_limit = 50
    



    def poll(self,host):
        try:
            if host[14] == "v1/v2":
                engn = SnmpEngine()
                community = CommunityData(mpModel=1,communityIndex=host[1], communityName= host[19])# snmp community
                # community = UsmUserData("SWVV3", "cisco123", "cisco123", authProtocol=usmHMACSHAAuthProtocol, privProtocol=usmAesCfb128Protocol)# snmp community
                transport = UdpTransportTarget((host[1], 161), timeout=5.0, retries=1)
                cnxt = ContextData()    
            if host[14] == "v3":
                engn = SnmpEngine()
                # community = CommunityData(mpModel=1,communityIndex=host[1], communityName= host[13])# snmp community
                community = UsmUserData(userName= host[21], authKey=host[22],privKey=host[23], authProtocol=host[24], privProtocol=host[25])# snmp community
                transport = UdpTransportTarget((host[1], 161), timeout=5.0, retries=1)
                cnxt = ContextData() 
        except Exception as e:
            date = datetime.now()
            addFailedDevice(host[1],date,host[2],str(e),'MONITORING')
            print(str(e),file=sys.stderr)


        try: 
            output['status'],output['response'],output['packets'] = ping(host[1])

        except Exception as e:
            print(e)
            output['status'] = "Down"
            output['response'] = 'NA'
            output['packets'] = '100'
        updatequery = f"update monitoring_devices_table set status = '{output['status']}' where ip_address='{host[1]}';"
        db.session.execute(updatequery)
        db.session.commit()
        #for cpu utilization
        try:
            temp = get_oid_data(engn, community, transport, cnxt, oids['cpu'])
            output['cpu'] = int(general(temp))
        except Exception as e:
            print(e)
            output['cpu'] = 0
        
        alert_check(host[1],output['cpu'],'cpu',host[7])
        #for memory utilization
        try:
            temp = get_oid_data(engn, community, transport, cnxt, oids['memory1'])
            output['Memory1'] = int(general(temp))
        except Exception as e:
            print(e)
            output['Memory1'] = 0
        
        try:
            temp = get_oid_data(engn, community, transport, cnxt, oids['memory2'])
            output['Memory2'] = int(general(temp))
        except Exception as e:
            print(e)
            output['Memory2'] = 0
        try:
            output['memory'] = int((output['Memory2'] *100)/ output['Memory1'])
        except:
            output['memory'] = 0
        
        alert_check(host[1],output['memory'],'memory',host[7])

        # #for Temprature
        # try:
        #     temp = get_oid_data(engn, community, transport, cnxt, oids['temprature'])
        #     output['Temprature'] = int(general(temp))
        # except Exception as e:
        #     print(e)
        #     output['Temprature'] = 0
        

        #timeconversion of uptime



        try:

            temp = get_oid_data(engn, community, transport, cnxt, oids['uptime'])
            output['Uptime'] = general(temp)
        except:
            output['Uptime'] = 0
        # device description
        try:
            temp = get_oid_data(engn,community,transport,cnxt,oids['device_description'])
            output['device_description'] = general(temp)
        except:
            output['device_description'] = 'NA'
        # device name
        try:
            temp = get_oid_data(engn,community,transport,cnxt,oids['device_name'])
            output['device_name'] = general(temp)
        except:
            output['device_name'] = 'NA'
        #temp for Interfaces
        try:
            temp = get_oid_data(engn,community,transport,cnxt,oids['interface_status'])
            interface_status = interfaces(temp)
            for key,value in interface_status.items():
                if interface_status[key][0]=='1':
                    interface_status[key][0]='Up'
                else:
                    interface_status[key][0]='Down'
        except:
            interface_status = 'NA'
        try:
            temp = get_oid_data(engn,community,transport,cnxt,oids['interface_description'])
            interface_description = interfaces(temp)
        except:
            interface_description = 'NA'
        try:
            temp = temp = get_oid_data(engn, community, transport, cnxt, oids['interfaces'])
            interfaces_val = interfaces(temp)

        except:
            interfaces_val = 'NA'

        if interfaces_val == 'NA':
            download_val = float(0)
            upload_val = float(0)

        else:

            #temp for interfaces_download_banddwith
            temp = temp = get_oid_data(engn, community, transport, cnxt, oids['download'])
            download_val = interfaces(temp)
 

            #temp for interfaces_upload_banddwith
            temp = temp = get_oid_data(engn, community, transport, cnxt, oids['upload'])
            upload_val = interfaces(temp)
            
            temp = temp = get_oid_data(engn, community, transport, cnxt, oids['interfacec_status'])
            status_val = interfaces(temp)



            #adding in AtomDB: monitoring_network_devices_table
            # addMonitringDevice(name,output,host,interfaces_val)
            # print( "record inserted.",file=sys.stderr)
            # #adding in AtomDB: monitoring_funtion_devices_table
            # addFunctionDevice(name,output,host,interfaces_val)



            # #adding in AtomDB: monitoring_funtion_interfaces_devices_table
            # addFunctionInterfaces(host,interfaces_val,download_val,upload_val)


            # for key in interfaces_val:
            #     final_interfaces[interfaces_val[key][0]]={'Status':status_val[key],'Download':float(download_val[key][0]),'Upload': float(upload_val[key][0])}        
            
    #         self.data_dumping(host)







    def data_dumping(self,host):
        
        # # # writing into database
        from app import client
        print("i am in client")
        write_api = client.write_api(write_options=SYNCHRONOUS)

        dictionary = [
            {
            "measurement": "Devices",
            "tags": 
            {"DEVICE_NAME": output['device_name'],
             "STATUS" : output['status'],
             "IP_ADDRESS" : host[1],
             "FUNCTION" : host[7],
             "VENDOR" : host[6],
             
            },
                "time": str(datetime.now()),
            "fields": 
            {
            "INTERFACES" : 22,
            "DISCOVERED_TIME" : str(datetime.now()),
            "DEVICE_DESCRIPTION" : output['device_description'],
            "CPU" : output['cpu'],
            "Memory" : output['memory'],
            "PACKETS_LOSS" : output['packets'],
            "Response" : output['response'],
            "Uptime": output['Uptime'],
            "Date": str(datetime.now())
            }
            }]
        
        # data = influxdb_client.Point.from_dict(dictionary, WritePrecision.NS)

        # ("Devices").tag('DEVICE_NAME',host[1]).tag('STATUS','{host[2]}').tag('IP_ADDRESS',output['status']).tag('DEVICE_TYPE', output['response']).tag('FUNCTION',output['Uptime']).field('CPU Utilization',output['CPU Utilization']).field('Memory Utilization',output['Memory Utilization'])
        print("data point set")
        try:
            write_api.write(bucket='monitoring', record=dictionary)
        except Exception as e:
            print(f"Database connection issue: {e}",file=sys.stderr)
            return e
        if len(final_interfaces.items()) > 0:
            print("in full interfaces block")


            for k in final_interfaces.keys():
                dictionary1 = [{
                "measurement": "Interfaces",
                "tags": 
                {"DEVICE_NAME": output['device_name'],
                "IP_ADDRESS" : host[1],
                "FUNCTION" : host[7],
                "VENDOR" : host[6],
                
                },
                "time": datetime.now(),
                "fields": 
                {
                "Interface_Name" : k,
                "Status" : final_interfaces[k]['Interface Status'][0],
                "Download" : float(final_interfaces[k]['Download']),
                "Upload" : float(final_interfaces[k]['Upload']),
                "Interface Description" :final_interfaces[k]['Interface Description'][0],
                "Date": str(datetime.now())

                }}]
        
                # data = influxdb_client.Point.from_dict(dictionary1, WritePrecision.NS)

                # data = influxdb_client.Point("Interfaces").tag('IP_ADDRESS',host[1]).field('DEVICE_NAME',host[1]).field('Type',"Ciso Asa").field('Status',final_interfaces[k]['Status'][0]).field('Download',float(final_interfaces[k]['Download'])).field('Upload',float(final_interfaces[k]['Upload']))
                try:
                    
                    write_api.write(bucket='monitoring', record=dictionary1)
                except Exception as e:
                    print(e,file=sys.stderr)
                    return e
        else:
            pass
            # print("in null interfaces block")
            # data = influxdb_client.Point(host[1]+" I").tag('Interfaces','NA').field('Device',host[1]).field('Type',"Ciso Asa").field('Download',0).field('Upload',0)
            # try:
            #     write_api.write(bucket, org, data)
            # except Exception as e:
            #     return f"Database connection issue: {e}"
            # print(data,write_api)
        return (final_interfaces,output,datetime.now())



if __name__ == "__main__":

    obj = ASAPuller()

    obj.poll(host)
    # obj.data_dumping(host)

    # print(output,final_interfaces)