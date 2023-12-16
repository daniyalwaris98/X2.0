from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi import APIRouter
from app.api.v1.monitoring.device.utils.monitoring_utils import *
from app.api.v1.monitoring.device.utils.alerts_utils import *
from app.api.v1.monitoring.device.utils.puller_utils import *
from app.api.v1.monitoring.device.utils.common_puller import *
from app.api.v1.monitoring.device.utils.ping_parse import *
import sys
import traceback
from datetime import  datetime
import threading
from app.api.v1.monitoring.device.utils.scheduler import *

scheduler = Scheduler()

def job_to_execute():
    print("jon executed at:::",datetime.now(),file=sys.stderr)


scheduler.add_job(
    func=job_to_execute,
    trigger=CronTrigger(hour=12, minute=27),
    id='job_two'
)

def GenerateAlertMail():
    pass

def create_monitoring_poll(devicePoll):
    try:
        threads = []
        for host in devicePoll:
            Obj = CommonPuller()
            thread = threading.Thread(
                target=Obj.poll,
                args=(host,)
            )
            thread.start()
            threads.append(thread)

        for th in threads:
            th.join()
    except Exception as e:
        traceback.print_exc()

