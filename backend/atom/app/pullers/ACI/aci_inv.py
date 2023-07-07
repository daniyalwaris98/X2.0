import os
import requests
import json, sys, json, re
from datetime import datetime
import urllib3
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import threading
import time
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
requests.packages.urllib3.util.ssl_.DEFAULT_CIPHERS = 'ALL:@SECLEVEL=1'
from app.common_utils.insert_to_db import UamInventoryData
from app.monitoring.common_utils.utils import addFailedDevice
import traceback
import pprint

class ACIPuller(object):
    
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
        login_tries = 3
        c = 0
        is_login = False
        port =443
        login_exception = None
        while c < login_tries :
            try:
                url = f"https://{host['ip_address']}:{port}/api/aaaLogin.json"
                print(f"Login url of aci host =>{url}", file=sys.stderr)
                payload = {
                    "aaaUser": {
                        "attributes": {
                            "name": host['username'],
                            "pwd": host['password']
                        }
                    }
                }
                headers = {
                    'Content-Type': "application/json"
                }

                response = requests.post(url, data=json.dumps(payload), headers=headers, verify=False).json()
                token = response['imdata'][0]['aaaLogin']['attributes']['token']
                cookie = {}
                cookie['APIC-cookie'] = token
                print(f"Success: logged in {host['ip_address']}", file=sys.stderr)
                is_login = True
                break
            except Exception as e:
                c +=1
                self.failed =True
                print(f"Login failed exception detail==>{e}", file=sys.stderr)
                print(f"Falied to login {host['ip_address']}", file=sys.stderr)
                login_exception = str(e)
        if is_login==False:
            self.inv_data[host['ip_address']] = {"error":"Login Failed"}
            date = datetime.now()
            addFailedDevice(host['ip_address'],date,host['device_type'],login_exception,'UAM')
            # file_name = time.strftime("%d-%m-%Y")+".txt"
            # failed_device=[]
            # #Read existing file
            # try:
            #     with open('app/failed/ims/'+file_name,'r', encoding='utf-8') as fd:
            #         failed_device= json.load(fd)
            # except:
            #     print("Failed devices list is empty", file=sys.stderr)
            #     pass
            # #Update failed devices list
            
            # failed_device.append({"ip_address": host['ip_address'],"date":  time.strftime("%d-%m-%Y"), "time": time.strftime("%H-%M-%S"), "reason":login_exception})
            # try:
            #     with open('app/failed/ims/'+file_name, 'w', encoding='utf-8') as fd:
            #         fd.write(json.dumps(failed_device))
            # except Exception as e:
            #     print(e)
            #     print("Failed to update failed devices list", file=sys.stderr)
            self.failed = True
        if is_login==True:  
            try:
                all_nodes_ver=[]
                print("getting version", file=sys.stderr)
                host_url = f"https://{host['ip_address']}:{port}"
                nodes_firmvare = f'{host_url}/api/node/class/firmwareRunning.json?&order-by=firmwareRunning.modTs|desc'
                headers = {'cache-control': "no-cache"}
                get_response = requests.get(nodes_firmvare, headers=headers, cookies=cookie, verify=False)
                
                if get_response.ok:
                    get_response= get_response.json()
                    #print(get_response, file=sys.stderr)
                
                    imdata = get_response['imdata']
                    if imdata:
                        for ver in imdata:
                            all_nodes_ver.append(ver['firmwareRunning']['attributes'])

                
                ver_url = f'{host_url}/api/node/class/fabricSystemInfo.json?&order-by=fabricSystemInfo.modTs|desc'
                headers = {'cache-control': "no-cache"}
                get_response = requests.get(ver_url, headers=headers, cookies=cookie, verify=False)
                if get_response.ok:
                    get_response= get_response.json()
                    imdata = get_response['imdata']
                    if imdata:
                        for x in imdata:
                            all_nodes_ver.append(x['fabricSystemInfo']['attributes'])
                        
            except:
                print("version not found", file=sys.stderr)
                all_nodes_ver = []

            try:
                all_nodes_chassis = []
                all_nodes_mgmt_ips=[]
                print("Getting inventory...", file=sys.stderr)
                host_url = f"https://{host['ip_address']}:{port}"
                inv_url = f'{host_url}/api/node/class/eqptCh.json?&order-by=eqptCh.modTs|desc'
                headers = {'cache-control': "no-cache"}
                get_response = requests.get(inv_url, headers=headers, cookies=cookie, verify=False)
                
                #print(get_response.json(), file=sys.stderr)
                if get_response.ok:
                    get_response= get_response.json()
                    imdata = get_response['imdata']
                    if imdata:
                        for node in imdata:
                            all_nodes_chassis.append(node['eqptCh']['attributes'])    

                mgmt_ip_url = f'{host_url}/api/node/class/mgmtRsOoBStNode.json?&order-by=mgmtRsOoBStNode.modTs|desc'
                get_response = requests.get(mgmt_ip_url, headers=headers, cookies=cookie, verify=False)
                if get_response.ok:
                    get_response= get_response.json()
                    imdata = get_response['imdata']
                    if imdata:
                        for mgmt_ip in imdata:
                            all_nodes_mgmt_ips.append(mgmt_ip['mgmtRsOoBStNode']['attributes'])

                try:
                    for node in all_nodes_chassis:
                        node_id = re.findall(r'topology\/(.*)\/sys\/ch', node['dn'])
                        if node_id:
                            node_id = node_id[0]
                            for x in all_nodes_mgmt_ips:
                                mmgt_ip = re.findall(r'topology\/(.*)', x['tDn'])
                                if mmgt_ip and (node_id == mmgt_ip[0]):
                                    node.update({'addr':re.findall(r'(.*)\/',x['addr'])[0]})
                            for v in all_nodes_ver:
                                if node_id in v['dn']:
                                    if '-' in v['version']:
                                        version = v['version'].split('-')[-1]
                                    else:
                                        version = v['version']
                                    node.update({'version':version})

                    try:
                        filtered_nodes = [node for node in all_nodes_chassis if 'addr' in node.keys()]
                        all_nodes_chassis = filtered_nodes
                    except Exception:
                        print("Error while filtering data",sys.stderr)
                        traceback.print_exc()

                    for node in all_nodes_chassis:
                        try:
                            if node['addr'] not in self.inv_data:
                                self.inv_data[node['addr']]={'device':
                                                                {'ip_addr': node.get('addr'), 
                                                                'serial_number': None if not node.get('ser') else node.get('ser'), 
                                                                'pn_code': None if not node.get('model') else node.get('model'), 
                                                                'hw_version': None if not node.get('rev') else node.get('rev'), 
                                                                "software_version": None if not node.get('version') else node.get('version'), 
                                                                "desc": node.get('descr'), 
                                                                "max_power": None, 
                                                                "manufecturer": None if not node.get('vendor') else node.get('vendor'), 
                                                                "status": 'Production',
                                                                "authentication": "AAA",
                                                                "dn":node.get('dn')},
                                                            'board':[],
                                                            'sub_board':[],
                                                            'sfp':[],
                                                            'license':[],
                                                            'status':'success',
                                                            'server_ip':host['ip_address']}

                        except Exception as e:
                            traceback.print_exc()
                            pass

                    self.get_boards(host, port, cookie, all_nodes_chassis)   
                    self.get_sfps(host, port, cookie, all_nodes_chassis)
                    self.get_license(host, port, cookie, all_nodes_chassis)
                    
                    # original_stdout = sys.stdout
                    # try:
                    #     sys.stdout = sys.stderr
                    #     pprint.pprint(self.inv_data)
                    # finally:
                    #     sys.stdout = original_stdout

                    # print(self.inv_data,file=sys.stderr)
                    UamInventoryData(self.inv_data)
                
                except Exception as e:
                  traceback.print_exc()
                  print(f"Inventory not found Exception detail==>{e}", file=sys.stderr)
                  if host['ip_address'] in self.inv_data:
                      self.inv_data[host['ip_address']].update({'status': 'error'})
                
            except Exception as e:
                traceback.print_exc()
                print(f"Inventory not found Exception detail==>{e}", file=sys.stderr)
                if host['ip_address'] in self.inv_data:
                    self.inv_data[host['ip_address']].update({'status': 'error'})

    def get_boards(self,host,port,cookie, all_nodes):
        try:
            print("Getting boards...", file=sys.stderr)
            board_data = []
            host_url = f"https://{host['ip_address']}:{port}"
            fan_try_url = f'{host_url}/api/node/class/eqptFt.json?&order-by=eqptFt.modTs|desc'
            headers = {'cache-control': "no-cache"}
            get_response = requests.get(fan_try_url, headers=headers, cookies=cookie, verify=False)
            if get_response.ok:
                get_response= get_response.json()
                imdata = get_response['imdata']
                if imdata:
                    for b in imdata:
                        brd = b['eqptFt']['attributes']
                        if brd.get('ser') and 'n/a' not in brd.get('ser'):
                            board_data.append({
                                                "board_name": brd['descr'],
                                                "serial_number": brd['ser'],
                                                "pn_code": brd['model'],
                                                "hw_version": brd['hwVer'],
                                                "slot_id": brd['dn'],
                                                "status": 'Production',
                                                "software_version": '',
                                                "description": brd['descr']
                                                })

            psu_url = f'{host_url}/api/node/class/eqptSpCmnBlk.json?&order-by=eqptSpCmnBlk.modTs|desc'
            headers = {'cache-control': "no-cache"}
            get_response = requests.get(psu_url, headers=headers, cookies=cookie, verify=False)
            if get_response.ok:
                get_response= get_response.json()
                imdata = get_response['imdata']
                if imdata:
                    for b in imdata:
                        psu = b['eqptSpCmnBlk']['attributes']
                        if psu.get('serNum') and ('n/a' not in psu.get('serNum')) and ('psuslot' in psu.get('dn')):
                            board_data.append({
                                                "board_name": 'Power Supply',
                                                "serial_number": psu.get('serNum'),
                                                "pn_code": psu.get('pdNum', ''),
                                                "hw_version": psu.get('ver'),
                                                "slot_id": psu.get('dn'),
                                                "status": 'Production',
                                                "software_version": '',
                                                "description": 'Power Supply'
                                                })
            
            for node in all_nodes:
                try:
                    node_id = re.findall(r'topology\/(.*)\/sys\/ch', node['dn'])
                    if node_id:
                        node_id = node_id[0]
                        for board in board_data:
                            b_dn = re.findall(r'topology\/(.*)\/sys\/ch', board['slot_id'])
                            if b_dn and (node_id == b_dn[0]):
                                board.update({"software_version":self.inv_data.get(node['addr'],{}).get('device')['software_version']})
                                self.inv_data.get(node['addr'],{}).get('board').append(board)
                            
                except Exception as e:
                    print('\Board Exception in Device\n', file=sys.stderr)
                    traceback.print_exc()
        except Exception:
            print('\nException in Board Function\n', file=sys.stderr)
            traceback.print_exc()
    

    def get_sfps(self, host, port,cookie, all_nodes):
        try:
            print("Getting sfp data...", file=sys.stderr)
            sfps_data = []
            host_url = f"https://{host['ip_address']}:{port}"
            transceiver_url = f'{host_url}/api/node/class/ethpmFcot.json?query-target-filter=and(eq(ethpmFcot.isFcotPresent,"yes"))&order-by=ethpmFcot.modTs|desc'
            headers = {'cache-control': "no-cache"}
            get_response = requests.get(transceiver_url, headers=headers, cookies=cookie, verify=False)
            if get_response.ok:
                get_response= get_response.json()
                imdata = get_response['imdata']
                if imdata:
                    for sf in imdata:
                        sfp = sf['ethpmFcot']['attributes']
                        sfps_data.append(sfp)

            for node in all_nodes:
                try:
                    node_id = re.findall(r'topology\/(.*)\/sys\/ch', node['dn'])
                    if node_id:
                        node_id = node_id[0]
                        for sfp in sfps_data:
                            sfp_dn = re.findall(r'topology\/(.*)\/sys', sfp['dn'])
                            if sfp_dn and (node_id == sfp_dn[0]):
                                p_name = re.findall(r'.*phys-\[(.*)\]', sfp['dn'])
                                #if len(sfp.get('guiCiscoPID'))>0:
                                #    speed = re.findall(r'-(.*)G-', sfp.get('guiCiscoPID'))
                                #else:
                                speed = re.findall(r'(\d*)[G|b]', sfp.get('typeName'))
                                
                                pn_code= sfp.get('guiCiscoPID').strip() if len(sfp.get('guiCiscoPID').strip())>0 else sfp.get('typeName',None).strip()
                                modes= {'LR':'single-mode','SR':'multimode','LH':'single-mode','LX':'single-mode', 'SX':'multimode', 'MM':'multimode', 'GLC-T': 'single-mode', 'SFP-GE-S': 'multimode', 'FTLF':'multimode', 'GLR':'single-mode', 'WF-SFP':'multimode' }
                                mode = ''
                                for key, value in modes.items():
                                    if key in pn_code:
                                        mode = value
                                        break
                                                
                                sfp_data = {'port_name': p_name[0] if p_name else '',
                                        'mode': mode,
                                        # 'speed': '1G' if speed[0]=="1000"  else speed[0]+'G',
                                        'speed' : 'N/A',
                                        'hw_version': sfp.get('guiRev'),
                                        'serial_number': sfp.get('guiSN').lstrip('0'),
                                        'port_type': sfp.get('type'),
                                        'connector': None,
                                        'wavelength':None,
                                        'optical_direction_type':None,
                                        'pn_code':pn_code,
                                        'status':'Production', #sfp.get('status')
                                        'description': sfp.get('description'),
                                        'manufacturer': sfp.get('guiName'),
                                        'media_type': None}
                                self.inv_data.get(node['addr'],{}).get('sfp').append(sfp_data)
                except Exception as e:
                    print('\nSFP Exception in Device\n', file=sys.stderr)
                    traceback.print_exc()
        except Exception:
            print('\nException in SFP Function\n', file=sys.stderr)
            traceback.print_exc()
            


    def get_license(self, host, port,cookie, all_nodes):
        try:
            print("Getting license", file=sys.stderr)
            all_license = []
            host_url = f"https://{host['ip_address']}:{port}"
            license_url = f'{host_url}/api/node/class/licenseEntitlement.json?&order-by=licenseEntitlement.modTs|desc'
            # /api/node/class/licenseManager.json?&order-by=licenseManager.modTs|desc
            headers = {'cache-control': "no-cache"}
            get_response = requests.get(license_url, headers=headers, cookies=cookie, verify=False)
            if get_response.ok:
                get_response= get_response.json()
                imdata = get_response['imdata']
                if imdata:
                    for l in imdata:
                        lic = l['licenseEntitlement']['attributes']
                        desc = re.findall(r'([a-zA-Z0-9 ]*)', lic.get('descr'))
                        desc = "".join([x for x in desc if x]) 
                        all_license.append({
                                            "name": lic.get('name'),
                                            "description": None if desc=='' else desc,
                                            "activation_date": lic.get('modTs','2000-01-01'),
                                            "expiry_date": "2000-01-01",
                                            "grace_period": None,
                                            "serial_number": None,
                                            "status": lic.get('status'),
                                            "capacity": None,
                                            "usage": None,
                                            "pn_code": None
                                        })

                    for node in all_nodes:
                        try:
                            if node['role']=='leaf':
                                self.inv_data.get(node['addr'],{}).get('license').extend(all_license)
                        except Exception as e:
                            print('\License Exception in Device\n', file=sys.stderr)
                            traceback.print_exc()
        except Exception:
            print('\nException in License Function\n', file=sys.stderr)
            traceback.print_exc()
            

if __name__ == '__main__':
    hosts = [
        {
            "ip_address": "10.14.106.4",
            "device_type": "aci",
            "username": "ciscotac",
            "password": "C15c0@mob1ly"
        }]
    print('Started at: '+datetime.now().strftime('%Y-%m-%dT%H:%M:%S'))
    puller = ACIPuller()
    print(json.dumps(puller.get_inventory_data(hosts)))

