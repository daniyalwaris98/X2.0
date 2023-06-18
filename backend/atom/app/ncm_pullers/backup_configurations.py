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
from app.ncm_pullers.ncm_alarm import *
from app import app,db
import os

def FormatDate(date):
    #print(date, file=sys.stderr)
    if date is not None:
        result = date.strftime('%d-%m-%Y')
    else:
        #result = datetime(2000, 1, 1)
        result = datetime(1, 1, 2000)

    return result
global response1
global response2
response1 = False
response2 = False

class Puller(object):
    
    def __init__(self):
        self.inv_data = {}
        self.connections_limit = 50
        self.stack_priority= 0
        self.stack_switch= "" 
        self.failed = False  
        self.response1 = False
        self.response2 = False 
        self.response3 = False
    def get_inventory_data(self, hosts,command):
        threads =[]
        print('THIS IS INVENTORY DATA',file=sys.stderr)
        for host in hosts:
            th = threading.Thread(target=self.poll, args=(host,command))
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
        

    def poll(self, host,command):
        current_time = datetime.now()

        print(f"\n\n{host['ip_address']} : Connecting...",file=sys.stderr)
        login_tries = 2
        telnet = 0
        ssh = 0
        is_login = False
        login_exception = None

        connection = None


        while ssh < login_tries :
                    
            try:
                connection = Netmiko(host=host['ip_address'], username=host['username'], password=host['password'], device_type=host['device_type'], timeout=600, global_delay_factor=2, banner_timeout=300)
                
                # connection = ConnectHandler(**device)

                print(f"NCM - {host['ip_address']} : SSH - Logged In Successfully",file=sys.stderr)
                
                is_login = True
                break
            except Exception as e:
                ssh +=1
                print(f"NCM - {host['ip_address']} : SSH - Failed to login",file=sys.stderr)
                login_exception = str(e)

        

        if is_login == False:
            device = {
                'device_type': f"{host['device_type']}_telnet",
                'ip': host['ip_address'],
                'password': host['password'],
                'secret' : 'S3cur!ty@2020',
                'port': 23,
                'timeout': 300,
            }
            
            while telnet < login_tries :
                try:

                    # device = Netmiko(host=host['ip_address'], username=host['username'], password=host['password'], device_type=host['device_type'], timeout=600, global_delay_factor=2, banner_timeout=300)
                    
                    connection = ConnectHandler(**device)
                    
                    print(f"NCM - {host['ip_address']} : Telnet - Logged In Successfully",file=sys.stderr)
                    
                    is_login = True
                    break
                except Exception as e:
                    telnet +=1
                    print(f"NCM - {host['ip_address']} : Telnet - Failed to login",file=sys.stderr)
                    login_exception = str(e)
            
        
        
        if is_login==False:
            self.failed = True
            addFailedDevice(host['ip_address'],current_time,host['device_type'],login_exception,'NCM')
            self.response3 = True
            login_alarm(host,False)

        
        if is_login==True:

            print("LOGIN IS SUCCESSFUL",file=sys.stderr)

            login_alarm(host,True)

            queryString1 = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE=(select MAX(CONFIGURATION_DATE) from ncm_history_table where IP_ADDRESS='{host['ip_address']}') and IP_ADDRESS='{host['ip_address']}';"
            result = db.session.execute(queryString1)
            
            file_name = None
            for row in result:
                file_name = row[0]

            cwd = os.getcwd()

            tempOutput = None
            try:
                connection.enable()
                tempOutput = connection.send_command(f"{command}")
                connection.disconnect()

            except Exception:
                traceback.print_exc()
                self.response3=True
                # backup_failed_alarm(host,False)

            if tempOutput is not None:
                if file_name is not None:

                    path = f"{cwd}/app/configuration_backups/{file_name}.cfg"
                    f = open(path,"r")
                    previousLines = f.readlines()
                    
                    previous_output = ""
                    for line in previousLines:
                        previous_output+=line

                    print(f"LENGTH OF PREVIOUS CONFIGURATION IS {len(previous_output)}",file=sys.stderr)
                    print(f"LENGTH OF CURRENT CONFIGURATION IS {len(tempOutput)}",file=sys.stderr)

                    if len(previous_output)==len(tempOutput):
                        print(f"{host['ip_address']} : Configuration Already Exists",file=sys.stderr)
                        self.response1 = True

                    else:

                        print(f"{host['ip_address']} : Configuration Change Found",file=sys.stderr)

                        file_name = f"{host['device_name']}_{current_time}"
                    
                        path = f"{cwd}/app/configuration_backups/{file_name}.cfg" 
                        f = open(path,'w')
                        f.write(tempOutput)
                        f.close()

                        print(f"{host['ip_address']} : BACKUP GENERATED FOR DEVICE {host['device_name']} at {current_time}",file=sys.stderr)
                        
                        queryString = f"INSERT INTO ncm_history_table (`FILE_NAME`,`CONFIGURATION_DATE`,`IP_ADDRESS`,`DEVICE_TYPE`,`DEVICE_NAME`) VALUES ('{file_name}','{current_time}','{host['ip_address']}','{host['device_type']}','{host['device_name']}');"
                        db.session.execute(queryString)
                        db.session.commit()
                        print(f"{file_name} INSERTED SUCCESSFULLY TO THE NCM HISTORY TABLE AT {current_time}",file=sys.stderr)
                        
                        self.response2 = True

                        queryString = f"update ncm_table set config_change_date='{current_time}' where ip_address='{host['ip_address']}';"
                        db.session.execute(queryString)
                        db.session.commit()

                        config_change_alarm(host)

                else:
                    file_name = f"{host['device_name']}_{current_time}"
                    
                    path = f"{cwd}/app/configuration_backups/{file_name}.cfg" 
                    f = open(path,'w')
                    f.write(tempOutput)
                    f.close()

                    print(f"{host['ip_address']} : BACKUP GENERATED FOR DEVICE {host['device_name']} at {current_time}",file=sys.stderr)
                    
                    queryString = f"INSERT INTO ncm_history_table (`FILE_NAME`,`CONFIGURATION_DATE`,`IP_ADDRESS`,`DEVICE_TYPE`,`DEVICE_NAME`) VALUES ('{file_name}','{current_time}','{host['ip_address']}','{host['device_type']}','{host['device_name']}');"
                    db.session.execute(queryString)
                    db.session.commit()
                    print(f"{file_name} INSERTED SUCCESSFULLY TO THE NCM HISTORY TABLE AT {current_time}",file=sys.stderr)

                    self.response2 = True
                    # backup_failed_alarm(host,True)


        fail = 0
        success = 0

        if self.response2 is True and self.response3 is False:
            success = 1
        elif self.response2 is False and self.response3 is True:
            fail = 1

        print(f"{success} {fail} {self.response2} {self.response3}")

        if success==1 or fail==1:
            try:
                query = f"select * from ncm_configuration_status_table where ip_address='{host['ip_address']}';"
                result = db.session.execute(query).fetchone()
                
                if result is None:
                    queryString = f"INSERT INTO ncm_configuration_status_table (`IP_ADDRESS`,`SUCCESS`,`FAILURE`,CREATION_DATE) VALUES ('{host['ip_address']}',{success},{fail},'{current_time}');"
                    result = db.session.execute(queryString)
                    db.session.commit()
                else:
                    queryString = f"update ncm_configuration_status_table set `SUCCESS`={success}, `FAILURE`={fail}, CREATION_DATE='{current_time}' where ip_address='{host['ip_address']}';"
                    result = db.session.execute(queryString)
                    db.session.commit()
            except Exception:
                traceback.print_exc()

        
                    
    def Exists(self):
        return self.response1
    def Success(self):
        return self.response2
    def FailedLogin(self):
        return self.response3
    
