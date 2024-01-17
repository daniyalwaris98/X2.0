import ipaddress

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.schema.auto_discovery_schema import *
from app.models.atom_models import *
from app.api.v1.auto_discovery.auto_discovery_utils import *
from app.api.v1.auto_discovery import auto_discover
import threading
router = APIRouter(
    prefix="/auto_discovery",
    tags=["auto_discovery"],
)


@router.post("/add_network", responses={
    200: {"model": Response200},
    400: {"model": str},
    500: {"model": str}
},
summary="Use this API in auto discovery Network page on add network button to add a network. API is of Post method",
description = "Use this API in auto discovery Network page on add network button to add a network.API is of Post method"
)
async def add_network(network_obj: AddDiscoveryNetworkRequestSchema):
    try:
        msg, status = add_network_util(network_obj, False)
        return JSONResponse(content=msg, status_code=status)
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return JSONResponse(content="Server Error While Adding Network", status_code=500)


@router.post("/edit_network", responses={
    200: {"model": Response200},
    400: {"model": str},
    500: {"model": str}
},
summary="Use this API in Auto Discover Network page to edit a netowrk while editing Network Name and SUbnet is required but subnet is not editable.This API is of post method",
description="Use this API in Auto Discover Network page to edit a netowrk while editing Network Name and SUbnet is required but subnet is not editable.This API is of post method"
)
async def edit_network(network_obj: EditDiscoveryNetworkRequestSchema):
    try:
        msg, status = edit_network_util(network_obj)
        return JSONResponse(content=msg, status_code=status)
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return JSONResponse(content="Server Error While Updating Network", status_code=500)


@router.post("/add_networks", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
},
summary="Use this API in Auto Discovery Network Page on Import button to import excel file of networks.This API is of POST methods",
description="Use this API in Auto Discovery Network Page on Import button to import excel file of networks.This API is of POST methods"
)
async def add_networks(network_objs: list[AddDiscoveryNetworkRequestSchema]):
    try:
        data = []
        error_list = []
        success_list = []

        for networkObj in network_objs:
            response, status = add_network_util(networkObj, True)
            print("repsosne is::::::::",response,file=sys.stderr)
            print("status is::::::::::::::::::::::",status,file=sys.stderr)
            if isinstance(response,dict):
                for key,value in response.items():
                    if key == 'data':
                        data.append(value)
                    elif key=='message':
                            success_list.append(value)
            if status == 400:
                error_list.append(response)


        response_dict = {
            "data":data,
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


@router.get("/get_all_networks", responses={
    200: {"model": GetDiscoveryNetworkResponseSchema},
    500: {"model": str}
},
summary="Use this API in Auto Discovery Network page to get all netowkrs to list down in a table.This API is of GET method",
description="Use this API in Auto Discovery Network page to get all netowkrs to list down in a table.This API is of GET method"
)
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


@router.post("/delete_networks", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
},
summary="Use this API in Auto Discovery Network page to delete multiples networks based on there network_id.This API is of POST method and accepts of list of integers",
description="Use this API in Auto Discovery Network page to delete multiples networks based on there network_id.This API is of POST method and accepts of list of integers"
)
async def delete_networks(network_objs: list[int]):
    try:
        data = []
        success_ist = []
        error_ist = []

        row = 0
        for networkObj in network_objs:
            row = row + 1
            try:
                query_string = (f"select subnet from auto_discovery_network_table where "
                                f"network_id='{networkObj}';")
                subnet = configs.db.execute(query_string).fetchone()
                data.append(networkObj)
                if subnet is not None:
                    query_string = (f"delete from auto_discovery_network_table where "
                                    f"network_id='{networkObj}';")
                    configs.db.execute(query_string)
                    configs.db.commit()
                    # data.append(networkObj)
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
            "data":data,
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


@router.get("/get_subnets_dropdown", responses={
    200: {"model": list[str]},
    500: {"model": str}
},
summary="Use this API in Auto Discovery in Discovery page to list the subnet dropdown on network section on top of start scanninf devices.This API is of GET method ",
description="Use this API in Auto Discovery in Discovery page to list the subnet dropdown on network section on top of start scanninf devices.This API is of GET method "
)

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


