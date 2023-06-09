import traceback
from multiprocessing.pool import ThreadPool as Pool
from pysnmp.hlapi import *
from pysnmp.hlapi import varbinds
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS,ASYNCHRONOUS
from app.monitoring.common_utils.utils import *
# from utils import *
import re
import sys
import influxdb_client
import subprocess
from sys import platform
import time
import os
import threading
import concurrent.futures






name = os.path.basename(__file__).split(".")[0]
if "_" in name:
    name = name.replace("_"," ").capitalize
else:
    pass











output = dict()
final_interfaces = dict()

host = {
        'Type':'Juniper',
        'user':'LAB',
        'pwd' : 'nets@1234',
        'auth-key': 'nets@1234',
        'ip_address':'192.168.30.167' }


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


# def get_oid_data(engn, community, transport, cnxt, oid):
#             try:
#                 print(f"SNMP walk started for OID {oid}", file=sys.stderr)
#                 mibViewController = varbinds.AbstractVarBinds.getMibViewController(engn)
                
#                 oid = ObjectType(ObjectIdentity(oid)).resolveWithMib(mibViewController)



#                 all=[]
                
#                 for(errorIndication, errorStatus, errorIndex, varBinds) in nextCmd( engn, community, transport, cnxt, oid, lexicographicMode=False):

#                     if errorIndication:
#                         print(f'error=>{errorIndication}', file=sys.stderr)
                        
#                     elif errorStatus:
#                         print('%s at %s' % (errorStatus.prettyPrint(),
#                                             errorIndex and varBinds[int(errorIndex) - 1][0] or '?'))
#                     else:
#                         for varBind in varBinds:
#                             all.append(varBind)
#                 return all                     
#             except Exception as e:
#                 print(f"Failed to run SNMP walk {e}", file=sys.stderr)
#                 traceback.print_exc()
#                 return []




"""JUNIPER SRX

Availibilty

Response Time

CPU utalization

snmpwalk -v 2c -c public 192.168.30.167 1.3.6.1.4.1.2636.3.1.13.1.8.9.1.0.0

Memory Utalization

snmpwalk -v 2c -c public 192.168.30.167 1.3.6.1.4.1.2636.3.1.13.1.11.9.1.0.0

Interface Bandwidth usage

Interface name- snmpwalk -v 2c -c public 192.168.30.167 1.3.6.1.2.1.31.1.1.1.1

interface speed download- snmpwalk -v 2c -c public 192.168.30.167 .1.3.6.1.4.1.2636.3.3.1.1.1

interface speed upload- snmpwalk -v 2c -c public 192.168.30.167 .1.3.6.1.4.1.2636.3.3.1.1.4

Temperature

snmpwalk -v 2c -c public 192.168.30.167 1.3.6.1.4.1.2636.3.1.13.1.7

uptime

snmpwalk -v 2c -c public 192.168.30.167 1.3.6.1.4.1.2636.3.1.5.0"""
# snmpwalk -v 2c -c public 192.168.30.167 


oids1 = {
        'Uptime':'1.3.6.1.4.1.2636.3.1.5',
        'Cpu Utilization':'1.3.6.1.4.1.2636.3.1.13.1.8.9.1',
        'memory': '1.3.6.1.4.1.2636.3.1.13.1.11.9',
        'temprature' : '1.3.6.1.4.1.2636.3.1.13.1.7',
        # 'product_id': 'iso.3.6.1.4.1.9.9.156.1.1.8.1.3',
        #'description': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.4',
        #'firmware': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.25',
        }


oids2 = {
        'interfaces':'1.3.6.1.2.1.31.1.1.1.1',
        'interfacec_status' :'1.3.6.1.2.1.2.2.1.8',
        'download':'1.3.6.1.4.1.2636.3.3.1.1.1',
        'upload': '1.3.6.1.4.1.2636.3.3.1.1.4',

        }




