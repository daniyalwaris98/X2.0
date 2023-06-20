from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
# from flasgger import Swagger
from influxdb_client import InfluxDBClient
import os
import sys
import traceback

import firebase_admin
from firebase_admin import credentials

from flask_swagger_ui import get_swaggerui_blueprint

#
cwd = os.getcwd()
path = f"{cwd}/app/templates"
app = Flask(__name__)

firebase_app = None
try:
    firebase_cred = credentials.Certificate(f"{cwd}/app/static/firebase-key.json")
    firebase_app = firebase_admin.initialize_app(firebase_cred)
    print("Firebase Connection Established", file=sys.stderr)
except:
    traceback.print_exc()
    print('Firebase API Failed', file=sys.stderr)

SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI (without trailing '/')
API_URL = f"/static/api_doc.json"  # Our API url (can of course be a local resource)

try:
    # Call factory function to create our blueprint
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
        API_URL,
        config={  # Swagger UI config overrides
            'app_name': "MonetX - APIs"
        },
        # oauth_config={  # OAuth config. See https://github.com/swagger-api/swagger-ui#oauth2-configuration .
        #    'clientId': "your-client-id",
        #    'clientSecret': "your-client-secret-if-required",
        #    'realm': "your-realms",
        #    'appName': "your-app-name",
        #    'scopeSeparator': " ",
        #    'additionalQueryStringParams': {'test': "hello"}
        # }
    )

    app.register_blueprint(swaggerui_blueprint)
    print("Swagger API Setup", file=sys.stderr)
except:
    traceback.print_exc()
    print('Swagger API Failed', file=sys.stderr)

# CORS(app)
# swagger = Swagger(app)
cors = CORS(app, supports_credentials=True)
api = Api(app)
app.secret_key = 'monetx_token'
SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = "OCML3BRawWEUeaxcuKHLpw"
app.config['CORS_HEADERS'] = 'Content-Type'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:As123456?@invdb:3306/InventoryDB'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:As123456?@10.254.168.159:3306/AtomDB'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:As123456?@atom_db:3306/AtomDB'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:As123456?@atom_db:3306/AtomDB'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:As123456?@updated_atom_db:3306/AtomDB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# app.config['SQLALCHEMY_BINDS'] = {
#         'uam': 'mysql+pymysql://root:As123456?@uam:3306/UAMDB'
# }
db = SQLAlchemy(app)

# Monitoring
# token = os.getenv("DOCKER_INFLUXDB_INIT_ADMIN_TOKEN")
# org = os.getenv("DOCKER_INFLUXDB_INIT_ORG")
# bucket = os.getenv("DDOCKER_INFLUXDB_INIT_BUCKET")


token = "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A=="
org = "monetx"
bucket = "monitoring"

# client = InfluxDBClient(url="http://10.254.168.159:8086", token=token, org=org)
# client = InfluxDBClient(url="http://10.254.168.159:8086", token=token, org=org)
# client = InfluxDBClient(url="http://influxdb:8086", token=token, org=org)
client = InfluxDBClient(url="http://updated_influxdb:8086", token=token, org=org)
# conf_file_path = os.path.join(os.path.dirname(__file__), "configuration_ backups")

# variable for time in bandwith formula
bandwidth_time = 900000


# from app.routes import uam_inventory_routes
# from app.routes import uam_dashboard_routes
# from app.routes import ipam_routes
# from app.routes import dc_capacity_routes
# from app.routes import dashboard_routes
# from app.common_utils import insert_to_db
# from app.monitoring.routes import monitoring_routes

# from app import scheduler
# from app.routes import ipam_dashboard_routes
# from app.monitoring.routes import monitoring_dashboard_routes
# from app.monitoring.routes import alerts_routes
# from app.routes import ncm_routes
# from app.routes import ncm_dashboard_routes
# # from app.routes import practice_routes
# from app.routes import auto_discovery_routes
# from app.routes import aws_routes
# from app import aws_scheduler
# from app.routes import auto_discovery_dashboard_routes
# from app.routes import firebase_notification_routes

# from app import ncm_scheduler

from app.license import license_generator

from app.routes import login_routes
from app.routes import admin_routes

from app.routes import atom_inventory_routes
from app.routes import uam_inventory_routes
from app.routes import uam_dashboard_routes


