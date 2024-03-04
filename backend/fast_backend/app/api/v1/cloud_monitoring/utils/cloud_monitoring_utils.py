import traceback
from fastapi import FastAPI, Request

import pandas as pd
from app.models.cloud_monitoring_models import *
from app.utils.db_utils import *
from app.core.config import *


def create_file_url(request: Request, file_name: str):
    try:
        base_url_str = str(request.base_url)
        print("base url string is::",base_url_str,file=sys.stderr)
        file_url = base_url_str+ file_name
        print("file url s",file_url,file=sys.stderr)
        return file_url
    except Exception as e:
        traceback.print_exc()
        return None


def get_service_id_by_name(service_name):

    service = configs.db.query(CloudDiscovery).filter_by(discovered_service_name=service_name).first()
    if service:
        return service.cloud_discovery_id
    else:
        return 'Not found'
def add_discovery_data(data):
    try:
        transformed_data = []
        for service, count in data.items():
            aws_discovery_data = configs.db.query(CloudDiscovery).filter_by(discovered_service_name=service.replace("_count", "")).first()
            if aws_discovery_data:
                aws_discovery_data.discovered_service_name = service.replace("_count", ""),
                aws_discovery_data.running_instance_count = count
                aws_discovery_data.service_state = 'running' if count > 0 else 'stopped',
                aws_discovery_data.modification_date = datetime.now()
                UpdateDBData(aws_discovery_data)
                print("Data updated for the discovery data :::::::::",file=sys.stderr)
            else:
                transformed_data.append({
                    'discovered_service_name': service.replace("_count", ""),
                    'running_instance_count': count,
                    'service_state': 'running' if count > 0 else 'stopped',  # Example logic for service_state
                    'creation_date': datetime.now(),  # Assuming current date for creation
                    'modification_date': datetime.now()  # Assuming current date for modification
                })
        print("transformed data is:::::::::::::;",transformed_data,file=sys.stderr)
        print("transformed data len is:::",len(transformed_data),file=sys.stderr)
        df_transformed = pd.DataFrame(transformed_data)
        print("Data in auto discovery data is:::::::::::::;",df_transformed,file=sys.stderr)
        print("data frame is::::::::::",df_transformed,file=sys.stderr)
        df_transformed.to_sql('cloud_discovery_table', con=configs.engine, if_exists='append', index=False)
        print("Data isnerted for the auto discovery data :::::",file=sys.stderr)
    except Exception as e:
        traceback.print_exc()



def add_and_update_c2_instance(data):
    try:
        print("data for the ec2 instance is::::::::::::",data,file=sys.stderr)

        for ec2_instance in data:
            aws_ec2_data = configs.db.query(AwsEc2).filter_by(ec2_instance_id = ec2_instance['instance_id']).first()
            if aws_ec2_data:
                aws_ec2_data.ec2_instance_id = ec2_instance['instance_id']
                aws_ec2_data.ec2_instance_type = ec2_instance['instance_type']
                aws_ec2_data.availability_zone = ec2_instance['availability_zone']
                aws_ec2_data.elastic_ip = ec2_instance['elastic_iP']
                aws_ec2_data.public_ipv4_address = ec2_instance['public_ipv4_address']
                aws_ec2_data.security_group_name = ec2_instance['security_group_name']
                aws_ec2_data.launch_time = ec2_instance['launch_time']
                aws_ec2_data.platform = ec2_instance['platform_name']
                aws_ec2_data.key_name = ec2_instance['key_name']
                aws_ec2_data.instance_state = ec2_instance['instance_state']
                UpdateDBData(aws_ec2_data)
            else:
                do_cloud_discovery_id_exsist =None
                result = get_service_id_by_name("ec2_instance")
                if result != "Not found":
                    do_cloud_discovery_id_exist = result
                    new_ec2 = AwsEc2(
                        ec2_instance_id=ec2_instance['instance_id'],
                        instance_type=ec2_instance['instance_type'],
                        availability_zone=ec2_instance['availability_zone'],
                        elastic_ip=ec2_instance['elastic_iP'],
                        public_ipv4_address=ec2_instance['public_ipv4_address'],
                        security_group_name=ec2_instance['security_group_name'],
                        launch_time=ec2_instance['launch_time'],
                        platform_name=ec2_instance.get('platform_name', None),
                        key_name=ec2_instance['key_name'],
                        instance_state=ec2_instance['instance_state'],
                        cloud_discovery_id=do_cloud_discovery_id_exist,
                    )
                    InsertDBData(new_ec2)
                else:
                    print(
                        f"Cloud discovery ID for 'ec2_instance' not found. EC2 instance '{ec2_instance['instance_id']}' not added.")
    except Exception as e:
            traceback.print_exc()
            print("Error Occured While Adding And Update EC2 Instance",str(e),file=sys.stderr)





