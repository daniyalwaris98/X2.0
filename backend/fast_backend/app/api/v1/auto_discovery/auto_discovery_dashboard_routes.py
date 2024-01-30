from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.api.v1.auto_discovery.auto_discovery_utils import *
from app.schema.base_schema import NameValueListOfDictResponseSchema, NameValueDictResponseSchema

router = APIRouter(
    prefix="/auto_discovery_dashboard",
    tags=["auto_discovery_dashboard"],
)


@router.get("/get_top_os_for_discovery", responses={
    200: {"model": list[NameValueListOfDictResponseSchema]},
    500: {"model": str}
})
async def get_top_os_for_discovery():
    try:
        query_string = (f"SELECT os_type,COUNT(os_type) AS count FROM "
                        f"auto_discovery_table GROUP BY OS_TYPE "
                        f"ORDER BY count DESC LIMIT 10;")
        result = configs.db.execute(query_string)

        obj_list = []
        for row in result:
            obj_list.append({"name": row[0], "value": row[1]})

        return JSONResponse(content=obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)


@router.get("/get_top_vendors_for_discovery", responses={
    200: {"model": list[NameValueListOfDictResponseSchema]},
    500: {"model": str}
})
async def get_top_vendors_for_discovery():
    try:
        query_string = (f"SELECT vendor,COUNT(vendor) AS count FROM "
                        f"auto_discovery_table GROUP BY vendor ORDER BY count DESC LIMIT 10;")
        result = configs.db.execute(query_string)

        obj_list = []
        for row in result:
            obj_list.append({"name": row[0], "value": row[1]})

        return JSONResponse(content=obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)


@router.get("/get_snmp_status_graph", responses={
    200: {"model": list[NameValueListOfDictResponseSchema]},
    500: {"model": str}
})
async def get_snmp_status_graph():
    try:
        query_string = (f"SELECT snmp_status, COUNT(snmp_status) FROM "
                        f"auto_discovery_table GROUP BY snmp_status;")
        result = configs.db.execute(query_string)

        enable = 0
        disable = 0

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


@router.get("/get_top_functions_for_discovery", responses={
    200: {"model": list[NameValueDictResponseSchema]},
    500: {"model": str}
})
async def get_top_functions_for_discovery():
    try:
        query_string = (f"SELECT `function`,COUNT(`function`) AS count FROM "
                        f"auto_discovery_table GROUP BY `function` ORDER BY count DESC LIMIT 5;")
        result = configs.db.execute(query_string)

        obj_dict = {"name": [], "value": []}
        for row in result:
            obj_dict["name"].append(row[0].capitalize())
            obj_dict["value"].append(row[1])

        return JSONResponse(content=obj_dict, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)


@router.get("/get_credentials_graph", responses={
    200: {"model": list[NameValueDictResponseSchema]},
    500: {"model": str}
})
async def get_credentials_graph():
    try:
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
        result = configs.db.execute(query_string)

        for row in result:
            if (row[0]) == "True":
                obj_dict["value"][2] = row[1]

        return JSONResponse(content=obj_dict, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)
