from app import app
from app.models.inventory_models import *
from app.middleware import token_required

from flask_jsonpify import jsonify
from flask import request

import traceback
import sys
from datetime import datetime


def FormatDate(date):
    # print(date, file=sys.stderr)
    if date is not None:
        result = date.strftime('%d-%m-%Y')
    else:
        # result = datetime(2000, 1, 1)
        result = datetime(2000, 1, 1)

    return result


@app.route('/getAllSites', methods=['GET'])
@token_required
def GetAllSites(user_data):
    try:
        siteObjList = []
        siteObjs = Site_Table.query.all()
        for siteObj in siteObjs:
            siteDataDict = {'site_id': siteObj.site_id, 'site_name': siteObj.site_name,
                            'region': siteObj.region_name, 'longitude': siteObj.longitude,
                            'latitude': siteObj.latitude, 'city': siteObj.city,
                            'creation_date': FormatDate(siteObj.creation_date),
                            'modification_date': FormatDate(siteObj.modification_date), 'status': siteObj.status}

            siteObjList.append(siteDataDict)
        print(siteObjList, file=sys.stderr)

        return jsonify(siteObjList), 200
    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route('/addSite', methods=['POST'])
@token_required
def AddSite(user_data):
    try:
        siteObj = request.get_json()

        queryString = f"select SITE_ID from phy_table;"
        result = db.session.execute(queryString)
        idsList = []
        for row in result:
            idsList.append(row[0])

        date = datetime.now()
        atomSiteList = []
        queryString = f"select SITE_NAME from atom_table;"
        result = db.session.execute(queryString)
        for row in result:
            atomSiteList.append(row[0])

        # if siteObj['site_name'] in atomSiteList:
        #     return 'Site Name Already Exists', 500
        if 'site_id' in siteObj:
            if siteObj['site_id'] in idsList:
                # queryString = f"update atom_table set SITE_NAME='{siteObj['site_name']}' where SITE_NAME='{siteObj['old_site_name']}';"
                # db.session.execute(queryString)
                # db.session.commit()
                # queryString = f"update rack_table set SITE_NAME='{siteObj['site_name']}' where SITE_NAME='{siteObj['old_site_name']}';"
                # db.session.execute(queryString)
                # db.session.commit()
                queryString1 = f"update phy_table set SITE_NAME='{siteObj['site_name']}',CITY='{siteObj['city']}',REGION='{siteObj['region']}',STATUS='{siteObj['status']}',LATITUDE='{siteObj['latitude']}',LONGITUDE='{siteObj['longitude']}',MODIFICATION_DATE='{date}' where SITE_ID={siteObj['site_id']};"
                db.session.execute(queryString1)
                db.session.commit()
                print(f"Updated {siteObj['site_id']}", file=sys.stderr)

                return "Site Updated Successfully", 200
            else:
                return "Something Went Wrong", 500
        else:

            queryString = f"select SITE_NAME from phy_table;"
            result = db.session.execute(queryString)
            siteList = []
            for row in result:
                siteList.append(row[0])

            if siteObj['site_name'] in siteList:
                return 'Site Name Already Exists', 500

            queryString2 = f"INSERT INTO phy_table (SITE_NAME,CITY,REGION,STATUS,LATITUDE,LONGITUDE,CREATION_DATE,MODIFICATION_DATE) VALUES ('{siteObj['site_name']}','{siteObj['city']}','{siteObj['region']}','{siteObj['status']}','{siteObj['latitude']}','{siteObj['longitude']}','{date}','{date}');"
            db.session.execute(queryString2)
            db.session.commit()
            print(f"Inserted {siteObj['site_name']}", file=sys.stderr)
            return "Site Inserted Successfully", 200


    except Exception as e:
        traceback.print_exc()
        return "Site name is already in use\nSite name can not be updated", 500


@app.route('/deleteSite', methods=['POST'])
@token_required
def DeleteSite(user_data):
    if True:
        try:
            response = False
            siteIds = request.get_json()
            print("SITEEEEEEEEE", siteIds, file=sys.stderr)
            for siteId in siteIds:
                queryString1 = f"select count(*) from atom_table where SITE_NAME=(select SITE_NAME from phy_table where SITE_ID={siteId});"
                result1 = db.session.execute(queryString1).scalar()
                queryString2 = f"select count(*) from device_table where SITE_NAME=(select SITE_NAME from phy_table where SITE_ID ={siteId});"
                result2 = db.session.execute(queryString2).scalar()
                queryString3 = f"select count(*) from rack_table where SITE_NAME= (select SITE_NAME from phy_table where SITE_ID ={siteId});"
                result3 = db.session.execute(queryString3).scalar()
                print("RESULTSSSSSSSSS", result1, result2, result3, file=sys.stderr)
                if result1 > 0 and result2 > 0 and result3 > 0:
                    return "Site Name Found in Atom, Rack and Device", 500
                if result1 > 0 and result2 > 0:
                    return "Site Name Found in Atom and Device", 500
                if result1 > 0 and result3 > 0:
                    return "Site Name Found in Atom and Rack", 500
                if result2 > 0 and result3 > 0:
                    return "Site Name Found in Device and Rack", 500
                if result1 > 0:
                    return "Site Name Found in Atom", 500
                if result2 > 0:
                    return "Site Name Found in Device", 500
                if result3 > 0:
                    return "Site Name Found in Rack", 500
                else:
                    queryString = f"delete from phy_table where site_id = '{siteId}';"
                    db.session.execute(queryString)
                    db.session.commit()
                    response = True
            if response == True:
                return "Site Deleted Successfully", 200
        except Exception as e:
            traceback.print_exc()
            return "Site name is already in use\nSite can not be deleted", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/getAllDevices', methods=['GET'])
