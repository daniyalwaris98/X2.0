from flask_jsonpify import jsonify
from flask import request

import sys
import traceback

from app import app
from app.atom.atom_utils import *
from app.middleware import token_required
from app.utilities.db_utils import *

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