import sys
import traceback
from datetime import datetime

from app.models.auto_discovery_models import *
from app.utilities.db_utils import *



def FormatDate(date):
    result = datetime(2000, 1, 1)
    
    try:
        if date is not None:
            result = date.strftime('%d-%m-%Y')
    except Exception:
        traceback.print_exc()

    return result


def ValidSubnet(subnet):
    return True

def AddNetwork(networkObj, row, update):
    try:
        
        if 'network_name' not in networkObj:
            return f"Row {row} : Network Name Can Not Be Empty", 500
    
        if networkObj['network_name'] is None:
            return f"Row {row} : Network Name Can Not Be Empty", 500
        
        networkObj['network_name'] = networkObj['network_name'].strip()
        if networkObj['network_name'] == "":
            return f"Row {row} : Network Name Can Not Be Empty", 500
        
        if 'subnet' not in networkObj:
            return f"{networkObj['network_name']} : Subnet Can Not Be Empty", 500
    
        if networkObj['subnet'] is None:
            return f"{networkObj['network_name']} : Subnet Can Not Be Empty", 500
        
        networkObj['subnet'] = networkObj['subnet'].strip()
        if networkObj['subnet'] == "":
            return f"{networkObj['network_name']} : Subnet Can Not Be Empty", 500
        
        if ValidSubnet(networkObj['subnet']) is False:
            return f"{networkObj['network_name']} : Subnet Pattern Is Not Valid", 500
        
        if not update:

            network_exist = Auto_Discovery_Network_Table.query.filter_by(network_name=networkObj['network_name']).first()
            if network_exist is not None:
                return f"{networkObj['network_name']} : Network Name Already Assigned", 500

            subnet_exist = Auto_Discovery_Network_Table.query.filter_by(subnet=networkObj['subnet']).first()
            if subnet_exist is not None:
                return f"{networkObj['network_name']} : Subnet Already Exists - {networkObj['subnet']}", 500
        
        
        if 'scan_status' not in networkObj.keys():
           networkObj['scan_status'] = "InActive"
        elif networkObj['scan_status'].lower() == 'inactive':
            networkObj['scan_status'] = "InActive"
        else:
            networkObj['scan_status'] = "Active"

        exist = True
        network = Auto_Discovery_Network_Table.query.filter_by(network_name=networkObj['network_name'], subnet=networkObj['subnet']).first()
        if network is None:
            exist = False
            network = Auto_Discovery_Network_Table()
            network.network_name = networkObj['network_name']
            network.subnet = networkObj['subnet']
        
        network.scan_status = networkObj['scan_status']
        
        if 'excluded_ip_range' in networkObj:
            if networkObj['excluded_ip_range'] is None:
                network.excluded_ip_range = "No Exclusion"
            elif networkObj['excluded_ip_range'].strip() == "":
                network.excluded_ip_range = "No Exclusion"
            else:
                network.excluded_ip_range = networkObj['excluded_ip_range'].strip()
        else:
            network.excluded_ip_range = "No Exclusion"

        msg = ""
        status = 500
        if exist:
            if UpdateDBData(network) == 200:
                msg = f"{networkObj['network_name']} : Network Updated Successfully"
                status = 200
            else:
                msg = f"{networkObj['network_name']} : Error While Updating Network"
                status = 500
        else:
            if InsertDBData(network) == 200:
                msg = f"{networkObj['network_name']} : Network Inserted Successfully"
                status = 200
            else:
                msg = f"{networkObj['network_name']} : Error While Inserting Network"
                status = 500

        print(msg, file=sys.stderr)
        return msg, status
        
    except Exception:
        traceback.print_exc()
        return "Server Error", 500