
from flask_apscheduler import APScheduler
from app import app, db
import sys
# from app.aws import connection, ec2monitoring, s3monitoring, elb_monitoring
from app.aws.EC2 import EC2
from app.aws.S3 import S3
from app.aws.ELB import ELB
from app.aws.AWS import AWS
from app.scheduler import scheduler
from flask import request
import threading
import traceback
from datetime import datetime, timedelta


def GetEC2List():
    ec2_list = []
    try:
        ec2_query = "select * from aws_ec2_table where monitoring_status = 'Enabled';"
        result = db.session.execute(ec2_query)

        if result is None:
            print("----->>>>> No EC2 instances found. Exiting", file=sys.stderr)

        else:
            for row in result:
                aws_query = f"select * from aws_credentials_table where access_key = '{row[4]}';"
                aws_cred = db.session.execute(aws_query)
                credentials = aws_cred.fetchone()

                if credentials is None:
                    print(
                        f'----->>>>> No credentials found for EC2 : {row[1]}\n', file=sys.stderr)
                else:
                    data_dict = {'instance_id': row[1],
                                 'instance_name': row[2],
                                 'region_id': row[3],
                                 'access_key': credentials[0],
                                 'secret_key': credentials[1],
                                 'account_label': credentials[2]}

                    ec2_list.append(data_dict)
    except Exception as e:
        print("### Error while Retrieving EC2 from Database \n\n")
        print(e, file=sys.stderr)

    return ec2_list


def GetS3List():
    s3_list = []
    try:
        s3_query = "select * from aws_s3_table where monitoring_status = 'Enabled';"
        result = db.session.execute(s3_query)

        if result is None:
            print("----->>>>> No S3 instances found. Exiting", file=sys.stderr)

        else:
            for row in result:
                aws_query = f"select * from aws_credentials_table where access_key = '{row[3]}';"
                aws_cred = db.session.execute(aws_query)
                credentials = aws_cred.fetchone()

                if credentials is None:
                    print(
                        f'----->>>>> No credentials found for S3 : {row[1]}\n', file=sys.stderr)
                else:
                    data_dict = {
                        'bucket_name': row[1],
                        'region_id': row[2],
                        'access_key': credentials[0],
                        'secret_key': credentials[1],
                        'account_label': credentials[2]}

                    s3_list.append(data_dict)
    except Exception as e:
        print("### Error while Retrieving S3 from Database \n\n")
        print(e, file=sys.stderr)

    return s3_list


def GetElbList():
    elb_list = []
    try:
        elb_query = "select * from aws_elb_table where monitoring_status = 'Enabled';"
        result = db.session.execute(elb_query)

        if result is None:
            print("----->>>>> No elb instances found. Exiting", file=sys.stderr)

        else:
            for row in result:
                aws_query = f"select * from aws_credentials_table where access_key = '{row[6]}';"
                aws_cred = db.session.execute(aws_query)
                credentials = aws_cred.fetchone()

                if credentials is None:
                    print(
                        f'----->>>>> No credentials found for elb : {row[1]}\n', file=sys.stderr)
                else:
                    data_dict = {
                        'lb_name': row[1],
                        'lb_arn': row[4],
                        'region_id': row[5],
                        'access_key': credentials[0],
                        'secret_key': credentials[1],
                        'account_label': credentials[2]}

                    elb_list.append(data_dict)
    except Exception as e:
        print("### Error while Retrieving elb from Database \n\n")
        print(e, file=sys.stderr)

    return elb_list


