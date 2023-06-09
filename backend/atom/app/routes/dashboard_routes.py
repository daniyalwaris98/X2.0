from distutils.file_util import move_file
from ipaddress import ip_address
from operator import mod
import site
import sys, json
import traceback
from unittest.util import _count_diff_all_purpose
from wsgiref.simple_server import software_version
from flask_jsonpify import jsonify
from flask import Flask, request, make_response, Response, session
from app import app ,db 
from app.models.inventory_models import Phy_Table, Rack_Table, Device_Table, Board_Table, Subboard_Table, Sfps_Table, License_Table, Atom
from sqlalchemy import func
from datetime import datetime
from dateutil.relativedelta import relativedelta
from flask_cors import CORS, cross_origin
from app.middleware import token_required
def FormatDate(date):
    #print(date, file=sys.stderr)
    if date is not None:
        result = date.strftime('%d-%m-%Y')
    else:
        #result = datetime(2000, 1, 1)
        result = datetime(1, 1, 2000)

    return result

def FormatStringDate(date):
    print(date, file=sys.stderr)

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

@app.route('/dashboardCards',methods = ['GET'])
@token_required
def DashboardCards(user_data):
    if True:
        try:
            queryString = f"select count(SITE_NAME) from phy_table;"
            queryString2 = f"select count(RACK_NAME) from rack_table;"
            queryString3 = f"select count(DEVICE_NAME) from device_table;"
            queryString4 = f"select count(BOARD_NAME) from board_table;"
            queryString5 = f"select count(SUBBOARD_NAME) from subboard_table;"
            queryString6 = f"select count(SFP_ID) from sfp_table;"
            queryString7 = f"select  count(LICENSE_NAME) from license_table;"
            queryString8 = f"select  count(AP_NAME) from aps_table;"
            # queryString8 = f"select count(`FUNCTION`) from device_table where `FUNCTION`='SWITCH';"
            result = db.session.execute(queryString).scalar()
            result1 = db.session.execute(queryString2).scalar()
            result2= db.session.execute(queryString3).scalar()
            result3 = db.session.execute(queryString4).scalar()
            result4 = db.session.execute(queryString5).scalar()
            result5 = db.session.execute(queryString6).scalar()
            result6 = db.session.execute(queryString7).scalar()
            result7 = db.session.execute(queryString8).scalar()
            # result7 = db.session.execute(queryString8).scalar()
            objList = [
                {
                    'name':'SITES',
                    'value':int(result)
                },
                {
                    'name':'RACKS',
                    'value':int(result1)
                },
                {
                    'name':'DEVICES',
                    'value':int(result2)
                },
                {
                    'name':'MODULES',
                    'value':int(result3)
                },
                # {
                #     'name':'SS',
                #     'value':int(result4)
                # },
                {
                    'name':'SFPs',
                    'value':int(result5)
                },
                {
                    'name':'LICENSES',
                    'value':int(result6)
                },
                {
                    'name':'APs',
                    'value':int(result7)
                }
            ]
            return jsonify(objList),200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503


@app.route("/functions",methods = ['GET'])
@token_required
def Functions(user_data):
    if True:
        try:
            objList = []
            queryString = "select `FUNCTION`,count(`FUNCTION`) from device_table group by `FUNCTION`;"
            result = db.session.execute(queryString)
            for row in result:
                function = row[0]
                functionCount = row[1]
                objDict = {}
                objDict[function] = functionCount
                objList.append(objDict)
            print(objList,file=sys.stderr)
            y = {}
            for i in objList:
                for j in i:
                    y[j] = i[j]
                    print(y[j],file=sys.stderr)
            
                # if function in objDict:
                #     count = 'value'
                #     objDict[function][count]=functionCount
                #     print(objDict,file=sys.stderr)
                # else:
                #     objDict[function]={}
                #     count  = 'value'
                #     objDict[function]['value']=0
                #     objDict[function]['value']=functionCount
            # objList=[]
            # for function in objDict:
            #     dict = objDict[function]
            #     dict['name']=function
            #     objList.append(dict)
            # print(objList,file=sys.stderr)
            
            return (y),200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503

