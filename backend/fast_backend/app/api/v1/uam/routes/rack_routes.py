from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.api.v1.uam.utils.rack_utils import *
from app.schema.site_rack_schema import *
from app.models.site_rack_models import *

router = APIRouter(
    prefix="/rack",
    tags=["rack"],
)


@router.post("/add-rack", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def add_rack(rack: AddRackRequestSchema):
    try:
        response, status = add_rack_util(rack)
        return JSONResponse(content=response, status_code=status)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Adding Rack", status_code=500)


@router.post("/edit-rack", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def edit_rack(rack: EditRackRequestSchema):
    try:
        response, status = edit_rack_util(rack)
        return JSONResponse(content=response, status_code=status)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Updating Rack", status_code=500)


@router.post("/delete-rack", responses={
    200: {"model": SummeryResponseSchema},
    400: {"model": str},
    500: {"model": str}
})
async def delete_rack(rack_ids: list[int]):
    try:
        response, status = delete_rack_util(rack_ids)
        return JSONResponse(content=response, status_code=status)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Deleting Rack", status_code=500)


@router.get("/get-racks-by-site-dropdown", responses={
    200: {"model": list[str]},
    500: {"model": str}
})
async def get_rack_by_site(site_obj: GetRackBySiteRequestSchema):
    try:
        obj_list = []

        result = (
            configs.db.query(RackTable, SiteTable)
            .join(SiteTable, RackTable.site_id == SiteTable.site_id)
            .filter(SiteTable.site_name == site_obj['site_name'])
            .all()
        )

        for rack, site in result:
            rack_name = rack.rack_name
            obj_list.append(rack_name)

        return JSONResponse(content=obj_list, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Rack", status_code=500)


@router.get("/get-rack-by-rack-name", responses={
    200: {"model": list[GetRackResponseSchema]},
    500: {"model": str}
})
async def get_rack_by_rack_name(rack_obj: GetRackByRackNameRequestSchema):
    try:
        response, status = get_rack_details_by_rack_name(rack_obj['rackname'])
        return JSONResponse(content=response, status_code=status)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Rack", status_code=500)


@router.get("/getAllRacks", responses={
    200: {"model": list[GetSiteResponseSchema]},
    500: {"model": str}
})
async def get_all_racks():
    try:
        response = get_all_racks()
        return JSONResponse(content=response, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Rack", status_code=500)


@router.get("/totalRacks")
async def total_racks():
    try:
        query_string = f"select count(distinct RACK_NAME) from rack_table;"
        result = configs.db.execute(query_string).scalar()

        query_string1 = f"select count(*) from uam_device_table;"
        result1 = configs.db.execute(query_string1).scalar()

        query_string2 = f"select sum(RU) from rack_table;"
        result2 = configs.db.execute(query_string2).scalar()

        obj_list = [
            {"name": "Racks", "value": result if result is not None else 0},
            {"name": "Devices", "value": result1 if result1 is not None else 0},
            {"name": "Total RU", "value": result2 if result2 is not None else 0},
        ]

        return JSONResponse(content=obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Rack", status_code=500)


@router.get("/rackLeaflet")
async def rack_leaflet():
    try:
        query_string = f"select LONGITUDE,LATITUDE from site_table where site_id in (select site_id from rack_table);"
        result = configs.db.execute(query_string)

        obj_list = []
        for row in result:
            longitude = row[0]
            latitude = row[1]
            obj_dict = {"longitude": longitude, "latitude": latitude}
            obj_list.append(obj_dict)

        return JSONResponse(content=obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Rack", status_code=500)


@router.get("/allFloors")
async def all_floors():
    try:

        obj_list = []
        query_string = f"select FLOOR from rack_table;"
        result = configs.db.execute(query_string)

        for row in result:
            floor = row[0]
            obj_list.append(floor)
        print(obj_list, file=sys.stderr)

        return JSONResponse(content=obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Rack", status_code=500)


@router.get("/allRacks")
async def all_racks():
    try:
        obj_list = []
        racks = get_all_racks()

        for rack in racks:
            obj_list.append(rack["rack_name"])

        print(obj_list, file=sys.stderr)

        return JSONResponse(content=obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Rack", status_code=500)


@router.get("/topRacks")
async def top_racks():
    try:
        query_string = f"select site_table.site_name,count(rack_name) from rack_table inner join site_table on rack_table.site_id = site_table.site_id group by site_name order by count(rack_name) DESC;"
        result = configs.db.execute(query_string)

        obj_list = []
        for row in result:
            sites = row[0]
            count = row[1]
            obj_dict = {"name": sites, "value": count}
            obj_list.append(obj_dict)

        return JSONResponse(content=obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Rack", status_code=500)
