from app import app
from app.models.inventory_models import *
from app.middleware import token_required
from app.uam.uam_utils import *

from flask_jsonpify import jsonify
from flask import request

import traceback


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
    
    
@app.route("/getSfpsDetailsByIpAddress", methods=["GET"])
@token_required
def GetSfpsDetailsByIpAddress(user_data):
    return jsonify(list()), 200
    
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

