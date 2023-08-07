from app import app, db
import sys
from flask import Flask
import traceback
from flask_jsonpify import jsonify
from app.monitoring.device_monitoring import *
from flask import request, make_response, Response, session
from flask_jsonpify import jsonify
import sys
from flask import request, make_response, Response, session
from app.middleware import token_required
import threading
from datetime import datetime
from app import client



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
    print("in insertion", obj)
    try:
        db.session.add(obj)
        db.session.commit()

        print("data inserted", obj)

    except Exception as e:

        db.session.rollback()
        print(
            f"Something else went wrong in Database Insertion {e,type(e).__name__}", file=sys.stderr)

    return True




def UpdateData(obj):
    # add data to db
    #print(obj, file=sys.stderr)
    try:
        # db.session.flush()

        db.session.merge(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(
            f"Something else went wrong during Database Update {e}", file=sys.stderr)

    return True


@app.route("/updateMonitoringAlertCPUThreshold",methods=['POST'])
@token_required
def updateMonitoringAlertCPUThreshold(user_data):
    try:

        pass
    except Exception as e:
        print("Error While Udating Monitoring CPU Alert Threshold",file=sys.stderr)
        traceback.print_exc()

@app.route("/getLowMonitoringAlerts", methods=['GET'])
@token_required
def lowalerts(user_data):
    if True:
        try:
            MonitoringObjList = []

            queryString = f"select * from alerts_table where alert_type='low' order by `date` desc;"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict['alarm_id'] = MonitoringObj[0]
                MonitoringDataDict['ip_address'] = MonitoringObj[1]
                MonitoringDataDict['description'] = MonitoringObj[2]
                MonitoringDataDict['alert_type'] = MonitoringObj[3]
                MonitoringDataDict['mail_status'] = MonitoringObj[4]
                MonitoringDataDict['date'] = MonitoringObj[8]

                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getMedMonitoringAlerts", methods=['GET'])
@token_required
def medalerts(user_data):
    if True:
        try:
            MonitoringObjList = []

            queryString = f"select * from alerts_table where alert_type='medium' order by `date` desc;"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict['alarm_id'] = MonitoringObj[0]
                MonitoringDataDict['ip_address'] = MonitoringObj[1]
                MonitoringDataDict['description'] = MonitoringObj[2]
                MonitoringDataDict['alert_type'] = MonitoringObj[3]
                MonitoringDataDict['mail_status'] = MonitoringObj[4]
                MonitoringDataDict['date'] = MonitoringObj[8]

                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllAlerts", methods=['GET'])
@token_required
def hialerts(user_data):
    if True:
        try:
            MonitoringObjList = []

            queryString = f"select * from alerts_table where date > now() - interval 1 day order by `date` desc;"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict['alarm_id'] = MonitoringObj[0]
                MonitoringDataDict['ip_address'] = MonitoringObj[1]
                MonitoringDataDict['description'] = MonitoringObj[2]
                MonitoringDataDict['alert_type'] = MonitoringObj[3]
                MonitoringDataDict['function'] = MonitoringObj[4]
                MonitoringDataDict['alert_status'] = MonitoringObj[5]
                MonitoringDataDict['mail_status'] = MonitoringObj[6]
                MonitoringDataDict['date'] = MonitoringObj[8]

                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getIPAlerts", methods=['GET'])
@token_required
def ipalerts(user_data):
    if True:
        try:
            ipaddress = request.args.get('ipaddress')
            print("printing ip address:", ipaddress, file=sys.stderr)
            MonitoringObjList = []

            queryString = f"select * from alerts_table where ip_address='{ipaddress}' order by `date` desc;"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict['alarm_id'] = MonitoringObj[0]
                MonitoringDataDict['ip_address'] = MonitoringObj[1]
                MonitoringDataDict['description'] = MonitoringObj[2]
                MonitoringDataDict['alert_type'] = MonitoringObj[3]
                MonitoringDataDict['function'] = MonitoringObj[4]
                MonitoringDataDict['mail_status'] = MonitoringObj[5]
                MonitoringDataDict['date'] = MonitoringObj[8]

                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getTotalAlerts", methods=['GET'])
@token_required
def totalalerts(user_data):
    if True:
        try:
            ipobj = request.get_json()
            MonitoringObjList = []

            queryString = f"select * from alerts_table' order by `date` desc;"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict['alarm_id'] = MonitoringObj[0]
                MonitoringDataDict['ip_address'] = MonitoringObj[1]
                MonitoringDataDict['description'] = MonitoringObj[2]
                MonitoringDataDict['alert_type'] = MonitoringObj[3]
                MonitoringDataDict['function'] = MonitoringObj[4]
                MonitoringDataDict['mail_status'] = MonitoringObj[5]
                MonitoringDataDict['date'] = MonitoringObj[8]

                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getCriticalAlerts", methods=['GET'])
# @token_required
def criticalalerts():
    if True:
        try:
            ipobj = request.get_json()
            MonitoringObjList = []

            queryString = f"select * from alerts_table where alert_type='critical' and date > now() - interval 1 day order by `date` desc;"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict['alarm_id'] = MonitoringObj[0]
                MonitoringDataDict['ip_address'] = MonitoringObj[1]
                MonitoringDataDict['description'] = MonitoringObj[2]
                MonitoringDataDict['alert_type'] = MonitoringObj[3]
                MonitoringDataDict['function'] = MonitoringObj[4]
                MonitoringDataDict['mail_status'] = MonitoringObj[5]
                MonitoringDataDict['date'] = MonitoringObj[8]

                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getInformationalAlerts", methods=['GET'])
@token_required
def informationalalerts(user_data):
    if True:
        try:
            ipobj = request.get_json()
            MonitoringObjList = []

            queryString = f"select * from alerts_table where alert_type='informational'and date > now() - interval 1 day order by `date` desc;"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict['alarm_id'] = MonitoringObj[0]
                MonitoringDataDict['ip_address'] = MonitoringObj[1]
                MonitoringDataDict['description'] = MonitoringObj[2]
                MonitoringDataDict['alert_type'] = MonitoringObj[3]
                MonitoringDataDict['function'] = MonitoringObj[4]
                MonitoringDataDict['mail_status'] = MonitoringObj[5]
                MonitoringDataDict['date'] = MonitoringObj[8]

                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getDeviceAlerts", methods=['GET'])
@token_required
def devicealerts(user_data):
    if True:
        try:
            ipobj = request.get_json()
            MonitoringObjList = []

            queryString = f"select * from alerts_table where (alert_type='device_down' or alert_type='device_up') and date > now() - interval 1 day order by `date` desc;"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict['alarm_id'] = MonitoringObj[0]
                MonitoringDataDict['ip_address'] = MonitoringObj[1]
                MonitoringDataDict['description'] = MonitoringObj[2]
                MonitoringDataDict['alert_type'] = MonitoringObj[3]
                MonitoringDataDict['function'] = MonitoringObj[4]
                MonitoringDataDict['mail_status'] = MonitoringObj[5]
                MonitoringDataDict['date'] = MonitoringObj[8]

                MonitoringObjList.append(MonitoringDataDict)

            

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/alertStatus", methods=['GET'])
# @token_required
def alertstatus():
    if True:
        try:
            MonitoringObjList = []
            total = 0
            queryString1 = f"select count(alert_type) from alerts_table where date > now() - interval 1 day;"
            result = db.session.execute(queryString1).scalar()
            total = result
            queryString = f"select alert_type,count(alert_type) from alerts_table where date > now() - interval 1 day group by alert_type;"
            results = db.session.execute(queryString)
            for result in results:
                alertDict = {}

                alertDict[result[0]] = result[1]
                MonitoringObjList.append(alertDict)

            # total = len(results)

            # queryString = f"select * from alerts_table where alert_type='low';"
            # results = db.session.execute(queryString)
            # formal = (len(results)/total) * 100

            # queryString = f"select * from alerts_table where alert_type='medium';"
            # results = db.session.execute(queryString)
            # informal = (len(results)/total) * 100

            # queryString = f"select * from alerts_table where alert_type='high';"
            # results = db.session.execute(queryString)
            # critical = (len(results)/total) * 100

            y = {}
            for i in MonitoringObjList:
                for j in i:
                    y[j] = i[j]
            if 'critical' in y.keys():
                pass
            else:
                y['critical'] = 0
            
            if 'informational' in y.keys():
                pass
            else:
                y['informational'] = 0
            if 'device_down' in y.keys():
                pass
            else:
                y['device_down'] = 0
            
            y['total'] = total
            
            
            return y, 200
            # return jsonify(MonitoringObjList),200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503





@app.route("/alertenter", methods=['GET'])
@token_required
def alerttest(user_data):
    if True:
        try:
            func = 'Wireless'
            des = f"An automated alarm generated,3245 is utilizing than 4353% of test"
            sqlquery = f"insert into alerts_table (`IP_ADDRESS`,`DESCRIPTION`,`ALERT_TYPE`,`FUNCTION`,`MAIL_STATUS`,`DATE`) values ('2424','{des}','critical','{func}','no','{datetime.now()}');"
            db.session.execute(sqlquery)
            db.session.commit()

            return "inserted", 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503



