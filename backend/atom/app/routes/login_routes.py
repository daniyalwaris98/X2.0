import gzip
from lib2to3.pgen2 import token
import sys
import json
import traceback
from flask_jsonpify import jsonify
from flask import request, make_response
from app import app, db
import jwt
from datetime import datetime, timedelta
from app.models.inventory_models import *
from app.middleware import token_required
from app.license_decoder import *
from app.utilities import *
from app.users.user_utils import *


@app.route('/oneTimeSetup', methods=['GET'])
def setup():
    response = {
        'end-user': False,
        'license': False,
        'admin': False
    }

    try:
        license_exists = LICENSE_VERIFICATION_TABLE.query.first()
        if license_exists is not None:
            response['license'] = True
    except Exception:
        pass

    try:
        end_user_exists = END_USER_TABLE.query.first()
        if end_user_exists is not None:
            response['end_user'] = True
    except Exception:
        pass

    try:
        user_exists = USER_TABLE.query.first()
        if user_exists is not None:
            response['admin'] = True
    except Exception:
        pass

    return jsonify(response), 200


@app.route('/createSuperUser',methods=['POST'])
def SuperUser():
    try:
        super_user = USER_TABLE.query.filter_by(super_user='True').first()
        if super_user is not None:
            return "Super User Already Exists", 500

        userObj = request.get_json()
        response, status = addUserInDatabase(userObj, super_user=True)

        return response, status
    except Exception:
        traceback.print_exc()
        return "Error While Creating Super User", 500


@app.route("/login", methods=['POST'])
def Login():
    if True:
        try:
            current_time = datetime.now()
            postData = request.get_json()
            username = postData['user']
            password = postData['pass']

            user_exists = USER_TABLE.query.filter_by(user_id=username).first()

            if user_exists:

                if user_exists.status != "Active":
                    login_activity(username, 'Login', "Failed",
                                   current_time, "User Inactive")
                    return jsonify({'message': 'User is Inactive'}), 401

                user_role = USER_ROLES.query.filter_by(
                    role_id=user_exists.role_id).first()
                

                if user_role is None:
                    return jsonify({'message': 'No Configuration found'}), 401

                if username.lower() == (user_exists.user_id).lower() and password == user_exists.password:
                    # queryString1 = f"update user_table set LAST_LOGIN='{datetime.now()}' where USER_ID='{username}';"
                    # db.session.execute(queryString1)
                    # db.session.commit()

                    token = jwt.encode(
                        {"user_id": user_exists.user_id, "user_role": user_role.role, "user_status": user_exists.status,
                         "iat": datetime.now(), "exp": datetime.now()+timedelta(hours=72), "monetx_configuration": user_role.configuration},
                        app.config["SECRET_KEY"],
                        algorithm="HS256"
                    )
                    print(token, file=sys.stderr)
                    user_exists.last_login = current_time
                    UpdateDBData(user_exists)

                    login_activity(username, 'Login', "Success",
                                   current_time, "User Logged In")
                    return jsonify({'response': "Login Successful", "code": "200", "auth-key": token})

                else:
                    print("Invalid Username or Password", file=sys.stderr)
                    login_activity(username, 'Login', "Failed",
                                   current_time, "Invalid Credentials")
                    return jsonify({'message': 'Invalid Username or Password'}), 401
            else:
                print("Invalid Username or Password", file=sys.stderr)
                return jsonify({'message': 'Invalid Username or Password'}), 401

        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
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
            user_info["monetx_configuration"] = user_Data.get(
                "monetx_configuration")
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


def checkLicense(username):

    try:
        result = db.session.query(USER_TABLE, END_USER_TABLE, LICENSE_VERIFICATION_TABLE).join(END_USER_TABLE, USER_TABLE.end_user_id == END_USER_TABLE.end_user_id).join(
            LICENSE_VERIFICATION_TABLE, END_USER_TABLE.license_id == LICENSE_VERIFICATION_TABLE.license_id).filter(USER_TABLE.user_id == username).first()

        if result is None:
            print("A valid licence does not exists", file=sys.stderr),
            return None

        user, end_user, license_verification = result

        end_user = end_user.as_dict()
        license_verification = license_verification.as_dict()

        print(user.as_dict(), file=sys.stderr)
        print(end_user, file=sys.stderr)
        print(license_verification, file=sys.stderr)

        licenseObj = decodeLicense(
            license_verification['license_verification_key'])

        if licenseObj is None:
            print("License Not Found", file=sys.stderr)
            return None

        if licenseObj['company_name'] != end_user['company_name']:
            print("Invalid License For Selected Company", file=sys.stderr)
            return None

        current_date = datetime.now()
        days_left = licenseObj['end_date'] - current_date
        days_left = days_left.days
        if days_left < 0:
            print("License Has Been Expired", file=sys.stderr)
            return days_left
        else:
            return days_left

    except Exception as e:
        traceback.print_exc()
        print("License Not Found", file=sys.stderr)
        return None


@app.route('/trackLicenseTenure', methods=['POST'])
@token_required
def TrackLicenseTenure(user_data):
    try:
        userObj = request.get_json()
        userName = userObj['username']

        days_left = checkLicense(userName)

        if days_left is None:
            return "License Not Found", 500

        if days_left < 0:
            return "License Has Been Exprired", 500

        return f"{days_left}", 200

    except Exception as e:
        print("License Not Found", file=sys.stderr)
        return "License Not Found", 500


@app.route('/licenseValidationAfterLogin', methods=['POST'])
@token_required
def LicenseValidationAfterLogin(user_data):
    try:
        userObj = request.get_json()
        userName = userObj['username']

        days_left = checkLicense(userName)

        if days_left is None:
            return "False", 500

        if days_left < 0:
            return "False", 500

        return "TRUE", 200

    except Exception as e:
        traceback.print_exc()
        print("License Not Found", file=sys.stderr)
        return "False", 500