def validate_ip_range(ip_range):
    pattern = r"^(\d{1,3}\.){3}\d{1,3}\-\d{1,3}$"
    if re.match(pattern, ip_range):
        index1 = ip_range.rfind("-")
        start = ip_range[:index1]

        index2 = start.rfind(".")
        end = start[: index2 + 1]

        end += ip_range[index1 + 1:]

        if int(ipaddress.IPv4Address(start)) > int(ipaddress.IPv4Address(end)):
            return None
        else:
            return {"start_ip": start, "end_ip": end}

    else:
        print("Invalid Ip Range Formate", file=sys.stderr)
        return None


@router.post("/auto_discover", responses={
    200: {"model": Response200},
    400: {"model": str},
    500: {"model": str}
},
summary="Use this API in Auto Discover Discovery page on start scanning devices button scan the subnet.This API is of post method",
description="Use this API in Auto Discover Discovery page on start scanning devices button scan the subnet.This API is of post method",
)
async def auto_discover_endpoint(subnet: RequestSubnetSchema):
    try:
        data = {}
        if str(subnet).lower() == "all":
            return JSONResponse("Select a subnet to scan", 400)

        network = configs.db.query(AutoDiscoveryNetworkTable).filter(
            AutoDiscoveryNetworkTable.subnet == subnet).first()

        if network is not None:
            results = auto_discover.get_range_inventory_data(
                network.subnet, network.excluded_ip_range
            )
            print("results for auto discovery inventroy data is:::::",results,file=sys.stderr)
        else:
            return JSONResponse("Subnet doesn't exit", 400)

        if results is None:
            return JSONResponse("Error While Scanning Subnet", 500)

        for host in results:
            print("host in result is:::::::::::::::::::",host,file=sys.stderr)
            discovery_obj = configs.db.query(AutoDiscoveryTable).filter(
                AutoDiscoveryTable.ip_address == host[0]).first()
            print("discovered obj is:::::::::",discovery_obj,file=sys.stderr)
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
                auto_discovery_dict = {
                    "discovery_id":discovery_obj.discovery_id,
                    "ip_address":discovery_obj.ip_address,
                    "subnet":discovery_obj.sunbet,
                    "os_type":discovery_obj.os_type,
                    "make_model":discovery_obj.make_model,
                    "function":discovery_obj.function,
                    "vendor":discovery_obj.vendor,
                    "snmp_status":discovery_obj.snmp_status,
                    "ssh_status":discovery_obj.ssh_status
                }
                data['data'] = auto_discovery_dict
                data['message'] = f"Successfully Inserted to Database for {host[0]}"
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
                auto_discovery_dict = {
                    "discovery_id": discovery_obj.discovery_id,
                    "ip_address": discovery_obj.ip_address,
                    "subnet": discovery_obj.subnet,
                    "os_type": discovery_obj.os_type,
                    "make_model": discovery_obj.make_model,
                    "function": discovery_obj.function,
                    "vendor": discovery_obj.vendor,
                    "snmp_status": discovery_obj.snmp_status,
                    "ssh_status": discovery_obj.ssh_status
                }
                data['data'] = auto_discovery_dict
                data['message'] = f"Successfully Updated to Database for {host[0]}"
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
            query_string = (f"select count(*) from auto_discovery_table where "
                            f"SUBNET='{network.subnet}';")
            print("query string is::::::::",query_string,file=sys.stderr)
            number_of_devices = configs.db.execute(query_string).fetchone()
            print("number of devices are:::::::",number_of_devices,file=sys.stderr)
            network.number_of_device = number_of_devices[0]
            print("network number of devices ae:::::::::::::",network.number_of_device,file=sys.stderr)
            UpdateDBData(network)

        return JSONResponse(content=data, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)


