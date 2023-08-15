import os
import sys
import traceback
import threading
from datetime import datetime

from flask_jsonpify import jsonify
from flask import request, render_template

from app import app, db
from app.middleware import token_required
from app.utilities.db_utils import *

from app.models.atom_models import *
from app.models.ncm_models import *

from app.ncm.ncm_pullers.ncm_puller import NCMPuller
from app.conf_diff_main.conf_diff import ConfDiff


@app.route("/addNcmDevice", methods=["POST"])
@token_required
def AddNcmDevice(user_data):
    if True:
        try:
            ncmObj = request.get_json()
            # if NCM_TABLE.query.with_entities(NCM_TABLE.ip_address).filter_by(ip_address=ncmObj['ip_address']).first() is None:
            # ncm = NCM_TABLE()
            # ncm.ip_address = ncmObj['ip_address']
            # ncm.device_name = ncmObj['device_name']
            # ncm.device_type = ncmObj['device_type']
            # ncm.password_group = ncmObj['password_group']
            # ncm.vendor = ncmObj['vendor']
            # ncm.function = ncmObj['function']
            # ncm.status = ncmObj['status']
            # ncm.source = "Static"
            # ncm_id = None
            # queryString = f"select NCM_ID from ncm_table where NCM_ID='{ncmObj['ncm_id']}';"
            # result = db.session.execute(queryString)
            # for row in result:
            #     ncm_id = row[0]
            # if ncm_id!=None:
            if "ncm_id" in ncmObj:
                # if NCM_TABLE.query.with_entities(NCM_TABLE.ip_address).filter_by(ip_address=ncmObj['ip_address']).first() is not None:
                # ncm.ncm_id = NCM_TABLE.query.with_entities(NCM_TABLE.ncm_id).filter_by(ip_address=ncmObj['ip_address']).first()[0]
                modification_date = datetime.now()
                queryString1 = f"update ncm_table set `IP_ADDRESS`='{ncmObj['ip_address']}',`DEVICE_NAME`='{ncmObj['device_name']}',`DEVICE_TYPE`='{ncmObj['device_type']}',`PASSWORD_GROUP`='{ncmObj['password_group']}',`VENDOR`='{ncmObj['vendor']}',`FUNCTION`='{ncmObj['function']}',`STATUS`='{ncmObj['status']}',`SOURCE`='Static',`MODIFICATION_DATE`='{modification_date}' where ncm_id={ncmObj['ncm_id']};"
                db.session.execute(queryString1)
                db.session.commit()
                print(f"Updated {ncmObj['ncm_id']} in NCM", file=sys.stderr)
                return "Updated Successfully", 200
            else:
                creation_date = datetime.now()
                modification_date = datetime.now()
                ipList = []
                deviceList = []
                query = f"select IP_ADDRESS,DEVICE_NAME from ncm_table;"
                res = db.session.execute(query)
                for r in res:
                    ip_address = r[0]
                    device_name = r[1]
                    ipList.append(ip_address)
                    deviceList.append(device_name)
                if ncmObj["ip_address"] in ipList:
                    return "IP Address Already Exists", 500
                if ncmObj["device_name"] in deviceList:
                    return "Device Name Already Exists", 500
                queryString2 = f"INSERT INTO ncm_table (`IP_ADDRESS`,`DEVICE_NAME`,`DEVICE_TYPE`,`PASSWORD_GROUP`,`VENDOR`,`FUNCTION`,`STATUS`,`SOURCE`,`CREATION_DATE`,`MODIFICATION_DATE`) VALUES ('{ncmObj['ip_address']}','{ncmObj['device_name']}','{ncmObj['device_type']}','{ncmObj['password_group']}','{ncmObj['vendor']}','{ncmObj['function']}','{ncmObj['status']}','Static','{creation_date}','{modification_date}');"
                db.session.execute(queryString2)
                db.session.commit()
                print(f"Inserted {ncmObj['ip_address']} in NCM", file=sys.stderr)
                return "Inserted Successfully", 200
            # else:
            #     print(f"Device Already Exists in NCM",file=sys.stderr)
            #     return "Device Already Exists in NCM",500
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/addNcmDevices", methods=["POST"])
@token_required
def AddNcmDevices(user_data):
    if True:
        try:
            response = False
            response1 = False
            response2 = False
            response3 = False
            responses = []
            ipList = []
            deviceList = []
            ncmObjs = request.get_json()
            passwordGroups = []
            queryString1 = f"select IP_ADDRESS from ncm_table;"
            result1 = db.session.execute(queryString1)
            for row1 in result1:
                ipList.append(row1[0])
            queryString2 = f"select DEVICE_NAME from ncm_table;"
            result2 = db.session.execute(queryString2)
            for row2 in result2:
                deviceList.append(row2[0])
            for ncmObj in ncmObjs:
                queryString = f"select PASSWORD_GROUP from password_group_table;"
                result = db.session.execute(queryString)
                for row in result:
                    passwordGroups.append(row[0])

                if ncmObj["password_group"] not in passwordGroups:
                    return "Password Group not Found in Password Group Table", 500
                if ncmObj["ip_address"] in ipList:
                    return "Duplicate IP Address Found", 500
                if ncmObj["device_name"] in deviceList:
                    return "Duplicate Device Name Found", 500
                if (
                    NCM_TABLE.query.with_entities(NCM_TABLE.ip_address)
                    .filter_by(ip_address=ncmObj["ip_address"])
                    .first()
                    is None
                ):
                    ncm = NCM_TABLE()
                    ncm.ip_address = ncmObj["ip_address"]
                    ncm.device_name = ncmObj["device_name"]
                    ncm.device_type = ncmObj["device_type"]
                    ncm.password_group = ncmObj["password_group"]
                    ncm.vendor = ncmObj["vendor"]
                    ncm.function = ncmObj["function"]
                    ncm.source = "Static"
                    ncm.status = ncmObj["status"]
                    if (
                        NCM_TABLE.query.with_entities(NCM_TABLE.ip_address)
                        .filter_by(ip_address=ncmObj["ip_address"])
                        .first()
                        is not None
                    ):
                        ncm.ncm_id = (
                            NCM_TABLE.query.with_entities(NCM_TABLE.atom_id)
                            .filter_by(ip_address=ncmObj["ip_address"])
                            .first()[0]
                        )
                        ncm.modification_date = datetime.now()
                        UpdateData(ncm)
                        print(f"Updated {ncmObj['ip_address']} in NCM", file=sys.stderr)
                        response = "updated"
                        responses.append(response)

                    else:
                        ncm.creation_date = datetime.now()
                        ncm.modification_date = datetime.now()
                        InsertData(ncm)

                        print(
                            f"Inserted {ncmObj['ip_address']} in NCM", file=sys.stderr
                        )
                        response1 = "inserted"
                        responses.append(response1)

                else:
                    print(f"Device Already Exists in NCM", file=sys.stderr)
                    response2 = "exists"
                    responses.append(response2)

            responses = set(responses)
            responses = list(responses)
            if len(responses) == 1:
                if responses[0] == "updated":
                    return "Updated Successfully", 200
                elif responses[0] == "inserted":
                    return "Inserted Successfully", 200
                elif responses[0] == "exists":
                    return "Device Already Exists in NCM", 500
            else:
                return "Updated/Inserted Successfully", 200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllNcmDevices", methods=["GET"])