def GetRDSList():
    rds_list = []
    try:
        query = "select * from aws_rds_table where monitoring_status = 'Enabled';"
        result = db.session.execute(query)

        if result is None:
            print("----->>>>> No RDS instances found. Exiting", file=sys.stderr)

        else:
            for row in result:
                aws_query = f"select * from aws_credentials_table where access_key = '{row[6]}';"
                aws_cred = db.session.execute(aws_query)
                credentials = aws_cred.fetchone()

                if credentials is None:
                    print(
                        f'----->>>>> No credentials found for RDS : {row[1]}\n', file=sys.stderr)
                else:
                    data_dict = {
                        'rds_name': row[1],
                        'rds_class': row[2],
                        'rds_engine': row[3],
                        'rds_status': row[5],
                        'region_id': row[5],
                        'access_key': credentials[0],
                        'secret_key': credentials[1],
                        'account_label': credentials[2]}

                    rds_list.append(data_dict)
    except Exception as e:
        print("### Error while Retrieving RDS from Database \n\n")
        print(e, file=sys.stderr)

    return rds_list


@app.route('/startAWSMonitoring', methods=['GET'])
def AWSMonitoring():
    try:
        print(" I am in try block  of Run AWS Monitoring ", file=sys.stderr)

        RunAWSMonitoring()

        return "operation sucssesfull", 200
    except Exception as e:
        print(" I am in excp block of Run AWS Monitoring", file=sys.stderr)
        error = "Something Went Wrong:", type(e).__name__, str(e)
        print(e, file=sys.stderr)
        return "error", 500


def RunEC2Monitoring(*ec2_list):
    for instance in ec2_list[0]:
        try:
            ec2 = EC2(instance['access_key'], instance['secret_key'],
                      instance['instance_id'], instance['instance_name'], instance['region_id'], instance['account_label'])
            if ec2.response is None:
                print(
                    f"### Error In EC2: {ec2.instance_id} ####\n\n", file=sys.stderr)
            else:
                pass
                print(f"{ec2.response},\n\n", file=sys.stderr)
        except Exception as e:
            print(
                f"\n\n### Error in EC2 Instance : " + instance['instance_name'])
            traceback.print_exc()
            print(e, file=sys.stderr)


def RunS3Monitoring(*s3_list):
    for bucket in s3_list[0]:
        try:
            s3 = S3(bucket['access_key'], bucket['secret_key'],
                    bucket['bucket_name'], bucket['region_id'], bucket['account_label'])
            if s3.response is None:
                print(
                    f"### Error In S3: {s3.bucket_name} ####\n\n", file=sys.stderr)
            else:
                pass
                print(f"{s3.response},\n\n", file=sys.stderr)
        except Exception as e:
            print(
                f"\n\n### Error in S3 Bucket : " + bucket['bucket_name'])
            traceback.print_exc()
            print(e, file=sys.stderr)


def RunELBMonitoring(*elb_list):
    for elb in elb_list[0]:
        try:
            elbObj = ELB(elb['access_key'], elb['secret_key'], elb['lb_arn'],
                         elb['lb_name'], elb['region_id'], elb['account_label'])
            if elbObj.response is None:
                print(
                    f"### Error In ELB: {elbObj.lb_arn} ####\n\n", file=sys.stderr)
            else:
                # pass
                print(f"{elbObj.response},\n\n", file=sys.stderr)
        except Exception as e:
            print(f"\n\n### Error in ELB : " + elb['lb_arn'])
            traceback.print_exc()
            print(e, file=sys.stderr)


def RunRDSMonitoring(*rds_list):
    for rds in rds_list[0]:
        try:
            rdsObj = ELB(rds['access_key'], rds['secret_key'], rds['rds_name'],
                         rds['rds_class'], rds['rds_engine'], rds['rds_status'], rds['region_id'],
                         rds['account_label'])

            if rdsObj.response is None:
                print(
                    f"### Error In RDS: {rdsObj.lb_arn} ####\n\n", file=sys.stderr)
            else:
                # pass
                print(f"{rdsObj.response},\n\n", file=sys.stderr)
        except Exception as e:
            print(f"\n\n### Error in RDS : " + rds['lb_arn'])
            traceback.print_exc()
            print(e, file=sys.stderr)


