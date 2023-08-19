from app.uam.uam_utils import *


@app.route("/totalDevicesInDeviceDashboard", methods=["GET"])
@token_required
def TotalDevicesInDeviceDashboard(user_data):
    try:
        queryString = f"select count(*) from uam_device_table"
        result = db.session.execute(queryString).scalar()
        objList = {"name": "Total Device Count", "value": result}
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/getAllDevices", methods=["GET"])
@token_required
def getAllUamDevices(user_data):
    try:
        return jsonify(GetAllUamDevices()), 200
    except Exception:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/deleteDevice", methods=["POST"])
@token_required
def deleteUamDevice(user_data):
    try:
        success_list = []
        error_list = []
        ip_addresses = request.get_json()

        for ip_address in ip_addresses:
            msg, status = DeleteUamDevice(ip_address)
            if status == 200:
                success_list.append(msg)
            else:
                error_list.append(msg)

        responseDict = {
            "success": len(success_list),
            "error": len(error_list),
            "error_list": error_list,
            "success_list": success_list,
        }

        return jsonify(responseDict), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


# @app.route("/addDevice", methods=["POST"])
# @token_required
# def AddDevice(user_data):
#     if True:
#         try:
#             deviceObj = request.get_json()
#             device = Device_Table()
#             device.device_name = deviceObj["device_name"]
#             device.site_name = deviceObj["site_name"]
#             device.rack_name = deviceObj["rack_name"]
#             device.ip_address = deviceObj["ip_address"]
#             # device.device_type = deviceObj['device_type']
#             device.software_type = deviceObj["software_type"]
#             device.software_version = deviceObj["software_version"]
#             # device.patch_version = deviceObj['patch_version']
#             device.creation_date = datetime.now()
#             device.modification_date = datetime.now()
#             device.status = deviceObj["status"]
#             device.ru = deviceObj["ru"]
#             device.department = deviceObj["department"]
#             device.section = deviceObj["section"]
#             # device.criticality = deviceObj['criticality']
#             device.function = deviceObj["function"]
#             # device.domain = deviceObj['domain']
#             device.manufacturer = deviceObj["manufacturer"]
#             device.virtual = deviceObj["virtual"]
#             device.authentication = deviceObj["authentication"]
#             device.serial_number = deviceObj["serial_number"]
#             device.pn_code = deviceObj["pn_code"]
#             device.subrack_id_number = deviceObj["subrack_id_number"]
#             # device.max_power = deviceObj['max_power']
#             # device.site_type = deviceObj['site_type']
#             device.source = deviceObj["source"]
#             device.stack = deviceObj["stack"]
#             device.contract_number = deviceObj["contract_number"]

#             if (
#                 Device_Table.query.with_entities(Device_Table.ip_address)
#                 .filter_by(ip_address=deviceObj["ip_address"])
#                 .first()
#                 is not None
#             ):
#                 device.device_name = (
#                     Device_Table.query.with_entities(Device_Table.device_name)
#                     .filter_by(ip_address=deviceObj["ip_address"])
#                     .first()[0]
#                 )
#                 print(
#                     f"UPDATED {deviceObj['device_name']} WITH IP ",
#                     deviceObj["ip_address"],
#                     "SUCCESSFULLY",
#                     file=sys.stderr,
#                 )
#                 UpdateData(device)

#             else:
#                 print(
#                     f"Inserted {deviceObj['device_name']} WITH IP ",
#                     deviceObj["ip_address"],
#                     "SUCCESSFULLY",
#                     file=sys.stderr,
#                 )
#                 InsertData(device)

#             flag = "False"
#             if deviceObj["status"] == "Production":
#                 flag = "true"

#             query = f"update atom_table set `ONBOARD_STATUS`='{flag}' where `device_name`='{deviceObj['device_name']}';"
#             db.session.execute(query)
#             db.session.commit()

#             return jsonify({"response": "success", "code": "200"}), 200
#         except Exception as e:
#             traceback.print_exc()
#             return jsonify({"response": "Error", "code": "500"}), 500
#     else:
#         print("Service not Available", file=sys.stderr)
#         return jsonify({"Response": "Service not Available"}), 503


@app.route("/editDevice", methods=["POST"])
@token_required
def editUamDevice(user_data):
    try:
        deviceObj = request.get_json()
        return EditUamDevice(deviceObj)
    except Exception as e:
        traceback.print_exc()
        return "Server Error While Updating Device", 500