@token_required
def GetAllDevices(user_data):
    return jsonify(list()), 200

    try:
        deviceObjList = []
        deviceObjs = Device_Table.query.all()
        for deviceObj in deviceObjs:
            deviceDataDict = {}
            deviceDataDict['device_name'] = deviceObj.device_name
            deviceDataDict['site_name'] = deviceObj.site_name
            deviceDataDict['rack_name'] = deviceObj.rack_name
            deviceDataDict['ip_address'] = deviceObj.ip_address
            deviceDataDict['device_type'] = deviceObj.device_type
            deviceDataDict['software_type'] = deviceObj.software_type
            deviceDataDict['software_version'] = deviceObj.software_version
            # deviceDataDict['patch_version'] = deviceObj.patch_version
            deviceDataDict['creation_date'] = FormatDate(
                (deviceObj.creation_date))
            deviceDataDict['modification_date'] = FormatDate(
                (deviceObj.modification_date))
            deviceDataDict['status'] = deviceObj.status
            deviceDataDict['ru'] = deviceObj.ru
            deviceDataDict['department'] = deviceObj.department
            deviceDataDict['section'] = deviceObj.section
            # deviceDataDict['criticality'] = deviceObj.criticality
            deviceDataDict['function'] = deviceObj.function
            # deviceDataDict['domain'] = deviceObj.domain
            deviceDataDict['manufacturer'] = deviceObj.manufacturer
            deviceDataDict['hw_eos_date'] = FormatDate(
                (deviceObj.hw_eos_date))
            deviceDataDict['hw_eol_date'] = FormatDate(
                (deviceObj.hw_eol_date))
            deviceDataDict['sw_eos_date'] = FormatDate(
                (deviceObj.sw_eos_date))
            deviceDataDict['sw_eol_date'] = FormatDate(
                (deviceObj.sw_eol_date))
            deviceDataDict['virtual'] = (deviceObj.virtual)
            deviceDataDict['rfs_date'] = FormatDate((deviceObj.rfs_date))
            deviceDataDict['authentication'] = deviceObj.authentication
            deviceDataDict['serial_number'] = deviceObj.serial_number
            deviceDataDict['pn_code'] = deviceObj.pn_code
            # deviceDataDict['subrack_id_number'] = deviceObj.subrack_id_number
            deviceDataDict['manufacturer_date'] = FormatDate(
                (deviceObj.manufacturer_date))
            # deviceDataDict['max_power'] = deviceObj.max_power
            # deviceDataDict['site_type'] = deviceObj.site_type
            deviceDataDict['source'] = deviceObj.source
            deviceDataDict['stack'] = deviceObj.stack
            deviceDataDict['contract_number'] = deviceObj.contract_number
            deviceDataDict['hardware_version'] = deviceObj.hardware_version
            deviceDataDict['contract_expiry'] = FormatDate(
                (deviceObj.contract_expiry))
            deviceDataDict['uptime'] = ((deviceObj.uptime))

            deviceObjList.append(deviceDataDict)
        # print(deviceObjList, file=sys.stderr)
        return jsonify(deviceObjList), 200
    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route('/addDevice', methods=['POST'])
@token_required
def AddDevice(user_data):
    if True:
        try:
            deviceObj = request.get_json()
            device = Device_Table()
            device.device_name = deviceObj['device_name']
            device.site_name = deviceObj['site_name']
            device.rack_name = deviceObj['rack_name']
            device.ip_address = deviceObj['ip_address']
            # device.device_type = deviceObj['device_type']
            device.software_type = deviceObj['software_type']
            device.software_version = deviceObj['software_version']
            # device.patch_version = deviceObj['patch_version']
            device.creation_date = (datetime.now())
            device.modification_date = (datetime.now())
            device.status = deviceObj['status']
            device.ru = deviceObj['ru']
            device.department = deviceObj['department']
            device.section = deviceObj['section']
            # device.criticality = deviceObj['criticality']
            device.function = deviceObj['function']
            # device.domain = deviceObj['domain']
            device.manufacturer = deviceObj['manufacturer']
            device.virtual = deviceObj['virtual']
            device.authentication = deviceObj['authentication']
            device.serial_number = deviceObj['serial_number']
            device.pn_code = deviceObj['pn_code']
            device.subrack_id_number = deviceObj['subrack_id_number']
            # device.max_power = deviceObj['max_power']
            # device.site_type = deviceObj['site_type']
            device.source = deviceObj['source']
            device.stack = deviceObj['stack']
            device.contract_number = deviceObj['contract_number']

            if Device_Table.query.with_entities(Device_Table.ip_address).filter_by(
                    ip_address=deviceObj['ip_address']).first() is not None:
                device.device_name = Device_Table.query.with_entities(Device_Table.device_name).filter_by(
                    ip_address=deviceObj['ip_address']).first()[0]
                print(f"UPDATED {deviceObj['device_name']} WITH IP ", deviceObj['ip_address'], "SUCCESSFULLY",
                      file=sys.stderr)
                UpdateData(device)

            else:
                print(f"Inserted {deviceObj['device_name']} WITH IP ", deviceObj['ip_address'], "SUCCESSFULLY",
                      file=sys.stderr)
                InsertData(device)

            flag = 'False'
            if deviceObj['status'] == "Production":
                flag = 'true'

            query = f"update atom_table set `ONBOARD_STATUS`='{flag}' where `device_name`='{deviceObj['device_name']}';"
            db.session.execute(query)
            db.session.commit()

            return jsonify({'response': "success", "code": "200"}), 200
        except Exception as e:
            traceback.print_exc()
            return jsonify({'response': "Error", "code": "500"}), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/editDevice', methods=['POST'])
