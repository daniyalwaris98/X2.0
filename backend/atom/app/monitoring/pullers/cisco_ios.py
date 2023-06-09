import traceback
from pysnmp.hlapi import *
import sys
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS,ASYNCHRONOUS
from app.monitoring.common_utils.utils import *
import influxdb_client
import time
import os
from datetime import datetime
from app import client,bandwidth_time

name = os.path.basename(__file__).split(".")[0]
if "_" in name:
    name = name.replace("_"," ")

else:
    pass



host =         {
        'Type':'Cisco IOS',
        'user':'LAB',
        'pwd' : 'nets@1234',
        'auth-key': 'nets@1234',
        'ip_address': '192.168.30.186' }

output = dict()




oids = {
        'Uptime':'1.3.6.1.6.3.10.2.1.3',
        'CPU Utilization':'1.3.6.1.4.1.9.2.1.56',
        'Interfaces':'1.3.6.1.2.1.31.1.1.1.1',
        'memory51': '1.3.6.1.4.1.9.9.48.1.1.1.5',
        'memory61': '1.3.6.1.4.1.9.9.48.1.1.1.6',
        'download':'1.3.6.1.4.1.9.2.2.1.1.6',
        'upload': '1.3.6.1.4.1.9.2.2.1.1.8',
        'device_description':'1.3.6.1.2.1.1.1',
        # 'device_name':'1.3.6.1.2.1.1.5',
        'interface_status':'1.3.6.1.2.1.2.2.1.7',
        'interface_description':'1.3.6.1.2.1.2.2.1.2'
        # 'product_id': 'iso.3.6.1.4.1.9.9.156.1.1.8.1.3',
        #'description': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.4',
        #'firmware': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.25',
        }

# local
token = "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A=="
org = "monetx"
bucket = "monitoring"

# token = "Zll2EMReFdi9-p2pmSapnKpIQyQScVVQqHNxQI9xX4Rbn0kP9znktvspXjk6H8xrXnOrMzrTDGtPio8_7efGCg=="
# org = "Extravis"
# bucket = "Monitoring"


