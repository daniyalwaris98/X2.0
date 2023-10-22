import ipaddress
import traceback
import sys

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy.sql.functions import count

from app.models.auto_discovery_models import *
from app.schema.auto_discovery_schema import *

from app.api.v1.auto_discovery.auto_discovery_utils import *
from app.api.v1.auto_discovery import auto_discover

# import re
# import sys


# import ipaddress
#
# from flask import jsonify, request
#
# from app import app, db
# from app.middleware import token_required
#
# from app.models.auto_discovery_models import *
# from app.utilities.db_utils import *
#
# from app.auto_discovery.auto_discovery_utils import *
# from app.auto_discovery import auto_discover
#
#


router = APIRouter(
    prefix="/auto_discovery",
    tags=["auto_discovery"],
)


@router.post("/addNetwork", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def add_network(network_obj: AddDiscoveryNetworkRequestSchema):
    try:
        msg, status = add_network_util(network_obj, False)
        return JSONResponse(content=msg, status_code=status)
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return JSONResponse(content="Server Error While Adding Network", status_code=500)


@router.post("/editNetwork", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def edit_network(network_obj: EditDiscoveryNetworkRequestSchema):
    try:
        msg, status = edit_network_util(network_obj)
        return JSONResponse(content=msg, status_code=status)
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return JSONResponse(content="Server Error While Updating Network", status_code=500)


@router.post("/addNetworks", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
async def add_networks(network_objs: list[AddDiscoveryNetworkRequestSchema]):
    try:
        error_list = []
        success_list = []

        for networkObj in network_objs:
            response, status = add_network_util(networkObj, True)

            if status == 200:
                success_list.append(response)
            else:
                error_list.append(response)

        response_dict = {
            "success": len(success_list),
            "error": len(error_list),
            "error_list": error_list,
            "success_list": success_list,
        }

        return JSONResponse(content=response_dict, status_code=200)
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return JSONResponse(content="Server Error While Inserting Discovery Networks",
                            status_code=500)


@router.get("/getAllNetworks", responses={
    200: {"model": GetDiscoveryNetworkResponseSchema},
    500: {"model": str}
})
async def get_all_networks():
    try:
        network_objs = configs.db.query(AutoDiscoveryNetworkTable).all()

        obj_list = []
        for networkObj in network_objs:
            obj_dict = {"network_id": networkObj.network_id,
                        "network_name": networkObj.network_name, "subnet": networkObj.subnet,
                        "no_of_devices": networkObj.no_of_devices,
                        "scan_status": networkObj.scan_status,
                        "excluded_ip_range": networkObj.excluded_ip_range,
                        "creation_date": str(networkObj.creation_date),
                        "modification_date": str(networkObj.modification_date)}
            obj_list.append(obj_dict)

        return JSONResponse(content=obj_list, status_code=200)
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Discovery Networks",
                            status_code=500)


@router.post("/deleteNetworks", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
async def delete_networks(network_objs: list[int]):
    try:
        success_ist = []
        error_ist = []

        row = 0
        for networkObj in network_objs:
            row = row + 1
            try:
                query_string = f"select subnet from auto_discovery_network_table where network_id='{networkObj}';"
                subnet = configs.db.execute(query_string).fetchone()

                if subnet is not None:
                    query_string = f"delete from auto_discovery_network_table where network_id='{networkObj}';"
                    configs.db.execute(query_string)
                    configs.db.commit()

                    query_string = f"delete from auto_discovery_table where subnet='{subnet[0]}';"
                    configs.db.execute(query_string)
                    configs.db.commit()

                    success_ist.append(f"{subnet[0]} : Deleted Successfully")

                else:
                    error_ist.append(f"Row {row} : Subnet Not Found")

            except Exception:
                traceback.print_exc()
                error_ist.append(f"Row {row} : Error While Deleting")

        response = {
            "success": len(success_ist),
            "error": len(error_ist),
            "success_list": success_ist,
            "error_list": error_ist,
        }

        return JSONResponse(content=response, status_code=200)

    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return JSONResponse(content="Server Error While Deleting Discovery Networks",
                            status_code=500)


@router.get("/getSubnetsDropdown", responses={
    200: {"model": list[str]},
    500: {"model": str}
})
async def get_subnets_dropdown():
    try:
        obj_list = ["All"]

        query_string = f"select distinct subnet from auto_discovery_network_table;"
        result = configs.db.execute(query_string)

        for row in result:
            obj_list.append(row[0])

        return JSONResponse(content=obj_list, status_code=200)

    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Subnet Dropdown", status_code=500)


def validate_ip_range(range):
    pattern = r"^(\d{1,3}\.){3}\d{1,3}\-\d{1,3}$"
    if re.match(pattern, range):
        index1 = range.rfind("-")
        start = range[:index1]

        index2 = start.rfind(".")
        end = start[: index2 + 1]

        end += range[index1 + 1:]

        if int(ipaddress.IPv4Address(start)) > int(ipaddress.IPv4Address(end)):
            return None
        else:
            return {"start_ip": start, "end_ip": end}

    else:
        print("Invalid Ip Range Formate", file=sys.stderr)
        return None


@router.post("/autoDiscover", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def auto_discover_endpoint(subnet: str):
    try:

        if str(subnet).lower() == "all":
            return JSONResponse("Select a subnet to scan", 400)

        network = configs.db.query(AutoDiscoveryNetworkTable).filter(
            AutoDiscoveryNetworkTable.subnet == subnet).first()

        if network is not None:
            results = auto_discover.get_range_inventory_data(
                network.subnet, network.excluded_ip_range
            )
        else:
            return JSONResponse("Subnet doesn't exit", 400)

        if results is None:
            return JSONResponse("Error While Scanning Subnet", 500)

        for host in results:
            discovery_obj = configs.db.query(AutoDiscoveryTable).filter(
                AutoDiscoveryTable.ip_address == host[0]).first()

            if discovery_obj is None:
                discovery_obj = AutoDiscoveryTable()
                discovery_obj.ip_address = host[0]
                discovery_obj.subnet = network.subnet
                discovery_obj.os_type = host[1]
                discovery_obj.make_model = host[2]
                discovery_obj.function = host[3]
                discovery_obj.vendor = host[4]
                discovery_obj.snmp_status = host[5]
                discovery_obj.snmp_version = host[6]
                discovery_obj.ssh_status = False

                InsertDBData(discovery_obj)
                print(
                    f"Successfully Inserted to Database for {host[0]}", file=sys.stderr
                )
            else:
                discovery_obj.ip_address = host[0]
                discovery_obj.subnet = network.subnet
                discovery_obj.os_type = host[1]
                discovery_obj.make_model = host[2]
                discovery_obj.function = host[3]
                discovery_obj.vendor = host[4]
                discovery_obj.snmp_status = host[5]
                discovery_obj.snmp_version = host[6]
                discovery_obj.ssh_status = False

                UpdateDBData(discovery_obj)
                print(
                    f"Successfully Updated to Database for {host[0]}", file=sys.stderr
                )
            #
            # obj_dict = {"ip_address": host[0], "subnet": network.subnet, "os_type": host[1],
            #             "make_model": host[2], "function": host[3], "vendor": host[4],
            #             "snmp_status": host[5], "snmp_version": host[6], "ssh_status": False}
            # response_list.append(obj_dict)

        result = configs.db.query(AutoDiscoveryNetworkTable).all()
        for network in result:
            query_string = f"select count(*) from auto_discovery_table where SUBNET='{network.subnet}';"
            number_of_devices = configs.db.execute(query_string).fetchone()
            network.number_of_device = number_of_devices[0]
            UpdateDBData(network)

        return JSONResponse(content="Subnet Scanned Successfully", status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)


@router.post("/getDiscoveryFunctionCount", responses={
    200: {"model": DiscoveryFunctionCountResponseSchema},
    500: {"model": str}
})
def get_discovery_function_count(subnet: str):
    try:
        function_count = {}
        if str(subnet).lower() == "All":
            query_string = f"select count(*) from auto_discovery_table;"
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["devices"] = row

            query_string = f"select count(*) from auto_discovery_table where `FUNCTION`='firewall';"
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["firewall"] = row

            query_string = (
                f"select count(*) from auto_discovery_table where `FUNCTION`='router';"
            )
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["router"] = row

            query_string = (
                f"select count(*) from auto_discovery_table where `FUNCTION`='switch';"
            )
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["switch"] = row

            query_string = f"select count(*) from auto_discovery_table where `FUNCTION`!='router' and `FUNCTION`!='switch' and `FUNCTION`!='firewall';"
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["other"] = row

        else:
            query_string = (
                f"select count(*) from auto_discovery_table where subnet = '{subnet}';"
            )
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["devices"] = row

            query_string = f"select count(*) from auto_discovery_table where `FUNCTION`='firewall' and subnet = '{subnet}';"
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["firewall"] = row

            query_string = f"select count(*) from auto_discovery_table where `FUNCTION`='router' and subnet = '{subnet}';"
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["router"] = row

            query_string = f"select count(*) from auto_discovery_table where `FUNCTION`='switch' and subnet = '{subnet}';"
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["switch"] = row

            query_string = f"select count(*) from auto_discovery_table where `FUNCTION`!='router' and `FUNCTION`!='switch' and `FUNCTION`!='firewall' and subnet = '{subnet}';"
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["other"] = row

        return JSONResponse(content=function_count, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)
#
#
# @app.route("/getDiscoveryData", methods=["POST"])
# # @token_required
# def getDiscoveryData():
#     try:
#         subnetObj = request.get_json()
#         response, status = GetDiscoveryData(subnetObj, None)
#
#         if status == 200:
#             return jsonify(response), 200
#         else:
#             return response, 500
#
#     except Exception:
#         traceback.print_exc()
#         return "Server Error While Fetching Discovery Data", 500
#
#
# @app.route("/getDiscoveryDataFirewalls", methods=["POST"])
# # @token_required
# def GetDiscoveryDataFirewalls():
#     try:
#         subnetObj = request.get_json()
#         response, status = GetDiscoveryData(subnetObj, "firewall")
#
#         if status == 200:
#             return jsonify(response), 200
#         else:
#             return response, 500
#
#     except Exception:
#         traceback.print_exc()
#         return "Server Error While Fetching Discovery Data", 500
#
#
# @app.route("/getDiscoveryDataRouters", methods=["POST"])
# # @token_required
# def GetDiscoveryDataRouters():
#     try:
#         subnetObj = request.get_json()
#         response, status = GetDiscoveryData(subnetObj, "router")
#
#         if status == 200:
#             return jsonify(response), 200
#         else:
#             return response, 500
#
#     except Exception:
#         traceback.print_exc()
#         return "Server Error While Fetching Discovery Data", 500
#
#
# @app.route("/getDiscoveryDataSwitches", methods=["POST"])
# # @token_required
# def GetDiscoveryDataSwitches():
#     try:
#         subnetObj = request.get_json()
#         response, status = GetDiscoveryData(subnetObj, "switch")
#
#         if status == 200:
#             return jsonify(response), 200
#         else:
#             return response, 500
#
#     except Exception:
#         traceback.print_exc()
#         return "Server Error While Fetching Discovery Data", 500
#
#
# @app.route("/getDiscoveryDataOthers", methods=["POST"])
# # @token_required
# def GetDiscoveryDataOthers():
#     try:
#         subnetObj = request.get_json()
#         objList = []
#
#         if "subnet" not in subnetObj:
#             return "Subnet Not Found", 500
#
#         if subnetObj["subnet"] is None:
#             return "Subnet Not Found", 500
#
#         subnet = subnetObj["subnet"]
#
#         results = None
#         if subnet != "All":
#             results = Auto_Discovery_Table.query.filter(
#                 Auto_Discovery_Table.subnet == subnet
#                 and Auto_Discovery_Table.function != "firewall"
#                 and Auto_Discovery_Table.function != "router"
#                 and Auto_Discovery_Table.function != "switch"
#             ).all()
#         else:
#             results = Auto_Discovery_Table.query.filter(
#                 Auto_Discovery_Table.function != "firewall"
#                 and Auto_Discovery_Table.function != "router"
#                 and Auto_Discovery_Table.function != "switch"
#             ).all()
#
#         for data in results:
#             objDict = data.as_dict()
#             objList.append(objDict)
#
#         return jsonify(objList), 200
#
#     except Exception:
#         traceback.print_exc()
#         return "Server Error While Fetching Discovery Data", 500
#
#
# @app.route("/autoDiscoveryFunctionCount", methods=["GET"])
# # @token_required
# def AutoDiscoveryFunctionCount():
#     if True:
#         try:
#             query_string = f"select `FUNCTION`,count(`FUNCTION`) from auto_discovery_table group by `FUNCTION`;"
#             result = configs.db.execute(query_string)
#             objDict = {}
#             count = 0
#             for row in result:
#                 if row[0] == "switch":
#                     objDict["Switches"] = row[1]
#                 elif row[0] == "firewall":
#                     objDict["Firewalls"] = row[1]
#                 elif row[0] == "router":
#                     objDict["Routers"] = row[1]
#                 else:
#                     count += row[1]
#             objDict["Others"] = count
#
#             print(objDict, file=sys.stderr)
#             return objDict, 200
#         except Exception as e:
#             print(e, file=sys.stderr)
#             return "Error", 500
#
#
# @app.route("/getManageDevices", methods=["GET"])
# @token_required
# def GetManageDevices(user_data):
#     try:
#         results = Auto_Discovery_Table.query.all()
#         objList = []
#
#         for row in results:
#             objDict = {}
#             objDict["ip_address"] = row.ip_address
#             objDict["os_type"] = row.os_type
#             objDict["function"] = row.function
#             objDict["vendor"] = row.vendor
#             objDict["snmp_status"] = row.snmp_status
#             objDict["ssh_status"] = row.ssh_status
#
#             objList.append(objDict)
#
#         return jsonify(objList), 200
#
#     except Exception:
#         traceback.print_exc()
#         return "Error While Fetching Data", 500
#
#
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
#
#
# def CheckSSHStatus():
#     ipList = []
#     query_string = f"select IP_ADDRESS from auto_discovery_table;"
#     result = configs.db.execute(query_string)
#     for row in result:
#         ipList.append(row[0])
#     query_string = f"select username,password from password_group_table;"
#     result = configs.db.execute(query_string)
#
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
#
#             status = CheckSSHConnection(ip, dict['username'], dict['password'])
#             print(f"SSH STATUS is {status}", file=sys.stderr)
#             queryString1 = f"update auto_discovery_table set SSH_STATUS='{status}' where IP_ADDRESS='{ip}' or SSH_STATUS!='True';"
#             configs.db.execute(queryString1)
#             configs.db.commit()
#             print(f"SSH STATUS SUCCESSFULLY UPDATED FOR {ip}", file=sys.stderr)
#
#
# def CheckSNMPCredentials():
#     query_string = f"select * from auto_discovery_table where `SNMP_STATUS`='Enabled';"
#     results = configs.db.execute(query_string)
#
#     query_string = f"select snmp_read_community from snmp_credentials_table where category='v1/v2';;"
#     creds = configs.db.execute(query_string)
#     v2_list = []
#     for row in creds:
#         v2_list.append(row[0])
#
#     query_string = f"select profile_name,username,description,snmp_port,authentication_method,password,encryption_method,encryption_password,CREDENTIALS_ID from snmp_credentials_table where category='v3';"
#     results = configs.db.execute(query_string)
#
#     v3_list = []
#     for row in results:
#         SNMPObj = {}
#         SNMPObj['username'] = row[1]
#         SNMPObj['port'] = row[3]
#         SNMPObj['authentication_protocol'] = row[4]
#         SNMPObj['authentication_password'] = row[5]
#
#         SNMPObj['encryption_protocol'] = row[6]
#
#         SNMPObj['encryption_password'] = row[7]
#         v3_list.append(SNMPObj)
#
#     for row in results:
#         test_result = auto_discover.TestSNMPV2Credentials(row[1], v2_list)
#         if test_result is None:
#             # no credentials matched
#             test_result = auto_discover.TestSNMPV3Credentials(row[1], v3_list)
#
#         if test_result is not None:
#             # credentials matched
#             query_string = f"UPDATE auto_discovery_table SET SNMP_VERSION='{test_result['snmp_version']}',MODIFICATION_DATE='{datetime.now()}' where IP_ADDRESS='{row[1]}';"
#             configs.db.execute(query_string)
#             configs.db.commit()
#
#
# @app.route('/checkCredentialsStatus', methods=['GET'])
# def CheckCredentialsStatus():
#     try:
#         import threading
#         ssh_thread = threading.Thread(target=CheckSSHStatus)
#         ssh_thread.start()
#
#         snmp_thread = threading.Thread(target=CheckSNMPCredentials)
#         snmp_thread.start()
#
#         ssh_thread.join()
#         snmp_thread.join()
#
#         return "Success", 200
#     except Exception as e:
#         print(e, file=sys.stderr)
#         return "Error", 500
#
#
# # @app.route('/addSNMPCredentials', methods=['POST'])
# # @token_required
# # def AddSNMPCredentials(user_data):
# #     try:
#
# #         credentialObj = request.get_json()
#
# #         print(credentialObj, file=sys.stderr)
#
# #         credential = SNMP_CREDENTIALS_TABLE()
# #         if 'credentials' in credentialObj:
# #             credential.credentials = credentialObj['credentials']
# #         if 'category' in credentialObj:
# #             credential.category = credentialObj['category']
# #         if 'profile_name' in credentialObj:
# #             credential.profile_name = credentialObj['profile_name']
# #         if 'description' in credentialObj:
# #             credential.description = credentialObj['description']
# #         if 'ip_address' in credentialObj:
# #             credential.ip_address = credentialObj['ip_address']
# #         if 'community' in credentialObj:
# #             credential.snmp_read_community = credentialObj['community']
# #         if 'port' in credentialObj:
# #             credential.snmp_port = credentialObj['port']
# #         if 'username' in credentialObj:
# #             credential.username = credentialObj['username']
#
# #         if 'authentication_password' in credentialObj:
# #             credential.password = credentialObj['authentication_password']
# #         if 'password' in credentialObj:
# #             credential.password = credentialObj['password']
# #         if 'encryption_password' in credentialObj:
# #             credential.encryption_password = credentialObj['encryption_password']
#
# #         if 'authentication_protocol' in credentialObj:
# #             credential.authentication_method = credentialObj['authentication_protocol']
#
# #         if 'encryption_protocol' in credentialObj:
# #             credential.encryption_method = credentialObj['encryption_protocol']
#
# #         credential.date = (datetime.now())
# #         if SNMP_CREDENTIALS_TABLE.query.with_entities(SNMP_CREDENTIALS_TABLE.profile_name).filter_by(profile_name=credentialObj['profile_name']).first() is not None:
# #             credential.credentials_id = SNMP_CREDENTIALS_TABLE.query.with_entities(
# #                 SNMP_CREDENTIALS_TABLE.credentials_id).filter_by(profile_name=credentialObj['profile_name']).first()[0]
# #             return "Duplicate Entry", 500
# #         else:
# #             InsertData(credential)
# #             print(
# #                 f"Inserted {credential.credentials_id} Credentials Successfully", file=sys.stderr)
# #             return "Credentials Successfully Added", 200
#
# #     except Exception as e:
# #         print(f"in exception block Successfully", file=sys.stderr)
# #         print(str(e), file=sys.stderr)
# #         traceback.print_exc()
# #         return "Something Went Wrong!", 500
#
#
# # @app.route('/deleteSNMPCredentials', methods=['POST'])
# # @token_required
# # def DeleteSNMPCredentials(user_data):
# #     try:
# #         credentialObjs = request.get_json()
# #         response = False
# #         for credentialObj in credentialObjs:
# #             print(credentialObj, file=sys.stderr)
# #             query_string = f"delete from snmp_credentials_table where  CREDENTIALS_ID = {credentialObj};"
# #             configs.db.execute(query_string)
# #             configs.db.commit()
# #             response = True
#
# #         if response:
# #             return "SNMP Credentails Deleted Successfully", 200
#
# #         else:
# #             return "Erro While Deleting SNMP Credentials", 500
#
# #     except Exception as e:
# #         print(f"in exception block Successfully", file=sys.stderr)
# #         print(str(e), file=sys.stderr)
# #         traceback.print_exc()
# #         return "Something Went Wrong!", 500
#
#
# # @app.route("/getSNMPV1V2Credentials", methods=["GET"])
# # def SNMPV2CredentialsForDiscovery():
# #     try:
# #         SNMPList = []
#
# #         results = Auto_Discovery_Credentails_Table.query.filter(
# #             Auto_Discovery_Credentails_Table.category == "v1/v2"
# #         ).all()
#
# #         for row in results:
# #             SNMPObj = {}
# #             SNMPObj["profile_name"] = row.profile_name
# #             SNMPObj["description"] = row.description
# #             SNMPObj["version"] = "v1/v2"
# #             SNMPObj["community"] = row.snmp_read_community
# #             SNMPObj["port"] = row.snmp_port
# #             SNMPObj["credentials_id"] = row.auto_credentials_id
#
# #             SNMPList.append(SNMPObj)
#
# #         return jsonify(SNMPList), 200
#
# #     except Exception as e:
# #         traceback.print_exc()
# #         return "Something Went Wrong!", 500
#
#
# # @app.route("/getSNMPV3CredentialsForDiscovery", methods=["GET"])
# # def SNMPV3CredentialsForDiscovery():
# #     try:
# #         SNMPList = []
#
# #         results = Auto_Discovery_Credentails_Table.query.filter(
# #             Auto_Discovery_Credentails_Table.category == "v3"
# #         ).all()
#
# #         for row in results:
# #             SNMPObj = {}
# #             SNMPObj["profile_name"] = row.profile_name
# #             SNMPObj["username"] = row.username
# #             SNMPObj["description"] = row.description
# #             SNMPObj["port"] = row.snmp_port
# #             SNMPObj["authentication_protocol"] = row.authentication_method
# #             SNMPObj["authentication_password"] = row.password
# #             SNMPObj["encryption_protocol"] = row.encryption_method
# #             SNMPObj["encryption_password"] = row.encryption_password
# #             SNMPObj["credentials_id"] = row.auto_credentials_id
# #             SNMPList.append(SNMPObj)
#
# #         return jsonify(SNMPList), 200
#
# #     except Exception as e:
# #         traceback.print_exc()
# #         return "Something Went Wrong!", 500
#
#
# @app.route("/getDiscoveryCredentialsCount", methods=["GET"])
# @token_required
# def GetSNMPV2Count(user_data):
#     try:
#         query_string = (
#             f"select count(*) from monitoring_credentials_table where category='v1/v2';"
#         )
#         v2Count = configs.db.execute(query_string).fetchone()
#         print(f"SNMP V1/V2 Credentials Count: {v2Count[0]}", file=sys.stderr)
#
#         query_string = (
#             f"select count(*) from monitoring_credentials_table where category='v3';"
#         )
#         v3Count = configs.db.execute(query_string).fetchone()
#         print(f"SNMP V3 Credentials Count: {v3Count[0]}", file=sys.stderr)
#
#         query_string = f"select count(*) from password_group_table;"
#         sshCount = configs.db.execute(query_string).fetchone()
#         print(f"SSH Credentials Count: {sshCount[0]}", file=sys.stderr)
#
#         cred_count = {
#             "snmp_v2": v2Count[0],
#             "snmp_v3": v3Count[0],
#             "login": sshCount[0],
#         }
#
#         return jsonify(cred_count), 200
#     except Exception as e:
#         traceback.print_exc()
#         print(e, file=sys.stderr)
#         return "Error", 500
