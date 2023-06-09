import gzip
import sys
import json
import traceback
from flask_jsonpify import jsonify
from flask import request, make_response
from app.middleware import token_required
from .inventory_routes import InsertData
from app import app, db
import string
import secrets
from cryptography.fernet import Fernet
from datetime import datetime
from app.models.inventory_models import *
from app.mail import *
import hashlib
hashDict = {}
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
                result = datetime.strptime(date, '%d-%m-%Y')
            elif '/' in date:
                result = datetime.strptime(date, '%d/%m/%Y')
            else:
                print("incorrect date format", file=sys.stderr)
                result = datetime(2000, 1, 1)
        else:
            #result = datetime(2000, 1, 1)
            result = datetime(2000, 1, 1)
    except:
        result = datetime(2000, 1, 1)
        print("date format exception", file=sys.stderr)

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
        db.session.flush()

        db.session.merge(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(
            f"Something else went wrong during Database Update {e}", file=sys.stderr)

    return True


# @app.route('/addAdmin', methods=['POST'])
# @token_required
# def AddAdmin(user_data):
#     if True:
#         try:
#             adminObj = request.get_json()
#             admin = USER_TABLE()
#             if 'name' in adminObj:
#                 admin.name = adminObj['name']
#             else:
#                 admin.name = 'N/A'
#             if 'email' in adminObj:
#                 admin.email = adminObj['email']
#             else:
#                 admin.email = 'N/A'
#             # if 'user_id' in adminObj:
#             admin.user_id = adminObj['user_id']
#             admin.password = adminObj['password']
#             admin.role = adminObj['role']
#             if 'status' in adminObj:

#                 admin.status = adminObj['status']
#             else:
#                 admin.status = 'N/A'
#             if 'account_type' in adminObj:
#                 admin.account_type = adminObj['account_type']
#             else:
#                 admin.account_type = 'N/A'

#             if 'team' in adminObj:
#                 admin.team = adminObj['team']
#             else:
#                 admin.team = 'N/A'

#             if 'vendor' in adminObj:
#                 admin.vendor = adminObj['vendor']
#             else:
#                 admin.vendor = 'N/A'

#             if USER_TABLE.query.with_entities(USER_TABLE.user_id).filter_by(user_id=adminObj['user_id']).first() is not None:
#                         admin.user_id = USER_TABLE.query.with_entities(USER_TABLE.user_id).filter_by(user_id=adminObj['user_id']).first()[0]
#                         admin.modification_date = datetime.now()
#                         UpdateData(admin)
#                         print(f"Updated {adminObj['user_id']} SUCCESSFULLY",file = sys.stderr)
#             else:

#                 print(f"Inserted {adminObj['user_id']} SUCCESSFULLY", file=sys.stderr)
#                 admin.creation_date = datetime.now()
#                 admin.modification_date = datetime.now()
#                 InsertData(admin)
#             return jsonify({'response': "success", "code": "200"})
#         except Exception as e:
#             traceback.print_exc()
#             return str(e), 500
#     else:
#         print("Service not Available", file=sys.stderr)
#         return jsonify({"Response": "Service not Available"}), 503


@app.route("/addAdmin", methods=['POST'])
@token_required
def AddAdmin(user_data):

    # request.headers.get('X-Auth-Key') == session.get('token', None):
    if True:
        userObj = request.get_json()
        # print(userObj,file=sys.stderr)

        alphabet = string.ascii_letters + string.digits
        token = ''.join(secrets.choice(alphabet) for i in range(16))

        user = USER_TABLE()
        user.user_id = userObj['user_id']
        user.email = userObj['email']
        user.name = userObj['name']
        user.role = userObj['role']
        user.status = userObj['status']
        user.account_type = userObj['account_type']
        user.team = userObj['team']
        # user.vendor = userObj['vendor']
        #user.token = userObj['name']+token

        # if userObj['account_type'] == "Local":
        # pas = hashlib.sha512()
        # pas.update(userObj['password'].encode("utf8"))
        # user.password = str(pas.digest())
        user.password = userObj['password']
        user.company_name = userObj['company_name']
        # else:
        #     # pass
        #     print("Can not Create User Without Password ",file=sys.stderr)
        #     return ("Can not Create User Without Password"),500

        if USER_TABLE.query.with_entities(USER_TABLE.user_id).filter_by(user_id=userObj['user_id']).first() is not None:
            print("User Name Already Exists ", file=sys.stderr)
            return "User Name Already Exists", 500
        else:
            InsertData(user)
            print("Inserted " + userObj['user_id'], file=sys.stderr)
            return "SUCESSFULLY INSERTED", 200

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route("/editAdmin", methods=['POST'])
@token_required
def EditAdmin(user_data):
    # request.headers.get('X-Auth-Key') == session.get('token', None):
    if True:
        userObj = request.get_json()
        print(userObj, file=sys.stderr)
        user = USER_TABLE()
        user.user_id = userObj['user_id']
        user.email = userObj['email']
        user.name = userObj['name']
        user.role = userObj['role']
        user.status = userObj['status']
        user.account_type = userObj['account_type']
        user.team = userObj['team']
        # user.vendor = userObj['vendor']
        user.company_name = userObj['company_name']
        # edit Password
        if userObj['password']:
            # pas = hashlib.sha512()
            # pas.update(userObj['password'].encode("utf8"))
            # user.password = str(pas.digest())
            user.password=userObj['password']
            if USER_TABLE.query.with_entities(USER_TABLE.id).filter_by(id=userObj['id']).first() is not None:
                user.id = USER_TABLE.query.with_entities(
                    USER_TABLE.id).filter_by(id=userObj['id']).first()[0]
                user.modification_date = datetime.now()
                UpdateData(user)

                print("Updated " + userObj['user_id'], file=sys.stderr)
                return jsonify({'response': "success", "code": "200"})

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route("/getAllAdmin", methods=['GET'])
@token_required
def GetAllAdmin(user_data):
    if True:
        try:
            adminObjList = []
            adminObjs = USER_TABLE.query.all()

            for adminObj in adminObjs:
                adminDataDict = {}
                adminDataDict['id'] = adminObj.id
                adminDataDict['user_id'] = adminObj.user_id
                adminDataDict['name'] = adminObj.name
                adminDataDict['email'] = adminObj.email
                adminDataDict['password'] = adminObj.password
                adminDataDict['role'] = adminObj.role
                adminDataDict['status'] = adminObj.status
                adminDataDict['account_type'] = adminObj.account_type
                adminDataDict['company_name'] = adminObj.company_name
                if adminObj.creation_date:
                    adminDataDict['creation_date'] = str(
                        adminObj.creation_date)
                else:
                    adminDataDict['creation_date'] = "N/A"
                if adminObj.modification_date:
                    adminDataDict['modification_date'] = str(
                        adminObj.modification_date)
                else:
                    adminDataDict['creation_date'] = "N/A"
                adminDataDict['team'] = adminObj.team
                adminDataDict['vendor'] = adminObj.vendor
                if adminObj.last_login:
                    adminDataDict['last_login'] = str(adminObj.last_login)
                else:
                    adminDataDict['last_login'] = "N/A"
                adminObjList.append(adminDataDict)
            content = gzip.compress(json.dumps(adminObjList).encode('utf8'), 5)
            response = make_response(content)
            response.headers['Content-length'] = len(content)
            response.headers['Content-Encoding'] = 'gzip'
            return response
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/deleteUser', methods=['POST'])
@token_required
def DeleteUser(user_data):
    if True:
        try:
            id = request.get_json()
            user_id = id.get('user_id')
            print(user_id, file=sys.stderr)
            if user_id:
                queryString = f"delete from user_table where user_id='{user_id}';"
                db.session.execute(queryString)
                db.session.commit()
                print(f"{user_id} DELETED SUCCESSFULLY", file=sys.stderr)
                return "DELETED SUCCESSFULLY", 200
            else:
                print(f"{user_id} DELETION WAS NOT SUCCESSFUL", file=sys.stderr)
                return "DELETION UNSUCCESSFUL", 500
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


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





@app.route('/addAdminRole', methods=['POST'])
@token_required
def AddAdminRole(user_data):
    if True:
        try:
            true = 1
            false = 0
            roleObj = request.get_json()
            print(roleObj, file=sys.stderr)
            adminRole = ADMIN_ROLES()
            if 'role' in roleObj:
                adminRole.role = roleObj['role']
            if 'configuration' in roleObj:
                adminRole.configuration = json.dumps(roleObj['configuration'])

            print("Inserted "+roleObj['role'], file=sys.stderr)
            adminRole.creation_date = datetime.now()
            adminRole.modification_date = datetime.now()
            InsertData(adminRole)

            return jsonify({'response': "success", "code": "200"})
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/getAllRoles', methods=['GET'])
@token_required
def GetAllRoles(user_data):
    if True:
        try:
            objList = []
            queryString = f"select ROLE from admin_roles;"
            result = db.session.execute(queryString)
            for row in result:
                objList.append(row[0])
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/editAdminRole', methods=['POST'])
@token_required
def EditAdminRole(user_data):
    if True:
        try:
            true = True
            false = False
            roleObj = request.get_json()
            # for conf in roleObj['configuration']:
            #     print(type(conf), file=sys.stderr)
            # print(type(roleObj['configuration']), file=sys.stderr)
            adminRole = ADMIN_ROLES.query.with_entities(
                ADMIN_ROLES).filter_by(role_id=roleObj['role_id']).first()
            if ADMIN_ROLES.query.with_entities(ADMIN_ROLES.role_id).filter_by(role_id=roleObj['role_id']).first() != None:

                adminRole.role = roleObj['role']
                adminRole.configuration = json.dumps(roleObj['configuration'])
                adminRole.modification_date = datetime.now()
                print(adminRole.role, file=sys.stderr)
                print(adminRole.configuration, file=sys.stderr)
                UpdateData(adminRole)
                print("Updated Role", roleObj['role'], file=sys.stderr)
                return jsonify({"Response": "Success"}), 200
            else:
                print("Role does not exist", file=sys.stderr)
                return jsonify({'response': "Role does not Exist"}), 500
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/getAllAdminRole', methods=['GET'])
@token_required
def GetAllAdminRole(user_data):
    if True:
        try:
            true = 1
            false = 0
            adminObjsList = []
            adminObjs = ADMIN_ROLES.query.all()
            for adminObj in adminObjs:
                objDict = {}
                objDict['role_id'] = adminObj.role_id
                objDict['role'] = adminObj.role
                objDict['configuration'] = json.loads(adminObj.configuration)
                print(type(objDict['configuration']), file=sys.stderr)
                # objDict['configuration'] = json.dumps(objDict['configuration'])
                adminObjsList.append(objDict)

            return jsonify(adminObjsList), 200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/deleteAdmin', methods=['POST'])
@token_required
def DeleteAdmin(user_data):
    if True:
        try:
            roleObj = request.get_json()
            id = roleObj['role_id']
            queryString = f"delete from admin_roles where ROLE_ID={id};"
            db.session.execute(queryString)
            db.session.commit()
            print(
                f"ROLE {roleObj['role_id']} DELETED SUCESSFULLY", file=sys.stderr)
            return "ROLE DELETED SUCCESSFULLY", 200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500

@app.route('/addEndUser',methods = ['POST'])
@token_required
def AddEndUser(user_data):
    if True:
        try:
            endUserObj = request.get_json()
            if END_USER_TABLE.query.with_entities(END_USER_TABLE.company_name).filter_by(company_name=endUserObj['company_name']).first() is None:
                user = END_USER_TABLE()
                user.company_name = endUserObj['company_name']
                user.po_box = endUserObj['po_box']
                user.address = endUserObj['address']
                user.street_name = endUserObj['street_name']
                user.city = endUserObj['city']
                user.country = endUserObj['country']
                user.contact_person = endUserObj['contact_person']
                user.contact_number = endUserObj['contact_number']
                user.email = endUserObj['email']
                user.domain_name = endUserObj['domain_name']
                user.industry_type = endUserObj['industry_type']
                user.license_status = False
                if END_USER_TABLE.query.with_entities(END_USER_TABLE.company_name).filter_by(company_name=endUserObj['company_name']).first() is not None:
                    user.end_user_id = END_USER_TABLE.query.with_entities(END_USER_TABLE.end_user_id).filter_by(company_name=endUserObj['company_name']).first()[0]
                    user.modification_date = datetime.now()
                    UpdateData(user)
                    print(f"Updated {endUserObj['company_name']} in End User Table", file=sys.stderr)
                    return "Updated Successfully",200
                else:
                    user.creation_date = datetime.now()
                    user.modification_date = datetime.now()
                    InsertData(user)
                    print(f"Inserted {endUserObj['company_name']} in End User Table", file=sys.stderr)
                    return "Inserted Successfully",200
            else:
                print(f"User Already Exists in End User Table",file=sys.stderr)
                return "User Already Exists in End User Table",500
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/addEndUsers',methods = ['POST'])
@token_required
def AddEndUsers(user_data):
    if True:
        try:
            endUserObjs = request.get_json()
            responses = []
            response = False
            response1 = False
            for endUserObj in endUserObjs:

                if END_USER_TABLE.query.with_entities(END_USER_TABLE.company_name).filter_by(company_name=endUserObj['company_name']).first() is None:
                    user = END_USER_TABLE()
                    user.company_name = endUserObj['company_name']
                    user.po_box = endUserObj['po_box']
                    user.address = endUserObj['address']
                    user.street_name = endUserObj['street_name']
                    user.city = endUserObj['city']
                    user.country = endUserObj['country']
                    user.contact_person = endUserObj['contact_person']
                    user.contact_number = endUserObj['contact_number']
                    user.email = endUserObj['email']
                    user.domain_name = endUserObj['domain_name']
                    user.industry_type = endUserObj['industry_type']
                    user.license_status = False
                    if END_USER_TABLE.query.with_entities(END_USER_TABLE.company_name).filter_by(company_name=endUserObj['company_name']).first() is not None:
                        user.end_user_id = END_USER_TABLE.query.with_entities(END_USER_TABLE.end_user_id).filter_by(company_name=endUserObj['company_name']).first()[0]
                        user.modification_date = datetime.now()
                        UpdateData(user)
                        print(f"Updated {endUserObj['company_name']} in End User Table", file=sys.stderr)
                        response = 'response'
                        responses.append(response)
                        # return "Updated Successfully",200
                    else:
                        user.creation_date = datetime.now()
                        user.modification_date = datetime.now()
                        InsertData(user)
                        print(f"Inserted {endUserObj['company_name']} in End User Table", file=sys.stderr)
                        response1 = 'response1'
                        responses.append(response1)
                        # return "Inserted Successfully",200
                else:
                    print(f"User Already Exists in End User Table",file=sys.stderr)
                    return "User Already Exists in End User Table",500

            responses = set(responses)
            responses = list(responses)
            if len(response)==1:
            
                if response=='response':
                    return "Updated Successfully",200
                elif response1=='response1':
                    return "Inserted Successfully",200
            else:
                return "Updated/Inserted Successfully",200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503
@app.route('/getAllEndUserDetails',methods = ['GET'])
@token_required
def GetAllEndUserDetails(user_data):
    if True:
        try:
            endUserObjs = END_USER_TABLE.query.all()
            objList = []
            for endUserObj in endUserObjs:
                objDict = {}
                objDict['end_user_id'] = endUserObj.end_user_id
                objDict['company_name'] = endUserObj.company_name
                objDict['po_box'] = endUserObj.po_box
                objDict['address'] = endUserObj.address
                objDict['street_name'] = endUserObj.street_name
                objDict['city'] = endUserObj.city
                objDict['country'] = endUserObj.country
                objDict['contact_person'] = endUserObj.contact_person
                objDict['contact_number'] = endUserObj.contact_number
                objDict['email'] = endUserObj.email
                objDict['domain_name'] = endUserObj.domain_name
                objDict['industry_type'] = endUserObj.industry_type
                objDict['creation_date'] = endUserObj.creation_date
                objDict['modification_date'] = endUserObj.modification_date
                objDict['license_status'] = endUserObj.license_status
                objList.append(objDict)
            return jsonify(objList),200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


import base64
@app.route('/encryptCredentialsLicenseKey',methods = ['POST'])
def EncryptCredentialsLicenseKey():
    if True:
        try:
            userObj = request.get_json()
            queryString = f"select COMPANY_NAME from end_user_table where COMPANY_NAME='{userObj['company_name']}';"
            company_name = ''
            middleware = 'MonetX'
            result = db.session.execute(queryString)
            for row in result:
                company_name=row[0]
                
            if company_name=='':
                return "Company Name Not Found",500
            else:

                date = userObj['date']
                date = int(date)
                
                
                objDict = {
                    "company_name":company_name,
                    "middleware":middleware,
                    "date":date,
                }
                objDict = str(objDict)
                res = bytes(objDict,'utf-8')
                final = base64.b64encode(res)
                encoded_data = final.decode("utf-8")
                print(f"License Key Generated Successfully for {company_name}",file=sys.stderr)
                hashedString = Hashing(encoded_data)
                hashDict["hashed_string"]=hashedString
                hashDict["encoded_data"]=encoded_data
                with open("/app/hashFile", "w") as outfile:
                    json.dump(hashDict, outfile)
           
                send_mail(send_from="hamza.zahid@nets-international.com", send_to=["amna.ateq@nets-international.com"],subject= "License Key",message= f"Dear Valuable Customer,\nHopefully this mail finds you well.\nPlease find the below the attached License Key valid for {date} months.\n\n\n{hashedString}\n\n\t***\tThis is an Automated Email\t***",username='hamza.zahid@nets-international.com', password='Cyprus@123')
                import time
                time.sleep(5)
                return (hashedString),200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

def LicenseTenure(end_date):
    from dateutil.relativedelta import relativedelta
    months = int(end_date)
    today = datetime.now()
    date_after_months = today + relativedelta(months=months)
    print(f"Subsription starts at {today}",file=sys.stderr)
    print(f"Subsription ends at {date_after_months}",file=sys.stderr)
    return date_after_months

def Hashing(string):
    length = 20
    # Convert the string to bytes
    string_bytes = string.encode()

    # Use sha256 hash algorithm to create a hash object
    sha256 = hashlib.sha256()
    sha256.update(string_bytes)

    # Get the hexadecimal representation of the hash
    hex_hash = sha256.hexdigest()

    # Take the first 'length' characters of the hexadecimal hash
    short_hash = hex_hash[:length]

    return short_hash
    
@app.route('/decryptCredentialsLicenseKey',methods = ['POST'])
def DecryptCredentialsLicenseKey():
    if True:
        try:
            hashDataDict = None
            with open('/app/hashFile') as json_file:
                hashDataDict = json.load(json_file)
            userObj = request.get_json()
            hashKey = userObj['serial_key']
            verification_license_key = ""
            if hashDataDict is not None:
                # print(hashDataDict,file=sys.stderr)
                if hashKey in hashDataDict['hashed_string']:
                    verification_license_key=hashDataDict['encoded_data']
                else:
                    return "Key Not Found",500 
            decoded_data = base64.b64decode(verification_license_key)
            res = (decoded_data.decode())
            res = res.replace("'", '"')
            objDict = json.loads(res)
            middleware = objDict['middleware']
            license_tenure_in_months = objDict['date']
            
            company_name = ""
            queryString6 = f"select COMPANY_NAME from end_user_table where COMPANY_NAME='{objDict['company_name']}';"
            result = db.session.execute(queryString6)
            for row in result:
                company_name+=row[0]
            
            start_date = datetime.now()
            if license_tenure_in_months!=0:
                license_tenure = LicenseTenure(license_tenure_in_months)
            if verification_license_key!="":
                if company_name!="" and middleware=="MonetX":
                    queryString = f"insert into license_verification_table (`COMPANY_NAME`) VALUES ('{objDict['company_name']}');"
                    db.session.execute(queryString)
                    db.session.commit()
                    queryString1 = f'update license_verification_table set verification_license_key="{verification_license_key}" where COMPANY_NAME="{objDict["company_name"]}";'
                    db.session.execute(queryString1)
                    queryString2 = f"update license_verification_table set `START_DATE`='{start_date}' where COMPANY_NAME='{objDict['company_name']}';"
                    db.session.execute(queryString2)
                    queryString3 = f"update end_user_table set LICENSE_STATUS='TRUE' where company_name='{objDict['company_name']}';"
                    db.session.execute(queryString3)
                    queryString4 = f"update license_verification_table set END_DATE='{license_tenure}' where company_name='{objDict['company_name']}';"
                    db.session.execute(queryString4)
                    db.session.commit()
                    return "Verification is Successful",200
                if datetime.now() >=license_tenure:
                        queryString5 = f"update end_user_table set LICENSE_STATUS='FALSE' where COMPANY_NAME='{objDict['company_name']}';"
                        db.session.execute(queryString5)
                        db.session.commit()
                        return "This Key has Expired",500
                else:
                    return "License Key is Invalid",500

            else:
                return "License Key Cannot be Empty",500
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503
            

def DaysLeftConversion(date_string):
    # Parse the date string
    parsed_date = datetime.strptime(str(date_string),"%Y-%m-%d %H:%M:%S")
    # Convert the parsed date to the desired format
    formatted_date = parsed_date.strftime("%Y-%m-%d")
    target_date = datetime.strptime(formatted_date, "%Y-%m-%d")
    today = datetime.now()
    time_left = target_date - today
    time_left_in_days = time_left.days
    print("Days left:", time_left_in_days,file=sys.stderr)
    return time_left_in_days

@app.route('/trackLicenseTenure',methods = ['POST'])
@token_required
def TrackLicenseTenure(user_data):
    if True:
        try:
            userObj = request.get_json()
            print(userObj,file=sys.stderr)
            
            company_name = ""
            queryString = f"select COMPANY_NAME from user_table where USER_ID='{userObj['username']}';"
            result = db.session.execute(queryString)
            for row in result:
                company_name=row[0] 
            print(company_name,file=sys.stderr)
            if company_name!="":
                end_date = ""
                queryString1 = f"select END_DATE from license_verification_table where COMPANY_NAME='{company_name}';"
                result1 = db.session.execute(queryString1)
                for row1 in result1:
                    end_date=row1[0]
                print(end_date,file=sys.stderr)
                if end_date!="":
                    daysLeft = DaysLeftConversion(end_date)
                    return f"{daysLeft}",200
                else:
                    traceback.print_exc()
                    return "End Date not Found",500
                
            else:
                traceback.print_exc()
                return "Company not Listed",500
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503

@app.route('/licenseValidationAfterLogin',methods = ['POST'])
@token_required
def LicenseValidationAfterLogin(user_data):
    if True:
        try:
            userObj = request.get_json()
            username = userObj['username']
            status = ""
            company_name = ""
            queryString = f"select company_name from user_table where user_id='{username}';"
            result = db.session.execute(queryString)
            for row in result:
                company_name=row[0]
            queryString1 = f"select license_status from end_user_table where company_name='{company_name}';"
            result1 = db.session.execute(queryString1)
            for row in result1:
                if row[0]==None:
                    pass
                else:
                    status=row[0]
            return status,200
                
            
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503