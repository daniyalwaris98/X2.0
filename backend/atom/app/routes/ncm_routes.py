
import traceback
from app import app, db,render_template
from flask import request, make_response, Response, session
from app.models.inventory_models import *
from flask_jsonpify import jsonify
import pandas as pd
import json
import sys  
import time
from datetime import date, datetime
from sqlalchemy import func
from app.middleware import token_required
from dateutil.relativedelta import relativedelta
import gzip
from flask_cors import CORS, cross_origin
import threading
from app.ncm_pullers.ncm_commands import *
from app.ncm_pullers.backup_configurations import *
from app.ncm_pullers.ncm_restore import *
from app.ncm_pullers.ncm_bulk_download import *
import os
from app.conf_diff_main.conf_diff import ConfDiff
def FormatStringDate(date):
    # print(date, file=sys.stderr)

    try:
        if date is not None:
            if '-' in date:
                result = datetime.strptime(date,'%d-%m-%Y')
            elif '/' in date:
                result = datetime.strptime(date,'%d/%m/%Y')
            else:
                print("incorrect date format", file=sys.stderr)
                result = datetime(2000, 1, 1)
        else:
            #result = datetime(2000, 1, 1)
            result = datetime(2000, 1, 1)
    except:
        result=datetime(2000, 1,1)
        print("date format exception", file=sys.stderr)
    return result
def FormatDate(date):
    #print(date, file=sys.stderr)
    if date is not None:
        result = date.strftime('%d-%m-%Y')
    else:
        #result = datetime(2000, 1, 1)
        result = datetime(1, 1, 2000)

    return result


