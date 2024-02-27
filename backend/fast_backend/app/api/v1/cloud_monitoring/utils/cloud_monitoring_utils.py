import traceback
import pandas as pd
from app.models.cloud_monitoring_models import *
from app.utils.db_utils import *
from app.core.config import *

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
            aws_ec2_data = configs.db.query(AwsEc2).flter_by(ec2_instance_id = ec2_instance['instance_id']).first()
            if aws_ec2_data:
                aws_ec2_data.ec2_instance_id = ec2_instance['instance_id']
                aws_ec2_data.ec2_instance_type = ec2_instance['instance_type']
                aws_ec2_data.availability_zone = ec2_instance['availability_zone']
                aws_ec2_data.elastic_ip = ec2_instance['elastic_ip']
                aws_ec2_data.public_ipv4_address = ec2_instance['public_ipv4_address']
                aws_ec2_data.security_group_name = ec2_instance['security_group_name']
                aws_ec2_data.launch_time = ec2_instance['launch_time']
                aws_ec2_data.platform = ec2_instance['platform_name']
                aws_ec2_data.key_name = ec2_instance['key_name']
                aws_ec2_data['instance_state'] = ec2_instance['instance_state']
                UpdateDBData(aws_ec2_data)
            else:
                ec2 = AwsEc2(

                )
    except Exception as e:
        traceback.print_exc()
        print("Error Occured While Adding And Update EC2 Instance",str(e),file=sys.stderr)

