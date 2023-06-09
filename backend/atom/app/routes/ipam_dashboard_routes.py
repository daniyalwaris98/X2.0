import sys,json,traceback
from flask_jsonpify import jsonify
from flask import Flask, request
from app import app, db
from app.models.inventory_models import *
from sqlalchemy import func
from datetime import datetime
import ipaddress
import threading
from app.middleware import token_required
from app.ipam_scripts.ipam import IPAM
import ipaddress
import nmap
from netaddr import IPNetwork
import socket
from collections import Counter
import pandas as pd


@app.route('/topTenSubnetsPercentage', methods=['GET'])
@token_required
def TopTenSubnetsPercentage(user_data):
    if True:
        try:
            queryString = f"select SUBNET_ADDRESS,coalesce(sum(`USAGE`),0) from subnet_display_table group by SUBNET_ADDRESS ORDER BY coalesce(sum(`USAGE`),0) DESC LIMIT 10;"
            objList = []
            result = db.session.execute(queryString)
            for row in result:
                subnet = row[0]
                usage = row[1]
                objDict = {}
                objDict['subnet'] = subnet
                objDict['space_usage'] = usage
                objList.append(objDict)
            return jsonify(objList), 200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/topOpenPorts', methods=['GET'])
@token_required
def TopOpenPorts(user_data):
    if True:
        try:
            total_ports = []
            queryString = f"select OPEN_PORTS from ip_table where open_ports is not NULL and open_ports!='';"
            result = db.session.execute(queryString)
            for row in result:
                open_ports = row[0]
                ports = open_ports.split(",")
                for i in ports:
                    if i=='None':
                        print("None values found in PORTS",file=sys.stderr)
                        pass                        
                    else:

                        total_ports.append(i.lstrip())
            objDict = (Counter(total_ports))
            objDict = dict(objDict)
            print(objDict, file=sys.stderr)

            return (objDict), 200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/ipAvailibity', methods=['GET'])
@token_required
def IpAvailibity(user_data):
    if True:
        try:
            queryString = f"select count(ip_address) from ip_table;"

            result = int(db.session.execute(queryString).scalar())
    
            total_percentage = (result)

            queryString1 = f"select count(ip_address) from ip_table where status='Available';"
            result1 = int(db.session.execute(queryString1).scalar())
        
            available_percentage = (result1)
            queryString2 = f"select count(ip_address) from ip_table where status='Used';"
            result2 = int(db.session.execute(queryString2).scalar())
        
            used_percentage = (result2)
            objList = [{
                'name':'Total','value': (total_percentage)},
                {'name':"Available",'value': (available_percentage)},
                {'name':"Used",'value': (used_percentage)}]
            return jsonify(objList), 200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/subnetSummary', methods=['GET'])
@token_required
def SubnetSummary(user_data):
    if True:
        try:
            objList = []
            queryString = f"select discover_from from subnet_display_table;"
            result = db.session.execute(queryString)
            manual = 0
            device = 0
            for row in result:
                
                print(row,file=sys.stderr)
                source = row[0]
                if source=='':
                    manual+=1
                else:
                    device+=1
            objList.append({'name':'Discovered From Devices','value':device})
            objList.append({'name':'Manually Added','value':manual})
            return jsonify(objList),200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route('/dnsSummary', methods=['GET'])
@token_required
def DnsSummary(user_data):
    if True:
        try:
            queryString = f"select count(ip_to_dns) from ip_table where status='Used' and ip_to_dns!='Not Found';"
            result = int(db.session.execute(queryString).scalar())
    
            queryString1 = f"select count(ip_to_dns) from ip_table where status='Used' and ip_to_dns='Not Found';"
            result1 = int(db.session.execute(queryString1).scalar())
        
            objDict = {
                "Resolved": result,
                "Not Resolved": result1
            }
            return objDict, 200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503
