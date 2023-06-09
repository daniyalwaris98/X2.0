import traceback
from pysnmp.hlapi import *
import sys 
import re
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS,ASYNCHRONOUS
from app.monitoring.common_utils.utils import *
# from utils import *
import influxdb_client
import time
from sys import platform, stderr
import re
import time
import datetime
import threading
import subprocess
import os


name = os.path.basename(__file__).split(".")[0]
if "_" in name:
    name = name.replace("_"," ")
else:
    pass


output = dict()
final_interfaces = dict()




oids = {
        'Uptime':'1.3.6.1.6.3.10.2.1.3',
        'CPU Utilization':'1.3.6.1.4.1.9.2.1.56',
        'Interfaces':'1.3.6.1.2.1.31.1.1.1.1',
        'download':'1.3.6.1.4.1.9.2.2.1.1.6',
        'upload': '1.3.6.1.4.1.9.2.2.1.1.8',
        'device_description':'1.3.6.1.2.1.1.1',
        'device_name':'1.3.6.1.2.1.1.5',
        'interface_status':'1.3.6.1.2.1.2.2.1.7',
        'interface_description':'1.3.6.1.2.1.2.2.1.2'
        # 'product_id': 'iso.3.6.1.4.1.9.9.156.1.1.8.1.3',
        #'description': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.4',
        #'firmware': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.25',
        }

token = "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A=="
org = "monetx"
bucket = "test"

# token = "Zll2EMReFdi9-p2pmSapnKpIQyQScVVQqHNxQI9xX4Rbn0kP9znktvspXjk6H8xrXnOrMzrTDGtPio8_7efGCg=="
# org = "Extravis"
# bucket = "Monitoring"


def get_oid_data(engn, community, transport, cnxt, oid):

            try:
                print(f"SNMP walk started for OID {oid}", file=sys.stderr)
                
                oid = ObjectType(ObjectIdentity(oid))
                all=[]
                
                for(errorIndication, errorStatus, errorIndex, varBinds) in nextCmd(engn, community, transport, cnxt, oid, lexicographicMode=False): 

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
                print(f"Failed to run SNMP walk: {e}", file=sys.stderr)
                traceback.print_exc()
                return []



def general(varbinds):
    for varBind in varbinds:
        res = ' = '.join([x.prettyPrint() for x in varBind])
        if 'No Such Instance' not in res:
            result = res.split('=')[1].strip()
            return result
                

