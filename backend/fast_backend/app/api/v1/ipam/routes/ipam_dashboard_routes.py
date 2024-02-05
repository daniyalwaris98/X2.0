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






router = APIRouter(
    prefix = '/ipam_dashboard',
    tags = ['ipam_dashboard']
)


@router.get("/tcp_open_ports", responses={
    200: {"model": PortsValue},
    500: {"model": str}
},
summary="API to get all ports and their counts from ip_table",
description="API to get all ports and their counts from ip_table"
)
async def tcp_open_ports():
    

    try:
        port_list = []
        port_counts =[]
        
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

            # If the open_ports is None or an empty string, consider it as "None"
            port = "None" if row[0] is None or row[0] == "" else row[0]

            port_list.append(port)
            port_counts.append(int(row[1]))

        print("port list is::::::::::::::::::::::::::::", port_list, file=sys.stderr)

        if len(port_list) <= 0:
            port_list = ["PortA", "PortB", "PortC", "Other"]
            port_counts = [0, 0, 0, 0]

        obj_dict = {"ports": port_list, "counts": port_counts}
        print("obj dict is:::::::::::::::::::::::::", obj_dict, file=sys.stderr)

        return JSONResponse(content=obj_dict, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
            content = "Error While Fetching The Data\nFor Port List and Frequency from ip_table",
            status_code = 500,
        )

        




@router.get("/ip_availability_summary", responses={
    200: {"model": Ip_Address_counts},
    500: {"model": str}
},
summary="API to get status counts from ip_table",
description="API to get status counts from ip_table"
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

            # Update the counts by adding the values from the current row
            available_ip += row[0]
            used_ip += row[1]
            total_ip += row[2]
        
        counts = {
            "total_ip": total_ip,
            "used_ip": used_ip,
            "available_ip": available_ip,
        }

        print("status counts are::::::::::::::::::::::::::::", counts, file=sys.stderr)

        return JSONResponse(content=counts, status_code =200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
            content = "Error While Fetching Status Counts from ip_table",
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
            "SELECT subnet_table.subnet_address, subent_usage_table.subnet_usage "
            "FROM subnet_table "
            "INNER JOIN subent_usage_table ON subnet_table.subnet_id = subent_usage_table.subnet_id"
        )

        result = configs.db.execute(query)
        print("result is::::::::::::::::", result, file=sys.stderr)
        
        subnet_address_list = []
        subnet_usage_list = []
        for row in result:
            print("row is::::::::::::::::::::::::::::", row, file=sys.stderr)
            subnet_address_list.append(row[0])
            subnet_usage_list.append(row[1])
        
        if len(subnet_address_list) <= 0:
            subnet_address_list = ["SubnetA", "subnetB", "Other"]
            subnet_usage_list= [0, 0, 0]
            obj_dict = {"subnet_address": subnet_usage_list, "subnet_usage": subnet_usage_list }
            print("obj dict is:::::::::::::::::::::::::", obj_dict, file=sys.stderr)
        else:
            subnets_data = list(zip(subnet_address_list, subnet_usage_list))
            #sorted_subnets = sorted(subnets_data, key=lambda x: (x[1] is None, x[1]), reverse=True)
        obj_dict = dict(subnets_data)
        print("obj dict is:::::::::::::::::::::::::", obj_dict, file=sys.stderr)
        return JSONResponse(content=obj_dict, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
           content =  "Error While Fetching The Data\nFor subnet_address and subnet_usage from subnet_table , subent_usage_table",
            status_code = 500,
        )
    



@router.get("/dns_summary", responses={
    200: {"model": ResponseDNSSummary},
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

        for row in result:
            print("row in result is::::::::::::::::::", row, file=sys.stderr)

            # Update the counts by adding the values from the current row
            not_resolved_ip += row[0]
            resolved_ip += row[1]
            # total_ip += row["total_ip"]

        counts = {
            "not_resolved_ip": not_resolved_ip,
            "resolved_ip": resolved_ip,
        }

        print("status counts are::::::::::::::::::::::::::::", counts, file=sys.stderr)

        return JSONResponse(content=counts, status_code =200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
            content = "Error While Fetching Status Counts from ip_table",
            status_code = 500,
        )



@router.get("/subnet_summary", responses={
    200: {"model": SubnetSummaryResponse},
    500: {"model": str}
},
summary="API to get subnet_summary",
description="API to get subnet_summary"
)
async def subnet_summary():
    try:
        query = (
            "SELECT "
            "COUNT(CASE WHEN subnet_state = 'manual' THEN 1 ELSE NULL END) AS manually_added, "
            "COUNT(CASE WHEN subnet_state = 'discovered' THEN 1 ELSE NULL END) AS discovered_added, "
            "COUNT(subnet_state) AS total_count "
            "FROM subnet_table"
        )

        print("Executing query:", query, file=sys.stderr)
        result = configs.db.execute(query)
        print("results is::::::::::::::::::::::::", result, file=sys.stderr)

        manually_added = 0
        discovered_added = 0
        total_count = 0

        for row in result:
            print("row in result is::::::::::::::::::", row, file=sys.stderr)

            # Update the counts by adding the values from the current row
            manually_added += row[0]
            discovered_added += row[1]
            total_count += row[2]
            
            
        counts = {
            "manually_added": manually_added ,
            "discovered_added" : discovered_added,
            "total_count": total_count,
        }
       
        print("subnet_state counts are::::::::::::::::::::::::::::", counts, file=sys.stderr)
        return JSONResponse(content=counts, status_code = 200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(
            content = "Error While Fetching subnet_state Counts from subnet_table",
            status_code = 500,
        )
