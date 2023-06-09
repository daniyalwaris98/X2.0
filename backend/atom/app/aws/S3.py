from app.aws.AWS import AWS
import pytz
from datetime import datetime, timedelta
from app import client
from influxdb_client.client.write_api import SYNCHRONOUS, ASYNCHRONOUS
import sys


class S3(AWS):
    def __init__(self, access_key, secret_key, bucket_name, region_id, account_label):
        super().__init__(access_key, secret_key,account_label)
        self.bucket_name = bucket_name
        self.region_id = region_id
        self.response = self.GetS3Stats()
        self.DumpData()

    def GetSizeMetric(self, id, metric_name):
        return {
            'Id': id,
            'MetricStat': {
                'Metric': {
                    'Namespace': 'AWS/S3',
                    'MetricName': metric_name,
                    'Dimensions': [
                        {
                            'Name': 'BucketName',
                            'Value': self.bucket_name
                        },
                        {
                            'Name': 'StorageType',
                            'Value': 'StandardStorage'
                        }
                    ]
                },
                'Period': 60,
                'Stat': 'Average',
                'Unit': 'Bytes'
            },
            'ReturnData': True
        }

    def GetMetric(self, id, metric_name, storage_type):
        return {
            'Id': id,
            'MetricStat': {
                'Metric': {
                    'Namespace': 'AWS/S3',
                    'MetricName': metric_name,
                    'Dimensions': [
                        {
                            'Name': 'BucketName',
                            'Value': self.bucket_name
                        },
                        {
                            'Name': 'StorageType',
                            'Value': storage_type
                        }
                    ]
                },
                'Period': 60,
                'Stat': 'Sum',
                'Unit': 'Count'
            },
            'ReturnData': True
        }

    def GetS3Stats(self):
        if self.session is None:
            return None

        cloudwatch = self.session.client(
            'cloudwatch', region_name=self.region_id)
        # timezone = pytz.timezone('Europe/London')
        # end_time = datetime.datetime.now(tz=timezone)
        # start_time = end_time - datetime.timedelta(days=15)

        end_time = datetime.utcnow() - timedelta(days=2)
        start_time = end_time - timedelta(days=1)

        response = cloudwatch.get_metric_data(
            MetricDataQueries=[
                self.GetSizeMetric('m1', 'BucketSizeBytes'),
                self.GetMetric('m2', 'NumberOfObjects', 'AllStorageTypes')
            ],

            StartTime=start_time.isoformat(),
            EndTime=end_time.isoformat()
        )

        response['timestamp'] = end_time.isoformat()

        return self.ParseS3Stats(response)

    def ParseS3Stats(self, response):
        data_dict = {
            "bucket_name": self.bucket_name,
            "region_id":self.region_id,
            "account_label": self.account_label,
        }

        if len(response['MetricDataResults'][0]['Values']) == 0:
            data_dict['bucket_size'] = [0]
        else:
            data_dict['bucket_size'] = response['MetricDataResults'][0]['Values']

        if len(response['MetricDataResults'][1]['Values']) == 0:
            data_dict['number_of_objects'] = [0]
        else:
            data_dict['number_of_objects'] = response['MetricDataResults'][1]['Values']

        data_dict['timestamp'] = response['timestamp']
        # return {

        #     "bucket_size": response['MetricDataResults'][0]['Values'],
        #     "number_of_objects": response['MetricDataResults'][1]['Values']
        # }

        # print(data_dict,file=sys.stderr)

        return data_dict
    
    def DumpData(self):
        print("i am in client")
        write_api = client.write_api(write_options=SYNCHRONOUS)
        dictionary = [
            {
                "measurement": "AWS_S3",
                "tags":
                {
                 "bucket_name": self.response['bucket_name'],
                 "account_label":self.response['account_label'],
                 "region_id":self.response['region_id']
                 },
                "time": str(self.response['timestamp']),
                "fields":
                {
                    "bucket_size": float(self.response['bucket_size'][0]),
                    "number_of_objects": int(self.response['number_of_objects'][0]),
                }
            }]
        
        try:
            write_api.write(bucket='cloud_monitoring', record=dictionary)
        except Exception as e:
            print(f"Database connection issue: {e}",file=sys.stderr)
