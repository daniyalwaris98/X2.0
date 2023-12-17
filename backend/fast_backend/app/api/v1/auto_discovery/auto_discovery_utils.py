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
        data = {}
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
                data_dict = {
                    "network_id": network.network_id,
                    "network_name": network.network_name,
                    "scan_status": network.scan_status,
                    "excluded_ip_range": network.excluded_ip_range
                }
                msg = f"{network_obj['network_name']} : Network Updated Successfully"
                data['data'] = data_dict
                data['message'] = msg
                status = 200
            else:

                msg = f"{network_obj['network_name']} : Error While Updating Network"
                status = 500
        else:
            if InsertDBData(network) == 200:
                data_dict = {
                    "network_id": network.network_id,
                    "network_name": network.network_name,
                    "scan_status": network.scan_status,
                    "excluded_ip_range": network.excluded_ip_range
                }
                msg = f"{network_obj['network_name']} : Network Inserted Successfully"
                data['data'] = data_dict
                data['message'] = msg
                status = 200
            else:
                msg = f"{network_obj['network_name']} : Error While Inserting Network"
                status = 500

        print(msg, file=sys.stderr)
        return data, status

    except Exception:
        traceback.print_exc()
        return "Server Error While Adding Discovery Network", 500


def edit_network_util(network_obj):
    try:
        data = {}

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
            data_dict = {
                "network_id": network.network_id,
                "network_name": network.network_name,
                "scan_status": network.scan_status,
                "excluded_ip_range": network.excluded_ip_range
            }
            msg = f"{network_obj['network_name']} : Network Updated Successfully"
            data['data'] = data_dict
            data['message'] = msg
            status = 200
        else:
            msg = f"{network_obj['network_name']} : Error While Updating Network"
            status = 500

        print(msg, file=sys.stderr)
        return data, status

    except Exception:
        traceback.print_exc()
        return "Server Error While Updating Discovery Network", 500


def get_discovery_data_util(subnet, function):
    obj_list = []
    try:
        if str(subnet).lower() != "all":
            if function is None:
                results = configs.db.query(AutoDiscoveryTable).filter(
                    AutoDiscoveryTable.subnet == subnet).all()
                print("result is::::::::::::::::::::::auto discovery table is",results,file=sys.stderr)
            else:
                results = configs.db.query(AutoDiscoveryTable).filter(
                    AutoDiscoveryTable.subnet == subnet and AutoDiscoveryTable.function == function
                ).all()
                print("result is::::::::::::::::::",results,file=sys.stderr)
        else:
            if function is None:
                results = configs.db.query(AutoDiscoveryTable).all()
                print("result is:::::::::::::::::::::",results,file=sys.stderr)
            else:
                results = configs.db.query(AutoDiscoveryTable).filter(
                    AutoDiscoveryTable.function == function).all()

        for data in results:
            print("data is:::::::::::::::::::::",data,file=sys.stderr)
            obj_list.append(data.as_dict())

        return obj_list, 200

    except Exception:
        traceback.print_exc()
        return "Server Error While Fetching Discovery Data", 500
