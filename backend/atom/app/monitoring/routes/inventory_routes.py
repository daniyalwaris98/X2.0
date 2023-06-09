
# import traceback
# from app import app, db
# from re import A
# from app import app, db
# from flask_jsonpify import jsonify
# from flask import request, make_response, Response, session
# from app.models.inventory_models import Monitoring,Monitoring_table
# from flask_jsonpify import jsonify
# import pandas as pd
# import json
# import sys
# import time
# from datetime import date, datetime
# from flask import request, make_response, Response, session
# from sqlalchemy import func
# #from app.middleware import token_required
# import gzip
# from flask_cors import CORS, cross_origin
# import threading
# from app.middleware import token_required




# def InsertData(obj):
#     # add data to db
#     try:
#         db.session.add(obj)
#         db.session.commit()

#     except Exception as e:
#         db.session.rollback()
#         print(
#             f"Something else went wrong in Database Insertion {e}", file=sys.stderr)

#     return True


# def UpdateData(obj):
#     # add data to db
#     #print(obj, file=sys.stderr)
#     try:
#         # db.session.flush()

#         db.session.merge(obj)
#         db.session.commit()

#     except Exception as e:
#         db.session.rollback()
#         print(
#             f"Something else went wrong during Database Update {e}", file=sys.stderr)

#     return True


# @app.route("/")
# @token_required
# def hello(user_data):
#     if True:

#         try:

#             return "Welcome to MonetX", 200
#         except Exception as e:
#             return str(e), 500
#     else:
#         print("Service not Available", file=sys.stderr)
#         return jsonify({"Response": "Service not Available"}), 503




# @app.route("/adddev", methods=['GET'])
# def Add():
#     return "ye to chal rha hy"


# @app.route("/addMonitoringDevice", methods=['POST'])
# # @token_required
# def AddMonitoringDevice():
#     if True:
#         try:
#             MonitoringObj = request.get_json()
#             print(MonitoringObj, file=sys.stderr)

#             # if Phy_Table.query.with_entities(Phy_Table.site_name).filter_by(site_name=MonitoringObj['site_name']).first() !=None and Rack_Table.query.with_entities(Rack_Table.rack_name).filter_by(rack_name=MonitoringObj['rack_name']).first() !=None:
#             Monitoring = Monitoring()
#             Monitoring.device_ip = MonitoringObj['Device_IP']
#             Monitoring.device_type = MonitoringObj['Device_Type']
#             Monitoring.snmp_version = MonitoringObj['SNMP_Version']
#             Monitoring.community = MonitoringObj['Community']
#             Monitoring.auth_protocol = MonitoringObj['Auth_Protocol']
#             Monitoring.encryp_protocol = MonitoringObj['Encryp_Protocol']
#             Monitoring.status = MonitoringObj['Status']

#             # if 'password_group' in monitoringObj:
#             #     monitoring.password_group = atomObj['password_group']

#             # if 'device_ru' in atomObj:
#             #     atom.device_ru = atomObj['device_ru']
#             # else:
#             #     atom.device_ru = 'N/A'
#             # if 'department' in atomObj:
#             #     atom.department = atomObj['department']
#             # else:
#             #     atom.department = 'N/A'
#             # if 'section' in atomObj:
#             #     atom.section = atomObj['section']
#             # else:
#             #     atom.section = 'N/A'
#             # if 'criticality' in atomObj:
#             #     atom.criticality = atomObj['criticality']
#             # else:
#             #     atom.criticality = 'N/A'
#             # if 'function' in atomObj:
#             #     atom.function = atomObj['function']
#             # else:
#             #     atom.function = 'N/A'
#             # if 'domain' in atomObj:
#             #     atom.domain = atomObj['domain']
#             # else:
#             #     atom.domain = 'N/A'
#             # if 'virtual' in atomObj:
#             #     atom.virtual = atomObj['virtual']
#             # else:
#             #     atom.virtual = atomObj['virtual']
#             # if 'device_type' in atomObj:
#             #     atom.device_type = atomObj['device_type']
#             # else:
#             #     atom.device_type = 'N/A'
#             # atom.onboard_status = 'False'
#             # # if Atom.query.with_entities(Atom.ip_address).filter_by(ip_address=atomObj['ip_address']) is not None:
#             # #     atom.atom_id = Atom.query.with_entities(atom.atom_id).filter_by(ip_address=atomObj['ip_address']).first()[0]
#             # #     print("Updated "+atomObj['ip_address'],file = sys.stderr)
#             # #     UpdateData(atom)
#             # # else:

