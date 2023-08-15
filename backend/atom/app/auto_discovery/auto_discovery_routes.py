import re
import sys
import traceback
import ipaddress

from flask import jsonify, request

from app import app, db
from app.middleware import token_required

from app.models.auto_discovery_models import *
from app.utilities.db_utils import *

from app.auto_discovery.auto_discovery_utils import *
from app.auto_discovery import auto_discover


@app.route("/addNetwork", methods=["POST"])
@token_required
def addNetwork(user_data):
    if True:
        try:
            networkObj = request.get_json()
            msg, status = AddNetwork(networkObj, 0, False)
            return msg, status
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return "Server Error", 500


@app.route("/editNetwork", methods=["POST"])
@token_required
def editNetwork(user_data):
    try:
        networkObj = request.get_json()
        msg, status = AddNetwork(networkObj, 0, True)
        return msg, status
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Server Error", 500


@app.route("/addNetworks", methods=["POST"])
@token_required
def addNetworks(user_data):
    try:
        errorList = []
        responseList = []
        networkObjs = request.get_json()
        row = 0
        for networkObj in networkObjs:
            row = row + 1
            response, status = AddNetwork(networkObj, row, True)

            if status == 200:
                responseList.append(response)
            else:
                errorList.append(response)

        responseDict = {
            "success": len(responseList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": responseList,
        }

        return jsonify(responseDict), 200
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Server Error", 500


@app.route("/getAllNetworks", methods=["GET"])
@token_required
def GetAllNetworks(user_data):
    if True:
        try:
            networkObjs = Auto_Discovery_Network_Table.query.all()
            objList = []
            for networkObj in networkObjs:
                objDict = {}
                objDict["network_id"] = networkObj.network_id
                objDict["network_name"] = networkObj.network_name
                objDict["subnet"] = networkObj.subnet
                objDict["no_of_devices"] = networkObj.no_of_devices
                objDict["scan_status"] = networkObj.scan_status
                objDict["excluded_ip_range"] = networkObj.excluded_ip_range
                objDict["creation_date"] = FormatDate(networkObj.creation_date)
                objDict["modification_date"] = FormatDate(networkObj.modification_date)
                objList.append(objDict)
            return jsonify(objList), 200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500


@app.route("/deleteNetworks", methods=["POST"])
@token_required
def DeleteNetworks(user_data):
    if True:
        try:
            successList = []
            errorList = []
            networkObjs = request.get_json()
            row = 0
            for networkObj in networkObjs:
                row = row + 1
                try:
                    queryString = f"select subnet from auto_discovery_network_table where network_id='{networkObj}';"
                    subnet = db.session.execute(queryString).fetchone()

                    if subnet is not None:
                        queryString = f"delete from auto_discovery_network_table where network_id='{networkObj}';"
                        db.session.execute(queryString)
                        db.session.commit()

                        queryString = f"delete from auto_discovery_table where subnet='{subnet[0]}';"
                        db.session.execute(queryString)
                        db.session.commit()

                        successList.append(f"{subnet[0]} : Deleted Successfully")

                    else:
                        errorList.append(f"Row {row} : Subnet Not Found")

                except Exception:
                    traceback.print_exc()
                    errorList.append(f"Row {row} : Error While Deleting")

            response = {
                "success": len(successList),
                "error": len(errorList),
                "success_list": successList,
                "error_list": errorList,
            }

            return jsonify(response), 200

        except Exception as e:
            print(str(e), file=sys.stderr)
            return "Server Error", 500


@app.route("/getSubnetsDropdown", methods=["GET"])
@token_required
def GetSubnetsDropdown(user_data):
    if True:
        try:
            objList = ["All"]
            queryString = f"select distinct subnet from auto_discovery_network_table;"
            result = db.session.execute(queryString)
            for row in result:
                objList.append(row[0])

            return jsonify(objList), 200

        except Exception as e:
            print(str(e), file=sys.stderr)
            # traceback.print_
            return str(e), 500


def ValidateIPRange(range):
    pattern = r"^(\d{1,3}\.){3}\d{1,3}\-\d{1,3}$"
    if re.match(pattern, range):
        index1 = range.rfind("-")
        start = range[:index1]

        index2 = start.rfind(".")
        end = start[: index2 + 1]

        end += range[index1 + 1 :]

        if int(ipaddress.IPv4Address(start)) > int(ipaddress.IPv4Address(end)):
            return None
        else:
            return {"start_ip": start, "end_ip": end}

    else:
        print("Invalid Ip Range Formate", file=sys.stderr)
        return None


@app.route("/autoDiscover", methods=["POST"])
def Discovers():
    try:
        discoveryObj = request.get_json()
        print(discoveryObj, file=sys.stderr)

        if discoveryObj["subnet"] == "All":
            return "Select a subnet to scan", 500

        queryString = f"select * from auto_discovery_network_table where subnet = '{discoveryObj['subnet']}';"
        network = db.session.execute(queryString).fetchone()

        results = None
        if network is not None:
            results = auto_discover.GetSubnetInventoryData(
                network["subnet"], network["excluded_ip_range"]
            )
        else:
            if discoveryObj["subnet"].strip() == "All":
                return "Select a subnet to start scanning", 500

            return "Subnet doesn't exit", 500

        if results is None:
            return "Error While Scanning Subnet", 500

        # if 'range' in discoveryObj:
        #     range = ValidateIPRange(discoveryObj['range'])
        #     if range is None:
        #         return "Invalid Ip Range Formate", 500

        #     results = auto_discover.GetRangeInventoryData(
        #         range['start_ip'], range['end_ip'])

        ipAddressList = []
        queryString = f"select IP_ADDRESS from auto_discovery_table;"
        rows = db.session.execute(queryString)
        from datetime import datetime

        date = datetime.now()
        for row in rows:
            ipAddressList.append(row[0])

        for host in results:
            if host[0] not in ipAddressList:
                queryString = f"INSERT INTO auto_discovery_table (IP_ADDRESS,SUBNET,OS_TYPE,MAKE_MODEL,`FUNCTION`,VENDOR,SNMP_STATUS,SNMP_VERSION,CREATION_DATE,MODIFICATION_DATE) VALUES ('{host[0]}', '{network['subnet']}','{host[1]}', '{host[2]}', '{host[3]}', '{host[4]}', '{host[5]}', '{host[6]}','{date}','{date}');"
                db.session.execute(queryString)
                db.session.commit()
                print(
                    f"Successfully Inserted to Database for {host[0]}", file=sys.stderr
                )
            else:
                queryString = f"UPDATE auto_discovery_table SET IP_ADDRESS='{host[0]}',SUBNET='{network['subnet']}',OS_TYPE='{host[1]}',MAKE_MODEL='{host[2]}',`FUNCTION`='{host[3]}',VENDOR='{host[4]}',SNMP_STATUS='{host[5]}',SNMP_VERSION='{host[6]}',MODIFICATION_DATE='{date}' where IP_ADDRESS='{host[0]}';"
                db.session.execute(queryString)
                db.session.commit()
                print(
                    f"Successfully Updated to Database for {host[0]}", file=sys.stderr
                )

        queryString = f"select subnet from auto_discovery_network_table;"
        result = db.session.execute(queryString)
        for row in result:
            subnet = row[0]
            queryString1 = f"select count(*) from auto_discovery_table where SUBNET='{network['subnet']}';"
            result1 = db.session.execute(queryString1)
            for row1 in result1:
                count = row1[0]
                queryString3 = f"update auto_discovery_network_table set NO_OF_DEVICES={count} where SUBNET='{network['subnet']}';"
                db.session.execute(queryString3)
                db.session.commit()
        return jsonify(results), 200
    except Exception as e:
        print(e, file=sys.stderr)
        return "Error", 500


@app.route("/getDiscoveryFunctionCount", methods=["POST"])
def GetDiscoveryFunctionCount():
    try:
        subnet = request.get_json()
        subnet = subnet["subnet"]
        count = {}
        if subnet == "All":
            queryString = f"select count(*) from auto_discovery_table;"
            row = db.session.execute(queryString).fetchone()[0]
            count["devices"] = row

            queryString = f"select count(*) from auto_discovery_table where `FUNCTION`='firewall';"
            row = db.session.execute(queryString).fetchone()[0]
            count["firewall"] = row

            queryString = (
                f"select count(*) from auto_discovery_table where `FUNCTION`='router';"
            )
            row = db.session.execute(queryString).fetchone()[0]
            count["router"] = row

            queryString = (
                f"select count(*) from auto_discovery_table where `FUNCTION`='switch';"
            )
            row = db.session.execute(queryString).fetchone()[0]
            count["switch"] = row

            queryString = f"select count(*) from auto_discovery_table where `FUNCTION`!='router' and `FUNCTION`!='switch' and `FUNCTION`!='firewall';"
            row = db.session.execute(queryString).fetchone()[0]
            count["other"] = row

        else:
            queryString = (
                f"select count(*) from auto_discovery_table where subnet = '{subnet}';"
            )
            row = db.session.execute(queryString).fetchone()[0]
            count["devices"] = row

            queryString = f"select count(*) from auto_discovery_table where `FUNCTION`='firewall' and subnet = '{subnet}';"
            row = db.session.execute(queryString).fetchone()[0]
            count["firewall"] = row

            queryString = f"select count(*) from auto_discovery_table where `FUNCTION`='router' and subnet = '{subnet}';"
            row = db.session.execute(queryString).fetchone()[0]
            count["router"] = row

            queryString = f"select count(*) from auto_discovery_table where `FUNCTION`='switch' and subnet = '{subnet}';"
            row = db.session.execute(queryString).fetchone()[0]
            count["switch"] = row

            queryString = f"select count(*) from auto_discovery_table where `FUNCTION`!='router' and `FUNCTION`!='switch' and `FUNCTION`!='firewall' and subnet = '{subnet}';"
            row = db.session.execute(queryString).fetchone()[0]
            count["other"] = row

        return jsonify(count), 200
    except Exception as e:
        traceback.print_exc()
        print(e, file=sys.stderr)
        return "Error", 500


@app.route("/getDiscoveryData", methods=["POST"])
# @token_required
def GetDiscoveryData():
    if True:
        try:
            subnet = request.get_json()
            subnet = subnet["subnet"]

            queryString = f"select * from auto_discovery_table;"

            if subnet != "All":
                queryString = (
                    f"select * from auto_discovery_table where subnet ='{subnet}';"
                )

            result = db.session.execute(queryString)
            objList = []
            for row in result:
                objDict = {}
                objDict["discovery_id"] = row[0]
                objDict["ip_address"] = row[1]
                objDict["subnet"] = row[2]
                objDict["os_type"] = row[3]
                objDict["make_model"] = row[4]
                objDict["function"] = row[5]
                objDict["vendor"] = row[6]
                objDict["snmp_status"] = row[7]
                objDict["snmp_version"] = row[8]
                objDict["creation_date"] = FormatDate(row[9])
                objDict["modification_date"] = FormatDate(row[10])
                objList.append(objDict)

            print(subnet, file=sys.stderr)
            return jsonify(objList), 200

        except Exception as e:
            print(e, file=sys.stderr)
            return "Error", 500


@app.route("/getDiscoveryDataFirewalls", methods=["POST"])
# @token_required
def GetDiscoveryDataFirewalls():
    if True:
        try:
            subnet = request.get_json()
            subnet = subnet["subnet"]

            queryString = (
                f"select * from auto_discovery_table where `FUNCTION`='firewall';"
            )

            if subnet != "All":
                queryString = f"select * from auto_discovery_table where subnet ='{subnet}' and `FUNCTION`='firewall';"

            result = db.session.execute(queryString)
            objList = []
            for row in result:
                objDict = {}
                objDict["discovery_id"] = row[0]
                objDict["ip_address"] = row[1]
                objDict["subnet"] = row[2]
                objDict["os_type"] = row[3]
                objDict["make_model"] = row[4]
                objDict["function"] = row[5]
                objDict["vendor"] = row[6]
                objDict["snmp_status"] = row[7]
                objDict["snmp_version"] = row[8]
                objDict["creation_date"] = FormatDate(row[9])
                objDict["modification_date"] = FormatDate(row[10])
                objList.append(objDict)
            return jsonify(objList), 200

        except Exception as e:
            print(e, file=sys.stderr)
            return "Error", 500


@app.route("/getDiscoveryDataRouters", methods=["POST"])
# @token_required
def GetDiscoveryDataRouters():
    if True:
        try:
            subnet = request.get_json()
            subnet = subnet["subnet"]

            queryString = (
                f"select * from auto_discovery_table where `FUNCTION`='router';"
            )

            if subnet != "All":
                queryString = f"select * from auto_discovery_table where subnet ='{subnet}' and `FUNCTION`='router';"

            result = db.session.execute(queryString)
            objList = []
            for row in result:
                objDict = {}
                objDict["discovery_id"] = row[0]
                objDict["ip_address"] = row[1]
                objDict["subnet"] = row[2]
                objDict["os_type"] = row[3]
                objDict["make_model"] = row[4]
                objDict["function"] = row[5]
                objDict["vendor"] = row[6]
                objDict["snmp_status"] = row[7]
                objDict["snmp_version"] = row[8]
                objDict["creation_date"] = FormatDate(row[9])
                objDict["modification_date"] = FormatDate(row[10])
                objList.append(objDict)
            return jsonify(objList), 200

        except Exception as e:
            print(e, file=sys.stderr)
            return "Error", 500


@app.route("/getDiscoveryDataSwitches", methods=["POST"])
# @token_required
def GetDiscoveryDataSwitches():
    if True:
        try:
            subnet = request.get_json()
            subnet = subnet["subnet"]

            queryString = (
                f"select * from auto_discovery_table where `FUNCTION`='switch';"
            )

            if subnet != "All":
                queryString = f"select * from auto_discovery_table where subnet ='{subnet}' and `FUNCTION`='switch';"

            result = db.session.execute(queryString)
            objList = []
            for row in result:
                objDict = {}
                objDict["discovery_id"] = row[0]
                objDict["ip_address"] = row[1]
                objDict["subnet"] = row[2]
                objDict["os_type"] = row[3]
                objDict["make_model"] = row[4]
                objDict["function"] = row[5]
                objDict["vendor"] = row[6]
                objDict["snmp_status"] = row[7]
                objDict["snmp_version"] = row[8]
                objDict["creation_date"] = FormatDate(row[9])
                objDict["modification_date"] = FormatDate(row[10])
                objList.append(objDict)
            return jsonify(objList), 200

        except Exception as e:
            print(e, file=sys.stderr)
            return "Error", 500


@app.route("/getDiscoveryDataOthers", methods=["POST"])
# @token_required
def GetDiscoveryDataOthers():
    if True:
        try:
            subnet = request.get_json()
            subnet = subnet["subnet"]

            queryString = f"select * from auto_discovery_table where `FUNCTION`!='router' and `FUNCTION`!='switch' and `FUNCTION`!='firewall';"

            if subnet != "All":
                queryString = f"select * from auto_discovery_table where subnet ='{subnet}' and `FUNCTION`!='router' and `FUNCTION`!='switch' and `FUNCTION`!='firewall';"

            result = db.session.execute(queryString)
            objList = []
            for row in result:
                objDict = {}
                objDict["discovery_id"] = row[0]
                objDict["ip_address"] = row[1]
                objDict["subnet"] = row[2]
                objDict["os_type"] = row[3]
                objDict["make_model"] = row[4]
                objDict["function"] = row[5]
                objDict["vendor"] = row[6]
                objDict["snmp_status"] = row[7]
                objDict["snmp_version"] = row[8]
                objDict["creation_date"] = FormatDate(row[9])
                objDict["modification_date"] = FormatDate(row[10])
                objList.append(objDict)
            return jsonify(objList), 200

        except Exception as e:
            print(e, file=sys.stderr)
            return "Error", 500


@app.route("/autoDiscoveryFunctionCount", methods=["GET"])
# @token_required
def AutoDiscoveryFunctionCount():
    if True:
        try:
            queryString = f"select `FUNCTION`,count(`FUNCTION`) from auto_discovery_table group by `FUNCTION`;"
            result = db.session.execute(queryString)
            objDict = {}
            count = 0
            for row in result:
                if row[0] == "switch":
                    objDict["Switches"] = row[1]
                elif row[0] == "firewall":
                    objDict["Firewalls"] = row[1]
                elif row[0] == "router":
                    objDict["Routers"] = row[1]
                else:
                    count += row[1]
            objDict["Others"] = count

            print(objDict, file=sys.stderr)
            return objDict, 200
        except Exception as e:
            print(e, file=sys.stderr)
            return "Error", 500


@app.route("/getManageDevices", methods=["GET"])
@token_required
def GetManageDevices(user_data):
    try:
        queryString = f"select IP_ADDRESS,OS_TYPE,`FUNCTION`,VENDOR,SNMP_STATUS from auto_discovery_table;"
        result = db.session.execute(queryString)
        objList = []
        for row in result:
            objDict = {}
            ip_address = row[0]
            os_type = row[1]
            function = row[2]
            vendor = row[3]
            snmp_status = row[4]
            objDict["ip_address"] = ip_address
            objDict["os_type"] = os_type
            objDict["function"] = function
            objDict["vendor"] = vendor
            objDict["snmp_status"] = snmp_status
            objList.append(objDict)
        return jsonify(objList), 200
    except Exception as e:
        print(e, file=sys.stderr)
        return "Error", 500


# def CheckSSHConnection(ip_address, username, password):
#     response = 'False'
#     try:
#         client = paramiko.SSHClient()
#         client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
#         client.connect(ip_address, 22, username=username, password=password)
#         print(f"Successfully connected to {ip_address}:{22} via SSH.")
#         client.close()
#         response = 'True'
#         return response
#     except paramiko.AuthenticationException:
#         print(
#             f"Failed to connect to {ip_address}:{22} via SSH. Authentication failed.")
#         response = 'False'
#         return response
#     except paramiko.SSHException:
#         print(
#             f"Failed to connect to {ip_address}:{22} via SSH. Connection failed.")
#         response = 'False'
#         return response
#     except Exception as e:
#         print(f"Failed to connect to {ip_address}:{22} via SSH. {str(e)}")
#         response = 'False'
#         return response


# def CheckSSHStatus():
#     ipList = []
#     queryString = f"select IP_ADDRESS from auto_discovery_table;"
#     result = db.session.execute(queryString)
#     for row in result:
#         ipList.append(row[0])
#     queryString = f"select username,password from password_group_table;"
#     result = db.session.execute(queryString)

#     objList = []
#     for row in result:
#         objDict = {}
#         username = row[0]
#         password = row[1]
#         objDict['username'] = username
#         objDict['password'] = password
#         objList.append(objDict)
#     for dict in objList:
#         for ip in ipList:

#             status = CheckSSHConnection(ip, dict['username'], dict['password'])
#             print(f"SSH STATUS is {status}", file=sys.stderr)
#             queryString1 = f"update auto_discovery_table set SSH_STATUS='{status}' where IP_ADDRESS='{ip}' or SSH_STATUS!='True';"
#             db.session.execute(queryString1)
#             db.session.commit()
#             print(f"SSH STATUS SUCCESSFULLY UPDATED FOR {ip}", file=sys.stderr)


# def CheckSNMPCredentials():
#     queryString = f"select * from auto_discovery_table where `SNMP_STATUS`='Enabled';"
#     results = db.session.execute(queryString)

#     queryString = f"select snmp_read_community from snmp_credentials_table where category='v1/v2';;"
#     creds = db.session.execute(queryString)
#     v2_list = []
#     for row in creds:
#         v2_list.append(row[0])

#     queryString = f"select profile_name,username,description,snmp_port,authentication_method,password,encryption_method,encryption_password,CREDENTIALS_ID from snmp_credentials_table where category='v3';"
#     results = db.session.execute(queryString)

#     v3_list = []
#     for row in results:
#         SNMPObj = {}
#         SNMPObj['username'] = row[1]
#         SNMPObj['port'] = row[3]
#         SNMPObj['authentication_protocol'] = row[4]
#         SNMPObj['authentication_password'] = row[5]

#         SNMPObj['encryption_protocol'] = row[6]

#         SNMPObj['encryption_password'] = row[7]
#         v3_list.append(SNMPObj)

#     for row in results:
#         test_result = auto_discover.TestSNMPV2Credentials(row[1], v2_list)
#         if test_result is None:
#             # no credentials matched
#             test_result = auto_discover.TestSNMPV3Credentials(row[1], v3_list)

#         if test_result is not None:
#             # credentials matched
#             queryString = f"UPDATE auto_discovery_table SET SNMP_VERSION='{test_result['snmp_version']}',MODIFICATION_DATE='{datetime.now()}' where IP_ADDRESS='{row[1]}';"
#             db.session.execute(queryString)
#             db.session.commit()


# @app.route('/checkCredentialsStatus', methods=['GET'])
# def CheckCredentialsStatus():
#     try:
#         import threading
#         ssh_thread = threading.Thread(target=CheckSSHStatus)
#         ssh_thread.start()

#         snmp_thread = threading.Thread(target=CheckSNMPCredentials)
#         snmp_thread.start()

#         ssh_thread.join()
#         snmp_thread.join()

#         return "Success", 200
#     except Exception as e:
#         print(e, file=sys.stderr)
#         return "Error", 500


# @app.route('/addSNMPCredentials', methods=['POST'])
# @token_required
# def AddSNMPCredentials(user_data):
#     try:

#         credentialObj = request.get_json()

#         print(credentialObj, file=sys.stderr)

#         credential = SNMP_CREDENTIALS_TABLE()
#         if 'credentials' in credentialObj:
#             credential.credentials = credentialObj['credentials']
#         if 'category' in credentialObj:
#             credential.category = credentialObj['category']
#         if 'profile_name' in credentialObj:
#             credential.profile_name = credentialObj['profile_name']
#         if 'description' in credentialObj:
#             credential.description = credentialObj['description']
#         if 'ip_address' in credentialObj:
#             credential.ip_address = credentialObj['ip_address']
#         if 'community' in credentialObj:
#             credential.snmp_read_community = credentialObj['community']
#         if 'port' in credentialObj:
#             credential.snmp_port = credentialObj['port']
#         if 'username' in credentialObj:
#             credential.username = credentialObj['username']

#         if 'authentication_password' in credentialObj:
#             credential.password = credentialObj['authentication_password']
#         if 'password' in credentialObj:
#             credential.password = credentialObj['password']
#         if 'encryption_password' in credentialObj:
#             credential.encryption_password = credentialObj['encryption_password']

#         if 'authentication_protocol' in credentialObj:
#             credential.authentication_method = credentialObj['authentication_protocol']

#         if 'encryption_protocol' in credentialObj:
#             credential.encryption_method = credentialObj['encryption_protocol']

#         credential.date = (datetime.now())
#         if SNMP_CREDENTIALS_TABLE.query.with_entities(SNMP_CREDENTIALS_TABLE.profile_name).filter_by(profile_name=credentialObj['profile_name']).first() is not None:
#             credential.credentials_id = SNMP_CREDENTIALS_TABLE.query.with_entities(
#                 SNMP_CREDENTIALS_TABLE.credentials_id).filter_by(profile_name=credentialObj['profile_name']).first()[0]
#             return "Duplicate Entry", 500
#         else:
#             InsertData(credential)
#             print(
#                 f"Inserted {credential.credentials_id} Credentials Successfully", file=sys.stderr)
#             return "Credentials Successfully Added", 200

#     except Exception as e:
#         print(f"in exception block Successfully", file=sys.stderr)
#         print(str(e), file=sys.stderr)
#         traceback.print_exc()
#         return "Something Went Wrong!", 500


# @app.route('/deleteSNMPCredentials', methods=['POST'])
# @token_required
# def DeleteSNMPCredentials(user_data):
#     try:
#         credentialObjs = request.get_json()
#         response = False
#         for credentialObj in credentialObjs:
#             print(credentialObj, file=sys.stderr)
#             queryString = f"delete from snmp_credentials_table where  CREDENTIALS_ID = {credentialObj};"
#             db.session.execute(queryString)
#             db.session.commit()
#             response = True

#         if response:
#             return "SNMP Credentails Deleted Successfully", 200

#         else:
#             return "Erro While Deleting SNMP Credentials", 500

#     except Exception as e:
#         print(f"in exception block Successfully", file=sys.stderr)
#         print(str(e), file=sys.stderr)
#         traceback.print_exc()
#         return "Something Went Wrong!", 500


# @app.route("/getSNMPV1V2Credentials", methods=['GET'])
# def SNMPV2CredentialsForDiscovery():
#     try:
#         SNMPList = []

#         queryString = f"select profile_name,description,snmp_read_community,snmp_port,CREDENTIALS_ID from snmp_credentials_table where category='v1/v2';"
#         results = db.session.execute(queryString)

#         for row in results:
#             SNMPObj = {}
#             SNMPObj['profile_name'] = row[0]
#             SNMPObj['description'] = row[1]
#             SNMPObj['version'] = "v1/v2"
#             SNMPObj['community'] = row[2]
#             SNMPObj['port'] = row[3]
#             SNMPObj['credentials_id'] = row[4]

#             SNMPList.append(SNMPObj)

#         return jsonify(SNMPList), 200

#     except Exception as e:
#         traceback.print_exc()
#         return "Something Went Wrong!", 500


# @app.route("/getSNMPV3CredentialsForDiscovery", methods=['GET'])
# def SNMPV3CredentialsForDiscovery():
#     try:
#         SNMPList = []

#         queryString = f"select profile_name,username,description,snmp_port,authentication_method,password,encryption_method,encryption_password,CREDENTIALS_ID from snmp_credentials_table where category='v3';"
#         results = db.session.execute(queryString)

#         for row in results:
#             SNMPObj = {}
#             SNMPObj['profile_name'] = row[0]
#             SNMPObj['username'] = row[1]
#             SNMPObj['description'] = row[2]
#             SNMPObj['port'] = row[3]
#             SNMPObj['authentication_protocol'] = row[4]

#             SNMPObj['authentication_password'] = row[5]

#             SNMPObj['encryption_protocol'] = row[6]

#             SNMPObj['encryption_password'] = row[7]
#             SNMPObj['credentials_id'] = row[8]
#             SNMPList.append(SNMPObj)

#         return jsonify(SNMPList), 200

#     except Exception as e:
#         traceback.print_exc()
#         return "Something Went Wrong!", 500


# @app.route('/getDiscoveryCredentialsCount', methods=['GET'])
# @token_required
# def GetSNMPV2Count(user_data):
#     try:
#         queryString = f"select count(*) from snmp_credentials_table where category='v1/v2';"
#         v2Count = db.session.execute(queryString).fetchone()
#         print(f"SNMP V1/V2 Credentials Count: {v2Count[0]}", file=sys.stderr)

#         queryString = f"select count(*) from snmp_credentials_table where category='v3';"
#         v3Count = db.session.execute(queryString).fetchone()
#         print(f"SNMP V3 Credentials Count: {v3Count[0]}", file=sys.stderr)

#         queryString = f"select count(*) from password_group_table;"
#         sshCount = db.session.execute(queryString).fetchone()
#         print(f"SSH Credentials Count: {sshCount[0]}", file=sys.stderr)

#         cred_count = {
#             'snmp_v2': v2Count[0],
#             'snmp_v3': v3Count[0],
#             'login': sshCount[0]
#         }

#         return jsonify(cred_count), 200
#     except Exception as e:
#         traceback.print_exc()
#         print(e, file=sys.stderr)
#         return "Error", 500
