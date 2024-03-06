import traceback
from fastapi import HTTPException
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy import text
from collections import defaultdict
from app.api.v1.auto_discovery.auto_discovery_utils import *
from app.schema.base_schema import NameValueListOfDictResponseSchema, NameValueDictResponseSchema

router = APIRouter(
    prefix="/auto_discovery_dashboard",
    tags=["auto_discovery_dashboard"],
)


@router.get("/get_top_os_for_discovery", responses={
    200: {"model": list[NameValueListOfDictResponseSchema]},
    500: {"model": str}
},
summary="API to get top os for discovery ",
description=" API to get os for discovery"

)
async def get_top_os_for_discovery():
    try:
        query_string = (f"SELECT os_type,COUNT(os_type) AS count FROM "
                        f"auto_discovery_table GROUP BY OS_TYPE "
                        f"ORDER BY count DESC LIMIT 10;")
        result = configs.db.execute(query_string)
        print(result)
        obj_list = []
        for row in result:
            print("results is::::::::::::::::::::::::",  row[0], file=sys.stderr)
            print("results is::::::::::::::::::::::::",  row[1], file=sys.stderr)

            obj_list.append({"name": row[0], "value": row[1]})
        if  len(obj_list) <=0:
            obj_list=[{"name": "os", "value": 0}]
            print("obj_list is::::::::::::::::::::::::::::", obj_list, file=sys.stderr)
            return   JSONResponse(content=obj_list, status_code=200)  

        return JSONResponse(content=obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)


@router.get("/get_top_vendors_for_discovery", responses={
    200: {"model": list[NameValueListOfDictResponseSchema]},
    500: {"model": str}
}, 
summary ="API to get top vendors for discovery",
description = "API to get top vendors for discovery"
)

async def get_top_vendors_for_discovery():
    try:
        query_string = (f"SELECT vendor,COUNT(vendor) AS count FROM "
                        f"auto_discovery_table GROUP BY vendor ORDER BY count DESC LIMIT 10;")
        result = configs.db.execute(query_string)

        obj_list = []
        for row in result:
            #print(row[0])
            #print(row[1])
            obj_list.append({"name": row[0], "value": row[1]})
        print("objlist is::::::::::::::::::::::::::::", obj_list, file=sys.stderr)

        if  len(obj_list) <=0:
            obj_list=[{"name": "vender", "value": 0}]
            print("obj_list is::::::::::::::::::::::::::::", obj_list, file=sys.stderr)

            return   JSONResponse(content=obj_list, status_code=200)  

        return JSONResponse(content=obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)


@router.get("/get_snmp_status_graph", responses={
    200: {"model": list[NameValueListOfDictResponseSchema]},
    500: {"model": str}
},
summary ="API to get snmp status graph",
description = "API to snmp status graph"
)
async def get_snmp_status_graph():
    try:
        query_string = (f"SELECT snmp_status, COUNT(snmp_status) FROM "
                        f"auto_discovery_table GROUP BY snmp_status;")
        result = configs.db.execute(query_string)

        enable = 0
        disable = 0
        obj_list =[]
        for row in result:
            if row[0] == "Enabled":
                enable += row[1]
            else:
                disable += row[1]

        obj_list = [
            {"name": "SNMP Enabled", "value": enable},
            {"name": "SNMP Disabled", "value": disable},
        ]

        return JSONResponse(content=obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)



'''@router.get("/get_credentials_graph", responses={
    200: {"model": list[NameValueDictResponseSchema]},
    500: {"model": str}
},
summary ="API to get credentials graph ",
description = "API to get credentials graph"
)
async def get_credentials_graph():
    try:
        obj_list=[]
        obj_dict = {
            "name": ["SNMP V1/V2", "SNMP V3", "SSH Login"],
            "value": [0, 0, 0],
        }

        query_string = (f"SELECT snmp_version, COUNT(snmp_version) FROM "
                        f"auto_discovery_table GROUP BY snmp_version;")
        result = configs.db.execute(query_string)

        for row in result:
            if (row[0]) == "SNMPv2-MIB":
                obj_dict["value"][0] = row[1]
            elif (row[0]) == "SNMPv3-MIB":
                obj_dict["value"][1] = row[1]

        query_string = (f"SELECT ssh_status, COUNT(ssh_status) FROM "
                        f"auto_discovery_table GROUP BY ssh_status;")
        ssh_query = f"SELECT count(*) FROM password_group_table where password_group_type=='SSH';"
        ssh_result = configs.db.query(ssh_query).scalar()
        result1 = configs.db.execute(ssh_result)


        v1_v2_query = f"SELECT count(*) FROM  snmp_credentials_table where category=='v1/v2';"
        v1_v2_result = configs.db.query(ssh_query).scalar()
        result2 = configs.db.execute(v1_v2_result)

        v3_query = f"SELECT count(*) FROM  snmp_credentials_table where category=='v3';"
        v3_result = configs.db.query(ssh_query).scalar()
        result2 = configs.db.execute(v3_result)
        credentials_dict = [
            {
                "name":"v1_v2",
                "value":ssh_result
            }
        ]
        for row in result:
            if (row[0]) == "True":
                obj_dict["value"][2] = row[1]
        obj_list = ["name":]
        
        if  len(obj_dict) <=0:
            obj_list=[{
            "name": ["SNMP V1/V2", "SNMP V3", "SSH Login"],
            "value": [0, 0, 0]}]
            print("obj_list is::::::::::::::::::::::::::::", obj_list, file=sys.stderr)
            return   JSONResponse(content=obj_list, status_code=200)  
        obj_list=[obj_dict]
        return JSONResponse(content=obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)'''



