import traceback
from pysnmp.hlapi import *
from pysnmp.hlapi import varbinds
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS,ASYNCHRONOUS
from app.monitoring.common_utils.utils import *
# from utils import *
import re
import sys
import influxdb_client
from sys import platform
import datetime
import os


name = os.path.basename(__file__).split(".")[0]
if "_" in name:
    name = name.replace("_"," ").capitalize
else:
    pass


output = dict()
final_interfaces = dict()


host = {'user':'LAB',
        'pwd' : 'nets@1234',
        'auth-key': 'nets@1234',
        'ip_address':'10.14.191.5' }

token = "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A=="
org = "monetx"
bucket = "monitoring"


def convert_time(seconds):
    seconds = seconds % (24 * 3600)
    hour = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60
      
    return "%d:%02d:%02d" % (hour, minutes, seconds)

def get_oid_data(engn, community, transport, cnxt, oid):
            try:
                print(f"SNMP walk started for OID {oid}", file=sys.stderr)
                mibViewController = varbinds.AbstractVarBinds.getMibViewController(engn)
                
                oid = ObjectType(ObjectIdentity(oid)).resolveWithMib(mibViewController)



                all=[]
                
                for(errorIndication, errorStatus, errorIndex, varBinds) in nextCmd( engn, community, transport, cnxt, oid, lexicographicMode=False):

                    if errorIndication:
                        print(f'error=>{errorIndication}', file=sys.stderr)
                        
                    elif errorStatus:
                        print('%s at %s' % (errorStatus.prettyPrint(),
                                            errorIndex and varBinds[int(errorIndex) - 1][0] or '?'))
                    else:
                        for varBind in varBinds:
                            all.append(varBind)
                return all                     
            except Exception as e:
                print(f"Failed to run SNMP walk {e}", file=sys.stderr)
                traceback.print_exc()
                return []
def general(varbinds):
        for varBind in varbinds:
            res = ' = '.join([x.prettyPrint() for x in varBind])
            if 'No Such Instance' not in res:
                result = res.split('=')[1].strip()

                return result



def intefaces(varbinds):
        intefaces_val = dict()
        for varbind in varbinds:
            out = re.search(r'\d* .*',str(varbind)).group()
            value = out.split('=')
            intefaces_val[value[0]] = [value[1].strip()]
        
        return intefaces_val


"""Availibilty

Response Time

CPU utalization

community = UsmUserData("SWVV3", "cisco1234", "cisco1234", authProtocol=usmHMACSHAAuthProtocol, privProtocol=usmAesCfb128Protocol)# snmp community

snmpwalk -v3 -l authPriv -u SWVV3 -a SHA -A cisco1234 -x AES -X cisco1234 10.14.191.5 1.3.6.1.2.1.25.3.3.1.2

Memory Utalization

snmpwalk -v3 -l authPriv -u SWVV3 -a SHA -A cisco1234 -x AES -X cisco1234 10.14.191.5 1.3.6.1.2.1.25.2.3.1.6

Interface Bandwidth usage

Interface name: snmpwalk -v3 -l authPriv -u ES -X cisco1234 10.14.191.5 1.3.6.1.2.1.2.2.1.2

Interface state: snmpwalk -v3 -l authPriv -u ES -X cisco1234 10.14.191.5 1.3.6.1.2.1.2.2.1.8

Interface Speed TX: snmpwalk -v3 -l authPriv -u SWVV3 -a SHA -A cisco1234 -x AES -X cisco1234 10.14.191.5 1.3.6.1.2.1.2.2.1.5

Interface Speed TX: snmpwalk -v3 -l authPriv -u SWVV3 -a SHA -A cisco1234 -x AES -X cisco1234 10.14.191.5 1.3.6.1.2.1.2.2.1.6

Temperature ??

uptime

snmpwalk -v3 -l authPriv -u SWVV3 -a SHA -A cisco1234 -x AES -X cisco1234 10.14.191.5 1.3.6.1.2.1.1.3"""



oids = {
        'uptime':'1.3.6.1.2.1.1.3',
        'cpu':'1.3.6.1.2.1.25.3.3.1.2',
        'Interfaces':'1.3.6.1.2.1.2.2.1.2',
        'interfacec_status' :'1.3.6.1.2.1.2.2.1.8',
        'download':'1.3.6.1.2.1.2.2.1.5',
        'upload': '1.3.6.1.2.1.2.2.1.6',
        'Memory Utilization': '1.3.6.1.2.1.25.2.3.1.6',
        'device_description':'1.3.6.1.2.1.1.1',
        'device_name':'1.3.6.1.2.1.1.5',
        'interface_status':'1.3.6.1.2.1.2.2.1.7',
        'interface_description':'1.3.6.1.2.1.2.2.1.2'
        # 'product_id': 'iso.3.6.1.4.1.9.9.156.1.1.8.1.3',
        #'description': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.4',
        #'firmware': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.25',
        }


