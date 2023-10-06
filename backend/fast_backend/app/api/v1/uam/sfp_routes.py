from fastapi import APIRouter
from fastapi.responses import JSONResponse

import traceback
import sys

from app.core.config import configs
from app.schema.uam_sfp_schema import *

from app.models.atom_models import *
from app.models.uam_models import *

router = APIRouter(
    prefix="/uam/sfp",
    tags=["uam", "sfp"],
)


@router.get("/sfpStatus", responses={
    200: {"model": dict},
    500: {"model": str}
})
async def sfp_status():
    try:
        query_string = "SELECT DISTINCT mode, COUNT(mode) " \
                       "FROM sfp_table WHERE mode != '' AND " \
                       "mode IS NOT NULL GROUP BY mode;"
        result = configs.db.execute(query_string)
        obj_list = []

        for row in result:
            status = row[0]
            count = row[1]
            obj_list.append({status: count})

        response_dict = {}
        for i in obj_list:
            for j in i:
                response_dict[j] = i[j]

        print(response_dict, file=sys.stderr)
        return response_dict, 200

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error While Fetching SFP Data", status_code=500)


@router.get("/sfpMode", responses={
    200: {"model": dict},
    500: {"model": str}
})
async def sfp_mode():
    try:
        query_string = "SELECT port_type, COUNT(port_type)\
                       FROM sfp_table WHERE port_type != ''\
                       AND port_type IS NOT NULL GROUP BY port_type;"

        result = configs.db.execute(query_string)
        obj_list = []
        for row in result:
            mode = row[0]
            count = row[1]
            obj_list.append({mode: count})

        print(obj_list, file=sys.stderr)

        response_dict = {}
        for i in obj_list:
            for j in i:
                response_dict[j] = i[j]

        print(response_dict, file=sys.stderr)
        return JSONResponse(content=response_dict, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error While Fetching SFP Data", status_code=500)


@router.get("/getSfpsDetailsByIpAddress/{ip_address}", responses={
    200: {"model": list[GetSfpResponseSchema]},
    400: {"model": str},
    500: {"model": str}
})
async def get_sfps_details_by_ip_address(ip_address: str):
    try:

        atom = configs.db.query(AtomTable).filter(AtomTable.ip_address == ip_address).first()
        if atom is None:
            return JSONResponse(content="no device found in atom with the given ip address", status_code=400)

        uam = configs.db.query(UamDeviceTable).filter(UamDeviceTable.atom_id == atom.atom_id).first()
        if uam is None:
            return JSONResponse(content="no device found in uam with the given ip address", status_code=400)

        results = configs.db.query(SfpsTable).filter(SfpsTable.uam_id == uam.uam_id).all()

        obj_list = []
        for sfp in results:
            obj_list.append({"sfp_id": sfp.sfp_id, 'uam_id': sfp.uam_id, "device_name": atom.device_name,
                             "media_type": sfp.media_type, "port_name": sfp.port_name, "port_type": sfp.port_type,
                             'connector': sfp.connector, "mode": sfp.mode, 'speed': sfp.speed,
                             'wavelength': sfp.wavelength,
                             'optical_direction_type': sfp.optical_direction_type, 'pn_code': sfp.pn_code,
                             "creation_date": str(sfp.creation_date), "modification_date": str(sfp.modification_date),
                             "status": sfp.status, "eos_date": str(sfp.eos_date), "eol_date": str(sfp.eol_date),
                             'rfs_date': str(sfp.rfs_date), "serial_number": sfp.serial_number})

        return JSONResponse(content=obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching SFPs Data", status_code=500)


@router.get("/getAllSfps", responses={
    200: {"model": list[GetSfpResponseSchema]},
    500: {"model": str}
})
def get_all_sfps():
    try:
        results = (
            configs.db.query(SfpsTable, UamDeviceTable, AtomTable)
            .join(UamDeviceTable, SfpsTable.uam_id == UamDeviceTable.uam_id)
            .join(AtomTable, UamDeviceTable.atom_id == AtomTable.atom_id)
            .all()
        )

        obj_list = []
        for sfp, uam, atom in results:
            sfp_data_dict = {"sfp_id": sfp.sfp_id, "device_name": atom.device_name, "media_type": sfp.media_type,
                             "port_name": sfp.port_name, "port_type": sfp.port_type, 'connector': sfp.connector,
                             "mode": sfp.mode, 'speed': sfp.speed, 'wavelength': sfp.wavelength,
                             'manufacturer': sfp.manufacturer, 'optical_direction_type': sfp.optical_direction_type,
                             'pn_code': sfp.pn_code, "creation_date": str(sfp.creation_date),
                             "modification_date": str(sfp.modification_date), "status": sfp.status,
                             "eos_date": str(sfp.eos_date), "eol_date": str(sfp.eol_date),
                             'rfs_date': str(sfp.rfs_date), "serial_number": sfp.serial_number}

            obj_list.append(sfp_data_dict)

        return JSONResponse(content=obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return "Server Error", 500
#
#
# @app.route("/editSfps", methods=["POST"])
# @token_required
# def EditSfps(user_data):
#     try:
#         sfpsObj = request.get_json()
#         print(sfpsObj, file=sys.stderr)
#         sfps = (
#             Sfps_Table.query.with_entities(Sfps_Table)
#             .filter_by(sfp_id=sfpsObj["sfp_id"])
#             .first()
#         )
#
#         sfps.rfs_date = FormatStringDate(sfpsObj["rfs_date"])
#
#         if UpdateDBData(sfps) == 200:
#             return "SFP Updated Successfully", 200
#         else:
#             return "Error While Updating SFP", 500
#
#     except Exception as e:
#         traceback.print_exc()
#         return "Server Error", 500
