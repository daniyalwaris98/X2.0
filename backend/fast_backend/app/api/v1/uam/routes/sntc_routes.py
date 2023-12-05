from fastapi import APIRouter
from fastapi.responses import JSONResponse

# from app.schema.uam_device_schema import *
from fastapi import FastAPI, Query
from app.models.uam_models import *
from app.api.v1.uam.utils.uam_utils import *
from app.utils.static_list import *
from app.core.config import *

from app.schema.uam_sntc_schema import *

router = APIRouter(
    prefix="/uam_sntc",
    tags=["uam_sntc"],
)


@router.get('/get_all_sntc',responses={
    200: {"model": list[GetSntcSchema]},
    500: {"model": str}
},
summary = "Use this api in HW Life cycle UAM module to list down all the sntc in the table",
description = "Use this api in HW Life cycle UAM module to list down all the sntc in the table"
)
def get_all_sntcs():
    try:
        sntc_list = []
        sntc_results = configs.db.query(SntcTable).filter(SntcTable.pn_code !="" and SntcTable.pn_code != "N/A").all()
        print("sntc result is::::::::::::::::::::::::::::::",sntc_results,file=sys.stderr)
        for sntcs in sntc_results:
            print("sntc result is:::::::::::::::::::::::::",sntcs,file=sys.stderr)
            sntc_dict = {
                "sntc_id":sntcs.sntc_id,
                "pn_code":sntcs.pn_code,
                "hw_eos_date":sntcs.hw_eos_date,
                "hw_eol_date":sntcs.hw_eol_date,
                "sw_eos_date":sntcs.sw_eos_date,
                "sw_eol_date":sntcs.sw_eol_date,
                "manufacture_date":sntcs.manufacture_date,
                "creation_date":sntcs.creation_date,
                "modification_date":sntcs.modification_date
            }
            sntc_list.append(sntc_dict)
        return JSONResponse(content =sntc_list,status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content = "Error Occured while fetching SNTC",status_code = 500)
        

@router.get('/sync_from_inventory',
            responses={
                200: {"model":list[SyncFromInventorySchema]},
                500: {"model": str}
            },
            summary="Use this API in HW lifecycle to sync from inventory in UAM module",
            description="Use this API in HW lifecycle to sync from inventory in UAM module"
)
def sync_from_inventorys():
    try:
        sntc_objects = []
        query_string = """
            SELECT DISTINCT(pn_code)
            FROM uam_device_table
            WHERE pn_code NOT IN (SELECT pn_code FROM sntc_table)
            UNION
            SELECT DISTINCT(pn_code)
            FROM board_table
            WHERE pn_code NOT IN (SELECT pn_code FROM sntc_table)
            UNION
            SELECT DISTINCT(pn_code)
            FROM subboard_table
            WHERE pn_code NOT IN (SELECT pn_code FROM sntc_table)
            UNION
            SELECT DISTINCT(pn_code)
            FROM sfp_table
            WHERE pn_code NOT IN (SELECT pn_code FROM sntc_table);
        """
        result = configs.db.execute(query_string)
        print("result for the query string is :::::::::::::::::",result,file=sys.stderr)
        for row in result:
            print("row in result is:;:::::::::::::::::::",row,file=sys.stderr)
            pn_code = row.pn_code
            print("pn code is ::::::::::::::::::::::::",pn_code,file=sys.stderr)
            sntc = configs.db.query(SntcTable).filter_by(pn_code=pn_code).first()
            print("sntc is:::::::::::::::::::::::::::::::::::",sntc,file=sys.stderr)
            if sntc is None:
                
                sntc = SntcTable(pn_code=pn_code, creation_date=datetime.now(), modification_date=datetime.now())
                configs.db.add(sntc)
                configs.db.commit()
                sntc_objects.append({"action": "inserted", "data": sntc})
                print("Inserted in DB::::::::::::::::::::::::::::",file=sys.stderr)
            else:
                sntc.modification_date = datetime.now()
                configs.db.commit()
                sntc_objects.append({"action": "updated", "data": sntc})
                print("SNTC table Updated:::::::::::::::::::::::::",file=sys.stderr)
        return JSONResponse(content = sntc_objects,status_code = 200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content = "Error Occured while Sync from Inventory",status_code = 500)