@router.post("/get_discovery_function_count", responses={
    200: {"model": DiscoveryFunctionCountResponseSchema},
    500: {"model": str}
},
summary="Use this API on Auto Discovery Discovery page to show the counts of devices on cards in network section algong start scanning device button['all',firewall,switches...]",
description="Use this API on Auto Discovery Discovery page to show the counts of devices on cards in network section algong start scanning device button['all',firewall,switches...]"
)
def get_discovery_function_count(subnet: RequestSubnetSchema):
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

            query_string = (f"select count(*) from auto_discovery_table where "
                            f"`FUNCTION`!='router' and `FUNCTION`!='switch' and "
                            f"`FUNCTION`!='firewall';")
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["other"] = row

        else:
            query_string = (
                f"select count(*) from auto_discovery_table where subnet = '{subnet}';"
            )
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["devices"] = row

            query_string = (f"select count(*) from auto_discovery_table where "
                            f"`FUNCTION`='firewall' and subnet = '{subnet}';")
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["firewall"] = row
            function_count["firewall"] = row

            query_string = (f"select count(*) from auto_discovery_table where "
                            f"`FUNCTION`='router' and subnet = '{subnet}';")
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["router"] = row

            query_string = (f"select count(*) from auto_discovery_table where "
                            f"`FUNCTION`='switch' and subnet = '{subnet}';")
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["switch"] = row

            query_string = (f"select count(*) from auto_discovery_table where "
                            f"`FUNCTION`!='router' and `FUNCTION`!='switch' "
                            f"and `FUNCTION`!='firewall' and subnet = '{subnet}';")
            row = configs.db.execute(query_string).fetchone()[0]
            function_count["other"] = row

        return JSONResponse(content=function_count, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)


@router.post("/get_discovery_data", responses={
    200: {"model": list[GetDiscoveryDataResponseSchema]},
    500: {"model": str}
},
summary="Use This API in Auto Discovery Discovery page to list down the discovery data in table based on the selected subnet this api is of post method",
description="Use This API in Auto Discovery Discovery page to list down the discovery data in table based on the selected subnet this api is of post method",
)
async def get_discovery_data(subnet: RequestSubnetSchema):
    try:
        response, status = get_discovery_data_util(subnet, None)
        print("response is:::::::::::::::::",response,file=sys.stderr)
        print("status is::::::::::::::::::::::::::",status,file=sys.stderr)
        return JSONResponse(content=response, status_code=status)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Discovery Data", status_code=500)


@router.post("/get_discovery_data_function", responses={
    200: {"model": list[GetDiscoveryDataResponseSchema]},
    500: {"model": str}
},
summary="use this API in AUto Discovery Discovery page to list down the data on table based on card click and its requires selected subnet in payload.This API is of POST methods",
description="use this API in AUto Discovery Discovery page to list down the data on table based on card click and its requires selected subnet in payload.This API is of POST methods",

)
async def get_function_discovery_data(data_obj: GetFunctionDiscoveryDataRequestSchema):
    try:
        data_obj['function'] = data_obj['function'].lower()
        if data_obj['function'] == "firewall" or data_obj['function'] == "router" or data_obj[
            'function'] == "switch":
            response, status = get_discovery_data_util(data_obj, data_obj['function'])
        else:
            try:
                if data_obj['subnet'].lower() != "all":
                    results = configs.db.query(AutoDiscoveryTable).filter(
                        AutoDiscoveryTable.subnet == data_obj['subnet']
                        and AutoDiscoveryTable.function != "firewall"
                        and AutoDiscoveryTable.function != "router"
                        and AutoDiscoveryTable.function != "switch"
                    ).all()
                else:
                    results = AutoDiscoveryTable.query.filter(
                        AutoDiscoveryTable.function != "firewall"
                        and AutoDiscoveryTable.function != "router"
                        and AutoDiscoveryTable.function != "switch"
                    ).all()

                response = []
                status = 200
                for data in results:
                    response.append(data.as_dict())

            except Exception:
                traceback.print_exc()
                response = "Server Error While Fetching Discovery Data"
                status = 500

        return JSONResponse(content=response, status_code=status)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Discovery Data", status_code=500)