#             print("Inserted ", MonitoringObj['Device_IP'], file=sys.stderr)
#             InsertData(Monitoring)
#             return jsonify({"Response": "OK"}), 200
#             # else:
#             #     print("Rack name or Site name does not exist",file=sys.stderr)
#             #     return jsonify({"Response":"Rack name or Site name does not exist"}),500

#         except Exception as e:
#             traceback.print_exc()
#             return str(e), 500

#     else:
#         print("Service not Available", file=sys.stderr)
#         return jsonify({"Response": "Service not Available"}), 503


# @app.route("/addMonitoringDevices", methods=['POST'])
# @token_required
# def AddMonitoringDevices(user_data):
#     if True:
#         try:    
#             MonitoringObjs = request.get_json()
#             print(MonitoringObjs, file=sys.stderr)

#             for MonitoringObj in MonitoringObjs:
#                 if Monitoring_table.query.with_entities(Monitoring_table.DEVICE_IP).filter_by(DEVICE_IP=MonitoringObj['site_name']).first():
#                     Monitoring = Monitoring()
#                     Monitoring.device_ip = MonitoringObj['Device_IP']
#                     Monitoring.device_type = MonitoringObj['Device_Type']
#                     Monitoring.snmp_version = MonitoringObj['SNMP_Version']
#                     Monitoring.community = MonitoringObj['Community']
#                     Monitoring.auth_protocol = MonitoringObj['Auth_Protocol']
#                     Monitoring.encryp_protocol = MonitoringObj['Auth_Protocol']
#                     Monitoring.status = MonitoringObj['Status']

#                     # if 'device_ru' in MonitoringObj:
#                     #     Monitoring.device_ru = MonitoringObj['device_ru']
#                     # else:
#                     #     Monitoring.device_ru = 'N/A'
#                     # if 'department' in MonitoringObj:
#                     #     Monitoring.department = MonitoringObj['department']
#                     # else:
#                     #     Monitoring.department = 'N/A'
#                     # if 'section' in MonitoringObj:
#                     #     Monitoring.section = MonitoringObj['section']
#                     # else:
#                     #     Monitoring.section = 'N/A'
#                     # if 'criticality' in MonitoringObj:
#                     #     Monitoring.criticality = MonitoringObj['criticality']
#                     # else:
#                     #     Monitoring.criticality = 'N/A'
#                     # if 'function' in MonitoringObj:
#                     #     Monitoring.function = MonitoringObj['function']
#                     # else:
#                     #     Monitoring.function = 'N/A'
#                     # if 'domain' in MonitoringObj:
#                     #     Monitoring.domain = MonitoringObj['domain']
#                     # else:
#                     #     Monitoring.domain = 'N/A'
#                     # if 'virtual' in MonitoringObj:
#                     #     Monitoring.virtual = MonitoringObj['virtual']
#                     # else:
#                     #     Monitoring.virtual = 'N/A'
#                     # if 'device_type' in MonitoringObj:
#                     #     Monitoring.device_type = MonitoringObj['device_type']
#                     # else:
#                     #     Monitoring.device_type = 'N/A'

#                     # if Atom.query.with_entities(Atom.ip_address).filter_by(ip_address=atomObj['ip_address']) is not None:
#                     #     # atom.atom_id = Atom.query.with_entities(atom.atom_id).filter_by(ip_address=atomObj['ip_address']).first()[0]
#                     #     print("Updated "+atomObj['ip_address'],file = sys.stderr)
#                     #     UpdateData(atom)
#                     # else:
#                     print("Inserted ", MonitoringObj['ip_address'], file=sys.stderr)
#                     InsertData(Monitoring)
#                 return jsonify({"Response": "OK"}), 200
#             else:
#                 print("Rack name or Site name does not exist", file=sys.stderr)
#                 return jsonify({"Response": "Rack name or Site name does not exist"}), 500

#         except Exception as e:
#             traceback.print_exc()
#             print(str(e), file=sys.stderr)
#             return str(e), 500

#     else:
#         print("Service not Available", file=sys.stderr)
#         return jsonify({"Response": "Service not Available"}), 503


# @app.route("/getMonitoringDevices", methods=['GET'])
# @token_required
# def GetMonitorings(user_data):
#     if True:
#         try:
#             MonitoringObjList = []
#             MonitoringObjs = Monitoring.query.all()

