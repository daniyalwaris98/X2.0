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
