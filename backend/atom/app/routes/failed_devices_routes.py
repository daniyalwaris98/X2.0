import traceback
from flask_jsonpify import jsonify
from flask import request, make_response
from app.middleware import token_required
from app import app, db
import sys
from datetime import datetime

def FormatDate(date):
    #print(date, file=sys.stderr)
    if date is not None:
        result = date.strftime('%d-%m-%Y')
    else:
        #result = datetime(2000, 1, 1)
        result = datetime(1, 1, 2000)

    return result


@app.route('/uamFailedDevicesCount', methods=['GET'])
@token_required
def UamFailedDevicesCount(user_data):
    if True:
        try:
            queryString = f"select count(*) from failed_devices_table where MODULE='UAM';"
            result = db.session.execute(queryString).scalar()
            objDict = {'name': 'UAM', 'value': result}
            print(objDict, file=sys.stderr)
            return (objDict), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/networkMappingFailedDevicesCount', methods=['GET'])
@token_required
def NetworkMappingFailedDevicesCount(user_data):
    if True:
        try:
            queryString = f"select count(*) from failed_devices_table where MODULE='MONITORING';"
            result = db.session.execute(queryString).scalar()
            objDict = {'name': 'MONITORING', 'value': result}
            print(objDict, file=sys.stderr)
            return (objDict), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/getFailedDevices', methods=['GET'])
@token_required
def FailedDevicesCount(user_data):
    atom_count = 0
    atom_fail = []
    ipam_count = 0
    ipam_fail = []
    monitoring_count = 0
    monitoring_fail = []
    uam_count =0
    uam_fail = []
    ncm_count = 0
    ncm_fail =[]

    try:
        queryString = f"select count(*) from failed_devices_table where MODULE='ATOM';"
        atom_count = db.session.execute(queryString).scalar()
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)

    try:
        queryString = f"select count(*) from failed_devices_table where MODULE='IPAM';"
        ipam_count = db.session.execute(queryString).scalar()
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)

    try:
        queryString = f"select count(*) from failed_devices_table where MODULE='UAM';"
        uam_count = db.session.execute(queryString).scalar()
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)

    try:
        queryString = f"select count(*) from failed_devices_table where MODULE='NCM';"
        ncm_count = db.session.execute(queryString).scalar()
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)

    try:
        queryString = f"select count(*) from failed_devices_table where MODULE='MONITORING';"
        monitoring_count = db.session.execute(queryString).scalar()
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)

    

    try:
        queryString = f"select IP_ADDRESS,DEVICE_TYPE,`DATE`,FAILURE_REASON from failed_devices_table where MODULE='ATOM' order by `DATE` DESC;"
        result = db.session.execute(queryString)
        for row in result:
            ip_address = row[0]
            device_type = row[1]
            date = row[2]
            failure_reason = row[3]
            objDict = {}
            objDict['ip_address'] = ip_address
            objDict['device_type'] = device_type
            objDict['date'] = FormatDate(date)
            objDict['failure_reason'] = failure_reason
            atom_fail.append(objDict)
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)

    
    try:
        queryString = f"select IP_ADDRESS,DEVICE_TYPE,`DATE`,FAILURE_REASON from failed_devices_table where MODULE='IPAM' order by `DATE` DESC;"
        result = db.session.execute(queryString)
        for row in result:
            ip_address = row[0]
            device_type = row[1]
            date = row[2]
            failure_reason = row[3]
            objDict = {}
            objDict['ip_address'] = ip_address
            objDict['device_type'] = device_type
            objDict['date'] = FormatDate(date)
            objDict['failure_reason'] = failure_reason
            ipam_fail.append(objDict)
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)

    
    try:
        queryString = f"select IP_ADDRESS,DEVICE_TYPE,`DATE`,FAILURE_REASON from failed_devices_table where MODULE='UAM' order by `DATE` DESC;"
        result = db.session.execute(queryString)
        for row in result:
            ip_address = row[0]
            device_type = row[1]
            date = row[2]
            failure_reason = row[3]
            objDict = {}
            objDict['ip_address'] = ip_address
            objDict['device_type'] = device_type
            objDict['date'] = FormatDate(date)
            objDict['failure_reason'] = failure_reason
            uam_fail.append(objDict)
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)

    
    try:
        queryString = f"select IP_ADDRESS,DEVICE_TYPE,`DATE`,FAILURE_REASON from failed_devices_table where MODULE='NCM' order by `DATE` DESC;"
        result = db.session.execute(queryString)
        for row in result:
            ip_address = row[0]
            device_type = row[1]
            date = row[2]
            failure_reason = row[3]
            objDict = {}
            objDict['ip_address'] = ip_address
            objDict['device_type'] = device_type
            objDict['date'] = FormatDate(date)
            objDict['failure_reason'] = failure_reason
            ncm_fail.append(objDict)
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
    
    
    try:
        queryString = f"select IP_ADDRESS,DEVICE_TYPE,`DATE`,FAILURE_REASON from failed_devices_table where MODULE='MONITORING' order by `DATE` DESC;"
        result = db.session.execute(queryString)
        for row in result:
            ip_address = row[0]
            device_type = row[1]
            date = row[2]
            failure_reason = row[3]
            objDict = {}
            objDict['ip_address'] = ip_address
            objDict['device_type'] = device_type
            objDict['date'] = FormatDate(date)
            objDict['failure_reason'] = failure_reason
            monitoring_fail.append(objDict)
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)

    try:
        result = {
            'atom_count':atom_count,
            'atom_fail':atom_fail,
            'ipam_count' :ipam_count,
            'ipam_fail':ipam_fail,
            'monitoring_count' :monitoring_count,
            'monitoring_fail':monitoring_fail,
            'uam_count' :uam_count,
            'uam_fail':uam_fail,
            'ncm_count':ncm_count,
            'ncm_fail':ncm_fail
            }
        return jsonify(result),200
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return "Error While Loading Data",500
    




