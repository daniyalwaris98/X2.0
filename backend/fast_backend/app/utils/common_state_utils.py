import traceback
import traceback
import sys
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.utils.db_utils import *
from app.core.config import configs
from app.models.common_models import *

def update_and_add_function_state(function,action_state):
    try:
        print(f"function {function} :::::::::::::: action_state: {action_state}",file=sys.stderr)
        check_function_state_existence = configs.db.query(FucntionStateTable).filter_by(function_name = function ).first()
        if check_function_state_existence:
            if action_state == 'Running':
                check_function_state_existence.function_name = function
                # check_function_state_existence.function_state = 'Running'
                check_function_state_existence.start_time = datetime.now()
                check_function_state_existence.end_time = None
                check_function_state_existence.running = True
                UpdateDBData(check_function_state_existence)
                print(f"updated data for the check function state {check_function_state_existence.running}",file=sys.stderr)
            elif action_state == 'Completed':
                # check_function_state_existence.function_state = 'Completed'
                check_function_state_existence.end_time = datetime.now()
                check_function_state_existence.running = False
                UpdateDBData(check_function_state_existence)
        else:
            function_table = FucntionStateTable(
                function_name = function,
                start_time = datetime.now(),
                running = True,
            )
            InsertDBData(function_table)
            print("data inserted into the function table::::::::::::",file=sys.stderr)



    except Exception as e:
        traceback.print_exc()
        return "error occured while update and function state",str(e)