from app.aws import AWS
from datetime import datetime, timedelta
import os
from app import client, db
from influxdb_client.client.write_api import SYNCHRONOUS, ASYNCHRONOUS
import sys


class EC2(AWS.AWS):
    def __init__(self, access_key, secret_key, instance_id, instance_name, region_id, account_label):
        super().__init__(access_key, secret_key,account_label)
        self.instance_id = instance_id
        self.instance_name = instance_name
        self.region_id = region_id
        self.response = self.GetEC2Stats()
        self.DumpData()
        self.CheckAlert()

    def GetEC2Stats(self):
        if self.session is None:
            return None

        def GetMetric(id, namespace, metric_name, instance_id):
            return {
                'Id': id,
                'MetricStat': {
                    'Metric': {
                        'Namespace': namespace,
                        'MetricName': metric_name,
                        'Dimensions': [
                            {
                                'Name': 'InstanceId',
                                'Value': instance_id
                            },
                        ]
                    },
                    'Period': 60,
                    'Stat': 'Average'
                },
                'ReturnData': True,
            }

        cloudwatch = self.session.client(
            'cloudwatch', region_name=self.region_id)

        end_time = datetime.utcnow() - timedelta(minutes=20)
        start_time = end_time - timedelta(minutes=5)

        response = cloudwatch.get_metric_data(
            MetricDataQueries=[
                GetMetric('m1', 'AWS/EC2', 'CPUUtilization', self.instance_id),
                GetMetric('m2', 'CWAgent', 'mem_used_percent',
                          self.instance_id),
                GetMetric('m3', 'AWS/EC2', 'NetworkIn', self.instance_id),
                GetMetric('m4', 'AWS/EC2', 'NetworkOut', self.instance_id),
                GetMetric('m5', 'AWS/EC2', 'DiskWriteOps', self.instance_id),
                GetMetric('m6', 'AWS/EC2', 'DiskReadOps', self.instance_id),
                GetMetric('m7', 'AWS/EC2', 'DiskWriteBytes', self.instance_id),
                GetMetric('m8', 'AWS/EC2', 'DiskReadBytes', self.instance_id),
            ],
            StartTime=start_time.isoformat(),
            EndTime=end_time.isoformat()
        )

        response['timestamp'] = end_time.isoformat()

        return self.ParseEC2Stats(response)

    def ParseEC2Stats(self, response):

        data_dict = {
            "instance_id": self.instance_id,
            "instance_name": self.instance_name,
            "account_label": self.account_label,
            "region_id": self.region_id
        }

        if len(response['MetricDataResults'][0]['Values']) == 0:
            data_dict['cpu_utilization'] = [0]
        else:
            data_dict['cpu_utilization'] = response['MetricDataResults'][0]['Values']

        if len(response['MetricDataResults'][1]['Values']) == 0:
            data_dict['memory_utilization'] = [0]
        else:
            data_dict['memory_utilization'] = response['MetricDataResults'][1]['Values']

        if len(response['MetricDataResults'][2]['Values']) == 0:
            data_dict['network_in'] = [0]
        else:
            data_dict['network_in'] = response['MetricDataResults'][2]['Values']

        if len(response['MetricDataResults'][3]['Values']) == 0:
            data_dict['network_out'] = [0]
        else:
            data_dict['network_out'] = response['MetricDataResults'][3]['Values']

        if len(response['MetricDataResults'][4]['Values']) == 0:
            data_dict['disk_in_ops'] = [0]
        else:
            data_dict['disk_in_ops'] = response['MetricDataResults'][4]['Values']

        if len(response['MetricDataResults'][5]['Values']) == 0:
            data_dict['disk_out_ops'] = [0]
        else:
            data_dict['disk_out_ops'] = response['MetricDataResults'][5]['Values']

        if len(response['MetricDataResults'][6]['Values']) == 0:
            data_dict['disk_in_bytes'] = [0]
        else:
            data_dict['disk_in_bytes'] = response['MetricDataResults'][6]['Values']

        if len(response['MetricDataResults'][7]['Values']) == 0:
            data_dict['disk_out_bytes'] = [0]
        else:
            data_dict['disk_out_bytes'] = response['MetricDataResults'][7]['Values']

        data_dict['timestamp'] = response['timestamp']

        return data_dict

    def DumpData(self):
        print("i am in client")
        write_api = client.write_api(write_options=SYNCHRONOUS)
        dictionary = [
            {
                "measurement": "AWS_EC2",
                "tags":
                {"instance_id": self.response['instance_id'],
                 "instance_name": self.response['instance_name'],
                 "account_label":self.response['account_label'],
                 "region_id":self.response['region_id']
                 },
                "time": str(self.response['timestamp']),
                "fields":
                {
                    "cpu_utilization": float(self.response['cpu_utilization'][0]),
                    "memory_utilization": float(self.response['memory_utilization'][0]),
                    "network_in":float(self.response['network_in'][0]),
                    "network_out": float(self.response['network_out'][0]),
                    "disk_in_ops": int(self.response['disk_in_ops'][0]),
                    "disk_out_ops": int(self.response['disk_out_ops'][0]),
                    "disk_in_bytes": float(self.response['disk_in_bytes'][0]),
                    "disk_out_bytes": float(self.response['disk_out_bytes'][0])
                }
            }]

        try:
            write_api.write(bucket='cloud_monitoring', record=dictionary)
        except Exception as e:
            print(f"Database connection issue: {e}", file=sys.stderr)


    def CheckAlert(self):
        cpu = float(self.response['cpu_utilization'][0])
        alertObj = {
            'service_name':'AWS-EC2',
            'service_key':self.instance_name,
            'time':datetime.now(),
            'level': 'None'}

        if cpu > 80:
            alertObj['level'] = "Critical"
            alertObj['description'] = "Extreme CPU Utilization - %.2f" % cpu
        elif cpu > 50:
            alertObj['level'] = "High"
            alertObj['description'] = "High CPU Utilization - %.2f" % cpu
        elif cpu <= 50:
            alertObj['level'] = "Normal"
            alertObj['description'] = "Normal CPU Utilization - %.2f" % cpu

        if alertObj['level'] != "None":
            alertObj['type'] = "CPU Alert"
            self.WriteAlert(alertObj)

        alertObj['level'] = "None"
        memory = self.response['memory_utilization'][0]
        if memory > 80:
            alertObj['level'] = "Critical"
            alertObj['description'] = "Extreme memory_utilization - %.2f" % memory
        elif memory > 50:
            alertObj['level'] = "High"
            alertObj['description'] = "High Memory Utilization - %.2f" % memory
        elif memory <= 50:
            alertObj['level'] = "Normal"
            alertObj['description'] = "Normal Memory Utilization - %.2f" % memory
            

        if alertObj['level'] != "None":
            alertObj['type'] = "Memory Alert"
            self.WriteAlert(alertObj)