@router.get('/sync_to_inventory',
            responses={
                200: {"model": List[SyncResult]},
                500: {"model": str}
            },
            summary="Use this API in HW lifecycle in sync to inventory UAM module",
            description="Use this API in HW lifecycle in sync to inventory UAM module"
)
def sync_to_inventory():
    try:
        results = configs.db.query(SntcTable).all()
        sync_results = []
        for sntc in results:
            try:
                # UAM Devices Sync
                uam_rows = configs.db.query(UamDeviceTable).filter(
                    UamDeviceTable.pn_code == sntc.pn_code
                ).all()
                for uam in uam_rows:
                    if sntc.hw_eos_date is not None:
                        uam.hw_eos_date = sntc.hw_eos_date
                    if sntc.hw_eol_date is not None:
                        uam.hw_eol_date = sntc.hw_eol_date
                    if sntc.sw_eos_date is not None:
                        uam.sw_eos_date = sntc.sw_eos_date
                    if sntc.sw_eol_date is not None:
                        uam.sw_eol_date = sntc.sw_eol_date
                    if sntc.manufacture_date is not None:
                        uam.manufacture_date = sntc.manufacture_date
                    UpdateDBData(uam)

                # Board Sync
                board_rows = configs.db.query(BoardTable).filter(
                    BoardTable.pn_code == sntc.pn_code
                ).all()
                for board in board_rows:
                    if sntc.hw_eos_date is not None:
                        board.eos_date = sntc.hw_eos_date
                    if sntc.hw_eol_date is not None:
                        board.eol_date = sntc.hw_eol_date
                    if sntc.manufacture_date is not None:
                        board.manufacture_date = sntc.manufacture_date
                    UpdateDBData(board)

                # Subboard Sync
                subboard_rows = configs.db.query(SubboardTable).filter(
                    SubboardTable.pn_code == sntc.pn_code
                ).all()
                for subboard in subboard_rows:
                    if sntc.hw_eos_date is not None:
                        subboard.eos_date = sntc.hw_eos_date
                    if sntc.hw_eol_date is not None:
                        subboard.eol_date = sntc.hw_eol_date
                    if sntc.manufacture_date is not None:
                        subboard.manufacture_date = sntc.manufacture_date
                    UpdateDBData(subboard)

                # SFPs Sync
                sfps_rows = configs.db.query(SfpsTable).filter(
                    SfpsTable.pn_code == sntc.pn_code
                ).all()
                for sfp in sfps_rows:
                    if sntc.hw_eos_date is not None:
                        sfp.eos_date = sntc.hw_eos_date
                    if sntc.hw_eol_date is not None:
                        sfp.eol_date = sntc.hw_eol_date
                    UpdateDBData(sfp)

                # Appending sync result
                sync_results.append(
                    SyncResult(
                        object_id=sntc.sntc_id,
                        sync_type="Sync to Inventory",
                        success=True,
                        error_message=None
                    )
                )
            except Exception as e:
                sync_results.append(
                    SyncResult(
                        object_id=sntc.sntc_id,
                        sync_type="Sync to Inventory",
                        success=False,
                        error_message=str(e)
                    )
                )

        return sync_results
    except Exception as e:
        raise JSONResponse(status_code=500, detail="Error Occurred while syncing to Inventory")

@router.post('/edit_sntc',
             responses={
                 200: {"model": Response200},
                 400: {"model": str},
                 500: {"model": str},
             },
)
async def edit_sntc(sntcObj: SntcEditRequest):
    try:
        sntc = configs.db.query(SntcTable).filter_by(sntc_id=sntcObj.sntc_id).first()
        if sntc:
            sntc.pn_code = sntcObj.pn_code
            sntc.hw_eos_date = sntcObj.hw_eos_date
            sntc.hw_eol_date = sntcObj.hw_eol_date
            sntc.sw_eos_date = sntcObj.sw_eos_date
            sntc.sw_eol_date = sntcObj.sw_eol_date
            sntc.manufacture_date = sntcObj.manufacture_date
            configs.db.commit()

            sntc_data_dict = {
                "data": sntcObj.dict(),
                "message": f"{sntcObj.sntc_id} : Updated"
            }
            return sntc_data_dict
        else:
            return JSONResponse(status_code=400, content=f"{sntcObj.sntc_id} : Not Found")
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content="Internal Server Error")
    


@router.post('/delete_pn_code',
            responses={
    200: {"model": ListtDeleteResponseSchema},
    400: {"model": str},
    500: {"model": str}
}
)
async def delete_pn_code(pn_code: List[str]):
    success_list = []
    error_list = []
    deleted_ids = []
    
    for obj in pn_code:
        posID = Configs.db.query(SntcTable).filter(SntcTable.pn_code == obj).first()
        if posID:
            configs.db.delete(posID)
            configs.db.commit()
            deleted_ids.append(posID)
            success_list.append(f"PnCode {obj} deleted successfully")
        else:
            error_list.append(f"No ID found for PnCode {obj}")

    return {
        "data": deleted_ids,
        "success": len(success_list),
        "error": len(error_list),
        "success_list": success_list,
        "error_list": error_list
    }