# @router.get("/auto_discovery_function_count", responses={
#     200: {"model": AutoDiscoveryFunctionCountResponseSchema},
#     500: {"model": str}
# },
# summary="Use this API in Auto Discovery Discovery Page to display count in cards",
# description="Use this API in Auto Discovery Discovery Page to display count in cards"
# )
# async def auto_discovery_function_count():
#     try:
#         query_string = (f"SELECT `function`, COUNT(`function`) FROM auto_discovery_table "
#                         f"GROUP BY `function`;")
#         result = configs.db.execute(query_string)
#         obj_dict = {
#             "switches": 0,
#             "firewalls": 0,
#             "routers": 0,
#             "others": 0
#         }
#         for row in result:
#             if row[0] == "switch":
#                 obj_dict["switches"] = row[1]
#             elif row[0] == "firewall":
#                 obj_dict["firewalls"] = row[1]
#             elif row[0] == "router":
#                 obj_dict["routers"] = row[1]
#             else:
#                 obj_dict["others"] += row[1]
#
#         return JSONResponse(content=obj_dict, status_code=200)
#     except Exception:
#         traceback.print_exc()
#         return JSONResponse(content="Server Error While Fetching Data", status_code=500)


@router.get("/get_manage_devices", responses={
    200: {"model": list[GetDiscoveryDataResponseSchema]},
    500: {"model": str}
},
summary="Use this API in Auto Discovery Manage Devices page to list down all the devices in table.This API is of GET method",
description="Use this API in Auto Discovery Manage Devices page to list down all the devices in table.This API is of GET method"
)
async def get_manage_devices():
    try:
        results = configs.db.query(AutoDiscoveryTable).all()
        obj_list = []

        for row in results:
            obj_list.append(row.as_dict())

        return obj_list

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error While Fetching Data", status_code=500)


@router.get("/check_credentials_status",
            responses={
                200:{"model":str},
                500:{"model":str}
            },
            summary="Use this API in Auto Discovery Manage devices page on fetch button.This API is of GET method",
            description="Use this API in Auto Discovery Manage devices page on fetch button.This API is of GET method"
            )
async def check_credential_status():
    try:
        ssh_threading = threading.Thread(target=CheckSSHStatus)
        print("snmp threading is::::::::::::::::::::::",ssh_threading,file=sys.stderr)
        ssh_threading.start()

        snmp_thread = threading.Thread(target=CheckSNMPCredentials)
        print("snmp threading is:::::",snmp_thread,file=sys.stderr)
        snmp_thread.start()

        ssh_threading.join()
        snmp_thread.join()
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Getting Checking Credential Status",status_code=500)



@router.post('/add_snmp_v1_v2_credentials',
             responses={
                 200:{"model":Response200},
                 400:{"model":str},
                 500:{"model":str}
             },
             summary="Use this API in Auto Discovery Manage Credentials page to add snmp v1/v2 credentisls.This API is of post method",
             description="Use this API in Auto Discovery Manage Credentials page to add snmp v1/v2 credentisls.This API is of post method"
             )
