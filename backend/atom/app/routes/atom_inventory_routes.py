import sys

from click import password_option

from app import app
from flask_jsonpify import jsonify
import json
from flask import request, make_response
import gzip
# from app.pullers.NXOS.nxos_inv import NXOSPuller
# from app.pullers.IOSXR.ios_xr_inv import XRPuller
# from app.pullers.IOSXE.ios_xe_inv import XEPuller
# from app.pullers.IOS.ios_inv import IOSPuller
# from app.pullers.ACI.aci_inv import ACIPuller
# from app.pullers.WLC.cisco_wlc_inv import WLCPuller
# from app.pullers.Prime.prime_inv import PrimePuller
# from app.pullers.UCS.ucs_cimc_inv import UCSPuller
# from app.pullers.A10.a10_inv import A10Puller
# from app.pullers.Infoblox.infoblox_inv import InfoboxPuller
# from app.pullers.Arista.arista_inv import AristaPuller
# from app.pullers.Arbor.arbor_inv import ArborPuller
# from app.pullers.Wirefilter.wirefilter_inv import WirefilterPuller
# from app.pullers.Fortinet.fortinet_inv import FortinetPuller
# from app.pullers.Juniper.juniper_inv import JuniperPuller
# from app.pullers.ASA.cisco_asa_inv import ASAPuller
# from app.pullers.PaloAlto.palo_alto_inv import PaloAltoPuller
# from app.pullers.Pulse_Secure.pulse_secure_inv import PulseSecurePuller
# from app.pullers.Symantec.symantec_inv import SymantecPuller
# from app.pullers.Fireeye.fireeye_inv import FireEyePuller
# from app.pullers.Firepower.firepower_inv import FirePowerPuller
from app.middleware import token_required

from app.utilities.db_utils import *

@app.route("/")
@token_required
def hello(user_data):
    try:
        return "Welcome to MonetX", 200
    except Exception as e:
        return str(e), 500




@app.route('/deleteAtom', methods=['POST'])
@token_required
def DeleteAtom(user_data):
    if True:
        try:
            ips = request.get_json()
            ipList = []
            deletionResponse = False
            errorResponse = False
            responses = []
            queryString = "select IP_ADDRESS from device_table;"
            result = db.session.execute(queryString)
            for row in result:
                ipList.append(row[0])

            for ip in ips:
                if ip in ipList:
                    queryString = f"select STATUS from device_table where IP_ADDRESS='{ip}';"
                    result = db.session.execute(queryString)
                    for row in result:
                        if row[0] == 'Dismantled':
                            queryString = f"delete from atom_table where ip_address='{ip}';"
                            db.session.execute(queryString)
                            db.session.commit()
                            queryString = f"delete from device_table where ip_address='{ip}';"
                            db.session.execute(queryString)
                            db.session.commit()
                            deletionResponse = 'deletionResponse'
                            responses.append(deletionResponse)
                        if row[0] == 'Production':
                            errorResponse = 'errorResponse'
                            responses.append(errorResponse)
                else:
                    queryString = f"delete from atom_table where ip_address='{ip}';"
                    db.session.execute(queryString)
                    db.session.commit()
                    deletionResponse = 'deletionResponse'
                    responses.append(deletionResponse)
            responses = set(responses)
            responses = list(responses)
            if len(responses) == 1:
                if responses[0] == 'deletionResponse':
                    return "ATOMS DELETED SUCCESSFULLY", 200
                if responses[0] == 'errorResponse':
                    return "ERROR! DEVICE IS IN PRODUCTION", 500
            elif len(responses) > 1:
                return "SOME ATOMS ARE DELETED", 200

            return "DELETE SUCCESSFULLY", 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getSiteBySiteName", methods=['GET'])
@token_required
def GetSiteBySiteName(user_data):
    try:
        site_name = request.args.get('site_name')
        siteList = []
        if site_name:
            siteObj = SiteTable.query.filter_by(site_name=site_name).all()
            if siteObj:
                for site in siteObj:
                    siteDataDict = {'site_name': site.site_name, 'region': site.region, 'latitude': site.latitude,
                                    'longitude': site.longitude, 'city': site.city,
                                    'modification_date': site.modification_date,
                                    'creation_date': site.creation_date, 'status': site.status,
                                    'total_count': site.total_count}
                    siteList.append(siteDataDict)
                print(siteList, file=sys.stderr)
                return jsonify(siteList), 200
            else:
                print("Site Data not found in DB", file=sys.stderr)
                return jsonify({'response': "Site Data not found in DB"}), 500
        else:
            print("Can not Get Site Name from URL", file=sys.stderr)
            return jsonify({'response': "Can not Get Site Name from URL"}), 500
    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route("/getRacksByRackName", methods=['GET'])