def add_and_update_s3_instance(data):
    try:
        print("data for the ec2 instance is::::::::::::",data,file=sys.stderr)

        for s3_instance in data:
            aws_s3_data = configs.db.query(AWSS3).filter_by(bucket_name = s3_instance['BucketName']).first()
            if aws_s3_data:
                aws_s3_data.ec2_instance_id = s3_instance['BucketName']
                aws_s3_data.ec2_instance_type = s3_instance['Region']
                aws_s3_data.availability_zone = s3_instance['Access']
                aws_s3_data.elastic_ip = s3_instance['CreationDate']
                aws_s3_data.modification_date = datetime.now()
                UpdateDBData(aws_s3_data)
            else:
                result = get_service_id_by_name("ec2_instance")
                if result != "Not found":
                    do_cloud_discovery_id_exist = result
                    s3 = AWSS3(
                        bucket_name = s3_instance['BucketName'],
                        region = s3_instance['Region'],
                        access = s3_instance['Access'],
                        bucket_creation_date = s3_instance['CreationDate'],
                        cloud_discovery_id = do_cloud_discovery_id_exist
                    )
                    InsertDBData(s3)
    except Exception as e:
        traceback.print_exc()
        print("Error Occured While Adding And Update EC2 Instance",str(e),file=sys.stderr)


def add_and_update_elb(data):
    try:
        print("data for the ec2 instance is::::::::::::",data,file=sys.stderr)

        for elb_instance in data:
            aws_elb_data = configs.db.query(AwsElasticLoadBalancer).flter_by(vpc_id = elb_instance['VPC ID']).first()
            if aws_elb_data:
                aws_elb_data.load_balancer_name = elb_instance['Name']
                aws_elb_data.dns_name = elb_instance['DNSName']
                aws_elb_data.sate = elb_instance['State']
                aws_elb_data.availability_zones = elb_instance['availability_zones']
                aws_elb_data.type = elb_instance['Type']
                aws_elb_data.date_created = elb_instance['Date Created']
                aws_elb_data.modification_date = datetime.now()
                UpdateDBData(aws_elb_data)
            else:
                result = get_service_id_by_name("ec2_instance")
                if result != "Not found":
                    elb = AwsElasticLoadBalancer(
                        load_balancer_name = elb_instance['Name'],
                        dns_name = elb_instance['DNSName'],
                        sate = elb_instance['State'],
                        availability_zones = elb_instance['availability_zones'],
                        type = elb_instance['Type'],
                        date_created = elb_instance['Date Created'],
                    )
                    InsertDBData(elb)
    except Exception as e:
        traceback.print_exc()
        print("Error Occured While Adding And Update EC2 Instance",str(e),file=sys.stderr)

