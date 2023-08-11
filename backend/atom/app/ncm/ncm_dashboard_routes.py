import traceback
from app import app, db
from flask import request, make_response, Response, session
from app.models.inventory_models import *
from flask_jsonpify import jsonify
import pandas as pd
import json
import sys  
import time
from datetime import date, datetime, timedelta
from sqlalchemy import func
from app.middleware import token_required
from dateutil.relativedelta import relativedelta
import gzip
from flask_cors import CORS, cross_origin

@app.route('/perFunctionCountNcm',methods = ['GET'])
@token_required
def PerFunctionCountNcm(user_data):
    if True:
        try:
            queryString = f"select `FUNCTION`,count(`FUNCTION`) from ncm_table group  by `FUNCTION`;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                objDict = {}
                function = row[0]
                count = row[1]
                objDict['name'] = function
                objDict['value'] = count
                objList.append(objDict)
            return jsonify(objList),200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route('/ncmBackupCounts',methods = ['GET'])
@token_required
def NcmBackupCounts(user_data):
    if True:
        try:

            queryString = f"select coalesce(sum(`SUCCESS`),0) from ncm_configuration_status_table;"
            result = db.session.execute(queryString).scalar()
            if result==None or result=='':
                result = 0
            queryString1 = f"select coalesce(sum(`FAILURE`),0) from ncm_configuration_status_table;"
            result1 = db.session.execute(queryString1).scalar()
            if result1==None or result1=='':
                result1 = 0
            queryString2 = f"select count(*) from ncm_table where STATUS='InActive';"
            result2 = db.session.execute(queryString2).scalar()
            if result2==None or result2=='':
                result2 = 0
            objDict = {
                'backup_successful':int(result),
                'backup_failure':int(result1),
                'not_backup':int(result2)
            }
            return objDict,200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401
    


@app.route('/ncmBackupSummeryDashboard',methods = ['GET'])
@token_required
def NcmBackupSummeryDashboard(user_data):
    if True:
        try:

            queryString = f"select coalesce(sum(`SUCCESS`),0) from ncm_configuration_status_table;"
            result = db.session.execute(queryString).scalar()
            if result==None or result=='':
                result = 0
            queryString1 = f"select coalesce(sum(`FAILURE`),0) from ncm_configuration_status_table;"
            result1 = db.session.execute(queryString1).scalar()
            if result1==None or result1=='':
                result1 = 0
            queryString2 = f"select count(*) from ncm_table where STATUS='InActive';"
            result2 = db.session.execute(queryString2).scalar()
            if result2==None or result2=='':
                result2 = 0
            
            objList = [
                {'name':'Backup Successful',
                 'value':int(result)
                },
                {'name':'Backup Failure',
                 'value':int(result1)
                },
                {'name':'Not Backup',
                 'value':int(result2)
                }

            ]
            return jsonify(objList),200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401
    

@app.route('/ncmAlarmDashboard',methods = ['GET'])
@token_required
def NCMAlarmDashboard(user_data):
    if True:
        try:
            query = f"SELECT * FROM failed_devices_table t1  WHERE t1.date = (SELECT MAX(t2.date) FROM failed_devices_table t2 WHERE t2.ip_address = t1.ip_address and module ='NCM')  AND t1.module = 'NCM';"
            return "OK",200
        except Exception as e:
            traceback.print_exc()
            return "Error While Fetching The Data\nFor Configuration Summery Garph",500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401



@app.route('/ncmDeviceSummryDashboard',methods = ['GET'])
@token_required
def NCMDeviceSummryDashboard(user_data):
    if True:
        try:
            query = f"select device_type, `function`, count(*) as device_count from ncm_table group by device_type, `function`;"
            result = db.session.execute(query)
            objList = []
            for row in result:
                objDict = {}
                objDict['device_type'] = row[0]
                objDict['function'] = row[1]
                objDict['device_count'] = row[2]
                objList.append(objDict)

            return jsonify(objList),200
        except Exception as e:
            traceback.print_exc()
            return "Error While Fetching The Data\nFor Configuration Summery Garph",500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401



@app.route('/ncmChangeSummryByDevice',methods = ['GET'])
@token_required
def NCMChangeSummryByDevice(user_data):
    if True:
        current_time = datetime.now()
        pre_time = datetime.now() - timedelta(days=1)
        try:
            
            query = f"select count(*) as BACKUP_COUNT,VENDOR from ncm_table where config_change_date>'{pre_time}' group by VENDOR ORDER by BACKUP_COUNT DESC LIMIT 5;"
            result = db.session.execute(query)
            
            nameList = []
            valueList = []
            for row in result:
                if row[1] == '':
                    nameList.append('Undefined')
                else:
                    nameList.append(row[1])
                
                valueList.append(int(row[0]))
            
            if len(nameList)<=0:
                nameList = ['Cisco','Huawei','Juniper','Fortinet','Other']
                valueList = [0,0,0,0,0]
            
            objDict = {
                'name':nameList,
                'value':valueList
            }

            return jsonify(objDict),200
        except Exception as e:
            traceback.print_exc()
            return "Error While Fetching The Data\nFor Configuration Change Count By Vendors Garph",500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401
    


@app.route('/ncmChangeSummryByTime',methods = ['GET'])
@token_required
def NCMChangeSummryByTime(user_data):
    if True:
        current_time = datetime.now()
        pre_time = datetime.now() - timedelta(days=1)
        try:
            
            query = f"SELECT COUNT(*) AS BACKUP, DATE_FORMAT(config_change_date, '%Y-%m-%d %H:00:00') AS hour_interval FROM ncm_table where config_change_date IS NOT NULL  GROUP BY hour_interval ORDER BY BACKUP DESC LIMIT 5;"
            result = db.session.execute(query)
            
            nameList = []
            valueList = []
            for row in result:
                nameList.append(row[1])
                valueList.append(int(row[0]))

            if len(nameList)<=0:
                for i in range(5):
                    temp_time = current_time - timedelta(hours=i)
                    nameList.append(f"{temp_time.date()} {temp_time.hour}:00")
                    valueList.append(0)
                    
            objDict = {
                'name':nameList,
                'value':valueList
            }

            return jsonify(objDict),200
        except Exception as e:
            traceback.print_exc()
            return "Error While Fetching The Data\nFor Configuration Change Count By Timw Garph",500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401
    

@app.route('/ncmAlarmSummery',methods = ['GET'])
@token_required
def NCMAlarmSummry(user_data):
    if True:
        current_time = datetime.now()
        pre_time = datetime.now() - timedelta(days=1)
        try:
            
            query = f"SELECT * from ncm_alarm_table where ALARM_STATUS='Open' LIMIT 50;"
            result = db.session.execute(query)
            objList = []
            for row in result:
                objDict = {}
                objDict['ip_address'] = row[1]
                objDict['device_name'] = row[2]
                objDict['alarm_category'] = row[3]
                objDict['alarm_title'] = row[4]
                objDict['alarm_description'] = row[5]
                objDict['alarm_status'] = row[6]
                objDict['creation_date'] = row[7]
                objDict['modification_date'] = row[8]
                objDict['resolve_remarks'] = row[9]
                objDict['alarm_mail_status'] = row[10]
                objDict['alarm_mail_date'] = row[11]
                objDict['resolve_mail_status'] = row[12]
                objDict['resolve_mail_date'] = row[13]
                
                objList.append(objDict)

            return jsonify(objList),200
        except Exception as e:
            traceback.print_exc()
            return "Error While Fetching The Data\nFor Configuration Change Count By Timw Garph",500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401