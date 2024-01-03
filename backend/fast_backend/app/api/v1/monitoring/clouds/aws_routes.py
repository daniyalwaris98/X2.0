import traceback

from fastapi import FastAPI,responses
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.models.monitoring_models import *
from app.models.aws_models import *
from app.schema.aws_schema import *
from app.api.v1.monitoring.clouds.pullers.AWS import *

router = APIRouter(
    prefix="/monitoring_clouds",
    tags=["monitoring_cloud"]
)


@router.get('/testing_cloud')
def testing_cloud_route():
    try:
        return {"message":"tesitng route cloud"}
    except Exception as e:
        traceback.print_exc()


@router.post('/test_aws_connection',
            responses={
                200:{"model":AwsCredentialScehma},
                500:{"model":str}
            },
            summary="testing aws connection",
            description="testing aws connection"
            )
def test_aws_connection(testObj:AwsCredentialScehma):
    try:
        testObj = dict(testObj)
        print("error occured while testing connection")
        account_label = testObj['account_label']
        access_key = testObj['aws_access_key']
        secret_key = testObj['aws_secret_access_key']
        aws = AWS(
            access_key,
            secret_key,
            account_label
        ) #AWS is a puller and needd upgradation
        if aws.TestConnection() == True:
            return JSONResponse(content="Connection Successful"),200
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Testing AWS connection",status_code=500)


@router.post("/add_aws_credentials",
             responses={
                 200:{"model":AwsCredentialScehma}
             },
             summary = "Add aws credentials",
             description="Add aws credentials"
             )
def add_aws_credentials(addAws:AwsCredentialScehma):
    try:
        addAwsObj = dict(addAws)
        access_key = addAwsObj['aws_access_key']
        secret_key = addAwsObj['aws_secret_access_key']
        account_label = addAwsObj['account_label']
        aws_query = configs.db.query(AWS_CREDENTIALS).filter_by(access_key = access_key).first()
        if aws_query is not None:
            return  f"{aws_query.access_key} : Access Key already exsist",400

        aws = AWS(access_key,secret_key,account_label)
        if aws.TestConnection() == False:
            return f"{aws.access_key} : Invalid Credentials"

        try:
            aws_model = AWS_CREDENTIALS()
            aws_model.access_key = access_key,
            aws_model.secrete_access_key = secret_key
            aws_model.account_label = account_label
            InsertDBData(aws_model)
        except Exception as e:
            traceback.print_exc()
            print("Error Occured While DB insertion::::::::::::",file=sys.stderr)
    except Exception as e:
        traceback.print_exc()


@router.get('/get_aws_credentials',
            responses={
                200:{"model":list[GetAwsSchema]},
                500:{"model":str}
            },
            summary="get all aws credentials",
            description="get all aws credentials"
            )
def get_all_aws_credentials():
    try:
        aws_lst = []
        aws = configs.db.query(AWS_CREDENTIALS).all()
        for all in aws:
            print("all in aws is:::::::::::::::::::;;",all,file=sys.stderr)
            aws_dict = {
                "aws_access_key":all.access_key,
                "account_label":all.account_label
            }
            awsObj = AWS(all.access_key,all.secret_key,all.account_label)
            aws_dict['access_type'] = awsObj.access_type
            aws_dict['status'] = awsObj.TestConnection()
            print("aws dict is::::::::::::::::::::",aws_dict,file=sys.stderr)
            aws_lst.append(aws_dict)
        print("aws list is:::::::::::::::::::::::::",aws_lst,file=sys.stderr)
        return JSONResponse(content = aws_lst,status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content = "Error Occured While getting aws credentials",status_code=500)


@router.get('/get_all_ec2',
            responses={
                200:{"model":str},
                500:{"model":str}
            },
            summary="API to get all EC2",
            description="Get all EC2"
            )
def get_all_ec2():
    try:
        data_lst = []
        ec2_query = configs.db.query(AWS_EC2).all()
        print("ec2 query is:::::::::::::::::",ec2_query,file=sys.stderr)
        for row in ec2_query:
            print("row is:::::::::::::::;;;",row,file=sys.stderr)
            cred = configs.db.query(AWS_CREDENTIALS).filter_by(access_key = row.access_key).first()
            data_dict = {
                "instance_id":row.instance_id,
                "instance_name":row.instance_name,
                "region_id":row.region_id,
                "access_key":row.access_key,
                "account_label":cred.account_label,
                "monitoring_status":cred.monitoring_status
            }
            print("data dict is::::::::::",data_dict,file=sys.stderr)
            data_lst.append(data_dict)
        print("data lst is::::::::::::::::::::",data_lst,file=sys.stderr)
    except Exception as e:
        traceback.print_exc()

@router.post('/add_ec2',
             responses= {
                 200:{"model":AddEc2Schema},
                 400:{"model":str},
                 500:{"model":str}
             },
             summary="Use this api to add ec2",
             description="use this api to add ec2"
             )
