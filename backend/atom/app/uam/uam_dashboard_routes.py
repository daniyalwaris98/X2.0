from distutils.file_util import move_file
from ipaddress import ip_address
from operator import mod
import site
import sys, json
import traceback
from unittest.util import _count_diff_all_purpose
from wsgiref.simple_server import software_version
from flask_jsonpify import jsonify
from flask import Flask, request, make_response, Response, session
from app import app, db
from app.models.inventory_models import *
from sqlalchemy import func
from datetime import datetime
from dateutil.relativedelta import relativedelta
from flask_cors import CORS, cross_origin
from app.middleware import token_required


def FormatDate(date):
    # print(date, file=sys.stderr)
    if date is not None:
        result = date.strftime("%d-%m-%Y")
    else:
        # result = datetime(2000, 1, 1)
        result = datetime(1, 1, 2000)

    return result


def FormatStringDate(date):
    print(date, file=sys.stderr)

    try:
        if date is not None:
            if "-" in date:
                result = datetime.strptime(date, "%d-%m-%Y")
            elif "/" in date:
                result = datetime.strptime(date, "%d/%m/%Y")
            else:
                print("incorrect date format", file=sys.stderr)
                result = datetime(2000, 1, 1)
        else:
            # result = datetime(2000, 1, 1)
            result = datetime(2000, 1, 1)
    except:
        result = datetime(2000, 1, 1)
        print("date format exception", file=sys.stderr)

    return result


@app.route("/totalSites", methods=["GET"])
@token_required
def TotalSites(user_data):
    objList = [
        {"name": "Sites", "value": 0},
        {"name": "Devices", "value": 0},
        {"name": "Vendors", "value": 0},
    ]
    return jsonify(objList), 200
    if True:
        try:
            queryString = f"select count(distinct SITE_NAME) from phy_table;"
            result = db.session.execute(queryString).scalar()
            queryString1 = f"select count(distinct DEVICE_NAME) from device_table;"
            result1 = db.session.execute(queryString1).scalar()
            queryString2 = f"select count(distinct MANUFACTURER) from device_table;"
            result2 = db.session.execute(queryString2).scalar()
            objList = [
                {"name": "Sites", "value": result},
                {"name": "Devices", "value": result1},
                {"name": "Vendors", "value": result2},
            ]
            print(objList, file=sys.stderr)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/deviceStatus", methods=["GET"])
@token_required
def DeviceStatus(user_data):
    objList = [
        {"name": "Production", "value": 0},
        {"name": "Dismantled", "value": 0},
        {"name": "Maintenance", "value": 0},
        {"name": "Undefined", "value": 0},
    ]
    return jsonify(objList), 200
    if True:
        try:
            objList = []

            query = f"select count(DEVICE_NAME) from device_table;"
            result0 = db.session.execute(query).scalar()
            if result0 == 0:
                result0 = 1
            queryString = (
                f"select count(status) from device_table where STATUS='Production';"
            )
            result = db.session.execute(queryString).scalar()
            queryString1 = (
                f"select count(status) from device_table where STATUS='Dismantled';"
            )
            result1 = db.session.execute(queryString1).scalar()
            queryString2 = (
                f"select count(status) from device_table where STATUS='Maintenance';"
            )
            result2 = db.session.execute(queryString2).scalar()
            queryString3 = (
                f"select count(status) from device_table where STATUS='Undefined';"
            )
            result3 = db.session.execute(queryString3).scalar()
            objList = [
                {"name": "Production", "value": round(((result / result0) * 100), 2)},
                {"name": "Dismantled", "value": round(((result1 / result0) * 100), 2)},
                {"name": "Maintenance", "value": round(((result2 / result0) * 100), 2)},
                {"name": "Undefined", "value": round(((result3 / result0) * 100), 2)},
            ]

            # queryString3 = f"select status,count(status) from device_table where STATUS='Maintenance' group by status;"
            # result3 = db.session.execute(queryString3)
            # for row in result3:
            #     status = row[0]
            #     count = row[1]
            #     objDict = {}
            #     objDict["name"] = 'Maintenance'
            #     objDict["value"] = count
            #     objList.append(objDict)
            # queryString4 = f"select status,count(status) from device_table where STATUS='Undefined' group by status;"
            # result4 = db.session.execute(queryString4)
            # for row in result4:
            #     status = row[0]
            #     count = row[1]
            #     objDict = {}
            #     objDict["name"] = 'Undefined'
            #     objDict["value"] = count
            #     objList.append(objDict)

            # dict1 = {'name':'Maintenance','value':0}
            # dict2 = {'name':'Undefined','value':0}
            # objList.append(dict1)
            # objList.append(dict2)
            print(objList, file=sys.stderr)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


