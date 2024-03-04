import traceback
import sys
from fastapi import APIRouter, Depends
from fastapi import Request
#from aws_test.utils import *
from app.api.v1.cloud_monitoring.utils.aws_test.ec2 import ec2Driver
from app.schema.cloud_monitoring_schema.aws_schema import *
account_details = {
    'aws_access_key_id':'AKIAX2MUDQMLR6Y4PJW3',
    'aws_secret_access_key':'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',
    'region_name':'eu-west-2'
}

router = APIRouter(prefix="/aws_services", tags=["aws_services"])

# Screen - AWS-EC2

@router.get('/list_of_all_ec2_instances', description="Get All Instance Details")
def list_of_all_ec2_instances(service_name: str = "ec2") -> dict:
    obj = ec2Driver(**account_details)
    list_of_instance = obj.list_all_instances(service_name = service_name)
    #store
    return {"data":list_of_instance, "count":len(list_of_instance),"success":1}



@router.post('/aws_discovery_services', description="Discovery of AWS Services with Count")
def aws_discovery_services(account_data:AwsCredentialsResponseSchema, request: Request) -> dict:
    try:
        account_data_obj = dict(account_data)
        obj = ec2Driver(**account_data_obj)
        list_of_instance = obj.auto_discovery(request)
        print("list of instance is:::::::::::::::::::",list_of_instance,file=sys.stderr)

        return {"data":list_of_instance}
    except Exception as e:
        traceback.print_exc()

# for S3 Buckets 
@router.get('/list_of_all_s3_buckets', description="Get All S3 Buckets with Details")
def list_of_all_s3_buckets(service_name: str = "s3") -> dict:
    obj = ec2Driver(**account_details)
    list_of_all_buckets = obj.list_all_s3_buckets(service_name = service_name)
    #store into db
    return {"data":list_of_all_buckets, "count":len(list_of_all_buckets),"success":1}

# for load balancer

@router.get('/list_of_all_load_balancers', description="Get All Load Balancers with Details")
def list_of_all_load_balancers(service_name: str = "elbv2")-> dict:
    obj = ec2Driver(**account_details)
    list_of_all_lbs = obj.list_all_load_balancers(service_name = service_name)
    return {"data":list_of_all_lbs, "count":len(list_of_all_lbs),"success":1}


#for VPC Service Click on Dashboard
@router.get('/vpc_services_discovery', description="Get VPC Service Count")
def list_of_vpc_services_discovery() -> dict:
    obj = ec2Driver(**account_details)
    list_of_all_vpc_security = obj.vpc_service_discovery()
    return {"data":list_of_all_vpc_security, "count":len(list_of_all_vpc_security),"success":1}


# for showing the list of site to site VPNs with details page
@router.get('/list_of_all_site_to_site_vpns', description="Get All Site to Site VPNs with Details")
def list_of_site_to_site_vpn() -> dict:
    obj = ec2Driver(**account_details)
    all_site_to_site_vpn_connections = obj.get_all_site_to_site_vpn_connections()
    return {"data":all_site_to_site_vpn_connections, "count":len(all_site_to_site_vpn_connections),"success":1}

# for showing the list of security groups with details 
@router.get('/list_of_all_security_groups', description="Get All Security Groups with Details")
def list_of_security_groups() -> dict:
    obj = ec2Driver(**account_details)
    all_security_groups = obj.get_all_security_groups()
    return {"data":all_security_groups, "count":len(all_security_groups),"success":1}


# for showing the list of Network ACL's with details
@router.get('/list_of_all_network_acls', description="Get All Network ACLs with Details")
def list_of_network_acls() -> dict:
    obj = ec2Driver(**account_details)
    all_network_acls = obj.get_all_network_acls()
    return {"data":all_network_acls, "count":len(all_network_acls),"success":1}


# for showing all the VPC Connection Peering with details
@router.get('/list_of_all_vpc_connection_peering', description="Get All VPC Connection Peering with Details")
def list_of_vpc_connection_peering() -> dict:
    obj = ec2Driver(**account_details)
    all_vpc_connection_peering = obj.get_all_vpc_connection_peering()
    return {"data":all_vpc_connection_peering, "count":len(all_vpc_connection_peering),"success":1}


# for showing all NAT Gateways with details
@router.get('/list_of_all_nats_gateway', description="Get All NAT Gateways with Details")
def list_of_nats_gateway() -> dict:
    obj = ec2Driver(**account_details)
    all_nat_gateways = obj.get_all_nat_gateways()
    return {"data":all_nat_gateways, "count":len(all_nat_gateways),"success":1}


#for showing all IGW with Details
@router.get('/list_of_all_internet_gateway', description="Get All INternet Gateways with Details")
def list_of_internet_gateway() -> dict:
    obj = ec2Driver(**account_details)
    all_internet_gateways = obj.get_all_internet_gateways()
    return {"data":all_internet_gateways, "count":len(all_internet_gateways),"success":1}


#for showing all the route table with details
@router.get('/list_of_route_table', description="Get All Route Table with Details")
def list_of_route_table()->dict:
    
    obj = ec2Driver(**account_details)
    all_route_table = obj.get_all_route_table()
    return {"data":all_route_table, "count":len(all_route_table),"success":1}

#for showing all the subnets with details
@router.get('/list_of_subnets', description="Get All subnets with Details")
def list_of_subnets()->dict:
    
    obj = ec2Driver(**account_details)
    all_subnets = obj.get_all_subnets()
    return {"data":all_subnets, "count":len(all_subnets),"success":1}


# for showing all the vpcs with details
@router.get("/list_of_vpcs", description="Get All VPCs with Details")
def list_of_vpcs()->dict:
    obj = ec2Driver(**account_details)
    all_vpcs = obj.get_all_vpcs()
    return {"data":all_vpcs, "count":len(all_vpcs),"success":1}