def add_ec2(ec2Obj:str):
    try:
        aws_credentials = configs.db.query(AWS_CREDENTIALS).filter_by(access_key = ec2Obj['access_key']).first()
        if aws_credentials is None:
                return f"{ec2Obj['access_key']} : Is invalid",400
        ec2 = AWS_EC2()
        ec2.instance_id = ec2Obj['instance_id']
        ec2.instance_name = ec2Obj['instance_name']
        ec2.region_id = ec2Obj['region_id']
        ec2.access_key = ec2Obj['access_key']
        InsertDBData(ec2)
        print("data inserted to the db:::::::",file=sys.stderr)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content = "Error Occured while adding aws EC2",status_code=500)

@router.post('/change_ec2_status',
             responses = {
                 200:{"model":UpdateEc2Status},
                 400:{"model":str},
                 500:{"model":str}
             },
             summary="change status of ec2",
             description="Change Status of EC2"
             )
def change_ec2_status(ec2_status:str):
    try:
        if ec2_status['monitoring_status'] == "Enabled" or ec2_status['monitoring_status'] == "Disabled":
            ec2_object = configs.db.query(AWS_EC2).filter(instance_id = ec2_status['instance_id']).first()
            if ec2_object:
                ec2_object.monitoring_status = ec2_status['monitoring_status']
                UpdateDBData(ec2_object)
                print("Aws ec2 is updated:::::::::::::",file=sys.stderr)
                return JSONResponse(content = "data updated in aws ec2",status_code=200)
            else:
                return "Invalid Status",400
    except Exception as e:
        traceback.print_exc()
        return  JSONResponse(content="Error Occured While chnaing ec2 status",status_code=500)


@router.post('/reload_ec2',
             responses = {
                 200:{"model":str},
                 400:{"model":str},
                 500:{"model":str}
             },
             summary="api to reload ec2",
             description="api to reload ec2"
             )
def reload_ec2(ec2_obj:str):
    try:
        ec2_obj = AWS_EC2()
        access_key = ec2_obj['aws_access_key']
        aws_query = configs.db.query(AWS_EC2).filter_by(access_key = access_key).first()
        if aws_query is None:
            return JSONResponse(content = "Invalid Access Key",status_code=400)

        credential_data = dict(aws_query)
        aws = AWS(access_key,credential_data['secret_access_key'],credential_data['account_label'])
        if aws.TestConnection() == False:
            return "Invalid EC2 credentials"
        all_ec2 = aws.GetAllEC2()
        print(f"fetched from EC2::{all_ec2}",file=sys.stderr)
        ec2_lst = []
        for ec2 in all_ec2:
            result = configs.db.query(AWS_EC2).filter_by(instance_id = ec2['instance_id']).first()
            if result is not None:
               ec2_obj.instance_name = ec2['instance_name']
               ec2_obj.region_id = ec2['region_id']
               UpdateDBData(ec2_obj)
               print(f"{ec2['instance_name']} : {ec2['region_id']} : Is updated")
            else:
                ec2_lst.append(ec2)
                print("vallues appended to the ec2 lst:::::",file=sys.stderr)
        return JSONResponse(content = ec2_lst,status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content = "Error Occured While reloading ec2",status_code=500)


@router.get('/get_all_s3',
            responses={
                200:{"model":list[GetEc3Schema]},
                500:{"model":str}
            },
            summary="api to get all s3",
            description="api to get all s3"
            )
def get_all_s3():
    try:
        data = []
        aws_s3 = configs.db.query(AWS_S3).all()
        for row in aws_s3:
            credentials = configs.db.query(AWS_CREDENTIALS).filter_by(access_key = row.access_key).first()
            data_dict = {
                'bucket_name':row.access_key,
                'region_id':row.region_id,
                'account_label':credentials.account_label,
                'monitoring_status':credentials.monitoring_status
            }
            data.append(data_dict)
        print("data list is:::::::::::::::::::::",data,file=sys.stderr)
        return JSONResponse(content = data,status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured while getting S3",status_code=500)



@router.post('/reload_s3',
             responses = {
                 200:{"model":str},
                 400:{"model":str},
                 500:{"model":str}
             },
             summary="API to reload the S3",
             description="API to reload the S3"
             )
def reload_s3(s3_obj:str):
    try:
        s3_lst = []
        aws_s3 = AWS_S3()
        access_key = s3_obj['aws_access_key']
        aws_credentials = configs.db.query(AWS_CREDENTIALS).filter_by(access_key == s3_obj['access_key'].format()).first()
        print("aws credentials is::::::::;",aws_credentials,file=sys.stderr)
        if aws_credentials is None:
            return "Invalid Access Key",400
        credentials = dict(aws_credentials)
        aws = AWS(access_key,credentials['secret_access_key'],credentials['account_label'])
        if aws.TestConnection() == False:
            return "Error Invalid Credentials",400
        all_s3 = aws.GetAllS3()
        for s3 in all_s3:
            aws_s3_table = configs.db.query(AWS_S3).filter_by(bucket_name = s3['bucket_name']).first()
            if aws_s3_table is None:
                s3_lst.append(s3)
                print(f"{s3['bucket_name']} : Does not exsist added to the list")
            else:
                aws_s3_table.region_id = s3['region_id']
                UpdateDBData(aws_s3_table)
                print("SW3 table updated and reload successful",file=sys.stderr)

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content = "Error Occured while reloading the S3",status_code=500)


