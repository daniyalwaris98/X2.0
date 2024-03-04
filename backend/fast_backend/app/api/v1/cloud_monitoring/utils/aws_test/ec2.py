from typing import List, Dict

import boto3
from datetime import datetime, timedelta
from app.api.v1.cloud_monitoring.utils.cloud_monitoring_utils import *
from app.static.cloud_monitoring_services_icon import *
from fastapi import Request

class ec2Driver:
    def __init__(self,aws_access_key_id:str, aws_secret_access_key:str, region_name:str) -> None:
        self.session = boto3.Session(
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name
        )


    def list_all_instances(self,service_name) -> list:
        ec2_client = self.session.client(service_name)
        ec2_resource = self.session.resource(service_name)
        instances = ec2_resource.instances.all()
        all_instances = []
        for instance in instances:
            # Fetch the Name tag
            name = ''
            for tag in instance.tags or []:
                if tag['Key'] == 'Name':
                    name = tag['Value']
                    break

            # Fetch the Elastic IP using the ec2_client created with the session
            elastic_ips = [address for address in ec2_client.describe_addresses()['Addresses']
                        if 'InstanceId' in address and address['InstanceId'] == instance.id]
            elastic_ip = elastic_ips[0]['PublicIp'] if elastic_ips else 'None'
            all_instances.append({
                "Name": name,
                "instance_state": instance.state['Name'],
                "instance_id": instance.id,
                "instance_type": instance.instance_type,
                "availability_zone": instance.placement['AvailabilityZone'],
                "elastic_iP": elastic_ip,
                "public_ipv4_address": instance.public_ip_address or 'None',
                "security_group_name": ', '.join([sg['GroupName'] for sg in instance.security_groups]),
                "launch_time": str(instance.launch_time),  # Convert launch_time to string
                "platform_name": instance.platform or 'Linux/UNIX',  # Assuming Linux/UNIX if None
                "key_name": instance.key_name
            })
        add_and_update_c2_instance(all_instances)
        return all_instances


    def list_of_all_instance_by_status(self, instance_status:list):
        ec2 = self.session.client('ec2')
        instances = ec2.describe_instances(Filters=[{'Name': 'instance-state-name', 'Values': instance_status }])
        return instances['Reservations']

    # def get_ec2_instance_details(self, instance_id:str):


    def get_rds_databases(self):
        rds = self.session.client('rds')
        dbs = rds.describe_db_instances()
        return dbs['DBInstances']


    def get_elbs(self,service_name):
        elbv2 = self.session.client(service_name)
        elbs = elbv2.describe_load_balancers()
        return elbs['LoadBalancers']


    def get_s3_buckets(self):
        s3 = self.session.client('s3')
        buckets = s3.list_buckets()
        return buckets['Buckets']


    def get_lambda_functions(self):
        lambda_client = self.session.client('lambda')
        functions = lambda_client.list_functions()
        return functions['Functions']


    def get_dynamodb_tables(self):
        dynamodb = self.session.client('dynamodb')
        tables = dynamodb.list_tables()
        return tables['TableNames']


    def get_kinesis_streams(self):
        kinesis = self.session.client('kinesis')
        streams = kinesis.list_streams()
        return streams['StreamNames']

    def get_glue_crawlers(self):
        glue = self.session.client('glue')
        crawlers = glue.get_crawlers()
        return crawlers['Crawlers']


    def get_emr_clusters(self):
        emr = self.session.client('emr')
        clusters = emr.list_clusters()
        return clusters['Clusters']


    def get_eks_clusters(self):
        eks = self.session.client('eks')
        clusters = eks.list_clusters()
        return clusters['clusters']


    def get_route53_health_checks(self):
        route53 = self.session.client('route53')
        health_checks = route53.list_health_checks()
        return health_checks['HealthChecks']


    def get_target_groups(self):
        elbv2 = self.session.client('elbv2')
        target_groups = elbv2.describe_target_groups()
        return target_groups['TargetGroups']


    def get_acm_certificates(self):
        acm = self.session.client('acm')
        certificates = acm.list_certificates()
        return certificates['CertificateSummaryList']


    def get_route53_domains(self):
        route53 = self.session.client('route53')
        hosted_zones = route53.list_hosted_zones()
        domain_list = []

        for zone in hosted_zones['HostedZones']:
            domain_name = zone['Name']
            domain_list.append(domain_name)

        return domain_list


    def get_sns_topics(self):
        sns = self.session.client('sns')
        topics = sns.list_topics()
        return topics['Topics']


    def get_cloudfront_distributions(self):
        cloudfront = self.session.client('cloudfront')
        distributions = cloudfront.list_distributions()
        return distributions['DistributionList']['Quantity']


    def get_cloudtrail_trails(self):
        cloudtrail = self.session.client('cloudtrail')
        trails = cloudtrail.describe_trails()
        return trails['trailList']


    def get_cloudwatch_alarms(self):
        cloudwatch = self.session.client('cloudwatch')
        alarms = cloudwatch.describe_alarms()
        return alarms['MetricAlarms']


    def get_iam_users(self):
        iam = self.session.client('iam')
        users = iam.list_users()
        return users['Users']


    def get_kms_keys(self):
        kms = self.session.client('kms')
        keys = kms.list_keys()
        return keys['Keys']


    def get_sns_subscriptions(self):
        sns = self.session.client('sns')
        subscriptions = sns.list_subscriptions()
        return subscriptions['Subscriptions']


    def get_elastic_beanstalk_environments(self):
        eb = self.session.client('elasticbeanstalk')
        environments = eb.describe_environments()
        return environments['Environments']


    def get_redshift_clusters(self):
        redshift = self.session.client('redshift')
        clusters = redshift.describe_clusters()
        return clusters['Clusters']


    def get_ecs_clusters(self):
        ecs = self.session.client('ecs')
        clusters = ecs.list_clusters()
        return clusters['clusterArns']


    def get_glue_databrew_projects(self):
        glue = self.session.client('databrew')
        projects = glue.list_projects()
        return projects['Projects']


    def get_step_functions(self):
        stepfunctions = self.session.client('stepfunctions')
        executions = stepfunctions.list_executions()
        return executions['executions']


    def get_ecr_repositories(self):
        ecr = self.session.client('ecr')
        repositories = ecr.describe_repositories()
        return repositories['repositories']


    def get_amazon_mq_brokers(self):
        mq = self.session.client('mq')
        brokers = mq.list_brokers()
        return brokers['BrokerSummaries']


    def get_glacier_vaults(self):
        glacier = self.session.client('glacier')
        vaults = glacier.list_vaults()
        return vaults['VaultList']


    def get_opsworks_stacks(self):
        opsworks = self.session.client('opsworks')
        stacks = opsworks.describe_stacks()
        return stacks['Stacks']


    def get_emr_clusters(self):
        emr = self.session.client('emr')
        clusters = emr.list_clusters()
        return clusters['Clusters']

    def get_ses_domains(self):
        ses = self.session.client('ses')
        domains = ses.list_identities(IdentityType='Domain')
        return domains['Identities']

    def get_api_gateway_apis(self):
        api_gateway = self.session.client('apigateway')
        apis = api_gateway.get_rest_apis()
        return apis['items']


    def get_lex_bots(self):
        lex = self.session.client('lex-models')
        bots = lex.get_bots()
        return bots['bots']

    def get_iot_things(self):
        iot = self.session.client('iot')
        things = iot.list_things()
        return things['things']

    def get_translate_text(self):
        translate = self.session.client('translate')
        texts = translate.list_text_translation_jobs()
        return texts['TextTranslationJobPropertiesList']

    def get_msk_clusters(self):
        msk = self.session.client('kafka')
        clusters = msk.list_clusters()
        return clusters['ClusterInfoList']

    def get_vpcs(self,service_name):
        ec2 = self.session.client(service_name)
        response = ec2.describe_vpcs()
        return response['Vpcs']
        
        
    
    def get_eks_clusters(self):
        eks = self.session.client('eks')
        clusters = eks.list_clusters()
        return clusters['clusters']
    

    def get_nat_gateways(self,service_name):
        ec2 = self.session.client('ec2')
        response = ec2.describe_nat_gateways()
        return response['NatGateways']

    def get_subnets(self,service_name):
        ec2 = self.session.client(service_name)
        response = ec2.describe_subnets()
        return response['Subnets']

    def get_vpc_peering_connections(self,service_name):
        ec2 = self.session.client(service_name)
        response = ec2.describe_vpc_peering_connections()
        return response['VpcPeeringConnections']

    def get_route_tables(self,service_name):
        ec2 = self.session.client(service_name)
        response = ec2.describe_route_tables()
        return response['RouteTables']

    def get_network_acls(self,service_name):
        ec2 = self.session.client(service_name)
        response = ec2.describe_network_acls()
        return response['NetworkAcls']


    def get_internet_gateways(self,service_name):
        ec2 = self.session.client(service_name)
        response = ec2.describe_internet_gateways()
        return response['InternetGateways']

    def get_security_groups(self,service_name):
        ec2 = self.session.client(service_name)
        response = ec2.describe_security_groups()
        return response['SecurityGroups']

    def get_virtual_private_gateways(self):
        ec2 = self.session.client('ec2')
        response = ec2.describe_vpn_gateways()
        return response['VpnGateways']

    def get_site_to_site_vpn_connections(self,service_name):
        ec2 = self.session.client(service_name)
        response = ec2.describe_vpn_connections()
        return response['VpnConnections']


    # bucket related information
    def get_bucket_region(self, bucket_name):
        s3 = self.session.client('s3')
        location = s3.get_bucket_location(Bucket=bucket_name)
        return location['LocationConstraint']

    def get_bucket_access(self, bucket_name):
        s3 = self.session.client('s3')
        try:
            # Attempt to get bucket policy to check access
            policy = s3.get_bucket_policy(Bucket=bucket_name)
            return "Public"
        except s3.exceptions.NoSuchBucketPolicy:
            # If NoSuchBucketPolicy exception is raised, bucket is private
            return "Private"

    def auto_discovery(self,request) -> list:
        auto_discovery_data_list = [
            {
                "service_name": "EC2",
                "count": len(self.list_of_all_instance_by_status(['running', 'stopped'])),
                "image": str(create_file_url(request=request, file_name='./static/cloud_monitoring_services_icon/ec_2.png')) # Assuming 'ec_2.png' is the file name
            },
            {
                "service_name": "S3",
                "count": len(self.get_s3_buckets()),
                "image": create_file_url(request=request, file_name='./static/cloud_monitoring_services_icon/s3.png')
                # Assuming 'ec_2.png' is the file name
            },
            {
                "service_name": "ELB",
                "count": len(self.get_elbs()),
                "image": create_file_url(request=request, file_name='./static/cloud_monitoring_services_icon/elb.png')
                # Assuming 'ec_2.png' is the file name
            },
            {
                "service_name": "Route 53",
                "count": len(self.get_route53_domains()),
                "image": create_file_url(request=request, file_name='./static/cloud_monitoring_services_icon/route_53.png')
                # Assuming 'ec_2.png' is the file name
            },
            {
                "service_name": "IAM",
                "count": len(self.get_iam_users()),
                "image": create_file_url(request=request,
                                         file_name='./static/cloud_monitoring_services_icon/iam.png')
                # Assuming 'ec_2.png' is the file name
            },
            {
                "service_name": "ECS",
                "count": len(self.get_ecs_clusters()),
                "image": create_file_url(request=request,
                                         file_name='./static/cloud_monitoring_services_icon/ecs.png')
                # Assuming 'ec_2.png' is the file name
            },
            {
                "service_name": "ECR",
                "count": len(self.get_ecr_repositories()),
                "image": create_file_url(request=request,
                                         file_name='./static/cloud_monitoring_services_icon/ecr.png.png')
                # Assuming 'ec_2.png' is the file name
            },
            {
                "service_name": "RDS",
                "count":  len(self.get_rds_databases()),
                "image": create_file_url(request=request,
                                         file_name='./static/cloud_monitoring_services_icon/rds.png')
                # Assuming 'ec_2.png' is the file name
            },
            {
                "service_name": "VPC",
                "count": len(self.get_vpcs()),
                "image": create_file_url(request=request,
                                         file_name='./static/cloud_monitoring_services_icon/vpc.png')
                # Assuming 'ec_2.png' is the file name
            },
            {
                "service_name": "EKS",
                "count": len(self.get_eks_clusters()),
                "image": create_file_url(request=request,
                                         file_name='./static/cloud_monitoring_services_icon/EKS.png')
                # Assuming 'ec_2.png' is the file name
            }
        ]
        print("discovery data list is:::::::::::::",auto_discovery_data_list,file=sys.stderr)
        discovery_data = {

            "ec2_instance_count": len(self.list_of_all_instance_by_status(['running', 'stopped'])),
            "s3_bucket_count": len(self.get_s3_buckets()),
            "elb_count": len(self.get_elbs()),
            "route53_count": len(self.get_route53_domains()),
            "iam_users_count": len(self.get_iam_users()),
            "ecs_clusters_count": len(self.get_ecs_clusters()),
            "ecr_repositories_count": len(self.get_ecr_repositories()),
            "rds_databases_count": len(self.get_rds_databases()),
            "vpc_count": len(self.get_vpcs()),
            "eks_cluster_count": len(self.get_eks_clusters()),
        }

        add_discovery_data(discovery_data)

        return auto_discovery_data_list

    def list_all_s3_buckets(self) -> list:
        s3 = self.session.client('s3')
        buckets = s3.list_buckets()['Buckets']

        bucket_info_list = []
        for bucket in buckets:
            # Get additional bucket information
            bucket_name = bucket['Name']
            region = self.get_bucket_region(bucket_name)
            access = self.get_bucket_access(bucket_name)
            creation_date = bucket['CreationDate'].strftime("%Y-%m-%d %H:%M:%S")

            # Store bucket information in a dictionary
            bucket_info = {
                'BucketName': bucket_name,
                'Region': region,
                'Access': access,
                'CreationDate': creation_date
            }
            bucket_info_list.append(bucket_info)
        return bucket_info_list

    # load balancer
    def list_all_load_balancers(self,service_name) -> list:
        elb_data = [{

            'Name':elb['LoadBalancerName'],
            'DNSName': elb['DNSName'],
            'State': elb['State']['Code'],
            'VPC ID': elb['VpcId'],
            'Availability Zones':len(elb['AvailabilityZones']),
            'Type': elb['Type'],
            'Date Created' : elb['CreatedTime'].strftime("%Y-%m-%d %H:%M:%S"),
        } for elb in self.get_elbs(service_name=service_name)]
        return elb_data
    


    # when user clicks on VPC from Dashboard
    def vpc_service_discovery(self) -> dict:
        return {
            "vpc_count":len(self.get_vpcs()),
            "nat_gateway_count":len(self.get_nat_gateways()),
            "subnets_count":len(self.get_subnets()),
            "vpc_peering_connection_count":len(self.get_vpc_peering_connections()),
            "route_table_count":len(self.get_route_tables()),
            "network_acl_count":len(self.get_network_acls()),
            "internet_gateway_count":len(self.get_internet_gateways()),
            "security_group_count":len(self.get_security_groups()),
            "virtual_private_gateway_count":len(self.get_virtual_private_gateways()),
            "site_to_site_vpn_connection_count":len(self.get_site_to_site_vpn_connections())
        }

    def get_all_site_to_site_vpn_connections(self,service_name) -> list:
        vpn_info_list = [{
                'Name': vpn_connection.get('Tags', [{}])[0].get('Value', 'N/A'),
                'VPN ID': vpn_connection['VpnConnectionId'],
                'State': vpn_connection['State'],
                'Virtual Private Gateway': vpn_connection.get('VpnGatewayId', 'N/A'),
                'Transit Gateway': vpn_connection.get('TransitGatewayId', 'N/A'),
                'Customer Gateway': vpn_connection['CustomerGatewayId']
            } for vpn_connection in self.get_site_to_site_vpn_connections(service_name)]
        return vpn_info_list


    def get_all_security_groups(self,service_name) -> list:
        security_group_list = [{
                'Name': next((tag['Value'] for tag in sg.get('Tags', []) if tag['Key'] == 'Name'), '-'),
                'Security Group ID': sg['GroupId'],
                'Security Group Name': sg['GroupName'],
                'VPC ID': sg.get('VpcId', 'N/A'),
                'Owner': sg['OwnerId'],
                'Inbound Rules Count': len(sg['IpPermissions']),
                'Outbound Rules Count': len(sg['IpPermissionsEgress'])
            } for sg in self.get_security_groups(service_name=service_name)]
        return security_group_list

    def get_all_network_acls(self,service_name)->list:
        network_acl_list =[{
                'Name': next((tag['Value'] for tag in acl.get('Tags', []) if tag['Key'] == 'Name'), '-'),
                'Network ACL ID': acl['NetworkAclId'],
                'Associated With': f"{len(acl['Associations'])} Subnets",
                'Default': 'Yes' if acl['IsDefault'] else 'No',
                'VPC ID': acl['VpcId'],
                'Owner': acl['OwnerId'],
                'Inbound Rules Count': len([entry for entry in acl['Entries'] if entry['Egress'] == True]),
                'Outbound Rules Count': len([entry for entry in acl['Entries'] if entry['Egress'] == False])
        } for acl in self.get_network_acls(service_name=service_name)]
        return network_acl_list



    def get_all_vpc_connection_peering(self,service_name) -> list:
        vpn_connection_perring_list =[{
                'Name': next((tag['Value'] for tag in vpc_peering.get('Tags', []) if tag['Key'] == 'Name'), '-'),
                'Peering Connections ID': vpc_peering['VpcPeeringConnectionId'],
                'Status': vpc_peering['Status']['Code'],
                'Requestor VPC': vpc_peering['RequesterVpcInfo']['VpcId'],
                'Acceptor VPC': vpc_peering['AccepterVpcInfo']['VpcId'],
                'Requestor CIDRs' : [cidr['CidrBlock'] for cidr in vpc_peering['RequesterVpcInfo']['CidrBlockSet']],
                'Acceptor CIDRs' : [cidr['CidrBlock'] for cidr in vpc_peering['AccepterVpcInfo']['CidrBlockSet']],
                'Requestor Owner ID': vpc_peering['RequesterVpcInfo']['OwnerId'],
                'Acceptor Owner ID': vpc_peering['AccepterVpcInfo']['OwnerId'],
                'Requestor Region': vpc_peering['RequesterVpcInfo']['Region'],
                'Acceptor Region': vpc_peering['AccepterVpcInfo']['Region']
        } for vpc_peering in self.get_vpc_peering_connections(service_name=service_name)]

        return vpn_connection_perring_list
    
    #get_nat_gateways

    def get_all_nat_gateways(self,service_name)-> list:
        nat_gateway_list = [{

                'Name': nat_gateway.get('Tags', [{'Value': '-'}])[0]['Value'],
                'NAT gateway ID': nat_gateway['NatGatewayId'],
                'Connectivity type': nat_gateway['ConnectivityType'],
                'State': nat_gateway['State'],
                'Primary public IPv4 address': nat_gateway['NatGatewayAddresses'][0]['PublicIp'],
                'Primary private IPv4 address': nat_gateway['NatGatewayAddresses'][0]['PrivateIp'],
                'VPC': nat_gateway['VpcId'],
                'Subnet': nat_gateway['SubnetId'],
                'Created': nat_gateway['CreateTime']

        } for nat_gateway in self.get_nat_gateways(service_name)]

        return nat_gateway_list


    def get_all_internet_gateways(self,service_name)->list:
        internet_gateway_list = [{
                'Name': next((tag['Value'] for tag in internet_gateway.get('Tags', []) if tag['Key'] == 'Name'), '-'),
                'Internet gateway ID': internet_gateway['InternetGatewayId'],
                'State': internet_gateway['Attachments'][0]['State'] if internet_gateway['Attachments'] else 'Detached',
                'VPC ID': internet_gateway['Attachments'][0]['VpcId'] if internet_gateway['Attachments'] else 'N/A',
                'Owner': internet_gateway['OwnerId']
        } for internet_gateway in self.get_internet_gateways(service_name)]
        return internet_gateway_list
    

    def get_all_route_table(self,service_name)-> list:
        router_data_list = [{
                'Name': next((tag['Value'] for tag in route_table.get('Tags', []) if tag['Key'] == 'Name'), '-'),
                'Route table ID': route_table['RouteTableId'],
                'Main': 'Yes' if route_table.get('Associations', [{}])[0].get('Main', False) else 'No',
                'VPC': route_table['VpcId'],
                'Owner': route_table['OwnerId']
            } for route_table in self.get_route_tables(service_name)
        ]
        return router_data_list
    
    def get_all_subnets(self,service_name)->list:
        # print(self.get_subnets())
        subnet_list =  [{
                'Subnets': next((tag['Value'] for tag in subnet.get('Tags', []) if tag['Key'] == 'Name'), '-'),
                'Subnet ID': subnet['SubnetId'],
                'State':subnet['State'],
                'VPC': subnet['VpcId'],
                'IPv4 CIDR': subnet['CidrBlock'],
                'IPv6 CIDR': subnet.get('Ipv6CidrBlock', ''),
                'Available IPv4 addresses': subnet['AvailableIpAddressCount'],
                'Availability Zone': subnet['AvailabilityZone'],
                'Availability Zone ID': subnet['AvailabilityZoneId'],
                # 'Network border group': subnet['NetworkBorderGroup'],
                # 'Route table': subnet['RouteTableId'],
                # 'Network ACL': subnet['NetworkAclId'],
                'Default subnet': 'Yes' if subnet['DefaultForAz'] else 'No',
                'Auto-assign public IPv4 address': 'Yes' if subnet['MapPublicIpOnLaunch'] else '',
                'Owner ID': subnet['OwnerId']
            } for subnet in self.get_subnets(service_name)
        ]
        return subnet_list
    
    def get_all_vpcs(self,service_name):
            vpc_list =  [{
                'Name': next((tag['Value'] for tag in vpc.get('Tags', []) if tag['Key'] == 'Name'), '-'),
                'VPC ID': vpc['VpcId'],
                'State': vpc['State'],
                'IPv4 CIDR': vpc['CidrBlock'],
                'IPv6 CIDR': vpc.get('Ipv6CidrBlock', '-'),
                'DHCP option set': vpc.get('DhcpOptionsId', '-'),
                # 'Main route table': vpc['CidrBlockAssociationSet'][0]['AssociationId'],
                # 'Main network ACL': vpc['CidrBlockAssociationSet'][0]['NetworkAclId'],
                'Tenancy': vpc['InstanceTenancy'],
                'Default VPC': 'Yes' if vpc['IsDefault'] else 'No',
                'Owner ID': vpc['OwnerId']
            } for vpc in self.get_vpcs(service_name)]
            return vpc_list