@token_required
def EditDevice(user_data):
    if True:
        try:
            deviceObj = request.get_json()

            device = Device_Table.query.with_entities(Device_Table).filter_by(
                device_name=deviceObj["device_name"]).first()

            # device.device_name = deviceObj['device_name']
            device.site_name = deviceObj['site_name']
            device.rack_name = deviceObj['rack_name']
            # device.ip_address = deviceObj['ip_address']
            # device.software_type = deviceObj['software_type']
            device.software_version = deviceObj['software_version']
            # device.patch_version = deviceObj['patch_version']
            device.modification_date = (datetime.now())
            # device.status = deviceObj['status']
            device.ru = deviceObj['ru']
            device.department = deviceObj['department']
            device.section = deviceObj['section']
            device.criticality = deviceObj['criticality']
            device.function = deviceObj['function']
            # device.domain = deviceObj['domain']
            device.manufacturer = deviceObj['manufacturer']
            # device.hw_eos_date = (deviceObj['hw_eos_date'])
            # device.hw_eol_date = (deviceObj['hw_eol_date'])
            # device.sw_eos_date = (deviceObj['sw_eos_date'])
            # device.sw_eol_date = (deviceObj['sw_eol_date'])
            device.virtual = deviceObj['virtual']
            # device.rfs_date = (deviceObj['rfs_date'])
            device.authentication = deviceObj['authentication']
            device.serial_number = deviceObj['serial_number']
            device.pn_code = deviceObj['pn_code']
            device.subrack_id_number = deviceObj['subrack_id_number']
            # device.manufacturer_date = (deviceObj['manufacturer_date'])
            # device.max_power = deviceObj['max_power']
            # device.site_type = deviceObj['site_type']
            device.source = deviceObj['source']
            device.stack = deviceObj['stack']
            device.contract_number = deviceObj['contract_number']
            # device.contract_expiry = deviceObj['contract_expiry']

            UpdateData(device)
            print("Updated Device " + deviceObj['device_name'], file=sys.stderr)

            # Updating device parameters in Atom
            queryString = f"update atom_table set SITE_NAME='{deviceObj['site_name']}' where DEVICE_NAME='{deviceObj['device_name']}';"
            db.session.execute(queryString)
            db.session.commit()
            print(f"SITE NAME SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}", file=sys.stderr)

            queryString = f"update atom_table set RACK_NAME='{deviceObj['rack_name']}' where DEVICE_NAME='{deviceObj['device_name']}';"
            db.session.execute(queryString)
            db.session.commit()
            print(f"RACK NAME SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}", file=sys.stderr)

            # queryString = f"update atom_table set STATUS='{device.status}' where DEVICE_NAME='{deviceObj['device_name']}';"
            # db.session.execute(queryString)
            # db.session.commit()
            # print(f"STATUS SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}",file=sys.stderr)

            queryString = f"update atom_table set DEPARTMENT='{deviceObj['department']}' where DEVICE_NAME='{deviceObj['device_name']}';"
            db.session.execute(queryString)
            db.session.commit()
            print(f"DEPARTMENT SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}", file=sys.stderr)

            queryString = f"update atom_table set SECTION='{deviceObj['section']}' where DEVICE_NAME='{deviceObj['device_name']}';"
            db.session.execute(queryString)
            db.session.commit()
            print(f"SECTION SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}", file=sys.stderr)

            queryString = f"update atom_table set `FUNCTION`='{deviceObj['function']}' where DEVICE_NAME='{deviceObj['device_name']}';"
            db.session.execute(queryString)
            db.session.commit()
            print(f"FUNCTION SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}", file=sys.stderr)

            queryString = f"update atom_table set `VIRTUAL`='{deviceObj['virtual']}' where DEVICE_NAME='{deviceObj['device_name']}';"
            db.session.execute(queryString)
            db.session.commit()
            print(f"VIRTUAL SUCCESSFULLY UPDATED IN ATOM FOR {deviceObj['device_name']}", file=sys.stderr)

            # Updating Modules
            queryString = f"update board_table set SOFTWARE_VERSION='{deviceObj['software_version']}' DEVICE_NAME='{deviceObj['device_name']}';"
            db.session.execute(queryString)
            db.session.commit()
            print(f"SOFTWARE VERSION SUCCESSFULLY UPDATED IN MODULES FOR {deviceObj['device_name']}")

            return "Device Updated Successfully", 200

        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route('/deleteDevice', methods=['POST'])