@app.route('/ipamFailedDevicesCount', methods=['GET'])
@token_required
def IpamFailedDevicesCount(user_data):
    if True:
        try:
            queryString = f"select count(*) from failed_devices_table where MODULE='IPAM';"
            result = db.session.execute(queryString).scalar()
            objDict = {'name': 'IPAM', 'value': result}
            print(objDict, file=sys.stderr)
            return (objDict), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/dcmFailedDevicesCount', methods=['GET'])
@token_required
def DcmFailedDevicesCount(user_data):
    if True:
        try:
            queryString = f"select count(*) from failed_devices_table where MODULE='DCM';"
            result = db.session.execute(queryString).scalar()
            objDict = {'name': 'DCCM', 'value': result}
            print(objDict, file=sys.stderr)
            return (objDict), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/ncmFailedDevicesCount', methods=['GET'])
@token_required
def NcmFailedDevicesCount(user_data):
    if True:
        try:
            queryString = f"select count(*) from failed_devices_table where MODULE='NCM';"
            result = db.session.execute(queryString).scalar()
            objDict = {'name': 'NCM', 'value': result}
            print(objDict, file=sys.stderr)
            return (objDict), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503




@app.route('/uamFailedDevices', methods=['GET'])
@token_required
def UamFailedDevices(user_data):
    if True:
        try:
            queryString = f"select IP_ADDRESS,DEVICE_TYPE,`DATE`,FAILURE_REASON from failed_devices_table where MODULE='UAM' order by `DATE` DESC;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                ip_address = row[0]
                device_type = row[1]
                date = row[2]
                failure_reason = row[3]
                objDict = {}
                objDict['ip_address'] = ip_address
                objDict['device_type'] = device_type
                objDict['date'] = FormatDate(date)
                objDict['failure_reason'] = failure_reason
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


@app.route('/networkMappingFailedDevices', methods=['GET'])
# @token_required
def NetworkMappingFailedDevices():
    if True:
        try:
            queryString = f"select IP_ADDRESS,DEVICE_TYPE,`DATE`,FAILURE_REASON from failed_devices_table where MODULE='MONITORING' order by `DATE` DESC;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                ip_address = row[0]
                device_type = row[1]
                date = row[2]
                failure_reason = row[3]
                objDict = {}
                objDict['ip_address'] = ip_address
                objDict['device_type'] = device_type
                objDict['date'] = FormatDate(date)
                objDict['failure_reason'] = failure_reason
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


@app.route('/ipamFailedDevices', methods=['GET'])
@token_required
def IpamFailedDevices(user_data):
    if True:
        try:
            queryString = f"select IP_ADDRESS,DEVICE_TYPE,`DATE`,FAILURE_REASON from failed_devices_table where MODULE='IPAM' order by `DATE` DESC;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                ip_address = row[0]
                device_type = row[1]
                date = row[2]
                failure_reason = row[3]
                objDict = {}
                objDict['ip_address'] = ip_address
                objDict['device_type'] = device_type
                objDict['date'] = FormatDate(date)
                objDict['failure_reason'] = failure_reason
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


@app.route('/dcmFailedDevices', methods=['GET'])
@token_required
def DcmFailedDevices(user_data):
    if True:
        try:
            queryString = f"select IP_ADDRESS,DEVICE_TYPE,`DATE`,FAILURE_REASON from failed_devices_table where MODULE='DCM' order by `DATE` DESC;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                ip_address = row[0]
                device_type = row[1]
                date = row[2]
                failure_reason = row[3]
                objDict = {}
                objDict['ip_address'] = ip_address
                objDict['device_type'] = device_type
                objDict['date'] = FormatDate(date)
                objDict['failure_reason'] = failure_reason
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

@app.route('/ncmFailedDevices', methods=['GET'])
@token_required
def NcmFailedDevices(user_data):
    if True:
        try:
            queryString = f"select IP_ADDRESS,DEVICE_TYPE,`DATE`,FAILURE_REASON from failed_devices_table where MODULE='NCM' order by `DATE` DESC;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                ip_address = row[0]
                device_type = row[1]
                date = row[2]
                failure_reason = row[3]
                objDict = {}
                objDict['ip_address'] = ip_address
                objDict['device_type'] = device_type
                objDict['date'] = FormatDate(date)
                objDict['failure_reason'] = failure_reason
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
    


@app.route('/monitoringFailedDevicesCount', methods=['GET'])
@token_required
def MonitoringFailedDevicesCount(user_data):
    if True:
        try:
            queryString = f"select count(*) from failed_devices_table where MODULE='MONITORING';"
            result = db.session.execute(queryString).scalar()
            objDict = {'name': 'NCM', 'value': result}
            print(objDict, file=sys.stderr)
            return (objDict), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503



@app.route('/monitoringFailedDevices', methods=['GET'])
@token_required
def MonitoringFailedDevices(user_data):
    if True:
        try:
            queryString = f"select IP_ADDRESS,DEVICE_TYPE,`DATE`,FAILURE_REASON from failed_devices_table where MODULE='MONITORING' order by `DATE` DESC;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                ip_address = row[0]
                device_type = row[1]
                date = row[2]
                failure_reason = row[3]
                objDict = {}
                objDict['ip_address'] = ip_address
                objDict['device_type'] = device_type
                objDict['date'] = FormatDate(date)
                objDict['failure_reason'] = failure_reason
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


