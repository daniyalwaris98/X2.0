from flask import Flask, request, jsonify
from app import app, db
import sys
# from app.aws import connection, ec2monitoring, s3monitoring, elb_monitoring
from app.aws.AWS import AWS
from app.aws.IAM import IAM

from app.middleware import token_required
import traceback


@app.route('/testAWSConnection', methods=['POST'])
@token_required
def TestAWSCredentials(user_data):
    credentials = request.get_json()
    account_label = credentials['account_label']
    access_key = credentials['aws_access_key']
    secret_key = credentials['aws_secret_access_key']
    aws = AWS(access_key, secret_key,account_label)
    if aws.TestConnection() == True:
        return "Connection Succssfull", 200
    else:
        return "Error: Invalid Credentials", 500


@app.route('/addAWSCredentials', methods=['POST'])
@token_required
def AddAWSCredentails(user_data):
    credentials = request.get_json()
    access_key = credentials['aws_access_key']
    secret_key = credentials['aws_secret_access_key']
    account_label = credentials['account_label']

    query = "Select * from aws_credentials_table where `ACCESS_KEY`='{0}';".format(
        access_key)
    result = db.session.execute(query)
    if result.fetchone() is not None:
        return "Access Key Already Exists", 500

    aws = AWS(access_key, secret_key,account_label)
    if aws.TestConnection() == False:
        return "Error: Invalid Credentials", 500

    try:
        insert_query = "INSERT INTO aws_credentials_table (`ACCESS_KEY`,`SECRETE_ACCESS_KEY`,`ACCOUNT_LABEL`) VALUES ('{0}','{1}','{2}')".format(
            access_key, secret_key, account_label)

        db.session.execute(insert_query)
        db.session.commit()
        print("Successfully Inserted Cloud", file=sys.stderr)
        return "Cloud Inserted Successfully", 200
    except Exception as e:
        print(e, file=sys.stderr)
        return "Error: Operation Failed", 500

    # return {'response': "Account Added Successfully", 'access_key': access_key}, 200


@app.route('/getAWSCredentials', methods=['GET'])
@token_required
def GetAWSCredentials(user_data):
    query = "Select * from aws_credentials_table;"
    result = db.session.execute(query)

    data = []
    for row in result:
        objDict = {}
        objDict['aws_access_key'] = row[0]
        objDict['account_label'] = row[2]

        aws = AWS(row[0], row[1],row[2])
        objDict['access_type'] = aws.access_type
        objDict['status'] = aws.TestConnection()

        data.append(objDict)

    return jsonify(data), 200


@app.route('/deleteAWSCredentials', methods=['POST'])
@token_required
def DeleteAWSCredentials(user_data):
    credentials = request.get_json()
    access_key = credentials['aws_access_key']
    query = "select * from aws_credentials_table where `ACCESS_KEY`='{0}';".format(
        access_key)
    result = db.session.execute(query)

    if result.fetchone() is None:
        return "No Record Found Again ACCESS_KEY", 500

    db.session.execute(
        f"DELETE FROM aws_ec2_table WHERE `ACCESS_KEY`='{access_key}';")
    db.session.commit()

    delete_query = "DELETE FROM aws_credentials_table WHERE `ACCESS_KEY`='{}';".format(
        access_key)
    db.session.execute(delete_query)
    db.session.commit()

    return "Record Deleted Successfully", 200


@app.route('/getAllEC2', methods=['GET'])
@token_required
def GetAllEC2FromDatabase(user_data):
    try:
        query = "select * from aws_ec2_table;"
        result = db.session.execute(query)

        data = []
        for row in result:
            cred = db.session.execute(
                f"select * from aws_credentials_table where `ACCESS_KEY`='{row[4]}';")
            cred = cred.fetchone()
            data_dict = {'instance_id': row[1],
                         'instance_name': row[2],
                         'region_id': row[3],
                         'access_key': row[4],
                         'account_label': cred[2],
                         'monitoring_status': row[5]
                         }
            data.append(data_dict)
        return jsonify(data), 200
    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while fetching EC2 data from database", 500


@app.route('/addEC2', methods=['POST'])
@token_required
def AddEC2IntoDatabase(user_data):
    try:
        post = request.get_json()
        result = db.session.execute(
            f"select * from aws_credentials_table where `ACCESS_KEY`='{post['access_key']}';")
        row = result.fetchone()
        if row is None:
            return "Invalid ACCESS_KEY", 500

        post = request.get_json()
        query = f"insert into aws_ec2_table (instance_id,instance_name,region_id,access_key) values ('{post['instance_id']}','{post['instance_name']}','{post['region_id']}','{post['access_key']}');"
        db.session.execute(query)
        db.session.commit()
        return "Data Added Successfully", 200

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while adding EC2 data into database", 500


@app.route('/changeEC2Status', methods=['POST'])
@token_required
def ChangeEC2MontoringStatus(user_data):
    try:
        post = request.get_json()
        if post['monitoring_status'] == "Enabled" or post['monitoring_status'] == "Disabled":
            query = f"update aws_ec2_table set MONITORING_STATUS='{post['monitoring_status']}' where INSTANCE_ID='{post['instance_id']}';"
            db.session.execute(query)
            db.session.commit()
            return "Status Changed Successfully", 200
        else:
            return "Invalid Status", 200

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while fetching EC2 data from database", 500