@token_required
def GetAllNcmDevices(user_data):
    try:
        ncmObjList = []

        results = (
            db.session.query(NCM_Device_Table, Atom_Table)
            .join(Atom_Table, Atom_Table.atom_id == NCM_Device_Table.atom_id)
            .all()
        )

        for ncm, atom in results:
            password_group = None
            if atom.password_group_id is not None:
                password = Password_Group_Table.query.filter(
                    Password_Group_Table.password_group_id == atom.password_group_id
                ).first()

                if password is not None:
                    password_group = password.password_group

            ncmDict = {}
            ncmDict["ncm_device_id"] = ncm.ncm_device_id
            ncmDict["ip_address"] = atom.ip_address
            ncmDict["device_name"] = atom.device_name
            ncmDict["device_type"] = atom.device_type
            ncmDict["password_group"] = password_group
            ncmDict["source"] = "Atom"
            ncmDict["modification_date"] = ncm.modification_date
            ncmDict["creation_date"] = ncm.creation_date
            ncmDict["function"] = atom.function
            ncmDict["vendor"] = atom.vendor
            ncmDict["status"] = ncm.status
            ncmDict["backup_status"] = ncm.backup_status

            ncmObjList.append(ncmDict)
        return jsonify(ncmObjList), 200

    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Server Error While Fetchin NCM Devices", 500


