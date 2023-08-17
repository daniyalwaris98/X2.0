from app.db_monitoring.db_monitoring_utils import *

@app.route("/addPasswordGroupDBM", methods=["POST"])
# @token_required
def addPasswordGroupDBM():
    try:
        DBMPassObj = request.get_json()
        response, status = AddPasswordGroupDBM(DBMPassObj, 0)
        
        return response, status

    except Exception as e:
        traceback.print_exc()
        return "Server Error While Adding Password Group", 500
    
@app.route("/addPasswordGroupsDBM", methods=["POST"])
# @token_required
def addPasswordGroupsDBM():
    try:
            
            DBMPassObj = request.get_json()
            errorlist = []
            responselist = []
    
            for row, DBMPassObj in enumerate(DBMPassObj):
                try:
    
                    msg, status = AddPasswordGroupDBM(DBMPassObj, row)

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
        return "Server Error While Adding Password Groups", 500

@app.route("/editPasswordGroupDBM", methods=['POST'])
# @token_required
def editPasswordGroupDBM():
    try:
        DBMPassObj = request.get_json()
        response, status = AddPasswordGroupDBM(DBMPassObj, 1)

        print(response, file=sys.stderr)

        return response, status
    except Exception as e:
        traceback.print_exc()
        return "Server Error While Updating Password Group", 500
    
    
@app.route('/deletePasswordGroupDBM', methods=['POST'])
# @token_required
def deletePasswordGroupDBM():
    try:
        passwordGroups = request.get_json()
        errorList = []
        responseList = []
        
        for passwordGroup in passwordGroups:
            try:
                
                password = DBM_Password_Group_Table.query.filter_by(password_group=passwordGroup).first()
                

                if password is None:
                    errorList.append(f"{passwordGroup} : Password Group Does Not Exist")
                    continue
                
                server = Server_Table.query.filter_by(
                    password_group=password.password_group
                ).first()
                
                if server is not None:
                    errorList.append(f"{passwordGroup} : Password Group Is In Use In Server")
                    continue
                
                db.session.delete(password)
                db.session.commit()
                responseList.append(f"{passwordGroup} : Password Group Deleted Successfully")   
                
            except Exception:
                traceback.print_exc()
                errorList.append(f"{passwordGroup} : Exception")
        
        responseDict = {
            "success": len(responseList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": responseList,
        }

        return jsonify(responseDict), 200
                
    except Exception as e:
        traceback.print_exc()
        return "Server Error While Deleting Password Groups", 500

@app.route('/getPasswordGroupsDBM', methods=['GET'])
# @token_required
def getPasswordGroupsDBM():
    try:
        
        passwordGroupsList = GetPasswordGroupDBM()

        response =jsonify(passwordGroupsList)
        return response, 200
    
    except Exception as e:
        traceback.print_exc()
        return "Server Error While Getting Password Groups", 500