@app.route('/deleteEC2', methods=['POST'])
@token_required
def DeleteEC2FromDatabase(user_data):
    try:
        post = request.get_json()
        query = f"delete from aws_ec2_table where instance_id= '{post['instance_id']}';"
        db.session.execute(query)
        db.session.commit()
        return "EC2 Deleted Successfully", 200

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while fetching EC2 data from database", 500


@app.route('/reloadEC2', methods=['POST'])
@token_required
def GetAllEC2FromCloud(user_data):
    try:
        credentials = request.get_json()
        access_key = credentials['aws_access_key']

        query = f"Select * from aws_credentials_table where `ACCESS_KEY`='{access_key}';"
        result = db.session.execute(query)

        row = result.fetchone()
        if row is None:
            return "Invalid ACCESS_KEY", 500

        cred_row = dict(row)

        aws = AWS(access_key, cred_row['SECRETE_ACCESS_KEY'],cred_row['ACCOUNT_LABEL'])
        if aws.TestConnection() == False:
            return "Error: Invalid Credentials", 500

        all_ec2 = aws.GetAllEC2()
        print(f"\nFetched From Cloud:\n{all_ec2}\n", file=sys.stderr)

        ec2_list = []

        for ec2 in all_ec2:
            query = f"Select * from aws_ec2_table where instance_id='{ec2['instance_id']}';"
            result = db.session.execute(query).fetchone()

            if result is not None:
                query = f"UPDATE aws_ec2_table SET instance_name = '{ec2['instance_name']}', region_id='{ec2['region_id']}' where instance_id = '{ec2['instance_id']}';"
                db.session.execute(query)
                db.session.commit()

                print(
                    f"\n{ec2['instance_id']} : {ec2['instance_name']} : Already Exists. Updated\n", file=sys.stderr)
            else:
                ec2_list.append(ec2)
                print(
                    f"\n{ec2['instance_id']} : {ec2['instance_name']} : Doesn't Exist. Added To the list\n", file=sys.stderr)

        return jsonify(ec2_list), 200
    except Exception as e:
        traceback.print_exc()
        print(e, file=sys.stderr)
        return "Error While Fetching Data", 500


