from distutils.file_util import move_file
from ipaddress import ip_address
from operator import mod
import site
import gzip
import traceback
import sys, json
from unittest.util import _count_diff_all_purpose
from wsgiref.simple_server import software_version
from flask_jsonpify import jsonify
from flask import Flask, request, make_response, Response, session
from app import app ,db 
from app.models.inventory_models import Phy_Table, Rack_Table, Device_Table, Board_Table, Subboard_Table, Sfps_Table, License_Table, Atom,IPAM_TABLE,DC_CAPACITY, INVENTORY_SCRIPTS_STATUS, DC_CAPACITY_DEVICES_TABLE
from sqlalchemy import func
from app.dc_capacity.dc_capacity import DCCAPACITY
from datetime import datetime
import re
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
def UpdateData(obj):
    #add data to db
    #print(obj, file=sys.stderr)
    try:
        db.session.flush()

        db.session.merge(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(f"Something else went wrong during Database Update {e}", file=sys.stderr)
    
    return True

def InsertData(obj):
    #add data to db
    try:        
        db.session.add(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(f"Something else went wrong in Database Insertion {e}", file=sys.stderr)

    return True

@app.route('/getAllDcCapacity',methods = ['GET'])
@token_required
def GetAllDcCapacity(user_data):
    if True:
        try:
            dcCapacityObjList = []
            dcCapacityObjs = DC_CAPACITY.query.all()
            for dcCapacityObj in dcCapacityObjs:
                dcCapacityDataDict = {}
                dcCapacityDataDict['dc_capacity_id'] = dcCapacityObj.dc_capacity_id
                dcCapacityDataDict['device_ip'] = dcCapacityObj.device_ip
                dcCapacityDataDict['site_name'] =dcCapacityObj.site_name
                dcCapacityDataDict['device_name'] =dcCapacityObj.device_name
                dcCapacityDataDict['os_version'] =dcCapacityObj.os_version
                dcCapacityDataDict['total_1g_ports'] =dcCapacityObj.total_1g_ports
                dcCapacityDataDict['total_10g_ports'] =dcCapacityObj.total_10g_ports
                dcCapacityDataDict['total_25g_ports'] =dcCapacityObj.total_25g_ports
                dcCapacityDataDict['total_40g_ports'] = dcCapacityObj.total_40g_ports
                dcCapacityDataDict['total_100g_ports'] =dcCapacityObj.total_100g_ports
                dcCapacityDataDict['total_fast_ethernet_ports'] =dcCapacityObj.total_fast_ethernet_ports
                dcCapacityDataDict['connected_1g'] =dcCapacityObj.connected_1g
                dcCapacityDataDict['connected_10g'] =dcCapacityObj.connected_10g
                dcCapacityDataDict['connected_25g'] =dcCapacityObj.connected_25g
                dcCapacityDataDict['connected_40g'] =dcCapacityObj.connected_40g
                dcCapacityDataDict['connected_100g'] =dcCapacityObj.connected_100g
                dcCapacityDataDict['connected_fast_ethernet'] =dcCapacityObj.connected_fast_ethernet
                dcCapacityDataDict['not_connected_1g'] =dcCapacityObj.not_connected_1g
                dcCapacityDataDict['not_connected_10g'] =dcCapacityObj.not_connected_10g
                dcCapacityDataDict['not_connected_25g'] =dcCapacityObj.not_connected_25g
                dcCapacityDataDict['not_connected_40g'] =dcCapacityObj.not_connected_40g
                dcCapacityDataDict['not_connected_100g'] =dcCapacityObj.not_connected_100g
                dcCapacityDataDict['not_connected_fast_ethernet'] =dcCapacityObj.not_connected_fast_ethernet
                dcCapacityDataDict['unused_sfps_1g'] =dcCapacityObj.unused_sfps_1g
                dcCapacityDataDict['unused_sfps_10g'] =dcCapacityObj.unused_sfps_10g
                dcCapacityDataDict['unused_sfps_25g'] =dcCapacityObj.unused_sfps_25g
                dcCapacityDataDict['unused_sfps_40g'] =dcCapacityObj.unused_sfps_40g
                dcCapacityDataDict['unused_sfps_100g'] =dcCapacityObj.unused_sfps_40g
                dcCapacityDataDict['creation_date'] = FormatDate((datetime.now()))
                dcCapacityDataDict['modification_date'] = FormatDate((datetime.now()))
                dcCapacityObjList.append(dcCapacityDataDict)
            print(dcCapacityObjList,file=sys.stderr)
            return jsonify(dcCapacityObjList),200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503

@app.route('/addDcCapacity',methods = ['POST'])
@token_required
def AddDcCapacity(user_data):
    if True:
        try:
            dcCapacityObjs = request.get_json()
            print(dcCapacityObjs,file=sys.stderr)
            for dcCapacityObj in dcCapacityObjs:
                dcCapacity = DC_CAPACITY()
                dcCapacity.device_ip = dcCapacityObj['device_ip']
                dcCapacity.site_name = dcCapacityObj['site_name']
                dcCapacity.device_name = dcCapacityObj['device_name']
                dcCapacity.os_version = dcCapacityObj['os_version']
                dcCapacity.total_1g_ports = dcCapacityObj['device_ip']
                dcCapacity.total_10g_ports = dcCapacityObj['device_ip']
                dcCapacity.total_25g_ports = dcCapacityObj['device_ip']
                dcCapacity.total_40g_ports = dcCapacityObj['device_ip']
                dcCapacity.total_100g_ports = dcCapacityObj['device_ip']
                dcCapacity.total_fast_ethernet_ports = dcCapacityObj['device_ip']
                dcCapacity.connected_1g = dcCapacityObj['device_ip']
                dcCapacity.connected_10g = dcCapacityObj['device_ip']
                dcCapacity.connected_25g = dcCapacityObj['device_ip']
                dcCapacity.connected_40g = dcCapacityObj['device_ip']
                dcCapacity.connected_100g = dcCapacityObj['device_ip']
                dcCapacity.connected_fast_ethernet = dcCapacityObj['device_ip']
                dcCapacity.not_connected_1g = dcCapacityObj['device_ip']
                dcCapacity.not_connected_10g = dcCapacityObj['device_ip']
                dcCapacity.not_connected_25g = dcCapacityObj['device_ip']
                dcCapacity.not_connected_40g = dcCapacityObj['device_ip']
                dcCapacity.not_connected_100g = dcCapacityObj['device_ip']
                dcCapacity.not_connected_fast_ethernet = dcCapacityObj['device_ip']
                dcCapacity.unused_sfps_1g = dcCapacityObj['device_ip']
                dcCapacity.unused_sfps_10g = dcCapacityObj['device_ip']
                dcCapacity.unused_sfps_25g = dcCapacityObj['device_ip']
                dcCapacity.unused_sfps_40g = dcCapacityObj['device_ip']
                dcCapacity.unused_sfps_100g= dcCapacityObj['device_ip']
                dcCapacity.creation_date= datetime.now()
                dcCapacity.modification_date = datetime.now()
                InsertData(dcCapacity)
                print("Inserted " +dcCapacityObj['site_name'],file=sys.stderr)
            
            return jsonify({'response': "success","code":"200"})
        except Exception as e:
            traceback.print_exc()
            return str(e), 500 
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503

@app.route('/editDcCapacity',methods = ['POST'])
@token_required
def editDcCapacity(user_data):
    if True:
        try:
            dcCapacityObj = request.get_json()
            print(dcCapacityObj,file=sys.stderr)
            dcCapacity = DC_CAPACITY()
            dcCapacity.device_ip = dcCapacityObj['device_ip']
            dcCapacity.site_name = dcCapacityObj['site_name']
            dcCapacity.device_name = dcCapacityObj['device_name']
            dcCapacity.os_version = dcCapacityObj['os_version']
            dcCapacity.total_1g_ports = dcCapacityObj['device_ip']
            dcCapacity.total_10g_ports = dcCapacityObj['device_ip']
            dcCapacity.total_25g_ports = dcCapacityObj['device_ip']
            dcCapacity.total_40g_ports = dcCapacityObj['device_ip']
            dcCapacity.total_100g_ports = dcCapacityObj['device_ip']
            dcCapacity.total_fast_ethernet_ports = dcCapacityObj['device_ip']
            dcCapacity.connected_1g = dcCapacityObj['device_ip']
            dcCapacity.connected_10g = dcCapacityObj['device_ip']
            dcCapacity.connected_25g = dcCapacityObj['device_ip']
            dcCapacity.connected_40g = dcCapacityObj['device_ip']
            dcCapacity.connected_100g = dcCapacityObj['device_ip']
            dcCapacity.connected_fast_ethernet = dcCapacityObj['device_ip']
            dcCapacity.not_connected_1g = dcCapacityObj['device_ip']
            dcCapacity.not_connected_10g = dcCapacityObj['device_ip']
            dcCapacity.not_connected_25g = dcCapacityObj['device_ip']
            dcCapacity.not_connected_40g = dcCapacityObj['device_ip']
            dcCapacity.not_connected_100g = dcCapacityObj['device_ip']
            dcCapacity.not_connected_fast_ethernet = dcCapacityObj['device_ip']
            dcCapacity.unused_sfps_1g = dcCapacityObj['device_ip']
            dcCapacity.unused_sfps_10g = dcCapacityObj['device_ip']
            dcCapacity.unused_sfps_25g = dcCapacityObj['device_ip']
            dcCapacity.unused_sfps_40g = dcCapacityObj['device_ip']
            dcCapacity.unused_sfps_100g= dcCapacityObj['device_ip']
            dcCapacity.modification_date = datetime.now()
            UpdateData(dcCapacity)
            print("Updated " +dcCapacityObj['site_name'],file=sys.stderr)
            
            return jsonify({'response': "success","code":"200"})
        except Exception as e:
            traceback.print_exc()
            return str(e), 500 
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503


@app.route('/dcCapacityTotalPorts',methods = ['GET'])
@token_required
def DcCapacityTotalPorts(user_data):
    if True:
        try:
            queryString = f"select sum(TOTAL_1g_PORTS)+sum(TOTAL_10g_PORTS)+sum(TOTAL_25g_PORTS)+sum(TOTAL_40g_PORTS)+sum(TOTAL_100G_PORTS)+sum(TOTAL_FAST_ETHERNET_PORTS) from dc_capacity;"
            result = db.session.execute(queryString).scalar()
            objDict = {}
            objDict['name'] = 'Total Ports'
            objDict['value'] = result
            print(objDict,file=sys.stderr)
            return (objDict),200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503
    
@app.route('/dcCapacityConnectedPorts',methods = ['GET'])
def DcCapacityConnectedPorts():
    if True:
        try:
            queryString1 = f"select sum(CONNECTED_1G)+sum(CONNECTED_10G)+sum(CONNECTED_25G)+sum(CONNECTED_40G)+sum(CONNECTED_100G)+sum(CONNECTED_FAST_ETHERNET) from dc_capacity;"
            result1 = db.session.execute(queryString1).scalar()
            objDict = {}
            objDict['name'] = 'Connected Ports'
            objDict['value'] = result1
            print(objDict,file=sys.stderr)
            return (objDict),200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503

@app.route('/dcCapacityNotConnectedPorts',methods = ['GET'])
@token_required
def DcCapacityNotConnectedPorts(user_data):
    if True:
        try:
            queryString2 = f"select sum(NOT_CONNECTED_1G)+sum(NOT_CONNECTED_10G)+sum(NOT_CONNECTED_25G)+sum(NOT_CONNECTED_40G)+sum(NOT_CONNECTED_100G)+sum(NOT_CONNECTED_FAST_ETHERNET) from dc_capacity;"
            result2 = db.session.execute(queryString2).scalar()
            objDict = {}
            objDict['name'] = 'Not Connected Ports'
            objDict['value'] = result2
            print(objDict,file=sys.stderr)
            return (objDict),200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503

@app.route('/dcCapacityUnusedSfps',methods = ['GET'])
@token_required
def DcCapacityUnusedSfps(user_data):
    if True:
        try:
            queryString3 = f"select sum(UNUSED_SFPS_1G)+sum(UNUSED_SFPS_10G)+sum(unused_sfps_25g)+sum(unused_sfps_40g)+sum(unused_sfps_100g) from dc_capacity;"
            result3 = db.session.execute(queryString3).scalar()
            objDict = {}
            objDict['name'] = 'Unused SFPs'
            objDict['value'] = result3
            print(objDict,file=sys.stderr)
            return (objDict),200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503

@app.route('/totalPortsBarChart',methods = ['GET'])
@token_required
def TotalPortsBarChart(user_data):
    if True:
        try:
            queryString = f"select sum(TOTAL_1g_PORTS),sum(TOTAL_10g_PORTS),sum(TOTAL_25g_PORTS),sum(TOTAL_40g_PORTS),sum(TOTAL_100G_PORTS),sum(TOTAL_FAST_ETHERNET_PORTS) from dc_capacity;"
            result = db.session.execute(queryString)
            
            for row in result:
                total_1g = row[0]
                total_10g = row[1]
                total_25g = row[2]
                total_40g = row[3]
                total_100g = row[4]
                total_fast_ethernet = row[5]
                objDict = {}    
                objDict['Total 1G Ports'] = total_1g
                objDict['Total 10G Ports'] = total_10g
                objDict['Total 25G Ports'] = total_25g
                objDict['Total 40G Ports'] = total_40g
                objDict['Total 100G Ports'] = total_100g
                objDict['Total Fast Ethernet'] = total_fast_ethernet
            return objDict,200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503

@app.route('/notConnectedPortsBarChart',methods = ['GET'])
@token_required
def NotConnectedPortsBarChart(user_data):
    if True:
        try:
            queryString = f"select sum(NOT_CONNECTED_1g),sum(NOT_CONNECTED_10g),sum(NOT_CONNECTED_25g),sum(NOT_CONNECTED_40g),sum(NOT_CONNECTED_100G),sum(NOT_CONNECTED_FAST_ETHERNET) from dc_capacity;"
            result = db.session.execute(queryString)
            for row in result:
                not_connected_1g = row[0]
                not_connected_10g = row[1]
                not_connected_25g = row[2]
                not_connected_40g = row[3]
                not_connected_100g = row[4]
                not_connected_fast_ethernet = row[5]
                objDict = {}
                objDict['Not Connected 1G Ports'] = not_connected_1g
                objDict['Not Connected 10G Ports'] = not_connected_10g
                objDict['Not Connected 25G Ports'] = not_connected_25g
                objDict['Not Connected 40G Ports'] = not_connected_40g
                objDict['Not Connected 100G Ports'] = not_connected_100g
                objDict['Not Connected Fast Ethernet'] = not_connected_fast_ethernet
            return objDict,200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503

@app.route('/connectedPortsRadicalChart',methods = ['GET'])
@token_required
def ConnectedPortsRadicalChart(user_data):
    if True:
        try:
            objList = []
            queryString = f"select sum(CONNECTED_1g) from dc_capacity;"
            result = db.session.execute(queryString)
            for row in result:
                objDict = {}
                objDict['name'] = '1G Ports'
                objDict['value'] = row[0]
                objDict['fill'] = "#27AE10"
                objList.append(objDict)
            queryString1 = f"select sum(CONNECTED_10g) from dc_capacity;"
            result1 = db.session.execute(queryString1)
            for row in result1:
                objDict = {}
                objDict['name'] = '10G Ports'
                objDict['value'] = row[0]
                objDict['fill'] = "#BB6BD9"
                objList.append(objDict)
            queryString2 = f"select sum(CONNECTED_25g) from dc_capacity;"
            result2 = db.session.execute(queryString2)
            for row in result2:
                objDict = {}
                objDict['name'] = '25G Ports'
                objDict['value'] = row[0]
                objDict['fill'] = "#82ca9d"
                objList.append(objDict)
            queryString3 = f"select sum(CONNECTED_40g) from dc_capacity;"
            result3 = db.session.execute(queryString3)
            for row in result3:
                objDict = {}
                objDict['name'] = '40G Ports'
                objDict['value'] = row[0]
                objDict['fill'] = "#FACE10"
                objList.append(objDict)
            queryString4 = f"select sum(CONNECTED_100g) from dc_capacity;"
            result4 = db.session.execute(queryString4)
            for row in result4:
                objDict = {}
                objDict['name'] = '100G Ports'
                objDict['value'] = row[0]
                objDict['fill'] = "#F2994A"
                objList.append(objDict)
            queryString5 = f"select sum(CONNECTED_FAST_ETHERNET) from dc_capacity;"
            result5 = db.session.execute(queryString5)
            for row in result5:
                objDict = {}
                objDict['name'] = 'Fast Ethernet Ports'
                objDict['value'] = row[0]
                objDict['fill'] = "#56CCF2"
                objList.append(objDict)
            return jsonify(objList),200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503

@app.route('/unusedSfpsRadicalChart',methods = ['GET'])
@token_required
def UnusedSfpsRadicalChart(user_data):
    if True:
        try:
            objList = []
            queryString = f"select sum(UNUSED_SFPS_1g) from dc_capacity;"
            result = db.session.execute(queryString)
            for row in result:
                objDict = {}
                objDict['name'] = '1G Ports'
                objDict['value'] = row[0]
                objDict['fill'] = "#27AE10"
                objList.append(objDict)
            queryString1 = f"select sum(UNUSED_SFPS_10g) from dc_capacity;"
            result1 = db.session.execute(queryString1)
            for row in result1:
                objDict = {}
                objDict['name'] = '10G Ports'
                objDict['value'] = row[0]
                objDict['fill'] = "#BB6BD9"
                objList.append(objDict)
            queryString2 = f"select sum(UNUSED_SFPS_25g) from dc_capacity;"
            result2 = db.session.execute(queryString2)
            for row in result2:
                objDict = {}
                objDict['name'] = '25G Ports'
                objDict['value'] = row[0]
                objDict['fill'] = "#82ca9d"
                objList.append(objDict)
            queryString3 = f"select sum(UNUSED_SFPS_40g) from dc_capacity;"
            result3 = db.session.execute(queryString3)
            for row in result3:
                objDict = {}
                objDict['name'] = '40G Ports'
                objDict['value'] = row[0]
                objDict['fill'] = "#FACE10"
                objList.append(objDict)
            queryString4 = f"select sum(UNUSED_SFPS_100g) from dc_capacity;"
            result4 = db.session.execute(queryString4)
            for row in result4:
                objDict = {}
                objDict['name'] = '100G Ports'
                objDict['value'] = row[0]
                objDict['fill'] = "#F2994A"
                objList.append(objDict)
            # queryString5 = f"select sum(CONNECTED_FAST_ETHERNET) from dc_capacity;"
            # result5 = db.session.execute(queryString5)
            # for row in result5:
            #     objDict = {}
            #     objDict['name'] = 'Connected Fast Ethernet Ports'
            #     objDict['value'] = row[0]
            #     objDict['fill'] = "#56CCF2"
            #     objList.append(objDict)
            return jsonify(objList),200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available",file=sys.stderr)
        return jsonify({"Response":"Service not Available"}),503
        

@app.route("/fetchEdnDcCapacity", methods = ['GET'])
@token_required
def FetchEdnDcCapacity(user_data):  
    if True:
        try:
            FetchEdnDcCapacityFunc(user_data)
            return jsonify("Success"), 200
            
        except Exception as e:
            traceback.print_exc()
            print(f"Exception occured when fetching DcCapacity {e}", file=sys.stderr)
            return jsonify("Failure"), 500

    else: 
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

def FetchEdnDcCapacityFunc(user_data):
    ednDcCapacityList = []

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    query_string = "select site_name, device_name, ip_address, device_type, password_group from atom_table where `function` LIKE '%SWITCH%' and (device_type='cisco_ios' or device_type='cisco_ios_xe' or device_type='cisco_ios_xr' or device_type='cisco_nxos');" 
    result = db.session.execute(query_string)
    
    for row in result:
        ednDcCapacityDict = {}
        ednDcCapacityDict['site_name'] = row[0]
        ednDcCapacityDict['device_name'] = row[1]
        ednDcCapacityDict['ip_address'] = row[2]
        ednDcCapacityDict['device_type'] = row[3]
        password_group = row[4]
        ednDcCapacityDict['type'] = 'EDN'
        ednDcCapacityDict['time'] = current_time
        ednDcCapacityDict['user_id'] = user_data['user_id']

        queryString1 = f"select USERNAME,PASSWORD from password_group_table where PASSWORD_GROUP='{password_group}'"
        result1 = db.session.execute(queryString1)
        for row in result1:
            username = row[0]
            password = row[1]
            ednDcCapacityDict['username'] = username
            ednDcCapacityDict['password'] = password
        
        print(ednDcCapacityDict, file=sys.stderr)
        
        ednDcCapacityList.append(ednDcCapacityDict)
    
    # query_string = "select ip_address, site_name, device_name from atom_table where domain = 'EDN-NET' and device_type = 'APIC';" 
    # result = db.session.execute(query_string)
    # ednACIDict = {}
    # try:
    #     for row in result:
    #         site_apic= row[2].split('-')
    #         site_apic= '-'.join(site_apic[:-1])
    #         if site_apic in ednACIDict:
    #             ednACIDictEntry = {}
    #             ednACIDictEntry['ip_address'] = row[0]
    #             ednACIDictEntry['time'] = current_time
    #             ednACIDictEntry['type'] = 'EDN'
    #             ednACIDictEntry['user_id'] = user_data['user_id']
    #             ednACIDictEntry['device_name'] =row[2]

    #             ednACIDict[site_apic].append(ednACIDictEntry)
    #         else:
    #             site_apic= row[2].split('-')
    #             site_apic= '-'.join(site_apic[:-1])
    #             ednACIDict[site_apic] = []


    #             ednACIDictEntry = {}
    #             ednACIDictEntry['ip_address'] = row[0]
    #             ednACIDictEntry['time'] = current_time
    #             ednACIDictEntry['type'] = 'EDN'
    #             ednACIDictEntry['user_id'] = user_data['user_id']
    #             ednACIDictEntry['device_name'] =row[2]
            
    #             ednACIDict[site_apic].append(ednACIDictEntry)
    # except Exception as e:
    #     print("Exception, {e} ", file=sys.stderr)
    #     traceback.print_exc()

    try:
        dc_capacity= DCCAPACITY()
        # dc_capacity_apic= DCCAPACITYAPIC()
    except Exception as e:
        traceback.print_exc()
        print(f"Exception Occured In EDN DcCapacity {e}", file=sys.stderr)
    #Update Script Status
    
    ednDcCapacityStatus = INVENTORY_SCRIPTS_STATUS.query.filter(INVENTORY_SCRIPTS_STATUS.script=="DC-Capacity").first()

    try:
        ednDcCapacityStatus.script = "DC-Capacity"
        ednDcCapacityStatus.status = "Running"
        ednDcCapacityStatus.creation_date= current_time
        ednDcCapacityStatus.modification_date= current_time
        
        InsertData(ednDcCapacityStatus)
    
    except Exception as e:
        db.session.rollback()
        print(f"Error while updating script status {e}", file=sys.stderr)

    try:
        dc_capacity.getDCCapacity(ednDcCapacityList)
        # dc_capacity_apic.getDCCapacity(ednACIDict)
    except Exception as e:
        print(e, file=sys.stderr)
   
    try:
        ednDcCapacityStatus.script = "DC-Capacity"
        ednDcCapacityStatus.status = "Completed"
        ednDcCapacityStatus.creation_date= current_time
        ednDcCapacityStatus.modification_date= current_time
        db.session.add(ednDcCapacityStatus)
        db.session.commit() 
    
    except Exception as e:
        db.session.rollback()
        print(f"Error while updating script status {e}", file=sys.stderr)

@app.route("/getEdnDcCapacityFetchStatus", methods = ['GET'])
@token_required
def GetEdnDcCapacityFetchStatus(user_data):
    if True:#request.headers.get('X-Auth-Key') == session.get('token', None):
        ednDcCapacity={}
        
        #Getting status of script
        script_status=""
        script_modifiation_date=""
        ednDcCapacityStatus = INVENTORY_SCRIPTS_STATUS.query.filter(INVENTORY_SCRIPTS_STATUS.script== "DC-Capacity").first()
        if ednDcCapacityStatus:
            script_status= ednDcCapacityStatus.status
            script_modifiation_date= str(ednDcCapacityStatus.modification_date)
        ednDcCapacity["fetch_status"] = script_status
        ednDcCapacity["fetch_date"]= script_modifiation_date

        content = gzip.compress(json.dumps(ednDcCapacity).encode('utf8'), 5)
        response = make_response(content)
        response.headers['Content-length'] = len(content)
        response.headers['Content-Encoding'] = 'gzip'
        return response
    else: 
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route("/getAllEdnDcCapacity", methods = ['GET'])
@token_required
def GetAllEdnDcCapacity(user_data):
    if True:#request.headers.get('X-Auth-Key') == session.get('token', None):
        ednDcCapacityObjList=[]
        ednDcCapacityObjs = db.session.execute('SELECT * FROM dc_capacity WHERE creation_date = (SELECT max(creation_date) FROM dc_capacity)')
        
        for ednDcCapacityObj in ednDcCapacityObjs:
            ednDcCapacityDataDict= {}
            ednDcCapacityDataDict['dc_capacity_id']= ednDcCapacityObj[0]
            ednDcCapacityDataDict['device_ip'] = ednDcCapacityObj[1]
            ednDcCapacityDataDict['site_name'] = ednDcCapacityObj[2]
            ednDcCapacityDataDict['device_name'] = ednDcCapacityObj[3]
            ednDcCapacityDataDict['os_version'] = ednDcCapacityObj[4]
            ednDcCapacityDataDict['total_1g_ports'] = ednDcCapacityObj[5]
            ednDcCapacityDataDict['total_10g_ports'] = ednDcCapacityObj[6]
            ednDcCapacityDataDict['total_25g_ports'] = ednDcCapacityObj[7]
            ednDcCapacityDataDict['total_40g_ports'] = ednDcCapacityObj[8]
            ednDcCapacityDataDict['total_100g_ports'] = ednDcCapacityObj[9]
            ednDcCapacityDataDict['total_fast_ethernet_ports'] = ednDcCapacityObj[10]
            ednDcCapacityDataDict['connected_1g'] = ednDcCapacityObj[11]
            ednDcCapacityDataDict['connected_10g'] = ednDcCapacityObj[12]
            ednDcCapacityDataDict['connected_25g'] = ednDcCapacityObj[13]
            ednDcCapacityDataDict['connected_40g'] = ednDcCapacityObj[14]
            ednDcCapacityDataDict['connected_100g'] = ednDcCapacityObj[15]
            ednDcCapacityDataDict['connected_fast_ethernet'] = ednDcCapacityObj[16]
            ednDcCapacityDataDict['not_connected_1g'] = ednDcCapacityObj[17]
            ednDcCapacityDataDict['not_connected_10g'] = ednDcCapacityObj[18]
            ednDcCapacityDataDict['not_connected_25g'] = ednDcCapacityObj[19]
            ednDcCapacityDataDict['not_connected_40g'] = ednDcCapacityObj[20]
            ednDcCapacityDataDict['not_connected_100g'] = ednDcCapacityObj[21]
            ednDcCapacityDataDict['not_connected_fast_ethernet'] = ednDcCapacityObj[22]
            ednDcCapacityDataDict['unused_sfps_1g'] = ednDcCapacityObj[23]
            ednDcCapacityDataDict['unused_sfps_10g'] = ednDcCapacityObj[24]
            ednDcCapacityDataDict['unused_sfps_25g'] = ednDcCapacityObj[25]
            ednDcCapacityDataDict['unused_sfps_40g'] = ednDcCapacityObj[26]
            ednDcCapacityDataDict['unused_sfps_100g'] = ednDcCapacityObj[27]
            
            ednDcCapacityDataDict['creation_date'] = str(ednDcCapacityObj[28])
            ednDcCapacityDataDict['modification_date'] = str(ednDcCapacityObj[29]) 
            # ednDcCapacityDataDict['created_by'] = str(ednDcCapacityObj[30]) 
            # ednDcCapacityDataDict['modified_by'] = str(ednDcCapacityObj[31]) 
            ednDcCapacityObjList.append(ednDcCapacityDataDict)

        content = gzip.compress(json.dumps(ednDcCapacityObjList).encode('utf8'), 5)
        response = make_response(content)
        response.headers['Content-length'] = len(content)
        response.headers['Content-Encoding'] = 'gzip'
        return response
    else: 
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route('/getAllEdnDcCapacityDates',methods=['GET'])
@token_required
def GetAllEdnDcCapacityDates(user_data):

    if True:#session.get('token', None):
        dates = []
        queryString = "select distinct(creation_date) from dc_capacity ORDER BY creation_date DESC;"
        
        result = db.session.execute(queryString)
         
        for row in result:                  
            print(row[0],file=sys.stderr)     
            dates.append(row[0])    

        return jsonify(dates), 200

    else: 
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route("/getAllEdnDcCapacityByDate", methods = ['POST'])
@token_required
def GetAllEdnDcCapacityByDate(user_data):
    if True:#request.headers.get('X-Auth-Key') == session.get('token', None):
        ednDcCapacityObjList=[]

        dateObj = request.get_json()
        print(type(dateObj['date']),file=sys.stderr)  

        utc = datetime.strptime(dateObj['date'], '%a, %d %b %Y %H:%M:%S GMT')
        print(utc,file=sys.stderr)
        current_time = utc.strftime("%Y-%m-%d %H:%M:%S")
        print(current_time,file=sys.stderr)

        ednDcCapacityObjs = db.session.execute(f"SELECT * FROM dc_capacity WHERE creation_date = '{current_time}' ")
        
        for ednDcCapacityObj in ednDcCapacityObjs:
            ednDcCapacityDataDict= {}
            ednDcCapacityDataDict['dc_capacity_id']= ednDcCapacityObj[0]
            ednDcCapacityDataDict['device_ip'] = ednDcCapacityObj[1]
            ednDcCapacityDataDict['site_name'] = ednDcCapacityObj[2]
            ednDcCapacityDataDict['device_name'] = ednDcCapacityObj[3]
            ednDcCapacityDataDict['os_version'] = ednDcCapacityObj[4]
            ednDcCapacityDataDict['total_1g_ports'] = ednDcCapacityObj[5]
            ednDcCapacityDataDict['total_10g_ports'] = ednDcCapacityObj[6]
            ednDcCapacityDataDict['total_25g_ports'] = ednDcCapacityObj[7]
            ednDcCapacityDataDict['total_40g_ports'] = ednDcCapacityObj[8]
            ednDcCapacityDataDict['total_100g_ports'] = ednDcCapacityObj[9]
            ednDcCapacityDataDict['total_fast_ethernet_ports'] = ednDcCapacityObj[10]
            ednDcCapacityDataDict['connected_1g'] = ednDcCapacityObj[11]
            ednDcCapacityDataDict['connected_10g'] = ednDcCapacityObj[12]
            ednDcCapacityDataDict['connected_25g'] = ednDcCapacityObj[13]
            ednDcCapacityDataDict['connected_40g'] = ednDcCapacityObj[14]
            ednDcCapacityDataDict['connected_100g'] = ednDcCapacityObj[15]
            ednDcCapacityDataDict['connected_fast_ethernet'] = ednDcCapacityObj[16]
            ednDcCapacityDataDict['not_connected_1g'] = ednDcCapacityObj[17]
            ednDcCapacityDataDict['not_connected_10g'] = ednDcCapacityObj[18]
            ednDcCapacityDataDict['not_connected_25g'] = ednDcCapacityObj[19]
            ednDcCapacityDataDict['not_connected_40g'] = ednDcCapacityObj[20]
            ednDcCapacityDataDict['not_connected_100g'] = ednDcCapacityObj[21]
            ednDcCapacityDataDict['not_connected_fast_ethernet'] = ednDcCapacityObj[22]
            ednDcCapacityDataDict['unused_sfps_1g'] = ednDcCapacityObj[23]
            ednDcCapacityDataDict['unused_sfps_10g'] = ednDcCapacityObj[24]
            ednDcCapacityDataDict['unused_sfps_25g'] = ednDcCapacityObj[25]
            ednDcCapacityDataDict['unused_sfps_40g'] = ednDcCapacityObj[26]
            ednDcCapacityDataDict['unused_sfps_100g'] = ednDcCapacityObj[27]
            
            ednDcCapacityDataDict['creation_date'] = str(ednDcCapacityObj[28])
            ednDcCapacityDataDict['modification_date'] = str(ednDcCapacityObj[29]) 
            # ednDcCapacityDataDict['created_by'] = str(ednDcCapacityObj[30]) 
            # ednDcCapacityDataDict['modified_by'] = str(ednDcCapacityObj[31]) 
            ednDcCapacityObjList.append(ednDcCapacityDataDict)

        content = gzip.compress(json.dumps(ednDcCapacityObjList).encode('utf8'), 5)
        response = make_response(content)
        response.headers['Content-length'] = len(content)
        response.headers['Content-Encoding'] = 'gzip'
        return response
    else: 
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route('/getAllDcCapacityDevices', methods=['GET'])
@token_required
def GetAllDcCapacityDevices(user_data):
    if True:
        try:
            objList = []
            queryString = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,SOURCE,DEVICE_NAME,DCCM_ID from dc_capacity_devices_table;"
            result = db.session.execute(queryString)
            for row in result:
                ip_address = row[0]
                device_type = row[1]
                password_group = row[2]
                source = row[3]
                device_name = row[4]
                dccm_id = row[5]
                objDict = {}
                objDict['dccm_id'] = dccm_id
                objDict['ip_address'] = ip_address
                objDict['device_type'] = device_type
                objDict['password_group'] = password_group
                objDict['source'] = source
                objDict['device_name'] = device_name
                objList.append(objDict)
            # print(objList, file=sys.stderr)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/getDeviceinDccm', methods=['GET'])
@token_required
def GetDeviceInDccm(user_data):
    if True:
        try:

            objList = []
            queryString = f"SELECT IP_ADDRESS,DEVICE_TYPE,DOMAIN,`FUNCTION`,STATUS,DEVICE_NAME from device_table;"
            result = db.session.execute(queryString)
            for row in result:
                ip_address = row[0]
                device_type = row[1]
                # domain = row[2]
                function = row[3]
                status = row[4]
                device_name = row[5]
                objDict = {}
                objDict['ip_address'] = ip_address
                objDict['device_type'] = device_type
                # objDict['domain'] = domain
                objDict['function'] = function
                objDict['status'] = status
                objDict['device_name'] = device_name
                objList.append(objDict)
            print(objList, file=sys.stderr)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/getAtomInDccm', methods=['GET'])
@token_required
def GetAtomInDccm(user_data):
    if True:
        try:

            objList = []
            query = f"select IP_ADDRESS from dc_capacity_devices_table;"
            res = db.session.execute(query)
            ipList = []
            for r in res:

                ipList.append(r[0])
            
            queryString = f"SELECT IP_ADDRESS,DEVICE_TYPE,DOMAIN,`FUNCTION`,ONBOARD_STATUS,DEVICE_NAME from atom_table;"
            result = db.session.execute(queryString)
            for row in result:
                if row[0] in ipList:
                    pass
                else:

                    ip_address = row[0]
                    device_type = row[1]
                    function = row[3]
                    onboard_status = row[4]
                    device_name = row[5]
                    objDict = {}
                    objDict['ip_address'] = ip_address
                    objDict['device_type'] = device_type
                    objDict['function'] = function
                    if onboard_status==None:
                        onboard_status='False'
                    elif onboard_status=='false':
                        onboard_status='False'
                    elif onboard_status=='true':
                        onboard_status='True'
                    
                    objDict['onboard_status'] = onboard_status
                    objDict['device_name'] = device_name
                    objList.append(objDict)
            print(objList, file=sys.stderr)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/addDccmStatically', methods=['POST'])
@token_required
def AddDccmStatically(user_data):
    if True:
        try:
            dcmObj = request.get_json()
            if DC_CAPACITY_DEVICES_TABLE.query.with_entities(DC_CAPACITY_DEVICES_TABLE.ip_address).filter_by(ip_address=dcmObj['ip_address']).first() is None:
                dccm = DC_CAPACITY_DEVICES_TABLE()

                if 'ip_address' in dcmObj:
                    match = re.match(r"[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}", dcmObj['ip_address'])
                    value = (bool(match))
                    if value:
                        dccm.ip_address = dcmObj['ip_address']
                    else:
                        return "Invalid IP Address",500
                else:
                    pass
                if 'device_type' in dcmObj:
                    dccm.device_type = dcmObj['device_type']
                else:
                    pass
                if 'password_group' in dcmObj:
                    dccm.password_group = dcmObj['password_group']
                else:
                    dccm.password_group = 'N/A'
                dccm.source = 'Static'
                dccm.device_name = dcmObj['device_name']
                InsertData(dccm)

                print(dcmObj['ip_address'],
                      "Added Successfully in DCCM", file=sys.stderr)
            else:
                print("IP ADDRESS/DEVICE NAME IS DUPLICATE", file=sys.stderr)
                return jsonify({"Response": "IP ADDRESS IS DUPLICATE"}), 500
            return jsonify({"Response": "Device Added/Updated Successfully"}), 200

        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/addDccmByAtom', methods=['POST'])
@token_required
def AddDccmByAtom(user_data):
    if True:
        response = False
        response1 = False
        
        try:
            responses = []
            ips = request.get_json()
            for ip in ips:
                # if IPAM_DEVICES_TABLE.query.with_entities(IPAM_DEVICES_TABLE.ip_address).filter_by(ip_address=ip).first() is None:
                queryString = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,DEVICE_NAME from atom_table where IP_ADDRESS='{ip}';"
                result = db.session.execute(queryString)
                for row in result:
                    dccm = DC_CAPACITY_DEVICES_TABLE()
                    dccm.ip_address = row[0]
                    dccm.device_type = row[1]
                    dccm.password_group = row[2]
                    dccm.device_name = row[3]
                    dccm.source = 'Atom'
                    if DC_CAPACITY_DEVICES_TABLE.query.with_entities(DC_CAPACITY_DEVICES_TABLE.dccm_id).filter_by(ip_address=ip).first() is not None:
                        dccm.dccm_id = DC_CAPACITY_DEVICES_TABLE.query.with_entities(DC_CAPACITY_DEVICES_TABLE.dccm_id).filter_by(ip_address=ip).first()[0]
                        UpdateData(dccm)
                        print("IP ADDRESS/DEVICE NAME IS DUPLICATE", file=sys.stderr)
                        response1 = 'response1'
                        responses.append(response1)
                    else:
                        InsertData(dccm)
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

@app.route('/deleteDccmDevice',methods = ['POST'])
@token_required
def DeleteDccmDevice(user_data):
    if True:
        try:
            ipObjs = request.get_json()
            for ip in ipObjs:
                queryString = f"delete from dc_capacity_devices_table where IP_ADDRESS='{ip}';"
                db.session.execute(queryString)
                db.session.commit()
                print("DEVICE '{ip}' DELETED SUCCESSFULLY",file=sys.stderr)
            return "DELETION SUCCESSFUL",200
        except Exception as e:
            print(str(e),file=sys.sytderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route('/editDccmDevice',methods = ['POST'])
@token_required
def EditDccmDevice(user_data):
    if True:
        try:
            deviceObj = request.get_json()
            # for deviceObj in deviceObjs:
            queryString = f"update dc_capacity_devices_table set IP_ADDRESS='{deviceObj['ip_address']}' where DCCM_ID='{deviceObj['dccm_id']}';"
            db.session.execute(queryString)
            queryString1 = f"update dc_capacity_devices_table set DEVICE_TYPE='{deviceObj['device_type']}' where DCCM_ID='{deviceObj['dccm_id']}';"
            db.session.execute(queryString1)
            queryString2 = f"update dc_capacity_devices_table set DEVICE_NAME='{deviceObj['device_name']}' where DCCM_ID='{deviceObj['dccm_id']}';"
            db.session.execute(queryString2)
            queryString3 = f"update dc_capacity_devices_table set PASSWORD_GROUP='{deviceObj['password_group']}' where DCCM_ID='{deviceObj['dccm_id']}';"
            db.session.execute(queryString3)
            db.session.commit()
            print(f"DEVICE {deviceObj['ip_address']} UPDATED SUCCESSFULLY ",file=sys.stderr)
            return "UPDATED SUCCESSFULLY",200
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

