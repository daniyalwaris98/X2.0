from ipaddress import ip_address
import secrets
import traceback
from unicodedata import name
from netmiko import Netmiko,ConnectHandler
from datetime import datetime
import re, sys, time, json
import threading
from app import app
from app.common_utils.insert_to_db import UamInventoryData
from app.monitoring.common_utils.utils import addFailedDevice
def FormatDate(date):
    #print(date, file=sys.stderr)
    if date is not None:
        result = date.strftime('%d-%m-%Y')
    else:
        #result = datetime(2000, 1, 1)
        result = datetime(1, 1, 2000)

    return result

class IOSPuller(object):
    
    def __init__(self):
        self.inv_data = {}
        self.connections_limit = 50
        self.stack_priority= 0
        self.stack_switch= "" 
        self.failed = False  
        self.output = ""
        self.response = False
        self.response1 = False   

    def poll(self, host,command):
        print('HOST IS :',type(host),file=sys.stderr)
        print(f"Connecting to {host['ip_address']}")
        login_tries = 3
        c = 0
        is_login = False
        login_exception = None
        while c < login_tries :
            try:
                device = Netmiko(host=host['ip_address'], username=host['username'], password=host['password'], device_type=host['device_type'], timeout=600, global_delay_factor=2, banner_timeout=300)
                print(device,file=sys.stderr)
                print(f"Success: logged in {host['ip_address']}",file=sys.stderr)
                is_login = True
                break
            except Exception as e:
                c +=1
                print(f"Failed to login {host['ip_address']}",file=sys.stderr)
                login_exception = str(e)
        if is_login==False:
            self.inv_data[host['ip_address']] = {"error":"Login Failed"}
            date = datetime.now()
            self.failed = True
            addFailedDevice(host['ip_address'],date,host['device_type'],login_exception,'NCM')
            self.response = True
        if is_login==True:  
            print("LOGIN IS SUCCESSFUL",file=sys.stderr)
            print(f"Executing {command}...",file=sys.stderr)
            output = device.send_command(f"{command}")
            print(f"output is {output}",file=sys.stderr)
            self.response1 = True
            self.output =  output


    def FailedLogin(self):
        return self.response

    def CommandExecutionResponse(self):
        return self.response1
        
    def CommandOutput(self):
        return self.output
    