@app.route('/getEC2MonitoringData', methods=['POST'])
@token_required
def GetEC2MonitoringData(user_data):

    try:
        from app import client
        post = request.get_json()
        instance_id = post['instance_id']

        query_api = client.query_api()
        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "cloud_monitoring")\
            |> range(start: -1d)\
            |> filter(fn: (r) => r["_measurement"] == "AWS_EC2")\
            |> filter(fn: (r) => r["instance_id"] == "{instance_id}")\
            |> schema.fieldsAsCols()\
            |> sort(columns: ["_time"], desc: true)\
            |> yield(name: "unique")'

        result = query_api.query(org='monetx', query=query)

        response = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:

                        objDict['instance_id'] = record["instance_id"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['instance_id'] = "Nill"
                        pass
                    try:

                        objDict['instance_name'] = record["instance_name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['instance_name'] = "Nill"
                        pass
                    try:

                        objDict['region_id'] = record["region_id"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['region_id'] = "Nill"
                        pass

                    try:
                        objDict['account_label'] = record["account_label"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['account_label'] = "Nill"
                        pass

                    try:
                        objDict['cpu_utilization'] = record["cpu_utilization"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['cpu_utilization'] = 0.0
                        pass

                    try:
                        objDict['memory_utilization'] = record["memory_utilization"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['memory_utilization'] = 0.0
                        pass

                    try:
                        objDict['network_in'] = record["network_in"]/1000
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['network_in'] = 0.0
                        pass

                    try:
                        objDict['network_out'] = record["network_out"]/1000
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['network_out'] = 0.0
                        pass

                    try:
                        objDict['disk_in_ops'] = record["disk_in_ops"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['disk_in_ops'] = 0.0
                        pass

                    try:

                        objDict['disk_out_ops'] = record["disk_out_ops"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['disk_out_ops'] = 0.0
                        pass
                    try:

                        objDict['disk_in_bytes'] = record["disk_in_bytes"]/1000
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['disk_in_bytes'] = 0.0
                        pass
                    try:

                        objDict['disk_out_bytes'] = record["disk_out_bytes"]/1000
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['disk_out_bytes'] = 0.0
                        pass

                    try:

                        objDict['timestamp'] = record["_time"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['timestamp'] = "Nill"
                        pass

                    response.append(objDict)

            # print(response, file=sys.stderr)

            if len(response) > 0:
                return jsonify(response[0]), 200

            return "No Data Found", 200
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            return "Error ", 500

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error While Fetching Data From EC2", 500


@app.route('/getEC2TimeSeriesData', methods=['POST'])
@token_required
def GetEC2TimeSeriesData(user_data):

    try:
        from app import client
        post = request.get_json()
        instance_id = post['instance_id']

        query_api = client.query_api()
        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "cloud_monitoring")\
            |> range(start: -1d)\
            |> filter(fn: (r) => r["_measurement"] == "AWS_EC2")\
            |> filter(fn: (r) => r["instance_id"] == "{instance_id}")\
            |> schema.fieldsAsCols()\
            |> sort(columns: ["_time"], desc: true)\
            |> yield(name: "unique")'

        result = query_api.query(org='monetx', query=query)

        response = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        objDict['instance_id'] = record["instance_id"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['instance_id'] = "Nill"
                        pass
                    try:
                        objDict['instance_name'] = record["instance_name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['instance_name'] = "Nill"
                        pass
                    try:
                        objDict['region_id'] = record["region_id"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['region_id'] = "Nill"
                        pass
                    try:
                        objDict['account_label'] = record["account_label"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['account_label'] = "Nill"
                        pass
                    try:
                        objDict['cpu_utilization'] = record["cpu_utilization"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['cpu_utilization'] = 0.0
                        pass
                    try:
                        objDict['memory_utilization'] = record["memory_utilization"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['memory_utilization'] = 0.0
                        pass
                    try:
                        objDict['network_in'] = record["network_in"]/1000
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['network_in'] = 0.0
                        pass

                    try:
                        objDict['network_out'] = record["network_out"]/1000
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['network_out'] = 0.0
                        pass

                    try:
                        objDict['disk_in_ops'] = record["disk_in_ops"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['disk_in_ops'] = 0.0
                        pass

                    try:
                        objDict['disk_out_ops'] = record["disk_out_ops"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['disk_out_ops'] = 0.0
                        pass
                    try:
                        objDict['disk_in_bytes'] = record["disk_in_bytes"]/1000
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['disk_in_bytes'] = 0.0
                        pass
                    try:
                        objDict['disk_out_bytes'] = record["disk_out_bytes"]/1000
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['disk_out_bytes'] = 0.0
                        pass

                    try:
                        objDict['timestamp'] = record["_time"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['timestamp'] = "Nill"
                        pass

                    response.append(objDict)

            # print(response, file=sys.stderr)

            if len(response) > 0:
                return jsonify(response), 200

            return "No Data Found", 500
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            return "Error ", 500

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error While Fetching Data From EC2", 500


# accepts nothing
# return response = [{bucket_name, region_id, access_key, account_label, monitoring_status}]
@app.route('/getAllS3', methods=['GET'])
@token_required
def GetAllS3FromDatabase(user_data):
    try:
        query = "select * from aws_s3_table;"
        result = db.session.execute(query)

        data = []
        for row in result:
            cred = db.session.execute(
                f"select * from aws_credentials_table where `ACCESS_KEY`='{row[3]}';")
            cred = cred.fetchone()
            data_dict = {'bucket_name': row[1],
                         'region_id': row[2],
                         'access_key': row[3],
                         'account_label': cred[2],
                         'monitoring_status': row[4]
                         }
            data.append(data_dict)
        return jsonify(data), 200
    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while fetching S3 data from database", 500


# accept post['bucket_name'], post['region_id'], post['access_key']
@app.route('/addS3', methods=['POST'])
@token_required
def AddS3IntoDatabase(user_data):
    try:
        post = request.get_json()
        result = db.session.execute(
            f"select * from aws_credentials_table where `ACCESS_KEY`='{post['access_key']}';")
        row = result.fetchone()
        if row is None:
            return "Invalid ACCESS_KEY", 500

        post = request.get_json()
        query = f"insert into aws_s3_table (bucket_name,region_id,access_key) values ('{post['bucket_name']}','{post['region_id']}','{post['access_key']}');"
        db.session.execute(query)
        db.session.commit()
        return "S3 Deleted Successfully", 200

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while adding S3 data into database", 500


# accepts bucket_name , monitoring_status
@app.route('/changeS3Status', methods=['POST'])
@token_required
def ChangeS3MonitoringStatus(user_data):
    try:
        post = request.get_json()
        if post['monitoring_status'] == "Enabled" or post['monitoring_status'] == "Disabled":
            query = f"update aws_s3_table set MONITORING_STATUS='{post['monitoring_status']}' where BUCKET_NAME='{post['bucket_name']}';"
            db.session.execute(query)
            db.session.commit()
            return "Status Changed Successfully", 200
        else:
            return "Invalid Status", 200

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while fetching S3 data from database", 500

# accepts bucket_name


@app.route('/deleteS3', methods=['POST'])
@token_required
def DeleteS3FromDatabase(user_data):
    try:
        post = request.get_json()
        query = f"delete from aws_s3_table where bucket_name= '{post['bucket_name']}';"
        db.session.execute(query)
        db.session.commit()
        return "Data Added Successfully", 200

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while fetching S3 data from database", 500


# accepts aws_access_key
# return response = [{bukcet_name, region_id}]
@app.route('/reloadS3', methods=['POST'])
@token_required
def GetAllS3FromCloud(user_data):
    try:
        credentials = request.get_json()
        access_key = credentials['aws_access_key']

        query = "Select * from aws_credentials_table where `ACCESS_KEY`='{0}';".format(
            access_key)
        result = db.session.execute(query)

        row = result.fetchone()
        if row is None:
            return "Invalid ACCESS_KEY", 500

        cred_row = dict(row)

        aws = AWS(access_key, cred_row['SECRETE_ACCESS_KEY'],cred_row['ACCOUNT_LABEL'])
        if aws.TestConnection() == False:
            return "Error: Invalid Credentials", 500

        all_s3 = aws.GetAllS3()
        s3_list = []
        for s3 in all_s3:
            query = f"Select * from aws_s3_table where bucket_name='{s3['bucket_name']}';"
            result = db.session.execute(query).fetchone()
            if result is None:
                s3_list.append(s3)
                print(
                    f"\n{s3['bucket_name']} : Doesn't Exist. Added To the list\n", file=sys.stderr)

            else:
                query = f"UPDATE aws_s3_table SET  region_id='{s3['region_id']}' where bucket_name = '{s3['bucket_name']}';"
                db.session.execute(query)
                db.session.commit()

                print(
                    f"\n{s3['bucket_name']} : Already Exists. Updated\n", file=sys.stderr)
                
                

        return jsonify(s3_list), 200
    except Exception as e:
        traceback.print_exc()
        print(e, file=sys.stderr)
        return "Error in S3", 500


# accepts bucket_name
# return response = {bukcet_name, region_id, account_label, bucket_size, number_of_objects, timestamp}
@app.route('/getS3MonitoringData', methods=['POST'])
@token_required
def GetS3MonitoringData(user_data):

    try:
        from app import client
        post = request.get_json()
        bucket_name = post['bucket_name']

        query_api = client.query_api()
        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "cloud_monitoring")\
            |> range(start: -10d)\
            |> filter(fn: (r) => r["_measurement"] == "AWS_S3")\
            |> filter(fn: (r) => r["bucket_name"] == "{bucket_name}")\
            |> schema.fieldsAsCols()\
            |> yield(name: "unique")'

        result = query_api.query(org='monetx', query=query)

        response = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        objDict['bucket_name'] = record["bucket_name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['bucket_name'] = "Nill"
                        pass

                    try:
                        objDict['region_id'] = record["region_id"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['region_id'] = "Nill"
                        pass

                    try:
                        objDict['account_label'] = record["account_label"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['account_label'] = "Nill"
                        pass

                    try:
                        objDict['bucket_size'] = record["bucket_size"] / \
                            (1000*1000*1000)
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['bucket_size'] = 0.0
                        pass

                    try:
                        objDict['number_of_objects'] = record["number_of_objects"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['number_of_objects'] = 0.0
                        pass

                    try:
                        objDict['timestamp'] = record["_time"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['timestamp'] = "Nill"
                        pass

                    response.append(objDict)

            print(response, file=sys.stderr)

            if len(response) > 0:
                return jsonify(response[0]), 200

            return "No Data Found For S3 In Influx", 200
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            return "Error ", 500

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error While Fetching Data From S3", 500


# accepts bucket_name
# return response = [{bukcet_name, region_id, account_label, bucket_size, number_of_objects, timestamp}]
@app.route('/getS3TimeSeriesData', methods=['POST'])
@token_required
def GetS3TimeSeriesData(user_data):

    try:
        from app import client
        post = request.get_json()
        bucket_name = post['bucket_name']

        print(bucket_name, file=sys.stderr)

        query_api = client.query_api()
        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "cloud_monitoring")\
            |> range(start: -10d)\
            |> filter(fn: (r) => r["_measurement"] == "AWS_S3")\
            |> filter(fn: (r) => r["bucket_name"] == "{bucket_name}")\
            |> schema.fieldsAsCols()\
            |> sort(columns: ["_time"], desc: true)\
            |> yield(name: "unique")'

        result = query_api.query(org='monetx', query=query)

        response = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        objDict['bucket_name'] = record["bucket_name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['bucket_name'] = "Nill"
                        pass

                    try:
                        objDict['region_id'] = record["region_id"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['region_id'] = "Nill"
                        pass

                    try:
                        objDict['account_label'] = record["account_label"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['account_label'] = "Nill"
                        pass

                    try:
                        objDict['bucket_size'] = record["bucket_size"] / \
                            (1000*1000*1000)
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['bucket_size'] = 0.0
                        pass

                    try:
                        objDict['number_of_objects'] = record["number_of_objects"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['number_of_objects'] = 0.0
                        pass

                    try:
                        objDict['timestamp'] = record["_time"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['timestamp'] = "Nill"
                        pass

                    response.append(objDict)

            print(response, file=sys.stderr)

            if len(response) > 0:
                return jsonify(response), 200

            return "No Data Found For S3 In Influx", 200
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            return "Error ", 500

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error While Fetching Data From S3", 500


@app.route('/reloadELB', methods=['POST'])
@token_required
def GetAllELBFromCloud(user_data):
    try:
        credentials = request.get_json()
        access_key = credentials['aws_access_key']

        query = "Select * from aws_credentials_table where `ACCESS_KEY`='{0}';".format(
            access_key)
        result = db.session.execute(query)

        row = result.fetchone()
        if row is None:
            return "Invalid ACCESS_KEY", 500

        cred_row = dict(row)

        aws = AWS(access_key, cred_row['SECRETE_ACCESS_KEY'],cred_row['account_label'])
        if aws.TestConnection() == False:
            return "Error: Invalid Credentials", 500
        
        all_elb = aws.GetAllELB()
        elb_list=[]
        for elb in all_elb:
            query = f"Select * from aws_elb_table where lb_arn='{elb['lb_arn']}';"
            result = db.session.execute(query).fetchone()
            if result is None:
                elb_list.append(elb)
                print(
                    f"\n{elb['lb_name']} : Doesn't Exist. Added To the list\n", file=sys.stderr)

            else:
                query = f"UPDATE aws_elb_table SET  lb_name = '{elb['lb_name']}',lb_scheme = '{elb['lb_scheme']}',lb_type = '{elb['lb_type']}', region_id='{elb['region_id']}' where lb_name = '{elb['lb_name']}';"
                db.session.execute(query)
                db.session.commit()

                print(
                    f"\n{elb['lb_name']} : Already Exists. Updated\n", file=sys.stderr)


        return jsonify(elb_list), 200
    except Exception as e:
        traceback.print_exc()
        print(e, file=sys.stderr)
        return "Error in S3", 500


# accepts nothing
# return response = [{bucket_name, region_id, access_key, account_label, monitoring_status}]
@app.route('/getAllELB', methods=['GET'])
@token_required
def GetAllELBFromDatabase(user_data):
    try:
        query = "select * from aws_elb_table;"
        result = db.session.execute(query)

        data = []
        for row in result:
            cred = db.session.execute(
                f"select * from aws_credentials_table where `ACCESS_KEY`='{row[6]}';")
            cred = cred.fetchone()
            data_dict = {'lb_name': row[1],
                         'lb_type': row[2],
                         'lb_scheme': row[3],
                         'lb_arn': row[4],
                         'region_id': row[5],
                         'access_key': row[6],
                         'account_label': cred[2],
                         'monitoring_status': row[7]
                         }
            data.append(data_dict)
        return jsonify(data), 200
    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while fetching ELB data from database", 500


# accept post['bucket_name'], post['region_id'], post['access_key']
@app.route('/addELB', methods=['POST'])
@token_required
def AddELBIntoDatabase(user_data):
    try:
        post = request.get_json()
        result = db.session.execute(
            f"select * from aws_credentials_table where `ACCESS_KEY`='{post['access_key']}';")
        row = result.fetchone()
        if row is None:
            return "Invalid ACCESS_KEY", 500

        post = request.get_json()
        query = f"insert into aws_elb_table (lb_name,lb_type,lb_scheme,lb_arn,region_id,access_key) values ('{post['lb_name']}','{post['lb_type']}','{post['lb_scheme']}','{post['lb_arn']}','{post['region_id']}','{post['access_key']}');"
        db.session.execute(query)
        db.session.commit()
        return "Data Added Successfully", 200

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while adding ELB data into database", 500


# accepts lb_arn , monitoring_status
@app.route('/changeELBStatus', methods=['POST'])
@token_required
def ChangeELBMonitoringStatus(user_data):
    try:
        post = request.get_json()
        if post['monitoring_status'] == "Enabled" or post['monitoring_status'] == "Disabled":
            query = f"update aws_elb_table set MONITORING_STATUS='{post['monitoring_status']}' where LB_ARN='{post['lb_arn']}';"
            db.session.execute(query)
            db.session.commit()
            return "Status Changed Successfully", 200
        else:
            return "Invalid Status", 200

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while fetching ELB data from database", 500

# accepts lb_arn


@app.route('/deleteELB', methods=['POST'])
@token_required
def DeleteELBFromDatabase(user_data):
    try:
        post = request.get_json()
        query = f"delete from aws_elb_table where LB_ARN = '{post['lb_arn']}';"
        db.session.execute(query)
        db.session.commit()
        return "ELB Deleted Successfully", 200

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while fetching ELB data from database", 500


@app.route('/getELBMonitoringData', methods=['POST'])
def GetELBMonitoringData():
    try:
        from app import client
        post = request.get_json()
        lb_arn = post['lb_arn']

        query_api = client.query_api()
        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "cloud_monitoring")\
            |> range(start: -60d)\
            |> filter(fn: (r) => r["_measurement"] == "AWS_ELB")\
            |> filter(fn: (r) => r["lb_arn"] == "{lb_arn}")\
            |> schema.fieldsAsCols()\
            |> sort(columns: ["_time"], desc: true)\
            |> yield(name: "unique")'

        result = query_api.query(org='monetx', query=query)

        response = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        objDict['lb_arn'] = record["lb_arn"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['lb_arn'] = "Nill"
                        pass

                    try:
                        objDict['lb_name'] = record["lb_name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['lb_name'] = "Nill"
                        pass

                    try:
                        objDict['region_id'] = record["region_id"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['region_id'] = "Nill"
                        pass

                    try:
                        objDict['account_label'] = record["account_label"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['account_label'] = "Nill"
                        pass

                    try:
                        objDict['HTTPCode_ELB_2XX_Count'] = int(
                            record["HTTPCode_ELB_2XX_Count"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['HTTPCode_ELB_2XX_Count'] = 0
                        pass

                    try:
                        objDict['HTTPCode_ELB_3XX_Count'] = int(
                            record["HTTPCode_ELB_3XX_Count"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['HTTPCode_ELB_3XX_Count'] = 0
                        pass

                    try:
                        objDict['HTTPCode_ELB_4XX_Count'] = int(
                            record["HTTPCode_ELB_4XX_Count"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['HTTPCode_ELB_4XX_Count'] = 0
                        pass

                    try:
                        objDict['HTTPCode_ELB_5XX_Count'] = int(
                            record["HTTPCode_ELB_5XX_Count"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['HTTPCode_ELB_5XX_Count'] = 0
                        pass

                    try:
                        objDict['RequestCount'] = int(record["RequestCount"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['RequestCount'] = 0
                        pass

                    try:
                        objDict['HealthyHostCount'] = int(
                            record["HealthyHostCount"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['HealthyHostCount'] = 0
                        pass

                    try:
                        objDict['ConsumedLCUs'] = int(record["ConsumedLCUs"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['ConsumedLCUs'] = 0
                        pass

                    try:
                        objDict['NewConnectionCount'] = int(
                            record["NewConnectionCount"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['NewConnectionCount'] = 0
                        pass

                    try:
                        objDict['timestamp'] = record["_time"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['timestamp'] = "Nill"
                        pass

                    response.append(objDict)

            if len(response) > 0:
                return jsonify(response[0]), 200

            return "No Data Found For ELB In Influx", 200
        except Exception as e:
            print(f"Error : {e}", file=sys.stderr)
            return "Error ", 500

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error While Fetching Data From ELB", 500


@app.route('/getELBTimeSeriesData', methods=['POST'])
def GetELBTimeSeriesData():
    try:
        from app import client
        post = request.get_json()
        lb_arn = post['lb_arn']

        query_api = client.query_api()
        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "cloud_monitoring")\
            |> range(start: -1d)\
            |> filter(fn: (r) => r["_measurement"] == "AWS_ELB")\
            |> filter(fn: (r) => r["lb_arn"] == "{lb_arn}")\
            |> schema.fieldsAsCols()\
            |> sort(columns: ["_time"], desc: true)\
            |> yield(name: "unique")'

        result = query_api.query(org='monetx', query=query)

        response = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        objDict['lb_arn'] = record["lb_arn"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['lb_arn'] = "Nill"
                        pass

                    try:
                        objDict['lb_name'] = record["lb_name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['lb_name'] = "Nill"
                        pass

                    try:
                        objDict['region_id'] = record["region_id"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['region_id'] = "Nill"
                        pass

                    try:
                        objDict['account_label'] = record["account_label"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['account_label'] = "Nill"
                        pass

                    try:
                        objDict['HTTPCode_ELB_2XX_Count'] = int(
                            record["HTTPCode_ELB_2XX_Count"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['HTTPCode_ELB_2XX_Count'] = 0
                        pass

                    try:
                        objDict['HTTPCode_ELB_3XX_Count'] = int(
                            record["HTTPCode_ELB_3XX_Count"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['HTTPCode_ELB_3XX_Count'] = 0
                        pass

                    try:
                        objDict['HTTPCode_ELB_4XX_Count'] = int(
                            record["HTTPCode_ELB_4XX_Count"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['HTTPCode_ELB_4XX_Count'] = 0
                        pass

                    try:
                        objDict['HTTPCode_ELB_5XX_Count'] = int(
                            record["HTTPCode_ELB_5XX_Count"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['HTTPCode_ELB_5XX_Count'] = 0
                        pass

                    try:
                        objDict['RequestCount'] = int(record["RequestCount"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['RequestCount'] = 0
                        pass

                    try:
                        objDict['HealthyHostCount'] = int(
                            record["HealthyHostCount"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['HealthyHostCount'] = 0
                        pass

                    try:
                        objDict['ConsumedLCUs'] = int(record["ConsumedLCUs"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['ConsumedLCUs'] = 0
                        pass

                    try:
                        objDict['NewConnectionCount'] = int(
                            record["NewConnectionCount"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['NewConnectionCount'] = 0
                        pass

                    try:
                        objDict['timestamp'] = record["_time"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['timestamp'] = "Nill"
                        pass

                    response.append(objDict)

            # print(response, file=sys.stderr)

            if len(response) > 0:
                return jsonify(response), 200

            return "No Data Found For S3 In Influx", 200
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            return "Error ", 500

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error While Fetching Data From S3", 500


#############################
# RDS - Routs
#############################

@app.route('/getAllRDS', methods=['GET'])
@token_required
def GetAllRDSFromDatabase(user_data):
    try:
        query = "select * from aws_RDS_table;"
        result = db.session.execute(query)

        data = []
        for row in result:
            cred = db.session.execute(
                f"select * from aws_credentials_table where `ACCESS_KEY`='{row[4]}';")
            cred = cred.fetchone()
            data_dict = {'rds_name': row[1],
                         'rds_class': row[2],
                         'rds_engine': row[3],
                         'rds_status': row[4],
                         'region_id': row[5],
                         'access_key': row[6],
                         'account_label': cred[2],
                         'monitoring_status': row[7]
                         }
            data.append(data_dict)
        return jsonify(data), 200
    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while fetching RDS data from database", 500


@app.route('/addRDS', methods=['POST'])
@token_required
def AddRDSIntoDatabase(user_data):
    try:
        post = request.get_json()
        result = db.session.execute(
            f"select * from aws_credentials_table where `ACCESS_KEY`='{post['access_key']}';")
        row = result.fetchone()
        if row is None:
            return "Invalid ACCESS_KEY", 500

        post = request.get_json()
        query = f"insert into aws_rds_table (rds_name,rds_class,rds_engine,rds_status,region_id,access_key) values ('{post['rds_name']}','{post['rds_class']}','{post['rds_engine']}','{post['rds_status']}','{post['region_id']}','{post['access_key']}');"
        db.session.execute(query)
        db.session.commit()
        return "Data Added Successfully", 200

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while adding RDS data into database", 500


@app.route('/changeRDSStatus', methods=['POST'])
@token_required
def ChangeRDSMontoringStatus(user_data):
    try:
        post = request.get_json()
        if post['monitoring_status'] == "Enabled" or post['monitoring_status'] == "Disabled":
            query = f"update aws_rds_table set MONITORING_STATUS='{post['monitoring_status']}' where RDS_NAME='{post['rds_name']}';"
            db.session.execute(query)
            db.session.commit()
            return "Status Changed Successfully", 200
        else:
            return "Invalid Status", 200

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while fetching RDS data from database", 500





@app.route('/deleteRDS', methods=['POST'])
@token_required
def DeleteRDSFromDatabase(user_data):
    try:
        post = request.get_json()
        query = f"delete from aws_rds_table where RDS_NAME= '{post['rds_name']}';"
        db.session.execute(query)
        db.session.commit()
        return "RDS Deleted Successfully", 200

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error while fetching RDS data from database", 500


@app.route('/reloadRDS', methods=['POST'])
@token_required
def GetAllRDSFromCloud(user_data):
    try:
        credentials = request.get_json()
        access_key = credentials['aws_access_key']

        query = f"Select * from aws_credentials_table where `ACCESS_KEY`='{access_key}';"
        result = db.session.execute(query)

        row = result.fetchone()
        if row is None:
            return "Invalid ACCESS_KEY", 500

        cred_row = dict(row)

        aws = AWS(access_key, cred_row['SECRETE_ACCESS_KEY'])
        if aws.TestConnection() == False:
            return "Error: Invalid Credentials", 500

        all_rds = aws.GetAllRDS()
        print(f"\nFetched From Cloud:\n{all_rds}\n", file=sys.stderr)

        rds_list = []

        for rds in all_rds:
            query = f"Select * from aws_rds_table where `ACCESS_KEY`='{access_key}' and RDS_NAME='{rds['rds_name']}';"
            result = db.session.execute(query).fetchone()

            if result is not None:
                query = f"UPDATE aws_rds_table SET rds_class = '{rds['rds_class']}',rds_engine = '{rds['rds_engine']}',rds_status = '{rds['rds_status']}', region_id='{rds['region_id']}' where RDS_NAME = '{rds['rds_name']}';"
                db.session.execute(query)
                db.session.commit()

                print(
                    f"\n{rds['rds_name']} : Already Exists. Updated\n", file=sys.stderr)
            else:
                rds_list.append(rds)
                print(
                    f"\n{rds['rds_name']} : Doesn't Exist. Added To the list\n", file=sys.stderr)

        return jsonify(rds_list), 200
    except Exception as e:
        traceback.print_exc()
        print(e, file=sys.stderr)
        return "Error While Fetching Data", 500
    



@app.route('/getRDSMonitoringData', methods=['POST'])
def GetRDSMonitoringData():
    try:
        from app import client
        post = request.get_json()
        rds_name = post['rds_name']

        query_api = client.query_api()
        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "cloud_monitoring")\
            |> range(start: -60d)\
            |> filter(fn: (r) => r["_measurement"] == "AWS_RDS")\
            |> filter(fn: (r) => r["rds_name"] == "{rds_name}")\
            |> schema.fieldsAsCols()\
            |> sort(columns: ["_time"], desc: true)\
            |> yield(name: "unique")'

        result = query_api.query(org='monetx', query=query)

        response = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        objDict['rds_name'] = record["rds_name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['rds_name'] = "Nill"
                        pass

                    try:
                        objDict['rds_class'] = record["rds_class"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['rds_class'] = "Nill"
                        pass

                    try:
                        objDict['rds_engine'] = record["rds_engine"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['rds_engine'] = "Nill"
                        pass

                    try:
                        objDict['rds_status'] = record["rds_status"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['rds_status'] = "Nill"
                        pass

                    try:
                        objDict['region_id'] = record["region_id"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['region_id'] = "Nill"
                        pass

                    try:
                        objDict['account_label'] = record["account_label"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['account_label'] = "Nill"
                        pass

                    try:
                        objDict['CPUUtilization'] = float(
                            record["CPUUtilization"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['CPUUtilization'] = 0
                        pass

                    try:
                        objDict['DatabaseConnections'] = int(
                            record["DatabaseConnections"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['DatabaseConnections'] = 0
                        pass

                    try:
                        objDict['FreeStorageSpace'] = float(
                            record["FreeStorageSpace"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['FreeStorageSpace'] = 0
                        pass

                    try:
                        objDict['WriteIOPS'] = int(
                            record["WriteIOPS"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['WriteIOPS'] = 0
                        pass

                    try:
                        objDict['ReadIOPS'] = int(record["ReadIOPS"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['ReadIOPS'] = 0
                        pass

                    try:
                        objDict['NetworkReceiveThroughput'] = float(
                            record["NetworkReceiveThroughput"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['NetworkReceiveThroughput'] = 0
                        pass

                    try:
                        objDict['NetworkTransmitThroughput'] = float(record["NetworkTransmitThroughput"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['NetworkTransmitThroughput'] = 0
                        pass

                    try:
                        objDict['timestamp'] = record["_time"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['timestamp'] = "Nill"
                        pass

                    response.append(objDict)

            if len(response) > 0:
                return jsonify(response[0]), 200

            return "No Data Found For ELB In Influx", 200
        except Exception as e:
            print(f"Error : {e}", file=sys.stderr)
            return "Error ", 500

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error While Fetching Data From ELB", 500


@app.route('/getRDSTimeSeriesData', methods=['POST'])
def GetRDSTimeSeriesData():
    try:
        from app import client
        post = request.get_json()
        rds_name = post['rds_name']

        query_api = client.query_api()
        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "cloud_monitoring")\
            |> range(start: -1d)\
            |> filter(fn: (r) => r["_measurement"] == "AWS_RDS")\
            |> filter(fn: (r) => r["rds_name"] == "{rds_name}")\
            |> schema.fieldsAsCols()\
            |> sort(columns: ["_time"], desc: true)\
            |> yield(name: "unique")'

        result = query_api.query(org='monetx', query=query)

        response = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        objDict['rds_name'] = record["rds_name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['rds_name'] = "Nill"
                        pass

                    try:
                        objDict['rds_class'] = record["rds_class"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['rds_class'] = "Nill"
                        pass

                    try:
                        objDict['rds_engine'] = record["rds_engine"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['rds_engine'] = "Nill"
                        pass

                    try:
                        objDict['rds_status'] = record["rds_status"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['rds_status'] = "Nill"
                        pass

                    try:
                        objDict['region_id'] = record["region_id"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['region_id'] = "Nill"
                        pass

                    try:
                        objDict['account_label'] = record["account_label"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['account_label'] = "Nill"
                        pass

                    try:
                        objDict['CPUUtilization'] = float(
                            record["CPUUtilization"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['CPUUtilization'] = 0
                        pass

                    try:
                        objDict['DatabaseConnections'] = int(
                            record["DatabaseConnections"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['DatabaseConnections'] = 0
                        pass

                    try:
                        objDict['FreeStorageSpace'] = float(
                            record["FreeStorageSpace"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['FreeStorageSpace'] = 0
                        pass

                    try:
                        objDict['WriteIOPS'] = int(
                            record["WriteIOPS"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['WriteIOPS'] = 0
                        pass

                    try:
                        objDict['ReadIOPS'] = int(record["ReadIOPS"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['ReadIOPS'] = 0
                        pass

                    try:
                        objDict['NetworkReceiveThroughput'] = float(
                            record["NetworkReceiveThroughput"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['NetworkReceiveThroughput'] = 0
                        pass

                    try:
                        objDict['NetworkTransmitThroughput'] = float(record["NetworkTransmitThroughput"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['NetworkTransmitThroughput'] = 0
                        pass

                    try:
                        objDict['timestamp'] = record["_time"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict['timestamp'] = "Nill"
                        pass

                    response.append(objDict)

            # print(response, file=sys.stderr)

            if len(response) > 0:
                return jsonify(response), 200

            return "No Data Found For S3 In Influx", 200
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            return "Error ", 500

    except Exception as e:
        print(e, file=sys.stderr)
        return "Error While Fetching Data From S3", 500




@app.route('/getIAMUsers', methods=['post'])
# @token_required
def GetIAMUsers():
    try:
        post = request.get_json()
        access_key = post['access_key']
        query = "Select * from aws_credentials_table where `ACCESS_KEY`='{0}';".format(
            access_key)
        result = db.session.execute(query)

        row = result.fetchone()
        if row is None:
            return "Invalid ACCESS_KEY", 500

        cred_row = dict(row)

        aws = AWS(access_key, cred_row['SECRETE_ACCESS_KEY'],cred_row['ACCOUNT_LABEL'])
        if aws.TestConnection() == False:
            return "Error: Invalid Credentials", 500
        
        try:
            iam = IAM(access_key, cred_row['SECRETE_ACCESS_KEY'],cred_row['ACCOUNT_LABEL'])
            return jsonify(iam.GetUsers()),200
        except Exception as e:
            traceback.print_exc()
            return "Error While Fetching Data From IAM", 500

    except Exception as e:
        traceback.print_exc()
        return "Error While Validating Credentials", 500



@app.route('/getIAMRoles', methods=['post'])
# @token_required
def GetIAMRoles():
    try:
        post = request.get_json()
        access_key = post['access_key']
        query = "Select * from aws_credentials_table where `ACCESS_KEY`='{0}';".format(
            access_key)
        result = db.session.execute(query)

        row = result.fetchone()
        if row is None:
            return "Invalid ACCESS_KEY", 500

        cred_row = dict(row)

        aws = AWS(access_key, cred_row['SECRETE_ACCESS_KEY'],cred_row['ACCOUNT_LABEL'])
        if aws.TestConnection() == False:
            return "Error: Invalid Credentials", 500
        
        try:
            iam = IAM(access_key, cred_row['SECRETE_ACCESS_KEY'],cred_row['ACCOUNT_LABEL'])
            return jsonify(iam.GetRoles()),200
        except Exception as e:
            traceback.print_exc()
            return "Error While Fetching Data From IAM", 500

    except Exception as e:
        traceback.print_exc()
        return "Error While Validating Credentials", 500



@app.route('/getIAMGroups', methods=['post'])
# @token_required
def GetIAMGroup():
    try:
        post = request.get_json()
        access_key = post['access_key']
        query = "Select * from aws_credentials_table where `ACCESS_KEY`='{0}';".format(
            access_key)
        result = db.session.execute(query)

        row = result.fetchone()
        if row is None:
            return "Invalid ACCESS_KEY", 500

        cred_row = dict(row)

        aws = AWS(access_key, cred_row['SECRETE_ACCESS_KEY'],cred_row['ACCOUNT_LABEL'])
        if aws.TestConnection() == False:
            return "Error: Invalid Credentials", 500
        
        try:
            iam = IAM(access_key, cred_row['SECRETE_ACCESS_KEY'],cred_row['ACCOUNT_LABEL'])
            return jsonify(iam.GetGroups()),200
        except Exception as e:
            traceback.print_exc()
            return "Error While Fetching Data From IAM", 500

    except Exception as e:
        traceback.print_exc()
        return "Error While Validating Credentials", 500