@app.route("/onboardedDevicesPerMonth", methods = ['GET'])
@token_required
def OnBoardDevicePerMonth(user_data):
    current_date = datetime.today()

    date_1 = (current_date - relativedelta(months=0)).strftime('%Y-%m')
    print(date_1, file=sys.stderr)

    date_2 = (current_date - relativedelta(months=1)).strftime('%Y-%m')
    print(date_2, file=sys.stderr)

    date_3 = (current_date - relativedelta(months=2)).strftime('%Y-%m')
    print(date_3, file=sys.stderr)

    date_4 = (current_date - relativedelta(months=3)).strftime('%Y-%m')
    print(date_4, file=sys.stderr)

    date_5 = (current_date - relativedelta(months =4)).strftime('%Y-%m')
    print(date_5,file=sys.stderr)
    
    date_6 = (current_date - relativedelta(months =5)).strftime('%Y-%m')
    print(date_6,file=sys.stderr)
    
    date_7 = (current_date - relativedelta(months =6)).strftime('%Y-%m')
    print(date_7,file=sys.stderr)
    
    date_8 = (current_date - relativedelta(months =7)).strftime('%Y-%m')
    print(date_8,file=sys.stderr)
    igw_8_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_8}%' and DOMAIN='IGW';").scalar()
    igw_7_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_7}%' and DOMAIN='IGW';").scalar()
    igw_6_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_6}%' and DOMAIN='IGW';").scalar()
    igw_5_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_5}%' and DOMAIN='IGW';").scalar()   
    igw_4_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_4}%' and DOMAIN='IGW';").scalar()
    igw_3_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_3}%' and DOMAIN='IGW';").scalar()
    igw_2_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_2}%' and DOMAIN='IGW';").scalar()
    igw_1_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_1}%' and DOMAIN='IGW';").scalar()
    
    edn_8_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_8}%' and DOMAIN='EDN';").scalar()
    edn_7_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_7}%' and DOMAIN='EDN';").scalar()
    edn_6_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_6}%' and DOMAIN='EDN';").scalar()
    edn_5_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_5}%' and DOMAIN='EDN';").scalar()
    edn_4_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_4}%' and DOMAIN='EDN';").scalar()
    edn_3_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_3}%' and DOMAIN='EDN';").scalar()
    edn_2_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_2}%' and DOMAIN='EDN';").scalar()
    edn_1_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_1}%' and DOMAIN='EDN';").scalar()

    soc_8_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_8}%' and DOMAIN='SOC';").scalar()
    soc_7_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_7}%' and DOMAIN='SOC';").scalar()
    soc_6_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_6}%' and DOMAIN='SOC';").scalar()
    soc_5_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_5}%' and DOMAIN='SOC';").scalar()
    soc_4_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_4}%' and DOMAIN='SOC';").scalar()
    soc_3_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_3}%' and DOMAIN='SOC';").scalar()
    soc_2_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_2}%' and DOMAIN='SOC';").scalar()
    soc_1_count = db.session.execute(f"select coalesce(sum(STACK),0) from device_table where CREATION_DATE like '%{date_1}%' and DOMAIN='SOC';").scalar()
    if True:
        try:
            objList = [
                {
                    "month": date_8,
                    "IGW": int(igw_8_count),
                    "EDN": int(edn_8_count),
                    "SOC": int(soc_8_count)                
                },
                {
                    "month": date_7,
    
                    "IGW": int(igw_7_count),
                    "EDN": int(edn_7_count),
                    "SOC": int(soc_7_count)
                },
                {
                    "month": date_6,
                    "IGW":int(igw_6_count),
                    "EDN": int(edn_6_count),
                    "SOC": int(soc_6_count),
                    
                },
                {
                    "month": date_5,
                    "IGW":int(igw_5_count),
                    "EDN": int(edn_5_count),
                    "SOC": int(soc_5_count),
                    
                },
                {
                    "month": date_4,
                    "IGW":int(igw_4_count),
                    "EDN": int(edn_4_count),
                    "SOC": int(soc_4_count),
                    
                    
                },
                {
                    "month": date_3,
                    "IGW":int(igw_3_count),
                    "EDN": int(edn_3_count),
                    "SOC": int(soc_3_count),
            
                },
                {
                    "month": date_2,
                    "IGW":int(igw_2_count),
                    "EDN": int(edn_2_count),
                    "SOC": int(soc_2_count),
                    
                },
                {
                    "month": date_1,
                    "IGW":int(igw_1_count),
                    "EDN": int(edn_1_count),
                    "SOC": int(soc_1_count),
                }
            ]
            months = []
            domains = []
            edn = []
            igw = []
            soc = []
            objDict = {}
            for dic in objList:
                for key in dic:
                    if key!='month':
                        domains.append(key)
                        unique_list = []
            
                        for x in domains:
                            if x not in unique_list:
                                unique_list.append(x)
                                objDict['labelsx'] = unique_list
                        
                    if key=='month':
                        months.append(dic[key])
                        objDict['labelsy']=months
                    
                    if key=='EDN':
                        edn.append(dic[key])
                        
                        objDict['EDN']=edn
                    if key=='IGW':
                        igw.append(dic[key])
                        objDict['IGW']=igw
                    if key=='SOC':
                        soc.append(dic[key])
                        objDict['SOC']=soc
            return (objDict), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500


    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503