print("changes",file=sys.stderr)


# @app.route("/get")
# def get_Test():
#     return "error"

@router.post("/reload_elb",
             responses={
                 200:{"model":str},
                 400:{"model":str},
                 500:{"model":str}
             },
             summary="API to reload the AWS ELB",
             description="API to reload AWS ELB"
             )
def reload_elb(credentials:str):
    try:
        credentials = dict(credentials)
        aws_access_key = credentials['aws_access_key']
        access_key = configs.db.query(AWS_CREDENTIALS).filter_by(access_key = aws_access_key).first()
        if access_key:
            credentials_row = dict(access_key)
            print("credentials row are:::::::::::::::",credentials_row,file=sys.stderr)
            aws = AWS(
                 access_key,
                 credentials_row['secret_access_key'],
                credentials_row['account_label']
             )
            if aws.TestConnection() == False:
                return JSONResponse(content="Error : Invalid Credentials", status_code=401)
            all_elb = aws.GetAllELB()
            print("elb is::::::::::::::",all_elb,file=sys.stderr)
            elb_list = []
            for elb in all_elb:
                elb_exsist = configs.db.query(AWS_ELB).filter_by(lb_arn=elb['lb_arn']).firsd()
                if elb_exsist:
                    elb_list.append(elb)
                else:
                    elb_name_exsist = configs.db.query(AWS_ELB).filter_by(lb_name = elb['lb_name']).first()
                    if elb_name_exsist:
                        elb_name_exsist.lb_name = elb['lb_name']
                        elb_name_exsist.lb_scheme = elb['lb_scheme']
                        elb_name_exsist.lb_type = elb['lb_type']
                        elb_name_exsist.region_id = elb['region_id']
                        configs.db.merge(elb_name_exsist)
                        configs.db.commit()
                        print("ELB Already Exsist and updated",file=sys.stderr)
                    pass
        else:
            return JSONResponse(content=f"{aws_access_key} : Not Found",status_code=400)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Reloading the Elb",status_code=500)


@router.get('/get_all_elb',
             responses = {
                 200:{"model":str},
                 500:{"model":str}
             },
             summary = "Get ALL ELB Data",
             description = "Get ALL ELB"
             )
def get_all_elb():
    try:
        elb_list= []
        elb_data = configs.db.query(AWS_ELB).all()
        for data in elb_data:
            elb_dict = {
                "id":data.id,
                "lb_name":data.lb_name,
                "lb_type":data.lb_type,
                "lb_scheme":data.lb_scheme,
                "lb_arn":data.lb_arn,
                "monitoring_status":data.monitoring_status,
                "access_key":data.access_key
            }
            elb_list.append(elb_dict)
        return elb_list
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Fetching the ELB data",status_code=500)


@router.post('/add_elb',responses = {
    200:{"model":str},
    400:{"model":str},
    500:{"model":str}
},
summary="API to add elb",
description="API to add elb"
)
def add_elb(credentials:str):
    try:
        credential = dict(credentials)
        credential_exsist = configs.db.query(AWS_CREDENTIALS).filter_by(access_key=credential['access_key']).first()
        if credential_exsist is None:
            return JSONResponse(content="Invalid Access Key",status_code=400)
        elb = AWS_ELB()
        elb.lb_name = credential['lb_name']
        elb.lb_type = credential['lb_type']
        elb.lb_scheme = credential['lb_scheme']
        elb.lb_arn = credential['lb_arn']
        elb.region_id = credential['region_id']
        elb.access_key = credential['access_key']
        InsertDBData(elb)
        return JSONResponse(content="ELB Inserted Successfully",status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error Occured While Adding ELB",status_code=500)



@router.post('change_elb_status',
             responses = {
                 200:{"model":str},
                 400:{"model":str},
                 500:{"model":str}
             },
             summary="API to Change ELB Status",
             description="api TO CHANGE THE ELB STATUS"
             )
def change_elb_status(status:str):
    try:
        status = dict(status)
        if status['monitoring_status'] == "Enabled" or status['monitoring_status']=="Disabled":
            elb_exsist = configs.db.query(AWS_ELB).filter_by(lb_arn = status['lb_arn']).first()
            if elb_exsist:
                elb_exsist.status =status['monitoring_status']
                UpdateDBData(elb_exsist)
            else:
                return JSONResponse(content="AWS ELB does not exsist",status_code=400)
    except Exception as e:
        traceback.print_exc()