import base64
import hashlib
from app import app
from flask_jsonpify import jsonify
from flask import request
from app.utilities.db_utils import *
import json


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


@app.route('/generateLicense', methods=['POST'])
def GenerateLicenseKey():
    try:

        data = request.get_json()

        objDict = {}
        if 'company_name' in data.keys():
            objDict['company_name'] = data['company_name']
        else:
            return "Company Name Is Missings", 500

        if 'start_date' in data.keys():
            objDict['start_date'] = data['start_date']
        else:
            return "Start Date Is Missings", 500

        if 'end_date' in data.keys():
            objDict['end_date'] = data['end_date']
        else:
            return "End Date Is Missings", 500

        hashDict = {}

        objDict['middleware'] = 'MonetX'
        strDict = str(objDict)

        res = bytes(strDict, 'utf-8')
        final = base64.b64encode(res)
        encoded_data = final.decode("utf-8")

        print(f"License Key Generated Successfully for {data['company_name']}")
        print(encoded_data, file=sys.stderr)

        # hashedString = Hashing(encoded_data)
        # hashDict["hashed_string"]=hashedString
        # hashDict["encoded_data"]=encoded_data

        return jsonify(encoded_data), 200
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return str(e), 500


@app.route('/decodeLicense', methods=['POST'])
def DecodeLicenseKey():
    current_time = datetime.now()

    data = request.get_json()
    license_key = ""
    if 'license_key' in data.keys():
        license_key = data['license_key']
    else:
        return "License Key Is Missings", 500

    try:
        decoded_data = base64.b64decode(license_key)
        res = decoded_data.decode()

        res = f"{res}".replace("\'", "\"")
        print(res, file=sys.stderr)

        objDict = json.loads(res)

        company_name = objDict['company_name']
        start_date = datetime.strptime(objDict['start_date'], "%Y-%m-%d %H:%M:%S")
        end_date = datetime.strptime(objDict['end_date'], "%Y-%m-%d %H:%M:%S")

        noneFlag = False
        licenseObj = LicenseVerificationTable.query.filter_by(company_name=company_name).first()

        if licenseObj is None:
            noneFlag = True
            licenseObj = LicenseVerificationTable()
            licenseObj.company_name = company_name
            licenseObj.creation_date = f"{current_time}"

        licenseObj.license_verification_key = license_key
        licenseObj.start_date = f"{start_date}"
        licenseObj.end_date = f"{end_date}"
        licenseObj.modification_date = f"{current_time}"

        if noneFlag:
            InsertDBData(licenseObj)
            return "License has been added", 200
        else:
            UpdateDBData(licenseObj)
            return "License has been updated", 500


    except Exception:
        print("Invalid License Key", file=sys.stderr)
        traceback.print_exc()
        return "Invalid License Key", 500