class JuniperPuller(object):
        
        # def __init__(self):
        #     self.inv_data = {}
        #     self.connections_limit = 50


        def get_oid_data(self,oid):
                    try:
                        print(f"SNMP walk started for OID {oid}", file=sys.stderr)
                        mibViewController = varbinds.AbstractVarBinds.getMibViewController(self.engn)
                        
                        oid = ObjectType(ObjectIdentity(oid)).resolveWithMib(mibViewController)



                        all=[]
                        
                        for(errorIndication, errorStatus, errorIndex, varBinds) in nextCmd( self.engn, self.community, self.transport, self.cnxt, oid, lexicographicMode=False):

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
        
        def general(self,varbinds):
                    for varBind in varbinds:
                        res = ' = '.join([x.prettyPrint() for x in varBind])
                        if 'No Such Instance' not in res:
                            result = res.split('=')[1].strip()

                            return result
        def intefaces(self,varbinds):
                intefaces_val = dict()
                for varbind in varbinds:
                    out = re.search(r'\d* .*',str(varbind)).group()
                    value = out.split('=')
                    # print(value)
                    # intefaces_val[value[0]] = [value[1].strip()]
                
                # return intefaces_val
        # def get_inventory_data(self, hosts):
        #     threads =[]
            
        #     for host in hosts:
        #         th = threading.Thread(target=self.poll, args=(host,))
        #         th.start()
        #         threads.append(th)
        #         print(f"printing threads:{threads}",file=sys.stderr)
        #         if len(threads) == self.connections_limit: 
        #             for t in threads:
        #                 t.join()
        #             threads =[]        
        #     else:
        #         for t in threads: # if request is less than connections_limit then join the threads and then return data
        #             t.join()
        #         return self.inv_data
                


        try:
            engn = SnmpEngine()
            community = CommunityData(mpModel=1,communityIndex=host['ip_address'], communityName= 'public')# snmp community
            #community = UsmUserData("SWVV3", "cisco123", "cisco123", authProtocol=usmHMACSHAAuthProtocol, privProtocol=usmAesCfb128Protocol)# snmp community
            transport = UdpTransportTarget((host['ip_address'], 161), timeout=5.0, retries=1)
            cnxt = ContextData()
            print("Snmp engine is created.")        

        except Exception as e:
            print(e)
            print("Snmp engine is not created.")        


        # #pinging
        # try: 
        #     test = ping(host['ip_address'])[1]
        #     if test == 0:
        #         output['status'] = "Up"
        #         output['response'] = ping(host['ip_address'])[0]

        #     else:
        #         output['status'] = "Down"
        #         output['response'] = ping(host['ip_address'])[0]

        # except Exception as e:
        #     print(e)
        #     output['status'] = "Down"
        #     output['response'] = ping(host['ip_address'])[0]
        
        def poll(self):      
            with Pool() as executor:
                        for key,Value in oids1.items():

                            temp = executor.map(self.get_oid_data,[Value])
                            print(temp)
                            # result = self.general(temp)
                            # output[key] = result
                        for key,Value in oids2.items():

                            temp = executor.map(self.get_oid_data,[Value])
                            # result = self.intefaces(temp)
                            # final_interfaces[key] = result


        # #for cpu utilization
        # try:
        #     temp = get_oid_data(engn, community, transport, cnxt, oids['cpu'])
        #     output['Cpu Utilization'] = int(general(temp))
        # except Exception as e:
        #     print(e)
        #     output['Cpu Utilization'] = 0
        # #for memory utilization
        # try:
        #     temp = get_oid_data(engn, community, transport, cnxt, oids['memory'])
        #     output['Memory utilization'] = int(general(temp))
        # except Exception as e:
        #     print(e)
        #     output['Memory utilization'] = 0

        # try:

        #     temp = get_oid_data(engn, community, transport, cnxt, oids['Uptime'])
        #     output['Uptime'] = general(temp)
        #     print(general(temp))
        # except:
        #     output['Uptime'] = 0
        
        # #temp for interfaces
        # try:
        #     temp = temp = get_oid_data(engn, community, transport, cnxt, oids['interfaces'])
        #     interfaces_val = intefaces(temp)

        # except:
        #     interfaces_val = 'NA'

        # if interfaces_val == 'NA':
        #     download_val = float(0)
        #     upload_val = float(0)
        #     status = 1

        # else:

        #     #temp for interfaces_download_banddwith
        #     temp = temp = get_oid_data(engn, community, transport, cnxt, oids['download'])
        #     download_val = intefaces(temp)
 

        #     #temp for interfaces_upload_banddwith
        #     temp = temp = get_oid_data(engn, community, transport, cnxt, oids['upload'])
        #     upload_val = intefaces(temp)
            
        #     temp = temp = get_oid_data(engn, community, transport, cnxt, oids['interfacec_status'])
        #     status_val = intefaces(temp)



        #     for key in interfaces_val:
        #         final_interfaces[interfaces_val[key][0]]={'Status':status_val[key],'Download':float(download_val[key][0]),'Upload': float(upload_val[key][0])}        
        #     self.data_dumping(host)
        #     print(output,final_interfaces, file=sys.stderr)



        def data_dumping(self,host):
            # # # writing into database
            with InfluxDBClient(url="http://localhost:8089", token=token, org=org) as client:
                print("i am in client")
                write_api = client.write_api(write_options=SYNCHRONOUS)
                data = influxdb_client.Point(host['ip_address']+" D").field('Device',host['ip_address']).field('Type',"Juniper").field('Status',output['status']).field('Response', output['response']).field('Uptime',output['Uptime']).field('Memory Utilization',output['Memory utilization']).field('CPU Utilization',output['Cpu Utilization'])
                print("data point set")
                try:
                    write_api.write(bucket, org, data)
                except Exception as e:
                    print("in exception",str(e))
                    return f"Database connection issue: {e}"
                
                if len(final_interfaces.items()) > 0:
                    print("in full Interfaces block")
                    for k in final_interfaces.keys():
                        data = influxdb_client.Point(host['ip_address']+" I").tag('Interfaces',k).field('Device',host['ip_address']).field('Type',"Juniper").field('Status',final_interfaces[k]['Status'][0]).field('Download',float(final_interfaces[k]['Download'])).field('Upload',float(final_interfaces[k]['Upload']))
                        try:
                            write_api.write(bucket, org, data)
                        except Exception as e:
                            print("in exception",str(e))

                            return f"Database connection issue: {e}"
                else:
                    print("in null interfaces block")
                    data = influxdb_client.Point(host['ip_address']+" I").tag('Interfaces','NA').field('Device',host['ip_address']).field('Type',"Juniper").field('Download',0).field('Upload',0)
                    try:
                        write_api.write(bucket, org, data)
                    except Exception as e:
                        print("in exception",str(e))

                        return f"Database connection issue: {e}"
                    print(data,write_api)
                return (final_interfaces,output)






if __name__ == "__main__":
    start = time.perf_counter()

    obj = JuniperPuller()

    obj.poll()
    
    stop = time.perf_counter()

    print(output,final_interfaces) 
    print(f"Total time taken :{stop-start}")
    # obj.data_dumping(host)

# obj = JuniperPuller()

# obj.poll()
# obj.data_dumping()