@app.route("/getAtomInNcm", methods=["GET"])
@token_required
def GetAtomInNcm(user_data):
    try:
        atom_ids = []
        ncm_devices = NCM_Device_Table.query.all()
        for ncm in ncm_devices:
            atom_ids.append(ncm.atom_id)

        results = Atom_Table.query.all()

        atomObjList = []
        for atom in results:
            if atom.atom_id in atom_ids:
                continue

            password_group = None
            if atom.password_group_id is not None:
                password = Password_Group_Table.query.filter(
                    Password_Group_Table.password_group_id == atom.password_group_id
                ).first()

                if password is not None:
                    password_group = password.password_group

            objDict = {}
            objDict["ip_address"] = atom.ip_address
            objDict["device_name"] = atom.device_name
            objDict["device_type"] = atom.device_type
            objDict["password_group"] = password_group
            objDict["vendor"] = atom.vendor
            objDict["function"] = atom.function
            atomObjList.append(objDict)

        return jsonify(atomObjList), 200
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Server Error While Fetching Atom In NCM", 500


@app.route("/addNcmFromAtom", methods=["POST"])
@token_required
def AddNcmFromAtom(user_data):
    try:
        ips = request.get_json()

        successList = []
        errorList = []
        for ip in ips:
            atom = Atom_Table.query.filter(Atom_Table.ip_address == ip).first()
            if atom is not None:
                ncm = NCM_Device_Table()
                ncm.atom_id = atom.atom_id
                ncm.status = "Active"

                if InsertDBData(ncm) == 200:
                    successList.append(f"{atom.ip_address} : Device Added Successfully")
                else:
                    errorList.append(
                        f"{atom.ip_address} : Exception Occurred While Insertion"
                    )

            else:
                errorList.append(f"{atom.ip_address} : IP Address Not Found In Atom")

        # responseDict = {
        #     "success": len(successList),
        #     "error": len(errorList),
        #     "error_list": errorList,
        #     "success_list": successList,
        # }

        # return jsonify(responseDict), 200

        msg = f"** NCM Import Summary **\nSuccessful : {len(successList)}\nFailed : {len(errorList)}"

        return msg, 200

    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return str(e), 500


