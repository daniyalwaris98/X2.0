import traceback
from pysnmp.hlapi import *
from pysnmp.hlapi import varbinds
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS,ASYNCHRONOUS
from app.monitoring.common_utils.utils import *
from app import client
import sys
import influxdb_client
from datetime import datetime
import os


name = os.path.basename(__file__).split(".")[0]
if "_" in name:
    name = name.replace("_"," ")
else:
    pass


host =         {
        'Type':'Palo',
        'user':'LAB',
        'pwd' : 'nets@1234',
        'auth-key': 'nets@1234',
        'ip_address':'192.168.30.168' }

output = dict()




# local
token = "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A=="
org = "monetx"
bucket = "monitoring"





oids = {
        'uptime':'1.3.6.1.2.1.25.1.1.0',
        'cpu':'1.3.6.1.2.1.25.3.3.1.2.2',
        'interfaces':'1.3.6.1.2.1.2.2.1.2',
        'interfacec_status' :'1.3.6.1.2.1.2.2.1.8',
        'download':'1.3.6.1.2.1.2.2.1.10',
        'upload': '1.3.6.1.2.1.2.2.1.16',
        'memory1': '1.3.6.1.2.1.25.2.3.1.6.1020',
        'memory2' : '1.3.6.1.2.1.25.2.3.1.5.1020',
        'device_description':'1.3.6.1.2.1.1.1',
        'device_name':'1.3.6.1.2.1.1.5',
        'interface_status':'1.3.6.1.2.1.2.2.1.7',
        'interface_description':'1.3.6.1.2.1.2.2.1.2'

        # 'temprature' : '1.3.6.1.4.1.2636.3.1.13.1.7',
        # 'product_id': 'iso.3.6.1.4.1.9.9.156.1.1.8.1.3',
        #'description': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.4',
        #'firmware': 'iso.3.6.1.4.1.9.9.156.1.2.1.1.25',
        }


class PaloPuller(object):
    palo_interfaces = None
    def __init__(self):
        self.palo_interfaces = dict()

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
                    output['cpu'] = str(general(temp))
                    alert_check(host[1],output['cpu'],'cpu',host[7])

                except Exception as e:
                    print(e,file=sys.stderr)
                    output['cpu'] = 'NA'

                #for memory utilization
                try:
                    temp1 = get_oid_data(engn, community, transport, cnxt, oids['memory1'])
                    temp2 = get_oid_data(engn, community, transport, cnxt, oids['memory2'])
                    
                    temp1 = (int(general(temp1)))*100

                    print(temp1,"memory 1 of palo",file=sys.stderr)

                    temp2 = int(general(temp2))

                    print(temp2,"memory 2 of palo",file=sys.stderr)


                    output['memory'] = str(temp1/temp2)
                    alert_check(host[1],output['memory'],'memory',host[7])


                except Exception as e:
                    print(e,file=sys.stderr)
                    output['memory'] = 'NA'
                
                # #for Temprature
                # try:
                #     temp = get_oid_data(engn, community, transport, cnxt, oids['temprature'])
                #     output['Temprature'] = int(general(temp))
                # except Exception as e:
                #     print(e)
                #     output['Temprature'] = 0
                

                #timeconversion of uptime
                try:

                    temp = get_oid_data(engn, community, transport, cnxt, oids['Uptime'])
                    output['Uptime'] = int(general(temp))
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
                except:
                    interface_description = 'NA'
                try:
                    temp = temp = get_oid_data(engn, community, transport, cnxt, oids['interfaces'])
                    interfaces_val = interfaces(temp)

                except:
                    interfaces_val = 'NA'

                if interfaces_val == 'NA':
                    download_val = 'NA'
                    upload_val = 'NA'
                    status = 'NA'

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
                    
                    # #adding in AtomDB: monitoring_funtion_devices_table
                    # addFunctionDevice(name,output,host,interfaces_val)

                    # #adding in AtomDB: monitoring_funtion_interfaces_devices_table
                    # addFunctionInterfaces(host,interfaces_val,download_val,upload_val)
                    output["interfaces_count"] = str(len(upload_val))

                    for key in interfaces_val:
                    
                    
                        self.palo_interfaces[interfaces_val[key][0]]={'Status':status_val[key],'Download':str(float(download_val[key][0])),'Upload': str(float(upload_val[key][0]))}        
                    
                    print(output,self.palo_interfaces, file=sys.stderr)

                    # self.data_dumping(host)
            else:
                output['cpu'] = 'NA'
                output['memory'] = 'NA'
                output['Uptime'] = 'NA'
                output['device_description'] = 'NA'
                output["interfaces_count"] = 'NA'
                output['device_name'] =  host[3]

                interface_status = 'NA'
                interface_description = 'NA'

                interfaces_val = 'NA'

                if interfaces_val == 'NA':
                    download_val = 'NA'
                    upload_val = 'NA'
                    status = 'NA'


                # self.data_dumping(host)                    
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
            {
             "STATUS" : output['status'],
             "IP_ADDRESS" : host[1],
             "FUNCTION" : host[7],
             "DEVICE_TYPE" : host[2],
             "VENDOR" : host[6],
             "DEVICE_NAME": output['device_name']
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
        if len(self.palo_interfaces.items()) > 0:
            print("in full interfaces block")


            for k in self.palo_interfaces.keys():
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
                "Status" : self.palo_interfaces[k]['Status'][0],
                "Download" : float(self.palo_interfaces[k]['Download']),
                "Upload" : float(self.palo_interfaces[k]['Upload']),
                "Interface_Des" :k,
                "Date": str(datetime.now())

                }}]
        
                # data = influxdb_client.Point.from_dict(dictionary1, WritePrecision.NS)

                # data = influxdb_client.Point("Interfaces").tag('IP_ADDRESS',host[1]).field('DEVICE_NAME',host[1]).field('Type',"Ciso Asa").field('Status',self.palo_interfaces[k]['Status'][0]).field('Download',float(self.palo_interfaces[k]['Download'])).field('Upload',float(self.palo_interfaces[k]['Upload']))
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
        return (self.palo_interfaces,output,datetime.now())



if __name__ == "__main__":

    obj = PaloPuller()

 
    obj.poll(host)
    # obj.data_dumping(host)


# obj = PaloPuller()

# obj.poll()

# print(output,self.palo_interfaces)
