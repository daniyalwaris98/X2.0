from flask_jsonpify import jsonify
from flask import request
from app import app
from app.utilities.user_utils import *
from app.license.license_decoder import *


@app.route('/oneTimeSetup', methods=['GET'])
def setup():
    response = {
        'end-user': False,
        'license': False,
        'admin': False
    }

    try:
        license_exists = LicenseVerificationTable.query.first()
        if license_exists is not None:
            response['license'] = True
    except Exception:
        pass

    try:
        end_user_exists = EndUserTable.query.first()
        if end_user_exists is not None:
            response['end_user'] = True
    except Exception:
        pass

    try:
        user_exists = UserTable.query.first()
        if user_exists is not None:
            response['admin'] = True
    except Exception:
        pass

    return jsonify(response), 200


@app.route('/addEndUserDetails', methods=['POST'])
def addEndUser():
    try:
        end_user_exists = EndUserTable.query.first()
        if end_user_exists is not None:
            return "End User Already Exists", 500

        endUserObj = request.get_json()

        if 'license_key' not in endUserObj.keys():
            return "License Key Is Missing", 500

        if endUserObj['license_key'].strip() == "":
            return "License Key Is Empty", 500

        response, status = addEndUserDetails(endUserObj, None, endUserObj['license_key'])

        return response, status

    except Exception:
        traceback.print_exc()
        return "Error While Adding End User Details", 500


@app.route('/createSuperUser', methods=['POST'])
def SuperUser():
    try:
        super_user = UserTable.query.filter_by(super_user='True').first()
        if super_user is not None:
            return "Super User Already Exists", 500

        userObj = request.get_json()
        response, status = addUserInDatabase(userObj, super_user=True)

        return response, status
    except Exception:
        traceback.print_exc()
        return "Error While Creating Super User", 500