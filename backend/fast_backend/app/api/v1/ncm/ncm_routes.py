import threading

from app.api.v1.ncm.utils.ncm_utils import *
from app.schema.ncm_schema import *

# from app.ncm.ncm_pullers.ncm_puller import NCMPuller
# from app.conf_diff_main.conf_diff import ConfDiff

router = APIRouter(
    prefix="/atom",
    tags=["atom"],
)


@router.post("/addNcmDevice", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def add_ncm_device(ncm_obj: AddNcmRequestSchema):
    try:
        msg, status = add_ncm_device_util(ncm_obj, False)
        return JSONResponse(content=msg, status_code=status)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Adding NCM Device", status_code=500)


@router.post("/addNcmDevices", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
async def add_ncm_devices(ncm_objs: list[AddNcmRequestSchema]):
    try:
        success_list = []
        error_list = []

        row = 0
        for ncm_obj in ncm_objs:
            try:
                row += 1

                ncm_obj["ip_address"] = ncm_obj["ip_address"].strip()
                if ncm_obj["ip_address"] == "":
                    error_list.append(f"Row {row} : IP Address Can Not Be Empty")
                    continue

                atom = configs.db.query(AtomTable).filter(
                    AtomTable.ip_address == ncm_obj["ip_address"]).first()

                if atom is not None:
                    msg, status = add_complete_atom(ncm_obj, True)
                else:
                    msg, status = add_ncm_device_util(ncm_obj, False)

            except Exception:
                traceback.print_exc()
                status = 500
                msg = f"{ncm_obj['ip_address']} : Exception Occurred"

            if status == 500:
                error_list.append(msg)
            else:
                success_list.append(msg)

        response_dict = {
            "success": len(success_list),
            "error": len(error_list),
            "error_list": error_list,
            "success_list": success_list,
        }

        return JSONResponse(content=response_dict, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Adding/Updating NCM Devices",
                            status_code=500)


@router.post("/editNcmDevice", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def edit_ncm_device(ncm_obj: AddNcmRequestSchema):
    try:
        msg, status = edit_ncm_device_util(ncm_obj)
        return JSONResponse(content=msg, status_code=status)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Adding NCM Device", status_code=500)


@router.get("/getAllNcmDevices", responses={
    200: {"model": list[GetAllNcmResponseSchema]},
    500: {"model": str}

})
async def get_all_ncm_devices():
    try:
        ncm_list = []
        results = (
            configs.db.query(NcmDeviceTable, AtomTable)
            .join(AtomTable, AtomTable.atom_id == NcmDeviceTable.atom_id)
            .all()
        )

        for ncm, atom in results:
            password = PasswordGroupTable.query.filter(
                PasswordGroupTable.password_group_id == atom.password_group_id
            ).first()

            ncm_dict = {"ncm_device_id": ncm.ncm_device_id, "atom_id": ncm.atom_id,
                        "ip_address": atom.ip_address, "device_name": atom.device_name,
                        "device_type": atom.device_type, "function": atom.function,
                        "vendor": atom.vendor, "status": ncm.status,
                        "backup_status": ncm.backup_status,
                        "password_group": password.password_group,
                        "modification_date": ncm.modification_date,
                        "creation_date": ncm.creation_date}

            ncm_list.append(ncm_dict)
        return JSONResponse(content=ncm_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching NCM Devices", status_code=500)


@router.get("/getAtomInNcm", responses={
    200: {"model": list[GetAtomInNcmResponseSchema]},
    500: {"model": str}

})
async def get_atom_in_ncm():
    try:
        atom_ids = []
        ncm_devices = NcmDeviceTable.query.all()
        for ncm in ncm_devices:
            atom_ids.append(ncm.atom_id)

        results = AtomTable.query.all()

        atom_list = []
        for atom in results:
            if atom.atom_id in atom_ids:
                continue

            password_group = None
            if atom.password_group_id is not None:
                password = PasswordGroupTable.query.filter(
                    PasswordGroupTable.password_group_id == atom.password_group_id
                ).first()

                if password is not None:
                    password_group = password.password_group

            obj_dict = {"atom_id": atom.atom_id, "ip_address": atom.ip_address,
                        "device_name": atom.device_name, "device_type": atom.device_type,
                        "password_group": password_group, "vendor": atom.vendor,
                        "function": atom.function}
            atom_list.append(obj_dict)

        return JSONResponse(content=atom_list, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Atom In NCM", status_code=500)


@router.post("/addNcmFromAtom", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
async def add_ncm_from_atom(atom_ids: list[int]):
    try:

        success_list = []
        error_list = []

        for atom_id in atom_ids:
            atom = AtomTable.query.filter(AtomTable.atom_id == atom_id).first()

            if atom is not None:
                ncm = NcmDeviceTable()
                ncm.atom_id = atom.atom_id
                ncm.status = "Active"

                if InsertDBData(ncm) == 200:
                    success_list.append(f"{atom.ip_address} : Device Added Successfully")
                else:
                    error_list.append(
                        f"{atom.ip_address} : Exception Occurred While Insertion"
                    )

            else:
                error_list.append(f"{atom_id} : Atom Not Found")

        response_dict = {
            "success": len(success_list),
            "error": len(error_list),
            "error_list": error_list,
            "success_list": success_list,
        }

        return JSONResponse(content=response_dict, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Importing Atom In NCM", status_code=500)


@router.post("/deleteNcmDevice", responses={

})
async def delete_ncm_device(ncm_ids: list[int]):
    try:
        error_list = []
        response_list = []
        for ncm_id in ncm_ids:
            ncm = configs.db.query(NcmDeviceTable).filter(
                NcmDeviceTable.ncm_device_id == ncm_id).first()

            if ncm is None:
                error_list.append(f"{ncm_id} : No NCM Device Found")
            elif DeleteDBData(ncm):
                response_list.append(f"{ncm_id} : Device Deleted Successfully")
            else:
                error_list.append(f"{ncm_id} : Error While Deleting Device")

        response_dict = {
            "success": len(response_list),
            "error": len(error_list),
            "error_list": error_list,
            "success_list": response_list,
        }

        return JSONResponse(content=response_dict, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Deleting NCM Devices", status_code=500)


# @app.route("/getAllConfigurations", methods=["POST"])
# @token_required
# def GetAllConfigurationDates(user_data):
#     try:
#         ncmObj = request.get_json()
#
#         if "ncm_device_id" not in ncmObj.keys():
#             return "NCM Device ID Is Missing", 500
#
#         if ncmObj["ncm_device_id"] is None:
#             return "NCM Device ID Is Empty", 500
#
#         results = NCM_History_Table.query.filter(
#             NCM_History_Table.ncm_device_id == ncmObj["ncm_device_id"]
#         ).all()
#
#         objList = []
#         for history in results:
#             objDict = {}
#             objDict["ncm_history_id"] = history.ncm_history_id
#             objDict["date"] = (history.configuration_date).strftime("%Y-%m-%d %H:%M:%S")
#             objDict["file_name"] = history.file_name
#
#             objList.append(objDict)
#
#         return jsonify(objList), 200
#     except Exception as e:
#         print(str(e), file=sys.stderr)
#         traceback.print_exc()
#         return "Server Error While Fetching Backup History", 500
#
#
# def CheckPath(file_path):
#     from pathlib import Path
#
#     # create a Path object with the path to the file
#     path = Path(file_path)
#
#     return path.is_file()
#
#
# @app.route("/getAllConfigurationDatesInString", methods=["POST"])
# @token_required
# def GetAllConfigurationDatesInString(user_data):
#     try:
#         ncmObj = request.get_json()
#
#         if "ncm_device_id" not in ncmObj.keys():
#             return "NCM Device ID Is Missing", 500
#
#         if ncmObj["ncm_device_id"] is None:
#             return "NCM Device ID Is Empty", 500
#
#         results = NCM_History_Table.query.filter(
#             NCM_History_Table.ncm_device_id == ncmObj["ncm_device_id"]
#         ).all()
#
#         objList = []
#         for history in results:
#             date = (history.configuration_date).strftime("%Y-%m-%d %H:%M:%S")
#             objList.append(date)
#
#         return jsonify(objList), 200
#     except Exception as e:
#         print(str(e), file=sys.stderr)
#         traceback.print_exc()
#         return "Server Error While Fetching Configuration Dates", 500
#
#
# @app.route("/getConfigurationFromDate", methods=["POST"])
# @token_required
# def GetConfigurationFromDate(user_data):
#     try:
#         ncmObj = request.get_json()
#
#         if "ncm_device_id" not in ncmObj.keys():
#             return "NCM Device ID Is Missing", 500
#
#         if ncmObj["ncm_device_id"] is None:
#             return "NCM Device ID Is Empty", 500
#
#         history = NCM_History_Table.query.filter(
#             NCM_History_Table.ncm_device_id == ncmObj["ncm_device_id"],
#             NCM_History_Table.configuration_date == ncmObj["date"],
#         ).first()
#
#         if history is None:
#             return "Backup File Not Found", 500
#
#         cwd = os.getcwd()
#         file_path = cwd + "/app/configuration_backups/" + history.file_name
#         pathFlag = CheckPath(file_path)
#
#         if pathFlag:
#             f = open(file_path, "r")
#             configuration = f.read()
#             return configuration, 200
#         else:
#             DeleteDBData(history)
#             return "Configuration Does Not Exist", 500
#
#     except Exception as e:
#         traceback.print_exc()
#         return "Server Error While Fetching Backup", 500
#
#
# @app.route("/sendCommand", methods=["POST"])
# @token_required
# def SendCommand(user_data):
#     try:
#         ncmObj = request.get_json()
#
#         ncmPuller = NCMPuller()
#         ncmPuller.setup_puller(ncmObj)
#
#         if ncmPuller.status == 500:
#             return ncmPuller.response, 500
#
#         if "cmd" not in ncmObj.keys():
#             return "Command Is Missing", 500
#
#         if ncmObj["cmd"] is None:
#             return "Command Is Empty", 500
#
#         ncmObj["cmd"] = str(ncmObj["cmd"]).strip()
#         if ncmObj["cmd"] == "":
#             return "Command Is Empty", 500
#
#         ncmPuller.send_remote_command(ncmObj["cmd"])
#
#         return ncmPuller.response, ncmPuller.status
#
#     except Exception as e:
#         print(str(e), file=sys.stderr)
#         traceback.print_exc()
#         return "Server Error While Sending Remote Command", 500
#
#
# @app.route("/backupConfigurations", methods=["POST"])
# def BackupConfigurations():
#     try:
#         ncmObj = request.get_json()
#
#         ncmPuller = NCMPuller()
#         ncmPuller.setup_puller(ncmObj)
#
#         if ncmPuller.status == 500:
#             return ncmPuller.response, 500
#
#         ncmPuller.backup_config()
#
#         return ncmPuller.response, ncmPuller.status
#
#     except Exception as e:
#         print(str(e), file=sys.stderr)
#         traceback.print_exc()
#         return "Server Error In Configuration Backup", 500
#
#
# @app.route("/restoreConfiguration", methods=["POST"])
# @token_required
# def RestoreConfiguration(user_data):
#     return "Service Not Available At This Time", 500
#     if True:
#         try:
#             ncmObj = request.get_json()
#             queryString = f"select IP_ADDRESS,DEVICE_TYPE,PASSWORD_GROUP,DEVICE_NAME from ncm_table where IP_ADDRESS='{ncmObj['ip_address']}';"
#             result = db.session.execute(queryString)
#
#             for row in result:
#                 objDict = {}
#                 ip_address = row[0]
#                 device_type = row[1]
#                 password_group = row[2]
#                 device_name = row[3]
#                 objDict["ip_address"] = ip_address
#                 objDict["device_type"] = device_type
#                 objDict["device_name"] = device_name
#                 queryString2 = f"select USERNAME,PASSWORD from password_group_table where password_group='{password_group}';"
#                 result2 = db.session.execute(queryString2)
#                 for row2 in result2:
#                     username = row2[0]
#                     password = row2[1]
#                     username = username.strip()
#                     password = password.strip()
#                     objDict["username"] = username
#                     objDict["password"] = password
#
#             restoreConfigurationPoller = RestorePuller()
#
#             if device_type == "cisco_ios_xe":
#                 device_type = "cisco_xe"
#             if device_type == "cisco_ios_xr":
#                 device_type = "cisco_xr"
#
#             endResult = restoreConfigurationPoller.poll(
#                 objDict, device_type, ncmObj["date"]
#             )
#             if restoreConfigurationPoller.success() == True:
#                 return "Configuration Restored Successfully", 200
#             elif restoreConfigurationPoller.FileDoesNotExist() == True:
#                 return "File Does Not Exist", 500
#             elif restoreConfigurationPoller.FailedLogin():
#                 return "Failed to Login into Device", 500
#
#         except Exception as e:
#             print(str(e), file=sys.stderr)
#             traceback.print_exc()
#             return str(e), 500
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({"message": "Authentication Failed"}), 401
#
#
# @app.route("/configurationComparison", methods=["POST"])
# @token_required
# def ConfigurationComparison(user_data):
#     try:
#         ncmObj = request.get_json()
#
#         if "ncm_device_id" not in ncmObj.keys():
#             return "NCM Device ID Is Missing", 500
#
#         if ncmObj["ncm_device_id"] is None:
#             return "NCM Device ID Is Empty", 500
#
#         history1 = NCM_History_Table.query.filter(
#             NCM_History_Table.ncm_device_id == ncmObj["ncm_device_id"],
#             NCM_History_Table.configuration_date == ncmObj["date1"],
#         ).first()
#
#         history2 = NCM_History_Table.query.filter(
#             NCM_History_Table.ncm_device_id == ncmObj["ncm_device_id"],
#             NCM_History_Table.configuration_date == ncmObj["date2"],
#         ).first()
#
#         if history1 is None or history2 is None:
#             return "One of the Configurations Not Found", 500
#
#         if history1.ncm_history_id == history2.ncm_history_id:
#             return "One of the Configurations Not Found", 500
#
#         cwd = os.getcwd()
#         existingPath = f"{cwd}/app/templates/html_diff_output.html"
#         existingPath1 = os.path.exists(existingPath)
#         if existingPath1:
#             print("Existing File Removed", file=sys.stderr)
#             os.remove(existingPath)
#         else:
#             pass
#
#         cwd = os.getcwd()
#         path = f"{cwd}/app/configuration_backups/"
#         path1 = f"/app/app/templates/html_diff_output.html"
#         html_diff = ConfDiff(
#             f"{path}{history1.file_name}", f"{path}{history2.file_name2}", path1
#         )
#         difference = html_diff.diff()
#
#         if difference == None:
#             return "No Difference Found In Configurations", 500
#
#         return render_template("html_diff_output.html"), 200
#     except Exception as e:
#         print(str(e), file=sys.stderr)
#         traceback.print_exc()
#         return str(e), 500
#
#
# # @app.route('/recentConfigrations',methods = ["GET"])
# # # @token_required
# # def recentConfigrations():
# #     if True:
# #         try:
# #             queryString = f"select distinct CONFIGURATION_DATE  from ncm_history_table  order by CONFIGURATION_DATE desc limit 2;"
# #             result = db.session.execute(queryString).fetchall()
# #             for row in result:
# #                 dt=row[0]
# #                 queryString = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE={dt};"
# #             for row in result:
# #                 dt1=row[1]
# #                 queryString1 = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE={dt1};"
# #             if queryString=="" or queryString1=="":
# #                 return "One of the Configurations Not Found",500
# #             else:
# #                 # cwd = os.getcwd()
# #                 # path = f"{cwd}/app/configuration_backups/"
# #                 # path1 = f"/app/app/templates/html_diff_output.html"
# #                 html_diff = ConfDiff(f"{queryString}, f"{queryString1}")
# #                 html_diff.diff()
#
# #                 return render_template('html_diff_output.html'),200
# #         except Exception as e:
# #             print(str(e),file=sys.stderr)
# #             traceback.print_exc()
# #             return str(e),500
# #     else:
# #         print("Authentication Failed", file=sys.stderr)
# #         return jsonify({'message': 'Authentication Failed'}), 401
#
#
# @app.route("/bulkBackupConfigurations", methods=["POST"])
# @token_required
# def BulkBackupConfigurations(user_data):
#     try:
#         ids = request.get_json()
#
#         errorList = []
#         responseList = []
#
#         for id in ids:
#             ncmObj = {"ncm_device_id": id}
#
#             ncmPuller = NCMPuller()
#             ncmPuller.setup_puller(ncmObj)
#
#             if ncmPuller.status == 500:
#                 errorList.append(ncmPuller.response)
#                 continue
#
#             ncmPuller.backup_config()
#
#             if ncmPuller.status == 200:
#                 responseList.append(ncmPuller.response)
#             else:
#                 errorList.append(ncmPuller.response)
#
#         responseDict = {
#             "success": len(responseList),
#             "error": len(errorList),
#             "error_list": errorList,
#             "success_list": responseList,
#         }
#
#         return jsonify(responseDict), 200
#
#     except Exception as e:
#         print(str(e), file=sys.stderr)
#         traceback.print_exc()
#         return "Server Error In Bulk Configuration Backup", 500
#
#
# @app.route("/downloadConfiguration", methods=["POST"])
# @token_required
# def DownloadConfiguration(user_data):
#     try:
#         ncmObj = request.get_json()
#
#         if "ncm_history_id" not in ncmObj.keys():
#             return "NCM Device ID Is Missing", 500
#
#         if ncmObj["ncm_history_id"] is None:
#             return "NCM Device ID Is Empty", 500
#
#         history = NCM_History_Table.query.filter(
#             NCM_History_Table.ncm_history_id == ncmObj["ncm_history_id"]
#         ).first()
#
#         if history is None:
#             return "Configuration Does Not Exits", 500
#
#         if history.file_name != "":
#             cwd = os.getcwd()
#             path = cwd + f"/app/configuration_backups/{history.file_name}"
#             pathExists = os.path.exists(path)
#
#             if pathExists:
#                 f = open(path, "r")
#                 output = f.read()
#                 if output == "":
#                     return "Configuration Does Not Exist", 500
#                 else:
#                     return jsonify({"name": history.file_name, "value": output}), 200
#
#             else:
#                 return "File Does Not Exist", 500
#         else:
#             return "File Does Not Exist", 500
#
#     except Exception as e:
#         print(str(e), file=sys.stderr)
#         traceback.print_exc()
#         return "Error While Downloading Backup File", 500
#
#
# def checkFile(id):
#     queryString = f"select file_name from ncm_history_table h1 where h1.ncm_device_id= {id} and h1.configuration_date = (SELECT MAX(h2.configuration_date) FROM ncm_history_table h2 WHERE h2.ncm_device_id = h1.ncm_device_id);"
#     result = db.session.execute(queryString)
#     file_name = ""
#
#     for row in result:
#         file_name += row[0]
#
#     if file_name != "":
#         cwd = os.getcwd()
#         path = cwd + f"/app/configuration_backups/{file_name}"
#         pathExists = os.path.exists(path)
#
#         output = ""
#         if pathExists:
#             f = open(path, "r")
#             output = f.read()
#             if output == "":
#                 return None
#
#             return file_name, output
#
#         else:
#             return None
#     else:
#         return None
#
#
# def bulkDownloadThread(ncmObj, responseList, errorList):
#     ncmPuller = NCMPuller()
#     ncmPuller.setup_puller(ncmObj)
#
#     if ncmPuller.status == 500:
#         errorList.append(ncmPuller.response)
#     else:
#         ncmPuller.backup_config()
#
#         if ncmPuller.status == 200:
#             responseList.append(ncmPuller.response)
#         else:
#             errorList.append(ncmPuller.response)
#
#
# @app.route("/downloadBulkConfiguration", methods=["POST"])
# @token_required
# def DownloadBulkConfiguration(user_data):
#     if True:
#         try:
#             ips = request.get_json()
#             print(ips, file=sys.stderr)
#             finalResult = []
#
#             pullerList = []
#             for ip in ips:
#                 file_data = checkFile(ip)
#
#                 if file_data is None:
#                     pullerList.append(ip)
#                 else:
#                     file_name, output = file_data
#                     finalResult.append({"name": file_name, "value": output})
#
#             threads = []
#             for ip in pullerList:
#                 thread = threading.Thread(
#                     target=bulkDownloadThread,
#                     args=(
#                         ip,
#                         finalResult,
#                     ),
#                 )
#                 thread.start()
#                 threads.append(thread)
#
#             for thread in threads:
#                 thread.join()
#
#             return jsonify(finalResult), 200
#
#         except Exception as e:
#             print(str(e), file=sys.stderr)
#             traceback.print_exc()
#             return str(e), 500
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({"message": "Authentication Failed"}), 401
#
#
# @app.route("/deleteConfigurations", methods=["POST"])
# @token_required
# def DeleteConfigurations(user_data):
#     try:
#         configurationObjs = request.get_json()
#         for configurationObj in configurationObjs:
#             queryString = (
#                 f"delete from ncm_history_table where FILE_NAME='{configurationObj}';"
#             )
#             db.session.execute(queryString)
#             db.session.commit()
#             if os.path.exists(f"{configurationObj}.cfg"):
#                 os.remove(f"{configurationObj}.cfg")
#             else:
#                 print("The file does not exist")
#         return "Configurations Deleted Successfully", 200
#     except Exception as e:
#         print(str(e), file=sys.stderr)
#         traceback.print_exc()
#         return str(e), 500
#
#
# @app.route("/mostRecentChanges", methods=["GET"])
# @token_required
# def MostRecentChanges(user_data):
#     if True:
#         try:
#             cwd = os.getcwd()
#             existingPath = f"{cwd}/app/templates/html_diff_output_most_recent.html"
#             existingPath1 = os.path.exists(existingPath)
#             if existingPath1:
#                 print("Existing File Removed", file=sys.stderr)
#                 os.remove(existingPath)
#             else:
#                 pass
#             queryString = f"select CONFIGURATION_DATE from ncm_history_table order by CONFIGURATION_DATE DESC LIMIT 2;"
#             result = db.session.execute(queryString)
#             dateList = []
#             for row in result:
#                 dateList.append(row[0])
#             if len(dateList) <= 2:
#                 return "There Should be Atleast Two Backups", 500
#             else:
#                 fileList = []
#                 queryString1 = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE='{dateList[1]}';"
#                 result1 = db.session.execute(queryString1)
#                 for row in result1:
#                     fileList.append(row[0])
#                 queryString2 = f"select FILE_NAME from ncm_history_table where CONFIGURATION_DATE='{dateList[0]}';"
#                 result2 = db.session.execute(queryString2)
#                 for row in result2:
#                     fileList.append(row[0])
#                 if len(fileList) == 2:
#                     cwd = os.getcwd()
#                     path = f"{cwd}/app/configuration_backups/"
#                     path1 = f"/app/app/templates/html_diff_output_most_recent.html"
#                     html_diff = ConfDiff(
#                         f"{path}{fileList[0]}.cfg", f"{path}{fileList[1]}.cfg", path1
#                     )
#                     html_diff.diff()
#
#                     return render_template("html_diff_output.html"), 200
#                 else:
#                     return "Something Went Wrong", 500
#         except Exception as e:
#             print(str(e), file=sys.stderr)
#             traceback.print_exc()
#             return str(e), 500
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({"message": "Authentication Failed"}), 401
