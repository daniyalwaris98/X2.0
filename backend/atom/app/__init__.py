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
# try:
#     firebase_cred = credentials.Certificate(f"{cwd}/app/static/firebase-key.json")
#     firebase_app = firebase_admin.initialize_app(firebase_cred)
#     print("Firebase Connection Established", file=sys.stderr)
# except:
#     traceback.print_exc()
#     print("Firebase API Failed", file=sys.stderr)

SWAGGER_URL = "/api/docs"  # URL for exposing Swagger UI (without trailing '/')
API_URL = f"/static/api_doc.json"  # Our API url (can of course be a local resource)

# try:
#     # Call factory function to create our blueprint
#     swaggerui_blueprint = get_swaggerui_blueprint(
#         SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
#         API_URL,
#         config={"app_name": "MonetX - APIs"},  # Swagger UI config overrides
#         # oauth_config={  # OAuth config. See https://github.com/swagger-api/swagger-ui#oauth2-configuration .
#         #    'clientId': "your-client-id",
#         #    'clientSecret': "your-client-secret-if-required",
#         #    'realm': "your-realms",
#         #    'appName': "your-app-name",
#         #    'scopeSeparator': " ",
#         #    'additionalQueryStringParams': {'test': "hello"}
#         # }
#     )

#     app.register_blueprint(swaggerui_blueprint)
#     print("Swagger API Setup", file=sys.stderr)
# except:
#     traceback.print_exc()
#     print("Swagger API Failed", file=sys.stderr)

# CORS(app)
# swagger = Swagger(app)
cors = CORS(app, supports_credentials=True)
api = Api(app)
app.secret_key = "monetx_token"
SESSION_TYPE = "filesystem"
app.config.from_object(__name__)
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = "OCML3BRawWEUeaxcuKHLpw"
app.config["CORS_HEADERS"] = "Content-Type"

app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "mysql+pymysql://root:As123456?@updated_atom_db:3306/AtomDB"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


token = "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A=="
org = "monetx"
bucket = "monitoring"

# client = InfluxDBClient(url="http://10.254.168.159:8086", token=token, org=org)
# client = InfluxDBClient(url="http://influxdb:8086", token=token, org=org)
client = InfluxDBClient(url="http://updated_influx_db:8086", token=token, org=org)

from app.db_migrations.migrations_utils import *

try:
    
    while True:
        print("Connecting To MySQL...", file=sys.stderr)
        try:
            db.session.execute('SELECT 1')
            break
        except Exception:
            print("** ERROR : MySQL Connection Refused **", file=sys.stderr)
            time.sleep(5)
    
    create_database()
    default_setup()
except Exception:
    traceback.print_exc()


from app.db_migrations import migration_routes

from app.license import license_generator

from app.users import one_time_setup
from app.users import login_routes
from app.users import admin_routes
from app.routes import test_routes

from app.atom import atom_routes
from app.atom import atom_transition_routes
from app.atom import password_group_routes
from app.atom import atom_onboard_routes

from app.auto_discovery import auto_discovery_routes
from app.auto_discovery import auto_discovery_dashboard_routes

from app.uam import site_routes
from app.uam import rack_routes
from app.uam import uam_device_routes
from app.uam import module_routes
from app.uam import sfp_routes
from app.uam import aps_routes
from app.uam import license_routes

from app.monitoring_device.routes import monitoring_routes
from app.monitoring_device.routes import monitoring_dashboard_routes
from app.monitoring_device.routes import alerts_routes
from app.monitoring_device.routes import monitoring_credentials_routes
from app.monitoring_device.routes import monitoring_scheduler

from app.ncm import ncm_routes
from app.ncm import ncm_dashboard_routes

