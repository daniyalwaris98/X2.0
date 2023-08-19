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
                    f"Inserted {credential.monitoring_credentials_id} Credentials Successfully",
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
    try:
        results = Monitoring_Credentails_Table.query.with_entities(
            Monitoring_Credentails_Table.profile_name
        ).all()
        return jsonify(results), 200

    except Exception as e:
        return "Error in getting credentials: ", 500


@app.route("/getV1V2Credentials", methods=["GET"])
def V2Credentials():
    try:
        MonitoringObjList = []

        results = Monitoring_Credentails_Table.query.filter(
            Monitoring_Credentails_Table.category == "v1/v2"
        ).all()

        for MonitoringObj in results:
            MonitoringDataDict = {}
            MonitoringDataDict["profile_name"] = MonitoringObj.profile_name
            MonitoringDataDict["description"] = MonitoringObj.description
            MonitoringDataDict["community"] = MonitoringObj.snmp_read_community
            MonitoringDataDict["port"] = MonitoringObj.snmp_port
            MonitoringDataDict[
                "credentials_id"
            ] = MonitoringObj.monitoring_credentials_id

            MonitoringObjList.append(MonitoringDataDict)

        return jsonify(MonitoringObjList), 200

    except Exception as e:
        traceback.print_exc()
        return "Something Went Wrong!", 500


@app.route("/getWMICredentials", methods=["GET"])
def WMICredentials():
    if True:
        try:
            MonitoringObjList = []

            queryString = f"select profile_name,username,password,monitoring_credentials_id from monitoring_credentials_table where category='wmi'"
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
    try:
        MonitoringObjList = []

        queryString = f"select profile_name,username,description,snmp_port,authentication_method,password,encryption_method,encryption_password,monitoring_credentials_id from monitoring_credentials_table where category='v3';"
        results = db.session.execute(queryString)

        for MonitoringObj in results:
            MonitoringDataDict = {}
            MonitoringDataDict["profile_name"] = MonitoringObj[0]
            MonitoringDataDict["username"] = MonitoringObj[1]
            MonitoringDataDict["description"] = MonitoringObj[2]
            MonitoringDataDict["port"] = MonitoringObj[3]
            MonitoringDataDict["authentication_protocol"] = MonitoringObj[4]
            MonitoringDataDict["authentication_password"] = MonitoringObj[5]
            MonitoringDataDict["encryption_protocol"] = MonitoringObj[6]
            MonitoringDataDict["encryption_password"] = MonitoringObj[7]
            MonitoringDataDict["credentials_id"] = MonitoringObj[8]
            MonitoringObjList.append(MonitoringDataDict)

        return jsonify(MonitoringObjList), 200

    except Exception as e:
        traceback.print_exc()
        return "Something Went Wrong!", 500


@app.route("/deleteMonitoringCreds", methods=["POST"])
@token_required
def deleteV3Credentials(user_data):
    try:
        
        responseList = []
        errorList = []
        
        MonitoringObj = request.get_json()
        print(MonitoringObj, file=sys.stderr)
        
        for id in MonitoringObj:
            
            cred = Monitoring_Credentails_Table.query.filter(Monitoring_Credentails_Table.monitoring_credentials_id == id).first()
            
            if cred is None:
                errorList.append(f"ID {id} : Credentials Not Found")
            else:
                profile = cred.profile_name
                
                if DeleteDBData(cred) == 200:
                   responseList.append(f"{profile} : Deleted Successfully")
                else:
                    errorList.append(f"{profile} : Error While Deleting Credentials")
                    
        responseDict = {
            "success": len(responseList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": responseList,
        }

        return jsonify(responseDict), 200

    except Exception as e:
        traceback.print_exc()
        return "Something Went Wrong!", 500
