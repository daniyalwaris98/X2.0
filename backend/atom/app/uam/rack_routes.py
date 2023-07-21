from app import app
from app.models.inventory_models import *
from app.middleware import token_required
from app.uam.rack_utils import *

from flask_jsonpify import jsonify
from flask import request

import traceback
import sys


@app.route("/getRacksBySiteDropdown", methods=["GET"])
@token_required
def GetRacksBySiteDropdown(user_data):
    try:
        site_name = request.args.get("site_name")
        print(f"Site Name: {site_name}", file=sys.stderr)
        objList = []

        result = (
            db.session.query(Rack_Table, Site_Table)
            .join(Site_Table, Rack_Table.site_id == Site_Table.site_id)
            .filter(Site_Table.site_name == site_name)
            .all()
        )

        for rack, site in result:
            rack_name = rack.rack_name
            objList.append(rack_name)

        print(objList, file=sys.stderr)
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return str(e), 500


@app.route("/getRacksByRackName", methods=["GET"])
@token_required
def getRackDetailsByRackName(user_data):
    try:
        rack_name = request.args.get("rack_name")
        if rack_name:
            rackList = GetRackDetailsByRackName(rack_name)
            print(rackList, file=sys.stderr)
            return jsonify(rackList), 200
        else:
            return "Please Provid Rack Name", 500
    except Exception as e:
        traceback.print_exc()
        print(str(e), file=sys.stderr)
        return "Server Error", 500


@app.route("/getAllRacks", methods=["GET"])
@token_required
def getAllRacks(user_data):
    try:
        rackObjList = GetAllRacks()
        return jsonify(rackObjList), 200
    except Exception as e:
        traceback.print_exc()
        return "Error While Fetching Data", 500


@app.route("/addRack", methods=["POST"])
@token_required
def addRack(user_data):
    try:
        rackObj = request.get_json()
        msg, status = AddRack(rackObj, False)

        print(msg, file=sys.stderr)

        return msg, status
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/editRack", methods=["POST"])
@token_required
def editRack(user_data):
    try:
        rackObj = request.get_json()
        msg, status = AddRack(rackObj, False)

        print(msg, file=sys.stderr)

        return msg, status
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/deleteRack", methods=["POST"])
@token_required
def deleteRack(user_data):
    try:
        rackNames = request.get_json()

        response, status = DeleteRack(rackNames)

        if status == 200:
            return jsonify(response), 200
        else:
            return response, 500

    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500