class CallManager(object):


    def poll(self):
        try:
            "snmpwalk -v3 -l authPriv -u SWVV3 -a SHA -A cisco1234 -x AES -X cisco1234 10.14.191.5 1.3.6.1.2.1.1.3"
            engn = SnmpEngine()
            # community = CommunityData(mpModel=1,communityIndex=host['ip_address'], communityName= 'public')# snmp community
            community = UsmUserData("SWVV3", "cisco1234", "cisco1234", authProtocol=usmHMACSHAAuthProtocol, privProtocol=usmAesCfb128Protocol)# snmp community
            transport = UdpTransportTarget((host['ip_address'], 161), timeout=5.0, retries=1)
            cnxt = ContextData()
            print("fun is working")



        except Exception as e:
            print("func not working",file=sys.stderr)        

        try: 
            output['status'],output['response'] = ping(host['ip_address'])
        except Exception as e:
            print(e)
            output['status'] = "Down"
            output['response'] = 'NA'
        #for cpu utilization
        try:
            temp = get_oid_data(engn, community, transport, cnxt, oids['cpu'])
            output['CPU Utilization'] = int(general(temp))
        except Exception as e:
            print(e)
            output['CPU Utilization'] = 0
        #for memory utilization
        try:
            temp = get_oid_data(engn, community, transport, cnxt, oids['Memory Utilization'])
            output['Memory Utilization'] = int(general(temp))
        except Exception as e:
            print(e)
            output['Memory Utilization'] = 0
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
            interface_status = intefaces(temp)
            for key,value in interface_status.items():
                if interface_status[key][0]=='1':
                    interface_status[key][0]='Up'
                else:
                    interface_status[key][0]='Down'
        except:
            interface_status = 'NA'
        try:
            temp = get_oid_data(engn,community,transport,cnxt,oids['interface_description'])
            interface_description = intefaces(temp)
        except:
            interface_description = 'NA'
        try:
            temp = temp = get_oid_data(engn, community, transport, cnxt, oids['Interfaces'])
            interfaces_val = intefaces(temp)

        except:
            interfaces_val = 'NA'

        if interfaces_val == 'NA':
            download_val = 0
            upload_val = 0
            status = 1

        else:

            #temp for interfaces_download_banddwith
            temp = temp = get_oid_data(engn, community, transport, cnxt, oids['download'])
            download_val = intefaces(temp)
 

            #temp for interfaces_upload_banddwith
            temp = temp = get_oid_data(engn, community, transport, cnxt, oids['upload'])
            upload_val = intefaces(temp)
            
            temp = temp = get_oid_data(engn, community, transport, cnxt, oids['interfacec_status'])
            status_val = intefaces(temp)



            for key in interfaces_val:
                final_interfaces[interfaces_val[key][0]]={'Status':status_val[key],'Download':int(download_val[key][0]),'Upload': int(upload_val[key][0])}        



    def data_dumping(self):
        # # # writing into database
        with InfluxDBClient(url="http://192.168.10.242:8089", token=token, org=org) as client:
            print("i am in client")
            write_api = client.write_api(write_options=SYNCHRONOUS)
            data = influxdb_client.Point(host['ip_address']+" D").field('Device',host['ip_address']).field('Type',"Fortinet").field('Status',output['status']).field('Response', output['response']).field('Uptime',int(output['Uptime'])).field('CPU Utilization',output['CPU Utilization']).field('Memory Utilization',output['Memory Utilization'])
            print("data point set")
            try:
                write_api.write(bucket, org, data)
            except Exception as e:
                print(f"Database connection issue: {e}") 
            if len(final_interfaces.items()) > 0:
                print("in full interfaces block")
                for k in final_interfaces.keys():
                    data = influxdb_client.Point(host['ip_address']+" I").tag('Interfaces',k).field('Device',host['ip_address']).field('Type',"Fortinet").field('Status',final_interfaces[k]['Status'][0]).field('Download',final_interfaces[k]['Download']).field('Upload',final_interfaces[k]['Upload'])
                    try:
                        
                        write_api.write(bucket, org, data)
                    except Exception as e:
                        print(e)
            else:
                print("in null interfaces block")
                data = influxdb_client.Point(host['ip_address']+" I").tag('Interfaces','NA').field('Download',0).field('Upload',0)
                try:
                    write_api.write(bucket, org, data)
                except Exception as e:
                    return f"Database connection issue: {e}"
                print(data,write_api)
            return (final_interfaces,output,datetime.datetime.now())


if __name__ == "__main__":

    obj = CallManager()

    obj.poll()
    # obj.data_dumping()

    print(output,final_interfaces)
# obj = FortinetPuller()

# obj.poll()
# obj.data_dumping()

# print(output,final_interfaces)
