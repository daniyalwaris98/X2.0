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