def add_and_update_vpc_service_discovery(data):
    try:
        print("data for the ec2 instance is::::::::::::", data, file=sys.stderr)

        for vpc_instance in data:
            aws_vpc_discovery_data = configs.db.query(AwsVpcServiceDiscovery).filter_by(vpc_count=vpc_instance['vpc_count']).first()
            if aws_vpc_discovery_data:
                aws_vpc_discovery_data.vpc_count = vpc_instance['vpc_count']
                aws_vpc_discovery_data.nat_gateway_count = vpc_instance['nat_gateway_count']
                aws_vpc_discovery_data.subnets_count = vpc_instance['subnets_count']
                aws_vpc_discovery_data.vpc_peering_connection_count = vpc_instance['vpc_peering_connection_count']
                aws_vpc_discovery_data.route_table_count = vpc_instance['route_table_count']
                aws_vpc_discovery_data.network_acl_count = vpc_instance['network_acl_count']
                aws_vpc_discovery_data.internet_gateway_count = vpc_instance['internet_gateway_count']
                aws_vpc_discovery_data.security_group_count = vpc_instance['security_group_count']
                aws_vpc_discovery_data.virtual_private_gateway_count = vpc_instance['virtual_private_gateway_count']
                aws_vpc_discovery_data.site_to_site_vpn_connection_count = vpc_instance['site_to_site_vpn_connection_count']
                aws_vpc_discovery_data.modification_date = datetime.now()
                UpdateDBData(aws_vpc_discovery_data)
            else:
                new_vpc_discovery_data = AwsVpcServiceDiscovery(
                    vpc_count=vpc_instance['vpc_count'],
                    nat_gateway_count=vpc_instance['nat_gateway_count'],
                    subnets_count=vpc_instance['subnets_count'],
                    vpc_peering_connection_count=vpc_instance['vpc_peering_connection_count'],
                    route_table_count=vpc_instance['route_table_count'],
                    network_acl_count=vpc_instance['network_acl_count'],
                    internet_gateway_count=vpc_instance['internet_gateway_count'],
                    security_group_count=vpc_instance['security_group_count'],
                    virtual_private_gateway_count=vpc_instance['virtual_private_gateway_count'],
                    site_to_site_vpn_connection_count=vpc_instance['site_to_site_vpn_connection_count'],
                    modification_date=datetime.now()  # Assuming you want to set this on creation as well
                )
                InsertDBData(new_vpc_discovery_data)
    except Exception as e:
        traceback.print_exc()
        print("Error Occurred While Adding And Updating EC2 Instance", str(e), file=sys.stderr)


def add_and_update_all_security_groups(data):
    try:
        print("data for the ec2 instance is::::::::::::", data, file=sys.stderr)

        for security_group_instance in data:
            aws_security_group_data = configs.db.query(AwSecurityGroup).filter_by(
                vpc_count=security_group_instance['Security Group ID']).first()
            if aws_security_group_data:
                aws_security_group_data.aws_security_group_name_by_user = security_group_instance['Name']
                aws_security_group_data.security_group_id = security_group_instance['security_group_id']
                aws_security_group_data.security_group_name = security_group_instance['security_group_name']
                aws_security_group_data.vpc_id = security_group_instance['vpc_id']
                aws_security_group_data.owner_id = security_group_instance['Owner']
                aws_security_group_data.inbound_rules_count = security_group_instance['Inbound Rules Count']
                aws_security_group_data.outbound_rules_count = security_group_instance['Outbound Rules Count']
                aws_security_group_data.security_group_count = security_group_instance['security_group_count']

                aws_security_group_data.modification_date = datetime.now()
                UpdateDBData(aws_security_group_data)
            else:
                new_security_group_data = AwSecurityGroup(
                    aws_security_group_name_by_user = security_group_instance['Name'],
                    security_group_id = security_group_instance['security_group_id'],
                    security_group_name=security_group_instance['security_group_name'],
                    vpc_id=security_group_instance['vpc_id'],
                    owner_id=security_group_instance['Owner'],
                    inbound_rules_count=security_group_instance['Inbound Rules Count'],
                    outbound_rules_count=security_group_instance['Outbound Rules Count'],
                    security_group_count=security_group_instance['security_group_count'],
                    modification_date=datetime.now()  # Assuming you want to set this on creation as well
                )
                InsertDBData(new_security_group_data)
    except Exception as e:
        traceback.print_exc()
        print("Error Occurred While Adding And Updating EC2 Instance", str(e), file=sys.stderr)

