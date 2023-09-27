from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.schema.uam_module_schema import *
from app.api.v1.uam.module_utils import *

router = APIRouter(
    prefix="/uam/module",
    tags=["uam", "module"],
)


@router.get("/getBoardDetailsByIpAddress/{ip_address}", responses={
    200: {"model": list[GetBoardResponseSchema]},
    500: {"model": str}
})
async def get_board_details_by_ip_address(ip_address: str):
    try:
        results = (
            configs.db.query(BoardTable, UamDeviceTable, AtomTable)
            .join(UamDeviceTable, BoardTable.uam_id == UamDeviceTable.uam_id)
            .join(AtomTable, UamDeviceTable.atom_id == AtomTable.atom_id)
            .filter(AtomTable.ip_address == ip_address)
            .all()
        )

        obj_list = []

        for board, uam, atom in results:
            try:
                obj_dict = {"board_name": board.board_name,
                            "device_name": atom.device_name,
                            "device_slot_id": board.device_slot_id,
                            "software_version": board.software_version,
                            "hardware_version": board.hardware_version,
                            "serial_number": board.serial_number,
                            "creation_date": board.creation_date,
                            "modification_date": board.modification_date,
                            "status": board.status,
                            "manufacturer_date": str(board.manufacture_date),
                            "eos_date": str(board.eos_date),
                            "eol_date": str(board.eol_date),
                            "pn_code": board.pn_code}
                obj_list.append(obj_dict)

            except Exception:
                traceback.print_exc()

        return JSONResponse(content=obj_list, status_code=200)

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error While Fetching Board Data", status_code=500)


@router.get("/getSubBoardDetailsByIpAddress/{ip_address}", responses={
    200: {"model": list[GetSubboardResponseSchema]},
    500: {"model": str}
})
async def get_subboard_details_by_ip_address(ip_address: str):
    try:
        results = (
            configs.db.query(SubboardTable, UamDeviceTable, AtomTable)
            .join(
                UamDeviceTable,
                SubboardTable.uam_id == UamDeviceTable.uam_id,
            )
            .join(AtomTable, UamDeviceTable.atom_id == AtomTable.atom_id)
            .filter(AtomTable.ip_address == ip_address)
            .all()
        )

        objList = []
        for subboard, uam, atom in results:
            try:
                objDict = {"subboard_name": subboard.subboard_name,
                           "device_name": atom.device_name,
                           "subboard_type": subboard.subboard_type,
                           "subrack_id": subboard.subrack_id,
                           "slot_number": subboard.slot_number,
                           "subslot_number": subboard.subslot_number,
                           "software_version": subboard.software_version,
                           "hardware_version": subboard.hardware_version,
                           "serial_number": subboard.serial_number,
                           "creation_date": str(subboard.creation_date),
                           "modification_date": str(subboard.modification_date),
                           "status": subboard.status,
                           "manufacturer_date": str(subboard.manufacture_date),
                           "eos_date": str(subboard.eos_date),
                           "eol_date": str(subboard.eol_date),
                           "rfs_date": str(subboard.rfs_date),
                           "pn_code": subboard.pn_code}
                objList.append(objDict)

            except Exception:
                traceback.print_exc()

        return JSONResponse(content=objList, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error While Fetching Sub-Board Data", status_code=500)


@router.get("/getAllBoards", responses={
    200: {"model": list[GetBoardResponseSchema]},
    500: {"model": str}
})
async def get_all_boards():
    try:
        boardObjList = []

        results = (
            configs.db.query(BoardTable, UamDeviceTable, AtomTable)
            .join(UamDeviceTable, BoardTable.uam_id == UamDeviceTable.uam_id)
            .join(AtomTable, UamDeviceTable.atom_id == AtomTable.atom_id)
            .all()
        )

        for boardObj, uam, atom in results:
            try:
                boardDataDict = {"board_name": boardObj.board_name,
                                 "device_name": atom.device_name,
                                 "device_slot_id": boardObj.device_slot_id,
                                 "software_version": boardObj.software_version,
                                 "hardware_version": boardObj.hardware_version,
                                 "serial_number": boardObj.serial_number,
                                 "manufacturer_date": str(boardObj.manufacture_date),
                                 "creation_date": str(boardObj.creation_date),
                                 "modification_date": str(boardObj.modification_date),
                                 "status": boardObj.status,
                                 "eos_date": str(boardObj.eos_date),
                                 "eol_date": str(boardObj.eol_date),
                                 "rfs_date": str(boardObj.rfs_date),
                                 "pn_code": boardObj.pn_code}

                boardObjList.append(boardDataDict)
            except Exception:
                traceback.print_exc()

        return JSONResponse(content=boardObjList, status_code=200)

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error While Getting Board Data", status_code=500)


@router.get("/getAllSubBoards", responses={
    200: {"model": list[GetSubboardResponseSchema]},
    500: {"model": str}
})
def get_all_subboards():
    try:
        subboardObjList = []

        results = (
            configs.db.query(SubboardTable, UamDeviceTable, AtomTable)
            .join(
                UamDeviceTable,
                SubboardTable.uam_id == UamDeviceTable.uam_id,
            )
            .join(AtomTable, UamDeviceTable.atom_id == AtomTable.atom_id)
            .all()
        )

        for subboardObj, uam, atom in results:
            try:
                subboardDataDict = {"subboard_name": subboardObj.subboard_name,
                                    "device_name": atom.device_name,
                                    "subboard_type": subboardObj.subboard_type,
                                    "subrack_id": subboardObj.subrack_id,
                                    "slot_number": subboardObj.slot_number,
                                    "subslot_number": subboardObj.subslot_number,
                                    "software_version": subboardObj.software_version,
                                    "hardware_version": subboardObj.hardware_version,
                                    "serial_number": subboardObj.serial_number,
                                    "creation_date": str(subboardObj.creation_date),
                                    "modification_date": str(subboardObj.modification_date),
                                    "status": subboardObj.status,
                                    "eos_date": str(subboardObj.eos_date),
                                    "eol_date": str(subboardObj.eol_date),
                                    "rfs_date": str(subboardObj.rfs_date),
                                    "pn_code": subboardObj.pn_code}

                subboardObjList.append(subboardDataDict)
            except Exception:
                traceback.print_exc()

        return JSONResponse(content=subboardObjList, status_code=200)

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content="Error While Getting Sub-Board Data", status_code=500)