def InsertData(obj):
    # add data to db
    try:
        db.session.add(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(
            f"Something else went wrong in Database Insertion {e}", file=sys.stderr)

    return True


def UpdateData(obj):
    # add data to db
    #print(obj, file=sys.stderr)
    try:
        # db.session.flush()

        db.session.merge(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(
            f"Something else went wrong during Database Update {e}", file=sys.stderr)

    return True



@app.route('/addNcmDevice',methods = ['POST'])
@token_required
def AddNcmDevice(user_data):
    if True:
        try:
            ncmObj = request.get_json()
            # if NCM_TABLE.query.with_entities(NCM_TABLE.ip_address).filter_by(ip_address=ncmObj['ip_address']).first() is None:
            # ncm = NCM_TABLE()
            # ncm.ip_address = ncmObj['ip_address']
            # ncm.device_name = ncmObj['device_name']
            # ncm.device_type = ncmObj['device_type']
            # ncm.password_group = ncmObj['password_group']
            # ncm.vendor = ncmObj['vendor']
            # ncm.function = ncmObj['function']
            # ncm.status = ncmObj['status']
            # ncm.source = "Static"
            # ncm_id = None
            # queryString = f"select NCM_ID from ncm_table where NCM_ID='{ncmObj['ncm_id']}';"
            # result = db.session.execute(queryString)
            # for row in result:
            #     ncm_id = row[0]
            # if ncm_id!=None:
            if 'ncm_id' in ncmObj:
            # if NCM_TABLE.query.with_entities(NCM_TABLE.ip_address).filter_by(ip_address=ncmObj['ip_address']).first() is not None:
                # ncm.ncm_id = NCM_TABLE.query.with_entities(NCM_TABLE.ncm_id).filter_by(ip_address=ncmObj['ip_address']).first()[0]
                modification_date = datetime.now()
                queryString1 = f"update ncm_table set `IP_ADDRESS`='{ncmObj['ip_address']}',`DEVICE_NAME`='{ncmObj['device_name']}',`DEVICE_TYPE`='{ncmObj['device_type']}',`PASSWORD_GROUP`='{ncmObj['password_group']}',`VENDOR`='{ncmObj['vendor']}',`FUNCTION`='{ncmObj['function']}',`STATUS`='{ncmObj['status']}',`SOURCE`='Static',`MODIFICATION_DATE`='{modification_date}' where ncm_id={ncmObj['ncm_id']};"
                db.session.execute(queryString1)
                db.session.commit()
                print(f"Updated {ncmObj['ncm_id']} in NCM", file=sys.stderr)
                return "Updated Successfully",200
            else:
                creation_date = datetime.now()
                modification_date = datetime.now()
                ipList = []
                deviceList = []
                query = f"select IP_ADDRESS,DEVICE_NAME from ncm_table;"
                res = db.session.execute(query)
                for r in res:
                    ip_address = r[0]
                    device_name = r[1]
                    ipList.append(ip_address)
                    deviceList.append(device_name)
                if ncmObj['ip_address'] in ipList:
                    return "IP Address Already Exists",500
                if ncmObj['device_name'] in deviceList:
                    return "Device Name Already Exists",500
                queryString2 = f"INSERT INTO ncm_table (`IP_ADDRESS`,`DEVICE_NAME`,`DEVICE_TYPE`,`PASSWORD_GROUP`,`VENDOR`,`FUNCTION`,`STATUS`,`SOURCE`,`CREATION_DATE`,`MODIFICATION_DATE`) VALUES ('{ncmObj['ip_address']}','{ncmObj['device_name']}','{ncmObj['device_type']}','{ncmObj['password_group']}','{ncmObj['vendor']}','{ncmObj['function']}','{ncmObj['status']}','Static','{creation_date}','{modification_date}');"
                db.session.execute(queryString2)
                db.session.commit()
                print(f"Inserted {ncmObj['ip_address']} in NCM", file=sys.stderr)
                return "Inserted Successfully",200
            # else:
            #     print(f"Device Already Exists in NCM",file=sys.stderr)
            #     return "Device Already Exists in NCM",500
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503 

@app.route('/addNcmDevices',methods = ['POST'])
@token_required
def AddNcmDevices(user_data):
    if True:
        try:
            response = False
            response1 = False
            response2 = False
            response3 = False
            responses =[]
            ipList = []
            deviceList = []
            ncmObjs = request.get_json()
            passwordGroups = []
            queryString1 = f"select IP_ADDRESS from ncm_table;"
            result1 = db.session.execute(queryString1)
            for row1 in result1:
                ipList.append(row1[0])
            queryString2 = f"select DEVICE_NAME from ncm_table;"
            result2 = db.session.execute(queryString2)
            for row2 in result2:
                deviceList.append(row2[0])
            for ncmObj in ncmObjs:
                queryString = f"select PASSWORD_GROUP from password_group_table;"
                result = db.session.execute(queryString)
                for row in result:
                    passwordGroups.append(row[0])
                
                if ncmObj['password_group'] not in passwordGroups:
                    return "Password Group not Found in Password Group Table",500
                if ncmObj['ip_address'] in ipList:
                    return "Duplicate IP Address Found",500
                if ncmObj['device_name'] in deviceList:
                    return "Duplicate Device Name Found",500
                if NCM_TABLE.query.with_entities(NCM_TABLE.ip_address).filter_by(ip_address=ncmObj['ip_address']).first() is None:
                    ncm = NCM_TABLE()
                    ncm.ip_address = ncmObj['ip_address']
                    ncm.device_name = ncmObj['device_name']
                    ncm.device_type = ncmObj['device_type']
                    ncm.password_group = ncmObj['password_group']
                    ncm.vendor = ncmObj['vendor']
                    ncm.function = ncmObj['function']
                    ncm.source = "Static"
                    ncm.status=ncmObj['status']
                    if NCM_TABLE.query.with_entities(NCM_TABLE.ip_address).filter_by(ip_address=ncmObj['ip_address']).first() is not None:
                        ncm.ncm_id = NCM_TABLE.query.with_entities(NCM_TABLE.atom_id).filter_by(ip_address=ncmObj['ip_address']).first()[0]
                        ncm.modification_date = datetime.now()
                        UpdateData(ncm)
                        print(f"Updated {ncmObj['ip_address']} in NCM", file=sys.stderr)
                        response = 'updated'
                        responses.append(response)
                        
                    else:
                        ncm.creation_date = datetime.now()
                        ncm.modification_date = datetime.now()
                        InsertData(ncm)
                        
                        print(f"Inserted {ncmObj['ip_address']} in NCM", file=sys.stderr)
                        response1 = 'inserted'
                        responses.append(response1)

                else:
                    print(f"Device Already Exists in NCM",file=sys.stderr)
                    response2 = 'exists'
                    responses.append(response2)
                    
            responses = set(responses)
            responses = list(responses)
            if len(responses)==1:
                
                if responses[0]=='updated':
                    return "Updated Successfully",200
                elif responses[0]=='inserted':
                    return "Inserted Successfully",200
                elif responses[0]=='exists':
                    return "Device Already Exists in NCM",500
            else:
                return "Updated/Inserted Successfully",200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503 

@app.route('/getAllNcmDevices',methods = ['GET'])
@token_required
def GetAllNcmDevices(user_data):
    if True:
        try:
            ncmObjList= []
            ncmObjs = NCM_TABLE.query.all()
            for ncmObj in ncmObjs:
                ncmDict = {}
                ncmDict['ncm_id'] = ncmObj.ncm_id
                ncmDict['ip_address'] = ncmObj.ip_address
                ncmDict['device_name'] = ncmObj.device_name
                ncmDict['device_type'] = ncmObj.device_type
                ncmDict['password_group'] = ncmObj.password_group
                ncmDict['source'] = ncmObj.source
                ncmDict['modification_date'] = FormatDate(ncmObj.modification_date)
                ncmDict['creation_date'] = FormatDate(ncmObj.creation_date)
                ncmDict['function'] = ncmObj.function
                ncmDict['vendor'] = ncmObj.vendor
                ncmDict['status'] = ncmObj.status
                ncmObjList.append(ncmDict)
            return jsonify(ncmObjList),200

        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503 

@app.route('/getAtomInNcm',methods = ['GET'])
@token_required
def GetAtomInNcm(user_data):
    if True:
        try:
            ncmList = []
            ipList = []
            queryString = f"select IP_ADDRESS from ncm_table;"
            result = db.session.execute(queryString)
            for row in result:
                ipList.append(row[0])
            atomObjs = Atom.query.all()
            for atomObj in atomObjs:
                if atomObj.ip_address in ipList:
                    pass
                else:

                    objDict = {}
                    objDict['ip_address'] = atomObj.ip_address
                    objDict['device_name'] = atomObj.device_name
                    objDict['device_type'] = atomObj.device_type
                    objDict['password_group'] = atomObj.password_group
                    # objDict['vendor'] = atomObj.vendor
                    objDict['function'] = atomObj.function
                    ncmList.append(objDict)
            return jsonify(ncmList),200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503 

@app.route('/addNcmFromAtom',methods = ['POST'])
@token_required
def AddNcmFromAtom(user_data):
    if True:
        response = False
        response1 = False
        
        try:
            responses = []
            ips = request.get_json()
            for ip in ips:
                queryString = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,DEVICE_NAME,`FUNCTION` from atom_table where IP_ADDRESS='{ip}';"
                result = db.session.execute(queryString)
                for row in result:
                    ncm = NCM_TABLE()
                    ncm.ip_address = row[0]
                    ncm.device_type = row[1]
                    ncm.password_group = row[2]
                    ncm.device_name = row[3]
                    ncm.function = row[4]
                    # ncm.vendor = row[5]
                    ncm.source = 'Atom'
                    ncm.status = 'InActive'
                    if NCM_TABLE.query.with_entities(NCM_TABLE.ncm_id).filter_by(ip_address=ip).first() is not None:
                        ncm.ncm_id = NCM_TABLE.query.with_entities(NCM_TABLE.ipam_id).filter_by(ip_address=ip).first()[0]
                        ncm.modification_date = datetime.now()
                        UpdateData(ncm)
                        print("IP ADDRESS/DEVICE NAME IS DUPLICATE", file=sys.stderr)
                        response1 = 'response1'
                        responses.append(response1)
                    else:
                        ncm.creation_date = datetime.now()
                        ncm.modification_date = datetime.now()
                        InsertData(ncm)
                        print(ip, "INSERTION FROM ATOM WAS SUCCESSFUL",file=sys.stderr)
                        response = 'response'
                        
                        responses.append(response)
                            
            print(f"%%%%%%RESPONSES ARE {responses}",file=sys.stderr)
            responses1 = set(responses)
            responses = list(responses1)
            if True or False in responses:
                pass
            if len(responses)==1:
                if responses[0]=='response':
                    print(f"RETURNED INSERTION FROM ATOM",file=sys.stderr)
                    return "Device Added Successfully", 200
                elif responses[0]=='response1':
                    print(f"RETURNED UPDATION FROM ATOM",file=sys.stderr)
                    return "Device Updated Successfully",200
            elif len(responses)>1:
                print(f"RETURNED INSERTION/UPDATION FROM ATOM",file=sys.stderr)
                return "Device Added/Updated Successfully", 200
            else:
                print(f"RETURNED SOMETHING WENT WRONG",file=sys.stderr)
                return "Something Went Wrong",500

                
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/deleteNcmDevice',methods = ['POST'])
@token_required
def DeleteNcmDevice(user_data):
    if True:
        try:
            ipObjs = request.get_json()
            for ip in ipObjs:
                queryString = f"delete from ncm_table where IP_ADDRESS='{ip}';"
                db.session.execute(queryString)
                queryString1 = f"delete from ncm_configuration_status_table where IP_ADDRESS='{ip}';"
                db.session.execute(queryString1)
                db.session.commit()
                print(f"DEVICE {ip} DELETED SUCCESSFULLY",file=sys.stderr)
                
            return "DELETION SUCCESSFUL",200
        except Exception as e:
            print(str(e),file=sys.sytderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  


@app.route('/sendCommand',methods = ['POST'])
@token_required
def SendCommand(user_data):
    if True:
        try:
            ncmObj = request.get_json()
            print(f"%%%%NCM OBJ IS",ncmObj,file=sys.stderr)
            queryString = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,DEVICE_NAME from ncm_table where IP_ADDRESS='{ncmObj['ip_address']}';"
            result = db.session.execute(queryString)
            
            for row in result:
                objDict={}
                ip_address = row[0]
                device_type = row[1]
                password_group = row[2]
                device_name = row[3]
                objDict['ip_address'] = ip_address
                objDict['device_type'] =device_type
                objDict['device_name'] = device_name    
                queryString2 = f"select USERNAME,PASSWORD from password_group_table where password_group='{password_group}';"
                result2 = db.session.execute(queryString2)
                for row2 in result2:
                    username = row2[0]
                    password = row2[1]
                    objDict['username'] = username
                    objDict['password'] = password
            

            # objDict = {
            #     'username':'nets','password':'Nets@123','device_type':'cisco_ios','ip_address':'192.168.30.151'
            # }
            iosPuller = IOSPuller()
            poll = iosPuller.poll(objDict,ncmObj['cmd'])
            
            if iosPuller.response1==True:
                output = iosPuller.output
                return str(output),200
            elif iosPuller.response==True:
                return "Failed to Login into Device",500
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  



@app.route('/backupConfigurations',methods = ['POST'])
def BackupConfigurations():
    if True:
        try:
            ncmObj = request.get_json()
            queryString = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,DEVICE_NAME from ncm_table where IP_ADDRESS='{ncmObj['ip_address']}';"
            result = db.session.execute(queryString)
            
            for row in result:
                objDict={}
                ip_address = row[0]
                device_type = row[1]
                password_group = row[2]
                device_name = row[3]
                objDict['ip_address'] = ip_address
                objDict['device_type'] =device_type
                objDict['device_name'] = device_name    
                queryString2 = f"select USERNAME,PASSWORD from password_group_table where password_group='{password_group}';"
                result2 = db.session.execute(queryString2)
                for row2 in result2:
                    username = row2[0]
                    password = row2[1]
                    username = username.strip()
                    password = password.strip()
                    objDict['username'] = username
                    objDict['password'] = password
                    
            # objDict = {
            #     'username':'nets','password':'Nets@123','device_type':'cisco_ios','ip_address':'192.168.30.151'
            # }
            command = ''
            device_type = device_type.strip()
            if device_type=='cisco_ios_xe':
                device_type = 'cisco_xe'
                command = 'show running-conf'
            if device_type=='cisco_ios_xr':
                device_type = 'cisco_xr'
                command = 'show running-conf'
            if device_type=='cisco_ios' or device_type=='cisco_xr' or device_type=='cisco_xe' or device_type=='cisco_asa' or device_type=='cisco_nxos' or device_type=='cisco_wlc' or device_type=='cisco_ftd':
                command = 'show running-config' 
            elif device_type=='fortinet':
                command = 'show full-configuration'
            configurationPuller = Puller()
            
            output = configurationPuller.poll(objDict,command)
            
            if configurationPuller.Success()==True:
                return "Configuration Backup Successful",200
            elif configurationPuller.Exists() ==True:
                return "Configuration Already Exists",500
            elif configurationPuller.FailedLogin()==True:
                return "Failed to Login into Device",500
            else:
                return "Something Went Wrong",500
            # print(f" OUTPUT IN API IS {(output)}",file=sys.stderr)
            # return "Configuration Backup Successful",200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  


@app.route('/getAllConfigurationDates',methods = ['POST'])
@token_required
def GetAllConfigurationDates(user_data):
    if True:
        try:
            ipObjs = request.get_json()
            print(f"%%%GETALLCONFIGURATIONDATES",ipObjs,file=sys.stderr)
            queryString = f"select CONFIGURATION_DATE from ncm_history_table where IP_ADDRESS='{ipObjs['ip_address']}';"
            objList = []
            result = db.session.execute(queryString)
            for row in result:
                objDict = {}
                objDict['date'] = (row[0]).strftime('%Y-%m-%d %H:%M:%S')
                objList.append(objDict)
            return jsonify(objList),200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  

def CheckPath(file_path):
    from pathlib import Path

    # create a Path object with the path to the file
    path = Path(file_path)

    return (path.is_file())

@app.route('/getConfigurationFromDate',methods =['POST'])
@token_required
def GetConfigurationFromDate(user_data):
    if True:
        try:
            file_name = ""
            dateObj = request.get_json()
            print(f"%DATEE IS {dateObj}",file=sys.stderr)
            queryString = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE='{dateObj['date']}';"
            result = db.session.execute(queryString)
            for row in result:
                file_name = row[0]
            
            # os.chdir(os.getcwd()+'/app/configuration_backups')
            cwd = os.getcwd()
            file_path = (cwd+"/app/configuration_backups/"+file_name+".cfg")
            pathFlag = CheckPath(file_path)
            if pathFlag:

                f = open(file_path,"r")
                configuration = f.read()
                return configuration,200
            else:
                queryString1 = f"delete from ncm_history_table where CONFIGURATION_DATE='{dateObj['date']}';"
                db.session.execute(queryString1)
                db.session.commit()
                return "Does Not Exists",500
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  

# @app.route("/testing_configuration")
# def path_test():
#     queryString = f"select FILE_NAME from ncm_history_table where file_name='LAB_SW_06_2023-01-06 11:06:24.655025';"
#     result = db.session.execute(queryString)
#     file_name = ""
#     for row in result:
#         file_name = row[0]
#         # print(file_name,file=sys.stderr)
        
    
#     cwd = os.getcwd()
#     path = f"{cwd}/app/configuration_backups/{file_name}.cfg"
#     f = open(path,"r")
#     output = ""
#     lines = f.readlines()
#     # print(f.readlines(),file=sys.stderr)
#     for line in lines:
#         if "! Last configuration change" in line:
#             pass
#         else:
#             output+=line
#     # return os.getcwd()
#     return output,200
@app.route('/restoreConfiguration',methods= ['POST'])
@token_required
def RestoreConfiguration(user_data):

    if True:
        try:
            ncmObj = request.get_json()
            queryString = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,DEVICE_NAME from ncm_table where IP_ADDRESS='{ncmObj['ip_address']}';"
            result = db.session.execute(queryString)
            
            for row in result:
                objDict={}
                ip_address = row[0]
                device_type = row[1]
                password_group = row[2]
                device_name = row[3]
                objDict['ip_address'] = ip_address
                objDict['device_type'] =device_type
                objDict['device_name'] = device_name    
                queryString2 = f"select USERNAME,PASSWORD from password_group_table where password_group='{password_group}';"
                result2 = db.session.execute(queryString2)
                for row2 in result2:
                    username = row2[0]
                    password = row2[1]
                    username = username.strip()
                    password = password.strip()
                    objDict['username'] = username
                    objDict['password'] = password

            restoreConfigurationPoller = RestorePuller()
            endResult = restoreConfigurationPoller.poll(objDict,ncmObj['date'])
            if restoreConfigurationPoller.success()==True:
                return "Configuration Restored Successfully",200
            elif restoreConfigurationPoller.FileDoesNotExist()==True:
                return "File Does Not Exist",500
            elif restoreConfigurationPoller.FailedLogin():
                return "Failed to Login into Device",500

        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route('/configurationComparison',methods = ["POST"])
@token_required
def ConfigurationComparison(user_data):
    if True:
        try:
            cwd = os.getcwd()
            existingPath = f"{cwd}/app/templates/html_diff_output.html"
            existingPath1 = os.path.exists(existingPath)
            if existingPath1: 
                print("Existing File Removed",file=sys.stderr)
                os.remove(existingPath)
            else:
                pass
            ncmObj = request.get_json()
            queryString = f"select FILE_NAME from ncm_history_table where IP_ADDRESS='{ncmObj['ip_address']}' and CONFIGURATION_DATE='{ncmObj['date1']}';"
            result = db.session.execute(queryString)
            file_name1 = ""
            for row in result:
                file_name1+=row[0]
            queryString1 = f"select FILE_NAME from ncm_history_table where IP_ADDRESS='{ncmObj['ip_address']}' and CONFIGURATION_DATE='{ncmObj['date2']}';"
            result1 = db.session.execute(queryString1)
            file_name2 = ""
            for row in result1:
                file_name2=row[0]

            if file_name1=="" or file_name2=="" or file_name1==file_name2:
                return "One of the Configurations Not Found",500
            
            else:
                cwd = os.getcwd()
                path = f"{cwd}/app/configuration_backups/"
                path1 = f"/app/app/templates/html_diff_output.html"
                html_diff = ConfDiff(f"{path}{file_name1}.cfg", f"{path}{file_name2}.cfg", path1)
                difference = html_diff.diff()

                if difference == None:
                    return "No Difference Found In Configurations", 500
                
                
                return render_template('html_diff_output.html'),200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


# @app.route('/recentConfigrations',methods = ["GET"])
# # @token_required
# def recentConfigrations():
#     if True:
#         try:
#             queryString = f"select distinct CONFIGURATION_DATE  from ncm_history_table  order by CONFIGURATION_DATE desc limit 2;"
#             result = db.session.execute(queryString).fetchall()
#             for row in result:
#                 dt=row[0]
#                 queryString = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE={dt};"
#             for row in result:
#                 dt1=row[1]
#                 queryString1 = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE={dt1};"
#             if queryString=="" or queryString1=="":
#                 return "One of the Configurations Not Found",500            
#             else:
#                 # cwd = os.getcwd()
#                 # path = f"{cwd}/app/configuration_backups/"
#                 # path1 = f"/app/app/templates/html_diff_output.html"
#                 html_diff = ConfDiff(f"{queryString}, f"{queryString1}")
#                 html_diff.diff()
                
#                 return render_template('html_diff_output.html'),200
#         except Exception as e:
#             print(str(e),file=sys.stderr)
#             traceback.print_exc()
#             return str(e),500
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({'message': 'Authentication Failed'}), 401


@app.route('/bulkBackupConfigurations',methods = ['POST'])
@token_required
def BulkBackupConfigurations(user_data):
    
    if True:
        try:
            ncmObjs = request.get_json()
            responses = []
            print(f"%%%%%%",ncmObjs,file=sys.stderr)
            for ncmObj in ncmObjs:

                queryString = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,DEVICE_NAME,STATUS from ncm_table where IP_ADDRESS='{ncmObj}';"
                result = db.session.execute(queryString)
                
                for row in result:
                    objDict={}
                    ip_address = row[0]
                    device_type = row[1]
                    password_group = row[2]
                    device_name = row[3]
                    status = row[4]
                    objDict['ip_address'] = ip_address
                    objDict['device_type'] =device_type
                    objDict['device_name'] = device_name    
                    if status =='InActive':
                        responses.append('inactive')

                    
                    queryString2 = f"select USERNAME,PASSWORD from password_group_table where password_group='{password_group}';"
                    result2 = db.session.execute(queryString2)
                    for row2 in result2:
                        username = row2[0]
                        password = row2[1]
                        username = username.strip()
                        password = password.strip()
                        objDict['username'] = username
                        objDict['password'] = password
                    
       
                command = ''
                device_type = device_type.strip()
                if device_type=='cisco_ios_xe':
                    device_type = 'cisco_xe'
                    command = 'show running-conf'
                if device_type=='cisco_ios_xr':
                    device_type = 'cisco_xr'
                    command = 'show running-conf'
                if device_type=='cisco_ios' or device_type=='cisco_xr' or device_type=='cisco_xe' or device_type=='cisco_asa' or device_type=='cisco_nxos' or device_type=='cisco_wlc' or device_type=='cisco_ftd':
                    command = 'show running-config' 
                elif device_type=='fortinet':
                    command = 'show full-configuration'
                configurationPuller = Puller()
                output = configurationPuller.poll(objDict,command)
                
                if configurationPuller.Success()==True:
                    responses.append('success')
                    
                elif configurationPuller.Exists() ==True:
                    responses.append('exists')
                    
                elif configurationPuller.FailedLogin()==True:
                    responses.append('login_failed')
                    
                else:
                    return "Something Went Wrong",500
            responses = set(responses)
            responses = list(responses)
            print(responses,file=sys.stderr)
            if len(responses)==1:
                if responses[0]=='success':
                    return "Configuration Backups Successfull",200
                elif responses[0]=='login_failed':
                    return "Failed to Login into Devices",500
                elif responses[0]=='inactive':
                    return "The Device Status is InActive",500
            elif len(responses)>1:
                    if len(responses)==4:
                        return "Some Backups were Successful,Some Configurations Already Exist, Some Failed to Login and Some Are InActive",200
                    
                    elif 'success' in responses and 'exists' in responses:
                        return "Some Backups were Successful,Some Configurations Already Exist",200
                    elif 'inactive' in responses and 'exists' in responses:
                        return "Some Devices are InActive",500
                    elif 'inactive' in responses and 'login_failed' in responses:
                        return "Some Devices are InActive",200
                    elif 'inactive' in responses and 'login_failed' or 'success' in responses:
                        return "Some Devices are InActive and Some Backed Up Successfully",200
                    elif 'success' in responses and 'login_failed' in responses:
                        return "Some Backups where Successful and Some Failed to Login",200
                    elif 'exists' in responses and 'login_failed' in responses:
                        return "Some Configurations Already Exist and Some Failed to Login",500
            elif 'inactive' in responses:
                return "Some Devices are InActive",500
            else:
                return "Something Went Wrong",500
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401



@app.route('/getAllConfigurationDatesInString',methods = ['POST'])
@token_required
def GetAllConfigurationDatesInString(user_data):
    if True:
        try:
            ipObjs = request.get_json()
            # print(f"%%%GETALLCONFIGURATIONDATES",ipObjs,file=sys.stderr)
            queryString = f"select CONFIGURATION_DATE from ncm_history_table where IP_ADDRESS='{ipObjs['ip_address']}';"
            objList = []
            result = db.session.execute(queryString)
            for row in result:
                # objDict = {}
                date = (row[0]).strftime('%Y-%m-%d %H:%M:%S')
                objList.append(date)
            return jsonify(objList),200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  



@app.route('/downloadConfiguration',methods = ['POST'])
@token_required
def DownloadConfiguration(user_data):
    if True:
        try:
            ncmObj = request.get_json()
            queryString = f"select FILE_NAME from ncm_history_table where IP_ADDRESS='{ncmObj['ip_address']}' and CONFIGURATION_DATE='{ncmObj['date']}';"
            result = db.session.execute(queryString)
            file_name = ""
            dataString = ""
            for row in result:
                file_name+=row[0]
            if file_name!="":

                cwd = os.getcwd()
                path = cwd+f"/app/configuration_backups/{file_name}.cfg"
                pathExists = os.path.exists(path)
                if pathExists:

                    f = open(path,"r")
                    x = f.read()
                    dataString+=x
                    if dataString=='':
                        return "Configuration Does Not Exist",500

                else:
                    path = ''
            
            else:
                return "File Does Not Exist",500
            if file_name!="" and dataString!="": 
                finalList = []
                finalList.insert(0,file_name)
                finalList.insert(1,dataString)
                return jsonify(finalList),200
            else:
                return "File Does Not Exist",500
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route('/downloadBulkConfiguration',methods = ['POST'])
@token_required
def DownloadBulkConfiguration(user_data):
    if True:
        try:
            ncmObjs = request.get_json()
            print(ncmObjs,file=sys.stderr)
            finalResult = []
            for ncmObj in ncmObjs:
                queryString = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,DEVICE_NAME from ncm_table where IP_ADDRESS='{ncmObj}';"
                result = db.session.execute(queryString)
                objList = []
                for row in result:
                    objDict={}
                    ip_address = row[0]
                    device_type = (row[1]).strip()
                    password_group = row[2]
                    device_name = row[3]
                    objDict['ip_address'] = ip_address
                    objDict['device_type'] =device_type
                    objDict['device_name'] = device_name    
                    queryString2 = f"select USERNAME,PASSWORD from password_group_table where password_group='{password_group}';"
                    result2 = db.session.execute(queryString2)
                    for row2 in result2:
                        username = row2[0]
                        password = row2[1]
                        username = username.strip()
                        password = password.strip()
                        objDict['username'] = username
                        objDict['password'] = password
                        objList.append(objDict)
                        
                print(len(objList),file=sys.stderr)
                command = ''

                for objDict in objList:

                    if objDict['device_type']=='cisco_ios_xe':
                        objDict['device_type'] = 'cisco_xe'
                        command = 'show running-conf'
                    if objDict['device_type']=='cisco_ios_xr':
                        objDict['device_type'] = 'cisco_xr'
                        command = 'show running-conf'
                    if objDict['device_type']=='cisco_ios' or objDict['device_type']=='cisco_xr' or objDict['device_type']=='cisco_xe' or objDict['device_type']=='cisco_asa' or objDict['device_type']=='cisco_nxos' or objDict['device_type']=='cisco_wlc' or objDict['device_type']=='cisco_ftd':
                        command = 'show running-config' 
                    elif objDict['device_type']=='fortinet':
                        command = 'show full-configuration'
                    configurationPuller = DownloadPuller()
                    output = configurationPuller.poll(objDict,command)
                    if output==None:
                        pass
                    else:

                        finalResult.append(output)

            # print(len(finalResult),file=sys.stderr)
            

            # if len(objList)==len(finalResult) or len(finalResult)>1:
            #     return jsonify(finalResult),200
            # elif len(finalResult)==0:
            #     return "Failed to Login into All Devices",500 
            # print(finalResult,file=sys.stderr)
            return jsonify(finalResult),200
            # else:
            #     return "Something Went Wrong",500
            # print(f" OUTPUT IN API IS {(output)}",file=sys.stderr)
            # return "Configuration Backup Successful",200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  
            
@app.route('/deleteConfigurations',methods = ['POST'])
@token_required
def DeleteConfigurations(user_data):
    if True:
        try:
            configurationObjs = request.get_json()
            for configurationObj in configurationObjs:
                queryString = f"delete from ncm_history_table where FILE_NAME='{configurationObj}';"
                db.session.execute(queryString)
                db.session.commit()
                if os.path.exists(f"{configurationObj}.cfg"):
                    os.remove(f"{configurationObj}.cfg")
                else:
                    print("The file does not exist")
            return "Configurations Deleted Successfully",200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401
    
@app.route('/mostRecentChanges',methods = ['GET'])
@token_required
def MostRecentChanges(user_data):
    if True:
        try:
            cwd = os.getcwd()
            existingPath = f"{cwd}/app/templates/html_diff_output_most_recent.html"
            existingPath1 = os.path.exists(existingPath)
            if existingPath1: 
                print("Existing File Removed",file=sys.stderr)
                os.remove(existingPath)
            else:
                pass
            queryString = f"select CONFIGURATION_DATE from ncm_history_table order by CONFIGURATION_DATE DESC LIMIT 2;"
            result = db.session.execute(queryString)
            dateList = []
            for row in result:
                dateList.append(row[0])
            if len(dateList)<=2:
                return "There Should be Atleast Two Backups",500
            else:
                fileList = []
                queryString1 = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE='{dateList[1]}';"
                result1 = db.session.execute(queryString1)
                for row in result1:
                    fileList.append(row[0])
                queryString2 = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE='{dateList[0]}';"
                result2 = db.session.execute(queryString2)
                for row in result2:
                    fileList.append(row[0])
                if len(fileList)==2:

                    cwd = os.getcwd()
                    path = f"{cwd}/app/configuration_backups/"
                    path1 = f"/app/app/templates/html_diff_output_most_recent.html"
                    html_diff = ConfDiff(f"{path}{fileList[0]}.cfg", f"{path}{fileList[1]}.cfg", path1)
                    html_diff.diff()
                
                    return render_template('html_diff_output.html'),200
                else:
                    return "Something Went Wrong",500
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401