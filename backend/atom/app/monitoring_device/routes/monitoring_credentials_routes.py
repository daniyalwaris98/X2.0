from app.monitoring_device.monitoring_utils import *


@app.route("/addMonitoringCredentials", methods=["POST"])
@token_required
def AddMonitoringCredentials(user_data):
    try:
        credentialObj = request.get_json()

        print(credentialObj, file=sys.stderr)

        credential = Monitoring_Credentails_Table()
        if "credentials" in credentialObj:
            credential.credentials = credentialObj["credentials"]
        if "category" in credentialObj:
            credential.category = credentialObj["category"]
        if "profile_name" in credentialObj:
            credential.profile_name = credentialObj["profile_name"]
        if "description" in credentialObj:
            credential.description = credentialObj["description"]
        if "ip_address" in credentialObj:
            credential.ip_address = credentialObj["ip_address"]
        if "community" in credentialObj:
            credential.snmp_read_community = credentialObj["community"]
        if "port" in credentialObj:
            credential.snmp_port = credentialObj["port"]
        if "username" in credentialObj:
            credential.username = credentialObj["username"]

        if "authentication_password" in credentialObj:
            credential.password = credentialObj["authentication_password"]
        if "password" in credentialObj:
            credential.password = credentialObj["password"]
        if "encryption_password" in credentialObj:
            credential.encryption_password = credentialObj["encryption_password"]

        if "authentication_protocol" in credentialObj:
            credential.authentication_method = credentialObj["authentication_protocol"]

        if "encryption_protocol" in credentialObj:
            credential.encryption_method = credentialObj["encryption_protocol"]

        if (
            Monitoring_Credentails_Table.query.filter_by(
                profile_name=credentialObj["profile_name"]
            ).first()
            is not None
        ):
            return "Profile Name Is Already Assigned", 500
        else:
            if InsertDBData(credential) == 200:
                print(
                    f"Inserted {credential.credentials_id} Credentials Successfully",
                    file=sys.stderr,
                )
                return "Credentials Successfully Added", 200
            else:
                return "Error While Adding Credentials", 500

    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/getDevCredentials", methods=["GET"])
@token_required
def getDevCredentials(user_data):
    if True:
        try:
            queryString = "select PROFILE_NAME from monitoring_credentials_table;"
            results = db.session.execute(queryString)
            final = []
            for result in results:
                final.append(result[0])
            return jsonify(final), 200
        except Exception as e:
            return "Error in getting credentials: ", 500


@app.route("/getV1V2Credentials", methods=["GET"])
def V2Credentials():
    if True:
        try:
            MonitoringObjList = []

            queryString = f"select profile_name,description,snmp_read_community,snmp_port,CREDENTIALS_ID from monitoring_credentials_table where category='v1/v2'"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict["profile_name"] = MonitoringObj[0]
                MonitoringDataDict["description"] = MonitoringObj[1]
                MonitoringDataDict["community"] = MonitoringObj[2]
                MonitoringDataDict["port"] = MonitoringObj[3]
                MonitoringDataDict["cred_id"] = MonitoringObj[4]

                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getWMICredentials", methods=["GET"])
def WMICredentials():
    if True:
        try:
            MonitoringObjList = []

            queryString = f"select profile_name,username,password,CREDENTIALS_ID from monitoring_credentials_table where category='wmi'"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict["profile_name"] = MonitoringObj[0]
                MonitoringDataDict["username"] = MonitoringObj[1]
                MonitoringDataDict["password"] = MonitoringObj[2]
                MonitoringDataDict["cred_id"] = MonitoringObj[3]

                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getV3Credentials", methods=["GET"])
def V3Credentials():
    if True:
        try:
            MonitoringObjList = []

            queryString = f"select profile_name,username,description,snmp_port,authentication_method,password,encryption_method,encryption_password,CREDENTIALS_ID from monitoring_credentials_table where category='v3';"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict["profile_name"] = MonitoringObj[0]
                MonitoringDataDict["username"] = MonitoringObj[1]
                MonitoringDataDict["description"] = MonitoringObj[2]
                MonitoringDataDict["port"] = MonitoringObj[3]
                MonitoringDataDict["authentication_protocol"] = MonitoringObj[4]

                # if  MonitoringObj[4] == "usmHMACMD5AuthProtocol":
                #     MonitoringDataDict['authentication_protocol'] = "MD5"
                # if MonitoringObj[4] == "usmHMACSHAAuthProtocol":
                #      MonitoringDataDict['authentication_protocol'] = "SHA"
                # if MonitoringObj[4] == "usmHMAC192SHA256AuthProtocol":
                #      MonitoringDataDict['authentication_protocol'] = "SHA-256"
                # if  MonitoringObj[4] == "usmHMAC384SHA512AuthProtocol":
                #      MonitoringDataDict['authentication_protocol'] = "SHA-512"

                # Auth
                # usmHMACMD5AuthProtocol
                # usmHMACSHAAuthProtocol
                # usmHMAC128SHA224AuthProtocol
                # usmHMAC192SHA256AuthProtocol
                # usmHMAC256SHA384AuthProtocol
                # usmHMAC384SHA512AuthProtocol
                # Encryp
                # usm3DESEDEPrivProtocol
                # usmAesCfb128Protocol
                # usmAesCfb192Protocol
                # usmAesCfb256Protocol

                MonitoringDataDict["authentication_password"] = MonitoringObj[5]

                MonitoringDataDict["encryption_protocol"] = MonitoringObj[6]
                # if MonitoringObj[6] == "usmDESPrivProtocol":
                #     MonitoringDataDict['encryption_protocol'] = "DES"
                # if MonitoringObj[6] == "usmAesCfb128Protocol":
                #     MonitoringDataDict['encryption_protocol'] = "AES-128"
                # if MonitoringObj[6] == "usmAesCfb192Protocol":
                #     MonitoringDataDict['encryption_protocol'] = "AES-192"
                # if MonitoringObj[6] == "usmAesCfb256Protocol":
                #     MonitoringDataDict['encryption_protocol'] = "AES-256"
                MonitoringDataDict["encryption_password"] = MonitoringObj[7]
                MonitoringDataDict["cred_id"] = MonitoringObj[8]
                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503
