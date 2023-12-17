from pathlib import Path

from fastapi import Request
from fastapi.responses import HTMLResponse

from app.api.v1.ncm.conf_diff_main.conf_diff import ConfDiff
from app.api.v1.ncm.ncm_pullers.ncm_puller import NCMPuller
from app.api.v1.ncm.utils.ncm_utils import *
from app.schema.ncm_schema import *

router = APIRouter(
    prefix="/ncm_device",
    tags=["ncm_device"],
)


@router.get("/ncm_backup_summery_dashboard", responses={
    200: {"model": list[NcmAlarmSchema]},
    500: {"model": str}
})
async def ncm_backup_summery_dashboard():
    try:
        results = NcmDeviceTable.query.all()

        not_backup = 0
        fail = 0
        success = 0

        for ncm in results:
            if ncm.backup_status is None:
                not_backup += 1
            elif ncm.backup_status is False:
                fail += 1
            elif ncm.backup_status is True:
                success += 1

        objList = [
            {"name": "Backup Successful", "value": success},
            {"name": "Backup Failure", "value": fail},
            {"name": "Not Backup", "value": not_backup},
        ]

        return JSONResponse(content=objList, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Data", status_code=500)


@router.get("/get_vendors_in_ncm", responses={
    200:{"model":GetNcmVendorSchema},
    500:{"model":str}
},

)
async def ncm_vendor_count():
    try:
        queryString = (f"select atom_table.vendor, count(*) from ncm_device_table inner join "
                       f"atom_table on ncm_device_table.atom_id = atom_table.atom_id  "
                       f"group by vendor;")
        print("query string is::::::::::::::::::::::::",queryString,file=sys.stderr)
        result = configs.db.execute(queryString)
        print("reuslt is:::::::::::",result,file=sys.stderr)
        obj_list = []

        for row in result:
            print("row is::::::::::::::::::::::",row,file=sys.stderr)
            print("row [0] is:::::::::::::::",row[0],file=sys.stderr)
            print("row[1] is:::::::::::::::::::",row[1],file=sys.stderr)
            obj_dict = {"name": row[0], "value": row[1]}
            print("obj dict is::::::::::::::::::::",obj_dict,file=sys.stderr)
            if row[0] is None:
                obj_dict["name"] = "Other"

            obj_list.append(obj_dict)
        print("objlist is:::::::::::::::::",obj_list,file=sys.stderr)
        return JSONResponse(content=obj_list, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse("Server Error While Fetching Data", status_code=500)


@router.post("/add_ncm_device", responses={
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


@router.post("/add_ncm_devices", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
async def add_ncm_devices(ncm_objs: list[AddNcmRequestSchema]):
    try:
        data = []
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
                    print("msg is:::::::::::::::::::::::",msg,file=sys.stderr)
                    print("if atom is not none::::",status,file=sys.stderr)
                    if isinstance(msg,dict):
                        for key,value in msg.items():
                            print("key is::::::::::::::::::::::",key,file=sys.stderr)
                            print("msg is::::::::::::::::::::::",msg,file=sys.stderr)
                            if key == 'data':
                                data.append(value)
                            elif key == 'message':
                                success_list.append(value)
                else:
                    msg, status = add_ncm_device_util(ncm_obj, False)
                    print("ncm is:::::::::",msg,file=sys.stderr)
                    print("ncm status is:::::::::::::::::",status,file=sys.stderr)
                    if isinstance(msg,dict):
                        for key,value in msg.items():
                            print("key is::::::::::::::::::::::",key,file=sys.stderr)
                            print("msg is::::::::::::::::::::::",msg,file=sys.stderr)
                            if key == 'data':
                                data.append(value)
                            elif key == 'message':
                                success_list.append(value)
            except Exception:
                traceback.print_exc()
                status = 500
                msg = f"{ncm_obj['ip_address']} : Exception Occurred"

            if status == 500 or status ==400:
                error_list.append(msg)
            else:
                success_list.append(msg)

        response_dict = {
            "data":data,
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


@router.post("/edit_ncm_device", responses={
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


@router.get("/get_all_ncm_devices", responses={
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
            password = configs.db.query(PasswordGroupTable).filter(
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
        return ncm_list

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching NCM Devices", status_code=500)


@router.get("/get_atom_in_ncm", responses={
    200: {"model": list[GetAtomInNcmResponseSchema]},
    500: {"model": str}

})
async def get_atom_in_ncm():
    try:
        atom_ids = []
        ncm_devices = configs.db.query(NcmDeviceTable).all()
        for ncm in ncm_devices:
            atom_ids.append(ncm.atom_id)

        results = configs.db.query(AtomTable).all()

        atom_list = []
        for atom in results:
            if atom.atom_id in atom_ids:
                continue

            password_group = None
            if atom.password_group_id is not None:
                password = configs.db.query(PasswordGroupTable).filter(
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


@router.post("/add_ncm_from_atom", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
async def add_ncm_from_atom(atom_ids: list[int]):
    try:
        data =[]
        success_list = []
        error_list = []

        for atom_id in atom_ids:
            print("atom id is:::::::::::::::::",atom_id,file=sys.stderr)
            atom = configs.db.query(AtomTable).filter(AtomTable.atom_id == atom_id).first()
            if atom is not None:
                print("atom is not none::::::::::::",atom,file=sys.stderr)
                ncm = NcmDeviceTable()
                ncm.atom_id = atom.atom_id
                ncm.status = "Active"

                if InsertDBData(ncm) == 200:
                    data_dict = {
                        # "atom_id":atom.atom_id,
                        "ip_address":atom.ip_address,
                        "device_name":atom.device_name,
                        "vendor":atom.vendor,
                        "device_type":atom.device_type,
                        "fucntion":atom.function,
                        "ncm_device_id":ncm.ncm_device_id,
                        "status":ncm.status,
                        "config_change_date":ncm.config_change_date,
                        "backup_status":ncm.backup_status
                    }
                    print("data dict is::::::::::::::",data_dict,file=sys.stderr)
                    data.append(data_dict)
                    success_list.append(f"{atom.ip_address} : Device Added Successfully")
                else:
                    error_list.append(
                        f"{atom.ip_address} : Exception Occurred While Insertion"
                    )

            else:
                error_list.append(f"{atom_id} : Atom Not Found")

        response_dict = {
            "data":data,
            "success": len(success_list),
            "error": len(error_list),
            "error_list": error_list,
            "success_list": success_list,
        }

        return JSONResponse(content=response_dict, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Importing Atom In NCM", status_code=500)


@router.post("/delete_ncm_device", responses={

})
async def delete_ncm_device(ncm_ids: list[int]):
    try:
        data = []
        error_list = []
        response_list = []
        for ncm_id in ncm_ids:
            ncm = configs.db.query(NcmDeviceTable).filter(
                NcmDeviceTable.ncm_device_id == ncm_id).first()
            data.append(ncm_id)
            print("ncm is:::::::::::::::::::",ncm,file=sys.stderr)
            if ncm is None:
                error_list.append(f"{ncm_id} : No NCM Device Found")
            elif DeleteDBData(ncm):
                response_list.append(f"{ncm_id} : Device Deleted Successfully")
            else:
                error_list.append(f"{ncm_id} : Error While Deleting Device")

        response_dict = {
            "data":data,
            "success": len(response_list),
            "error": len(error_list),
            "error_list": error_list,
            "success_list": response_list,
        }

        return JSONResponse(content=response_dict, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Deleting NCM Devices", status_code=500)


@router.post("/get_all_configurations", responses={
    200: {"model": list[NcmConfigHistorySchema]},
    500: {"model": str}
})
async def get_all_configuration(ncm_device_id: int):
    try:

        results = configs.db.query(NCM_History_Table).filter(
            NCM_History_Table.ncm_device_id == ncm_device_id
        ).all()

        obj_list = []
        for history in results:
            obj_dict = {"ncm_history_id": history.ncm_history_id,
                        "date": history.configuration_date,
                        "file_name": history.file_name}

            obj_list.append(obj_dict)

        return JSONResponse(content=obj_list, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Backup History", status_code=500)


def check_path(file_path):
    from pathlib import Path

    # create a Path object with the path to the file
    path = Path(file_path)

    return path.is_file()


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
@router.post("/get_device_configuration", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def get_device_configuration(ncm_history_id:int):
    try:

        history = configs.db.query(NCM_History_Table).filter(
            NCM_History_Table.ncm_history_id == ncm_history_id
        ).first()

        if history is None:
            return JSONResponse(content="Backup Not Found", status_code=400)

        cwd = os.getcwd()
        file_path = cwd + "/app/configuration_backups/" + history.file_name
        print("file path is::::::::::::::",file_path,file=sys.stderr)
        pathFlag = check_path(file_path)
        print("Path flag is:::::::::::::",pathFlag,file=sys.stderr)

        if pathFlag:
            f = open(file_path, "r")
            configuration = f.read()
            return JSONResponse(content=configuration, status_code=200)
        else:
            DeleteDBData(history)
            return JSONResponse(content="Configuration File Does Not Exist", status_code=400)

    except Exception:
        traceback.print_exc()
        return "Server Error While Fetching Backup", 500


@router.post("/send-command", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def send_command(ncm_obj: SendCommandRequestSchema):
    try:

        ncmPuller = NCMPuller()
        print("ncm puller is::::::::::::::::::",ncmPuller,file=sys.stderr)
        ncmPuller.setup_puller(ncm_obj)

        if ncmPuller.status != 200:
            return JSONResponse(content=ncmPuller.response, status_code=ncmPuller.status)

        ncm_obj["cmd"] = str(ncm_obj["cmd"]).strip()
        if ncm_obj["cmd"] == "":
            return JSONResponse(content="Command Is Empty", status_code=400)

        ncmPuller.send_remote_command(ncm_obj["cmd"])

        return JSONResponse(content=ncmPuller.response, status_code=ncmPuller.status)

    except Exception as e:
        print(str(e), file=sys.stderr)
        traceback.print_exc()
        return JSONResponse(content="Server Error While Sending Remote Command", status_code=500)


@router.post("/get_configuration_backup", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def get_configuration_backup(ncm_obj: NcmDeviceId):
    try:

        ncmPuller = NCMPuller()
        print("ncm puller is::::::::::::::",ncmPuller,file=sys.stderr)
        ncmPuller.setup_puller(ncm_obj)
        print("ncm pulerr obj is::::::::::::::::",ncmPuller.setup_puller(ncm_obj),file=sys.stderr)

        if ncmPuller.status != 200:
            return JSONResponse(content=ncmPuller.response, status_code=ncmPuller.status)

        ncmPuller.backup_config()

        return JSONResponse(content=ncmPuller.response, status_code=ncmPuller.status)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error In Configuration Backup", status_code=500)


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
@router.post("/configuration_comparison", response_class=HTMLResponse, responses={
    400: {"model": str},
    500: {"model": str}
})
async def configuration_comparison(ncm_obj: NcmDeviceId, request: Request):
    try:

        history1 = configs.db.query(NCM_History_Table).filter(
            NCM_History_Table.ncm_history_id == ncm_obj["ncm_history_id_1"],
        ).first()
        print("history 1 is:::::::::::::::::::::::::",history1,file=sys.stderr)
        history2 = configs.db.query(NCM_History_Table).filter(
            NCM_History_Table.ncm_history_id == ncm_obj["ncm_history_id_2"],
        ).first()
        print("history2 is::::::::::::::::::",history2,file=sys.stderr)
        if history1 is None or history2 is None:
            return JSONResponse(content="One of the Configurations Not Found",status_code=400)

        if history1.ncm_history_id == history2.ncm_history_id:
            return JSONResponse(content = "Can not compare same configurations",status_code= 400)

        cwd = os.getcwd()
        existingPath = f"{cwd}/app/templates/html_diff_output.html"
        print("exsisting path is::::::::::::",existingPath,file=sys.stderr)
        existingPath1 = os.path.exists(existingPath)
        print("exisisting path1 is::::::::::",existingPath1,file=sys.stderr)
        if existingPath1:
            print("Existing File Removed", file=sys.stderr)
            os.remove(existingPath)
        else:
            pass

        cwd = os.getcwd()

        path = f"{cwd}/app/configuration_backups/"
        file_1 = Path(f"{path}{history1.file_name}")
        file_2 = Path(f"{path}{history2.file_name2}")
        html_file = Path(f"{cwd}/app/templates/html_diff_output.html")

        html_diff = ConfDiff(file_1, file_2, html_file)
        difference = html_diff.diff()

        if difference is None:
            return JSONResponse(content="No Difference Found In Configurations", status_code=500)

        return configs.templates.TemplateResponse("html_diff_output.html", context=request,
                                                  status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Config Comparison", status_code=500)
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