@token_required
def DeleteDevice(user_data):
    if True:
        try:
            deviceNames = request.get_json()
            for deviceName in deviceNames:
                db.session.execute(f"delete from license_table where device_name='{deviceName}';")
                db.session.commit()
                db.session.execute(f"delete from sfp_table where device_name='{deviceName}';")
                db.session.commit()
                db.session.execute(f"delete from subboard_table where device_name='{deviceName}';")
                db.session.commit()
                db.session.execute(f"delete from board_table where device_name='{deviceName}';")
                db.session.commit()
                db.session.execute(f"delete from device_table where device_name='{deviceName}';")
                db.session.commit()
            return "DELETED SUCCESSFULLY", 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/getAllRacks', methods=['GET'])
@token_required
def GetAllRacks(user_data):
    try:
        rackObjList = []
        rackObjs = db.session.query(RackTable, Site_Table) \
            .join(Site_Table, RackTable.site_id == Site_Table.site_id).all()
        for rackObj in rackObjs:
            rackDataDict = {'rack_id': rackObj.rack_id, 'rack_name': rackObj.rack_name,
                            'site_name': rackObj.site_name, 'serial_number': rackObj.serial_number,
                            'manufacturer_date': FormatDate(rackObj.manufacturer_date),
                            'unit_position': rackObj.unit_position,
                            'creation_date': FormatDate(rackObj.creation_date),
                            'modification_date': FormatDate(rackObj.modification_date), 'status': rackObj.status,
                            'ru': rackObj.ru, 'rfs_date': FormatDate(rackObj.rfs_date), 'height': rackObj.height,
                            'width': rackObj.width, 'pn_code': rackObj.pn_code, 'rack_model': rackObj.rack_model,
                            'brand': rackObj.floor}
            rackObjList.append(rackDataDict)
        return jsonify(rackObjList), 200
    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route('/addRack', methods=['POST'])
@token_required
def AddRack(user_data):
    if True:
        try:
            rackObj = request.get_json()
            if Phy_Table.query.with_entities(Phy_Table.site_name).filter_by(
                    site_name=rackObj['site_name']).first() is not None:

                queryString = f"select RACK_ID from rack_table;"
                result = db.session.execute(queryString)
                idsList = []
                for row in result:
                    idsList.append(row[0])

                date = datetime.now()
                atomRackList = []
                queryString = f"select RACK_NAME from rack_table;"

                if 'rack_id' in rackObj:
                    queryString = f"select RACK_NAME from rack_table where RACK_ID != {rackObj['rack_id']}"

                result = db.session.execute(queryString)
                for row in result:
                    atomRackList.append(row[0])

                if rackObj['ru'] == "":
                    rackObj['ru'] = 'NULL'
                if rackObj['height'] == "":
                    rackObj['height'] = 'NULL'
                if rackObj['width'] == "":
                    rackObj['width'] = 'NULL'

                if rackObj['rack_name'] in atomRackList:
                    return 'Rack Name Already Exists', 500
                if 'rack_id' in rackObj:
                    if rackObj['rack_id'] in idsList:
                        queryString1 = f"update rack_table set SITE_NAME='{rackObj['site_name']}',RACK_NAME='{rackObj['rack_name']}',SERIAL_NUMBER='{rackObj['serial_number']}',CREATION_DATE='{date}',MODIFICATION_DATE='{date}',STATUS='{rackObj['status']}',RU={rackObj['ru']},HEIGHT='{rackObj['height']}',WIDTH='{rackObj['width']}',RACK_MODEL='{rackObj['rack_model']}',FLOOR='{rackObj['floor']}' where RACK_ID={rackObj['rack_id']};"
                        db.session.execute(queryString1)
                        db.session.commit()
                        print(f"Updated {rackObj['rack_id']}", file=sys.stderr)
                        queryString = f"update atom_table set SITE_NAME='{rackObj['site_name']}' where RACK_NAME='{rackObj['rack_name']}';"
                        queryString1 = f"update atom_table set RACK_NAME='{rackObj['rack_name']}' where RACK_NAME=(select RACK_NAME from rack_table where RACK_ID={rackObj['rack_id']});"
                        queryString2 = f"update device_table set SITE_NAME='{rackObj['site_name']}' where RACK_NAME='{rackObj['rack_name']}';"
                        queryString3 = f"update device_table set RACK_NAME='{rackObj['rack_name']}' where RACK_NAME=(select RACK_NAME from rack_table where RACK_ID={rackObj['rack_id']});"
                        db.session.execute(queryString)
                        db.session.execute(queryString1)
                        db.session.execute(queryString2)
                        db.session.execute(queryString3)
                        db.session.commit()
                        return "Rack Updated Successfully", 200
                    else:
                        return "Something Went Wrong", 500
                else:

                    queryString = f"select RACK_NAME from rack_table;"
                    result = db.session.execute(queryString)
                    racksList = []
                    for row in result:
                        racksList.append(row[0])

                    if rackObj['rack_name'] in racksList:
                        return jsonify({'response': 'Rack Name Already Exists'}), 500

                    queryString2 = f"INSERT INTO rack_table (SITE_NAME,RACK_NAME,SERIAL_NUMBER,CREATION_DATE,MODIFICATION_DATE,STATUS,RU,HEIGHT,WIDTH,RACK_MODEL,FLOOR) VALUES ('{rackObj['site_name']}','{rackObj['rack_name']}','{rackObj['serial_number']}','{date}','{date}','{rackObj['status']}',{rackObj['ru']},{rackObj['height']},{rackObj['width']},'{rackObj['rack_model']}','{rackObj['floor']}');"
                    db.session.execute(queryString2)
                    db.session.commit()
                    print(f"Inserted {rackObj['rack_name']}", file=sys.stderr)
                    return "Rack Inserted Successfully", 200


            else:
                print("Site Name do not exists", file=sys.stderr)
                return jsonify({'response': 'Site Name do not exists'}), 500
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route('/deleteRack', methods=['POST'])
@token_required
def DeleteRack(user_data):
    if True:
        try:
            rackNames = request.get_json()
            responseList = []
            response1 = False
            response2 = False
            response3 = False
            response4 = False
            for rackName in rackNames:
                queryString = f"select count(*) from device_table where rack_name='{rackName}';"
                result = db.session.execute(queryString).scalar()
                queryString1 = f"select count(*) from atom_table where rack_name = '{rackName}';"
                result1 = db.session.execute(queryString1).scalar()
                if result1 > 0 and result > 0:
                    response1 = 'both'
                    responseList.append(response1)

                elif result > 0:
                    response2 = 'device'
                    responseList.append(response2)

                elif result1 > 0:
                    response3 = 'atom'
                    responseList.append(response3)


                else:
                    queryString = f"delete from rack_table where rack_name = '{rackName}';"
                    db.session.execute(queryString)
                    db.session.commit()
                    response4 = 'deleted'
                    responseList.append(response4)

            responseList = set(responseList)
            responseList = list(responseList)
            print(responseList, file=sys.stderr)
            if len(responseList) == 1:
                if responseList[0] == 'both':
                    return "Rack Name Found in Both Atom and Device", 500
                elif responseList[0] == 'device':
                    return "Rack Name Found in Device", 500
                elif responseList[0] == 'atom':
                    return "Rack Name Found in Atom", 500
                elif responseList[0] == 'deleted':
                    return "Rack Delete Successfully", 200
            elif len(responseList) > 1:
                # if 'deleted' in responseList:
                #     return "Some Racks are Deleted",200
                if 'both' in responseList and 'deleted' in responseList:
                    return "Some Racks are Deleted and Some Racks Found in Both Atom and Device", 200
                elif 'both' in responseList and 'atom' in responseList:
                    return "Some Racks Found in Both Atom and Device", 500
                elif 'both' in responseList and 'device' in responseList:
                    return "Some Racks Found in Both Atom and Device", 500
                elif 'device' in responseList and 'deleted' in responseList:
                    return "Some Racks are Deleted and Some Racks are Found in Atom", 200
                elif 'device' in responseList and 'deleted' in responseList:
                    return "Some Racks are Deleted and Some Racks are Found in Device", 200
                elif 'device' in responseList and 'atom' in responseList:
                    return "Some Racks are Found in Atom and Device", 500
            else:
                return "Something Went Wrong", 500

        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route('/getAllBoards', methods=['GET'])