def add_and_update_all_network_acls(data):
    try:
        print("data for the ec2 instance is::::::::::::", data, file=sys.stderr)

        for network_acl_instance in data:
            aws_network_acl_data = configs.db.query(AwsNetworkAcl).filter_by(
                vpc_count=network_acl_instance['Network ACL ID']).first()
            if aws_network_acl_data:
                aws_network_acl_data.network_acl_name_by_user = network_acl_instance['Name']
                aws_network_acl_data.network_acl_id = network_acl_instance['Network ACL ID']
                aws_network_acl_data.associated_with_count = network_acl_instance['Associated With']
                aws_network_acl_data.default_state = network_acl_instance['Default']
                aws_network_acl_data.vpc_id = network_acl_instance['VPC ID']
                aws_network_acl_data.owner_id = network_acl_instance['Owner']
                aws_network_acl_data.inbound_rules_count = network_acl_instance['Inbound Rules Count']
                aws_network_acl_data.outbound_rules_count = network_acl_instance['Outbound Rules Count']
                aws_network_acl_data.security_group_count = network_acl_instance['security_group_count']

                aws_network_acl_data.modification_date = datetime.now()
                UpdateDBData(aws_network_acl_data)
            else:
                new_network_acl_data = AwSecurityGroup(
                network_acl_name_by_user=network_acl_instance['Name'],
                network_acl_id = network_acl_instance['Network ACL ID'],
                associated_with_count = network_acl_instance['Associated With'],
                default_state = network_acl_instance['Default'],
                vpc_id = network_acl_instance['VPC ID'],
                owner_id = network_acl_instance['Owner'],
                inbound_rules_count = network_acl_instance['Inbound Rules Count'],
                outbound_rules_count = network_acl_instance['Outbound Rules Count'],
                security_group_count = network_acl_instance['security_group_count'],
                )
                InsertDBData(new_network_acl_data)
    except Exception as e:
        traceback.print_exc()
        print("Error Occurred While Adding And Updating EC2 Instance", str(e), file=sys.stderr)



def add_and_update_all_vpc_connection_perring(data):
    try:
        print("data for the ec2 instance is::::::::::::", data, file=sys.stderr)

        for peering_coonection_instance in data:
            aws_peering_connection_data = configs.db.query(AwsNetworkAcl).filter_by(
                peering_connection_id=peering_coonection_instance['Peering Connections ID']).first()
            if aws_peering_connection_data:
                aws_peering_connection_data.peering_connection_name_by_user = peering_coonection_instance['Name']
                aws_peering_connection_data.status = peering_coonection_instance['Status']
                aws_peering_connection_data.requestor_vpc = peering_coonection_instance['Requestor VPC']
                aws_peering_connection_data.acceptor_vpc = peering_coonection_instance['Acceptor VPC']
                aws_peering_connection_data.requestor_cidrs = peering_coonection_instance['Requestor CIDRs']
                aws_peering_connection_data.acceptor_cidrs = peering_coonection_instance['Acceptor CIDRs']
                aws_peering_connection_data.requestor_owner_id = peering_coonection_instance['Requestor Owner ID']
                aws_peering_connection_data.acceptor_owner_id = peering_coonection_instance['Acceptor Owner ID']
                aws_peering_connection_data.requestor_region = peering_coonection_instance['Requestor Region']
                aws_peering_connection_data.acceptor_region = peering_coonection_instance['Acceptor Region']

                peering_coonection_instance.modification_date = datetime.now()
                UpdateDBData(peering_coonection_instance)
            else:
                peering_coonection_data = AwsPeeringConnection(
                peering_connection_name_by_user = peering_coonection_instance['Name'],
                status = peering_coonection_instance['Status'],
                requestor_vpc = peering_coonection_instance['Requestor VPC'],
                acceptor_vpc = peering_coonection_instance['Acceptor VPC'],
                requestor_cidrs = peering_coonection_instance['Requestor CIDRs'],
                acceptor_cidrs = peering_coonection_instance['Acceptor CIDRs'],
                requestor_owner_id = peering_coonection_instance['Requestor Owner ID'],
                acceptor_owner_id = peering_coonection_instance['Acceptor Owner ID'],
                requestor_region = peering_coonection_instance['Requestor Region'],
                acceptor_region = peering_coonection_instance['Acceptor Region'],

                )
                InsertDBData(peering_coonection_data)
    except Exception as e:
        traceback.print_exc()
        print("Error Occurred While Adding And Updating EC2 Instance", str(e), file=sys.stderr)


