import traceback
from pysnmp.hlapi import *
import sys 
import re
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS,ASYNCHRONOUS
from app.monitoring.common_utils.utils import *
import influxdb_client
import time
from datetime import datetime
import os
from app import client,bandwidth_time
import json

name = os.path.basename(__file__).split(".")[0]
if "_" in name:
    name = name.replace("_"," ")
else:
    pass

output = dict()




host = {'user':'LAB',
        'pwd' : 'nets@1234',
        'auth-key': 'nets@1234',
        'ip_address':'192.168.20.251' }


# local
token = "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A=="
org = "monetx"
bucket = "monitoring"


# token = "Zll2EMReFdi9-p2pmSapnKpIQyQScVVQqHNxQI9xX4Rbn0kP9znktvspXjk6H8xrXnOrMzrTDGtPio8_7efGCg=="
# org = "Extravis"
# bucket = "Monitoring"




oids = {
        'uptime':'1.3.6.1.2.1.1.3',
        'cpu':'1.3.6.1.2.1.25.3.3.1.2',
        'memory-t': '1.3.6.1.2.1.25.2.2',
        'memory-u': '1.3.6.1.2.1.25.5.1.1.2',
        'interfaces':'1.3.6.1.2.1.31.1.1.1.1',
        'interfacec_status' :'1.3.6.1.2.1.2.2.1.8',
        'download':'1.3.6.1.2.1.2.2.1.10',
        'upload': '1.3.6.1.2.1.2.2.1.11',
        'device_description':'1.3.6.1.2.1.1.1',
        'device_name':'1.3.6.1.2.1.1.5',
        'interface_status':'1.3.6.1.2.1.2.2.1.7',
        'interface_description':'1.3.6.1.2.1.2.2.1.2',
        "highspeed" : '1.3.6.1.2.1.31.1.1.1.15'

        # 'temprature' : '1.3.6.1.4.1.2636.3.1.13.1.7',
        # 'product_id': 'iso.3.6.1.4.1.9.9.156.1.1.8.1.3',
        #'description': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.4',
        #'firmware': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.25',
        }


time_format = '%Y-%m-%dT%H:%M:%SZ'

def interfaces(varbinds):
    intefaces_val = dict()
    for varbind in varbinds:
        out = re.search(r'\d* .*',str(varbind)).group()
        value = out.split('=')
        intefaces_val[value[0]] = [value[1].strip()]
    
    return intefaces_val


"""Windows server
--------------
uptime        1.3.6.1.2.1.1.3.0
hostname        1.3.6.1.2.1.1.5.0
interface address    1.3.6.1.2.1.4.20.1.1
routing table    1.3.6.1.2.1.4.21.1.1
memory size        1.3.6.1.2.1.25.2.2.0
storage used    .1.3.6.1.2.1.25.2.3.1.6
processor load    .1.3.6.1.2.1.25.3.3.1.2"""




