import re
import sys
import traceback
from datetime import datetime

from app.models.auto_discovery_models import *
from app.utils.db_utils import *


def validate_subnet(subnet):
    subnet_pattern = r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/\d{1,2}$'

    # Use the re.match function to check if the input matches the pattern
    if re.match(subnet_pattern, subnet):
        return True
    else:
        return False


def check_network_id(network_obj):
    network_exist = (configs.db.query(AutoDiscoveryNetworkTable)
                     .filter(AutoDiscoveryNetworkTable.network_id == network_obj['network_id'])
                     .first())

    return network_exist, 200


def check_network_name(network_obj):
    network_obj['network_name'] = network_obj['network_name'].strip()
    if network_obj['network_name'] == "":
        return f"Network Name Can Not Be Empty", 400

    network_exist = configs.db.query(AutoDiscoveryNetworkTable).filter(
        AutoDiscoveryNetworkTable.network_name == network_obj['network_name']).first()

    return network_exist, 200


def check_subnet(network_obj):
    network_obj['subnet'] = network_obj['subnet'].strip()
    if network_obj['subnet'] == "":
        return f"{network_obj['network_name']} : Subnet Can Not Be Empty", 400

    if validate_subnet(network_obj['subnet']) is False:
        return f"{network_obj['network_name']} : Subnet Pattern Is Not Valid", 400

    subnet_exist = configs.db.query(AutoDiscoveryNetworkTable).filter(
        AutoDiscoveryNetworkTable.subnet == network_obj['subnet']).first()

    return subnet_exist, 200


def add_network_util(network_obj, update):
    try:

        network, status = check_network_name(network_obj)
        if status != 200:
            return network, status

        subnet, status = check_subnet(network_obj)
        if status != 200:
            return subnet, status

        exist = False
        if network is not None:
            exist = True
            if not update:
                return f"{network_obj['network_name']} : Network Name Already Assigned", 400

            if subnet is not None:
                if network.subnet != subnet.subnet:
                    return f"{network_obj['network_name']} : Subnet Already Exists - {network_obj['subnet']}", 400
        else:
            if subnet is not None:
                return f"{network_obj['network_name']} : Subnet Already Exists - {network_obj['subnet']}", 400

            network = AutoDiscoveryNetworkTable()
            network.network_name = network_obj['network_name']

        network.subnet = network_obj['subnet']

        if network_obj['scan_status'] is None:
            network_obj['scan_status'] = "InActive"
        elif str(network_obj['scan_status']).lower() == 'inactive':
            network_obj['scan_status'] = "InActive"
        else:
            network_obj['scan_status'] = "Active"

        network.scan_status = network_obj['scan_status']

        if network_obj['excluded_ip_range'] is None:
            network.excluded_ip_range = "No Exclusion"
        elif network_obj['excluded_ip_range'].strip() == "":
            network.excluded_ip_range = "No Exclusion"
        else:
            network.excluded_ip_range = network_obj['excluded_ip_range'].strip()

        if exist:
            if UpdateDBData(network) == 200:
                msg = f"{network_obj['network_name']} : Network Updated Successfully"
                status = 200
            else:
                msg = f"{network_obj['network_name']} : Error While Updating Network"
                status = 500
        else:
            if InsertDBData(network) == 200:
                msg = f"{network_obj['network_name']} : Network Inserted Successfully"
                status = 200
            else:
                msg = f"{network_obj['network_name']} : Error While Inserting Network"
                status = 500

        print(msg, file=sys.stderr)
        return msg, status

    except Exception:
        traceback.print_exc()
        return "Server Error While Adding Discovery Network", 500


def edit_network_util(network_obj):
    try:

        network, status = check_network_id(network_obj)

        network_name, status = check_network_name(network_obj)
        if status != 200:
            return network_name, status

        subnet, status = check_subnet(network_obj)
        if status != 200:
            return subnet, status

        if network is not None:
            if network_name is not None:
                if network.network_id != network_name.network_id:
                    return f"{network_obj['network_name']} : Network Name Already Assigned", 400

            if subnet is not None:
                if network.subnet != subnet.subnet:
                    return f"{network_obj['network_name']} : Subnet Already Exists - {network_obj['subnet']}", 400
        else:
            return f"Network Not Found", 400

        network.network_name = network_obj['network_name']
        network.subnet = network_obj['subnet']

        if network_obj['scan_status'] is None:
            network_obj['scan_status'] = "InActive"
        elif str(network_obj['scan_status']).lower() == 'inactive':
            network_obj['scan_status'] = "InActive"
        else:
            network_obj['scan_status'] = "Active"

        network.scan_status = network_obj['scan_status']

        if network_obj['excluded_ip_range'] is None:
            network.excluded_ip_range = "No Exclusion"
        elif network_obj['excluded_ip_range'].strip() == "":
            network.excluded_ip_range = "No Exclusion"
        else:
            network.excluded_ip_range = network_obj['excluded_ip_range'].strip()

        if UpdateDBData(network) == 200:
            msg = f"{network_obj['network_name']} : Network Updated Successfully"
            status = 200
        else:
            msg = f"{network_obj['network_name']} : Error While Updating Network"
            status = 500

        print(msg, file=sys.stderr)
        return msg, status

    except Exception:
        traceback.print_exc()
        return "Server Error While Updating Discovery Network", 500
#
#
# def GetDiscoveryData(subnetObj, function):
#     objList = []
#     try:
#
#         if "subnet" not in subnetObj:
#             return "Subnet Not Found", 500
#
#         if subnetObj["subnet"] is None:
#             return "Subnet Not Found", 500
#
#         subnet = subnetObj['subnet']
#
#         results = None
#         if subnet != "All":
#             if function is None:
#                 results = Auto_Discovery_Table.query.filter(Auto_Discovery_Table.subnet == subnet).all()
#             else:
#                 results = Auto_Discovery_Table.query.filter(Auto_Discovery_Table.subnet == subnet and Auto_Discovery_Table.function == function).all()
#         else:
#             if function is None:
#                 results = Auto_Discovery_Table.query.all()
#             else:
#                 results = Auto_Discovery_Table.query.filter(Auto_Discovery_Table.function == function).all()
#
#         if results is None:
#             return objList, 200
#
#         for data in results:
#             objDict = data.as_dict()
#             objList.append(objDict)
#
#     except Exception:
#         traceback.print_exc()
#
#     return objList, 200