@app.route("/deviceStatus", methods=["GET"])
@token_required
def DeviceStatus(user_data):
    try:
        objList = [
            {"name": "Production", "value": 0},
            {"name": "Dismantled", "value": 0},
            {"name": "Maintenance", "value": 0},
            {"name": "Undefined", "value": 0},
        ]

        query = f"select count(*) from uam_device_table;"
        result0 = db.session.execute(query).scalar()
        if result0 != 0:
            queryString = (
                f"select count(status) from uam_device_table where STATUS='Production';"
            )
            result = db.session.execute(queryString).scalar()
            queryString1 = (
                f"select count(status) from uam_device_table where STATUS='Dismantled';"
            )
            result1 = db.session.execute(queryString1).scalar()
            queryString2 = f"select count(status) from uam_device_table where STATUS='Maintenance';"
            result2 = db.session.execute(queryString2).scalar()
            queryString3 = (
                f"select count(status) from uam_device_table where STATUS='Undefined';"
            )
            result3 = db.session.execute(queryString3).scalar()
            objList = [
                {"name": "Production", "value": round(((result / result0) * 100), 2)},
                {"name": "Dismantled", "value": round(((result1 / result0) * 100), 2)},
                {"name": "Maintenance", "value": round(((result2 / result0) * 100), 2)},
                {"name": "Undefined", "value": round(((result3 / result0) * 100), 2)},
            ]

        print(objList, file=sys.stderr)

        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/topFunctions", methods=["GET"])
@token_required
def TopFunctions(user_data):
    try:
        objList = []
        queryString = f"select `FUNCTION`,count(`FUNCTION`) from uam_device_table join atom_table on uam_device_table.atom_id = atom_table.atom_id where `FUNCTION`is not NULL and `FUNCTION`!='' group by `FUNCTION`;"
        result = db.session.execute(queryString)
        for row in result:
            objDict = {}
            function = row[0]
            count = row[1]
            objDict[function] = count
            objList.append(objDict)
        y = {}
        for i in objList:
            for j in i:
                y[j] = i[j]

        print(objList, file=sys.stderr)
        return (y), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/getSiteDetailByIpAddress", methods=["GET"])
@token_required
def GetSiteByIpAddress(user_data):
    ip_address = request.args.get("ipaddress")
    print(ip_address, file=sys.stderr)
    print(type(ip_address), file=sys.stderr)
    if ip_address:
        try:
            result = (
                db.session.query(Atom_Table, Rack_Table, Site_Table)
                .join(Rack_Table, Atom_Table.rack_id == Rack_Table.rack_id)
                .join(Site_Table, Rack_Table.site_id == Site_Table.site_id)
                .filter(Atom_Table.ip_address == ip_address)
                .first()
            )

            if result is None:
                return "No Site Found", 500

            atom, rack, site = result
            siteDataDict = {}
            siteDataDict["site_name"] = site.site_name
            siteDataDict["region"] = site.region_name
            siteDataDict["latitude"] = site.latitude
            siteDataDict["longitude"] = site.longitude
            siteDataDict["city"] = site.city
            siteDataDict["creation_date"] = FormatDate(site.creation_date)
            siteDataDict["modification_date"] = FormatDate(site.modification_date)
            siteDataDict["status"] = site.status
            siteDataDict["total_count"] = site.total_count

            return siteDataDict, 200
        except Exception as e:
            traceback.print_exc()
            return "Server Error", 500
    else:
        print("Can not Get IP Address from URL", file=sys.stderr)
        return jsonify({"response": "Can not Get IP Address from URL"}), 500


@app.route("/getRackDetailByIpAddress", methods=["GET"])
@token_required
def GetRackByIpAddress(user_data):
    ip_address = request.args.get("ipaddress")

    if ip_address:
        try:
            objList = []

            result = (
                db.session.query(Atom_Table, Rack_Table, Site_Table)
                .join(Rack_Table, Atom_Table.rack_id == Rack_Table.rack_id)
                .join(Site_Table, Rack_Table.site_id == Site_Table.site_id)
                .filter(Atom_Table.ip_address == ip_address)
                .first()
            )

            if result is None:
                return "No Rack Found", 500

            atom, rack, site = result
            rackDataDict = {}
            rackDataDict["rack_name"] = rack.rack_name
            rackDataDict["site_name"] = site.site_name
            rackDataDict["serial_number"] = rack.serial_number
            rackDataDict["manufacturer_date"] = FormatDate(rack.manufacturer_date)
            rackDataDict["unit_position"] = rack.unit_position
            rackDataDict["creation_date"] = FormatDate(rack.creation_date)
            rackDataDict["modification_date"] = FormatDate(rack.modification_date)
            rackDataDict["status"] = rack.status
            rackDataDict["rfs_date"] = FormatDate(rack.rfs_date)
            rackDataDict["height"] = rack.height
            rackDataDict["width"] = rack.width
            rackDataDict["depth"] = rack.depth
            rackDataDict["ru"] = rack.ru
            rackDataDict["pn_code"] = rack.pn_code
            rackDataDict["rack_model"] = rack.rack_model
            rackDataDict["brand"] = rack.floor

            objList.append(rackDataDict)

            return jsonify(objList), 200

        except Exception as e:
            traceback.print_exc()
            return "Error While Fetchin Rack Data", 500
    else:
        print("Can not Get Ip Address from URL", file=sys.stderr)
        return "Can not Get Ip Address from URL", 500


