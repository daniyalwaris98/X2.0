import base64
import gzip
import json
from flask_jsonpify import jsonify
from flask import request, make_response
from app.middleware import token_required
from app import app
from app.mail import *
import hashlib

from app.utilities.user_utils import *

hashDict = {}


@app.route("/addUser", methods=['POST'])
@token_required
def AddAdmin(user_data):
    try:
        userObj = request.get_json()
        response, status = addUserInDatabase(userObj, super_user=False)
        return response, status
    except Exception:
        return "Error While Creating User", 500


@app.route("/editUser", methods=['POST'])
@token_required
def EditAdmin(user_data):
    # request.headers.get('X-Auth-Key') == session.get('token', None):

    userObj = request.get_json()
    response, status = EditUserInDatabase(userObj, user_data)

    if status == 200:
        print("Updated " + userObj['user_id'], file=sys.stderr)

    return jsonify({'response': response, "code": str(status)}), status


@app.route("/getAllUser", methods=['GET'])
@token_required
def GetAllAdmin(user_data):
    try:

        super_user = user_data['user_role']

        userList = []
        results = db.session.query(UserTable, UserRolesTable).join(
            UserRolesTable, UserTable.role_id == UserRolesTable.role_id).all()
        end_user = EndUserTable.query.first()

        for user, user_role in results:
            adminDataDict = {'id': user.id, 'user_id': user.user_id, 'name': user.name, 'email': user.email}
            if super_user != "Super_Admin" and user.super_user == "True":
                adminDataDict['password'] = "Hidden"
            else:
                adminDataDict['password'] = user.password
            adminDataDict['role'] = user_role.role
            adminDataDict['status'] = user.status
            adminDataDict['account_type'] = user.account_type
            adminDataDict['company_name'] = end_user.company_name

            if user.creation_date:
                adminDataDict['creation_date'] = str(
                    user.creation_date)
            else:
                adminDataDict['creation_date'] = "N/A"

            if user.modification_date:
                adminDataDict['modification_date'] = str(
                    user.modification_date)
            else:
                adminDataDict['creation_date'] = "N/A"

            adminDataDict['team'] = user.team

            if user.last_login:
                adminDataDict['last_login'] = str(user.last_login)
            else:
                adminDataDict['last_login'] = "N/A"

            if user.super_user == "True":
                adminDataDict['super_user'] = True
            else:
                adminDataDict['super_user'] = False

            userList.append(adminDataDict)

        content = gzip.compress(json.dumps(userList).encode('utf8'), 5)
        response = make_response(content)
        response.headers['Content-length'] = len(content)
        response.headers['Content-Encoding'] = 'gzip'
        return response
    except Exception as e:
        traceback.print_exc()
        return "Error While Fetching User Data", 500


@app.route('/deleteUser', methods=['POST'])
@token_required
def DeleteUser(user_data):
    try:
        userObj = request.get_json()

        if 'user_id' not in userObj.keys():
            return "User ID Not Given", 500
        user_id = userObj['user_id']

        user_exist = UserTable.query.filter_by(user_id=user_id).first()

        if user_exist is None:
            return "User Does Not Exist", 500

        if user_exist.super_user == "True":
            return "Super Admin Can Not Be Deleted", 500

        db.session.delete(user_exist)
        db.session.commit()

        print(f"{user_id} Deleted Successfully", file=sys.stderr)
        return "Deleted Successfully", 200

    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return "Error While Deleting User", 500


@app.route('/addUserRole', methods=['POST'])
@token_required
def AddAdminRole(user_data):
    try:

        roleObj = request.get_json()

        response, status = addUserRoleInDatabase(roleObj)

        if status == 200:
            return jsonify({'response': response, "code": str(status)})
        else:
            return response, 500
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return str(e), 500


@app.route('/editUserRole', methods=['POST'])
@token_required
def EditAdminRole(user_data):
    try:
        roleObj = request.get_json()
        response, status = EditUserRoleInDatabase(roleObj)
        print(f"{roleObj}: {response}", file=sys.stderr)
        return jsonify({"Response": response}), status
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return jsonify({"Response": "Error While Updating User Role"}), 500