@token_required
def GetRacksBySiteName(user_data):
    try:
        rack_name = request.args.get('rack_name')
        rackList = []
        if rack_name:
            rackObj = RackTable.query.filter_by(rack_name=rack_name).all()
            if rackObj:
                for rack in rackObj:
                    rackDataDict = {'rack_name': rack.rack_name, 'site_name': rack.site_name,
                                    'serial_number': rack.serial_number,
                                    'manufacturer_date': rack.manufacturer_date,
                                    'unit_position': rack.unit_position, 'creation_date': rack.creation_date,
                                    'modification_date': rack.modification_date, 'status': rack.status,
                                    'ru': rack.ru, 'rfs_date': rack.rfs_date, 'height': rack.height,
                                    'width': rack.width, 'depth': rack.depth, 'pn_code': rack.pn_code,
                                    'rack_model': rack.rack_model, 'floor': rack.floor,
                                    'total_count': rack.total_count}
                    rackList.append(rackDataDict)
                print(rackList, file=sys.stderr)
                return jsonify(rackList), 200
            else:
                print("Rack Data not found in DB", file=sys.stderr)
                return jsonify({'response': "Rack Data not found in DB"}), 500
        else:
            print("Can not Get Site Name from URL", file=sys.stderr)
            return jsonify({'response': "Can not Get Site Name from URL"}), 500
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return str(e), 500


# @app.route('/editAtom', methods=['POST'])
# @token_required
# def EditAtom(user_data):
#     try:
#         atomObj = request.get_json()
#         print(atomObj, file=sys.stderr)
#
#         atom = Atom.query.with_entities(Atom).filter_by(
#             atom_id=atomObj['atom_id']).first()
#         if Phy_Table.query.with_entities(Phy_Table.site_name).filter_by(
#                 site_name=atomObj['site_name']).first() != None and Rack_Table.query.with_entities(
#             Rack_Table.rack_name).filter_by(rack_name=atomObj['rack_name']).first() != None:
#
#             atom.site_name = atomObj['site_name']
#             atom.rack_name = atomObj['rack_name']
#             atom.device_name = atomObj['device_name']
#             # match = re.match(r"[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}", atomObj['ip_address'])
#             # value = (bool(match))
#             # if value:
#             #     atom.ip_address = atomObj['ip_address']
#             # else:
#             #     return "Wrong IP Address",500
#             atom.ip_address = atomObj['ip_address']
#             atom.device_ru = atomObj['device_ru']
#             atom.department = atomObj['department']
#             atom.section = atomObj['section']
#             # atom.criticality = atomObj['criticality']
#             atom.function = atomObj['function']
#             # atom.domain = atomObj['domain']
#             atom.virtual = atomObj['virtual']
#             atom.device_type = atomObj['device_type']
#             atom.password_group = atomObj['password_group']
#             UpdateData(atom)
#             print(
#                 f"Updated Atom with IP ADDRESS {atomObj['ip_address']}", file=sys.stderr)
#             return jsonify({"Response": "Success"}), 200
#         else:
#             print("Rack Name or Site Name does not exists", file=sys.stderr)
#             return jsonify({'response': "Rack Name or Site Name does not Exists"}), 500
#     except Exception as e:
#         traceback.print_exc()
#         print(str(e), file=sys.stderr)
#         return str(e), 500


@app.route("/addPasswordGroup", methods=['POST'])
# @token_required
def AddUser():
    try:
        passObj = request.get_json()
        response, status = addPasswordGroup(passObj, 0)

        print(response, file=sys.stderr)

        return response, status

    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return str(e), 500