@app.route('/onboardedPerDomain',methods = ['GET'])
@token_required
def OnboardedPerDomain(user_data):
    if True:
        try:
            objList = []
            queryString = f"select DOMAIN,coalesce(sum(STACK),0) from device_table group by DOMAIN;"
            result = db.session.execute(queryString)
            for row in result:
                domain = row[0]
                count = row[1]
                objDict = {}
                objDict['name'] = domain
                objDict['value'] = int(count)
                objList.append(objDict)
            return jsonify(objList),200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503
        

@app.route('/topSitesDashboard',methods = ['GET'])
@token_required
def TopSitesDashboard(user_data):
    if True:
        try:
            queryString = f"select IP_ADDRESS,SITE_NAME,SOFTWARE_TYPE,STATUS from device_table;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                ip_address = row[0]
                site_name = row[1]
                software_type = row[2]
                status = row[3]
                objDict = {}
                objDict['ip_address'] = ip_address
                objDict['site_name'] = site_name
                # objDict['software_type'] = software_type
                objDict['operational_status'] = status
                objDict['onboard_status'] = 'True'
                objList.append(objDict)
            return jsonify(objList),200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503    

@app.route('/deviceLeaflet',methods = ['GET'])
@token_required
def DeviceLeaflet(user_data):
    if True:
        try:
            queryString = f"select LONGITUDE,LATITUDE,CITY from phy_table;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                longitude = row[0]
                latitude = row[1]
                city = row[2]
                objDict = {}
                objDict['longitude'] = longitude
                objDict['latitude'] = latitude
                objDict['city'] = city
                objList.append(objDict)
            return jsonify(objList),200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503


@app.route('/getUnusedSfps',methods = ['GET'])
def GetUnusedSfps():
    if True:
        try:
            queryString = f"select distinct DEVICE_IP,DEVICE_NAME,(UNUSED_SFPS_1G+UNUSED_SFPS_10G+UNUSED_SFPS_25G+UNUSED_SFPS_40G+UNUSED_SFPS_100G) as total_count from dc_capacity ORDER BY  total_count desc limit 10;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                objDict = {}
                objDict['ip_address'] = row[0]
                objDict['device_name'] = row[1]
                objDict['unused_sfps'] = row[2]
                objList.append(objDict)
            return jsonify(objList),200
        except Exception as e:
            print(str(e),500)
            traceback.print_exc()
            return str(e),500

    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503

@app.route('/getVendorsCount',methods = ['GET'])
@token_required
def GetVendorsCount(user_data):
    if True:
        try:
            queryString = f"select distinct `manufacturer`,count(manufacturer) from device_table group by manufacturer;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                objDict = {}
                objDict[row[0]]=int(row[1])
                objList.append(objDict)
            y = {}
            for i in objList:
                for j in i:
                    y[j] = i[j]
            
            print(objList,file = sys.stderr)
            return (y),200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503