@app.route('/getUserRoleList', methods=['GET'])
@token_required
def GetAllRoles(user_data):
    try:
        roles = UserRolesTable.query.all()

        role_list = []
        for role in roles:
            role_list.append(role.role)

        return jsonify(role_list), 200

    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return str(e), 500


@app.route('/getAllUserRoles', methods=['GET'])
@token_required
def GetAllAdminRole(user_data):
    try:
        adminObjsList = []
        adminObjs = UserRolesTable.query.all()
        for adminObj in adminObjs:
            objDict = {'role_id': adminObj.role_id, 'role': adminObj.role,
                       'configuration': json.loads(adminObj.configuration)}
            print(type(objDict['configuration']), file=sys.stderr)
            adminObjsList.append(objDict)

        return jsonify(adminObjsList), 200
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Error While Fetching Data ", 500


@app.route('/deleteUserRole', methods=['POST'])
@token_required
def DeleteAdmin(user_data):
    try:
        roleObj = request.get_json()

        if 'role_id' not in roleObj.keys():
            return "Role ID Not Given", 500

        role_id = roleObj['role_id']
        user_role = UserRolesTable.query.filter_by(role_id=role_id).first()

        if user_role is None:
            return "User Role Does Not Exist", 500

        if user_role.role == "Super_Admin":
            return "Super_Admin Role Can Not Be Deleted", 500

        db.session.delete(user_role)
        db.session.commit()
        print(
            f"ROLE {roleObj['role_id']} DELETED SUCCESSFULLY", file=sys.stderr)
        return "User Role Deleted Successfully", 200
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Error While Deleting User Role", 500


@app.route('/editEndUserDetails', methods=['POST'])
@token_required
def EditAllEndUserDetails(user_date):
    try:

        licenseObj = LicenseVerificationTable.query.first()

        endUserObj = request.get_json()
        response, status = addEndUserDetails(endUserObj, user_date, licenseObj.license_verification_key)

        return response, status
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Error While Updating End User Data", 500


@app.route('/getEndUserDetails', methods=['GET'])
@token_required
def GetAllEndUserDetails(user_data):
    try:
        endUserObj = EndUserTable.query.first()
        if endUserObj is not None:
            objDict = {'end_user_id': endUserObj.end_user_id, 'company_name': endUserObj.company_name,
                       'po_box': endUserObj.po_box, 'address': endUserObj.address,
                       'street_name': endUserObj.street_name, 'city': endUserObj.city, 'country': endUserObj.country,
                       'contact_person': endUserObj.contact_person, 'contact_number': endUserObj.contact_number,
                       'email': endUserObj.email, 'domain_name': endUserObj.domain_name,
                       'industry_type': endUserObj.industry_type, 'creation_date': endUserObj.creation_date,
                       'modification_date': endUserObj.modification_date}

            return jsonify(objDict), 200
        else:
            return "No End User Exists", 500

    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Error While Fetching End User Data", 500


@app.route('/encryptCredentialsLicenseKey', methods=['POST'])
def EncryptCredentialsLicenseKey():
    try:
        userObj = request.get_json()
        queryString = f"select COMPANY_NAME from end_user_table where COMPANY_NAME='{userObj['company_name']}';"
        company_name = ''
        middleware = 'MonetX'
        result = db.session.execute(queryString)
        for row in result:
            company_name = row[0]

        if company_name == '':
            return "Company Name Not Found", 500
        else:

            date = userObj['date']
            date = int(date)

            objDict = {
                "company_name": company_name,
                "middleware": middleware,
                "date": date,
            }
            objDict = str(objDict)
            res = bytes(objDict, 'utf-8')
            final = base64.b64encode(res)
            encoded_data = final.decode("utf-8")
            print(
                f"License Key Generated Successfully for {company_name}", file=sys.stderr)
            hashedString = Hashing(encoded_data)
            hashDict["hashed_string"] = hashedString
            hashDict["encoded_data"] = encoded_data
            with open("/app/hashFile", "w") as outfile:
                json.dump(hashDict, outfile)

            send_mail(send_from="hamza.zahid@nets-international.com", send_to=["amna.ateq@nets-international.com"],
                      subject="License Key",
                      message=f"Dear Valuable Customer,\nHopefully this mail finds you well.\nPlease find the below the attached License Key valid for {date} months.\n\n\n{hashedString}\n\n\t***\tThis is an Automated Email\t***",
                      username='hamza.zahid@nets-international.com', password='Cyprus@123')
            import time
            time.sleep(5)
            return (hashedString), 200
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return str(e), 500


