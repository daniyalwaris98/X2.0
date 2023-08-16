from app.db_migrations.user_role_setup import *
import time
from app import db

from app.models.users_model import License_Verification_Table
from app.models.users_model import End_User_Table
from app.models.users_model import User_Roles_Table
from app.models.users_model import User_Table
from app.models.users_model import Login_Activity_Table

from app.models.atom_models import Password_Group_Table
from app.models.atom_models import Site_Table
from app.models.atom_models import Rack_Table
from app.models.atom_models import Atom_Table
from app.models.atom_models import Atom_Transition_Table

from app.models.auto_discovery_models import Auto_Discovery_Network_Table
from app.models.auto_discovery_models import Auto_Discovery_Table

from app.models.uam_models import UAM_Device_Table
from app.models.uam_models import Board_Table
from app.models.uam_models import Subboard_Table
from app.models.uam_models import Sfps_Table
from app.models.uam_models import License_Table
from app.models.uam_models import SNTC_TABLE
from app.models.uam_models import APS_TABLE

from app.models.monitoring_models import Alert_Cpu_Threshold_Table
from app.models.monitoring_models import Alert_Memory_Threshold_Table
from app.models.monitoring_models import Monitoring_Credentails_Table
from app.models.monitoring_models import Monitoring_Devices_Table
from app.models.monitoring_models import Monitoring_Alerts_Table

from app.models.ncm_models import NCM_Device_Table
from app.models.ncm_models import NCM_History_Table
from app.models.ncm_models import NCM_Alarm_Table


def create_database():
    print("Running Database Migartion...", file=sys.stderr)

    flag = True
    while flag:
        try:
            db.create_all()
            flag = False
        except Exception:
            traceback.print_exc()
            time.sleep(3)

    print("===>>> Database Migartion Complete\n", file=sys.stderr)


def setup_threashold():
    for i in range(3):
        try:
            cpu = Alert_Cpu_Threshold_Table.query.filter(
                Alert_Cpu_Threshold_Table.ip_address == "All"
            ).first()
            if cpu is None:
                cpu = Alert_Cpu_Threshold_Table()
                cpu.ip_address = "All"
                cpu.low_threshold = 50
                cpu.medium_threshold = 70
                cpu.critical_threshold = 90
                cpu.pause_min = 60
                InsertDBData(cpu)

            memory = Alert_Memory_Threshold_Table.query.filter(
                Alert_Memory_Threshold_Table.ip_address == "All"
            ).first()
            if memory is None:
                memory = Alert_Memory_Threshold_Table()
                memory.ip_address = "All"
                memory.low_threshold = 50
                memory.medium_threshold = 70
                memory.critical_threshold = 90
                memory.pause_min = 60
                InsertDBData(memory)

            print("===>>> Alert Threashold Setup Complete\n", file=sys.stderr)
            return
        except:
            traceback.print_exc()
            time.sleep(3)

    print("\n** Error While Running Alert Threashold Setup **\n", file=sys.stderr)


def setup_null_site():
    site = Site_Table.query.filter(Site_Table.site_name == "NA").first()

    if site is None:
        site = Site_Table()
        site.site_name = "NA"
        site.status = "Production"
        InsertDBData(site)


def setup_null_rack():
    rack = Rack_Table.query.filter(
        Rack_Table.rack_name == "NA" and Rack_Table.site_id == 1
    ).first()
    
    site = Site_Table.query.filter(Site_Table.site_name == "NA").first()

    if rack is None:
        rack = Rack_Table()
        rack.rack_name = "NA"
        rack.status = "Production"
        rack.site_id = site.site_id
        InsertDBData(rack)
        
def setup_null_password_group():
    password = Password_Group_Table.query.filter(
        Password_Group_Table.password_group == "NA" and Password_Group_Table.password_group_id == 1
    ).first()

    if password is None:
        password = Password_Group_Table()
        password.password_group = "NA"
        password.password_group_type = "SSH"
        password.username = 'admin'
        password.password = 'admin'
        InsertDBData(password)


def default_setup():
    print("\n** Running User Role Setup... **", file=sys.stderr)
    setup_user_role()

    print("** Running Alert Threashold Setup... **", file=sys.stderr)
    setup_threashold()

    print("** Running Site And Rack Setup... **", file=sys.stderr)
    setup_null_site()
    setup_null_rack()
    setup_null_password_group()

    print("===>>> Default Setup Complete\n", file=sys.stderr)
