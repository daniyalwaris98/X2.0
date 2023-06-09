from app.aws.AWS import AWS
import sys
from datetime import datetime, timedelta
from app import client
from influxdb_client.client.write_api import SYNCHRONOUS, ASYNCHRONOUS


class ELB(AWS):
    def __init__(self, access_key, secret_key, lb_arn,lb_name, region_id, account_label):
        super().__init__(access_key, secret_key,account_label)
        self.lb_arn = lb_arn
        self.lb_name = lb_name
        self.region_id = region_id
        self.response = self.GetELBStats()
        self.DumpData()

    
    def GetELBStats(self):

        metric_names = ['HTTPCode_ELB_2XX_Count', 'HTTPCode_ELB_3XX_Count', 'HTTPCode_ELB_4XX_Count',
                        'HTTPCode_ELB_5XX_Count', 'RequestCount', 'HealthyHostCount',
                        'ConsumedLCUs', 'ActiveConnectionCount',"NewConnectionCount"]

        cloudwatch_client = self.session.client('cloudwatch',region_name=self.region_id)

        # end_time = datetime.datetime.now(tz=timezone)
        # start_time = end_time - datetime.timedelta(hours=3)

        end_time = datetime.utcnow() - timedelta(minutes=20)
        start_time = end_time - timedelta(minutes=5)

        print(start_time,file=sys.stderr)

        metric_queries = []
        for i, metric_name in enumerate(metric_names):
            metric_query={
                    'Id':f'm{i}',
                    'MetricStat': {
                        'Metric': {
                            'Namespace': 'AWS/ApplicationELB',
                            'MetricName': metric_name,
                            'Dimensions': [
                                {
                                    'Name': 'LoadBalancer',
                                    'Value': self.lb_arn
                                }
                            ]
                        },
                        'Period': 60,  # data granularity in seconds
                        'Stat': 'Sum'  # aggregate function for the data
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
            "lb_arn": self.lb_arn,
            "lb_name":self.lb_name,
            "region_id":self.region_id,
            "account_label": self.account_label,
        }

        if len(response['MetricDataResults'][0]['Values']) == 0:
            data_dict['HTTPCode_ELB_2XX_Count'] = [0]
        else:
            data_dict['HTTPCode_ELB_2XX_Count'] = response['MetricDataResults'][0]['Values']

        if len(response['MetricDataResults'][1]['Values']) == 0:
            data_dict['HTTPCode_ELB_3XX_Count'] = [0]
        else:
            data_dict['HTTPCode_ELB_3XX_Count'] = response['MetricDataResults'][1]['Values']

        if len(response['MetricDataResults'][2]['Values']) == 0:
            data_dict['HTTPCode_ELB_4XX_Count'] = [0]
        else:
            data_dict['HTTPCode_ELB_4XX_Count'] = response['MetricDataResults'][2]['Values']
        
        if len(response['MetricDataResults'][3]['Values']) == 0:
            data_dict['HTTPCode_ELB_5XX_Count'] = [0]
        else:
            data_dict['HTTPCode_ELB_5XX_Count'] = response['MetricDataResults'][3]['Values']
        
        if len(response['MetricDataResults'][4]['Values']) == 0:
            data_dict['RequestCount'] = [0]
        else:
            data_dict['RequestCount'] = response['MetricDataResults'][4]['Values']
        
        if len(response['MetricDataResults'][5]['Values']) == 0:
            data_dict['HealthyHostCount'] = [0]
        else:
            data_dict['HealthyHostCount'] = response['MetricDataResults'][5]['Values']

        if len(response['MetricDataResults'][6]['Values']) == 0:
            data_dict['ConsumedLCUs'] = [0]
        else:
            data_dict['ConsumedLCUs'] = response['MetricDataResults'][6]['Values']

        if len(response['MetricDataResults'][7]['Values']) == 0:
            data_dict['ActiveConnectionCount'] = [0]
        else:
            data_dict['ActiveConnectionCount'] = response['MetricDataResults'][7]['Values']

        if len(response['MetricDataResults'][8]['Values']) == 0:
            data_dict['NewConnectionCount'] = [0]
        else:
            data_dict['NewConnectionCount'] = response['MetricDataResults'][8]['Values']

        data_dict['timestamp'] = response['timestamp']
        

        return data_dict



    def DumpData(self):
        print("i am in ELB client")
        write_api = client.write_api(write_options=SYNCHRONOUS)
        dictionary = [
            {
                "measurement": "AWS_ELB",
                "tags":
                {
                 "lb_arn" : self.response['lb_arn'],
                 "lb_name": self.response['lb_name'],
                 "account_label":self.response['account_label'],
                 "region_id":self.response['region_id']
                 },
                "time": str(self.response['timestamp']),
                "fields":
                {
                    "HTTPCode_ELB_2XX_Count":int(self.response["HTTPCode_ELB_2XX_Count"][0]),
                    "HTTPCode_ELB_3XX_Count":int(self.response["HTTPCode_ELB_3XX_Count"][0]),
                    "HTTPCode_ELB_4XX_Count":int(self.response["HTTPCode_ELB_4XX_Count"][0]),
                    "HTTPCode_ELB_5XX_Count":int(self.response["HTTPCode_ELB_5XX_Count"][0]),
                    "RequestCount":int(self.response["RequestCount"][0]),
                    "HealthyHostCount":int(self.response["HealthyHostCount"][0]),
                    "ConsumedLCUs":int(self.response["ConsumedLCUs"][0]), 
                    "ActiveConnectionCount":int(self.response["ActiveConnectionCount"][0]),
                    "NewConnectionCount":int(self.response["NewConnectionCount"][0]),
                }
            }]
        
        try:
            write_api.write(bucket='cloud_monitoring', record=dictionary)
        except Exception as e:
            print(f"Database connection issue: {e}",file=sys.stderr)