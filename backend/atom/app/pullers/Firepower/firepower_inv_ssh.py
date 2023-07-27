
from datetime import datetime
import re, sys, time, json
import threading
from app.uam.uam_db_utils import UamInventoryData
from app.utilities.failed_utilts import addFailedDevice




from app.pullers.Firepower.parsing import Parse
# from parsing import Parse
class FirePowerPullerSSH(object):
    
    def __init__(self):
        self.inv_data = {}
        self.connections_limit = 50

    def get_inventory_data(self, hosts):
        threads =[]
        
        for host in hosts:
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
            return self.inv_data
        

    def poll(self, host):
        print(f"Connecting to {host['ip_address']}", file=sys.stderr)
        parse_output = Parse()
        command_list = []
        ver = {"command":"show version \n","sleep":3, "template":"firepower_show_version"}
        
        chassis = {"command":"show chassis detail \n","sleep":5, "template":"firepower_show_chassis_detail"}
        
        command_list.append(ver)
        command_list.append(chassis)
        
        data = parse_output.perform(host['ip_address'], host['username'], host['password'], command_list)
        
        ver = None
        inventory = None
        
        for x in data:
            if x.get('show version'):
                ver = x['show version'][0]
            if x.get('show chassis detail'):
                    inventory = x['show chassis detail'][0]
                    
        try:        
            if host['ip_address'] not in self.inv_data:
                self.inv_data[host['ip_address']] = {}
                data = []
                
                self.inv_data[host['ip_address']].update({'device':
                                            {'ip_addr': host['ip_address'], 
                                            'serial_number': inventory[4], 
                                            'pn_code': inventory[1], 
                                            'hw_version': inventory[2], 
                                            "software_version": ver[0] if ver else None, 
                                            "desc": inventory[0], 
                                            "max_power": None, 
                                            "manufecturer": inventory[3],
                                            "patch":ver[1] if ver else None,
                                            "status": "Production", 
                                            "authentication": "AAA"},
                                            'board':[],
                                            'sub_board':[],
                                            'sfp':[],
                                            'license':[],
                                            'status':'success'})

            print("firepower data is below", file=sys.stderr)
            print(f"{self.inv_data}", file=sys.stderr)
            self.inv_data[host['ip_address']].update({'status': 'success'})
            self.failed = UamInventoryData(self.inv_data)
        except Exception as e:
            print(f"Inventory not found Exception detail==>{e}", file=sys.stderr)
            if host['ip_address'] in self.inv_data:
                self.inv_data[host['ip_address']].update({'status': 'error'})
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
                    
            # failed_device.append({"ip_address": host['ip_address'], "date":  time.strftime("%d-%m-%Y"), "time": time.strftime("%H-%M-%S"), "reason":str(e)})
            # try:
            #     with open('app/failed/ims/'+file_name, 'w', encoding='utf-8') as fd:
            #         fd.write(json.dumps(failed_device))
            # except Exception as e:
            #     print(e)
            #     print("Failed to update failed devices list", file=sys.stderr)

           

 
if __name__ == '__main__':
    hosts = [
        {
            "ip_address": "10.64.93.206",
            "device_type": 'firepower',
            "username": "srv00280",
            "password": "1a3X#eEW3$40vPN%"
        }
        ]
    print('Started at: '+datetime.now().strftime('%Y-%m-%dT%H:%M:%S'))
    puller = FirePowerPullerSSH()
    print(json.dumps(puller.get_inventory_data(hosts)))