@app.route("/addPasswordGroups", methods=['POST'])
@token_required
def AddUsers(user_data):
    try:
        errorList = []
        responseList = []

        passObjs = request.get_json()
        row = 0

        for passObj in passObjs:
            row = row + 1
            response, status = addPasswordGroup(passObj, row)

            if status == 200:
                responseList.append(response)
            else:
                errorList.append(response)

        responseDict = {
            "success": len(responseList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": responseList
        }

        return jsonify(responseDict), 200

    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return str(e), 500


@app.route("/editUser", methods=['POST'])
@token_required
def EditUser(user_data):
    try:
        userObj = request.get_json()
        print(userObj, file=sys.stderr)

        user = PasswordGroupTable.query.with_entities(PasswordGroupTable).filter_by(
            password_group=userObj['password_group']).first()
        print(user, file=sys.stderr)

        if PasswordGroupTable.query.with_entities(PasswordGroupTable.password_group).filter_by(
                password_group=userObj['password_group']):
            user.password_group = userObj['password_group']
            user.username = userObj['username']
            user.password = userObj['password']

            UpdateDBData(user)
            print(
                f"Updated User {userObj['password_group']} SUCCESSFULLY", file=sys.stderr)
            return jsonify({"Response": "Password Group Updated Successfully"}), 200
        else:
            print("Password Group Does not exist", file=sys.stderr)
            return jsonify({"Response": "Password group does not exist"}), 500
    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route('/deletePasswordGroup', methods=['POST'])
@token_required
def DeletePasswordGroup(user_data):
    try:
        responses = []
        response = False
        response1 = False
        response2 = False
        passwordGroups = request.get_json()
        for passwordGroup in passwordGroups:
            queryString = f"select count(*) from atom_table where password_group='{passwordGroup}';"
            queryString1 = f"select count(*) from ipam_devices_table where password_group='{passwordGroup}';"

            result = db.session.execute(queryString).scalar()
            result1 = db.session.execute(queryString1).scalar()
            if result > 0:
                response = 'atom'
                responses.append(response)

            elif result1 > 0:
                response1 = 'ipam'
                responses.append(response1)

            else:

                db.session.execute(
                    f"delete from password_group_table where PASSWORD_GROUP='{passwordGroup}';")
                db.session.commit()
                response2 = 'deleted'
                responses.append(response2)
        responses = set(responses)
        responses = list(responses)
        if len(responses) == 1:
            if responses[0] == 'atom':
                return "Password Group Found in Atom", 500
            elif responses[0] == 'ipam':
                return "Password Group Found in IPAM", 500
            elif responses[0] == 'deleted':
                return "Deleted Successfully", 200
        elif len(responses) == 3:
            return "Some Deleted and Some are Found in IPAM and Atom", 200
        elif len(responses) == 2:
            if 'atom' in responses and 'ipam' in responses:
                return "Password Group Found in Atom and IPAM", 500
            elif 'atom' in responses and 'deleted' in responses:
                return "Some Delete and Some Found in Atom", 200
            elif 'ipam' in responses and 'deleted' in responses:
                return "Some Deleted and Some Found in Atom", 200

    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route("/getPasswordGroups", methods=['GET'])
@token_required
def GetUsers(user_data):
    try:
        userObjList = []
        userObjs = PasswordGroupTable.query.all()

        for userObj in userObjs:
            userDataDict = {'password_group': userObj.password_group, 'username': userObj.username,
                            'password': userObj.password, 'secret_password': userObj.secret_password,
                            'password_group_type': userObj.password_group_type}

            userObjList.append(userDataDict)
        # print(userObjList, file=sys.stderr)
        content = gzip.compress(json.dumps(userObjList).encode('utf8'), 5)
        response = make_response(content)
        response.headers['Content-length'] = len(content)
        response.headers['Content-Encoding'] = 'gzip'
        return response
    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route('/getSitesForDropdown', methods=['GET'])
@token_required
def GetSitesForDropDown(user_data):
    try:

        result = SiteTable.query.all()
        objList = []
        for site in result:
            site_name = site.site_name
            objList.append(site_name)
        print(objList, file=sys.stderr)
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route('/getRacksBySiteDropdown', methods=['GET'])
@token_required
def GetRacksBySiteDropdown(user_data):
    try:
        site_name = request.args.get('site_name')
        objList = []

        result = db.session.query(RackTable, SiteTable) \
            .join(SiteTable, RackTable.site_id == SiteTable.site_id) \
            .filter(SiteTable.site_name == site_name).all()

        for rack, site in result:
            rack_name = rack.rack_name
            objList.append(rack_name)

        print(objList, 200)
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route('/getPasswordGroupDropdown', methods=['GET'])
@token_required
def GetPasswordGroupDropdown(user_data):
    try:

        result = PasswordGroupTable.query.all()
        objList = []
        for password_group in result:
            password_group_name = password_group.password_group
            objList.append(password_group_name)
        print(objList, 200)
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return str(e), 500

#
# @app.route("/onBoardDevice", methods=['POST'])
# @token_required
# def OnBoardDevice(user_data):
#     if True:
#         try:
#             response = False
#
#             responses = []
#             postData = request.get_json()
#             print(postData, file=sys.stderr)
#             # postData = {"ip_address":"3.3.3.3"}
#             objList = []
#             print('Started at: ' +
#                   datetime.now().strftime('%Y-%m-%dT%H:%M:%S'), file=sys.stderr)
#             for ip in postData:
#                 print(ip, file=sys.stderr)
#                 obj = AtomTable.query.with_entities(
#                     AtomTable).filter_by(ip_address=ip).first()
#                 if obj:
#                     objDict = {}
#                     objDict['ip_address'] = obj.ip_address
#                     objDict['device_type'] = obj.device_type
#                     queryString = f"select USERNAME,PASSWORD from password_group_table where password_group='{obj.password_group}';"
#                     result = db.session.execute(queryString)
#                     for row in result:
#                         username = row[0]
#                         password = row[1]
#                         username = username.strip()
#                         password = password.strip()
#                         objDict['username'] = username
#                         objDict['password'] = password
#
#                         objList.append(objDict)
#                     if objDict['device_type'] == 'cisco_ios':
#                         print("IOS device puller started", file=sys.stderr)
#                         pullerIOS = IOSPuller()
#                         response = pullerIOS.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'cisco_ios_xe':
#                         objDict['device_type'] = 'cisco_ios'
#                         print("IOS-XE device puller started", file=sys.stderr)
#                         pullerXE = XEPuller()
#                         response = pullerXE.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'cisco_ios_xr':
#                         objDict['device_type'] = 'cisco_xr'
#                         print("IOS-XR device puller started", file=sys.stderr)
#                         pullerXR = XRPuller()
#                         response = pullerXR.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'cisco_asa':
#                         print("ASA device puller started", file=sys.stderr)
#                         pullerASA = ASAPuller()
#                         # pullerASA96 = ASA96Puller()
#                         response = pullerASA.get_inventory_data(objList)
#                         # response = pullerASA96.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'cisco_nxos':
#                         print("NXOS device puller started", file=sys.stderr)
#                         pullerNXOS = NXOSPuller()
#                         response = pullerNXOS.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'fortinet':
#                         print("Fortinet device puller started", file=sys.stderr)
#                         PullerFortinet = FortinetPuller()
#                         response = PullerFortinet.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'juniper' or objDict['device_type'] == 'juniper_screenos':
#                         objDict['device_type'] = 'juniper'
#                         print("Juniper device puller started", file=sys.stderr)
#                         PullerJuniper = JuniperPuller()
#                         response = PullerJuniper.get_inventory_data(objList)
#                     # elif objDict['device_type'] == 'juniper_screenos':
#                     #     objDict['device'] = 'juniper'
#                     #     print("Juniper ScreenOS puller started", file=sys.stderr)
#                     #     pullerJuniperScreenOS = JuniperScreenosPuller()
#                     #     pullerJuniperScreenOS.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'a10':
#                         print("A10 device puller started", file=sys.stderr)
#                         pullerA10 = A10Puller()
#                         response = pullerA10.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'arbor':
#                         print("Arbor device puller started", file=sys.stderr)
#                         pullerArbor = ArborPuller()
#                         response = pullerArbor.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'arista':
#                         print("Arista device puller started", file=sys.stderr)
#                         pullerArista = AristaPuller()
#                         response = pullerArista.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'fireeye':
#                         print("FireEye device puller started", file=sys.stderr)
#                         pullerFireeye = FireEyePuller()
#                         response = pullerFireeye.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'greatbay':
#                         print("GreatBay device puller started", file=sys.stderr)
#                         pullerGreatBay = PrimePuller()
#                         response = pullerGreatBay.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'infobox':
#                         print("InfoBox device puller started", file=sys.stderr)
#                         pullerInfoBox = InfoboxPuller()
#                         response = pullerInfoBox.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'paloalto':
#                         objDict['device_type'] = 'paloalto_panos'
#                         print("PaloAlto device puller started", file=sys.stderr)
#                         pullerPaloAlto = PaloAltoPuller()
#                         response = pullerPaloAlto.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'prime':
#                         print("Prime device puller started", file=sys.stderr)
#                         pullerPrime = PrimePuller()
#                         response = pullerPrime.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'pulse_secure':
#                         print("PulseSecure device puller started", file=sys.stderr)
#                         pullerPulseSecure = PulseSecurePuller()
#                         response = pullerPulseSecure.get_inventory_data(
#                             objList)
#                     elif objDict['device_type'] == 'ucs':
#                         print("UCS device puller started", file=sys.stderr)
#                         pullerUcs = UCSPuller()
#                         response = pullerUcs.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'wire_filter':
#                         print("WireFilter device puller started", file=sys.stderr)
#                         pullerWireFilter = WirefilterPuller()
#                         response = pullerWireFilter.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'cisco_wlc' or objDict['device_type'] == 'cisco_wlc_ssh':
#                         objDict['device_type'] = 'cisco_wlc_ssh'
#                         print("WLC device puller started", file=sys.stderr)
#                         pullerWlc = WLCPuller()
#                         response = pullerWlc.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'aci':
#                         print("ACI device puller started", file=sys.stderr)
#                         pullerAci = ACIPuller()
#                         response = pullerAci.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'symantec':
#                         print("Symantec device puller started", file=sys.stderr)
#                         pullerSymantec = SymantecPuller()
#                         response = pullerSymantec.get_inventory_data(objList)
#                     elif objDict['device_type'] == 'firepower':
#                         print("FirePower device puller started", file=sys.stderr)
#                         pullerFirePower = FirePowerPuller()
#                         response = pullerFirePower.get_inventory_data(objList)
#                     responses.append(response)
#                     print(
#                         f"THE RESPONSES LIST IS {responses}", file=sys.stderr)
#             Setresponses = set(responses)
#             newResponses = list(Setresponses)
#             print(
#                 f"THE NEW RESPONSES LIST IS {newResponses}", file=sys.stderr)
#             if len(newResponses) > 1:
#                 print("Some Devices are Not Onboarded", file=sys.stderr)
#                 return "Some Devices are Not Onboarded", 200
#             if len(newResponses) == 1:
#
#                 if newResponses[0] == False:
#                     print("Devices Onboarded Successfully", file=sys.stderr)
#                     return "Devices Onboarded Successfully", 200
#                 elif newResponses[0] == True:
#                     print("Error while Onboarding", file=sys.stderr)
#                     return "Error while Onboarding", 500
#                 # print(objList, file=sys.stderr)
#                 # return jsonify(objList), 200
#             else:
#                 "Something Went Wrong", 500
#         except Exception as e:
#             traceback.print_exc()
#             return str(e), 500
#
#     else:
#         print("Service not Available", file=sys.stderr)
#         return jsonify({"Response": "Service not Available"}), 503
#
#
# @app.route("/addDeviceStatically", methods=['POST'])
# @token_required
# def AddDeviceStatically(user_data):
#     # request.headers.get('X-Auth-Key') == session.get('token', None):
#     if True:
#         try:
#             deviceObj = request.get_json()
#
#             print(deviceObj, file=sys.stderr)
#
#             if SiteTable.query.with_entities(SiteTable.site_name).filter_by(
#                     site_name=deviceObj['site_name']).first() != None and RackTable.query.with_entities(
#                 RackTable.rack_name).filter_by(rack_name=deviceObj['rack_name']).first() != None:
#                 device = Device_Table()
#                 device.site_id = deviceObj['site_name']
#                 device.rack_id = deviceObj['rack_name']
#                 atom = Atom.query.filter_by(
#                     ip_address=deviceObj['ip_address']).first()
#                 if not atom:
#                     print(
#                         f"IP ADDRESS {deviceObj['ip_address']} is not in Atom", file=sys.stderr)
#                     return jsonify({'response': "Not in Atom"}), 500
#
#                 atom.onboard_status = 'true'
#                 UpdateData(atom)
#
#                 device.device_name = deviceObj['device_name']
#                 device.ip_address = deviceObj['ip_address']
#
#                 if deviceObj['software_version']:
#                     device.software_version = deviceObj['software_version']
#                 if deviceObj['patch_version']:
#                     device.patch_version = deviceObj['patch_version']
#                 if deviceObj['status']:
#                     device.status = deviceObj['status']
#                 if deviceObj['ru']:
#                     device.ru = deviceObj['ru']
#                 if deviceObj['department']:
#                     device.department = deviceObj['department']
#                 if deviceObj['section']:
#                     device.section = deviceObj['section']
#                 # if deviceObj['criticality']:
#                 #     device.criticality = deviceObj['criticality']
#                 if deviceObj['function']:
#                     device.function = deviceObj['function']
#                 # if deviceObj['domain']:
#                 #     device.cisco_domain = deviceObj['domain']
#                 if deviceObj['manufacturer']:
#                     device.manufacturer = deviceObj['manufacturer']
#                 if deviceObj['hw_eos_date']:
#                     device.hw_eos_date = FormatStringDate(
#                         deviceObj['hw_eos_date'])
#                 if deviceObj['hw_eol_date']:
#                     device.hw_eol_date = FormatStringDate(
#                         deviceObj['hw_eol_date'])
#                 if deviceObj['sw_eos_date']:
#                     device.sw_eos_date = FormatStringDate(
#                         deviceObj['sw_eos_date'])
#                 if deviceObj['sw_eol_date']:
#                     device.sw_eol_date = FormatStringDate(
#                         deviceObj['sw_eol_date'])
#                 if deviceObj['virtual']:
#                     device.virtual = deviceObj['virtual']
#                 if deviceObj['rfs_date']:
#                     device.rfs_date = FormatStringDate(deviceObj['rfs_date'])
#                 if deviceObj['authentication']:
#                     device.authentication = deviceObj['authentication']
#                 if deviceObj['serial_number']:
#                     device.serial_number = deviceObj['serial_number']
#                 if deviceObj['pn_code']:
#                     device.pn_code = deviceObj['pn_code']
#                 if deviceObj['subrack_id_number']:
#                     device.subrack_id_number = deviceObj['subrack_id_number']
#                 if deviceObj['manufacturer_date']:
#                     device.manufacturer_date = FormatStringDate(
#                         deviceObj['manufacturer_date'])
#                 if deviceObj['hardware_version']:
#                     device.hardware_version = deviceObj['hardware_version']
#                 if deviceObj['max_power']:
#                     device.max_power = deviceObj['max_power']
#                 if deviceObj['site_type']:
#                     device.site_type = deviceObj['site_type']
#                 if deviceObj['stack']:
#                     device.stack = deviceObj['stack']
#                 if deviceObj['contract_number']:
#                     device.contract_number = deviceObj['contract_number']
#                 if deviceObj['contract_expiry']:
#                     device.contract_expiry = FormatStringDate(
#                         deviceObj['contract_expiry'])
#                 device.source = 'Static'
#
#                 if Device_Table.query.with_entities(Device_Table.device_name).filter_by(
#                         ip_address=deviceObj['ip_address']).first() is not None:
#                     device.device_name = Device_Table.query.with_entities(
#                         Device_Table.device_name).filter_by(ip_address=deviceObj['ip_address']).first()[0]
#                     print("Updated " +
#                           deviceObj['ip_address'], file=sys.stderr)
#                     device.modification_date = datetime.now()
#                     UpdateData(device)
#
#                 else:
#                     print("Inserted " +
#                           deviceObj['ip_address'], file=sys.stderr)
#                     device.creation_date = datetime.now()
#                     device.modification_date = datetime.now()
#                     InsertData(device)
#
#                 return jsonify({'response': "success", "code": "200"})
#             else:
#                 print("Rack Name or Site Name does not exists", file=sys.stderr)
#                 return jsonify({'response': "Rack Name or Site Name does not Exists"}), 500
#         except Exception as e:
#             traceback.print_exc()
#             return str(e), 500
#
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({'message': 'Authentication Failed'}), 401
#
#
# @app.route("/getSNTC", methods=['GET'])
# @token_required
# def getSntc(user_data):
#     # request.headers.get('X-Auth-Key') == session.get('token', None):
#     if True:
#         sntcList = []
#         queryString = f"select * from sntc_table where PN_CODE!='' and PN_CODE!='N/A';"
#         result = db.session.execute(queryString)
#         for row in result:
#             sntcDataDict = {}
#
#             sntcDataDict['sntc_id'] = row[0]
#             sntcDataDict['pn_code'] = row[1]
#             sntcDataDict['hw_eos_date'] = FormatDate(row[2])
#             sntcDataDict['hw_eol_date'] = FormatDate(row[3])
#             sntcDataDict['sw_eos_date'] = FormatDate(row[4])
#             sntcDataDict['sw_eol_date'] = FormatDate(row[5])
#             sntcDataDict['manufacturer_date'] = FormatDate(row[7])
#             sntcDataDict['creation_date'] = FormatDate(row[8])
#             sntcDataDict['modification_date'] = FormatDate(row[9])
#
#             sntcList.append(sntcDataDict)
#         return jsonify(sntcList), 200
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({'message': 'Authentication Failed'}), 401
#
#
# @app.route("/syncFromInventory", methods=['GET'])
# @token_required
# def SyncFromInventory(user_data):
#     # request.headers.get('X-Auth-Key') == session.get('token', None):
#     if True:
#         queryString = f"SELECT DISTINCT(pn_code) FROM device_table WHERE pn_code NOT IN (SELECT pn_code FROM sntc_table) UNION select distinct(pn_code) from board_table where pn_code not in (select pn_code from sntc_table) UNION select distinct pn_code from subboard_table where pn_code not in (select pn_code from sntc_table) UNION SELECT DISTINCT(pn_code) FROM sfp_table WHERE pn_code NOT IN (SELECT pn_code FROM sntc_table);"
#         result = db.session.execute(queryString)
#
#         print(result, file=sys.stderr)
#
#         for row in result:
#             pn_code = row[0]
#             sntc = SNTC_TABLE()
#
#             sntc.pn_code = pn_code
#
#             if SNTC_TABLE.query.with_entities(SNTC_TABLE.sntc_id).filter_by(pn_code=pn_code).first() is None:
#                 print("Inserted " + pn_code, file=sys.stderr)
#                 sntc.creation_date = datetime.now()
#                 sntc.modification_date = datetime.now()
#                 InsertData(sntc)
#             else:
#                 print("Updated " + pn_code, file=sys.stderr)
#                 sntc.modification_date = datetime.now()
#                 UpdateData(sntc)
#         return ("SUCCESS"), 200
#
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({'message': 'Authentication Failed'}), 401
#
#
# @app.route("/syncToInventory", methods=['GET'])
# @token_required
# def SyncToInventory(user_data):
#     # request.headers.get('X-Auth-Key') == session.get('token', None):
#     if True:
#         try:
#             queryString = "select PN_CODE,HW_EOS_DATE,HW_EOL_DATE,SW_EOS_DATE,SW_EOL_DATE from sntc_table where PN_CODE in (select PN_CODE from device_table);"
#             result = db.session.execute(queryString)
#
#             for row in result:
#                 pn_code = row[0]
#                 hw_eos_date = row[1]
#                 hw_eol_date = row[2]
#                 sw_eos_date = row[3]
#                 sw_eol_date = row[4]
#                 db.session.execute(
#                     f"update device_table set HW_EOS_DATE='{hw_eos_date}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 print('Device Table: HW_EOS_DATE', hw_eos_date, ' against PN CODE',
#                       pn_code, ' updated successfully', file=sys.stderr)
#                 db.session.execute(
#                     f"update device_table set HW_EOL_DATE='{hw_eol_date}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 print('Device Table: HW_EOL_DATE', hw_eol_date, ' against PN CODE',
#                       pn_code, ' updated successfully', file=sys.stderr)
#                 db.session.execute(
#                     f"update device_table set SW_EOS_DATE='{sw_eos_date}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 print('Device Table: SW_EOS_DATE', sw_eos_date, ' against PN CODE',
#                       pn_code, ' updated successfully', file=sys.stderr)
#                 db.session.execute(
#                     f"update device_table set SW_EOL_DATE='{sw_eol_date}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 print('Device Table: SW_EOL_DATE', sw_eol_date, ' against PN CODE',
#                       pn_code, ' updated successfully', file=sys.stderr)
#                 db.session.execute(
#                     f"update device_table set ITEM_DESC='{item_desc}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 # print('Device Table: ITEM_DESC',item_desc,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)
#                 # db.session.execute(f"update device_table set ITEM_CODE='{item_code}' where PN_CODE='{pn_code}';")
#                 # db.session.commit()
#                 # print('Device Table: ITEM_CODE',item_code,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)
#
#             queryString1 = "select PN_CODE,HW_EOS_DATE,HW_EOL_DATE from sntc_table where PN_CODE in (select PN_CODE from board_table);"
#             result1 = db.session.execute(queryString1)
#             for row in result1:
#                 pn_code = row[0]
#                 hw_eos_date = row[1]
#                 hw_eol_date = row[2]
#                 # item_desc = row[3]
#                 # item_code = row[4]
#
#                 db.session.execute(
#                     f"update board_table set EOS_DATE='{hw_eos_date}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 print('Board Table: HW_EOS_DATE', hw_eos_date, ' against PN CODE',
#                       pn_code, ' updated successfully', file=sys.stderr)
#                 db.session.execute(
#                     f"update board_table set EOL_DATE='{hw_eol_date}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 print('Board Table: HW_EOL_DATE', hw_eol_date, ' against PN CODE',
#                       pn_code, ' updated successfully', file=sys.stderr)
#                 db.session.execute(
#                     f"update board_table set ITEM_DESC='{item_desc}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 # print('Board Table: ITEM_DESC',item_desc,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)
#                 # db.session.execute(f"update board_table set ITEM_CODE='{item_code}' where PN_CODE='{pn_code}';")
#                 # db.session.commit()
#                 # print('Board Table: ITEM_CODE',item_code,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)
#
#             queryString2 = "select PN_CODE,HW_EOS_DATE,HW_EOL_DATE from sntc_table where PN_CODE in (select PN_CODE from subboard_table);"
#             result2 = db.session.execute(queryString2)
#             for row in result2:
#                 pn_code = row[0]
#                 hw_eos_date = row[1]
#                 hw_eol_date = row[2]
#                 item_desc = row[3]
#                 item_code = row[4]
#
#                 db.session.execute(
#                     f"update subboard_table set EOS_DATE='{hw_eos_date}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 print('SUbBoard Table: HW_EOS_DATE', hw_eos_date, ' against PN CODE',
#                       pn_code, ' updated successfully', file=sys.stderr)
#                 db.session.execute(
#                     f"update subboard_table set EOL_DATE='{hw_eol_date}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 print('SUbBoard Table: HW_EOL_DATE', hw_eol_date, ' against PN CODE',
#                       pn_code, ' updated successfully', file=sys.stderr)
#                 db.session.execute(
#                     f"update subboard_table set ITEM_DESC='{item_desc}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 # print('SUbBoard Table: ITEM_DESC',item_desc,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)
#                 # db.session.execute(f"update subboard_table set ITEM_CODE='{item_code}' where PN_CODE='{pn_code}';")
#                 # db.session.commit()
#                 # print('SUbBoard Table: ITEM_CODE',item_code,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)
#
#             queryString3 = "select PN_CODE,HW_EOS_DATE,HW_EOL_DATE from sntc_table where PN_CODE in (select PN_CODE from sfp_table);"
#             result3 = db.session.execute(queryString3)
#             for row in result3:
#                 pn_code = row[0]
#                 hw_eos_date = row[1]
#                 hw_eol_date = row[2]
#                 # item_desc = row[3]
#                 # item_code = row[4]
#
#                 db.session.execute(
#                     f"update sfp_table set EOS_DATE='{hw_eos_date}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 print('SFP Table: HW_EOS_DATE', hw_eos_date, ' against PN CODE',
#                       pn_code, ' updated successfully', file=sys.stderr)
#                 db.session.execute(
#                     f"update sfp_table set EOL_DATE='{hw_eol_date}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 print('SFP Table: HW_EOL_DATE', hw_eol_date, ' against PN CODE',
#                       pn_code, ' updated successfully', file=sys.stderr)
#                 db.session.execute(
#                     f"update sfp_table set ITEM_DESC='{item_desc}' where PN_CODE='{pn_code}';")
#                 db.session.commit()
#                 # print('SFP Table: ITEM_DESC',item_desc,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)
#                 # db.session.execute(f"update sfp_table set ITEM_CODE='{item_code}' where PN_CODE='{pn_code}';")
#                 # db.session.commit()
#                 # print('SFP Table: ITEM_CODE',item_code,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)
#
#             return jsonify("Success"), 200
#
#         except Exception as e:
#             print(f"SNTC error occured {e}", file=sys.stderr)
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({'message': 'Authentication Failed'}), 401
#
#
# @app.route('/editSntc', methods=['POST'])
# @token_required
# def EditSntc(user_data):
#     # request.headers.get('X-Auth-Key') == session.get('token', None):
#     if True:
#         sntcObj = request.get_json()
#         print(sntcObj, file=sys.stderr)
#
#         sntc = SNTC_TABLE()
#         sntc.sntc_id = sntcObj['sntc_id']
#         sntc.pn_code = sntcObj['pn_code']
#         sntc.hw_eos_date = FormatStringDate(sntcObj['hw_eos_date'])
#         sntc.hw_eol_date = FormatStringDate(sntcObj['hw_eol_date'])
#         sntc.sw_eos_date = FormatStringDate(sntcObj['sw_eos_date'])
#         sntc.sw_eol_date = FormatStringDate(sntcObj['sw_eol_date'])
#         sntc.manufacturer_date = FormatStringDate(sntcObj['manufacturer_date'])
#         # sntc.item_desc = sntcObj['item_desc']
#         # sntc.item_code = sntcObj['item_code']
#         # sntc.creation_date = FormatStringDate(sntcObj['creation_date'])
#
#         # SNTC_Table.sntc_id = SNTC_Table.query.with_entities(SNTC_Table.sntc_id).filter_by(pn_code=sntcObj['pn_code']).first()[0]
#         print("Updated " + sntcObj['pn_code'], file=sys.stderr)
#         sntc.modification_date = datetime.now()
#         UpdateData(sntc)
#
#         return jsonify({'response': "success", "code": "200"})
#
#     else:
#         print("Authentication Failed", file=sys.stderr)
#
#
# @app.route("/addSNTC", methods=['POST'])
# @token_required
# def AddSntc(user_data):
#     # request.headers.get('X-Auth-Key') == session.get('token', None):
#     if True:
#         postData = request.get_json()
#
#         # print(postData,file=sys.stderr)
#         try:
#
#             for sntcObj in postData:
#
#                 sntc = SNTC_TABLE()
#
#                 print(sntcObj, file=sys.stderr)
#                 sntc.pn_code = sntcObj['pn_code']
#
#                 if 'hw_eos_date' in sntcObj:
#                     if sntcObj['hw_eos_date'] != 'NA':
#                         try:
#                             print(sntcObj['hw_eos_date'], file=sys.stderr)
#                             sntc.hw_eos_date = datetime.strptime(
#                                 (sntcObj['hw_eos_date']), "%d-%m-%Y")
#                         except:
#                             print("Incorrect formatting in hw_eos_date",
#                                   file=sys.stderr)
#                             traceback.print_exc()
#                 if 'hw_eol_date' in sntcObj:
#                     if sntcObj['hw_eol_date'] != 'NA':
#                         try:
#                             sntc.hw_eol_date = datetime.strptime(
#                                 (sntcObj['hw_eol_date']), "%d-%m-%Y")
#                         except:
#                             print("Incorrect formatting in hw_eol_date",
#                                   file=sys.stderr)
#                 if 'sw_eos_date' in sntcObj:
#                     if sntcObj['sw_eos_date'] != 'NA':
#                         try:
#                             sntc.sw_eos_date = datetime.strptime(
#                                 (sntcObj['sw_eos_date']), "%d-%m-%Y")
#                         except:
#                             print("Incorrect formatting in sw_eos_date",
#                                   file=sys.stderr)
#                 if 'sw_eol_date' in sntcObj:
#                     if sntcObj['sw_eol_date'] != 'NA':
#                         try:
#                             sntc.sw_eol_date = datetime.strptime(
#                                 (sntcObj['sw_eol_date']), "%d-%m-%Y")
#                         except:
#                             print("Incorrect formatting in sw_eol_date",
#                                   file=sys.stderr)
#                 if 'manufacturer_date' in sntcObj:
#                     if sntcObj['manufacturer_date'] != 'NA':
#                         try:
#                             sntc.manufacturer_date = datetime.strptime(
#                                 (sntcObj['manufacturer_date']), "%d-%m-%Y")
#                             # print(sntc.manufacture_date, file=sys.stderr)
#                         except:
#                             print("Incorrect formatting in manufactuer_date",
#                                   file=sys.stderr)
#                 # if 'item_desc' in sntcObj:
#                 #      if sntcObj['item_desc'] != 'NA':
#                 #         try:
#                 #             sntc.item_desc =sntcObj['item_desc']
#                 #             #print(sntc.manufacture_date, file=sys.stderr)
#                 #         except:
#                 #             print("Incorrect Value in item description", file=sys.stderr)
#                 # if 'item_code' in sntcObj:
#                 #      if sntcObj['item_code'] != 'NA':
#                 #         try:
#                 #             sntc.item_code =sntcObj['item_code']
#                 #             #print(sntc.manufacture_date, file=sys.stderr)
#                 #         except:
#                 #             print("Incorrect Value in item description", file=sys.stderr)
#
#                 if SNTC_TABLE.query.with_entities(SNTC_TABLE.sntc_id).filter_by(
#                         pn_code=sntcObj['pn_code']).first() is not None:
#                     sntc.sntc_id = SNTC_TABLE.query.with_entities(
#                         SNTC_TABLE.sntc_id).filter_by(pn_code=sntcObj['pn_code']).first()[0]
#                     print("Updated " + sntcObj['pn_code'], file=sys.stderr)
#                     sntc.modification_date = (datetime.now())
#                     UpdateData(sntc)
#                 else:
#                     print("Inserted " + sntcObj['pn_code'], file=sys.stderr)
#                     sntc.creation_date = datetime.now()
#                     sntc.modification_date = datetime.now()
#                     InsertData(sntc)
#
#             return "Data Added/Updated Successfully", 200
#         except Exception as e:
#             traceback.print_exc()
#             return "Failed To Update Data", 500
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({'message': 'Authentication Failed'}), 401
#
#
# @app.route("/deletePnCode", methods=['POST'])
# @token_required
# def DeletePnCode(user_data):
#     if True:  # session.get('token', None):
#         posObj = request.get_json()
#         print(posObj, file=sys.stderr)
#         print(f"PnCode Data received is:  {posObj}", file=sys.stderr)
#
#         for obj in posObj.get("user_ids"):
#             posID = SNTC_TABLE.query.filter(SNTC_TABLE.pn_code == obj).first()
#             print(posID, file=sys.stderr)
#             if obj:
#                 db.session.delete(posID)
#                 db.session.commit()
#         return jsonify({'response': "success", "code": "200"})
#     else:
#         print("Authentication Failed", file=sys.stderr)
#         return jsonify({'message': 'Authentication Failed'}), 401
