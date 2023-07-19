from flask_jsonpify import jsonify
import json
from flask import request, make_response

import sys
import traceback
import gzip

from app import app
from app.atom.atom_utils import *
from app.middleware import token_required
from app.utilities.db_utils import *

@app.route("/addPasswordGroup", methods=['POST'])
@token_required
def AddPasswordGroup(user_date):
    try:
        passObj = request.get_json()
        response, status = addPasswordGroup(passObj, 0)

        print(response, file=sys.stderr)

        return response, status

    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return "Server Error", 500


@app.route("/addPasswordGroups", methods=['POST'])
@token_required
def AddPasswordGroup(user_data):
    try:
        errorList = []
        responseList = []

        passObjs = request.get_json()
        row = 0

        for passObj in passObjs:
            row = row + 1
            response, status = addPasswordGroup(passObj, row)

            if status == 200:
                responseList.append(response)
            else:
                errorList.append(response)

        responseDict = {
            "success": len(responseList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": responseList
        }

        return jsonify(responseDict), 200

    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return "Server Error", 500
    

@app.route("/editPasswordGroup", methods=['POST'])
@token_required
def EditUser(user_data):
    try:
        passObj = request.get_json()
        response, status = addPasswordGroup(passObj, 1)

        print(response, file=sys.stderr)

        return response, status
    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route('/deletePasswordGroup', methods=['POST'])
@token_required
def DeletePasswordGroup(user_data):
    try:
        responses = []
        response = False
        response1 = False
        response2 = False
        passwordGroups = request.get_json()
        for passwordGroup in passwordGroups:
            queryString = f"select count(*) from atom_table where password_group='{passwordGroup}';"
            queryString1 = f"select count(*) from ipam_devices_table where password_group='{passwordGroup}';"

            result = db.session.execute(queryString).scalar()
            result1 = db.session.execute(queryString1).scalar()
            if result > 0:
                response = 'atom'
                responses.append(response)

            elif result1 > 0:
                response1 = 'ipam'
                responses.append(response1)

            else:

                db.session.execute(
                    f"delete from password_group_table where PASSWORD_GROUP='{passwordGroup}';")
                db.session.commit()
                response2 = 'deleted'
                responses.append(response2)
        responses = set(responses)
        responses = list(responses)
        if len(responses) == 1:
            if responses[0] == 'atom':
                return "Password Group Found in Atom", 500
            elif responses[0] == 'ipam':
                return "Password Group Found in IPAM", 500
            elif responses[0] == 'deleted':
                return "Deleted Successfully", 200
        elif len(responses) == 3:
            return "Some Deleted and Some are Found in IPAM and Atom", 200
        elif len(responses) == 2:
            if 'atom' in responses and 'ipam' in responses:
                return "Password Group Found in Atom and IPAM", 500
            elif 'atom' in responses and 'deleted' in responses:
                return "Some Delete and Some Found in Atom", 200
            elif 'ipam' in responses and 'deleted' in responses:
                return "Some Deleted and Some Found in Atom", 200

    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route("/getPasswordGroups", methods=['GET'])
@token_required
def GetUsers(user_data):
    try:
        userObjList = []
        userObjs = Password_Group_Table.query.all()

        for userObj in userObjs:
            userDataDict = {'password_group': userObj.password_group, 'username': userObj.username,
                            'password': userObj.password, 'secret_password': userObj.secret_password,
                            'password_group_type': userObj.password_group_type}

            userObjList.append(userDataDict)
        # print(userObjList, file=sys.stderr)
        content = gzip.compress(json.dumps(userObjList).encode('utf8'), 5)
        response = make_response(content)
        response.headers['Content-length'] = len(content)
        response.headers['Content-Encoding'] = 'gzip'
        return response
    except Exception as e:
        traceback.print_exc()
        return str(e), 500