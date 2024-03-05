from fastapi import FastAPI,APIRouter,Query
from starlette.responses import Response
from fastapi.responses import JSONResponse
import traceback
import sys
from datetime import timedelta
from app.core.config import configs
from app.models.ipam_models import *
from app.schema.base_schema import *
from app.schema.ipam_schema import *

#boto3==1.34.30




router = APIRouter(
    prefix = '/ipam_dashboard',
    tags = ['ipam_dashboard']
)


@router.get("/tcp_open_ports", responses={
    200: {"model": PortsValue},
    500: {"model": str}
},
summary="API to get all ports and their obj_list from ip_table",
description="API to get all ports and their obj_list from ip_table"
)
async def get_port_list():
    try:
        port_dict = {}

        query = (
            "SELECT open_ports, COUNT(open_ports) AS frequency "
            "FROM ip_table "
            "GROUP BY open_ports"
        )

        print("Executing query:", query, file=sys.stderr)
        result = configs.db.execute(query)
        print("results is::::::::::::::::::::::::", result, file=sys.stderr)

        for row in result:
            print("row in result is::::::::::::::::::", row, file=sys.stderr)
            ports = row[0].split(', ') if row[0] else ['None']
            for port in ports:
                port_dict[port] = max(port_dict.get(port, 0), int(row[1]))

        print("port dict is::::::::::::::::::::::::::::", port_dict, file=sys.stderr)

        obj_list = [{"name": port, "value": value} for port, value in port_dict.items()]

        print("obj list is::::::::::::::::::::::::::::", obj_list, file=sys.stderr)

        if not obj_list:
            obj_list = [{"name": "None", "value": 0}]

        return JSONResponse(content=obj_list, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
            content="Error While Fetching The Data\nFor Port List and Frequency from ip_table",
            status_code=500,
        )



@router.get("/ip_availability_summary", responses={
    200: {"model": IpAddressobjlist},
    500: {"model": str}
},
summary="API to get status obj_list from ip_table",
description="API to get status obj_list from ip_table"
)
async def ip_availability_summary():
    try:
        query = (
            "SELECT "
            "COUNT(CASE WHEN status = 'available' THEN 1 ELSE NULL END) AS available_ip, "
            "COUNT(CASE WHEN status = 'used' THEN 1 ELSE NULL END) AS used_ip, "
            "COUNT(DISTINCT ip_address) AS total_ip "
            "FROM ip_table"
        )

        print("Executing query:", query, file=sys.stderr)
        result = configs.db.execute(query)
        print("results is::::::::::::::::::::::::", result, file=sys.stderr)

        available_ip = 0
        used_ip = 0
        total_ip = 0

        for row in result:
            print("row in result is::::::::::::::::::", row, file=sys.stderr)

            # Update the obj_list by adding the values from the current row
            available_ip += row[0]
            used_ip += row[1]
            total_ip += row[2]
        
        obj_list = {
            "total_ip": total_ip,
            "used_ip": used_ip,
            "available_ip": available_ip,
        }

        print("status obj_list are::::::::::::::::::::::::::::", obj_list, file=sys.stderr)

        return JSONResponse(content=obj_list, status_code =200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
            content = "Error While Fetching Status obj_list from ip_table",
            status_code = 500,
        )






@router.get("/dns_summary", responses={
    200: {"model": list[ResponseDNSSummary]},
    500: {"model": str}
},
summary="API to get DNS summary status",
description="API to get DNS summary"
)
async def DNS_Summary():
    try:
        query = (
            "SELECT "
            "COUNT(CASE WHEN status = 'available' AND ip_dns = 'Not Found' THEN 1 END) AS not_resolved_ip, "
            "COUNT(CASE WHEN status = 'used' AND ip_dns != 'Not Found' THEN 1 END) AS resolved_ip, "
            "COUNT(DISTINCT ip_address) AS total_ip "
            "FROM ip_table"
        )

        print("Executing query:", query, file=sys.stderr)
        result = configs.db.execute(query)
        print("results is::::::::::::::::::::::::", result, file=sys.stderr)

        not_resolved_ip = 0
        resolved_ip = 0
        obj_list =[]

        for row in result:
            print("row in result is::::::::::::::::::", row, file=sys.stderr)

            # Update the obj_list by adding the values from the current row
            not_resolved_ip += row[0]
            resolved_ip += row[1]
            # total_ip += row["total_ip"]


        obj_list =[
            {"name":"not_resolved_ip","value":not_resolved_ip},
            {"name":"resolved_ip","value": resolved_ip}]
        if not_resolved_ip == 0 and resolved_ip==0:
            obj_data = [
                {"name":"not_resolved_ip","value":12},
                {"name":"resolved_ip","value": 20}]
            return obj_data
        else:
            print("status obj_list are::::::::::::::::::::::::::::", obj_list, file=sys.stderr)
            return JSONResponse(content=obj_list, status_code =200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
            content = "Error While Fetching Status obj_list from ip_table",
            status_code = 500,
        )



