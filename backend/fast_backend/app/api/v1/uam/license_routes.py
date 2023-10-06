# from app.api.v1.uam.utils.uam_utils import *
#
#
# @app.route("/getAllLicenses", methods=["GET"])
# @token_required
# def GetAllLicenses(user_data):
#     try:
#         licenseObjList = []
#         results = (
#             db.session.query(License_Table, UAM_Device_Table, Atom_Table)
#             .join(UAM_Device_Table, License_Table.uam_id == UAM_Device_Table.uam_id)
#             .join(Atom_Table, UAM_Device_Table.atom_id == Atom_Table.atom_id)
#             .all()
#         )
#         for licenseObj, uam, atom in results:
#             licenseDataDict = {}
#             licenseDataDict["license_name"] = licenseObj.license_name
#             licenseDataDict["license_description"] = licenseObj.license_description
#             licenseDataDict["device_name"] = atom.device_name
#             # licenseDataDict['rfs_date'] = ((licenseObj.rfs_date))
#             licenseDataDict["activation_date"] = licenseObj.activation_date
#             licenseDataDict["expiry_date"] = licenseObj.expiry_date
#             # licenseDataDict['grace_period'] = ((licenseObj.grace_period))
#             # licenseDataDict['serial_number'] = licenseObj.serial_number
#             licenseDataDict["creation_date"] = FormatStringDate(
#                 licenseObj.creation_date
#             )
#             licenseDataDict["modification_date"] = FormatStringDate(
#                 licenseObj.modification_date
#             )
#             licenseDataDict["status"] = licenseObj.status
#             # licenseDataDict['capacity'] = licenseObj.capacity
#             # licenseDataDict['usage'] = licenseObj.usage
#             licenseDataDict["pn_code"] = licenseObj.pn_code
#
#             licenseObjList.append(licenseDataDict)
#
#         return jsonify(licenseObjList), 200
#     except Exception as e:
#         traceback.print_exc()
#         return "Error While Fetching License Data", 500
#
#
# # @app.route("/editLicenses", methods = ['POST'])
# # def EditLicenses():
# #     if True:
# #         licensesObj = request.get_json()
# #         print(licensesObj,file = sys.stderr)
# #         licenses = License_Table.query.with_entities(License_Table).filter_by(license_name=licensesObj["license_name"]).first()
#
# #         licenses.item_code = licensesObj['item_code']
# #         licenses.item_desc = licensesObj['item_desc']
# #         licenses.ciei = licensesObj['ciei']
# #         licenses.modification_date= datetime.now()
# #         UpdateData(licenses)
#
# #         return jsonify({'response': "success","code":"200"})
#
# #     else:
# #         print("Service not Available",file=sys.stderr)
# #         return jsonify({"Response":"Service not Available"}),503
#
#
# @app.route("/getLicenseDetailsByIpAddress", methods=["GET"])
# @token_required
# def GetLicenseDetailsByIpAddress(user_data):
#     try:
#
#         ip_address = None
#         try:
#             ip_address = request.args.get("ipaddress")
#         except Exception:
#             traceback.print_exc()
#             return "Ip Address Is Missing From URL", 500
#
#         if ip_address is not None:
#             try:
#
#                 results = (
#                     db.session.query(License_Table, UAM_Device_Table, Atom_Table)
#                     .join(UAM_Device_Table, License_Table.uam_id == UAM_Device_Table.uam_id)
#                     .join(Atom_Table, UAM_Device_Table.atom_id == Atom_Table.atom_id)
#                     .filter(Atom_Table.ip_address == ip_address)
#                     .all()
#                 )
#
#                 objList = []
#                 for license, uam, atom in results:
#                     objDict = {}
#                     objDict["license_name"] = license.license_name
#                     objDict["license_description"] = license.license_description
#                     objDict["ne_name"] = atom.device_name
#                     # objDict['rfs_date'] = FormatDate((rfs_date))
#                     objDict["activation_date"] = FormatDate(license.activation_date)
#                     objDict["expiry_date"] = FormatDate(license.expiry_date)
#                     # objDict['grace_period'] = grace_period
#                     # objDict['serial_number'] = serial_number
#                     objDict["creation_date"] = FormatDate(license.creation_date)
#                     objDict["modification_date"] = FormatDate(license.modification_date)
#                     objDict["status"] = license.status
#                     # objDict['capacity'] = capacity
#                     # objDict['usage'] = usage
#                     objDict["pn_code"] = license.pn_code
#                     objList.append(objDict)
#
#                 return jsonify(objList), 200
#
#             except Exception as e:
#                 traceback.print_exc()
#                 return "Error While Fetching License Data", 500
#
#         else:
#             print("Can not Get Ip Address from URL", file=sys.stderr)
#             return "Ip Address Is Missong From URL", 500
#     except Exception:
#         traceback.print_exc()
#         return "Server Error", 500
#