# @app.route('/deviceInformation',methods = ['GET'])
# @token_required
# def DeviceInformation(user_data):
#     if True:
#         try:
#             objList = []
#             queryString = f"select DEVICE_NAME,IP_ADDRESS,UPTIME from device_table where UPTIME!='';"
#             result = db.session.execute(queryString)
#             for row in result:
#                 objDict = {}
#                 device = row[0]
#                 ip_address = row[1]
#                 uptime = row[2]
#                 objDict['Device'] = device
#                 objDict['IP Address'] = ip_address
#                 objDict['Up Time'] = (uptime)
#                 objList.append(objDict)
#             print(objList,file=sys.stderr)
#             return jsonify(objList),200
#         except Exception as e:
#             traceback.print_exc()
#             return str(e), 500
#     else:
#         print("Service not Available",file=sys.stderr)
#         return jsonify({"Response":"Service not Available"}),503


@app.route("/topFunctions", methods=["GET"])
@token_required
def TopFunctions(user_data):
    return jsonify(dict()), 200
    if True:
        try:
            objList = []
            queryString = f"select `FUNCTION`,count(`FUNCTION`) from device_table where `FUNCTION`is not NULL and `FUNCTION`!='' group by `FUNCTION`;"
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
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/sfpStatus", methods=["GET"])
@token_required
def SfpStatus(user_data):
    return jsonify(dict()), 200
    if True:
        try:
            queryString = "select distinct MODE,count(MODE) from sfp_table where MODE!='' and MODE is NOT NULL group by MODE;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                status = row[0]
                count = row[1]
                objDict = {}
                objDict[status] = count
                # objDict['value'] = count
                objList.append(objDict)
            y = {}
            for i in objList:
                for j in i:
                    y[j] = i[j]

            print(y, file=sys.stderr)
            return (y), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/sfpMode", methods=["GET"])
@token_required
def SfpMode(user_data):
    return jsonify(dict()), 200
    if True:
        try:
            queryString = f"select PORT_TYPE,count(PORT_TYPE) from sfp_table where PORT_TYPE!='' and PORT_TYPE is not NULL group by PORT_TYPE;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                mode = row[0]
                count = row[1]
                objDict = {}
                objDict[mode] = count
                # objDict['value'] = count
                objList.append(objDict)
            print(objList, file=sys.stderr)
            y = {}
            for i in objList:
                for j in i:
                    y[j] = i[j]

            print(y, file=sys.stderr)
            return (y), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


# @app.route("/getRackByRackName", methods=['GET'])
# @token_required
# def GetRackByRackName(user_data):
#     rack_name = request.args.get('rackname')
#     rackList = []
#     if rack_name:
#         try:
#             rackObj = Rack_Table.query.with_entities(Rack_Table.rack_name, Rack_Table.site_name,
#                                                      Rack_Table.serial_number, Rack_Table.manufacturer_date,
#                                                      Rack_Table.unit_position, Rack_Table.creation_date,
#                                                      Rack_Table.modification_date, Rack_Table.status, Rack_Table.ru,
#                                                      Rack_Table.rfs_date, Rack_Table.height, Rack_Table.width,
#                                                      Rack_Table.depth, Rack_Table.pn_code, Rack_Table.rack_model,
#                                                      Rack_Table.floor).filter_by(rack_name=rack_name).all()
#             if rackObj:
#                 for rack in rackObj:
#                     rackDataDict = {}
#                     rackDataDict['rack_name'] = rack.rack_name
#                     rackDataDict['site_name'] = rack.site_name
#                     rackDataDict['serial_number'] = rack.serial_number
#                     rackDataDict['manufacturer_date'] = FormatDate(FormatStringDate(rack.manufacturer_date))
#                     rackDataDict['unit_position'] = rack.unit_position
#                     rackDataDict['creation_date'] = FormatDate(FormatStringDate(rack.creation_date))
#                     rackDataDict['modification_date'] = FormatDate(FormatStringDate(rack.modification_date))
#                     rackDataDict['ru'] = rack.ru
#                     rackDataDict['status'] = rack.status
#                     rackDataDict['rfs_date'] = FormatDate(FormatStringDate(rack.rfs_date))
#                     rackDataDict['height'] = rack.height
#                     rackDataDict['width'] = rack.width
#                     rackDataDict['depth'] = rack.depth
#                     rackDataDict['pn_code'] = rack.pn_code
#                     rackDataDict['rack_model'] = rack.rack_model
#                     rackDataDict['brand'] = rack.floor
#                     rackList.append(rackDataDict)

