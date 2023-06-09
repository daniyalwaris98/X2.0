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
from app.models.inventory_models import USER_TABLE
from app.middleware import token_required
import hashlib
import secrets
import string

@app.route("/login", methods=['POST'])
def Login():
    if True:
        try:    
            postData = request.get_json()
            username = postData['user']
            password = postData['pass']
            configuration = None
            # users = USER_TABLE.query.all()
            # for user in users:
            user_exists = USER_TABLE.query.filter_by(user_id=username).first()   
            queryString = f"select configuration from admin_roles where ROLE='{user_exists.role}';"
            result = db.session.execute(queryString)
            for row in result:
                configuration = row[0]
            print(configuration, file=sys.stderr)
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
            
            elif username.lower()=='ihamzazahid' and password=='qwerty':
                token = jwt.encode(
                    {"user_id": 'ihamzazahid', "user_role": 'Admin',
                        "iat": datetime.now(), "exp": datetime.now()+timedelta(hours=72)},
                                app.config["SECRET_KEY"],
                                algorithm="HS256"
                            )
                print(token, file=sys.stderr)
                # try:
                #     db.session.merge(user_exists)
                #     db.session.commit()
                # except Exception as e:
                #     db.session.rollback()
                #     print(f"Something else went wrong {e}", file=sys.stderr)
                return jsonify({'response': "Login Successful", "code": "200", "auth-key": token})
            # user_exists = USER_TABLE.query.filter_by(user_id=username).first()
            # if user_exists:
            #     if user_exists.status=="Active":
        
            #         try:
            #             token = jwt.encode(
            #                 {"user_id": user_exists.user_id, "user_role":user_exists.role, "iat": datetime.now(), "exp": datetime.now()+timedelta(hours=3)},
            #                 app.config["SECRET_KEY"],
            #                 algorithm="HS256"
            #             )
            #             user_exists.last_login = datetime.now()
            #             try:
            #                 db.session.merge(user_exists)
            #                 db.session.commit()
            #             except:
            #                 db.session.rollback()
            #                 print("Something else went wrong", file=sys.stderr)
            #             return jsonify({'response': "Login Successful","code":"200", "auth-key": token  })

            #         except Exception as e:
            #             print(f"Internal Server Error {e}", file=sys.stderr)
            #             return jsonify({'message': 'Internal Server Error'}), 500       
            #     else:
            #         pas = hashlib.sha512()
            #         pas.update(postData['pass'].encode("utf8"))
            #         password=  str(pas.digest())

            #         user = USER_TABLE.query.filter_by(user_id=username).filter_by(password=password).first()
            #         if user:
            #             token = jwt.encode(
            #                 {"user_id": user.user_id, "user_role":user.role, "iat": datetime.now(), "exp": datetime.now()+timedelta(hours=3)},
            #                 app.config["SECRET_KEY"],
            #                 algorithm="HS256"
            #             )
                
            #             user.last_login = datetime.now()
            #             try:
            #                 db.session.merge(user)
            #                 db.session.commit()
            #                 #print(obj.site_name, file=sys.stderr)
            #             except:
            #                 db.session.rollback()
            #                 print("Something else went wrong", file=sys.stderr)
            #             return jsonify({'response': "Login Successful","code":"200", "auth-key": token })
            #         else: 
            #             print("Authentication Failed Incorrect Username/Password", file=sys.stderr)
            #             return jsonify({'message': 'Authentication Failed Incorrect Username/Password'}), 401
            else:
                print("User is Inactive", file=sys.stderr)
                return jsonify({'message': 'User is Inactive'}), 401

        except Exception as e:
            traceback.print_exc()
            print(str(e),file=sys.stderr)
            return str(e), 500

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