def RunAWSMonitoring():

    print("\n*** Starting AWS Monitoring ***\n", file=sys.stderr)

    @scheduler.task('interval', id="monitoringAWSEC2", seconds=300)
    def EC2Scheduler():
        ec2_list = GetEC2List()
        print("\nEC2 Scheduler Running\n", file=sys.stderr)
        ec2_thread = threading.Thread(
            target=RunEC2Monitoring, args=(ec2_list,))
        ec2_thread.start()
        ec2_thread.join()

    @scheduler.task('interval', id="monitoringAWSS3", seconds=86400)
    def S3Scheduler():
        print("\nS3 Scheduler Running\n", file=sys.stderr)
        s3_list = GetS3List()
        s3_thread = threading.Thread(target=RunS3Monitoring, args=(s3_list,))
        s3_thread.start()
        s3_thread.join()

    @scheduler.task('interval', id="monitoringAWSELB", seconds=300)
    def ELBScheduler():
        print("\nELB Scheduler Running\n", file=sys.stderr)
        elb_list = GetElbList()
        elb_thread = threading.Thread(
            target=RunELBMonitoring, args=(elb_list,))
        elb_thread.start()
        elb_thread.join()

    @scheduler.task('interval', id="monitoringAWSRDS", seconds=300)
    def RDSScheduler():
        print("\nRDS Scheduler Running\n", file=sys.stderr)
        rds_list = GetRDSList()
        rds_thread = threading.Thread(
            target=RunRDSMonitoring, args=(rds_list,))
        rds_thread.start()
        rds_thread.join()

    EC2Scheduler()
    S3Scheduler()
    ELBScheduler()
    RDSScheduler()

# @app.route('/testS3', methods=['GET'])
# def TestS3():
#     aws = AWS(access_key="AKIAX2MUDQMLTN56W4MS",
#               secrete_key="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")
#     print(aws.GetAllS3(), file=sys.stderr)
#     return "OK", 200


# @app.route('/testEC2', methods=['GET'])
# def TestEC2():
#     aws = AWS(access_key="AKIAX2MUDQMLTN56W4MS",
#               secrete_key="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")
#     print(aws.GetAllEC2(), file=sys.stderr)
#     return "OK", 200


# @app.route('/testELB', methods=['GET'])
# def TestELB():
#     aws = AWS(access_key="AKIAX2MUDQMLTN56W4MS",
#               secrete_key="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")
#     print(aws.GetAllELB(), file=sys.stderr)
#     return "OK", 200


def GenerateMailForCloudAlert(alert, status):

    from datetime import datetime, timedelta
    from app.mail import send_mail
    print("\n### Generating Mails For Cloud Alerts ###\n", file=sys.stderr)
    try:

        mailQuery = "select * from mail_credentials where status = 'active'"
        mail_cred = db.session.execute(mailQuery).fetchone()
        if mail_cred is None:
            return
        mail_cred = dict(mail_cred)
        print("\n---> Active Mail Credentials <---\n", file=sys.stderr)
        print(mail_cred, file=sys.stderr)

        msg = f"""
        SERVEICE NAME  : AWS-EC2
        SERVICE KEY    : MonteX
        ACCOUNT LABEL  : Test Account

        Alert Level    : {alert['level']}
        Alert Type     : {alert['type']}
        Description    : {alert['description']}
        Date/Time      : {alert['time']}
        """

        try:
            recipents = [
                'hamza.zahid@nets-international.com',
                'muhammad.naseem@nets-international.com',
            ]

            subject = f"MonetX - NEW Cloud Alert | {'AWS-EC2'} | {alert['level']}"
            if status == 'Clear':
                subject = f"MonetX - Cloud Alert CLEARED | {'AWS-EC2'} | {alert['level']}"

            send_mail(
                send_from=mail_cred['MAIL'],
                send_to=recipents,
                subject=subject,
                message=msg,
                username=mail_cred['MAIL'],
                password=mail_cred['PASSWORD'],
                server=mail_cred['SERVER']
            )
        except Exception as e:
            print("\n*** ERROR In Mail Generation ***\n")
            traceback.print_exc()
            print(f"\n{e}\n", file=sys.stderr)

    except Exception as e:
        print("\n*** ERROR In Mail Generation ***\n")
        traceback.print_exc()
        print(f"\n{e}\n", file=sys.stderr)


