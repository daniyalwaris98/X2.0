import sys
import gzip
import json
import traceback

from flask_jsonpify import jsonify
from flask import request, make_response

from app import app, db
from app.middleware import token_required

from app.utilities.db_utils import *
from app.atom.atom_utils import *


@app.route("/addPasswordGroup", methods=["POST"])
@token_required
def AddPasswordGroup(user_date):
    try:
        passObj = request.get_json()
        response, status = addPasswordGroup(passObj, 0, False)

        print(response, file=sys.stderr)

        return response, status

    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return "Server Error While Adding Password Group", 500


@app.route("/addPasswordGroups", methods=["POST"])
@token_required
def AddPasswordGroups(user_data):
    try:
        errorList = []
        responseList = []

        passObjs = request.get_json()
        row = 0

        for passObj in passObjs:
            row = row + 1
            response, status = addPasswordGroup(passObj, row, True)

            if status == 200:
                responseList.append(response)
            else:
                errorList.append(response)

        responseDict = {
            "success": len(responseList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": responseList,
        }

        return jsonify(responseDict), 200

    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return "Server Error While Adding Password Groups", 500


@app.route("/editPasswordGroup", methods=["POST"])
@token_required
def EditUser(user_data):
    try:
        passObj = request.get_json()
        response, status = addPasswordGroup(passObj, 1)

        print(response, file=sys.stderr)

        return response, status
    except Exception as e:
        traceback.print_exc()
        return "Server Error While Updating Password Group", 500


@app.route("/deletePasswordGroup", methods=["POST"])
@token_required
def DeletePasswordGroup(user_data):
    try:
        passwordGroups = request.get_json()
        errorList = []
        responseList = []

        for passwordGroup in passwordGroups:
            try:
                password = Password_Group_Table.query.filter_by(
                    password_group=passwordGroup
                ).first()
                if password is None:
                    errorList.append(f"{passwordGroup} : Password Group Does Not Exist")
                    continue

                atom = Atom_Table.query.filter_by(
                    password_group_id=password.password_group_id
                ).first()

                if atom is not None:
                    errorList.append(
                        f"{passwordGroup} : Password Group Is In Use In Atom"
                    )
                    continue

                # add NCM and IPAM Here
                #

                db.session.delete(password)
                db.session.commit()
                responseList.append(
                    f"{passwordGroup} : Password Group Deleted Successfully"
                )

            except Exception:
                traceback.print_exc()
                errorList.append(f"{passwordGroup} : Exception")

        responseDict = {
            "success": len(responseList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": responseList,
        }

        return jsonify(responseDict), 200

    except Exception as e:
        traceback.print_exc()
        return "Server Error While Deleting Password Groups", 500


@app.route("/getPasswordGroups", methods=["GET"])
@token_required
def GetUsers(user_data):
    try:
        userObjList = []
        userObjs = Password_Group_Table.query.all()

        for userObj in userObjs:
            userDataDict = {
                "password_group_id" : userObj.pasword_group_id,
                "password_group": userObj.password_group,
                "username": userObj.username,
                "password": userObj.password,
                "secret_password": userObj.secret_password,
                "password_group_type": userObj.password_group_type,
            }

            userObjList.append(userDataDict)
        # print(userObjList, file=sys.stderr)
        content = gzip.compress(json.dumps(userObjList).encode("utf8"), 5)
        response = make_response(content)
        response.headers["Content-length"] = len(content)
        response.headers["Content-Encoding"] = "gzip"
        return response
    except Exception as e:
        traceback.print_exc()
        return "Server Error While Fetching Password Groups", 500


@app.route("/getPasswordGroupDropdown", methods=["GET"])
@token_required
def GetPasswordGroupDropdown(user_data):
    try:
        result = Password_Group_Table.query.all()
        objList = []
        for password_group in result:
            password_group_name = password_group.password_group
            objList.append(password_group_name)
        print(objList, 200)
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error While Fetching Password Groups", 500