#             for MonitoringObj in MonitoringObjs:
#                 MonitoringDataDict = {}
#                 MonitoringObj['Device_IP'] = Monitoring.device_ip
#                 MonitoringObj['Device_Type'] = Monitoring.device_type
#                 MonitoringObj['SNMP_Version'] =Monitoring.snmp_version
#                 MonitoringObj['Community'] = Monitoring.community 
#                 MonitoringObj['Auth_Protocol'] = Monitoring.auth_protocol
#                 MonitoringObj['Auth_Protocol'] = Monitoring.encryp_protocol

#                 MonitoringObjList.append(MonitoringDataDict)
#             content = gzip.compress(json.dumps(MonitoringObjList).encode('utf8'), 5)
#             response = make_response(content)
#             response.headers['Content-length'] = len(content)
#             response.headers['Content-Encoding'] = 'gzip'
#             return response

#         except Exception as e:
#             traceback.print_exc()
#             return str(e), 500
#     else:
#         print("Service not Available", file=sys.stderr)
#         return jsonify({"Response": "Service not Available"}), 503



# # @app.route("/addMonitoringUser", methods=['POST'])
# # @token_required
# # def AddUser(user_data):
# #     if True:
# #         try:
# #             userObj = request.get_json()
# #             user = Password_Group_Table()
# #             user.password_group = userObj['password_group']
# #             user.username = userObj['username']
# #             user.password = userObj['password']
# #             InsertData(user)
# #             print(userObj['username']+" Added Successfully", file=sys.stderr)
# #             return jsonify({"Response": 'Success'}), 200
# #         except Exception as e:
# #             traceback.print_exc()
# #             print(str(e),file=sys.stderr)
# #             return str(e), 500
# #     else:
# #         print("Service not Available", file=sys.stderr)
# #         return jsonify({"Response": "Service not Available"}), 503


# # @app.route("/addMonitoringUsers", methods=['POST'])
# # @token_required
# # def AddUsers(user_data):
# #     if True:
# #         try:
# #             userObjs = request.get_json()
# #             for userObj in userObjs:
# #                 user = Password_Group_Table()
# #                 user.password_group = userObj['password_group']
# #                 user.username = userObj['username']
# #                 user.password = userObj['password']
# #                 InsertData(user)
# #                 print(userObj['username'] +
# #                       " Added Successfully", file=sys.stderr)
# #             return jsonify({"Response": "Success"}), 200
# #         except Exception as e:
# #             traceback.print_exc()
# #             print(str(e), file=sys.stderr)
# #             return str(e), 500
# #     else:
# #         print("Service not Available", file=sys.stderr)
# #         return jsonify({"Response": "Service not Available"}), 503


# # @app.route("/editMonitoringUser", methods=['POST'])
# # @token_required
# # def EditUser(user_data):
# #     if True:
# #         try:
# #             userObj = request.get_json()
# #             print(userObj, file=sys.stderr)

# #             user = Password_Group_Table.query.with_entities(Password_Group_Table).filter_by(
# #                 password_group=userObj['password_group']).first()
# #             print(user, file=sys.stderr)
            
# #             if Password_Group_Table.query.with_entities(Password_Group_Table.password_group).filter_by(password_group=userObj['password_group']):
# #                 user.password_group = userObj['password_group']
# #                 user.username = userObj['username']
# #                 user.password = userObj['password']

# #                 UpdateData(user)
# #                 print("Updated User", file=sys.stderr)
# #                 return jsonify({"Response": "Success"}), 200
# #             else:
# #                 print("Password Group Does not exist", file=sys.stderr)
# #                 return jsonify({"Response": "Password group does not exist"}), 500
# #         except Exception as e:
# #             traceback.print_exc()
# #             return str(e), 500
# #     else:
# #         print("Service not Available", file=sys.stderr)
# #         return jsonify({"Response": "Service not Available"}), 503


# # @app.route("/getMonitoringUsers", methods=['GET'])
# # @token_required
# # def GetUsers(user_data):
# #     if True:
# #         try:
# #             userObjList = []
# #             userObjs = Password_Group_Table.query.all()

# #             for userObj in userObjs:
# #                 userDataDict = {}
# #                 userDataDict['password_group'] = userObj.password_group
# #                 userDataDict['username'] = userObj.username
# #                 userDataDict['password'] = userObj.password

# #                 userObjList.append(userDataDict)
# #             content = gzip.compress(json.dumps(userObjList).encode('utf8'), 5)
# #             response = make_response(content)
# #             response.headers['Content-length'] = len(content)
# #             response.headers['Content-Encoding'] = 'gzip'
# #             return response
# #         except Exception as e:
# #             traceback.print_exc()
# #             return str(e), 500
# #     else:
# #         print("Service not Available", file=sys.stderr)
# #         return jsonify({"Response": "Service not Available"}), 503
