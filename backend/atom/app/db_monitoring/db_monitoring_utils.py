import sys
from flask import request, make_response
from flask import jsonify 
from app import client
from app import app, db
from app.middleware import token_required
from app.models.dbm_models import * 
from app.utilities.db_utils import *
import traceback

# endpoint -> function -> checks -> query -> add 
def AddDatabaseServer(DatabaseObj, row):
    try:
        if DatabaseObj is None:
            return f"Empty Database Dictionary", 500
        
        ## Checks for ip addresses
        if DatabaseObj["ip_address"] is None or DatabaseObj["ip_address"].strip() == "":
            return f"IP address cannot be empty", 500
        
        if "ip_address" not in DatabaseObj.keys():
            return f"IP Address Is Missing", 500
        
        server_conn = Server_Table.query.filter_by(ip_address=DatabaseObj['ip_address']).first()
        print(server_conn, file=sys.stderr)

        if row == 0:
            if server_conn is not None:
                return f"{DatabaseObj['ip_address']} : IP Address Already Exists", 500
            
        update = True
        if server_conn is None:
            update = False
            server_conn = Server_Table()
            server_conn.ip_address = DatabaseObj['ip_address']
        
        ## Checks for Server name 
        if DatabaseObj["server_name"] is None or DatabaseObj["server_name"].strip() == "":
            return f"{DatabaseObj['ip_address']} : Server name cannot be empty", 500
        
        if "server_name" not in DatabaseObj.keys():
            return f"{DatabaseObj['ip_address']} : Server name Is Missing", 500
        
        server_conn.server_name = DatabaseObj['server_name']
        
        ## Checks for password group
        if DatabaseObj["password_group"] is None or DatabaseObj["password_group"].strip() == "":
            return f"{DatabaseObj['ip_address']} : Password group cannot be empty", 500
        
        if "password_group" not in DatabaseObj.keys():
            return f"{DatabaseObj['ip_address']} : Password Group Is Missing", 500
        
        if DBM_Password_Group_Table.query.filter_by(password_group=DatabaseObj['password_group']).first() is None:
            return f"{DatabaseObj['ip_address']} : Password Group Does Not Exist", 500

        server_conn.password_group = DatabaseObj['password_group']

        ## Insert or update 
        if update:
            status = UpdateDBData(server_conn)
            if status == 200:
                return f"{DatabaseObj['ip_address']} : Server Updated Successfully", 200
        else:
            status = InsertDBData(server_conn)
            if status == 200:
                return f"{DatabaseObj['ip_address']} : Server Inserted Successfully", 200

        return f"{DatabaseObj['ip_address']} : Server Error", 500

    except:
        traceback.print_exc()
        return "Exception", 500
    


def GetDatabaseServers():
    try:
        db_servers = Server_Table.query.join(
                DBM_Password_Group_Table, Server_Table.password_group == DBM_Password_Group_Table.password_group
            ).all()
        
        db_server_list = []
        for db_server in db_servers:
            db_server_list.append(db_server.as_dict())
        
        return db_server_list

    except Exception as e:
        traceback.print_exc()
        return f"Server Error", 500


## Add password group 
def AddPasswordGroupDBM(DBMPassObj, row):
    try:

        if 'password_group' not in DBMPassObj.keys():
            return f"Row {row} : Password Group Can Not be Empty", 500

        if DBMPassObj['password_group'] is None:
            return f"Row {row} : Password Group Can Not be Empty", 500

        DBMPassObj['password_group'] = DBMPassObj['password_group'].strip()

        if DBMPassObj['password_group'] == "":
            return f"Row {row} : Password Group Can Not be Empty", 500

        # row 0 means single row is being added statically and password Group can not be updated through Insertion
        # else multiple row are being added by using file import and row will be updated if password Group already
        # exists

        password_group = DBM_Password_Group_Table.query.filter_by(
            password_group=DBMPassObj['password_group']).first()
        print(password_group, file=sys.stderr)
        
        if row == 0:
            if password_group is not None:
                return f"{DBMPassObj['password_group']} : Password Group Already Exists", 500

        update = True
        if password_group is None:
            update = False
            password_group = DBM_Password_Group_Table()
            password_group.password_group = DBMPassObj['password_group']

        if 'password' not in DBMPassObj.keys():
            return f"{DBMPassObj['password_group']} : Password Field Can Not be Empty", 500

        if DBMPassObj['password'] is None:
            return f"{DBMPassObj['password_group']} : Password Field Can Not be Empty", 500

        DBMPassObj['password'] = DBMPassObj['password'].strip()
        if DBMPassObj['password'] == '':
            return f"{DBMPassObj['password_group']} : Password Field Can Not be Empty", 500

        password_group.password = DBMPassObj['password']

        if 'username' not in DBMPassObj.keys():
            return f"{DBMPassObj['password_group']} : Username Field Can Not Be Empty", 500

        if DBMPassObj['username'] is None:
            return f"{DBMPassObj['password_group']} : Username Field Can Not Be Empty", 500

        DBMPassObj['username'] = DBMPassObj['username'].strip()
        if DBMPassObj['username'] == "":
            return f"{DBMPassObj['password_group']} : Username Field Can Not Be Empty", 500

        password_group.username = DBMPassObj['username']

        if update:
            status = UpdateDBData(password_group)
            if status == 200:
                return f"{DBMPassObj['password_group']} : Password Group Updated Successfully", 200
        else:
            status = InsertDBData(password_group)
            if status == 200:
                return f"{DBMPassObj['password_group']} : Password Group Inserted Successfully", 200

        return f"{DBMPassObj['password_group']} : Server Error", 500

    except Exception:
        traceback.print_exc()
        return f"Row {row} : Server Error", 500




def GetPasswordGroupDBM():
    try:
        db_password_groups = DBM_Password_Group_Table.query.all()
        db_password_group_list = []
        for db_password_group in db_password_groups:
            db_password_group_list.append(db_password_group.as_dict())
        return db_password_group_list

    except Exception as e:
        traceback.print_exc()
        return f"Server Error", 500