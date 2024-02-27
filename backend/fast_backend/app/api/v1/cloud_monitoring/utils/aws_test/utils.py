from datetime import datetime, timedelta

import boto3
import json

session = boto3.Session(
    aws_access_key_id='AKIAX2MUDQMLR6Y4PJW3',
    aws_secret_access_key='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',
    region_name='eu-west-2'
)


def get_ec2_instances():
    ec2 = session.client('ec2')
    instances = ec2.describe_instances(Filters=[{'Name': 'instance-state-name', 'Values': ['running']}])
    return instances['Reservations']

def get_cpu_utilization(instance_id):
    cloudwatch = session.client('cloudwatch')
    # Define the time span for the metric data
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(hours=24) # Last 1 hour
    metrics = cloudwatch.get_metric_data(
        MetricDataQueries=[
            {
                'Id': 'cpuUtilization',
                'MetricStat': {
                    'Metric': {
                        'Namespace': 'AWS/EC2',
                        'MetricName': 'CPUUtilization',
                        'Dimensions': [{'Name': 'InstanceId', 'Value': instance_id}]
                    },
                    'Period': 300, # 5 minutes intervals
                    'Stat': 'Average',
                },
                'ReturnData': True,
            },
        ],
        StartTime=start_time,
        EndTime=end_time,
    )
    cpu_metrics = metrics['MetricDataResults'][0]['Values']
    if cpu_metrics:
        return sum(cpu_metrics) / len(cpu_metrics) # Return average CPU utilization
    else:
        return "No data"
#def main():
# ec2_instances = get_ec2_instances()
# for reservation in ec2_instances:
#     for instance in reservation['Instances']:
#         instance_id = instance['InstanceId']
#         cpu_utilization = get_cpu_utilization(instance_id)
#         print(f"Instance ID: {instance_id}, CPU Utilization: {cpu_utilization}%")


# if __name__ == '__main__':
#     main()
    