#                 return jsonify(rackList), 200
#             else:
#                 print("Rack Data not found in DB", file=sys.stderr)
#                 return jsonify({'response': "Rack Data not found in DB"}), 500
#         except Exception as e:
#             traceback.print_exc()
#             return str(e), 500
#     else:
#         print("Can not Get Rack Name from URL", file=sys.stderr)
#         return jsonify({'response': "Can not Get Rack Name from URL"}), 500


@app.route("/getSiteDetailByIpAddress", methods=["GET"])
@token_required
def GetSiteByIpAddress(user_data):
    ip_address = request.args.get("ipaddress")
    print(ip_address, file=sys.stderr)
    print(type(ip_address), file=sys.stderr)
    if ip_address:
        try:
            queryString = f"select SITE_NAME,REGION,LATITUDE,LONGITUDE,CITY,CREATION_DATE,MODIFICATION_DATE,STATUS,TOTAL_COUNT from phy_table where SITE_NAME in (select SITE_NAME from device_table where IP_ADDRESS='{ip_address}');"
            result = db.session.execute(queryString)
            siteDataDict = {}
            for row in result:
                site_name = row[0]
                region = row[1]
                latitude = row[2]
                longitude = row[3]
                city = row[4]
                creation_date = row[5]
                modification_date = row[6]
                status = row[7]
                total_count = row[8]
                siteDataDict["site_name"] = site_name
                siteDataDict["region"] = region
                siteDataDict["latitude"] = latitude
                siteDataDict["longitude"] = longitude
                siteDataDict["city"] = city
                siteDataDict["creation_date"] = FormatDate(
                    FormatStringDate(creation_date)
                )
                siteDataDict["modification_date"] = FormatDate(
                    FormatStringDate(modification_date)
                )
                siteDataDict["status"] = status
                siteDataDict["total_count"] = total_count
            return siteDataDict, 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
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
            queryString = (
                f"select rack_name from device_table where IP_ADDRESS='{ip_address}';"
            )
            result = db.session.execute(queryString)
            for row1 in result:
                rack_name = row1[0]
                queryString1 = f"select RACK_NAME,SITE_NAME,SERIAL_NUMBER,MANUFACTURER_DATE,UNIT_POSITION,CREATION_DATE,MODIFICATION_DATE,RU,STATUS,RFS_DATE,HEIGHT,WIDTH,DEPTH,PN_CODE,RACK_MODEL,FLOOR from rack_table where RACK_NAME='{rack_name}';"
                result1 = db.session.execute(queryString1)

                for row in result1:
                    rackDataDict = {}
                    rack_name = row[0]
                    site_name = row[1]
                    serial_number = row[2]
                    manufacturer_date = row[3]
                    unit_position = row[4]
                    creation_date = row[5]
                    modification_date = row[6]
                    ru = row[7]
                    status = row[8]
                    rfs_date = row[9]
                    height = row[10]
                    width = row[11]
                    depth = row[12]
                    pn_code = row[13]
                    rack_model = row[14]
                    floor = row[15]
                    rackDataDict["rack_name"] = rack_name
                    rackDataDict["site_name"] = site_name
                    rackDataDict["serial_number"] = serial_number
                    rackDataDict["manufacturer_date"] = FormatDate(
                        FormatStringDate(manufacturer_date)
                    )
                    rackDataDict["unit_position"] = unit_position
                    rackDataDict["creation_date"] = FormatDate(
                        FormatStringDate(creation_date)
                    )
                    rackDataDict["modification_date"] = FormatDate(
                        FormatStringDate(modification_date)
                    )
                    rackDataDict["status"] = status
                    rackDataDict["rfs_date"] = FormatDate(FormatStringDate(rfs_date))
                    rackDataDict["height"] = height
                    rackDataDict["width"] = width
                    rackDataDict["depth"] = depth
                    rackDataDict["ru"] = ru
                    rackDataDict["pn_code"] = pn_code
                    rackDataDict["rack_model"] = rack_model
                    rackDataDict["brand"] = floor
                    objList.append(rackDataDict)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Can not Get Ip Address from URL", file=sys.stderr)
        return jsonify({"response": "Can not Get Ip Address from URL"}), 500


