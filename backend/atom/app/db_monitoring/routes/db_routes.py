from app.db_monitoring.db_monitoring_utils import *
from app.db_monitoring.mysql_scheduler import *


@app.route("/addDatabaseServer", methods=["POST"])
# @token_required
def addDatabaseServer():
    try:
        DatabaseObj = request.get_json()

        msg, status = AddDatabaseServer(DatabaseObj, 0)

        return msg , status
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/addDatabaseServers", methods=["POST"])
# @token_required
def addDatabaseServers():
    try:

        DatabaseObj = request.get_json()
        errorlist = []
        responselist = []

        for row, DatabaseObj in enumerate(DatabaseObj):
            try:

                msg, status = AddDatabaseServer(DatabaseObj, row)

                if status == 500:
                    errorlist.append(f"Row {row}: "+ msg)
                if status == 200:
                    responselist.append(f"Row {row} : "+ msg) 

            except Exception as e:
                traceback.print_exc()
                errorlist.append(f"Row {row} : Exception")
        
        responseDict = {
            "success": len(responselist),
            "error": len(errorlist),
            "error_list": errorlist,
            "success_list": responselist,
        }
        
        make_response(jsonify(responseDict))
        return jsonify(responseDict), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500
    
    
@app.route("/editDatabaseServer", methods=["POST"])
# @token_required
def editDatabaseServer():
    try:
        DatabaseObj = request.get_json()

        msg, status = AddDatabaseServer(DatabaseObj, 1)

        return msg , status
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500
    
@app.route("/deleteDatabaseServer", methods=["POST"])
# @token_required
def deleteDatabaseServer():
    try:
        server_ips = request.get_json()
        errorlist = []
        responselist = []

        for server_ip in server_ips:
            try:
                ip = Server_Table.query.filter_by(ip_address=server_ip).first()
                
                if ip is None: 
                    errorlist.append(f"{server_ip}: Server Does Not Exist")
                    continue

                db.session.delete(ip)   
                db.session.commit()
                responselist.append(f"{server_ip}: Server Deleted Successfully")
            except Exception as e:
                traceback.print_exc()
                errorlist.append(f"{server_ip}: Exception")        

        responseDict = {
            "success": len(responselist),
            "error": len(errorlist),
            "error_list": errorlist,
            "success_list": responselist,
        }
        return jsonify(responseDict), 200
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500
    

@app.route("/getDatabaseServers", methods=["GET"])
# @token_required
def getDatabaseServers():
    try:
        db_server_list = GetDatabaseServers()

        ## Add the upstatus and version metrics aswell 

        response = make_response(jsonify(db_server_list))
        return response, 200

    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500
    
@app.route("/mysqlconns", methods=["GET"])
# @token_required
def mysqlconns():
    try: 
        msg, status = DatabaseIterator()
        return msg, status
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500

