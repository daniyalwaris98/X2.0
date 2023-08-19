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


def ValidateSubnet(subnet):
    return True

def CheckNetworkID(networkObj):
    if 'network_id' not in networkObj:
        return f"Network ID Is Missing", 500

    if networkObj['network_id'] is None:
        return f"Network ID Is Missing", 500

    network_exist = Auto_Discovery_Network_Table.query.filter_by(network_id=networkObj['network_id']).first()
    
    return network_exist, 200

def CheckNetworkName(networkObj):
    if 'network_name' not in networkObj:
        return f"Network Name Can Not Be Empty", 500

    if networkObj['network_name'] is None:
        return f"Network Name Can Not Be Empty", 500
    
    networkObj['network_name'] = networkObj['network_name'].strip()
    if networkObj['network_name'] == "":
        return f"Network Name Can Not Be Empty", 500
    
    network_exist = Auto_Discovery_Network_Table.query.filter_by(network_name=networkObj['network_name']).first()
    
    return network_exist, 200

def CheckSubnet(networkObj):
    if 'subnet' not in networkObj:
        return f"{networkObj['network_name']} : Subnet Can Not Be Empty", 500

    if networkObj['subnet'] is None:
        return f"{networkObj['network_name']} : Subnet Can Not Be Empty", 500
    
    networkObj['subnet'] = networkObj['subnet'].strip()
    if networkObj['subnet'] == "":
        return f"{networkObj['network_name']} : Subnet Can Not Be Empty", 500
    
    if ValidateSubnet(networkObj['subnet']) is False:
        return f"{networkObj['network_name']} : Subnet Pattern Is Not Valid", 500
    
    subnet_exist = Auto_Discovery_Network_Table.query.filter_by(subnet=networkObj['subnet']).first()
            
    return subnet_exist, 200


def AddNetwork(networkObj, update):
    try:
        
        network, status = CheckNetworkName(networkObj)
        if status == 500:
            return network, status
        
        subnet, status = CheckSubnet(networkObj)
        if status == 500:
            return subnet, status
        
        exist = False
        if network is not None:
            exist = True
            if not update:
                return f"{networkObj['network_name']} : Network Name Already Assigned", 500

            if subnet is not None:
                if network.subnet != subnet.subnet:
                    return f"{networkObj['network_name']} : Subnet Already Exists - {networkObj['subnet']}", 500
        else:
            if subnet is not None:
                return f"{networkObj['network_name']} : Subnet Already Exists - {networkObj['subnet']}", 500
            
            network = Auto_Discovery_Network_Table()
            network.network_name = networkObj['network_name']
        
        
        if 'scan_status' not in networkObj.keys():
           networkObj['scan_status'] = "InActive"
        elif networkObj['scan_status'].lower() == 'inactive':
            networkObj['scan_status'] = "InActive"
        else:
            networkObj['scan_status'] = "Active"

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


def EditNetwork(networkObj):
    try:
        
        network, status = CheckNetworkID(networkObj)
        if status == 500:
            return network, status
        
        network_name, status = CheckNetworkName(networkObj)
        if status == 500:
            return network_name, status
        
        subnet, status = CheckSubnet(networkObj)
        if status == 500:
            return subnet, status
        
        if network is not None:
            if network_name is not None:
                if network.network_id != network_name.network_id:
                    return f"{networkObj['network_name']} : Network Name Already Assigned", 500

            if subnet is not None:
                if network.subnet != subnet.subnet:
                    return f"{networkObj['network_name']} : Subnet Already Exists - {networkObj['subnet']}", 500
        else:
            return f"Network Not Found", 500
            
        network.network_name = networkObj['network_name']
        
        if 'scan_status' not in networkObj.keys():
           networkObj['scan_status'] = "InActive"
        elif networkObj['scan_status'].lower() == 'inactive':
            networkObj['scan_status'] = "InActive"
        else:
            networkObj['scan_status'] = "Active"

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

    
def GetDiscoveryData(subnetObj, function):
    objList = []
    try:
        
        if "subnet" not in subnetObj:
            return "Subnet Not Found", 500

        if subnetObj["subnet"] is None:
            return "Subnet Not Found", 500
        
        subnet = subnetObj['subnet']
        
        results = None
        if subnet != "All":
            if function is None:
                results = Auto_Discovery_Table.query.filter(Auto_Discovery_Table.subnet == subnet).all()
            else:
                results = Auto_Discovery_Table.query.filter(Auto_Discovery_Table.subnet == subnet and Auto_Discovery_Table.function == function).all()
        else:
            if function is None:
                results = Auto_Discovery_Table.query.all()
            else:
                results = Auto_Discovery_Table.query.filter(Auto_Discovery_Table.function == function).all()    
        
        if results is None:
            return objList, 200
        
        for data in results:
            objDict = data.as_dict()
            objList.append(objDict)
            
    except Exception:
        traceback.print_exc()
    
    return objList, 200