class IOSPuller():
    ios_interfaces = None
    def __init__(self):
        self.ios_interfaces = dict()
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
                print(str(e),file=sys.stderr)
                output['status'] = "Down"
                output['response'] = "NA"
                output['packets'] = "100"

            updatequery = f"update monitoring_devices_table set status = '{output['status']}' where ip_address='{host[1]}';"
            db.session.execute(updatequery)
            db.session.commit()
            
            if output['status'] == 'Up':

                #timeconversion of uptime
                try:

                    temp = get_oid_data(engn, community, transport, cnxt, oids['Uptime'])
                    output['Uptime']  = str(general(temp))

                except Exception as e:
                    print(e)
                    output['Uptime'] = 'NA'
                
                #temp for CPU Utilization utilization
                try:
                    temp = get_oid_data(engn, community, transport, cnxt, oids['CPU Utilization'])
                    output['cpu'] = str(general(temp))

                    alert_check(host[1],output['cpu'],'cpu',host[7])
                except Exception as e:
                    print(str(e),file=sys.stderr)
                    output['cpu'] = 'NA'
                    traceback.print_exc()
                
                print(f"cpu of ios: {output['cpu']}",file=sys.stderr)

                #for memory utilization
                try:
                    t1 = get_oid_data(engn, community, transport, cnxt, oids['memory51'])
                    t2 = get_oid_data(engn, community, transport, cnxt, oids['memory61'])
                    
                    temp1 = int(general(t1))
                    temp2 = int(general(t2))

                    memory = str(int((temp1*100)/(temp1+temp2)))
                    output['memory'] = str(memory)

                    alert_check(host[1],output['memory'],'memory',host[7])


                except Exception as e:
                    print(str(e),file=sys.stderr)
                    traceback.print_exc()
                    output['memory'] = 'NA'       

                print(f"memory of ios: {output['memory']}",file=sys.stderr)

                # try:
                #     temp = get_oid_data(engn, community, transport, cnxt, oids['memory'])
                #     output['memory'] = str(general(temp))
                            
                #     if int(output['memory'])>70:
                #         memory_alarm(host['ip_address'])

                # except:
                #     output['memory'] = 'NA'  

            
                # device description
                try:
                    temp = get_oid_data(engn,community,transport,cnxt,oids['device_description'])
                    output['device_description'] = str(general(temp))
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
                except:
                    interface_description = 'NA'
                    
                try:
                    temp = get_oid_data(engn, community, transport, cnxt, oids['Interfaces'])
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
                                    objDict['Download'] = float(record['Download'])
                            except Exception as e:
                                objDict['Download'] = 0
                                print("error", str(e), file=sys.stderr)
                                pass
                            try:
                                if record['Upload'] == None or record['Upload'] == '':
                                    objDict['Upload'] = 0
                                else:
                                    objDict['Upload'] = float(record['Upload'])
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
                    #adding in AtomDB: monitoring_network_devices_table
                    # addMonitringDevice(name,output,host,interfaces_val)
                    
                    # #adding in AtomDB: monitoring_funtion_devices_table
                    # addFunctionDevice(name,output,host,interfaces_val)

                    # #adding in AtomDB: monitoring_funtion_interfaces_devices_table
                    # addFunctionInterfaces(host,interfaces_val,download_val,upload_val)
                    output["interfaces_count"] = str(len(upload_val))
                    for key in interfaces_val:   
                        try:     
                            self.ios_interfaces[interfaces_val[key][0]]={'Download': str(float(download_val[key][0])/1000000) ,'Upload': str(float(upload_val[key][0])/1000000),'Interface Status':interface_status[key][0],'Interface Description':interface_description[key][0]}
                        except Exception as e:
                            print("exception in ios interfaces dictionary:",str(e),file=sys.stderr)
                            pass
                    
                    print(f"222222222222222222222 data of final_interfaces,len:{len(self.ios_interfaces,)}",self.ios_interfaces, file=sys.stderr)
                    
                    if len(final_interfaces) == 0:
                        pass
                    else:
                        for interface in final_interfaces:
                            self.ios_interfaces[interface['interface_name']]['Download'] = round(float(((float(self.ios_interfaces[interface['interface_name']]['Download'])-float(interface['Download']))*8*1000) /bandwidth_time),2) 
                            self.ios_interfaces[interface['interface_name']]['Upload'] = round(float(((float(self.ios_interfaces[interface['interface_name']]['Upload'])-float(interface['Upload']))*8*1000) /bandwidth_time),2)
                        
                    self.data_dumping(host)

                    print(f"///interfaces of {host[1]},count: {len(upload_val)}::",self.ios_interfaces,file=sys.stderr)
            

            
            
            else:
            #timeconversion of uptime
                print("Device is not getting ping response",file=sys.stderr)
                output['Uptime']  = "NA"
                output['cpu'] = "NA"
                output['memory'] = "NA"
                output['device_description'] = 'NA'
                output['device_name'] =  host[3]

                #temp for Interfaces
                interface_status = 'NA'
                interface_description = 'NA'
                interfaces_val = 'NA'
                output["interfaces_count"] = 'NA'
                if interfaces_val == 'NA':
                    download_val = 'NA'
                    upload_val = 'NA'
                self.data_dumping(host)
                print(output,self.ios_interfaces, file=sys.stderr)           
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
             "VENDOR" : host[6]
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
        if len(self.ios_interfaces.items()) > 0:
            print("in full interfaces block")


            for k in self.ios_interfaces.keys():
                dictionary1 = [{
                "measurement": "Interfaces",
                "tags": 
                {
                "IP_ADDRESS" : host[1],
                "FUNCTION" :host[7],
                "VENDOR" : host[6],
                "DEVICE_NAME": output['device_name']
                
                },
                "time": str(datetime.now()),
                "fields": 
                {
                "Interface_Name" : k,
                "Status" : self.ios_interfaces[k]['Interface Status'],
                "Download" : float(self.ios_interfaces[k]['Download']),
                "Upload" : float(self.ios_interfaces[k]['Upload']),
                "Interface_Des" :self.ios_interfaces[k]['Interface Description'],
                "Date": str(datetime.now())

                }}]
                # data = influxdb_client.Point.from_dict(dictionary1, WritePrecision.NS)

                # data = influxdb_client.Point("Interfaces").tag('IP_ADDRESS',host[1]).field('DEVICE_NAME',host[1]).field('Type',"Ciso Asa").field('Status',self.ios_interfaces[k]['Status'][0]).field('Download',float(self.ios_interfaces[k]['Download'])).field('Upload',float(self.ios_interfaces[k]['Upload']))
                try:
                    
                    write_api.write(bucket='monitoring', record=dictionary1)

                except Exception as e:
                    print(f"in exception of interfaces of {host[2]}",str(e),file=sys.stderr)

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
        return (self.ios_interfaces,output,datetime.now())


if __name__=="__main__":
    start = time.perf_counter()
    obj = IOSPuller()
    obj.poll(host)
    stop = time.perf_counter()
    print(f"Total time taken :{stop-start}")

    # obj.data_dumping(host)