from logging import exception
from os import device_encoding
# from tkinter import E
import traceback
from app import app, db

from re import A
from app import app, db
from flask_jsonpify import jsonify
from flask import request, make_response, Response, session
from app.models.inventory_models import *
from flask_jsonpify import jsonify
import pandas as pd
import json
import sys
import time
from datetime import date, datetime
from flask import request, make_response, Response, session
from sqlalchemy import func
#from app.middleware import token_required
from dateutil.relativedelta import relativedelta
import gzip
from flask_cors import CORS, cross_origin
import threading
from app.pullers.IOS.ios_inv import IOSPuller
from app.pullers.NXOS.nxos_inv import NXOSPuller
from app.pullers.IOSXR.ios_xr_inv import XRPuller
from app.pullers.IOSXE.ios_xe_inv import XEPuller
from app.pullers.IOS.ios_inv import IOSPuller
from app.pullers.ACI.aci_inv import ACIPuller
from app.pullers.WLC.cisco_wlc_inv import WLCPuller
from app.pullers.Prime.prime_inv import PrimePuller
from app.pullers.UCS.ucs_cimc_inv import UCSPuller
from app.pullers.A10.a10_inv import A10Puller
from app.pullers.Infoblox.infoblox_inv import InfoboxPuller
from app.pullers.Arista.arista_inv import AristaPuller
from app.pullers.Arbor.arbor_inv import ArborPuller
from app.pullers.IPT.ipt_inv import IPTPuller
from app.pullers.Wirefilter.wirefilter_inv import WirefilterPuller
from app.pullers.Fortinet.fortinet_inv import FortinetPuller
from app.pullers.Juniper.juniper_inv import JuniperPuller
from app.pullers.Juniper_Screenos.juniper_screenos_inv import JuniperScreenosPuller
from app.pullers.ASA.cisco_asa_inv import ASAPuller
from app.pullers.ASA.cisco_asa_inv96 import ASA96Puller
from app.pullers.PaloAlto.palo_alto_inv import PaloAltoPuller
from app.pullers.Pulse_Secure.pulse_secure_inv import PulseSecurePuller
from app.pullers.Symantec.symantec_inv import SymantecPuller
from app.pullers.Fireeye.fireeye_inv import FireEyePuller
from app.pullers.Firepower.firepower_inv import FirePowerPuller
from app.pullers.Firepower.firepower_inv_ssh import FirePowerPullerSSH
from app.middleware import token_required
na = 'N/A'
tbf = 'TBF'
import re
# from backend.atom.app.models.inventory_models import Device_Table


def FormatDate(date):
    #print(date, file=sys.stderr)
    if date is not None:
        result = date.strftime('%d-%m-%Y')
    else:
        #result = datetime(2000, 1, 1)
        result = datetime(1, 1, 2000)

    return result