def add_v1_v2_snmp_credentials(credentialObj: AddSnmpV1_V2Schema):
    try:
        data = {}
        credentials = SNMP_CREDENTIALS_TABLE()
        v1v2_credentials = dict(credentialObj)
        profile_name = v1v2_credentials['profile_name']
        if configs.db.query(SNMP_CREDENTIALS_TABLE).filter_by(profile_name=profile_name).first():
                return JSONResponse(content={"message": "Duplicate Entry"}, status_code=400)

        community = v1v2_credentials['community']
        description = v1v2_credentials['description']
        port = v1v2_credentials['port']
        credentials.profile_name = profile_name
        credentials.snmp_read_community = community
        credentials.description = description
        credentials.snmp_port = port
        credentials.category = "v1/v2"
        InsertDBData(credentials)

        snmp_dict = {
                "profile_name": credentials.profile_name,
                "community": credentials.snmp_read_community,
                "description": credentials.description,
                "port": credentials.snmp_port,
                "category": credentials.category
        }
        message = f"{credentials.profile_name} : Inserted Successfully"
        data['data'] = snmp_dict
        data['message'] = message
        return JSONResponse(content=data,status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Adding SNMP V1/V2 Credentials",status_code=500)



@router.post("/add_snmp_v3_credentials",
             responses={
                 200:{"model":Response200},
                 400:{"model":str},
                 500:{"model":str}
             },
             summary="Use this API in Auto Discovery manage credentials page o ad snmp v3 credentials.this api is of post method",
             description="Use this API in Auto Discovery manage credentials page o ad snmp v3 credentials.this api is of post method"
             )
def add_snmp_v3_credentials(credentialObj: AddSnmpV3Schema):
    try:
        data = {}
        credentials = SNMP_CREDENTIALS_TABLE()
        v3_credentials = dict(credentialObj)
        print("v3 credentials are::::::::::::::::::::::",v3_credentials,file=sys.stderr)
        username = v3_credentials['username']
        if configs.db.query(SNMP_CREDENTIALS_TABLE).filter_by(username=username).first():
            return JSONResponse(content="Duplicate entry", status_code=400)

        description = v3_credentials['description']
        username = v3_credentials['username']
        port = v3_credentials['port']
        authorization_protocol = v3_credentials['authorization_protocol']
        authorization_password = v3_credentials['authorization_password']
        encryption_protocol = v3_credentials['encryption_protocol']
        encryption_password = v3_credentials['encryption_password']
        credentials.description = description
        credentials.username = username
        credentials.snmp_port = port
        credentials.authentication_method = authorization_protocol
        credentials.password = authorization_password
        credentials.encryption_method = encryption_protocol
        credentials.encryption_password = encryption_password
        credentials.category = "v3"
        InsertDBData(credentials)

        snmp_dict = {
            "profile_name": credentials.profile_name,
            "username": credentials.profile_name,
            "community": credentials.snmp_read_community,  # Check if this field is required
            "description": credentials.description,
            "port": credentials.snmp_port,
            "category": credentials.category,

        }
        message = f"{credentials.username} : Inserted Successfully"
        data['data'] = snmp_dict
        data['message'] = message
        return JSONResponse(content=data,status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While adding snmp v3 credentials",status_code=500)











@router.post("/delete_snmp_credentials",
             responses={
                 200:{"model":DeleteResponseSchema},
                 400:{"model":str},
                 500:{"model":str}
             },
             summary="Use this API to delete auto discovery page to delete snmp credentials v1/v2/v3 based on the ids.This API is of POST method",
             description="Use this API to delete auto discovery page to delete snmp credentials v1/v2/v3 based on the ids.This API is of POST method"
             )
def delete_snmp_credentials(credential_id:list[int]):
    try:
        data =[]

        success_list = []
        error_list = []
        print("credentials ids are;",credential_id,file=sys.stderr)
        snmp_credentials =credential_id
        for credentials in snmp_credentials:
            credentials_exsist = configs.db.query(SNMP_CREDENTIALS_TABLE).filter_by(credentials_id = credentials).first()
            if credentials_exsist:
                DeleteDBData(credentials_exsist)
                message = f"{credentials} : Deleted Successfully"
                data.append(credentials)
                success_list.append(message)

            else:
                error_list.append(f"{credentials} : Not Found")

        response = {
            "data": data,
            "success": len(success_list),
            "error": len(error_list),
            "success_list": success_list,
            "error_list": error_list,
        }
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Deleteting SNMP Credentials",status_code=500)

@router.get("/get_snmp_v1_v2_credentials",
            responses={
                200:{"model":GetSnmpV1V2Schema},
                500:{"model":str}
            },
            summary="Use This API to in Auto Discovery Manage Credentials Page to list down all snmp v1/v2 credentials",
            description="Use This API to in Auto Discovery Manage Credentials Page to list down all snmp v1/v2 credentials"
            )
def get_snmp_v1_v2_credentials():
    try:
        snmp_lst = []
        snmpObj = configs.db.query(SNMP_CREDENTIALS_TABLE).filter_by(category = 'v1/v2').all()
        for cred in snmpObj:
            credentials = {
                "credentials_id":cred.credentials_id,
                "category":cred.category,
                "profile_name":cred.profile_name,
                "description":cred.description,
                "community":cred.snmp_read_community,
                "port":cred.snmp_port
            }
            snmp_lst.append(credentials)
        return JSONResponse(content=snmp_lst,status_code=200)
    except Exception as e:
        traceback.print_exc()
        return  JSONResponse(conten = "Error Occured While Getting SNMP V1 And V2",status_code=500)


@router.get("/get_snmp_v3_credentials",
            responses={
                200:{"model":GetSnmpV3Schema},
                500:{"model":str}
            },
            summary="Use This API in Auto Discovery Manage credentials page to list down snmp v3 in tables",
            description="Use This API in Auto Discovery Manage credentials page to list down snmp v3 in tables"
            )
def get_snmp_v3_credentials():
    try:
        snmp_lst = []
        snmpObj = configs.db.query(SNMP_CREDENTIALS_TABLE).filter_by(category = 'v3').all()
        for cred in snmpObj:
            credentials = {
                "credentials_id":cred.credentials_id,
                "category":cred.category,
                "profile_name":cred.profile_name,
                "description":cred.description,
                "community":cred.snmp_read_community,
                "port":cred.snmp_port,
                "user_name":cred.username,
                "authentication_protocol":cred.authentication_method,
                "authentication_password":cred.password,
                "encryption_protocol":cred.encryption_method,
                "encryption_password":cred.encryption_password

            }
            snmp_lst.append(credentials)
        return JSONResponse(content=snmp_lst,status_code=200)
    except Exception as e:
        traceback.print_exc()
        return  JSONResponse(conten = "Error Occured While Getting SNMP V1 And V2",status_code=500)



@router.get('/get_snmp_and_ssh_count',
            responses={
                200:{"model":str},
                500:{"model":str}
            },
summary="Use this api in Auto Discovery Manage credentials page to show credentials count of SNMP V1,V2 and SSH login ",
description="Use this api in Auto Discovery Manage credentials page to show credentials count of SNMP V1,V2 and SSH login "
)
def GetSNMPV2Count(user_data):
    try:
        queryString = f"select count(*) from snmp_credentials_table where category='v1/v2';"
        v2Count = configs.db.execute(queryString).fetchone()
        print(f"SNMP V1/V2 Credentials Count: {v2Count[0]}", file=sys.stderr)

        queryString = f"select count(*) from snmp_credentials_table where category='v3';"
        v3Count = configs.db.execute(queryString).fetchone()
        print(f"SNMP V3 Credentials Count: {v3Count[0]}", file=sys.stderr)

        queryString = f"select count(*) from password_group_table;"
        sshCount = configs.db.execute(queryString).fetchone()
        print(f"SSH Credentials Count: {sshCount[0]}", file=sys.stderr)

        cred_count = {
            'snmp_v1_v2': v2Count[0],
            'snmp_v3': v3Count[0],
            'ssh_login': sshCount[0]
        }

        return JSONResponse(content=cred_count,status_code=200)
    except Exception as e:
        traceback.print_exc()
        print(e, file=sys.stderr)
        return "Error", 500








@router.get('/get_ssh_login_credentials',
            responses={
                200:{"model":list[GetSSHLoginSchema]},
                500:{"model":str}
            },
            summary="use this api in auto discovery manage credentials to listdown the ssh login in table",
            description="use this api in auto discovery manage credentials to listdown the ssh login in table"
            )
def ssh_login_credentials():
    try:
        ssh_lst = []
        ssh_login = configs.db.query(PasswordGroupTable).filter_by(password_group_type = 'SSH').all()
        for row in ssh_login:
            ssh_dict = {
                "password_group_id":row.password_group_id,
                "password_group":row.password_group,
                "password_group_type":row.password_group_type,
                "username":row.username,
                "password":row.password
            }
            ssh_lst.append(ssh_dict)
        return JSONResponse(content=ssh_lst,status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error While getting ssh login credentials",status_code=500)










# # @app.route("/getSNMPV1V2Credentials", methods=["GET"])
# # def SNMPV2CredentialsForDiscovery():
# #     try:
# #         SNMPList = []
#
# #         results = Auto_Discovery_Credentials_Table.query.filter(
# #             Auto_Discovery_Credentials_Table.category == "v1/v2"
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
# #         results = Auto_Discovery_Credentials_Table.query.filter(
# #             Auto_Discovery_Credentials_Table.category == "v3"
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
#@app.route('/addSNMPCredentials', methods=['POST'])
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
# #             return "SNMP Credentials Deleted Successfully", 200
#
# #         else:
# #             return "Error While Deleting SNMP Credentials", 500
#
# #     except Exception as e:
# #         print(f"in exception block Successfully", file=sys.stderr)
# #         print(str(e), file=sys.stderr)
# #         traceback.print_exc()
# #         return "Something Went Wrong!", 500
##
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
#             results = AutoDiscoveryTable.query.filter(
#                 AutoDiscoveryTable.subnet == subnet
#                 and AutoDiscoveryTable.function != "firewall"
#                 and AutoDiscoveryTable.function != "router"
#                 and AutoDiscoveryTable.function != "switch"
#             ).all()
#         else:
#             results = AutoDiscoveryTable.query.filter(
#                 AutoDiscoveryTable.function != "firewall"
#                 and AutoDiscoveryTable.function != "router"
#                 and AutoDiscoveryTable.function != "switch"
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

@router.post('/edit_snmp_v1_v2_credentials',responses={
    200:{"model":str},
    400:{"model":str},
    500:{"model":str}
},
description="API to edit the  snmp v1_v2 credentials",
summary="API to edit the  snmp v1_v2 credentials"
)
def edit_snmp_v1_v2_credentials(v2_data:EditSnmpV2RequestSchema):
    try:
        data_dict = {}
        v2_data = dict(v2_data)
        v2_exsists = configs.db.query(SNMP_CREDENTIALS_TABLE).filter_by(credentials_id = v2_data['credentials_id']).first()
        if v2_exsists:
            v2_exsists.profile_name = v2_data['profile_name']
            v2_exsists.description = v2_data['description']
            v2_exsists.port = v2_exsists['port']
            v2_exsists.snmp_read_community = v2_data['community']
            data ={
                "credentials_id":v2_exsists.monitoring_credentials_id,
                "profile_name":v2_exsists.profile_name,
                "description":v2_exsists.description,
                "port":v2_exsists.port,
                "community":v2_exsists.snmp_read_community,
                "monitoring_credentials_id":v2_exsists.monitoring_credentials_id
            }
            message = f"{v2_exsists.profile_name} : Updated Successfully"
            data_dict['data'] = data
        else:
            return JSONResponse(content=f"{v2_data['credentials_id']} : Not Found",status_code=400)

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Updting the SNMP v1_v2 credentials",status_code=500)


@router.post('/edit_snmp_v3_credentials',responses={
    200:{"model":str},
    400:{"model":str},
    500:{"model":str}
},
description="API to edit the  snmp v1_v2 credentials",
summary="API to edit the  snmp v1_v2 credentials"
)
def edit_snmp_v3_credentials(v3_data:EditSnmpV3RequestSchema):
    try:
        data_dict = {}
        v3_data = dict(v3_data)
        v3_exsists = configs.db.query(SNMP_CREDENTIALS_TABLE).filter_by(monitoring_credentials_id = v3_data['credentials_id']).first()
        if v3_exsists:
            v3_exsists.username = v3_data['username']
            v3_exsists.authentication_password = v3_data['authentication_password']
            v3_exsists.encryption_password = v3_data['encryption_password']
            v3_exsists.authentication_protocol = v3_data['authentication_protocol']
            v3_exsists.encryption_protocol = v3_data['encryption_protocol']
            data ={
                "credentials_id":v3_exsists.monitoring_credentials_id,
                "username":v3_exsists.username,
                "authentication_password":v3_exsists.authentication_password,
                "encryption_password":v3_exsists.encryption_password,
                "authentication_protocol":v3_exsists.authentication_protocol,
                "encryption_protocol":v3_exsists.encryption_protocol
            }
            message = f"{v3_exsists.profile_name} : Updated Successfully"
            data_dict['data'] = data
            data_dict['messgae'] = message
        else:
            return JSONResponse(content=f"{v3_exsists['credentials_id']} : Not Found",status_code=400)

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Updting the SNMP v1_v2 credentials",status_code=500)