@app.route("/getDeviceDetailsByIpAddress", methods=["GET"])
@token_required
def GetDeviceDetailsByIpAddress(user_data):
    ip_address = request.args.get("ipaddress")
    if ip_address:
        try:
            result = (
                db.session.query(UAM_Device_Table, Atom_Table, Rack_Table, Site_Table)
                .join(Atom_Table, UAM_Device_Table.atom_id == Atom_Table.atom_id)
                .join(Rack_Table, Atom_Table.rack_id == Rack_Table.rack_id)
                .join(Site_Table, Rack_Table.site_id == Site_Table.site_id)
                .filter(Atom_Table.ip_address == ip_address)
                .first()
            )

            if result is None:
                return "No Rack Found", 500

            uam, atom, rack, site = result

            objDict = {}
            objDict["device_name"] = atom.device_name
            objDict["site_name"] = site.site_name
            objDict["rack_name"] = rack.rack_name
            objDict["ip_address"] = atom.ip_address
            objDict["software_type"] = uam.software_type
            objDict["software_version"] = uam.software_version
            objDict["patch_version"] = uam.patch_version
            objDict["creation_date"] = uam.creation_date
            objDict["modification_date"] = uam.modification_date
            objDict["status"] = uam.status
            objDict["ru"] = atom.device_ru
            objDict["department"] = atom.department
            objDict["section"] = atom.section
            objDict["function"] = atom.function
            objDict["manufacturer"] = uam.manufacturer
            objDict["hw_eos_date"] = (uam.hw_eos_date)
            objDict["hw_eol_date"] = (uam.hw_eol_date)
            objDict["sw_eos_date"] = (uam.sw_eos_date)
            objDict["sw_eol_date"] = (uam.sw_eol_date)
            objDict["virtual"] = atom.virtual
            objDict["authentication"] = uam.authentication
            objDict["serial_number"] = uam.serial_number
            objDict["pn_code"] = uam.pn_code
            objDict["manufacturer_date"] = (uam.manufacturer_date)
            objDict["hardware_version"] = uam.hardware_version
            objDict["source"] = uam.source
            objDict["stack"] = uam.stack
            objDict["contract_number"] = uam.contract_number
            objDict["contract_expiry"] = (uam.contract_expiry)
            return objDict, 200
        except Exception as e:
            traceback.print_exc()
            return "Error While Fetching UAM Device Data", 500
    else:
        print("Can not Get Ip Address from URL", file=sys.stderr)
        return "Can not Get Ip Address from URL", 500


@app.route("/dismantleOnBoardedDevice", methods=["POST"])
@token_required
def DismantleOnBoardDevice(user_data):
    try:
        deviceIDs = request.get_json()
        print(deviceIDs, file=sys.stderr)

        errorList = []
        responseList = []

        for ip in deviceIDs:
            try:
                UpdateUAMStatus(ip, "Dismantled")
            except Exception:
                traceback.print_exc()
                errorList.append(f"{ip} : Error Occured While Dismentaling")

        responseDict = {
            "success": len(responseList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": responseList,
        }

        return jsonify(responseDict), 200
    except Exception as e:
        traceback.print_exc()
        return "Error While Updating Status", 500



@app.route("/addDeviceStatically", methods=['POST'])
@token_required
def AddDeviceStatically(user_data):
    try:
            deviceObj = request.get_json()
            deviceObj['status'] = "Dismantled"
            response, status = EditUamDevice(deviceObj)
            
            return response, status
    except Exception as e:
        traceback.print_exc()
        return "Error While Adding Device Statically", 500