@app.route("/getDeviceDetailsByIpAddress", methods=["GET"])
@token_required
def GetDeviceDetailsByIpAddress(user_data):
    ip_address = request.args.get("ipaddress")
    if ip_address:
        try:
            queryString = f"select DEVICE_NAME,SITE_NAME,RACK_NAME,IP_ADDRESS,SOFTWARE_TYPE,SOFTWARE_VERSION,PATCH_VERSION,CREATION_DATE,MODIFICATION_DATE,STATUS,RU,DEPARTMENT,SECTION,CRITICALITY,`FUNCTION`,DOMAIN,MANUFACTURER,HW_EOS_DATE,HW_EOL_DATE,SW_EOS_DATE,SW_EOL_DATE,`VIRTUAL`,RFS_DATE,AUTHENTICATION,SERIAL_NUMBER,PN_CODE,SUBRACK_ID_NUMBER,MANUFACTURER_DATE,HARDWARE_VERSION,MAX_POWER,SITE_TYPE,SOURCE,STACK,CONTRACT_NUMBER,CONTRACT_EXPIRY from device_table where IP_ADDRESS='{ip_address}';"
            result = db.session.execute(queryString)
            objDict = {}
            for row in result:
                device_name = row[0]
                site_name = row[1]
                rack_name = row[2]
                ip_address = row[3]
                software_type = row[4]
                software_version = row[5]
                patch_version = row[6]
                creation_date = row[7]
                modification_date = row[8]
                status = row[9]
                ru = row[10]
                department = row[11]
                section = row[12]
                # criticality = row[13]
                function = row[14]
                # domain = row[15]
                manufacturer = row[16]
                hw_eos_date = row[17]
                hw_eol_date = row[18]
                sw_eos_date = row[19]
                sw_eol_date = row[20]
                virtual = row[21]
                # rfs_date = row[22]
                authentication = row[23]
                serial_number = row[24]
                pn_code = row[25]
                # subrack_id_number = row[26]
                manufacturer_date = row[27]
                hardware_version = row[28]
                # max_power = row[29]
                # site_type = row[30]
                source = row[31]
                stack = row[32]
                contract_number = row[33]
                contract_expiry = row[34]
                objDict["device_name"] = device_name
                objDict["site_name"] = site_name
                objDict["rack_name"] = rack_name
                objDict["ip_address"] = ip_address
                objDict["software_type"] = software_type
                objDict["software_version"] = software_version
                objDict["patch_version"] = patch_version
                objDict["creation_date"] = FormatDate(FormatStringDate(creation_date))
                objDict["modification_date"] = FormatDate(
                    FormatStringDate(modification_date)
                )
                objDict["status"] = status
                objDict["ru"] = ru
                objDict["department"] = department
                objDict["section"] = section
                # objDict['criticality'] = criticality
                objDict["function"] = function
                # objDict['domain'] = domain
                objDict["manufacturer"] = manufacturer
                objDict["hw_eos_date"] = FormatDate((hw_eos_date))
                objDict["hw_eol_date"] = FormatDate((hw_eol_date))
                objDict["sw_eos_date"] = FormatDate((sw_eos_date))
                objDict["sw_eol_date"] = FormatDate((sw_eol_date))
                objDict["virtual"] = virtual
                # objDict['rfs_date'] = rfs_date
                objDict["authentication"] = authentication
                objDict["serial_number"] = serial_number
                objDict["pn_code"] = pn_code
                # objDict['subrack_id_number'] = subrack_id_number
                objDict["manufacturer_date"] = FormatDate((manufacturer_date))
                objDict["hardware_version"] = hardware_version
                # objDict['max_power'] = max_power
                # objDict['site_type'] = site_type
                objDict["source"] = source
                objDict["stack"] = stack
                objDict["contract_number"] = contract_number
                objDict["contract_expiry"] = FormatDate((contract_expiry))
            return objDict, 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Can not Get Ip Address from URL", file=sys.stderr)
        return jsonify({"response": "Can not Get Ip Address from URL"}), 500