'''@router.get("/get_credentials_graph", responses={
    200: {"model": list[NameValueDictResponseSchema]},
    500: {"model": str}
},
summary="API to get credentials graph",
description="API to get credentials graph"
)
async def get_credentials_graph():
    try:
        obj_list = []

        # Initialize obj_dict with default values
        obj_dict = {
            "name": ["SNMP V1/V2", "SNMP V3", "SSH Login"],
            "value": [0, 0, 0],
        }

        # Query SSH count
        ssh_query = text("SELECT count(*) FROM password_group_table WHERE password_group_type='SSH';")
        ssh_result = configs.db.query(ssh_query).scalar()
        obj_dict["value"][2] = ssh_result

        # Query SNMP v1/v2 count
        v1_v2_query = f"SELECT count(*) FROM snmp_credentials_table WHERE category='v1/v2';"
        v1_v2_result = configs.db.query(v1_v2_query).scalar()
        obj_dict["value"][0] = v1_v2_result

        # Query SNMP v3 count
        v3_query = f"SELECT count(*) FROM snmp_credentials_table WHERE category='v3';"
        v3_result = configs.db.query(v3_query).scalar()
        obj_dict["value"][1] = v3_result

        obj_list.append(obj_dict)

        if len(obj_list) <= 0:
            return JSONResponse(content=obj_list, status_code=200)

        return JSONResponse(content=obj_list, status_code=200)

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)'''


#from sqlalchemy import text

# @router.get("/get_credentials_graph", responses={
#     200: {"model": NameValueDictResponseSchema},
#     500: {"model": str}
# },
# summary="API to get credentials graph",
# description="API to get credentials graph"
# )
# async def get_credentials_graph():
#     try:
#         obj_list = []
#
#         obj_dict = {
#             "name": ["SNMP V1/V2", "SNMP V3", "SSH Login"],
#             "value": [0, 0, 0],
#         }
#
#
#         ssh_query = text("SELECT count(*) FROM password_group_table WHERE password_group_type='SSH';")
#         ssh_result = configs.db.execute(ssh_query).scalar()
#         obj_dict["value"][2] = ssh_result
#
#
#         v1_v2_query = text("SELECT count(*) FROM snmp_credentials_table WHERE category='v1/v2';")
#         v1_v2_result = configs.db.execute(v1_v2_query).scalar()
#         obj_dict["value"][0] = v1_v2_result
#
#
#         v3_query = text("SELECT count(*) FROM snmp_credentials_table WHERE category='v3';")
#         v3_result = configs.db.execute(v3_query).scalar()
#         obj_dict["value"][1] = v3_result
#
#         #obj_list.append(obj_dict)
#
#         if len(obj_dict) <= 0:
#             return JSONResponse(content=obj_dict, status_code=200)
#
#         return JSONResponse(content=obj_dict, status_code=200)
#
#     except Exception as e:
#         traceback.print_exc()
#         return JSONResponse(content="Server Error", status_code=500)

