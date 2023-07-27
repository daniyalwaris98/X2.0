import sys
from app import db
from datetime import datetime, timedelta

def insert_login_alarm(host):
    current_time = datetime.now()

    alarm_title = "Login Failed"
    alarm_description = """1. The credentials (username or password) on the device have been changed
2. Credentials have not been added or updated in monetX
3. Number of connections to the device have been exceeded and monetX is unable to connect"""

    try:
        query = f"insert into ncm_alarm_table (ip_address,device_name,alarm_category, alarm_title, alarm_description, creation_date, modification_date) VALUES ('{host['ip_address']}', '{host['device_name']}', 'Login', '{alarm_title}', '{alarm_description}', '{current_time}', '{current_time}');"
        db.session.execute(query)
        db.session.commit()

        print(f"NCM Login Alarm: {host['ip_address']} : Login Alarm Added",file=sys.stderr)
    except Exception:
        print(f"NCM Login Alarm: {host['ip_address']} : Error : While Adding Login Alarm",file=sys.stderr)



def update_login_alarm(host,login,alarm):
    current_time = datetime.now()
    if login is False:
        # if 'modification_date' in alarm.keys
        if alarm[8] is not None and alarm[8] != "":
            difference = current_time - alarm[8]
            difference = int(difference.total_seconds())
            
            if difference >= 86400: # seconds in a day
                try:
                    query = f"update ncm_alarm_table set modification_date='{current_time}' alarm_mail_status='No' where ip_address='{host['ip_address']}' and alarm_status='Open' and alarm_category='Login';"
                    db.session.execute(query)
                    db.session.commit()

                    print(f"NCM Login Alarm: {host['ip_address']} : Login Alarm Updated",file=sys.stderr)
                except Exception:
                    print(f"NCM Login Alarm: {host['ip_address']} : Error : While Updating Login Alarm",file=sys.stderr)
            else:
                print(f"NCM Login Alarm: {host['ip_address']} : Time Difference {difference} < 1 day",file=sys.stderr)
        
    else:
        try:
            query = f"update ncm_alarm_table set alarm_status='Close', resolve_remarks='Successfully Logged Into The Device', modification_date='{current_time}' where ip_address='{host['ip_address']}' and alarm_status='Open' and alarm_category='Login';"
            db.session.execute(query)
            db.session.commit()

            print(f"NCM Login Alarm: {host['ip_address']} : Login Alarm Closed",file=sys.stderr)
        except Exception:
            print(f"NCM Login Alarm: {host['ip_address']} : Error : While Closing Login Alarm",file=sys.stderr)


def login_alarm(host,login):

    print(f"NCM Login Alarm: {host['ip_address']} : Checking Login Alarm...",file=sys.stderr)
    try:
        query = f"select * from ncm_alarm_table where ip_address = '{host['ip_address']}' and alarm_category='Login' and alarm_status='Open';"
        result = db.session.execute(query).fetchone()

        if result is None:
            print(f"NCM Login Alarm: {host['ip_address']} : No Open Login Alarm Found",file=sys.stderr)
            
            if login is False:
                insert_login_alarm(host)

        else:
            print(f"NCM Login Alarm: {host['ip_address']} : Open Login Alarm Found",file=sys.stderr)
            update_login_alarm(host,login,result)

    except Exception:
        print(f"NCM Login Alarm: {host['ip_address']} : Error : While Checking Login Alarm",file=sys.stderr)




def insert_config_change_alarm(host):
    current_time = datetime.now()

    alarm_title = "Configuration Change Detected"
    alarm_description = "Change in device configuration has been detected"

    try:
        query = f"insert into ncm_alarm_table (ip_address,device_name,alarm_category, alarm_title, alarm_description, creation_date, modification_date) VALUES ('{host['ip_address']}', '{host['device_name']}', 'Configuration', '{alarm_title}', '{alarm_description}', '{current_time}', '{current_time}');"
        db.session.execute(query)
        db.session.commit()

        print(f"NCM Config Alarm: {host['ip_address']} : Config Alarm Added",file=sys.stderr)
    except Exception:
        print(f"NCM Config Alarm: {host['ip_address']} : Error : While Adding Config Alarm",file=sys.stderr)




def backup_failed_alarm(host,backup):
    try:
        pass
    except Exception:
        pass


def config_change_alarm(host):
    print(f"NCM Config Alarm: {host['ip_address']} : Checking Config Alarm...",file=sys.stderr)
    try:

        insert_config_change_alarm(host)

        # query = f"select * from ncm_alarm_table where ip_address = '{host['ip_address']}' and alarm_category='Login' and alarm_status='Open';"
        # result = db.session.execute(query).fetchone()

        # if result is None:
        #     print(f"NCM Config Alarm: {host['ip_address']} : No Open Config Alarm Found",file=sys.stderr)
            
        #     if login is False:
        #         insert_login_alarm(host)

        # else:
        #     print(f"NCM Config Alarm: {host['ip_address']} : Open Config Alarm Found",file=sys.stderr)
        #     update_login_alarm(host,login,result)

    except Exception:
        print(f"NCM Config Alarm: {host['ip_address']} : Error : While Checking Config Alarm",file=sys.stderr)