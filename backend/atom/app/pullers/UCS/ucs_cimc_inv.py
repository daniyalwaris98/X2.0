import os
import traceback
import requests
import json, sys, json, re, time
from datetime import datetime
import urllib3
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import threading
from app.common_utils.insert_to_db import UamInventoryData
from app.monitoring.common_utils.utils import addFailedDevice

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
requests.packages.urllib3.util.ssl_.DEFAULT_CIPHERS = 'ALL:@SECLEVEL=1'

class UCSPuller(object):
    
    def __init__(self):
        self.inv_data = {}
        self.connections_limit = 50
        self.failed = False

    def get_inventory_data(self, hosts):
        threads =[]
        for host in hosts:
            # self.poll(host)
            th = threading.Thread(target=self.poll, args=(host,))
            th.start()
            threads.append(th)
            if len(threads) == self.connections_limit: 
                for t in threads:
                    t.join()
                threads =[]
        
        else:
            for t in threads: # if request is less than connections_limit then join the threads and then return data
                t.join()
            return self.failed

    def poll(self, host):
        print(f"Connecting to {host['ip_address']}", file=sys.stderr)

        
        try:
            base_url = f"https://{host['ip_address']}"
            rest_path = '/redfish/v1/Systems' 
            url = base_url + rest_path  
            print('getting Inventory ',file=sys.stderr)
            response = requests.request('GET', url, auth=(host['username'], host['password']), verify=False, timeout=10000)
            
            if response.ok:
                data = response.json()
                serial = None
                
                for x in data['Members']:
                    serial = re.findall(r'Systems\/(.*)', x['@odata.id'])
                    serial = serial[0] if serial else None
                    if serial:break
                if serial:   
                    rest_path = '/redfish/v1/Systems/'+serial 
                    url = base_url + rest_path 
                    response = requests.request('GET', url, auth=(host['username'], host['password']), verify=False, timeout=10000) 
                    if response.ok:
                        systems_data = response.json()
                        #print(f"########### {systems_data}")
                        sn = systems_data['SerialNumber']
                        vendor = systems_data['Manufacturer']
                        
                time.sleep(2)
                rest_path = '/redfish/v1/Managers/CIMC' 
                url = base_url + rest_path  
                response = requests.request('GET', url, auth=(host['username'], host['password']), verify=False, timeout=10000) 
                pid= None
                if response.ok:
                    res = response.json()
                    pid = res['Model']
                    
                if host['ip_address'] not in self.inv_data:
                    self.inv_data[host['ip_address']]= {'device':
                                                    {'ip_addr': host['ip_address'], 
                                                    'serial_number': sn, 
                                                    'pn_code': pid, 
                                                    'hw_version': None , 
                                                    "software_version": None , 
                                                    "desc": None, 
                                                    "max_power": None, 
                                                    "manufecturer": vendor, 
                                                    "status": 'Production',
                                                    "authentication": "AAA"},
                                                    'sub_board':[],
                                                    'sfp':[],
                                                    'license':[],
                                                    'status':'success',
                                                    'server_ip':host['ip_address']}

                self.get_boards(base_url , host)   
                print(f"{self.inv_data}", file=sys.stderr)
                UamInventoryData(self.inv_data)
            else:
                print(f"Connection failed {host['ip_address']}", file=sys.stderr)
                

                #raise Exception
        except Exception as e:
            traceback.print_exc()
            print(f"Inventory not found Exception detail==>{e}", file=sys.stderr)
            if host['ip_address'] in self.inv_data:
                self.inv_data[host['ip_address']].update({'status': 'error'})
            self.failed = True
            date = datetime.now()
            addFailedDevice(host['ip_address'],date,host['device_type'],str(e),'UAM')
            # file_name = time.strftime("%d-%m-%Y")+".txt"
            # failed_device=[]
            # #Read existing file
                
            # try:
            #     with open('app/failed/ims/'+file_name,'r',encoding='utf-8') as fd:
            #         failed_device= json.load(fd)
            # except:
            #     pass
            # #Update failed devices list
                
            # failed_device.append({"ip_address": host['ip_address'],"date":  time.strftime("%d-%m-%Y"), "time": time.strftime("%H-%M-%S"), "reason":"GET request failed"})
            # try:
            #     with open('app/failed/ims/'+file_name, 'w', encoding='utf-8') as fd:
            #         fd.write(json.dumps(failed_device))
            # except Exception as e:
            #     print(e)
            #     print("Failed to update failed devices list", file=sys.stderr)

    def get_boards(self,base_url ,host):
        try:
            board_data = []
            print('getting boards ',file=sys.stderr)
            rest_path = '/redfish/v1/Chassis/1/Power' 
            url = base_url + rest_path 
            response = requests.request('GET', url, auth=(host['username'], host['password']), verify=False, timeout=10000) 
           
            if response.ok:
                data= response.json()
    
                for x in data['PowerSupplies']:
                    board_data.append({
                                        "board_name": x['Name'],
                                        "serial_number": x['SerialNumber'],
                                        "pn_code": x['PartNumber'],
                                        "hw_version": None,
                                        "slot_id": x['Name'],
                                        "status": 'Production',
                                        "software_version": x['FirmwareVersion'],
                                        "description": 'Power Supply'
                                        })
            self.inv_data[host['ip_address']].update({'board': board_data})
        except Exception as e:
            print(f'exception in boards {e}')
            self.inv_data[host['ip_address']].update({'board': []})
    
      

if __name__ == '__main__':
    hosts = [
        {
            "ip_address": "10.78.211.239",
            "device_type": "ucs",
            "username": "srv00282",
            "password": "99maAF5smUt61397"
        }]
    print('Started at: '+datetime.now().strftime('%Y-%m-%dT%H:%M:%S'))
    puller = UCSPuller()
    print(json.dumps(puller.get_inventory_data(hosts)))

