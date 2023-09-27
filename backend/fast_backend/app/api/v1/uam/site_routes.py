from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.api.v1.uam.site_utils import *
from app.schema.site_rack_schema import *
from app.models.site_rack_models import *

router = APIRouter(
    prefix="/uam/site",
    tags=["uam", "site"],
)


@router.post("/addSite", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def add_site(site: AddSiteRequestSchema):
    try:
        response, status = add_site_util(site)
        return JSONResponse(content=response, status_code=status)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Adding Site", status_code=500)


@router.post("/editSite", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def edit_site(site: EditSiteRequestSchema):
    try:
        response, status = edit_site_util(site)
        return JSONResponse(content=response, status_code=status)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Adding Site", status_code=500)


@router.post("/deleteSite", responses={
    200: {"model": SummeryResponseSchema},
    400: {"model": str},
    500: {"model": str}
})
async def delete_site(site_ids: list[int]):
    try:
        error_list = []
        success_list = []

        for site_id in site_ids:
            msg, status = delete_site_util(site_id)
            if status != 200:
                error_list.append(msg)
            else:
                success_list.append(msg)

        response = {
            "error": len(error_list),
            "success": len(success_list),
            "error_list": error_list,
            "success_list": success_list
        }

        return JSONResponse(content=response, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Adding Site", status_code=500)


@router.get("/getAllSites", responses={
    200: {"model": list[GetSiteResponseSchema]},
    500: {"model": str}
})
async def get_all_site():
    try:

        response = list()

        results = configs.db.query(SiteTable).all()
        for result in results:
            response.append(result.as_dict())

        print(response)

        return JSONResponse(content=response, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Sites", status_code=500)


@router.get("/getSitesForDropdown", responses={
    200: {"model": list[str]},
    500: {"model": str}
})
async def get_site_dropdown():
    try:
        result = configs.db.query(SiteTable).all()
        response = list()

        for site in result:
            site_name = site.site_name
            response.append(site_name)

        return JSONResponse(content=response, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Sites", status_code=500)


@router.get("/phyLeaflet")
async def phy_leaflet():
    try:
        result = configs.db.query(SiteTable).all()
        response = list()

        for site in result:
            obj_dict = {"site_name": site["site_name"], "longitude": site["longitude"], "latitude": site["latitude"],
                        "city": site["city"]}
            response.append(obj_dict)

        return JSONResponse(content=response, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Sites", status_code=500)


@router.get("/topSites")
async def top_sites():
    try:
        query_string = "SELECT s.SITE_NAME, COUNT(u.UAM_ID) AS DEVICE_COUNT FROM site_table s LEFT JOIN rack_table r ON s.SITE_ID = r.SITE_ID LEFT JOIN atom_table a ON r.RACK_ID = a.RACK_ID LEFT JOIN uam_device_table u ON a.ATOM_ID = u.ATOM_ID GROUP BY s.SITE_NAME;"
        result = configs.db.execute(query_string)

        obj_list = list()

        for row in result:
            site = row[0]
            count = row[1]
            obj_dict = {site: count}
            obj_list.append(obj_dict)

        response = dict()
        for i in obj_list:
            for j in i:
                response[j] = i[j]

        return JSONResponse(content=response, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Sites", status_code=500)


@router.get("/dataCentreStatus")
async def data_center_status():
    try:
        query_string = (
            f"select distinct STATUS, count(STATUS) from site_table group by STATUS;"
        )
        result = configs.db.execute(query_string)
        obj_list = []

        for row in result:
            status = row[0]
            count = row[1]

            obj_list.append({
                status: count
            })

        response = dict()
        for i in obj_list:
            for j in i:
                response[j] = i[j]

        return JSONResponse(content=response, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Sites", status_code=500)


@router.get("/totalSites")
async def total_sites():
    try:
        query_string = f"select count(distinct SITE_NAME) from site_table;"
        result = configs.db.execute(query_string).scalar()

        query_string1 = f"select count(distinct DEVICE_NAME) from uam_device_table join atom_table on uam_device_table.atom_id = atom_table.atom_id;"
        result1 = configs.db.execute(query_string1).scalar()

        query_string2 = f"select count(distinct MANUFACTURER) from uam_device_table;"
        result2 = configs.db.execute(query_string2).scalar()

        response = [
            {"name": "Sites", "value": result},
            {"name": "Devices", "value": result1},
            {"name": "Vendors", "value": result2},
        ]

        return JSONResponse(content=response, status_code=200)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Sites", status_code=500)