@app.route("/deleteNcmDevice", methods=["POST"])
@token_required
def DeleteNcmDevice(user_data):
    try:
        ipObjs = request.get_json()
        errorList = []
        responseList = []
        for ip in ipObjs:
            result = (
                db.session.query(NCM_Device_Table, Atom_Table)
                .join(Atom_Table, Atom_Table.atom_id == NCM_Device_Table.atom_id)
                .filter(Atom_Table.ip_address == ip)
                .first()
            )

            if result is None:
                errorList.append(f"{ip} : No Device Found")

            ncm, atom = result
            
            if DeleteDBData(ncm):
                responseList.append(f"{ip} : Device Deleted Successfully")
            else:
                errorList.append(f"{ip} : Error While Deleting Device")

        responseDict = {
            "success": len(responseList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": responseList,
        }

        return jsonify(responseDict), 200

    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return str(e), 500


@app.route("/getAllConfigurations", methods=["POST"])
@token_required
def GetAllConfigurationDates(user_data):
    try:
        ncmObj = request.get_json()

        if "ncm_device_id" not in ncmObj.keys():
            return "NCM Device ID Is Missing", 500

        if ncmObj["ncm_device_id"] is None:
            return "NCM Device ID Is Empty", 500

        results = NCM_History_Table.query.filter(
            NCM_History_Table.ncm_device_id == ncmObj["ncm_device_id"]
        ).all()

        objList = []
        for history in results:
            objDict = {}
            objDict["ncm_history_id"] = history.ncm_history_id
            objDict["date"] = (history.configuration_date).strftime("%Y-%m-%d %H:%M:%S")
            objDict["file_name"] = history.file_name

            objList.append(objDict)

        return jsonify(objList), 200
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Server Error While Fetching Backup History", 500


def CheckPath(file_path):
    from pathlib import Path

    # create a Path object with the path to the file
    path = Path(file_path)

    return path.is_file()


@app.route("/getAllConfigurationDatesInString", methods=["POST"])
@token_required
def GetAllConfigurationDatesInString(user_data):
    try:
        ncmObj = request.get_json()

        if "ncm_device_id" not in ncmObj.keys():
            return "NCM Device ID Is Missing", 500

        if ncmObj["ncm_device_id"] is None:
            return "NCM Device ID Is Empty", 500

        results = (
            NCM_History_Table.query
            .filter(NCM_History_Table.ncm_device_id == ncmObj["ncm_device_id"])
            .all()
        )

        objList = []
        for history in results:
            date = (history.configuration_date).strftime("%Y-%m-%d %H:%M:%S")
            objList.append(date)

        return jsonify(objList), 200
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Server Error While Fetching Configuration Dates", 500


@app.route("/getConfigurationFromDate", methods=["POST"])
@token_required
def GetConfigurationFromDate(user_data):
    try:
        ncmObj = request.get_json()

        if "ncm_device_id" not in ncmObj.keys():
            return "NCM Device ID Is Missing", 500

        if ncmObj["ncm_device_id"] is None:
            return "NCM Device ID Is Empty", 500

        history = NCM_History_Table.query.filter(
            NCM_History_Table.ncm_device_id == ncmObj["ncm_device_id"],
            NCM_History_Table.configuration_date == ncmObj["date"],
        ).first()

        if history is None:
            return "Backup File Not Found", 500

        cwd = os.getcwd()
        file_path = cwd + "/app/configuration_backups/" + history.file_name
        pathFlag = CheckPath(file_path)

        if pathFlag:
            f = open(file_path, "r")
            configuration = f.read()
            return configuration, 200
        else:
            DeleteDBData(history)
            return "Configuration Does Not Exist", 500

    except Exception as e:
        traceback.print_exc()
        return "Server Error While Fetching Backup", 500


@app.route("/sendCommand", methods=["POST"])
@token_required
def SendCommand(user_data):
    try:
        ncmObj = request.get_json()

        ncmPuller = NCMPuller()
        ncmPuller.setup_puller(ncmObj)

        if ncmPuller.status == 500:
            return ncmPuller.response, 500

        if "cmd" not in ncmObj.keys():
            return "Command Is Missing", 500

        if ncmObj["cmd"] is None:
            return "Command Is Empty", 500

        ncmObj["cmd"] = str(ncmObj["cmd"]).strip()
        if ncmObj["cmd"] == "":
            return "Command Is Empty", 500

        ncmPuller.send_remote_command(ncmObj["cmd"])

        return ncmPuller.response, ncmPuller.status

    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Server Error While Sending Remote Command", 500


@app.route("/backupConfigurations", methods=["POST"])
def BackupConfigurations():
    try:
        ncmObj = request.get_json()

        ncmPuller = NCMPuller()
        ncmPuller.setup_puller(ncmObj)

        if ncmPuller.status == 500:
            return ncmPuller.response, 500

        ncmPuller.backup_config()

        return ncmPuller.response, ncmPuller.status

    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Server Error In Configuration Backup", 500


@app.route("/restoreConfiguration", methods=["POST"])
@token_required
def RestoreConfiguration(user_data):
    return "Service Not Available At This Time", 500
    if True:
        try:
            ncmObj = request.get_json()
            queryString = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,DEVICE_NAME from ncm_table where IP_ADDRESS='{ncmObj['ip_address']}';"
            result = db.session.execute(queryString)

            for row in result:
                objDict = {}
                ip_address = row[0]
                device_type = row[1]
                password_group = row[2]
                device_name = row[3]
                objDict["ip_address"] = ip_address
                objDict["device_type"] = device_type
                objDict["device_name"] = device_name
                queryString2 = f"select USERNAME,PASSWORD from password_group_table where password_group='{password_group}';"
                result2 = db.session.execute(queryString2)
                for row2 in result2:
                    username = row2[0]
                    password = row2[1]
                    username = username.strip()
                    password = password.strip()
                    objDict["username"] = username
                    objDict["password"] = password

            restoreConfigurationPoller = RestorePuller()

            if device_type == "cisco_ios_xe":
                device_type = "cisco_xe"
            if device_type == "cisco_ios_xr":
                device_type = "cisco_xr"

            endResult = restoreConfigurationPoller.poll(
                objDict, device_type, ncmObj["date"]
            )
            if restoreConfigurationPoller.success() == True:
                return "Configuration Restored Successfully", 200
            elif restoreConfigurationPoller.FileDoesNotExist() == True:
                return "File Does Not Exist", 500
            elif restoreConfigurationPoller.FailedLogin():
                return "Failed to Login into Device", 500

        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({"message": "Authentication Failed"}), 401


@app.route("/configurationComparison", methods=["POST"])
@token_required
def ConfigurationComparison(user_data):
    try:
        ncmObj = request.get_json()

        if "ncm_device_id" not in ncmObj.keys():
            return "NCM Device ID Is Missing", 500

        if ncmObj["ncm_device_id"] is None:
            return "NCM Device ID Is Empty", 500

        history1 = NCM_History_Table.query.filter(
            NCM_History_Table.ncm_device_id == ncmObj["ncm_device_id"],
            NCM_History_Table.configuration_date == ncmObj["date1"],
        ).first()

        history2 = (
            NCM_History_Table.query()
            .filter(
                NCM_History_Table.ncm_device_id == ncmObj["ncm_device_id"],
                NCM_History_Table.configuration_date == ncmObj["date2"],
            )
            .first()
        )

        if history1 is None or history2 is None:
            return "One of the Configurations Not Found", 500

        if history1.ncm_history_id == history2.ncm_history_id:
            return "One of the Configurations Not Found", 500

        cwd = os.getcwd()
        existingPath = f"{cwd}/app/templates/html_diff_output.html"
        existingPath1 = os.path.exists(existingPath)
        if existingPath1:
            print("Existing File Removed", file=sys.stderr)
            os.remove(existingPath)
        else:
            pass

        cwd = os.getcwd()
        path = f"{cwd}/app/configuration_backups/"
        path1 = f"/app/app/templates/html_diff_output.html"
        html_diff = ConfDiff(
            f"{path}{history1.file_name}", f"{path}{history2.file_name2}", path1
        )
        difference = html_diff.diff()

        if difference == None:
            return "No Difference Found In Configurations", 500

        return render_template("html_diff_output.html"), 200
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return str(e), 500


# @app.route('/recentConfigrations',methods = ["GET"])
# # @token_required
# def recentConfigrations():
#     if True:
#         try:
#             queryString = f"select distinct CONFIGURATION_DATE  from ncm_history_table  order by CONFIGURATION_DATE desc limit 2;"
#             result = db.session.execute(queryString).fetchall()
#             for row in result:
#                 dt=row[0]
#                 queryString = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE={dt};"
#             for row in result:
#                 dt1=row[1]
#                 queryString1 = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE={dt1};"
#             if queryString=="" or queryString1=="":
#                 return "One of the Configurations Not Found",500
#             else:
#                 # cwd = os.getcwd()
#                 # path = f"{cwd}/app/configuration_backups/"
#                 # path1 = f"/app/app/templates/html_diff_output.html"
#                 html_diff = ConfDiff(f"{queryString}, f"{queryString1}")
#                 html_diff.diff()

#                 return render_template('html_diff_output.html'),200
#         except Exception as e:
#             print(str(e),file=sys.stderr)
#             traceback.print_exc()
#             return str(e),500
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({'message': 'Authentication Failed'}), 401


@app.route("/bulkBackupConfigurations", methods=["POST"])
@token_required
def BulkBackupConfigurations(user_data):
    try:
        ids = request.get_json()

        errorList = []
        responseList = []

        for id in ids:
            ncmObj = {"ncm_device_id": id}

            ncmPuller = NCMPuller()
            ncmPuller.setup_puller(ncmObj)

            if ncmPuller.status == 500:
                errorList.append(ncmPuller.response)
                continue

            ncmPuller.backup_config()

            if ncmPuller.status == 200:
                responseList.append(ncmPuller.response)
            else:
                errorList.append(ncmPuller.response)

        responseDict = {
            "success": len(responseList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": responseList,
        }

        return jsonify(responseDict), 200

    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Server Error In Bulk Configuration Backup", 500


@app.route("/downloadConfiguration", methods=["POST"])
@token_required
def DownloadConfiguration(user_data):
    try:
        ncmObj = request.get_json()

        if "ncm_history_id" not in ncmObj.keys():
            return "NCM Device ID Is Missing", 500

        if ncmObj["ncm_history_id"] is None:
            return "NCM Device ID Is Empty", 500

        history = NCM_History_Table.query.filter(
            NCM_History_Table.ncm_history_id == ncmObj["ncm_history_id"]
        ).first()
        
        if history is None:
            return "Configuration Does Not Exits", 500

        if history.file_name != "":
            cwd = os.getcwd()
            path = cwd + f"/app/configuration_backups/{history.file_name}"
            pathExists = os.path.exists(path)
            
            if pathExists:
                f = open(path, "r")
                output = f.read()
                if output == "":
                    return "Configuration Does Not Exist", 500
                else:
                   return jsonify({
                       'name': history.file_name,
                       'value' : output
                   }) , 200

            else:
                return "File Does Not Exist", 500
        else:
            return "File Does Not Exist", 500
        
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return "Error While Downloading Backup File", 500


def checkFile(id):
    queryString = f"select file_name from ncm_history_table h1 where h1.ncm_device_id= {id} and h1.configuration_date = (SELECT MAX(h2.configuration_date) FROM ncm_history_table h2 WHERE h2.ncm_device_id = h1.ncm_device_id);"
    result = db.session.execute(queryString)
    file_name = ""
    
    for row in result:
        file_name+=row[0]
    
    if file_name!="":

        cwd = os.getcwd()
        path = cwd+f"/app/configuration_backups/{file_name}"
        pathExists = os.path.exists(path)
        
        output = ""
        if pathExists:
            
            f = open(path,"r")
            output = f.read()
            if output == "":
                return None    

            return file_name, output

        else:
            return None
    else:
        return None



def bulkDownloadThread(ncmObj, responseList, errorList):
    ncmPuller = NCMPuller()
    ncmPuller.setup_puller(ncmObj)

    if ncmPuller.status == 500:
        errorList.append(ncmPuller.response)
    else:
        ncmPuller.backup_config()
        
        if ncmPuller.status == 200:
            responseList.append(ncmPuller.response)
        else:
            errorList.append(ncmPuller.response)


@app.route('/downloadBulkConfiguration',methods = ['POST'])
@token_required
def DownloadBulkConfiguration(user_data):
    if True:
        try:
            ips = request.get_json()
            print(ips,file=sys.stderr)
            finalResult = []
            
            pullerList = []
            for ip in ips:
                
                file_data = checkFile(ip)
                
                if file_data is None:
                    pullerList.append(ip)
                else:
                    file_name, output = file_data
                    finalResult.append({
                        'name' : file_name,
                        'value' : output
                    })
             
            threads = []   
            for ip in pullerList:    
                thread = threading.Thread(target=bulkDownloadThread, args=(ip, finalResult, ))
                thread.start()
                threads.append(thread)
            
            for thread in threads:
                thread.join()

            
            return jsonify(finalResult),200
            
        except Exception as e:
            print(str(e),file=sys.stderr)
            traceback.print_exc()
            return str(e),500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401  


@app.route("/deleteConfigurations", methods=["POST"])
@token_required
def DeleteConfigurations(user_data):
    try:
        configurationObjs = request.get_json()
        for configurationObj in configurationObjs:
            queryString = (
                f"delete from ncm_history_table where FILE_NAME='{configurationObj}';"
            )
            db.session.execute(queryString)
            db.session.commit()
            if os.path.exists(f"{configurationObj}.cfg"):
                os.remove(f"{configurationObj}.cfg")
            else:
                print("The file does not exist")
        return "Configurations Deleted Successfully", 200
    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return str(e), 500


@app.route("/mostRecentChanges", methods=["GET"])
@token_required
def MostRecentChanges(user_data):
    if True:
        try:
            cwd = os.getcwd()
            existingPath = f"{cwd}/app/templates/html_diff_output_most_recent.html"
            existingPath1 = os.path.exists(existingPath)
            if existingPath1:
                print("Existing File Removed", file=sys.stderr)
                os.remove(existingPath)
            else:
                pass
            queryString = f"select CONFIGURATION_DATE from ncm_history_table order by CONFIGURATION_DATE DESC LIMIT 2;"
            result = db.session.execute(queryString)
            dateList = []
            for row in result:
                dateList.append(row[0])
            if len(dateList) <= 2:
                return "There Should be Atleast Two Backups", 500
            else:
                fileList = []
                queryString1 = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE='{dateList[1]}';"
                result1 = db.session.execute(queryString1)
                for row in result1:
                    fileList.append(row[0])
                queryString2 = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE='{dateList[0]}';"
                result2 = db.session.execute(queryString2)
                for row in result2:
                    fileList.append(row[0])
                if len(fileList) == 2:
                    cwd = os.getcwd()
                    path = f"{cwd}/app/configuration_backups/"
                    path1 = f"/app/app/templates/html_diff_output_most_recent.html"
                    html_diff = ConfDiff(
                        f"{path}{fileList[0]}.cfg", f"{path}{fileList[1]}.cfg", path1
                    )
                    html_diff.diff()

                    return render_template("html_diff_output.html"), 200
                else:
                    return "Something Went Wrong", 500
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({"message": "Authentication Failed"}), 401
