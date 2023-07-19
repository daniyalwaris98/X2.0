
import sys
from app import app
from flask_jsonpify import jsonify
from flask import request

from app.middleware import token_required
from app.utilities.db_utils import *


@app.route('/getSitesForDropdown', methods=['GET'])
@token_required
def GetSitesForDropDown(user_data):
    try:

        result = Site_Table.query.all()
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

        result = db.session.query(Rack_Table, Site_Table) \
            .join(Site_Table, Rack_Table.site_id == Site_Table.site_id) \
            .filter(Site_Table.site_name == site_name).all()

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

        result = Password_Group_Table.query.all()
        objList = []
        for password_group in result:
            password_group_name = password_group.password_group
            objList.append(password_group_name)
        print(objList, 200)
        return jsonify(objList), 200
    except Exception as e:
        traceback.print_exc()
        return str(e), 500