@token_required
def GetAllBoards(user_data):
    return jsonify(list()), 200
    try:
        boardObjList = []
        boardObjs = Board_Table.query.all()
        for boardObj in boardObjs:
            boardDataDict = {}
            boardDataDict['module_name'] = boardObj.board_name
            boardDataDict['device_name'] = boardObj.device_name
            boardDataDict['device_slot_id'] = boardObj.device_slot_id
            boardDataDict['software_version'] = boardObj.software_version
            # boardDataDict['hardware_version'] = boardObj.hardware_version
            boardDataDict['serial_number'] = boardObj.serial_number
            # boardDataDict['manufacturer_date'] = FormatDate(
            #     (boardObj.manufacturer_date))
            boardDataDict['creation_date'] = FormatDate(
                (boardObj.creation_date))
            boardDataDict['modification_date'] = FormatDate(
                (boardObj.modification_date))
            boardDataDict['status'] = boardObj.status
            boardDataDict['eos_date'] = FormatDate((boardObj.eos_date))
            boardDataDict['eol_date'] = FormatDate((boardObj.eol_date))
            # boardDataDict['rfs_date'] = FormatDate((boardObj.rfs_date))
            boardDataDict['pn_code'] = boardObj.pn_code

            boardObjList.append(boardDataDict)
        return jsonify(boardObjList), 200
    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route('/addBoard', methods=['POST'])
@token_required
def AddBoard(user_data):
    if True:
        try:
            boardObj = request.get_json()
            if Device_Table.query.with_entities(Device_Table.device_name).filter_by(
                    device_name=boardObj['device_name']).first() is not None:
                board = Board_Table()
                board.board_name = boardObj['board_name']
                board.device_name = boardObj['device_name']
                board.device_slot_id = boardObj['device_slot_id']
                board.software_version = boardObj['software_version']
                # board.hardware_version = boardObj['hardware_version']
                board.serial_number = boardObj['serial_number']
                # board.manufacturer_date = boardObj['manufacturer_date']
                board.creation_date = datetime.now()
                board.modification_date = datetime.now()
                board.status = boardObj['status']
                board.eos_date = boardObj['eos_date']
                board.eol_date = boardObj['eol_date']
                # board.rfs_date = boardObj['rfs_date']
                board.pn_code = boardObj['pn_code']
                InsertData(board)
                print("Inserted " + boardObj['board_name'], file=sys.stderr)
                return jsonify({'response': "success", "code": "200"})
            else:
                print("Service not Available", file=sys.stderr)
                return jsonify({"Response": "Service not Available"}), 503
        except Exception as e:
            traceback.print_exc()
            return str(e), 500