def ping(ip):
        status = None
        if platform == "linux" or platform == "darwin":
            command=["ping", "-c", "3", "-i", "0.2", ip]
            timeout=2
        else:
            command=["ping", "-n", "1", ip]
            timeout=2
        
        print("I am printing output of proc::1", file=sys.stderr)

        proc=subprocess.Popen(command,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        
        print("I am printing output of proc::2", file=sys.stderr)


        try:
            print("I am printing output of proc::3", file=sys.stderr)

            [out, err]=proc.communicate(timeout=timeout)
            print("I am printing output of proc::4",[out, err], file=sys.stderr)

            if proc.returncode == 0:
                status = 0
                if platform == "linux" or platform == "darwin":
                    # rtt min/avg/max/mdev = 578.263/917.875/1013.707/132.095 ms
                    avgRTT=re.search("rtt min/avg/max/mdev = (\d+.\d+)/(\d+.\d+)/(\d+.\d+)/(\d+.\d+)", str(out)).group(2)
                    return avgRTT,status
                else:
                    # Approximate round trip times in milli-seconds: Minimum = 63ms, Maximum = 64ms, Average = 63ms
                    avgRTT=re.search("Average = (\d+)", str(out)).group()
                    favg = re.search('\d+',avgRTT).group()
                    return favg,status
        except subprocess.TimeoutExpired:
            proc.kill()

def convert_time(seconds):
    seconds = seconds % (24 * 3600)
    hour = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60
      
    return "%d:%02d:%02d" % (hour, minutes, seconds)



class IOSPuller(object):
    
    def __init__(self):
        self.inv_data = {}
        self.connections_limit = 50
    

    def get_inventory_data(self, hosts):
        threads =[]
        
        for host in hosts:
            th = threading.Thread(target=self.poll, args=(host,))
            th.start()
            threads.append(th)
            print(f"printing threads:{threads}",file=sys.stderr)
            if len(threads) == self.connections_limit: 
                for t in threads:
                    t.join()
                threads =[]        
        else:
            for t in threads: # if request is less than connections_limit then join the threads and then return data
                t.join()
            return self.inv_data
            
    #fun for time converstion 

    def intefaces(self,varbinds):
        intefaces_val = dict()
        for varbind in varbinds:
            out = re.search(r'\d* .*',str(varbind)).group()
            value = out.split('=')
            intefaces_val[value[0]] = [value[1].strip()]
        
        return intefaces_val



    def upload(self,varbinds):
        upload_band = dict()
        for varbind in varbinds:
            out = re.search(r'\d* .*',str(varbind)).group()
            value = out.split('=')
            upload_band[value[0]] = value[1].strip()
        return upload_band

    def download(self, varbinds):
        down_band = dict()
        for varbind in varbinds:
            out = re.search(r'\d* .*',str(varbind)).group()
            value = out.split('=')
            down_band[value[0]] = value[1].strip()
        return down_band

    # def get_inventory_data(self, hosts):
    #     threads =[]
    #     print('THIS IS INVENTORY DATA',file=sys.stderr)
    #     for host in hosts:
    #         th = threading.Thread(target=self.poll, args=(host,))
    #         th.start()
    #         threads.append(th)
    #         if len(threads) == self.connections_limit: 
    #             for t in threads:
    #                 t.join()
    #             threads =[]
        
    #     else:
    #         for t in threads: # if request is less than connections_limit then join the threads and then return data
    #             t.join()
            
    #         return self.inv_data
    


    def poll(self,host):
        try:
            engn = SnmpEngine()
            community = CommunityData(mpModel=1,communityIndex=host[1], communityName= 'private')# snmp community
            #community = UsmUserData("SWVV3", "cisco123", "cisco123", authProtocol=usmHMACSHAAuthProtocol, privProtocol=usmAesCfb128Protocol)# snmp community
            transport = UdpTransportTarget((host[1], 161), timeout=5.0, retries=1)
            cnxt = ContextData()

        except Exception as e:
            print(e)
            print("func not working", file=sys.stderr)      



        try: 
            output['status'],output['response'],output['packets'] = ping(host[1])
            if ['status'] == "Up":
                alert_check(host[1],0,"device_up",host[7])
            else:
                alert_check(host[1],0,"device_down",host[7])
        except Exception as e:
            print(e)
            output['status'] = "Down"
            output['response'] = 'NA'

        #timeconversion of uptime
        try:

            temp = get_oid_data(engn, community, transport, cnxt, oids['Uptime'])
            ftime = general(temp)
            output['Uptime'] = convert_time(ftime)
        except:
            output['Uptime'] = 0
        
        #temp for CPU Utilization utilization

        try:
            temp = get_oid_data(engn, community, transport, cnxt, oids['CPU Utilization'])
            output['cpu'] = int(general(temp))
        except:
            output['cpu'] = 0
        if int(output['cpu'])>70:
            pass
            # alert_check(host['ip_address'])        # device description
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
            temp = temp = get_oid_data(engn, community, transport, cnxt, oids['Interfaces'])
            interfaces_val = self.interfaces(temp)
        except:
            interfaces_val = 'NA'

        if interfaces_val == 'NA':
            download_val = 0
            upload_val = 0

        else:

            #temp for interfaces_download_banddwith
            temp = temp = get_oid_data(engn, community, transport, cnxt, oids['download'])
            download_val = self.download(temp)

            #temp for interfaces_upload_banddwith
            temp = temp = get_oid_data(engn, community, transport, cnxt, oids['upload'])
            upload_val = self.upload(temp)


            for key in interfaces_val:
                final_interfaces[interfaces_val[key][0]]={'Download': int(download_val[key][0]) ,'Upload': int(upload_val[key][0])}
            self.data_dumping(host)


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
            "time": datetime.now(),
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
            "Date": datetime.now()
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
                "STATUS" : output['status'],
                "IP_ADDRESS" : host[1],
                "FUNCTION" : host[7],
                "VENDOR" : host[6],
                "DEVICE_NAME": output['device_name']
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


if __name__=="__main__":

    obj = IOSPuller()

    obj.poll()

    # obj.data_dumping()