def LicenseTenure(end_date):
    from dateutil.relativedelta import relativedelta
    months = int(end_date)
    today = datetime.now()
    date_after_months = today + relativedelta(months=months)
    print(f"Subsription starts at {today}", file=sys.stderr)
    print(f"Subsription ends at {date_after_months}", file=sys.stderr)
    return date_after_months


def Hashing(string):
    length = 20
    # Convert the string to bytes
    string_bytes = string.encode()

    # Use sha256 hash algorithm to create a hash object
    sha256 = hashlib.sha256()
    sha256.update(string_bytes)

    # Get the hexadecimal representation of the hash
    hex_hash = sha256.hexdigest()

    # Take the first 'length' characters of the hexadecimal hash
    short_hash = hex_hash[:length]

    return short_hash


@app.route('/decryptCredentialsLicenseKey', methods=['POST'])
def DecryptCredentialsLicenseKey():
    try:
        hashDataDict = None
        with open('/app/hashFile') as json_file:
            hashDataDict = json.load(json_file)
        userObj = request.get_json()
        hashKey = userObj['serial_key']
        verification_license_key = ""
        if hashDataDict is not None:
            # print(hashDataDict,file=sys.stderr)
            if hashKey in hashDataDict['hashed_string']:
                verification_license_key = hashDataDict['encoded_data']
            else:
                return "Key Not Found", 500
        decoded_data = base64.b64decode(verification_license_key)
        res = (decoded_data.decode())
        res = res.replace("'", '"')
        objDict = json.loads(res)
        middleware = objDict['middleware']
        license_tenure_in_months = objDict['date']

        company_name = ""
        queryString6 = f"select COMPANY_NAME from end_user_table where COMPANY_NAME='{objDict['company_name']}';"
        result = db.session.execute(queryString6)
        for row in result:
            company_name += row[0]

        start_date = datetime.now()
        if license_tenure_in_months != 0:
            license_tenure = LicenseTenure(license_tenure_in_months)
        if verification_license_key != "":
            if company_name != "" and middleware == "MonetX":
                queryString = f"insert into license_verification_table (`COMPANY_NAME`) VALUES ('{objDict['company_name']}');"
                db.session.execute(queryString)
                db.session.commit()
                queryString1 = f'update license_verification_table set verification_license_key="{verification_license_key}" where COMPANY_NAME="{objDict["company_name"]}";'
                db.session.execute(queryString1)
                queryString2 = f"update license_verification_table set `START_DATE`='{start_date}' where COMPANY_NAME='{objDict['company_name']}';"
                db.session.execute(queryString2)
                queryString3 = f"update end_user_table set LICENSE_STATUS='TRUE' where company_name='{objDict['company_name']}';"
                db.session.execute(queryString3)
                queryString4 = f"update license_verification_table set END_DATE='{license_tenure}' where company_name='{objDict['company_name']}';"
                db.session.execute(queryString4)
                db.session.commit()
                return "Verification is Successful", 200
            if datetime.now() >= license_tenure:
                queryString5 = f"update end_user_table set LICENSE_STATUS='FALSE' where COMPANY_NAME='{objDict['company_name']}';"
                db.session.execute(queryString5)
                db.session.commit()
                return "This Key has Expired", 500
            else:
                return "License Key is Invalid", 500

        else:
            return "License Key Cannot be Empty", 500
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return str(e), 500

# def DaysLeftConversion(date_string):
#     # Parse the date string
#     parsed_date = datetime.strptime(str(date_string),"%Y-%m-%d %H:%M:%S")
#     # Convert the parsed date to the desired format
#     formatted_date = parsed_date.strftime("%Y-%m-%d")
#     target_date = datetime.strptime(formatted_date, "%Y-%m-%d")
#     today = datetime.now()
#     time_left = target_date - today
#     time_left_in_days = time_left.days
#     print("Days left:", time_left_in_days,file=sys.stderr)
#     return time_left_in_days