try:
    from app.models.inventory_models import *
    import json

    user_role = UserRolesTable.query.filter_by(role="Super_Admin").first()

    if user_role is None:
        user_role = UserRolesTable()
        user_role.role = "Super_Admin"
        user_role.configuration = '\"{\\\"dashboard\\\":{\\\"view\\\":true,\\\"pages\\\":{\\\"dashboard\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false}}},\\\"atom\\\":{\\\"view\\\":true,' \
                                  '\\\"pages\\\":{\\\"atom\\\":{\\\"view\\\":true,\\\"read_only\\\":false},' \
                                  '\\\"password_group\\\":{\\\"view\\\":true,\\\"read_only\\\":false}}},\\\"ncm\\\":{' \
                                  '\\\"view\\\":true,\\\"pages\\\":{\\\"dashboard\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"config_data\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false}}},\\\"uam\\\":{\\\"view\\\":true,\\\"pages\\\":{' \
                                  '\\\"sites\\\":{\\\"view\\\":true,\\\"read_only\\\":false},\\\"racks\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false},\\\"devices\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"modules\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"sfps\\\":{\\\"view\\\":true,\\\"read_only\\\":false},' \
                                  '\\\"hwlifecycle\\\":{\\\"view\\\":true,\\\"read_only\\\":false},\\\"aps\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false},\\\"license\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false}}},\\\"ipam\\\":{\\\"view\\\":true,\\\"pages\\\":{' \
                                  '\\\"dashboard\\\":{\\\"view\\\":true,\\\"read_only\\\":false},\\\"devices\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false},\\\"devices_subnet\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false},\\\"subnet\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"ip_detail\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"discover_subnet\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"ip_history\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"dns_server\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"dns_zones\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"dns_records\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"vpi\\\":{\\\"view\\\":true,\\\"read_only\\\":false},' \
                                  '\\\"loadbalancer\\\":{\\\"view\\\":true,\\\"read_only\\\":false},' \
                                  '\\\"firewall\\\":{\\\"view\\\":true,\\\"read_only\\\":false}}},' \
                                  '\\\"monitering\\\":{\\\"view\\\":true,\\\"pages\\\":{\\\"monitering\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false},\\\"device\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"network\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"router\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"switches\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"firewall\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"wireless\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"server\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"windows\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"linux\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"alerts\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"cloud\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"credentials\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false}}},\\\"dcm\\\":{\\\"view\\\":true,\\\"pages\\\":{' \
                                  '\\\"dashboard\\\":{\\\"view\\\":true,\\\"read_only\\\":true},\\\"devices\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":true}}},\\\"admin\\\":{\\\"view\\\":true,' \
                                  '\\\"pages\\\":{\\\"admin\\\":{\\\"view\\\":true,\\\"read_only\\\":false},' \
                                  '\\\"show_member\\\":{\\\"view\\\":true,\\\"read_only\\\":false},\\\"role\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false},\\\"failed_devices\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false}}}}\"'
        db.session.add(user_role)
        db.session.commit()

        print("\n** Super Admin Role Inserted **\n", file=sys.stderr)

    else:
        print("\n** Super Admin Role Already Exists **\n", file=sys.stderr)

        user_role.configuration = '\"{\\\"dashboard\\\":{\\\"view\\\":true,\\\"pages\\\":{\\\"dashboard\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false}}},\\\"atom\\\":{\\\"view\\\":true,' \
                                  '\\\"pages\\\":{\\\"atom\\\":{\\\"view\\\":true,\\\"read_only\\\":false},' \
                                  '\\\"password_group\\\":{\\\"view\\\":true,\\\"read_only\\\":false}}},\\\"ncm\\\":{' \
                                  '\\\"view\\\":true,\\\"pages\\\":{\\\"dashboard\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"config_data\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false}}},\\\"uam\\\":{\\\"view\\\":true,\\\"pages\\\":{' \
                                  '\\\"sites\\\":{\\\"view\\\":true,\\\"read_only\\\":false},\\\"racks\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false},\\\"devices\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"modules\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"sfps\\\":{\\\"view\\\":true,\\\"read_only\\\":false},' \
                                  '\\\"hwlifecycle\\\":{\\\"view\\\":true,\\\"read_only\\\":false},\\\"aps\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false},\\\"license\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false}}},\\\"ipam\\\":{\\\"view\\\":true,\\\"pages\\\":{' \
                                  '\\\"dashboard\\\":{\\\"view\\\":true,\\\"read_only\\\":false},\\\"devices\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false},\\\"devices_subnet\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false},\\\"subnet\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"ip_detail\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"discover_subnet\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"ip_history\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"dns_server\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"dns_zones\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"dns_records\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"vpi\\\":{\\\"view\\\":true,\\\"read_only\\\":false},' \
                                  '\\\"loadbalancer\\\":{\\\"view\\\":true,\\\"read_only\\\":false},' \
                                  '\\\"firewall\\\":{\\\"view\\\":true,\\\"read_only\\\":false}}},' \
                                  '\\\"monitering\\\":{\\\"view\\\":true,\\\"pages\\\":{\\\"monitering\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false},\\\"device\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"network\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"router\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"switches\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"firewall\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"wireless\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"server\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"windows\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"linux\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"alerts\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"cloud\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false},\\\"credentials\\\":{\\\"view\\\":true,' \
                                  '\\\"read_only\\\":false}}},\\\"dcm\\\":{\\\"view\\\":true,\\\"pages\\\":{' \
                                  '\\\"dashboard\\\":{\\\"view\\\":true,\\\"read_only\\\":true},\\\"devices\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":true}}},\\\"admin\\\":{\\\"view\\\":true,' \
                                  '\\\"pages\\\":{\\\"admin\\\":{\\\"view\\\":true,\\\"read_only\\\":false},' \
                                  '\\\"show_member\\\":{\\\"view\\\":true,\\\"read_only\\\":false},\\\"role\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false},\\\"failed_devices\\\":{' \
                                  '\\\"view\\\":true,\\\"read_only\\\":false}}}}\"'
        db.session.add(user_role)
        db.session.commit()

        print("\n** Super Admin Role Updated **\n", file=sys.stderr)

except Exception:
    traceback.print_exc()