@router.get("/addBoard", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
def add_board(board_obj: AddBoardRequestSchema):
    try:
        msg, status = add_board_util(board_obj)
        print(msg, file=sys.stderr)
        return JSONResponse(content=msg, status_code=status)
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Server Error", status_code=500)

# @app.route("/editBoard", methods=["POST"])
# @token_required
# def EditBoard(user_data):
#     try:
#         boardObj = request.get_json()
#         print(boardObj, file=sys.stderr)
#
#         board = (
#             Board_Table.query.with_entities(Board_Table)
#             .filter_by(board_name=boardObj["board_name"])
#             .first()
#         )
#
#         board.rfs_date = FormatStringDate(boardObj["rfs_date"])
#
#         if UpdateDBData(board) == 200:
#             return "Board Updated Successfully", 200
#         else:
#             return "Error While Updating Board", 500
#     except Exception as e:
#         traceback.print_exc()
#         return "Server Error", 500
#
#
# @app.route("/editSubBoard", methods=["POST"])
# @token_required
# def EditSubBoard(user_data):
#     try:
#         subBoardObj = request.get_json()
#         print(subBoardObj, file=sys.stderr)
#
#         subBoard = (
#             Subboard_Table.query.with_entities(Subboard_Table)
#             .filter_by(subboard_name=subBoardObj["subboard_name"])
#             .first()
#         )
#
#         subBoard.rfs_date = FormatStringDate(subBoardObj["rfs_date"])
#
#         if UpdateDBData(subBoard) == 200:
#             return "Sub-Board Updated Successfully", 200
#         else:
#             return "Error While Updating Sub-Board", 500
#
#     except Exception as e:
#         traceback.print_exc()
#         return "Server Error", 500
