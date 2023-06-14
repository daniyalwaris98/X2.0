import gzip
import imp
from lib2to3.pgen2 import token
import sys
import json
import traceback
from flask_jsonpify import jsonify
from flask import Flask, request, make_response, Response
from app import app, db
import hashlib
import jwt
from datetime import datetime, timezone, timedelta
from app.models.inventory_models import USER_TABLE, LOGIN_ACTIVITY_TABLE
from app.middleware import token_required
import hashlib
import secrets
import string


@app.route('/', methods=['GET'])
def setup():
    response = {
        'end-user':False,
        'license':False,
        'admin':False
    }

    try:
        query = f"select * from end_user_table;"
        result = db.session.execute(query).fetchone()
        if result is not None:
            response['end_user'] = True
    except Exception:
        pass

    try:
        query = f"select * from user_table where ;"
        result = db.session.execute(query).fetchone()
        if result is not None:
            response['admin'] = True
    except Exception:
        pass

@app.route('/createSuperUser')
def SuperUser():
    pass


def login_activity(user_id,operation,status,timestamp,description):
    try:
        activity = LOGIN_ACTIVITY_TABLE()
        activity.user_id = user_id
        activity.operation = operation
        activity.description = description
        activity.status = status
        activity.timestamp=timestamp

        db.session.add(activity)
        db.session.commit()
    except Exception:
        print("Error While Saving Login Activity")

@app.route("/login", methods=['POST'])
def Login():
    if True:
        try:
            current_time = datetime.now()    
            postData = request.get_json()
            username = postData['user']
            password = postData['pass']
            configuration = None

            user_exists = USER_TABLE.query.filter_by(user_id=username).first()

            if user_exists.status !="Active":
                login_activity(username,'Login',"Failed",current_time,"User Inactive")
                return jsonify({'message': 'User is Inactive'}), 401

            queryString = f"select configuration from user_table INNER JOIN admin_roles ON user_table.role_id = admin_roles.role_id  where admin_roles.ROLE_ID='{user_exists.role}';"
            result = db.session.execute(queryString)
            for row in result:
                configuration = row[0]

            if configuration is None:
                return jsonify({'message': 'No Configuration found'}), 401
            
            
            if username.lower() == (user_exists.user_id).lower()  and password == user_exists.password:        
                    queryString1 = f"update user_table set LAST_LOGIN='{datetime.now()}' where USER_ID='{username}';"
                    db.session.execute(queryString1)
                    db.session.commit()
                    
                    token = jwt.encode(
                    {"user_id": user_exists.user_id, "user_role": user_exists.role, "user_status": user_exists.status,
                        "iat": datetime.now(), "exp": datetime.now()+timedelta(hours=72), "monetx_configuration": configuration},
                                app.config["SECRET_KEY"],
                                algorithm="HS256"
                            )
                    print(token, file=sys.stderr)
                    user_exists.last_login = datetime.now()
                    try:
                        db.session.merge(user_exists)
                        db.session.commit()
                    except:
                        db.session.rollback()
                        print("Something else went wrong", file=sys.stderr)
                    return jsonify({'response': "Login Successful", "code": "200", "auth-key": token})
            
            else:
                print("Invalid Username or Password", file=sys.stderr)
                login_activity(username,'Login',"Failed",current_time,"Invalid Credentials")
                return jsonify({'message': 'Invalid Username or Password'}), 401

        except Exception as e:
            traceback.print_exc()
            print(str(e),file=sys.stderr)
            return "Error While Login", 500

    else: 
        print("Authentication Failed Login Credentials", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed Login Credentials'}), 401


@app.route("/getUserByToken", methods=['GET'])
@token_required
def GetUserByToken(user_Data):
    if True:

        user_info = {}
        try:
            
            user_info["user_name"] = user_Data.get("user_id")
            user_info["user_role"] = user_Data.get("user_role")
            user_info["monetx_configuration"] = user_Data.get("monetx_configuration")
            # user_info['user_name'] = 'Hamza'
            # user_info['user_role'] = 'Developer'
            print(user_info, file=sys.stderr)
            content = gzip.compress(json.dumps(user_info).encode('utf8'), 5)
            response = make_response(content)
            response.headers['Content-length'] = len(content)
            response.headers['Content-Encoding'] = 'gzip'
            print(response, file=sys.stderr)
            return response
        
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            print("Failed to get user details", file=sys.stderr)
            return jsonify({'message': 'Failed to get user details'}), 401
    else: 
        print("Authentication Failed Login Credentials", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed Login Credentials'}), 401

@app.route('/licenseVerification',methods = ['POST'])
@token_required
def LicenseVerification(user_data):
    if True:
        try:
            licenseObj = request.get_json()
            userName = licenseObj['username']
            company_name  = ""
            license_status = ""
            queryString = f"select COMPANY_NAME from user_table where user_id='{userName}';"
            result = db.session.execute(queryString)
            for row in result:
                company_name+=row[0]
            if company_name=="":
                return "Company Not Listed",500
            else:
                queryString1 = f"select license_status from end_user_table where company_name='{company_name}';"
                result = db.session.execute(queryString1)
                for row in result:
                    license_status+=row[0]
                    if license_status=="TRUE":
                        return "True",200
                    else:
                        return "License Not Found",500 

        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503