@app.route("/getBoardDetailsByIpAddress", methods=["GET"])
@token_required
def GetBoardDetailsByIpAddress(user_data):
    ip_address = request.args.get("ipaddress")
    # ip_address = '1.1.1.1'
    if ip_address:
        try:
            queryString = f"select BOARD_NAME,DEVICE_NAME,DEVICE_SLOT_ID,SOFTWARE_VERSION,HARDWARE_VERSION,SERIAL_NUMBER,MANUFACTURER_DATE,CREATION_DATE,MODIFICATION_DATE,STATUS,EOS_DATE,EOL_DATE,RFS_DATE,PN_CODE from board_table where DEVICE_NAME in (select DEVICE_NAME from device_table where IP_ADDRESS='{ip_address}');"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                board_name = row[0]
                device_name = row[1]
                device_slot_id = row[2]
                software_version = row[3]
                # hardware_version = row[4]
                serial_number = row[5]
                # manufacturer_date = row[6]
                creation_date = row[7]
                modification_date = row[8]
                status = row[9]
                eos_date = row[10]
                eol_date = row[11]
                # rfs_date = row[12]
                pn_code = row[13]
                objDict = {}
                objDict["board_name"] = board_name
                objDict["device_name"] = device_name
                objDict["device_slot_id"] = device_slot_id
                objDict["software_version"] = software_version
                # objDict['hardware_version'] = hardware_version
                objDict["serial_number"] = serial_number
                # objDict['manufacturer_date'] = FormatDate((manufacturer_date))
                objDict["creation_date"] = FormatDate((creation_date))
                objDict["modification_date"] = FormatDate((modification_date))
                objDict["status"] = status
                objDict["eos_date"] = FormatDate((eos_date))
                objDict["eol_date"] = FormatDate((eol_date))
                # objDict['rfs_date'] = FormatDate((rfs_date))
                objDict["pn_code"] = pn_code
                objList.append(objDict)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Can not Get Ip Address from URL", file=sys.stderr)
        return jsonify({"response": "Can not Get Ip Address from URL"}), 500


@app.route("/getSubBoardDetailsByIpAddress", methods=["GET"])
@token_required
def GetSubBoardDetailsByIpAddress(user_data):
    ip_address = request.args.get("ipaddress")
    # ip_address = '2.2.2.2'
    if ip_address:
        try:
            queryString = f"select SUBBOARD_NAME,DEVICE_NAME,SUBBOARD_TYPE,SUBRACK_ID,SLOT_NUMBER,SUBSLOT_NUMBER,SOFTWARE_VERSION,HARDWARE_VERSION,SERIAL_NUMBER,CREATION_DATE,MODIFICATION_DATE,STATUS,EOS_DATE,EOL_DATE,RFS_DATE,PN_CODE from subboard_table where DEVICE_NAME in (select DEVICE_NAME from device_table where IP_ADDRESS='{ip_address}');"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                objDict = {}
                subboard_name = row[0]
                device_name = row[1]
                subboard_type = row[2]
                subrack_id = row[3]
                slot_number = row[4]
                subslot_number = row[5]
                software_version = row[6]
                # hardware_version = row[7]
                serial_number = row[8]
                creation_date = row[9]
                modification_date = row[10]
                status = row[11]
                eos_date = row[12]
                eol_date = row[13]
                # rfs_date = row[14]
                pn_code = row[15]
                objDict["subboard_name"] = subboard_name
                objDict["device_name"] = device_name
                objDict["subboard_type"] = subboard_type
                objDict["subrack_id"] = subrack_id
                objDict["slot_number"] = slot_number
                objDict["subslot_number"] = subslot_number
                objDict["software_version"] = software_version
                # objDict['hardware_version'] = hardware_version
                objDict["serial_number"] = serial_number
                objDict["creation_date"] = FormatDate((creation_date))
                objDict["modification_date"] = FormatDate((modification_date))
                objDict["status"] = status
                objDict["eos_date"] = FormatDate((eos_date))
                objDict["eol_date"] = FormatDate((eol_date))
                # objDict['rfs_date'] = FormatDate((rfs_date))
                objDict["pn_code"] = pn_code
                objList.append(objDict)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Can not Get Ip Address from URL", file=sys.stderr)
        return jsonify({"response": "Can not Get Ip Address from URL"}), 500


