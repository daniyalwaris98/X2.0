from app.db_migrations.user_role_setup import *
from app.models.monitoring_models import *
import time
from app import db



def run_migration():
    
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
    
    print("Running Alert Threashold Setup...", file=sys.stderr)
    for i in range(3):
        try:
            cpu = Alert_Cpu_Threshold_Table.query.filter(Alert_Cpu_Threshold_Table.ip_address=='All').first()
            if cpu is None:
                cpu = Alert_Cpu_Threshold_Table()
                cpu.ip_address = 'All'
                cpu.low_threshold = 50
                cpu.medium_threshold = 70
                cpu.critical_threshold = 90
                cpu.pause_min = 60
                InsertDBData(cpu)
            
            memory = Alert_Memory_Threshold_Table.query.filter(Alert_Memory_Threshold_Table.ip_address=='All').first()
            if memory is None:
                memory = Alert_Memory_Threshold_Table()
                memory.ip_address = 'All'
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
    

def run_setup():
    
    print("\n** Running User Role Setup... **", file=sys.stderr)
    while setup_user_role():
        time.sleep(5)
    
    setup_threashold()
    print("===>>> Migration Setup Complete\n", file=sys.stderr)
    