# @app.route('/addBoard',methods = ['POST'])
# def AddBoard():
#     if True:
#         boardObj = request.get_json()
#         if Device_Table.query.with_entities(Device_Table.board_name).filter_by(device_name=boardObj['device_name']).first() is not None:
#             board = Board_Table()
#             board.board_name = boardObj['board_name']
#             board.device_name = boardObj['device_name']
#             board.device_slot_id = boardObj['device_slot_id']
#             board.software_version = boardObj['software_version']
#             board.hardware_version = boardObj['hardware_version']
#             board.serial_number= boardObj['serial_number']
#             board.manufacturer_date = boardObj['manufacturer_date']
#             board.creation_date = datetime.now()
#             board.modification_date = datetime.now()
#             board.status = boardObj['status']
#             board.eos_date = boardObj['eos_date']
#             board.eol_date = boardObj['eol_date']
#             board.rfs_date = boardObj['rfs_date']
#             board.pn_code = boardObj['pn_code']
#             InsertData(board)
#             print("Inserted " +boardObj['board_name'],file=sys.stderr)
#             return jsonify({'response': "success","code":"200"})
#         else:
#             print("Service not Available",file=sys.stderr)
#             return jsonify({"Response":"Service not Available"}),503


@app.route("/editBoard", methods=['POST'])
@token_required
def EditBoard(user_data):
    if True:
        try:
            boardObj = request.get_json()
            print(boardObj, file=sys.stderr)

            board = Board_Table.query.with_entities(Board_Table).filter_by(
                board_name=boardObj["board_name"]).first()

            board.rfs_date = FormatStringDate(boardObj['rfs_date'])

            board.modification_date = datetime.now()
            UpdateData(board)

            return jsonify({'response': "success", "code": "200"})
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route('/getAllSubBoards', methods=['GET'])
@token_required
def GetAllSubBoards(user_data):
    return jsonify(list()), 200
    if True:
        try:
            subboardObjList = []
            subboardObjs = Subboard_Table.query.all()
            for subboardObj in subboardObjs:
                subboardDataDict = {}
                subboardDataDict['subboard_name'] = subboardObj.subboard_name
                subboardDataDict['device_name'] = subboardObj.device_name
                subboardDataDict['subboard_type'] = subboardObj.subboard_type
                subboardDataDict['subrack_id'] = subboardObj.subrack_id
                subboardDataDict['slot_number'] = subboardObj.slot_number
                subboardDataDict['subslot_number'] = subboardObj.subslot_number
                subboardDataDict['software_version'] = subboardObj.software_version
                # subboardDataDict['hardware_version'] = subboardObj.hardware_version
                subboardDataDict['serial_number'] = subboardObj.serial_number
                subboardDataDict['creation_date'] = FormatDate(
                    (subboardObj.creation_date))
                subboardDataDict['modification_date'] = FormatDate(
                    (subboardObj.modification_date))
                subboardDataDict['status'] = subboardObj.status
                subboardDataDict['eos_date'] = FormatDate(
                    (subboardObj.eos_date))
                subboardDataDict['eol_date'] = FormatDate(
                    (subboardObj.eol_date))
                # subboardDataDict['rfs_date'] = FormatDate(
                #     (subboardObj.rfs_date))
                subboardDataDict['pn_code'] = subboardObj.pn_code

                subboardObjList.append(subboardDataDict)
            return jsonify(subboardObjList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/editSubBoard", methods=['POST'])
@token_required
def EditSubBoard(user_data):
    if True:
        try:
            subBoardObj = request.get_json()
            print(subBoardObj, file=sys.stderr)

            subBoard = Subboard_Table.query.with_entities(Subboard_Table).filter_by(
                subboard_name=subBoardObj["subboard_name"]).first()

            subBoard.rfs_date = FormatStringDate(subBoardObj['rfs_date'])

            subBoard.modification_date = datetime.now()
            UpdateData(subBoard)

            return jsonify({'response': "success", "code": "200"})
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route('/getAllSfps', methods=['GET'])
@token_required
def GetAllSfps(user_data):
    return jsonify(list()), 200
    if True:
        try:
            sfpObjList = []
            sfpObjs = Sfps_Table.query.all()
            for sfpObj in sfpObjs:
                sfpDataDict = {}
                sfpDataDict['sfp_id'] = sfpObj.sfp_id
                sfpDataDict['device_name'] = sfpObj.device_name
                sfpDataDict['media_type'] = sfpObj.media_type
                sfpDataDict['port_name'] = sfpObj.port_name
                sfpDataDict['port_type'] = sfpObj.port_type
                # sfpDataDict['connector'] = sfpObj.connector
                sfpDataDict['mode'] = sfpObj.mode
                # sfpDataDict['speed'] = sfpObj.speed
                # sfpDataDict['wavelength'] = sfpObj.wavelength
                # sfpDataDict['manufacturer'] = sfpObj.manufacturer
                # sfpDataDict['optical_direction_type'] = sfpObj.optical_direction_type
                # sfpDataDict['pn_code'] = sfpObj.pn_code
                sfpDataDict['creation_date'] = FormatDate(
                    (sfpObj.creation_date))
                sfpDataDict['modification_date'] = FormatDate(
                    (sfpObj.modification_date))
                sfpDataDict['status'] = sfpObj.status
                sfpDataDict['eos_date'] = FormatDate((sfpObj.eos_date))
                sfpDataDict['eol_date'] = FormatDate((sfpObj.eol_date))
                # sfpDataDict['rfs_date'] = FormatDate((sfpObj.rfs_date))
                sfpDataDict['serial_number'] = sfpObj.serial_number
                sfpObjList.append(sfpDataDict)
            return jsonify(sfpObjList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/editSfps", methods=['POST'])
@token_required
def EditSfps(user_data):
    if True:
        try:
            sfpsObj = request.get_json()
            print(sfpsObj, file=sys.stderr)
            sfps = Sfps_Table.query.with_entities(
                Sfps_Table).filter_by(sfp_id=sfpsObj["sfp_id"]).first()

            sfps.rfs_date = FormatStringDate(sfpsObj['rfs_date'])

            sfps.modification_date = datetime.now()
            UpdateData(sfps)

            return jsonify({'response': "success", "code": "200"})
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route('/getAllLicenses', methods=['GET'])
@token_required
def GetAllLicenses(user_data):
    return jsonify(list()), 200
    if True:

        try:
            licenseObjList = []
            licenseObjs = License_Table.query.all()
            for licenseObj in licenseObjs:
                licenseDataDict = {}
                licenseDataDict['license_name'] = licenseObj.license_name
                licenseDataDict['license_description'] = licenseObj.license_description
                licenseDataDict['device_name'] = licenseObj.device_name
                # licenseDataDict['rfs_date'] = ((licenseObj.rfs_date))
                licenseDataDict['activation_date'] = (
                    (licenseObj.activation_date))
                licenseDataDict['expiry_date'] = ((licenseObj.expiry_date))
                # licenseDataDict['grace_period'] = ((licenseObj.grace_period))
                # licenseDataDict['serial_number'] = licenseObj.serial_number
                licenseDataDict['creation_date'] = FormatStringDate(
                    (licenseObj.creation_date))
                licenseDataDict['modification_date'] = FormatStringDate(
                    (licenseObj.modification_date))
                licenseDataDict['status'] = licenseObj.status
                # licenseDataDict['capacity'] = licenseObj.capacity
                # licenseDataDict['usage'] = licenseObj.usage
                licenseDataDict['pn_code'] = licenseObj.pn_code

                licenseObjList.append(licenseDataDict)
            return jsonify(licenseObjList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


# @app.route("/editLicenses", methods = ['POST'])
# def EditLicenses():
#     if True:
#         licensesObj = request.get_json()
#         print(licensesObj,file = sys.stderr)
#         licenses = License_Table.query.with_entities(License_Table).filter_by(license_name=licensesObj["license_name"]).first()

#         licenses.item_code = licensesObj['item_code']
#         licenses.item_desc = licensesObj['item_desc']
#         licenses.ciei = licensesObj['ciei']
#         licenses.modification_date= datetime.now()
#         UpdateData(licenses)

#         return jsonify({'response': "success","code":"200"})

#     else:
#         print("Service not Available",file=sys.stderr)
#         return jsonify({"Response":"Service not Available"}),503


@app.route("/dismantleOnBoardedDevice", methods=['POST'])
@token_required
def DismantleOnBoardDevice(user_data):
    if True:
        try:

            deviceIDs = request.get_json()
            print(deviceIDs, file=sys.stderr)
            for ip in deviceIDs:

                atomObj = db.session.query(
                    Atom).filter_by(ip_address=ip).first()
                atomObj.onboard_status = 'False'
                UpdateData(atomObj)
                print(f"Device {ip} ONBOARDED STATUS UPDATED IN ATOM", file=sys.stderr)
                deviceObj = db.session.query(
                    Device_Table).filter_by(ip_address=ip).first()

                # change status to dismantle in device table
                deviceObj.status = 'Dismantled'
                deviceObj.modification_date = datetime.now()
                UpdateData(deviceObj)
                print(f"DEVICE {deviceObj.device_name} SUCCESSFULLY DISMANTLED", file=sys.stderr)
                # change all board status
                boardObjs = db.session.query(Board_Table).filter_by(
                    device_name=deviceObj.device_name)
                for boardObj in boardObjs:
                    boardObj.status = 'Dismantled'
                    boardObj.modification_date = datetime.now()
                    UpdateData(boardObj)
                    print(f"MODULE {boardObj.board_name} SUCCESSFULLY DISMANTLED", file=sys.stderr)
                # change all sub-board status
                subboardObjs = db.session.query(Subboard_Table).filter_by(
                    device_name=deviceObj.device_name)
                for subboardObj in subboardObjs:
                    subboardObj.status = 'Dismantled'
                    subboardObj.modification_date = datetime.now()
                    UpdateData(subboardObj)
                    print(f"STACK SWITCH {subboardObj.subboard_name} SUCCESSFULLY DISMANTLED", file=sys.stderr)

                # change all SFP status
                sfpObjs = db.session.query(Sfps_Table).filter_by(
                    device_name=deviceObj.device_name)
                for sfpObj in sfpObjs:
                    sfpObj.status = 'Dismantled'
                    sfpObj.modification_date = datetime.now()
                    UpdateData(sfpObj)
                    print(f"DEVICE {sfpObj.sfp_id} SUCCESSFULLY DISMANTLED", file=sys.stderr)

            return "SUCCESSFULLY DISMANTLED", 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route("/maintenanceOnBoardedDevice", methods=['POST'])
@token_required
def MaintenanceOnBoardDevice(user_data):
    if True:
        try:

            deviceIDs = request.get_json()
            print(deviceIDs, file=sys.stderr)
            for ip in deviceIDs:

                atomObj = db.session.query(
                    Atom).filter_by(ip_address=ip).first()
                atomObj.onboard_status = 'False'
                UpdateData(atomObj)
                print(f"Device {ip} ONBOARDED STATUS UPDATED IN ATOM", file=sys.stderr)
                deviceObj = db.session.query(
                    Device_Table).filter_by(ip_address=ip).first()

                # change status to Maintenance in device table
                deviceObj.status = 'Maintenance'
                deviceObj.modification_date = datetime.now()
                UpdateData(deviceObj)
                print(f"DEVICE {deviceObj.device_name} SUCCESSFULLY under Maintenance", file=sys.stderr)
                # change all board status
                boardObjs = db.session.query(Board_Table).filter_by(
                    device_name=deviceObj.device_name)
                for boardObj in boardObjs:
                    boardObj.status = 'Maintenance'
                    boardObj.modification_date = datetime.now()
                    UpdateData(boardObj)
                    print(f"MODULE {boardObj.board_name} SUCCESSFULLY under Maintenance", file=sys.stderr)
                # change all sub-board status
                subboardObjs = db.session.query(Subboard_Table).filter_by(
                    device_name=deviceObj.device_name)
                for subboardObj in subboardObjs:
                    subboardObj.status = 'Maintenance'
                    subboardObj.modification_date = datetime.now()
                    UpdateData(subboardObj)
                    print(f"STACK SWITCH {subboardObj.subboard_name} SUCCESSFULLY under Maintenance", file=sys.stderr)

                # change all SFP status
                sfpObjs = db.session.query(Sfps_Table).filter_by(
                    device_name=deviceObj.device_name)
                for sfpObj in sfpObjs:
                    sfpObj.status = 'Maintenance'
                    sfpObj.modification_date = datetime.now()
                    UpdateData(sfpObj)
                    print(f"DEVICE {sfpObj.sfp_id} SUCCESSFULLY under Maintenance", file=sys.stderr)

            return "SUCCESSFULLY Under Maintenance", 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route("/undefinedOnBoardedDevice", methods=['POST'])
@token_required
def UndefinedOnBoardDevice(user_data):
    if True:
        try:

            deviceIDs = request.get_json()
            print(deviceIDs, file=sys.stderr)
            for ip in deviceIDs:

                atomObj = db.session.query(
                    Atom).filter_by(ip_address=ip).first()
                atomObj.onboard_status = 'False'
                UpdateData(atomObj)
                print(f"Device {ip} ONBOARDED STATUS UPDATED IN ATOM", file=sys.stderr)
                deviceObj = db.session.query(
                    Device_Table).filter_by(ip_address=ip).first()

                # change status to Maintenance in device table
                deviceObj.status = 'Undefined'
                deviceObj.modification_date = datetime.now()
                UpdateData(deviceObj)
                print(f"DEVICE {deviceObj.device_name} SUCCESSFULLY under Undefined state", file=sys.stderr)
                # change all board status
                boardObjs = db.session.query(Board_Table).filter_by(
                    device_name=deviceObj.device_name)
                for boardObj in boardObjs:
                    boardObj.status = 'Undefined'
                    boardObj.modification_date = datetime.now()
                    UpdateData(boardObj)
                    print(f"MODULE {boardObj.board_name} SUCCESSFULLY under Undefined state", file=sys.stderr)
                # change all sub-board status
                subboardObjs = db.session.query(Subboard_Table).filter_by(
                    device_name=deviceObj.device_name)
                for subboardObj in subboardObjs:
                    subboardObj.status = 'Undefined'
                    subboardObj.modification_date = datetime.now()
                    UpdateData(subboardObj)
                    print(f"STACK SWITCH {subboardObj.subboard_name} SUCCESSFULLY under Undefined state",
                          file=sys.stderr)

                # change all SFP status
                sfpObjs = db.session.query(Sfps_Table).filter_by(
                    device_name=deviceObj.device_name)
                for sfpObj in sfpObjs:
                    sfpObj.status = 'Undefined'
                    sfpObj.modification_date = datetime.now()
                    UpdateData(sfpObj)
                    print(f"DEVICE {sfpObj.sfp_id} SUCCESSFULLY under Undefined state", file=sys.stderr)

            return "SUCCESSFULLY Under Undefined state", 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route('/getAllAps', methods=['GET'])
@token_required
def GetAllAps(user_data):
    return jsonify(list()), 200
    if True:
        try:
            apObjs = APS_TABLE.query.all()
            objList = []
            for apObj in apObjs:
                objDict = {}
                objDict['ap_id'] = apObj.ap_id
                objDict['controller_name'] = apObj.controller_name
                objDict['ap_ip'] = apObj.ap_ip
                objDict['ap_name'] = apObj.ap_name
                objDict['serial_number'] = apObj.serial_number
                objDict['ap_model'] = apObj.ap_model
                objDict['hardware_version'] = apObj.hardware_version
                objDict['software_version'] = apObj.software_version
                objDict['description'] = apObj.description
                objDict['creation_date'] = apObj.creation_date
                objDict['modification_date'] = apObj.modification_date
                objList.append(objDict)
            print(objList, file=sys.stderr)
            return jsonify(objList), 200


        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({"message": "Authentication Failed"}), 401