@router.get("/get_top_functions_for_discovery", responses={
    200: {"model": NameValueDictResponseSchema},
    500: {"model": str}
},
summary ="API to get get top functions for discovery ",
description = "API to get get top functions for discovery "
)
async def get_top_functions_for_discovery():
    try:
        query_string = (f"SELECT `function`,COUNT(`function`) AS count FROM "
                        f"auto_discovery_table GROUP BY `function` ORDER BY count DESC LIMIT 5;")
        result = configs.db.execute(query_string)

        '''obj_dict = {"name": [], "value": []}
        for row in result:
            obj_dict["name"].append(row[0].capitalize())
            obj_dict["value"].append(row[1])

        return JSONResponse(content=obj_dict, status_code=200)'''
        obj_list = {}
        name=[]
        value=[]
        for row in result:
            name.append(row[0].capitalize())
            value.append(row[1])
        obj_list = {"name": name, "value": value}

        print("result..................",obj_list,file=sys.stderr)    
        if len(obj_list)<=0:
            obj_list={{"name": "port", "value": 0}}
            return JSONResponse(content=obj_list, status_code=200)

        #print("result..................",obj_list,file=sys.stderr)
        return JSONResponse(content=obj_list, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)

@router.get('/get_credentials_graph',responses = {
    200:{"model":str},
    500:{"model":str}
},
summary="API to get the discovery history",
description="API to get the discovery history"
)
async def get_discovery_history_data():
    try:
        get_history = configs.db.query(auto_discovery_history_table).all()
        data_dict = defaultdict(lambda: defaultdict(lambda: [0, 0, 0]))

        for history in get_history:
            day = history.creation_date.strftime('%A')  # Get the day name (e.g., Monday, Tuesday)
            snmp_v1_v2_count = 1 if history.snmp_status == 'Enabled' and history.snmp_version == 'v1/v2' else 0
            snmp_v3_count = 1 if history.snmp_status == 'Enabled' and history.snmp_version == 'v3' else 0
            ssh_count = 1 if history.ssh_status else 0

            data_dict[day]['SNMP V1/V2'][0] += snmp_v1_v2_count
            data_dict[day]['SNMP V3'][1] += snmp_v3_count
            data_dict[day]['SSH Login'][2] += ssh_count

        labels = list(data_dict.keys())
        snmp_v1_v2_values = [data_dict[day]['SNMP V1/V2'][0] for day in labels]
        snmp_v3_values = [data_dict[day]['SNMP V3'][1] for day in labels]
        ssh_values = [data_dict[day]['SSH Login'][2] for day in labels]

        data_list = [
            {"name": "SNMP V1/V2", "values": snmp_v1_v2_values},
            {"name": "SNMP V3", "values": snmp_v3_values},
            {"name": "SSH Login", "values": ssh_values}
        ]
        return {"values": data_list, "labels": labels}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Error occurred while fetching history data")
# async def get_discovery_history_data():
#     try:
#         get_history = configs.db.query(auto_discovery_history_table).all()
#         snmp_v1_v2_value_list = []
#         snmp_v3_value_list = []
#         ssh_value_list = []
#
#         v1_v2_query = f"SELECT COUNT(*) AS count, DAYNAME(creation_date) AS day FROM auto_discovery_history_table WHERE snmp_status='Enabled' AND snmp_version='v1/v2' GROUP BY day;"
#         v2_results = configs.db.execute(v1_v2_query).fetchall()
#
#         count_list = [result[0] for result in v2_results]
#         day_list = [result[1] for result in v2_results]
#
#         # Extending the count list to match your requirement
#         # snmp_v1_v2_value_list.extend(
#         #     [count_list[i % len(count_list)] + (i // len(count_list)) for i in range(4 * len(count_list))])
#         v2_query = f"SELECT COUNT(*) FROM auto_discovery_history_table WHERE snmp_status='Enabled' AND snmp_version='v1/v2';"
#         v2_result = configs.db.execute(v2_query).scalar()
#         snmp_v1_v2_value_list.extend([v2_result + i for i in range(4)])
#         v3_query = f"SELECT COUNT(*) FROM auto_discovery_history_table WHERE snmp_status='Enabled' AND snmp_version='v3';"
#         v3_result = configs.db.execute(v3_query).scalar()
#         snmp_v3_value_list.extend([v3_result + i for i in range(4)])
#
#
#         ssh_query = f"SELECT COUNT(*) FROM auto_discovery_history_table WHERE ssh_status=TRUE;"
#         ssh_result = configs.db.execute(ssh_query).scalar()
#         ssh_value_list.extend([ssh_result + i for i in range(4)])
#
#
#         data_list = [
#             {"name": 'SSH Login', "step": 'end', "values": ssh_value_list, "label": day_list[0] if day_list else ""},
#             {"name": 'SNMP V1/V2', "step": 'start', "values": snmp_v1_v2_value_list, "label": day_list[0] if day_list else ""},
#             {"name": 'SNMP V3', "step": 'middle', "values": snmp_v3_value_list, "label": day_list[0] if day_list else ""},
#         ]
#         return data_list
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail="Error occurred while fetching history data")
