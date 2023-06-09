from app.aws.AWS import AWS
import pytz
from datetime import datetime, timedelta
from app import client
from influxdb_client.client.write_api import SYNCHRONOUS, ASYNCHRONOUS
import sys
import traceback


class VPC(AWS):
    def __init__(self, access_key, secret_key, account_label):
        super().__init__(access_key, secret_key, account_label)

    def GetVPCs(self, region_id='eu-west-2'):
        vpc_list = []
        try:
            ec2 = self.session.client('ec2', 'eu-west-2')

            vpcs = ec2.describe_vpcs()

            for vpc in vpcs['Vpcs']:
                    name = "-"
                    try:
                        tags = vpc['Tags']
                        for tag in tags:
                            if tag['Key'] == 'Name':
                                name = tag['Value']
                    except Exception as e:
                        print(
                            f"No Name found for VPC-ID: {vpc['VpcId']}\n\n", file=sys.stderr)
                        pass

                    vpc_list.append({
                        'vpc_name': name,
                        'vpc_id': vpc['VpcId'],
                        'status': vpc['State'],
                        'region_id': region_id
                    })

            return vpc_list

        except Exception as e:
            traceback.print_exc()
            return None
    
    def GetSubnets(self, region_id='eu-west-2'):
        subnet_list = []
        try:
            ec2 = self.session.client('ec2', 'eu-west-2')
            subnets = ec2.describe_subnet()

            for subnet in subnets['Subnets']:
                name = "-"
                try:
                    tags = subnet['Tags']
                    for tag in tags:
                        if tag['Key'] == 'Name':
                            name = tag['Value']
                except Exception as e:
                    print(
                        f"No Name found for Subnet-ID: {subnet['SubnetId']}\n", file=sys.stderr)
                    pass

                subnet_obj={'subnet_name': name,
                    'subnet_id': subnet['SubnetId'],
                    'status': subnet['State'],
                    'region_id': region_id}

                subnet_list.append(subnet_obj)
                print(subnet_obj)


            return subnet_list

        except Exception as e:
            traceback.print_exc()
            return None
        

    def GetRouteTables(self, region_id='eu-west-2'):
        table_list = []
        try:
            ec2 = self.session.client('ec2', 'eu-west-2')
            tables = ec2.describe_route_tables()

            for table in tables['RouteTables']:
                # print(table)
                name = "-"
                try:
                    tags = table['Tags']
                    for tag in tags:
                        if tag['Key'] == 'Name':
                            name = tag['Value']
                except Exception as e:
                    print(
                        f"No Name found for RouteTable-ID: {table['RouteTableId']}\n", file=sys.stderr)
                    pass

                table_obj={
                    'table_name': name,
                    'table_id': table['RouteTableId'],
                    'region_id': region_id}

                table_list.append(table_obj)
                print(table_obj)

            return table_list

        except Exception as e:
            traceback.print_exc()
            return None
        

    def GetSecurityGroups(self,region_id='eu-west-2'):
        group_list = []
        try:
            ec2 = self.session.client('ec2',)
            groups = ec2.describe_security_groups()

            for group in groups['SecurityGroups']:
                name = "-"
                try:
                    tags = group['Tags']
                    for tag in tags:
                        if tag['Key'] == 'Name':
                            name = tag['Value']
                except Exception as e:
                    print(
                        f"No Name found for Group-ID: {group['GroupId']}\n", file=sys.stderr)
                    pass

                group_obj={
                    'group_name': name,
                    'group_id': group['GroupId'],
                    'region_id': region_id,
                    'description':group['Description']
                    }

                group_list.append(group_obj)
                print(group_obj)


        except Exception as e:
            traceback.print_exc()