def add_and_update_all_nat_gateway(data):
    try:
        print("data for the ec2 instance is::::::::::::", data, file=sys.stderr)

        for nat_gate_way_instance in data:
            nat_gate_way_data = configs.db.query(AwsNatGateway).filter_by(
                nat_gateway_id=nat_gate_way_instance['NAT gateway ID']).first()
            if nat_gate_way_data:
                nat_gate_way_data.nat_gateway_by_user = nat_gate_way_instance['Name']
                nat_gate_way_data.nat_gateway_id = nat_gate_way_instance['NAT gateway ID']
                nat_gate_way_data.connectivity_type = nat_gate_way_instance['Connectivity type']
                nat_gate_way_data.primary_public_ipv4_address = nat_gate_way_instance['Primary public IPv4 address']
                nat_gate_way_data.primary_private_ipv4_address = nat_gate_way_instance['Primary private IPv4 address']
                nat_gate_way_data.vpc = nat_gate_way_instance['VPC']
                nat_gate_way_data.subnet_id = nat_gate_way_instance['Subnet']
                nat_gate_way_data.created_at = nat_gate_way_instance['Created']
                nat_gate_way_instance.modification_date = datetime.now()
                UpdateDBData(nat_gate_way_instance)
            else:
                nat_gate_way_data = AwsNatGateway(
                nat_gateway_by_user=nat_gate_way_instance['Name'],
                nat_gateway_id = nat_gate_way_instance['NAT gateway ID'],
                connectivity_type = nat_gate_way_instance['Connectivity type'],
                primary_public_ipv4_address = nat_gate_way_instance['Primary public IPv4 address'],
                primary_private_ipv4_address = nat_gate_way_instance['Primary private IPv4 address'],
                vpc = nat_gate_way_instance['VPC'],
                subnet_id = nat_gate_way_instance['Subnet'],
                created_at = nat_gate_way_instance['Created'],
                )
                InsertDBData(nat_gate_way_data)
    except Exception as e:
        traceback.print_exc()
        print("Error Occurred While Adding And Updating EC2 Instance", str(e), file=sys.stderr)


def add_and_update_all_internet_gateway(data):
    try:
        print("data for the ec2 instance is::::::::::::", data, file=sys.stderr)

        for internet_gate_way_instance in data:
            internet_gate_way_data = configs.db.query(AwsInternetGateway).filter_by(
                internet_gateway_id=internet_gate_way_instance['Internet gateway ID']).first()
            if internet_gate_way_data:
                internet_gate_way_data.internet_gateway_name_by_user = internet_gate_way_instance['Name']
                internet_gate_way_data.internet_gateway_id = internet_gate_way_instance['Internet gateway ID']
                internet_gate_way_data.state = internet_gate_way_instance['State']
                internet_gate_way_data.vpc_id = internet_gate_way_instance['VPC ID']
                internet_gate_way_data.owner_id = internet_gate_way_instance['Owner']

                internet_gate_way_data.modification_date = datetime.now()
                UpdateDBData(internet_gate_way_instance)
            else:
                internet_gate_way_data = AwsNatGateway(
                internet_gateway_name_by_user=internet_gate_way_instance['Name'],
                internet_gateway_id = internet_gate_way_instance['Internet gateway ID'],
                state = internet_gate_way_instance['State'],
                vpc_id = internet_gate_way_instance['VPC ID'],
                owner_id = internet_gate_way_instance['Owner'],
                )
                InsertDBData(internet_gate_way_data)
    except Exception as e:
        traceback.print_exc()
        print("Error Occurred While Adding And Updating EC2 Instance", str(e), file=sys.stderr)


def insert_or_update_route_table(route_table_data):
    try:
        existing_route_table = configs.db.query(AwsRouteTable).filter_by(route_table_id=route_table_data['Route table ID']).first()
        if existing_route_table:
            # Update existing record
            existing_route_table.name = route_table_data['Name']
            existing_route_table.main = route_table_data['Main']
            existing_route_table.vpc_id = route_table_data['VPC']
            existing_route_table.owner_id = route_table_data['Owner']
            UpdateDBData(existing_route_table)
        else:
            new_route_table = AwsRouteTable(
                name=route_table_data['Name'],
                route_table_id=route_table_data['Route table ID'],
                main=route_table_data['Main'],
                vpc_id=route_table_data['VPC'],
                owner_id=route_table_data['Owner']
            )
            InsertDBData(new_route_table)
    except Exception as e:
        traceback.print_exc()
        print("error occured while getting the inert or update route table")