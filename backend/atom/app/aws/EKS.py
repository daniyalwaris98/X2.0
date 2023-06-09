from app.aws import AWS
from datetime import datetime, timedelta
import os
from app import client, db
from influxdb_client.client.write_api import SYNCHRONOUS, ASYNCHRONOUS
import sys


class EKS(AWS.AWS):
     def __init__(self, access_key, secret_key, cluster, region_id, account_label):
        super().__init__(access_key, secret_key,account_label)
        self.cluster = cluster
        self.region_id = region_id
        # self.response = self.GetEC2Stats()
        # self.DumpData()
        # self.CheckAlert()

    