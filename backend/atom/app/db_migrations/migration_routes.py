import traceback
import sys

from app import app, db
from app.db_migrations.migrations_utils import *


@app.route("/dropDatabase", methods=["GET"])
def dropDatabase():
    try:
        
        print("Database Dropping Started", file = sys.stderr)
        
        from app.models.users_model import Login_Activity_Table
        from app.models.users_model import User_Table
        from app.models.users_model import User_Roles_Table
        from app.models.users_model import End_User_Table
        from app.models.users_model import License_Verification_Table

        from app.models.atom_models import Atom_Transition_Table
        from app.models.atom_models import Atom_Table
        from app.models.atom_models import Rack_Table
        from app.models.atom_models import Site_Table
        from app.models.atom_models import Password_Group_Table

        from app.models.auto_discovery_models import Auto_Discovery_Network_Table
        from app.models.auto_discovery_models import Auto_Discovery_Table

        from app.models.uam_models import Board_Table
        from app.models.uam_models import Subboard_Table
        from app.models.uam_models import Sfps_Table
        from app.models.uam_models import License_Table
        from app.models.uam_models import SNTC_TABLE
        from app.models.uam_models import APS_TABLE
        from app.models.uam_models import UAM_Device_Table
        
        from app.models.monitoring_models import Monitoring_Alerts_Table
        from app.models.monitoring_models import Monitoring_Devices_Table
        from app.models.monitoring_models import Monitoring_Credentails_Table
        from app.models.monitoring_models import Alert_Cpu_Threshold_Table
        from app.models.monitoring_models import Alert_Memory_Threshold_Table
        
        from app.models.ncm_models import NCM_History_Table
        from app.models.ncm_models import NCM_Alarm_Table
        from app.models.ncm_models import NCM_Device_Table
        
        db.drop_all()
        return "Database Dropped Successfully", 500
    except Exception as e:
        traceback.print_exc()
        return f"Error While Droping Database : {e}", 500


@app.route("/createDatabase", methods=["GET"])
def createDatabase():
    try:
        create_database()
        return "Database Migration Successful", 500
    except Exception as e:
        traceback.print_exc()
        return f"Error While Ruuning Database Migrations {e}", 500


@app.route("/runSetup", methods=["GET"])
def runSetup():
    try:
        default_setup()
        return "Default Setup Successful", 500
    except Exception as e:
        traceback.print_exc()
        return f"Error In Default Setup {e}", 500
