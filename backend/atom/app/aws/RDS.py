from app.aws.AWS import AWS
import sys
from datetime import datetime, timedelta
from app import client
from influxdb_client.client.write_api import SYNCHRONOUS, ASYNCHRONOUS


class RDS(AWS):
    def __init__(self, access_key, secret_key, rds_name, rds_class, rds_engine, rds_status, region_id, account_label):
        super().__init__(access_key, secret_key,account_label)
        self.rds_name = rds_name
        self.rds_class = rds_class
        self.rds_engine = rds_engine
        self.rds_status = rds_status
        self.region_id = region_id

    def GetELBStats(self):

        metric_names = [
        'CPUUtilization',
        'DatabaseConnections',
        'FreeStorageSpace',
        'WriteIOPS',
        'ReadIOPS',
        'NetworkReceiveThroughput',
        'NetworkTransmitThroughput']

        cloudwatch_client = self.session.client('cloudwatch',region_name=self.region_id)

        # end_time = datetime.datetime.now(tz=timezone)
        # start_time = end_time - datetime.timedelta(hours=3)

        end_time = datetime.utcnow() - timedelta(minutes=10)
        start_time = end_time - timedelta(minutes=5)

        print(start_time,file=sys.stderr)

        metric_queries = []
        for i, metric_name in enumerate(metric_names):
            metric_query={
                    'Id':f'm{i}',
                    'MetricStat': {
                        'Metric': {
                            'Namespace': 'AWS/RDS',
                            'MetricName': metric_name,
                            'Dimensions': [
                                {
                                    'Name': 'DBInstanceIdentifier',
                                    'Value': self.rds_name
                                }
                            ]
                        },
                        'Period': 60,  # data granularity in seconds
                        'Stat': 'Average'  # aggregate function for the data
                    },
                    'ReturnData': True
            }
            metric_queries.append(metric_query)

        response = cloudwatch_client.get_metric_data(
            MetricDataQueries=metric_queries,
            StartTime=start_time,
            EndTime=end_time,
        )

        response['timestamp'] = end_time.isoformat()
        return self.ParseELBStats(response)
    
    def ParseELBStats(self, response):
        data_dict = {
            "rds_name": self.lb_arn,
            "rds_class":self.lb_name,
            "rds_engine":self.rds_engine,
            "rds_status":self.rds_status,
            "region_id":self.region_id,
            "account_label": self.account_label,
        }

        if len(response['MetricDataResults'][0]['Values']) == 0:
            data_dict['CPUUtilization'] = [0]
        else:
            data_dict['CPUUtilization'] = response['MetricDataResults'][0]['Values']

        if len(response['MetricDataResults'][1]['Values']) == 0:
            data_dict['DatabaseConnections'] = [0]
        else:
            data_dict['DatabaseConnections'] = response['MetricDataResults'][1]['Values']

        if len(response['MetricDataResults'][2]['Values']) == 0:
            data_dict['FreeStorageSpace'] = [0]
        else:
            data_dict['FreeStorageSpace'] = response['MetricDataResults'][2]['Values']
        
        if len(response['MetricDataResults'][3]['Values']) == 0:
            data_dict['WriteIOPS'] = [0]
        else:
            data_dict['WriteIOPS'] = response['MetricDataResults'][3]['Values']
        
        if len(response['MetricDataResults'][4]['Values']) == 0:
            data_dict['ReadIOPS'] = [0]
        else:
            data_dict['ReadIOPS'] = response['MetricDataResults'][4]['Values']
        
        if len(response['MetricDataResults'][5]['Values']) == 0:
            data_dict['NetworkReceiveThroughput'] = [0]
        else:
            data_dict['NetworkReceiveThroughput'] = response['MetricDataResults'][5]['Values']

        if len(response['MetricDataResults'][6]['Values']) == 0:
            data_dict['NetworkTransmitThroughput'] = [0]
        else:
            data_dict['NetworkTransmitThroughput'] = response['MetricDataResults'][6]['Values']

        data_dict['timestamp'] = response['timestamp']
        
        return data_dict


    def DumpData(self):
        print("i am in RDS client")
        write_api = client.write_api(write_options=SYNCHRONOUS)
        dictionary = [
            {
                "measurement": "AWS_RDS",
                "tags":
                {
                 "rds_name" : self.response['rds_name'],
                 "rds_class": self.response['rds_class'],
                 "rds_engine": self.response['rds_engine'],
                 "rds_status":self.response['rds_status'],
                 "account_label":self.response['account_label'],
                 "region_id":self.response['region_id']
                 },
                "time": str(self.response['timestamp']),
                "fields":
                {
                    "CPUUtilization":float(self.response["CPUUtilization"][0]),
                    "DatabaseConnections":int(self.response["DatabaseConnections"][0]),
                    "FreeStorageSpace":float(self.response["FreeStorageSpace"][0]),
                    "WriteIOPS":int(self.response["WriteIOPS"][0]),
                    "ReadIOPS":int(self.response["ReadIOPS"][0]),
                    "NetworkReceiveThroughput":float(self.response["NetworkReceiveThroughput"][0]),
                    "NetworkTransmitThroughput":float(self.response["NetworkTransmitThroughput"][0]),
                }
            }]
        
        try:
            write_api.write(bucket='cloud_monitoring', record=dictionary)
        except Exception as e:
            print(f"Database connection issue: {e}",file=sys.stderr)