def InsertData(obj):
    # add data to db
    try:
        db.session.add(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(
            f"Something else went wrong in Database Insertion {e}", file=sys.stderr)
        return False

    return True


def UpdateData(obj):
    # add data to db
    #print(obj, file=sys.stderr)
    try:
        db.session.flush()

        db.session.merge(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(
            f"Something else went wrong during Database Update {e}", file=sys.stderr)

    return True


def FormatStringDate(date):
    print(date, file=sys.stderr)

    try:
        if date is not None:
            if '-' in date:
                result = datetime.strptime(date, '%d-%m-%Y')
            elif '/' in date:
                result = datetime.strptime(date, '%d/%m/%Y')
            else:
                print("incorrect date format", file=sys.stderr)
                result = datetime(2000, 1, 1)
        else:
            #result = datetime(2000, 1, 1)
            result = datetime(2000, 1, 1)
    except:
        result = datetime(2000, 1, 1)
        print("date format exception", file=sys.stderr)

    return result


@app.route("/")
@token_required
def hello(user_data):
    if True:

        try:

            return "Welcome to MonetX", 200
        except Exception as e:
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/addAtomDevice", methods=['POST'])
@token_required
def AddAtomDevice(user_data):
    if True:
        try:
            atomObj = request.get_json()

            if 'site_name' in atomObj:
                if atomObj['site_name']=='':
                    return "Site Name Cannot be Empty",500
            if 'rack_name' in atomObj:
                if atomObj['rack_name']=='':
                    return "Rack Name Cannot be Empty",500
            else:
                return "Rack Name Cannot be Empty",500
            
            # print(atomObj, file=sys.stderr)
            response = False
            if Phy_Table.query.with_entities(Phy_Table.site_name).filter_by(site_name=atomObj['site_name']).first() != None:
                if Rack_Table.query.with_entities(Rack_Table.rack_name).filter_by(rack_name=atomObj['rack_name']).first() != None:
                    if Password_Group_Table.query.with_entities(Password_Group_Table.password_group).filter_by(password_group=atomObj['password_group']).first() != None:
                        atom = Atom()
                        atom.site_name = atomObj['site_name']
                        atom.rack_name = atomObj['rack_name']
                        if (atomObj['device_name']).isnumeric()==True:
                            return "Device Name Cannot be a Number",500
                        else:
                            atom.device_name = atomObj['device_name']
                        
                        # match = re.match(r"[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}", atomObj['ip_address'])
                        # value = (bool(match))
                        # if value:

                        #     atom.ip_address = atomObj['ip_address']
                        
                        # else:
                        #     return "Wrong IP Address",500
                        atom.ip_address = atomObj['ip_address']
                        if 'password_group' in atomObj:
                            atom.password_group = atomObj['password_group']

                        if 'device_ru' in atomObj:
                            atom.device_ru = atomObj['device_ru']
                        else:
                            atom.device_ru = 'N/A'
                        if 'department' in atomObj:
                            atom.department = atomObj['department']
                        else:
                            atom.department = 'N/A'
                        if 'section' in atomObj:
                            atom.section = atomObj['section']
                        else:
                            atom.section = 'N/A'
                        # if 'criticality' in atomObj:
                        #     atom.criticality = atomObj['criticality']
                        # else:
                        #     atom.criticality = 'N/A'
                        if 'function' in atomObj:
                            atom.function = atomObj['function']
                        else:
                            atom.function = 'N/A'
                        # if 'domain' in atomObj:
                        #     atom.domain = atomObj['domain']
                        # else:
                        #     atom.domain = 'N/A'
                        if 'virtual' in atomObj:
                            atom.virtual = atomObj['virtual']
                        else:
                            atom.virtual = atomObj['virtual']
                        if 'device_type' in atomObj:
                            atom.device_type = atomObj['device_type']
                        else:
                            atom.device_type = 'N/A'
                        

                        if Atom.query.with_entities(Atom.ip_address).filter_by(ip_address=atomObj['ip_address']).first() is not None:
                            atom.atom_id = Atom.query.with_entities(Atom.atom_id).filter_by(ip_address=atomObj['ip_address']).first()[0]

                            query = f"Select device_name from atom_table where ip_address != '{atomObj['ip_address']}';"
                            results = db.session.execute(query)
                            deviceList = []
                            for row in results:
                                deviceList.append(row[0])

                            if atomObj['device_name'] in deviceList:
                                return "Device Name Already Exists",500
                            
            

                            UpdateData(atom)
                            print("Updated " + atomObj['ip_address'], file=sys.stderr)
                            
                            queryString = f"select DEVICE_NAME from device_table where IP_ADDRESS='{atomObj['ip_address']}';"
                            result = db.session.execute(queryString)
                            devices = []
                            for row in result:
                                devices.append(row[0])
                            devices = set(devices)
                            devices = list(devices)
                            print(f"DEVICES FROM DEVICE ARE {devices}",file=sys.stderr)
                            for device in devices:

                                queryString = f"update device_table set DEVICE_NAME='{atomObj['device_name']}', `SITE_NAME`='{atomObj['site_name']}', `RACK_NAME`='{atomObj['rack_name']}', `FUNCTION`='{atomObj['function']}', `DEVICE_TYPE`='{atomObj['device_type']}', `DEPARTMENT`='{atomObj['department']}', `RU`='{atomObj['device_ru']}', `SECTION`='{atomObj['section']}' where DEVICE_NAME='{device}';"
                                db.session.execute(queryString)
                                db.session.commit()
                                print(f"UAM Updated Successfully for {atomObj['ip_address']}",file=sys.stderr)
                            
                                # queryString = f"select DEVICE_NAME from board_table where DEVICE_NAME in (select DEVICE_NAME from atom_table where IP_ADDRESS='{atomObj['ip_address']}');"
                                # result = db.session.execute(queryString)
                                # devices = []
                                # for row in result:
                                #     devices.append(row[0])
                                # devices = set(devices)
                                # devices = list(devices)
                                # for device in devices:
                                # queryString = f"update device_table  set `FUNCTION`='{atomObj['function']}' where DEVICE_NAME='{device}';"
                                # result = db.session.execute(queryString)
                                # db.session.commit()
                                # queryString = f"update device_table  set `SITE_NAME`='{atomObj['site_name']}' where DEVICE_NAME='{device}';"
                                # result = db.session.execute(queryString)
                                # db.session.commit()
                                
                                queryString = f"update monitoring_devices_table set `FUNCTION`='{atomObj['function']}' where DEVICE_NAME='{device}';"
                                result = db.session.execute(queryString)
                                db.session.commit()
                                queryString = f"update monitoring_devices_table set `DEVICE_TYPE`='{atomObj['device_type']}' where DEVICE_NAME='{device}';"
                                result = db.session.execute(queryString)
                                db.session.commit()
                                queryString = f"update monitoring_devices_table set `DEVICE_NAME`='{atomObj['device_name']}' where DEVICE_NAME='{device}';"
                                result = db.session.execute(queryString)
                                db.session.commit()

                                queryString=f"update ncm_table set DEVICE_NAME = '{atomObj['device_name']}', DEVICE_TYPE = '{atomObj['device_type']}', `FUNCTION` = '{atomObj['function']}' where DEVICE_NAME='{device}';"
                                db.session.execute(queryString)
                                db.session.commit()

                                queryString = f"update board_table set DEVICE_NAME='{atomObj['device_name']}' where DEVICE_NAME='{device}';"
                                db.session.execute(queryString)
                                db.session.commit()
                                print(f"Board names Updated Successfully for {atomObj['ip_address']}",file=sys.stderr)

                                # queryString = f"select DEVICE_NAME from subboard_table where DEVICE_NAME in (select DEVICE_NAME from atom_table where IP_ADDRESS='{atomObj['ip_address']}');"
                                # result = db.session.execute(queryString)
                                # devices = []
                                # for row in result:
                                #     devices.append(row[0])
                                # devices = set(devices)
                                # devices = list(devices)
                                # for device in devices:

                                queryString = f"update subboard_table set DEVICE_NAME='{atomObj['device_name']}' where DEVICE_NAME='{device}';"
                                db.session.execute(queryString)
                                db.session.commit()
                                print(f"Subboard names Updated Successfully for {atomObj['ip_address']}",file=sys.stderr)

                                # queryString = f"select DEVICE_NAME from sfp_table where DEVICE_NAME in (select DEVICE_NAME from atom_table where IP_ADDRESS='{atomObj['ip_address']}');"
                                # result = db.session.execute(queryString)
                                # devices = []
                                # for row in result:
                                #     devices.append(row[0])
                                # devices = set(devices)
                                # devices = list(devices)
                                # for device in devices:

                                queryString = f"update sfp_table set DEVICE_NAME='{atomObj['device_name']}' where DEVICE_NAME='{device}';"
                                db.session.execute(queryString)
                                db.session.commit()
                                print(f"Sfp names Updated Successfully for {atomObj['ip_address']}",file=sys.stderr)

                                # queryString = f"select DEVICE_NAME from license_table where DEVICE_NAME in (select DEVICE_NAME from atom_table where IP_ADDRESS='{atomObj['ip_address']}');"
                                # result = db.session.execute(queryString)
                                # devices = []
                                # for row in result:
                                #     devices.append(row[0])
                                # devices = set(devices)
                                # devices = list(devices)
                                # for device in devices:

                                queryString = f"update license_table set DEVICE_NAME='{atomObj['device_name']}' where DEVICE_NAME='{device}';"
                                db.session.execute(queryString)
                                db.session.commit()
                                print(f"Licenses names Updated Successfully for {atomObj['ip_address']}",file=sys.stderr)

                                queryString = f"update ipam_devices_table set DEVICE_NAME='{atomObj['device_name']}' where IP_ADDRESS='{atomObj['ip_address']}';"
                                db.session.execute(queryString)
                                db.session.commit()
                                print(f"Device names in IPAM Updated Successfully for {atomObj['ip_address']}",file=sys.stderr)

                                queryString = f"update ipam_devices_table set DEVICE_TYPE='{atomObj['device_type']}' where IP_ADDRESS='{atomObj['ip_address']}';"
                                db.session.execute(queryString)
                                db.session.commit()
                                print(f"DEVICE TYPE in IPAM Updated Successfully for {atomObj['ip_address']}",file=sys.stderr)

                                queryString = f"update ipam_devices_table set PASSWORD_GROUP='{atomObj['password_group']}' where IP_ADDRESS='{atomObj['ip_address']}';"
                                db.session.execute(queryString)
                                db.session.commit()
                                print(f"PASSWORD GROUP in IPAM Updated Successfully for {atomObj['ip_address']}",file=sys.stderr)
                                queryString = f"update ipam_devices_fetch_table set DEVICE_NAME='{atomObj['device_name']}' where DEVICE_NAME='{device}';"
                                db.session.execute(queryString)
                                db.session.commit()
                                print(f"Device names in IPAM Fetch Updated Successfully for {atomObj['ip_address']}",file=sys.stderr)

                                
                            response = True
                        else:

                            if Atom.query.with_entities(Atom.device_name).filter_by(device_name=atomObj['device_name']).first() is not None:
                                print("Error: Device Name Already Exists",file=sys.stderr)
                                return jsonify ({"Response": "Device Name Already Exists"}), 500

                            print("Inserted ",
                                  atomObj['ip_address'], file=sys.stderr)
                          
                            atom.onboard_status = 'False'
                            response = InsertData(atom)

                    else:
                        print("Password Group does not exist", file=sys.stderr)
                        return jsonify({"Response": "Password Group does not exist"}), 500
                else:
                    print("Rack Name does not exist", file=sys.stderr)
                    return jsonify({"Response": "Rack Name does not exist"}), 500

            else:
                print("Site name does not exist", file=sys.stderr)
                return jsonify({"Response": "Site name does not exist"}), 500

        except Exception as e:
            
            traceback.print_exc()
            print(str(e))

            if type(e).__name__ == "IntegrityError":
                # return jsonify({"Response": "Error: Unable to Add/Update in database"}),500
                return "Duplicate Entry Found",500
            
            return jsonify({"Response": "Error: Unable to Add/Update in database"}),500
        
        if response == True:
            return jsonify({"Response": "Atom Added/Updated Successfully"}), 200
        else:
            return jsonify({"Response": "Error: Unable to Add/Update in database"}), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/addAtomDevices", methods=['POST'])
@token_required
def AddAtomDevices(user_data):
    errorList=[]
    responseList=[]
    if True:
        try:
            atomObjs = request.get_json()
            # print(atomObjs, file=sys.stderr)
            row = 0
            for atomObj in atomObjs:
                row = row + 1

                if  'ip_address' not in atomObj:
                    error = f"Row {row} : Ip Address Cannot be Empty"
                    errorList.append(error)
                    continue

                if  'device_name' not in atomObj:
                    error = f"{atomObj['ip_address']} : Device Name Cannot be Empty"
                    errorList.append(error)
                    continue

                if  'device_type' not in atomObj:
                    error = f"{atomObj['ip_address']} : Device Type Cannot be Empty"
                    errorList.append(error)
                    continue
                else:
                    if atomObj['device_type']=='':
                        error = f"{atomObj['ip_address']} : Device Type Cannot be Empty"
                        errorList.append(error)
                        continue

                # Site Check
                if  'site_name' not in atomObj:
                    error = f"{atomObj['ip_address']} : Site Name Cannot be Empty"
                    errorList.append(error)
                    continue
                else:
                    if atomObj['site_name']=='':
                        error = f"{atomObj['ip_address']} : Site Name Cannot be Empty"
                        errorList.append(error)
                        continue
                    else:
                        if Phy_Table.query.with_entities(Phy_Table.site_name).filter_by(site_name=atomObj['site_name']).first() == None:
                            error = f"{atomObj['ip_address']} : Site Name Does Not Exists"
                            errorList.append(error)
                            continue
                
                # Rack Check
                if 'rack_name' not in atomObj:
                    error = f"{atomObj['ip_address']} : Rack Name Cannot be Empty"
                    errorList.append(error)
                    continue
                else:
                    if atomObj['rack_name']=='':
                        error = f"{atomObj['ip_address']} : Rack Name Cannot be Empty"
                        errorList.append(error)
                        continue
                    else:
                        if Rack_Table.query.with_entities(Rack_Table.rack_name).filter_by(rack_name=atomObj['rack_name'], site_name=atomObj['site_name']).first() == None:
                            error = f"{atomObj['ip_address']} : Rack Name And Site Name Does Not Match"
                            errorList.append(error)
                            continue

                    
                if  'password_group' not in atomObj:
                    error = f"{atomObj['ip_address']} : Password Group Cannot be Empty"
                    errorList.append(error)
                    continue
                else:
                    if Password_Group_Table.query.with_entities(Password_Group_Table.password_group).filter_by(password_group=atomObj['password_group']).first() ==None:
                        error = f"{atomObj['ip_address']} : Password Group Does Not Exist"
                        errorList.append(error)
                        continue
                
                
                atom = Atom()
                atom.site_name = atomObj['site_name']
                atom.rack_name = atomObj['rack_name']
                atom.device_name = atomObj['device_name']
                atom.ip_address = atomObj['ip_address']
                atom.password_group = atomObj['password_group']
                if 'device_ru' in atomObj:
                    atom.device_ru = atomObj['device_ru']
                else:
                    atom.device_ru = 'N/A'
                if 'department' in atomObj:
                    atom.department = atomObj['department']
                else:
                    atom.department = 'N/A'
                if 'section' in atomObj:
                    atom.section = atomObj['section']
                else:
                    atom.section = 'N/A'
        
                if 'function' in atomObj:
                    atom.function = atomObj['function']
                else:
                    atom.function = 'N/A'
                
                if 'virtual' in atomObj:
                    atom.virtual = atomObj['virtual']
                else:
                    atom.virtual = 'N/A'
                
                atom.device_type = atomObj['device_type']
                if 'onboard_status' in atomObj:
                    atom.onboard_status = atomObj['onboard_status']

                
                if Atom.query.with_entities(Atom.atom_id).filter_by(ip_address=atomObj['ip_address']).first() is not None:
                    atom.atom_id = Atom.query.with_entities(Atom.atom_id).filter_by(ip_address=atomObj['ip_address']).first()[0]
                    UpdateData(atom)
                    response = f"{atomObj['ip_address']} : Updated Successfully"
                    print(response)
                    responseList.append(response)

                else:
                    InsertData(atom)
                    response = f"{atomObj['ip_address']} : Inserted Successfully"
                    print(response)
                    responseList.append(response) 
            
            responseDict = {
                "success":len(responseList),
                "error":len(errorList),
                "error_list":errorList,
                "success_list":responseList
            }

            return jsonify(responseDict),200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAtoms", methods=['GET'])
@token_required
def GetAtoms(user_data):
    if True:
        try:
            atomObjList = []
            atomObjs = Atom.query.all()

            for atomObj in atomObjs:
                atomDataDict = {}
                atomDataDict['atom_id'] = atomObj.atom_id
                atomDataDict['site_name'] = atomObj.site_name
                atomDataDict['rack_name'] = atomObj.rack_name
                atomDataDict['device_name'] = atomObj.device_name
                atomDataDict['ip_address'] = atomObj.ip_address
                atomDataDict['device_ru'] = atomObj.device_ru
                atomDataDict['department'] = atomObj.department
                atomDataDict['section'] = atomObj.section
                # atomDataDict['criticality'] = atomObj.criticality
                atomDataDict['function'] = atomObj.function
                # atomDataDict['domain'] = atomObj.domain
                atomDataDict['virtual'] = atomObj.virtual
                atomDataDict['device_type'] = atomObj.device_type
                atomDataDict['password_group'] = atomObj.password_group
                if atomObj.onboard_status=='' or atomObj.onboard_status!=None: 
                    atomDataDict['onboard_status'] = atomObj.onboard_status
                else:
                    atomDataDict['onboard_status'] = 'False'

                atomDataDict['updated'] = atomObj.updated
                atomDataDict['inserted'] = atomObj.inserted
                atomDataDict['exception'] = atomObj.exception
                atomObjList.append(atomDataDict)
            # print(atomObjList, file=sys.stderr)
            content = gzip.compress(json.dumps(atomObjList).encode('utf8'), 5)
            response = make_response(content)
            response.headers['Content-length'] = len(content)
            response.headers['Content-Encoding'] = 'gzip'
            return response

        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/deleteAtom', methods=['POST'])
@token_required
def DeleteAtom(user_data):
    if True:
        try:
            ips = request.get_json()
            ipList  = []
            deletionResponse = False
            errorResponse = False
            responses = []
            queryString = "select IP_ADDRESS from device_table;"
            result = db.session.execute(queryString)
            for row in result:
                ipList.append(row[0])
            
            for ip in ips:
                if ip in ipList:
                    queryString=f"select STATUS from device_table where IP_ADDRESS='{ip}';"
                    result = db.session.execute(queryString)
                    for row in result:
                        if row[0]=='Dismantled':
                            
                            queryString = f"delete from atom_table where ip_address='{ip}';"
                            db.session.execute(queryString)
                            db.session.commit()
                            queryString = f"delete from device_table where ip_address='{ip}';"
                            db.session.execute(queryString)
                            db.session.commit()
                            deletionResponse = 'deletionResponse'
                            responses.append(deletionResponse)
                        if row[0]=='Production':
                            errorResponse='errorResponse'
                            responses.append(errorResponse)
                else:
                    queryString = f"delete from atom_table where ip_address='{ip}';"
                    db.session.execute(queryString)
                    db.session.commit()
                    deletionResponse = 'deletionResponse'
                    responses.append(deletionResponse)
            responses = set(responses)
            responses = list(responses)
            if len(responses)==1:
                if responses[0]=='deletionResponse':
                    return "ATOMS DELETED SUCCESSFULLY",200
                if responses[0]=='errorResponse':
                    return "ERROR! DEVICE IS IN PRODUCTION",500
            elif len(responses)>1:
                return "SOME ATOMS ARE DELETED",200


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
    if True:
        try:
            site_name = request.args.get('site_name')
            siteList = []
            if site_name:
                siteObj = Phy_Table.query.filter_by(site_name=site_name).all()
                if siteObj:
                    for site in siteObj:
                        siteDataDict = {}
                        siteDataDict['site_name'] = site.site_name
                        siteDataDict['region'] = site.region
                        siteDataDict['latitude'] = site.latitude
                        siteDataDict['longitude'] = site.longitude
                        siteDataDict['city'] = site.city
                        siteDataDict['modification_date'] = site.modification_date
                        siteDataDict['creation_date'] = site.creation_date
                        siteDataDict['status'] = site.status
                        siteDataDict['total_count'] = site.total_count
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
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getRacksByRackName", methods=['GET'])
@token_required
def GetRacksBySiteName(user_data):
    if True:
        try:
            rack_name = request.args.get('rack_name')
            rackList = []
            if rack_name:
                rackObj = Rack_Table.query.filter_by(rack_name=rack_name).all()
                if rackObj:
                    for rack in rackObj:
                        rackDataDict = {}
                        rackDataDict['rack_name'] = rack.rack_name
                        rackDataDict['site_name'] = rack.site_name
                        rackDataDict['serial_number'] = rack.serial_number
                        rackDataDict['manufacturer_date'] = rack.manufacturer_date
                        rackDataDict['unit_position'] = rack.unit_position
                        rackDataDict['creation_date'] = rack.creation_date
                        rackDataDict['modification_date'] = rack.modification_date
                        rackDataDict['status'] = rack.status
                        rackDataDict['ru'] = rack.ru
                        rackDataDict['rfs_date'] = rack.rfs_date
                        rackDataDict['height'] = rack.height
                        rackDataDict['width'] = rack.width
                        rackDataDict['depth'] = rack.depth
                        rackDataDict['pn_code'] = rack.pn_code
                        rackDataDict['rack_model'] = rack.rack_model
                        rackDataDict['floor'] = rack.floor
                        rackDataDict['total_count'] = rack.total_count
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
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/editAtom', methods=['POST'])
@token_required
def EditAtom(user_data):
    if True:
        try:
            atomObj = request.get_json()
            print(atomObj, file=sys.stderr)

            atom = Atom.query.with_entities(Atom).filter_by(
                atom_id=atomObj['atom_id']).first()
            if Phy_Table.query.with_entities(Phy_Table.site_name).filter_by(site_name=atomObj['site_name']).first() != None and Rack_Table.query.with_entities(Rack_Table.rack_name).filter_by(rack_name=atomObj['rack_name']).first() != None:

                atom.site_name = atomObj['site_name']
                atom.rack_name = atomObj['rack_name']
                atom.device_name = atomObj['device_name']
                # match = re.match(r"[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}", atomObj['ip_address'])
                # value = (bool(match))
                # if value:
                #     atom.ip_address = atomObj['ip_address']
                # else:
                #     return "Wrong IP Address",500
                atom.ip_address = atomObj['ip_address']
                atom.device_ru = atomObj['device_ru']
                atom.department = atomObj['department']
                atom.section = atomObj['section']
                # atom.criticality = atomObj['criticality']
                atom.function = atomObj['function']
                # atom.domain = atomObj['domain']
                atom.virtual = atomObj['virtual']
                atom.device_type = atomObj['device_type']
                atom.password_group = atomObj['password_group']
                UpdateData(atom)
                print(
                    f"Updated Atom with IP ADDRESS {atomObj['ip_address']}", file=sys.stderr)
                return jsonify({"Response": "Success"}), 200
            else:
                print("Rack Name or Site Name does not exists", file=sys.stderr)
                return jsonify({'response': "Rack Name or Site Name does not Exists"}), 500
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/addUser", methods=['POST'])
@token_required
def AddUser(user_data):
    if True:
        try:
            response = False
            response1 = False
            responses = []
            password_groups = []
            userObj = request.get_json()
            user = Password_Group_Table()
            user.password_group = userObj['password_group']
            user.username = userObj['username']
            user.password = userObj['password']
            queryString = f"select PASSWORD_GROUP from password_group_table;"
            result = db.session.execute(queryString)
            for row in result:
                password_groups.append((row[0]).lower())
            if (userObj['password_group']).lower() in password_groups:
                response='response'
                responses.append(response)
                # return "Password Group is Duplicate",500
            else:
                InsertData(user)
                response='response1'
                responses.append(response)
                print(userObj['username']+" Added Successfully", file=sys.stderr)
                # return "Password Group Added Successfully", 200
            
            responses1 = set(responses)
            responses = list(responses1)
            print(f"%%%%%%RESPONSES ARE {responses}",file=sys.stderr)
            if True or False in responses:
                pass
            if len(responses)==1:
                if responses[0]=='response':
                    print(f"Password Groups are Duplicate",file=sys.stderr)
                    return "Password Group is Duplicate",500
                elif responses[0]=='response1':
                    print(f"Password Groups Inserted Successfully",file=sys.stderr)
                    return "Password Group Added Successfully", 200
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/addUsers", methods=['POST'])
@token_required
def AddUsers(user_data):
    if True:
        response = False
        response1 = False
        password_groups = []
        responses = []
        try:
            userObjs = request.get_json()
            for userObj in userObjs:
                user = Password_Group_Table()
                user.password_group = userObj['password_group']
                user.username = userObj['username']
                user.password = userObj['password']
                queryString = f"select PASSWORD_GROUP from password_group_table;"
                result = db.session.execute(queryString)
                for row in result:
                    password_groups.append((row[0]).lower())
                if (userObj['password_group']).lower() in password_groups:
                    response = 'response'
                    responses.append(response)
                    # return "Password Group is Duplicate",500
                elif userObj['password_group'] not in password_groups:
                    InsertData(user)
                    print(userObj['username'] +" Added Successfully", file=sys.stderr)
                    response1 = 'response1'
                    responses.append(response1)
                # return jsonify({"Response": "Success"}), 200
            
            responses1 = set(responses)
            responses = list(responses1)
            print(f"%%%%%%RESPONSES ARE {responses}",file=sys.stderr)
            if True or False in responses:
                pass
            if len(responses)==1:
                if responses[0]=='response':
                    print(f"Password Groups are Duplicate",file=sys.stderr)
                    return "Password Groups are Duplicate", 500
                elif responses[0]=='response1':
                    print(f"Password Groups Inserted Successfully",file=sys.stderr)
                    return "Password Groups Inserted Successfully",200
            elif len(responses)>1:
                print(f"Some Password Groups are Duplicates",file=sys.stderr)
                return "Some Password Groups are Duplicates", 200
            else:
                print(f"RETURNED SOMETHING WENT WRONG",file=sys.stderr)
                return "SOMETHING WENT WRONG",500
        except Exception as e:
            traceback.print_exc()
            print(str(e), file=sys.stderr)
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/editUser", methods=['POST'])
@token_required
def EditUser(user_data):
    if True:
        try:
            userObj = request.get_json()
            print(userObj, file=sys.stderr)

            user = Password_Group_Table.query.with_entities(Password_Group_Table).filter_by(
                password_group=userObj['password_group']).first()
            print(user, file=sys.stderr)

            if Password_Group_Table.query.with_entities(Password_Group_Table.password_group).filter_by(password_group=userObj['password_group']):
                user.password_group = userObj['password_group']
                user.username = userObj['username']
                user.password = userObj['password']

                UpdateData(user)
                print(
                    f"Updated User {userObj['password_group']} SUCCESSFULLY", file=sys.stderr)
                return jsonify({"Response": "Password Group Updated Successfully"}), 200
            else:
                print("Password Group Does not exist", file=sys.stderr)
                return jsonify({"Response": "Password group does not exist"}), 500
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/deletePasswordGroup', methods=['POST'])
@token_required
def DeletePasswordGroup(user_data):
    if True:
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
            if len(responses)==1:
                if responses[0]=='atom':
                    return "Password Group Found in Atom", 500
                elif responses[0]=='ipam':
                    return "Password Group Found in IPAM", 500
                elif responses[0]=='deleted':
                    return "Deleted Successfully", 200
            elif len(responses)==3:
                return "Some Deleted and Some are Found in IPAM and Atom",200
            elif len(responses)==2:
                if 'atom' in responses and 'ipam' in responses:
                    return "Password Group Found in Atom and IPAM",500
                elif 'atom' in responses and 'deleted' in responses:
                    return "Some Delete and Some Found in Atom",200
                elif 'ipam' in responses and 'deleted' in responses:
                    return "Some Deleted and Some Found in Atom",200

        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getUsers", methods=['GET'])
@token_required
def GetUsers(user_data):
    if True:
        try:
            userObjList = []
            userObjs = Password_Group_Table.query.all()

            for userObj in userObjs:
                userDataDict = {}
                userDataDict['password_group'] = userObj.password_group
                userDataDict['username'] = userObj.username
                userDataDict['password'] = userObj.password

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
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/getSitesForDropdown', methods=['GET'])
@token_required
def GetSitesForDropDown(user_data):
    if True:
        try:
            queryString = f"select SITE_NAME from phy_table;"
            result = db.session.execute(queryString)
            objList = []
            for row in result:
                site_name = row[0]
                objList.append(site_name)
            print(objList, file=sys.stderr)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/getRacksBySiteDropdown', methods=['GET'])
@token_required
def GetRacksBySiteDropdown(user_data):
    if True:
        try:
            site_name = request.args.get('site_name')
            objList = []
            queryString = f"select RACK_NAME from rack_table where SITE_NAME='{site_name}';"
            result = db.session.execute(queryString)
            for row in result:
                rack = row[0]
                objList.append(rack)
            print(objList, 200)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/getPasswordGroupDropdown', methods=['GET'])
@token_required
def GetPasswordGroupDropdown(user_data):
    if True:
        try:
            queryString = f"select PASSWORD_GROUP from password_group_table;"
            objList = []
            result = db.session.execute(queryString)
            for row in result:
                password_group = row[0]
                objList.append(password_group)
            print(objList, 200)
            return jsonify(objList), 200
        except Exception as e:
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/onBoardDevice", methods=['POST'])
@token_required
def OnBoardDevice(user_data):
    if True:
        try:
            response = False

            responses = []
            postData = request.get_json()
            print(postData, file=sys.stderr)
            # postData = {"ip_address":"3.3.3.3"}
            objList = []
            print('Started at: ' +
                  datetime.now().strftime('%Y-%m-%dT%H:%M:%S'), file=sys.stderr)
            for ip in postData:
                print(ip, file=sys.stderr)
                obj = Atom.query.with_entities(
                    Atom).filter_by(ip_address=ip).first()
                if obj:
                    objDict = {}
                    objDict['ip_address'] = obj.ip_address
                    objDict['device_type'] = obj.device_type
                    queryString = f"select USERNAME,PASSWORD from password_group_table where password_group='{obj.password_group}';"
                    result = db.session.execute(queryString)
                    for row in result:
                        username = row[0]
                        password = row[1]
                        username = username.strip()
                        password = password.strip()
                        objDict['username'] = username
                        objDict['password'] = password

                        objList.append(objDict)
                    if objDict['device_type'] == 'cisco_ios':
                        print("IOS device puller started", file=sys.stderr)
                        pullerIOS = IOSPuller()
                        response = pullerIOS.get_inventory_data(objList)
                    elif objDict['device_type'] == 'cisco_ios_xe':
                        objDict['device_type'] = 'cisco_ios'
                        print("IOS-XE device puller started", file=sys.stderr)
                        pullerXE = XEPuller()
                        response = pullerXE.get_inventory_data(objList)
                    elif objDict['device_type'] == 'cisco_ios_xr':
                        objDict['device_type'] = 'cisco_xr'
                        print("IOS-XR device puller started", file=sys.stderr)
                        pullerXR = XRPuller()
                        response = pullerXR.get_inventory_data(objList)
                    elif objDict['device_type'] == 'cisco_asa':
                        print("ASA device puller started", file=sys.stderr)
                        pullerASA = ASAPuller()
                        # pullerASA96 = ASA96Puller()
                        response = pullerASA.get_inventory_data(objList)
                        # response = pullerASA96.get_inventory_data(objList)
                    elif objDict['device_type'] == 'cisco_nxos':
                        print("NXOS device puller started", file=sys.stderr)
                        pullerNXOS = NXOSPuller()
                        response = pullerNXOS.get_inventory_data(objList)
                    elif objDict['device_type'] == 'fortinet':
                        print("Fortinet device puller started", file=sys.stderr)
                        PullerFortinet = FortinetPuller()
                        response = PullerFortinet.get_inventory_data(objList)
                    elif objDict['device_type'] == 'juniper' or objDict['device_type'] == 'juniper_screenos':
                        objDict['device_type'] = 'juniper'
                        print("Juniper device puller started", file=sys.stderr)
                        PullerJuniper = JuniperPuller()
                        response = PullerJuniper.get_inventory_data(objList)
                    # elif objDict['device_type'] == 'juniper_screenos':
                    #     objDict['device'] = 'juniper'
                    #     print("Juniper ScreenOS puller started", file=sys.stderr)
                    #     pullerJuniperScreenOS = JuniperScreenosPuller()
                    #     pullerJuniperScreenOS.get_inventory_data(objList)
                    elif objDict['device_type'] == 'a10':
                        print("A10 device puller started", file=sys.stderr)
                        pullerA10 = A10Puller()
                        response = pullerA10.get_inventory_data(objList)
                    elif objDict['device_type'] == 'arbor':
                        print("Arbor device puller started", file=sys.stderr)
                        pullerArbor = ArborPuller()
                        response = pullerArbor.get_inventory_data(objList)
                    elif objDict['device_type'] == 'arista':
                        print("Arista device puller started", file=sys.stderr)
                        pullerArista = AristaPuller()
                        response = pullerArista.get_inventory_data(objList)
                    elif objDict['device_type'] == 'fireeye':
                        print("FireEye device puller started", file=sys.stderr)
                        pullerFireeye = FireEyePuller()
                        response = pullerFireeye.get_inventory_data(objList)
                    elif objDict['device_type'] == 'greatbay':
                        print("GreatBay device puller started", file=sys.stderr)
                        pullerGreatBay = PrimePuller()
                        response = pullerGreatBay.get_inventory_data(objList)
                    elif objDict['device_type'] == 'infobox':
                        print("InfoBox device puller started", file=sys.stderr)
                        pullerInfoBox = InfoboxPuller()
                        response = pullerInfoBox.get_inventory_data(objList)
                    elif objDict['device_type'] == 'paloalto':
                        objDict['device_type'] = 'paloalto_panos'
                        print("PaloAlto device puller started", file=sys.stderr)
                        pullerPaloAlto = PaloAltoPuller()
                        response = pullerPaloAlto.get_inventory_data(objList)
                    elif objDict['device_type'] == 'prime':
                        print("Prime device puller started", file=sys.stderr)
                        pullerPrime = PrimePuller()
                        response = pullerPrime.get_inventory_data(objList)
                    elif objDict['device_type'] == 'pulse_secure':
                        print("PulseSecure device puller started", file=sys.stderr)
                        pullerPulseSecure = PulseSecurePuller()
                        response = pullerPulseSecure.get_inventory_data(
                            objList)
                    elif objDict['device_type'] == 'ucs':
                        print("UCS device puller started", file=sys.stderr)
                        pullerUcs = UCSPuller()
                        response = pullerUcs.get_inventory_data(objList)
                    elif objDict['device_type'] == 'wire_filter':
                        print("WireFilter device puller started", file=sys.stderr)
                        pullerWireFilter = WirefilterPuller()
                        response = pullerWireFilter.get_inventory_data(objList)
                    elif objDict['device_type'] == 'cisco_wlc' or objDict['device_type'] == 'cisco_wlc_ssh':
                        objDict['device_type'] = 'cisco_wlc_ssh'
                        print("WLC device puller started", file=sys.stderr)
                        pullerWlc = WLCPuller()
                        response = pullerWlc.get_inventory_data(objList)
                    elif objDict['device_type'] == 'aci':
                        print("ACI device puller started", file=sys.stderr)
                        pullerAci = ACIPuller()
                        response = pullerAci.get_inventory_data(objList)
                    elif objDict['device_type'] == 'symantec':
                        print("Symantec device puller started", file=sys.stderr)
                        pullerSymantec = SymantecPuller()
                        response = pullerSymantec.get_inventory_data(objList)
                    elif objDict['device_type'] == 'firepower':
                        print("FirePower device puller started", file=sys.stderr)
                        pullerFirePower = FirePowerPuller()
                        response = pullerFirePower.get_inventory_data(objList)
                    responses.append(response)
                    print(
                        f"THE RESPONSES LIST IS {responses}", file=sys.stderr)
            Setresponses = set(responses)
            newResponses = list(Setresponses)
            print(
                        f"THE NEW RESPONSES LIST IS {newResponses}", file=sys.stderr)
            if len(newResponses) > 1:
                print("Some Devices are Not Onboarded", file=sys.stderr)
                return "Some Devices are Not Onboarded", 200
            if len(newResponses)==1:

                if newResponses[0] == False:
                    print("Devices Onboarded Successfully", file=sys.stderr)
                    return "Devices Onboarded Successfully", 200
                elif newResponses[0] == True:
                    print("Error while Onboarding", file=sys.stderr)
                    return "Error while Onboarding", 500
                # print(objList, file=sys.stderr)
                # return jsonify(objList), 200
            else:
                "Something Went Wrong", 500
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/addDeviceStatically", methods=['POST'])
@token_required
def AddDeviceStatically(user_data):

    # request.headers.get('X-Auth-Key') == session.get('token', None):
    if True:
        try:
            deviceObj = request.get_json()

            print(deviceObj, file=sys.stderr)

            if Phy_Table.query.with_entities(Phy_Table.site_name).filter_by(site_name=deviceObj['site_name']).first() != None and Rack_Table.query.with_entities(Rack_Table.rack_name).filter_by(rack_name=deviceObj['rack_name']).first() != None:
                device = Device_Table()
                device.site_id = deviceObj['site_name']
                device.rack_id = deviceObj['rack_name']
                atom = Atom.query.filter_by(
                    ip_address=deviceObj['ip_address']).first()
                if not atom:
                    print(
                        f"IP ADDRESS {deviceObj['ip_address']} is not in Atom", file=sys.stderr)
                    return jsonify({'response': "Not in Atom"}), 500

                atom.onboard_status = 'true'
                UpdateData(atom)

                device.device_name = deviceObj['device_name']
                device.ip_address = deviceObj['ip_address']

                if deviceObj['software_version']:
                    device.software_version = deviceObj['software_version']
                if deviceObj['patch_version']:
                    device.patch_version = deviceObj['patch_version']
                if deviceObj['status']:
                    device.status = deviceObj['status']
                if deviceObj['ru']:
                    device.ru = deviceObj['ru']
                if deviceObj['department']:
                    device.department = deviceObj['department']
                if deviceObj['section']:
                    device.section = deviceObj['section']
                # if deviceObj['criticality']:
                #     device.criticality = deviceObj['criticality']
                if deviceObj['function']:
                    device.function = deviceObj['function']
                # if deviceObj['domain']:
                #     device.cisco_domain = deviceObj['domain']
                if deviceObj['manufacturer']:
                    device.manufacturer = deviceObj['manufacturer']
                if deviceObj['hw_eos_date']:
                    device.hw_eos_date = FormatStringDate(
                        deviceObj['hw_eos_date'])
                if deviceObj['hw_eol_date']:
                    device.hw_eol_date = FormatStringDate(
                        deviceObj['hw_eol_date'])
                if deviceObj['sw_eos_date']:
                    device.sw_eos_date = FormatStringDate(
                        deviceObj['sw_eos_date'])
                if deviceObj['sw_eol_date']:
                    device.sw_eol_date = FormatStringDate(
                        deviceObj['sw_eol_date'])
                if deviceObj['virtual']:
                    device.virtual = deviceObj['virtual']
                if deviceObj['rfs_date']:
                    device.rfs_date = FormatStringDate(deviceObj['rfs_date'])
                if deviceObj['authentication']:
                    device.authentication = deviceObj['authentication']
                if deviceObj['serial_number']:
                    device.serial_number = deviceObj['serial_number']
                if deviceObj['pn_code']:
                    device.pn_code = deviceObj['pn_code']
                if deviceObj['subrack_id_number']:
                    device.subrack_id_number = deviceObj['subrack_id_number']
                if deviceObj['manufacturer_date']:
                    device.manufacturer_date = FormatStringDate(
                        deviceObj['manufacturer_date'])
                if deviceObj['hardware_version']:
                    device.hardware_version = deviceObj['hardware_version']
                if deviceObj['max_power']:
                    device.max_power = deviceObj['max_power']
                if deviceObj['site_type']:
                    device.site_type = deviceObj['site_type']
                if deviceObj['stack']:
                    device.stack = deviceObj['stack']
                if deviceObj['contract_number']:
                    device.contract_number = deviceObj['contract_number']
                if deviceObj['contract_expiry']:
                    device.contract_expiry = FormatStringDate(
                        deviceObj['contract_expiry'])
                device.source = 'Static'

                if Device_Table.query.with_entities(Device_Table.device_name).filter_by(ip_address=deviceObj['ip_address']).first() is not None:
                    device.device_name = Device_Table.query.with_entities(
                        Device_Table.device_name).filter_by(ip_address=deviceObj['ip_address']).first()[0]
                    print("Updated " +
                          deviceObj['ip_address'], file=sys.stderr)
                    device.modification_date = datetime.now()
                    UpdateData(device)

                else:
                    print("Inserted " +
                          deviceObj['ip_address'], file=sys.stderr)
                    device.creation_date = datetime.now()
                    device.modification_date = datetime.now()
                    InsertData(device)

                return jsonify({'response': "success", "code": "200"})
            else:
                print("Rack Name or Site Name does not exists", file=sys.stderr)
                return jsonify({'response': "Rack Name or Site Name does not Exists"}), 500
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route("/getSNTC", methods=['GET'])
@token_required
def getSntc(user_data):
    # request.headers.get('X-Auth-Key') == session.get('token', None):
    if True:
        sntcList = []
        queryString = f"select * from sntc_table where PN_CODE!='' and PN_CODE!='N/A';"
        result = db.session.execute(queryString)
        for row in result:
            sntcDataDict = {}


            sntcDataDict['sntc_id'] = row[0]    
            sntcDataDict['pn_code'] = row[1]
            sntcDataDict['hw_eos_date'] = FormatDate(row[2])
            sntcDataDict['hw_eol_date'] = FormatDate(row[3])
            sntcDataDict['sw_eos_date'] = FormatDate(row[4])
            sntcDataDict['sw_eol_date'] = FormatDate(row[5])
            sntcDataDict['manufacturer_date'] = FormatDate(row[7])
            sntcDataDict['creation_date'] = FormatDate(row[8])
            sntcDataDict['modification_date'] = FormatDate(row[9])

            sntcList.append(sntcDataDict)
        return jsonify(sntcList), 200
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route("/syncFromInventory", methods=['GET'])
@token_required
def SyncFromInventory(user_data):
    # request.headers.get('X-Auth-Key') == session.get('token', None):
    if True:
        queryString = f"SELECT DISTINCT(pn_code) FROM device_table WHERE pn_code NOT IN (SELECT pn_code FROM sntc_table) UNION select distinct(pn_code) from board_table where pn_code not in (select pn_code from sntc_table) UNION select distinct pn_code from subboard_table where pn_code not in (select pn_code from sntc_table) UNION SELECT DISTINCT(pn_code) FROM sfp_table WHERE pn_code NOT IN (SELECT pn_code FROM sntc_table);"
        result = db.session.execute(queryString)

        print(result, file=sys.stderr)

        for row in result:
            pn_code = row[0]
            sntc = SNTC_TABLE()

            sntc.pn_code = pn_code

            if SNTC_TABLE.query.with_entities(SNTC_TABLE.sntc_id).filter_by(pn_code=pn_code).first() is None:
                print("Inserted " + pn_code, file=sys.stderr)
                sntc.creation_date = datetime.now()
                sntc.modification_date = datetime.now()
                InsertData(sntc)
            else:
                print("Updated " + pn_code, file=sys.stderr)
                sntc.modification_date = datetime.now()
                UpdateData(sntc)
        return ("SUCCESS"), 200

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route("/syncToInventory", methods=['GET'])
@token_required
def SyncToInventory(user_data):
    # request.headers.get('X-Auth-Key') == session.get('token', None):
    if True:
        try:
            queryString = "select PN_CODE,HW_EOS_DATE,HW_EOL_DATE,SW_EOS_DATE,SW_EOL_DATE from sntc_table where PN_CODE in (select PN_CODE from device_table);"
            result = db.session.execute(queryString)

            for row in result:
                pn_code = row[0]
                hw_eos_date = row[1]
                hw_eol_date = row[2]
                sw_eos_date = row[3]
                sw_eol_date = row[4]
                db.session.execute(
                    f"update device_table set HW_EOS_DATE='{hw_eos_date}' where PN_CODE='{pn_code}';")
                db.session.commit()
                print('Device Table: HW_EOS_DATE', hw_eos_date, ' against PN CODE',
                      pn_code, ' updated successfully', file=sys.stderr)
                db.session.execute(
                    f"update device_table set HW_EOL_DATE='{hw_eol_date}' where PN_CODE='{pn_code}';")
                db.session.commit()
                print('Device Table: HW_EOL_DATE', hw_eol_date, ' against PN CODE',
                      pn_code, ' updated successfully', file=sys.stderr)
                db.session.execute(
                    f"update device_table set SW_EOS_DATE='{sw_eos_date}' where PN_CODE='{pn_code}';")
                db.session.commit()
                print('Device Table: SW_EOS_DATE', sw_eos_date, ' against PN CODE',
                      pn_code, ' updated successfully', file=sys.stderr)
                db.session.execute(
                    f"update device_table set SW_EOL_DATE='{sw_eol_date}' where PN_CODE='{pn_code}';")
                db.session.commit()
                print('Device Table: SW_EOL_DATE', sw_eol_date, ' against PN CODE',
                      pn_code, ' updated successfully', file=sys.stderr)
                db.session.execute(
                    f"update device_table set ITEM_DESC='{item_desc}' where PN_CODE='{pn_code}';")
                db.session.commit()
                # print('Device Table: ITEM_DESC',item_desc,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)
                # db.session.execute(f"update device_table set ITEM_CODE='{item_code}' where PN_CODE='{pn_code}';")
                # db.session.commit()
                # print('Device Table: ITEM_CODE',item_code,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)

            queryString1 = "select PN_CODE,HW_EOS_DATE,HW_EOL_DATE from sntc_table where PN_CODE in (select PN_CODE from board_table);"
            result1 = db.session.execute(queryString1)
            for row in result1:
                pn_code = row[0]
                hw_eos_date = row[1]
                hw_eol_date = row[2]
                # item_desc = row[3]
                # item_code = row[4]

                db.session.execute(
                    f"update board_table set EOS_DATE='{hw_eos_date}' where PN_CODE='{pn_code}';")
                db.session.commit()
                print('Board Table: HW_EOS_DATE', hw_eos_date, ' against PN CODE',
                      pn_code, ' updated successfully', file=sys.stderr)
                db.session.execute(
                    f"update board_table set EOL_DATE='{hw_eol_date}' where PN_CODE='{pn_code}';")
                db.session.commit()
                print('Board Table: HW_EOL_DATE', hw_eol_date, ' against PN CODE',
                      pn_code, ' updated successfully', file=sys.stderr)
                db.session.execute(
                    f"update board_table set ITEM_DESC='{item_desc}' where PN_CODE='{pn_code}';")
                db.session.commit()
                # print('Board Table: ITEM_DESC',item_desc,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)
                # db.session.execute(f"update board_table set ITEM_CODE='{item_code}' where PN_CODE='{pn_code}';")
                # db.session.commit()
                # print('Board Table: ITEM_CODE',item_code,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)

            queryString2 = "select PN_CODE,HW_EOS_DATE,HW_EOL_DATE from sntc_table where PN_CODE in (select PN_CODE from subboard_table);"
            result2 = db.session.execute(queryString2)
            for row in result2:
                pn_code = row[0]
                hw_eos_date = row[1]
                hw_eol_date = row[2]
                item_desc = row[3]
                item_code = row[4]

                db.session.execute(
                    f"update subboard_table set EOS_DATE='{hw_eos_date}' where PN_CODE='{pn_code}';")
                db.session.commit()
                print('SUbBoard Table: HW_EOS_DATE', hw_eos_date, ' against PN CODE',
                      pn_code, ' updated successfully', file=sys.stderr)
                db.session.execute(
                    f"update subboard_table set EOL_DATE='{hw_eol_date}' where PN_CODE='{pn_code}';")
                db.session.commit()
                print('SUbBoard Table: HW_EOL_DATE', hw_eol_date, ' against PN CODE',
                      pn_code, ' updated successfully', file=sys.stderr)
                db.session.execute(
                    f"update subboard_table set ITEM_DESC='{item_desc}' where PN_CODE='{pn_code}';")
                db.session.commit()
                # print('SUbBoard Table: ITEM_DESC',item_desc,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)
                # db.session.execute(f"update subboard_table set ITEM_CODE='{item_code}' where PN_CODE='{pn_code}';")
                # db.session.commit()
                # print('SUbBoard Table: ITEM_CODE',item_code,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)

            queryString3 = "select PN_CODE,HW_EOS_DATE,HW_EOL_DATE from sntc_table where PN_CODE in (select PN_CODE from sfp_table);"
            result3 = db.session.execute(queryString3)
            for row in result3:
                pn_code = row[0]
                hw_eos_date = row[1]
                hw_eol_date = row[2]
                # item_desc = row[3]
                # item_code = row[4]

                db.session.execute(
                    f"update sfp_table set EOS_DATE='{hw_eos_date}' where PN_CODE='{pn_code}';")
                db.session.commit()
                print('SFP Table: HW_EOS_DATE', hw_eos_date, ' against PN CODE',
                      pn_code, ' updated successfully', file=sys.stderr)
                db.session.execute(
                    f"update sfp_table set EOL_DATE='{hw_eol_date}' where PN_CODE='{pn_code}';")
                db.session.commit()
                print('SFP Table: HW_EOL_DATE', hw_eol_date, ' against PN CODE',
                      pn_code, ' updated successfully', file=sys.stderr)
                db.session.execute(
                    f"update sfp_table set ITEM_DESC='{item_desc}' where PN_CODE='{pn_code}';")
                db.session.commit()
                # print('SFP Table: ITEM_DESC',item_desc,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)
                # db.session.execute(f"update sfp_table set ITEM_CODE='{item_code}' where PN_CODE='{pn_code}';")
                # db.session.commit()
                # print('SFP Table: ITEM_CODE',item_code,' against PN CODE',pn_code,' updated successfully',file=sys.stderr)

            return jsonify("Success"), 200

        except Exception as e:
            print(f"SNTC error occured {e}", file=sys.stderr)
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route('/editSntc', methods=['POST'])
@token_required
def EditSntc(user_data):
    # request.headers.get('X-Auth-Key') == session.get('token', None):
    if True:
        sntcObj = request.get_json()
        print(sntcObj, file=sys.stderr)

        sntc = SNTC_TABLE()
        sntc.sntc_id = sntcObj['sntc_id']
        sntc.pn_code = sntcObj['pn_code']
        sntc.hw_eos_date = FormatStringDate(sntcObj['hw_eos_date'])
        sntc.hw_eol_date = FormatStringDate(sntcObj['hw_eol_date'])
        sntc.sw_eos_date = FormatStringDate(sntcObj['sw_eos_date'])
        sntc.sw_eol_date = FormatStringDate(sntcObj['sw_eol_date'])
        sntc.manufacturer_date = FormatStringDate(sntcObj['manufacturer_date'])
        # sntc.item_desc = sntcObj['item_desc']
        # sntc.item_code = sntcObj['item_code']
        #sntc.creation_date = FormatStringDate(sntcObj['creation_date'])

        #SNTC_Table.sntc_id = SNTC_Table.query.with_entities(SNTC_Table.sntc_id).filter_by(pn_code=sntcObj['pn_code']).first()[0]
        print("Updated " + sntcObj['pn_code'], file=sys.stderr)
        sntc.modification_date = datetime.now()
        UpdateData(sntc)

        return jsonify({'response': "success", "code": "200"})

    else:
        print("Authentication Failed", file=sys.stderr)


@app.route("/addSNTC", methods=['POST'])
@token_required
def AddSntc(user_data):
    # request.headers.get('X-Auth-Key') == session.get('token', None):
    if True:
        postData = request.get_json()

        # print(postData,file=sys.stderr)
        try:

            for sntcObj in postData:

                sntc = SNTC_TABLE()

                print(sntcObj, file=sys.stderr)
                sntc.pn_code = sntcObj['pn_code']

                if 'hw_eos_date' in sntcObj:
                    if sntcObj['hw_eos_date'] != 'NA':
                        try:
                            print(sntcObj['hw_eos_date'],file=sys.stderr)
                            sntc.hw_eos_date = datetime.strptime(
                                (sntcObj['hw_eos_date']), "%d-%m-%Y")
                        except:
                            print("Incorrect formatting in hw_eos_date",
                                    file=sys.stderr)
                            traceback.print_exc()
                if 'hw_eol_date' in sntcObj:
                    if sntcObj['hw_eol_date'] != 'NA':
                        try:
                            sntc.hw_eol_date = datetime.strptime(
                                (sntcObj['hw_eol_date']), "%d-%m-%Y")
                        except:
                            print("Incorrect formatting in hw_eol_date",
                                    file=sys.stderr)
                if 'sw_eos_date' in sntcObj:
                    if sntcObj['sw_eos_date'] != 'NA':
                        try:
                            sntc.sw_eos_date = datetime.strptime(
                                (sntcObj['sw_eos_date']), "%d-%m-%Y")
                        except:
                            print("Incorrect formatting in sw_eos_date",
                                    file=sys.stderr)
                if 'sw_eol_date' in sntcObj:
                    if sntcObj['sw_eol_date'] != 'NA':
                        try:
                            sntc.sw_eol_date = datetime.strptime(
                                (sntcObj['sw_eol_date']), "%d-%m-%Y")
                        except:
                            print("Incorrect formatting in sw_eol_date",
                                    file=sys.stderr)
                if 'manufacturer_date' in sntcObj:
                    if sntcObj['manufacturer_date'] != 'NA':
                        try:
                            sntc.manufacturer_date = datetime.strptime(
                                (sntcObj['manufacturer_date']),"%d-%m-%Y")
                            #print(sntc.manufacture_date, file=sys.stderr)
                        except:
                            print("Incorrect formatting in manufactuer_date",
                                    file=sys.stderr)
                # if 'item_desc' in sntcObj:
                #      if sntcObj['item_desc'] != 'NA':
                #         try:
                #             sntc.item_desc =sntcObj['item_desc']
                #             #print(sntc.manufacture_date, file=sys.stderr)
                #         except:
                #             print("Incorrect Value in item description", file=sys.stderr)
                # if 'item_code' in sntcObj:
                #      if sntcObj['item_code'] != 'NA':
                #         try:
                #             sntc.item_code =sntcObj['item_code']
                #             #print(sntc.manufacture_date, file=sys.stderr)
                #         except:
                #             print("Incorrect Value in item description", file=sys.stderr)

                if SNTC_TABLE.query.with_entities(SNTC_TABLE.sntc_id).filter_by(pn_code=sntcObj['pn_code']).first() is not None:
                    sntc.sntc_id = SNTC_TABLE.query.with_entities(
                        SNTC_TABLE.sntc_id).filter_by(pn_code=sntcObj['pn_code']).first()[0]
                    print("Updated " + sntcObj['pn_code'], file=sys.stderr)
                    sntc.modification_date = (datetime.now())
                    UpdateData(sntc)
                else:
                    print("Inserted " + sntcObj['pn_code'], file=sys.stderr)
                    sntc.creation_date = datetime.now()
                    sntc.modification_date = datetime.now()
                    InsertData(sntc)

            return "Data Added/Updated Successfully",200
        except Exception as e:
            traceback.print_exc()
            return "Failed To Update Data",500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401


@app.route("/deletePnCode", methods=['POST'])
@token_required
def DeletePnCode(user_data):
    if True:  # session.get('token', None):
        posObj = request.get_json()
        print(posObj, file=sys.stderr)
        print(f"PnCode Data received is:  {posObj}", file=sys.stderr)

        for obj in posObj.get("user_ids"):
            posID = SNTC_TABLE.query.filter(SNTC_TABLE.pn_code == obj).first()
            print(posID, file=sys.stderr)
            if obj:
                db.session.delete(posID)
                db.session.commit()
        return jsonify({'response': "success", "code": "200"})
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401