@app.route('/testAlert', methods=['POST'])
def TestAlert():
    alertObj = request.get_json()
    try:
        print("i am in EC2 Alert client")
        query = f"select * from aws_alerts_table where SERVICE_NAME = 'AWS-EC2' and SERVICE_KEY='{alertObj['instance_name']}' and `TYPE` = '{alertObj['type']}' and `STATUS` ='Open';"
        ec2Alert = db.session.execute(query).fetchone()

        currentTime = datetime.now()
        alertObj['time'] = currentTime

        if ec2Alert is not None:

            # Clearing the alert
            if (ec2Alert[4] == "Critical" or ec2Alert[4] == "High") and alertObj['level'] == 'Normal':
                query = f"update aws_alerts_table set `STATUS` = 'Clear' , MODIFICATION_DATE = '{currentTime}' where SERVICE_NAME = 'AWS-EC2' and SERVICE_KEY='{alertObj['instance_name']}' and `TYPE` = '{alertObj['type']}' and `STATUS` ='Open';"
                db.session.execute(query)
                db.session.commit()
                GenerateMailForCloudAlert(alertObj, "Clear")
            else:
                query = f"update aws_alerts_table set `LEVEL` = '{alertObj['level']}', DESCRIPTION = '{alertObj['description']}',STATUS='Open', MODIFICATION_DATE='{currentTime}' where SERVICE_NAME = 'AWS-EC2' and SERVICE_KEY='{alertObj['instance_name']}' and `TYPE` = '{alertObj['type']}' and `STATUS` ='Open';"
                db.session.execute(query)
                db.session.commit()

        elif alertObj['level'] != 'Normal':
            query = f"INSERT INTO aws_alerts_table (`SERVICE_NAME`, `SERVICE_KEY`, `ACCOUNT_LABEL`, `LEVEL`, `TYPE`, `DESCRIPTION`, `CREATETION_DATE`, `MODIFICATION_DATE`) VALUES ('AWS-EC2', '{alertObj['instance_name']}', '{alertObj['account_label']}', '{alertObj['level']}', '{alertObj['type']}', '{alertObj['description']}', '{currentTime}', '{currentTime}');"
            db.session.execute(query)
            db.session.commit()
            GenerateMailForCloudAlert(alertObj, "Open")

    except Exception as e:
        traceback.print_exc()
        print(e,file=sys.stderr)

    return "OK", 200


@app.route('/deleteAWSCloudData',methods=['POST'])
def deleteCloudData():
    try:
        objDict = request.get_json()
        objList = objDict['service_names']
        for service in objList:

            org = 'monetx'
            bucket = 'cloud_monitoring'
            from app import client

            from influxdb_client import InfluxDBClient
            from influxdb_client.client.util.date_utils import get_date_helper

            delete_api = client.delete_api()

            """
            Delete Data
            """
            date_helper = get_date_helper()
            start = "1970-01-01T00:00:00Z"
            stop = date_helper.to_utc(datetime.now())
            delete_api.delete(start, stop, f'_measurement="{service}"',
                            bucket=f'{bucket}', org=f'{org}')
            # delete_api.delete(start, stop, f'_measurement="AWS_S3"',
            #                 bucket=f'{bucket}', org=f'{org}')
            # delete_api.delete(start, stop, f'_measurement="AWS_ELB"',
            #                 bucket=f'{bucket}', org=f'{org}')
            # delete_api.delete(start, stop, f'_measurement="AWS_RDS"',
            #                 bucket=f'{bucket}', org=f'{org}')

            """
            Close client
        """
        return "deleted"

    except Exception as e:
        print("printing exception while deleteing data in influxdb",
              str(e), file=sys.stderr)
        return str(e)