@router.get("/subnet_summary", responses={
    200: {"model": list[SubnetSummaryResponse]},
    500: {"model": str}
},
summary="API to get subnet_summary",
description="API to get subnet_summary"
)
async def subnet_summary():
    try:
        query = (
            "SELECT "
            "COUNT(CASE WHEN discovered = 'Not Discovered' THEN 1 ELSE NULL END) AS manually_added, "
            "COUNT(CASE WHEN discovered = 'Discovered' THEN 1 ELSE NULL END) AS discovered_added, "
            "COUNT(subnet_state) AS total_count "
            "FROM subnet_table"
        )
        print("Executing query::::::::::::::::::::", query, file=sys.stderr)
        result = configs.db.execute(query)
        print("results is::::::::::::::::::::::::::::", result, file=sys.stderr)
        obj_list =[]

        manually_added = 0
        discovered_added = 0
        # total_count = 0

        for row in result:
            print("row in result is::::::::::::::::::::::::::::", row, file=sys.stderr)

            # Update the obj_list by adding the values from the current row
            manually_added += row[0]
            discovered_added += row[1]
            print(f"manual addedd {manually_added} :::::::::::: discovered{discovered_added}",file=sys.stderr)
            #total_count += row[2]
            
            
        obj_list = [{
            "name":"manually_added","value": manually_added},{
            "name":"discovered_added" ,"value": discovered_added} ]
       
        print("subnet_state obj_list are::::::::::::::::::::::::::::", obj_list, file=sys.stderr)
        return JSONResponse(content=obj_list, status_code = 200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
            content = "Error While Fetching subnet_state obj_list from subnet_table",
            status_code = 500,
        )


@router.get("/type_summary", responses={
    200: {"model": List[TypeSummaryResponse]},
    500: {"model": str}
},
summary="API to get type_summary",
description="API to get type_summary"
)
async def type_summary():
    try:
        query = (
                f"SELECT atom_table.vendor, COUNT(*) AS obj_list "
                f"FROM  ipam_devices_fetch_table "
                f"INNER JOIN atom_table ON ipam_devices_fetch_table.atom_id = atom_table.atom_id "
                f"GROUP BY vendor;")

        #print("query string is::::::::::::::::::::::::",query=sys.stderr)
        result = configs.db.execute(query)
        print("reuslt is:::::::::::",result,file=sys.stderr)
        objt_list=[]
        print("result...............",result , file = sys.stderr)

        for row in result:
            print("row is::::::::::::::::::::::", row, file=sys.stderr)
            print("row [0] is:::::::::::::::", row[0], file=sys.stderr)
            print("row[1] is:::::::::::::::::::", row[1], file=sys.stderr)
            objt_dict = {"vender": row[0],"obj_list": row[1],
                         }
            print("obj dict is::::::::::::::::::::", objt_dict, file=sys.stderr)
            objt_list.append(objt_dict)
   

        print("objlist is:::::::::::::::::", objt_list, file=sys.stderr)
        summery_data = [
            {
                "vender":"Cisco",
                "obj_list":200
            },
            {
                "vender": "Fortinet",
                "obj_list": 150
            },
            {
                "vender": "Linux",
                "obj_list": 150
            },
            {
                "vender": "HC3Huawei",
                "obj_list": 150
            }
        ]
        return  JSONResponse(content=summery_data, status_code = 200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
            content = "Error While Fetching subnet_state obj_list from subnet_table",
            status_code = 500,
        )
    


@router.get('/top_10_subnet_ip_used', responses={
    200: {"model":dict},
    500: {"model": str}
}, summary="API to get top 10_subnet_ip_used",
description="API to get top_10_subnet_ip_used"
)
def top_10_subnet_ip_used():
    try:
        query = (
            "SELECT "
            "subnet_table.subnet_address, "
            "subent_usage_table.subnet_usage, "
            "atom_table.ip_address, "
            "atom_table.device_name, "
            "atom_table.function "
            "FROM "
            "subnet_table "
            "INNER JOIN subent_usage_table ON subnet_table.subnet_id = subent_usage_table.subnet_id "
            "INNER JOIN ipam_devices_fetch_table ON subnet_table.ipam_device_id = ipam_devices_fetch_table.ipam_device_id "
            "INNER JOIN atom_table ON ipam_devices_fetch_table.atom_id = atom_table.atom_id"
        )

        result = configs.db.execute(query)
        print("result is::::::::::::::::", result, file=sys.stderr)

        subnet_data_list = []
        for row in result:
            subnet_data_list.append({
                "subnet_address": row[0],
                "subnet_usage": row[1],
                "ip_address": row[2],
                "device_name": row[3],
                "function": row[4]
            })

        if len(subnet_data_list) <= 0:
            subnet_data_list = [
                {"subnet_address": "SubnetA", "subnet_usage": 0, "ip_address": "IP", "device_name": "Device",
                 "function": "Function"}]

        sorted_subnets = sorted(subnet_data_list, key=lambda x: x["subnet_usage"], reverse=True)
        result_list = sorted_subnets[:10]

        print("obj dict is:::::::::::::::::::::::::", result_list, file=sys.stderr)
        return JSONResponse(content=result_list, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
            content="Error While Fetching The Data\nFor subnet_address and subnet_usage from subnet_table, subent_usage_table",
            status_code=500,
        )
    