class WindowPuller(object):
    windows_interfaces = None
    def __init__(self):
        self.windows_interfaces = dict()   
        self.current_time = datetime.utcnow().strftime(time_format)
        self.current_snapshot = {"time":self.current_time,"data":{}}
        self.prev_snapshot = {}

        try:
            self.prev_snapshot = json.load(open("snapshot.json"))
            print("printing data of previous",self.prev_snapshot)

            self.tdelta = datetime.strptime(self.current_time, time_format) - datetime.strptime(self.prev_snapshot['time'], time_format)
        except Exception as e:
            
            print(str(e)) 
    
    def poll(self,host):
        print(f"i am in {host[2]} poll printing host:",host,file=sys.stderr)
        con_exception = None
        engn = None
        community = None
        transport = None
        cnxt = None

        try:
 
            if host[14] == "v1/v2":
                engn = SnmpEngine()
                community = CommunityData(mpModel=1,communityIndex=host[1], communityName= host[19])# snmp community
                # community = UsmUserData("SWVV3", "cisco123", "cisco123", authProtocol=usmHMACSHAAuthProtocol, privProtocol=usmAesCfb128Protocol)# snmp community
                transport = UdpTransportTarget((host[1], 161), timeout=5.0, retries=1)
                cnxt = ContextData()    
            if host[14] == "v3":
                auth_proc = None
                encryp_proc = None
                if host[24] == "MD5":
                    auth_proc = usmHMACMD5AuthProtocol
                if host[24] == "SHA":
                    auth_proc = usmHMACSHAAuthProtocol
                if host[24] == "SHA-256":
                    auth_proc = usmHMAC192SHA256AuthProtocol
                if host[24] == "SHA-512":
                    auth_proc = usmHMAC384SHA512AuthProtocol

                if host[25] == "DES":
                    encryp_proc = usmDESPrivProtocol
                if host[25] == "AES-128":
                    encryp_proc = usmAesCfb128Protocol
                if host[25] == "AES-192":
                    encryp_proc = usmAesCfb192Protocol
                if host[25] == "AES-256":
                    encryp_proc = usmAesCfb256Protocol
                engn = SnmpEngine()
                # community = CommunityData(mpModel=1,communityIndex=host[1], communityName= host[13])# snmp community
                print(f"3333333333333 print values in v3  poll userName= {host[21]}, authKey={host[22]},privKey={host[23]}, authProtocol={auth_proc}, privProtocol={encryp_proc}",file=sys.stderr)
                community = UsmUserData(userName= host[21], authKey=host[22],privKey=host[23], authProtocol=auth_proc, privProtocol=encryp_proc)# snmp community
                transport = UdpTransportTarget((host[1], 161), timeout=5.0, retries=1)
                cnxt = ContextData() 
        except Exception as e:
            con_exception = e            
            traceback.print_exc()
            date = datetime.now()
            addFailedDevice(host[1],date,host[2],str(e),'MONITORING')
            print(str(e),file=sys.stderr)
        if con_exception ==None:

            try: 
                output['status'],output['response'],output['packets'] = ping(host[1])
                if ['status'] == "Up":
                    alert_check(host[1],0,"device_up",host[7])
                else:
                    alert_check(host[1],0,"device_down",host[7])
            except Exception as e:
                alert_check(host[1],0,"device_down",host[7])
                date = datetime.now()
                addFailedDevice(host[1],date,host[2],str(e),'MONITORING')
                print(f"%%%%%%%%%ADDED TO FAILED DEVICES",file=sys.stderr)
                print(e)
                output['status'] = "Down"
                output['response'] = "NA"
                output['packets'] = "100"
            updatequery = f"update monitoring_devices_table set status = '{output['status']}' where ip_address='{host[1]}';"
            db.session.execute(updatequery)
            db.session.commit()
            if output['status'] == "Up":
                #for cpu utilization
                try:
                    temp = get_oid_data(engn, community, transport, cnxt, oids['cpu'])
                    cpu_dict = interfaces(temp)
                    temp_cpu =0.0
                    for key,value in cpu_dict.items():
                        temp_cpu = temp_cpu + float(value[0])
                    output['cpu'] = str(int(temp_cpu/len(cpu_dict)))
                    alert_check(host[1],output['cpu'],'cpu',host[7])


                except Exception as e:
                    print("printing cpu exception in windows",str(e),file=sys.stderr)                   
                    output['cpu'] = 'NA'
                print(f"cpu of window: {output['cpu']}",file=sys.stderr)

               
                try:
                    temp = get_oid_data(engn, community, transport, cnxt, oids['memory-t'])
                    mem1 = float(general(temp))
                    temp = get_oid_data(engn, community, transport, cnxt, oids['memory-u'])
                    mem_dict = interfaces(temp)
                    temp_mem = 0.0
                    for key,value in mem_dict.items():
                        temp_mem = temp_mem + float(value[0])

                    memory = str(int((temp_mem/mem1)*100))

                    output['memory'] = str(memory)
                    alert_check(host[1],output['memory'],'memory',host[7])

                except Exception as e:
                    print("printing mem exception in windows",str(e),file=sys.stderr)
                    traceback.print_exc()
                    output['memory'] = 'NA'
                                
                print(f"memory of window: {output['memory']}",file=sys.stderr)

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
                    output['Uptime'] = str(general(temp))
                except:
                    output['Uptime'] = 'NA'
                # device description
                try:
                    temp = get_oid_data(engn,community,transport,cnxt,oids['device_description'])
                    output['device_description'] = general(temp)
                except:
                    output['device_description'] = 'NA'
                # device name
                try:
                    output['device_name'] = host[3]
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
                    print("interfsces description before conversion",interface_description,file=sys.stderr)
                    for i in interface_description:
                        tem_list = list()
                        x = (interface_description[i])
                        hex_to_ascii = bytes.fromhex(x[0][2:]).decode("utf-8")
                        if f"\x00" in hex_to_ascii:
                            hex_to_ascii = hex_to_ascii.replace(f"\x00","")
                        tem_list.append(hex_to_ascii)
                        interface_description[i] = tem_list
                    print("interfsces description after conversion",interface_description,file=sys.stderr)

                except:
                    interface_description = 'NA'
                try:
                    temp = get_oid_data(engn, community, transport, cnxt, oids['interfaces'])
                    interfaces_val = interfaces(temp)
                except:
                    interfaces_val = 'NA'

                if interfaces_val == 'NA':
                    download_val = 'NA'
                    upload_val = 'NA'

                else:

                    query_api = client.query_api()
                    query = f'import "strings"\
                    import "influxdata/influxdb/schema"\
                    from(bucket: "monitoring")\
                    |> range(start: -1d)\
                    |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
                    |> filter(fn: (r) => r["IP_ADDRESS"] == "{host[1]}")\
                    |> schema.fieldsAsCols()\
                    |> sort(columns: ["_time"], desc: true)\
                    |> unique(column: "Interface_Name")\
                    |> yield(name: "unique")'

                    result = query_api.query(org='monetx', query=query)
                    interresults = []


                    for table in result:
                        for record in table.records:
                            objDict = {}


                            try:
                                if record['Interface_Name'] == None or record['Interface_Name'] == '':
                                    continue
                                else:
                                    objDict['interface_name'] = record['Interface_Name']
                            except Exception as e:
                                print("error", str(e), file=sys.stderr)
                                continue
                            try:
                                if record['Download'] == None or record['Download'] == '':
                                    objDict['Download'] = 0
                                else:
                                    objDict['Download'] = round(
                                        float(record['Download']), 2)
                            except Exception as e:
                                objDict['Download'] = 0
                                print("error", str(e), file=sys.stderr)
                                pass
                            try:
                                if record['Upload'] == None or record['Upload'] == '':
                                    objDict['Upload'] = 0
                                else:
                                    objDict['Upload'] = round(
                                        float(record['Upload']), 2)
                            except Exception as e:
                                objDict['Upload'] = 0
                                print("error", str(e), file=sys.stderr)
                                pass

                            # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                            interresults.append(objDict)

                # [i for n, i in enumerate(cardslist) if i not in cardslist[n + 1:]]
                    final_interfaces  = list({dictionary['interface_name']: dictionary for dictionary in interresults}.values())

                    print(f"111111111 data of final_interfaces len:{len(final_interfaces)}",final_interfaces, file=sys.stderr)

                    #temp for interfaces_download_banddwith
                    temp = get_oid_data(engn, community, transport, cnxt, oids['download'])
                    download_val = interfaces(temp)

                    #temp for interfaces_upload_banddwith
                    temp = get_oid_data(engn, community, transport, cnxt, oids['upload'])
                    upload_val = interfaces(temp)

                    temp = get_oid_data(engn, community, transport, cnxt, oids['highspeed'])
                    high_val = interfaces(temp)

                    output["interfaces_count"] = str(len(upload_val))
                    for key in interfaces_val:   
                        try:     
                            self.windows_interfaces[interfaces_val[key][0]]={'Download': str(float(download_val[key][0])/1000000) ,'Upload': str(float(upload_val[key][0])/1000000),'Interface Status':interface_status[key][0],'Interface Description':interface_description[key][0]}
                        except Exception as e:
                            print("exception in ios interfaces dictionary:",str(e),file=sys.stderr)
                            pass
                    
                    print(f"222222222222222222222 data of final_interfaces,len:{len(self.windows_interfaces,)}",self.windows_interfaces, file=sys.stderr)
                    
                    if len(final_interfaces) == 0:
                        pass
                    else:
                        for interface in final_interfaces:
                            interface_speed = int(high_val[key][0])*1000000
                            bandwidth = int(interface_speed) / 1000000000
                            self.current_snapshot["data"][host][key] = {'name': interface['interface_name'], 'ifHCInOctets': int(download_val[key][0]) ,'ifHCOutOctets': int(upload_val[key][0]),'ifHighSpeed': interface_speed,'status':interface_status[key][0]}


                            try:
                                print("key",key)
                                print("hostkey",self.prev_snapshot["data"][host][key])
                                if any(  
                                    [
                                        self.prev_snapshot is None,
                                        "data" not in self.prev_snapshot,
                                        host not in self.prev_snapshot["data"],
                                        key not in self.prev_snapshot["data"][host],
                                        'ifHCInOctets' not in self.prev_snapshot["data"][host][key],
                                        'ifHCOutOctets' not in self.prev_snapshot["data"][host][key]
                                    ]):
                                    try:
                                        
                                        interface = {'name': interface['interface_name'], 'traffic_in_bps': int(download_val[key][0]) ,'traffic_out_bps': int(upload_val[key][0]),'interface_speed': int(interface_speed),'bandwidth': int(bandwidth),'status':interface_status[key][0]}
                                        self.windows_interfaces[interface['interface_name']].append(interface)                                    
                                    except Exception as e:
                                        print("exception in  interfaces dictionary:",str(e))
                                        traceback.print_exc()
                                        pass
                                else:
                                    try:
                                        try:
                                            diff_in_octets = ((int(download_val[key][0]) - int(self.prev_snapshot["data"][host][key]['ifHCInOctets'])) * 8) / self.tdelta.seconds
                                            diff_out_octets = ((int(upload_val[key][0]) - int(self.prev_snapshot["data"][host][key]['ifHCOutOctets'])) * 8) / self.tdelta.seconds
                                        except Exception as e:
                                            diff_in_octets = 0
                                            diff_out_octets = 0
                                    
                    
                                        if any(
                                            [
                                                diff_in_octets <0,
                                                diff_out_octets<0,
                                                diff_in_octets  > interface_speed,
                                                diff_out_octets > interface_speed
                                            ]
                                        ):
                                            continue

                                        interface = {'name': interface['interface_name'], 'traffic_in_bps': int(diff_in_octets) ,'traffic_out_bps': int(diff_out_octets),'interface_speed': int(interface_speed),'bandwidth': int(bandwidth),'status':interface_status[key][0]}
                                        
                                        
                                        # self.current_snapshot["data"][host][key] = {'name': interfaces_name[key][0], 'ifHCInOctets': int(download_val[key][0]) ,'ifHCOutOctets': int(upload_val[key][0]),'ifHighSpeed': interface_speed,'status':interface_status[key][0]}

                                        self.windows_interfaces[interface['interface_name']].append(interface)
                                    except Exception as e:
                                        print("exception in  interfaces dictionary:",str(e))
                                        traceback.print_exc()
                            except Exception as e:
                                print(e)
                                print(traceback.format_exc())
                                continue

                            # self.windows_interfaces[interface['interface_name']]['Download'] = round(float(((float(self.windows_interfaces[interface['interface_name']]['Download'])-float(interface['Download']))*8*1000) /bandwidth_time),2) 
                            # self.windows_interfaces[interface['interface_name']]['Upload'] = round(float(((float(self.windows_interfaces[interface['interface_name']]['Upload'])-float(interface['Upload']))*8*1000) /bandwidth_time),2)
                        json.dump(self.current_snapshot,open("snapshot.json","w"))   
                    self.data_dumping(host)

                    print(f"///interfaces of {host[1]},count: {len(upload_val)}::",self.windows_interfaces,file=sys.stderr)
            


            else:

                output['cpu'] = 'NA'

                output['memory'] = 'NA'

                output["interfaces_count"] = 'NA'
                output['Uptime'] = 'NA'
                output['device_description'] = 'NA'
                output['device_name'] =  host[3]

                interface_status = 'NA'

                interface_description = 'NA'

                interfaces_val = 'NA'

                if interfaces_val == 'NA':
                    download_val = 'NA'
                    upload_val = 'NA'

                self.data_dumping(host)                        
        else :
            print(f"Error in connecting device{con_exception}",file=sys.stderr)





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
             "DEVICE_TYPE" : host[2],
             "VENDOR" : host[6],
             
            },
            "time": str(datetime.now()),
            "fields": 
            {
            "INTERFACES" : output["interfaces_count"],
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
        if len(self.windows_interfaces.items()) > 0:
            print("in full interfaces block")


            for k in self.windows_interfaces.keys():
                print(f"^^^^^name of interface {k} in {host[1]}",file=sys.stderr)
                dictionary1 = [{
                "measurement": "Interfaces",
                "tags": 
                {
                "IP_ADDRESS" : host[1],
                "FUNCTION" : host[7],
                "VENDOR" : host[6],
                "DEVICE_NAME": output['device_name']
                },
                "time": str(datetime.now()),
                "fields": 
                {
                "Interface_Name" : k,
                "Status" : self.windows_interfaces[k]['Interface Status'],
                "Download" : float(self.windows_interfaces[k]['Download']),
                "Upload" : float(self.windows_interfaces[k]['Upload']),
                "Interface_Des" :self.windows_interfaces[k]['Interface Description'],
                "Date": str(datetime.now())

                }}]
        
                # data = influxdb_client.Point.from_dict(dictionary1, WritePrecision.NS)

                # data = influxdb_client.Point("Interfaces").tag('IP_ADDRESS',host[1]).field('DEVICE_NAME',host[1]).field('Type',"Ciso Asa").field('Status',self.windows_interfaces[k]['Status'][0]).field('Download',float(self.windows_interfaces[k]['Download'])).field('Upload',float(self.windows_interfaces[k]['Upload']))
                try:
                    
                    write_api.write(bucket='monitoring', record=dictionary1)

                except Exception as e:
                    print(f"################in exception of interfaces of {host[2]}",str(e),file=sys.stderr)
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
        return (self.windows_interfaces,output,datetime.now())



if __name__ == "__main__":
    start = time.perf_counter()

    obj = WindowPuller()

    obj.poll(host)
    # obj.data_dumping(host)
    stop = time.perf_counter()
    print("Total time taken:",stop-start)