@app.route("/getSfpsDetailsByIpAddress", methods=["GET"])
@token_required
def GetSfpsDetailsByIpAddress(user_data):
    ip_address = request.args.get("ipaddress")
    # ip_address = '2.2.2.2'
    if ip_address:
        try:
            queryString = f"select SFP_ID,DEVICE_NAME,MEDIA_TYPE,PORT_NAME,PORT_TYPE,CONNECTOR,MODE,SPEED,WAVELENGTH,OPTICAL_DIRECTION_TYPE,PN_CODE,CREATION_DATE,MODIFICATION_DATE,STATUS,EOS_DATE,EOL_DATE,RFS_DATE,SERIAL_NUMBER from sfp_table where DEVICE_NAME in (select DEVICE_NAME from device_table where IP_ADDRESS='{ip_address}');"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                sfp_id = row[0]
                device_name = row[1]
                media_type = row[2]
                port_name = row[3]
                port_type = row[4]
                # connector = row[5]
                mode = row[6]
                # speed = row[7]
                # wavelength = row[8]
                # optical_direction_type = row[9]
                # pn_code = row[10]
                creation_date = row[11]
                modification_date = row[12]
                status = row[13]
                eos_date = row[14]
                eol_date = row[15]
                # rfs_date = row[16]
                serial_number = row[17]
                objDict = {}
                objDict["sfp_id"] = sfp_id
                objDict["device_name"] = device_name
                objDict["media_type"] = media_type
                objDict["port_name"] = port_name
                objDict["port_type"] = port_type
                # objDict['connector'] =  connector
                objDict["mode"] = mode
                # objDict['speed'] = speed
                # objDict['wavelength'] = wavelength
                # objDict['optical_direction_type'] =optical_direction_type
                # objDict['pn_code'] = pn_code
                objDict["creation_date"] = FormatDate((creation_date))
                objDict["modification_date"] = FormatDate((modification_date))
                objDict["status"] = status
                objDict["eos_date"] = FormatDate((eos_date))
                objDict["eol_date"] = FormatDate((eol_date))
                # objDict['rfs_date'] = FormatDate((rfs_date))
                objDict["serial_number"] = serial_number
                objList.append(objDict)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Can not Get Ip Address from URL", file=sys.stderr)
        return jsonify({"response": "Can not Get Ip Address from URL"}), 500


@app.route("/getLicenseDetailsByIpAddress", methods=["GET"])
@token_required
def GetLicenseDetailsByIpAddress(user_data):
    if True:
        ip_address = request.args.get("ipaddress")
        # ip_address = '1.1.1.1'
        if ip_address:
            try:
                queryString = f"select LICENSE_NAME,LICENSE_DESCRIPTION,DEVICE_NAME,RFS_DATE,ACTIVATION_DATE,EXPIRY_DATE,GRACE_PERIOD,SERIAL_NUMBER,CREATION_DATE,MODIFICATION_DATE,STATUS,CAPACITY,`USAGE`,PN_CODE from license_table where DEVICE_NAME in (select DEVICE_NAME from device_table where IP_ADDRESS='{ip_address}');"
                result = db.session.execute(queryString)
                objList = []
                for row in result:
                    license_name = row[0]
                    license_description = row[1]
                    ne_name = row[2]
                    # rfs_date = row[3]
                    activation_date = row[4]
                    expiry_date = row[5]
                    # grace_period = row[6]
                    # serial_number = row[7]
                    creation_date = row[8]
                    modification_date = row[9]
                    status = row[10]
                    # capacity = row[11]
                    # usage = row[12]
                    pn_code = row[13]
                    objDict = {}
                    objDict["license_name"] = license_name
                    objDict["license_description"] = license_description
                    objDict["ne_name"] = ne_name
                    # objDict['rfs_date'] = FormatDate((rfs_date))
                    objDict["activation_date"] = FormatDate((activation_date))
                    objDict["expiry_date"] = FormatDate((expiry_date))
                    # objDict['grace_period'] = grace_period
                    # objDict['serial_number'] = serial_number
                    objDict["creation_date"] = FormatDate((creation_date))
                    objDict["modification_date"] = FormatDate((modification_date))
                    objDict["status"] = status
                    # objDict['capacity'] = capacity
                    # objDict['usage'] = usage
                    objDict["pn_code"] = pn_code
                    objList.append(objDict)

                return jsonify(objList), 200
            except Exception as e:
                traceback.print_exc()
                print(str(e), file=sys.stderr)
                return str(e), 500

        else:
            print("Can not Get Ip Address from URL", file=sys.stderr)
            return jsonify({"response": "Can not Get Ip Address from URL"}), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/totalDevicesInDeviceDashboard", methods=["GET"])
@token_required
def TotalDevicesInDeviceDashboard(user_data):
    return jsonify(list()), 200
    if True:
        try:
            queryString = f"select count(DEVICE_NAME) from device_table"
            result = db.session.execute(queryString).scalar()
            objList = {"name": "Total Device Count", "value": result}
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Can not Get Ip Address from URL", file=sys.stderr)
        return jsonify({"response": "Can not Get Ip Address from URL"}), 500
