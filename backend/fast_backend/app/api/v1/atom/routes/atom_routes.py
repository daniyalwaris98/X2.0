from app.api.v1.atom.utils.atom_utils import *

router = APIRouter(
    prefix="/atom",
    tags=["atom"],
)


@router.post("/add-atom-device", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def add_atom(atom: AddAtomRequestSchema):
    try:
        response, status = add_complete_atom(atom, False)
        print("atom is:::::::::::::::::::::::::::::::::::::::",atom,file=sys.stderr)

        if status != 200:
            response, status = add_transition_atom(atom, False)
            print("if reponse not 200::::::::::::::::::::::::::::::::::::::::::",response,file=sys.stderr)
        print("response in add atom is::::::::::::::::::::::::::::::::::::::",add_atom,file=sys.stderr)

        return JSONResponse(content=response, status_code=status)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Adding Atom Device", status_code=500)


@router.post("/add-atom-devices", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
async def add_atoms(atom_objs: list[AddAtomRequestSchema]):
    try:

        row = 0
        error_list = []
        success_list = []
        for atomObj in atom_objs:
            try:
                row += 1
                atomObj["ip_address"] = atomObj["ip_address"].strip()
                if atomObj["ip_address"] == "":
                    error_list.append(f"Row {row} : IP Address Can Not Be Empty")
                    continue

                atom = configs.db.query(AtomTable).filter(
                    AtomTable.ip_address == atomObj["ip_address"]).first()
                transit_atom = configs.db.query(AtomTransitionTable).filter(
                    AtomTransitionTable.ip_address == atomObj["ip_address"]
                ).first()

                if atom is not None:
                    msg, status = add_complete_atom(atomObj, True)
                    print("msg for he add complete atom is::::::::::::::::::::",file=sys.stderr)
                elif transit_atom is not None:
                    msg, status = add_transition_atom(atomObj, True)
                    print("msg in adddd trnision atom:::::::::::::::::",msg,file=sys.stderr)
                else:
                    msg, status = add_complete_atom(atomObj, False)
                    print("msg in else add complete atom is:::::::::::::::::",msg,file=sys.stderr)

                    if status != 200:
                        msg, status = add_transition_atom(atomObj, False)
                        print("add tranistion atom if status is not 200:::::::::::::::::::",msg,file=sys.stderr)

            except Exception:
                traceback.print_exc()
                status = 500
                msg = f"{atomObj['ip_address']} : Exception Occurred"

            if status == 200:
                success_list.append(msg)
            else:
                error_list.append(msg)

        response = SummeryResponseSchema(
            success=len(success_list),
            error=len(error_list),
            success_list=success_list,
            error_list=error_list
        )
        print("repsonse are::::::::::::::::::::::::::::",response,file=sys.stderr)

        return (response),200

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Adding Atom Devices", status_code=500)


@router.post("/edit-atom", responses={
    200: {"model": str},
    400: {"model": str},
    500: {"model": str}
})
async def edit_atom(atom: EditAtomRequestSchema):
    try:
        atom = atom.dict()
        response, status = edit_atom_util(atom)
        print("response in edit atom is::::::::::::::::::::::::::::",response,file=sys.stderr)

        return JSONResponse(content=response, status_code=status)
    except Exception:
        traceback.print_exc()
        return "Error Occurred While Updating Atom Device", 500


@router.get("/get-atoms", responses={
    200: {"model": list[GetAtomResponseSchema] | None},
    500: {"model": str}
})
async def get_atoms():
    try:

        atom_obj_list = []
        count = 0
        try:
            transition_list = get_transition_atoms()
            for trans_atom in transition_list:
                atom_obj_list.append(trans_atom)
                count = len(trans_atom)
        except Exception:
            traceback.print_exc()

        result = (
            configs.db.query(AtomTable, RackTable, SiteTable, PasswordGroupTable)
            .join(
                PasswordGroupTable,
                AtomTable.password_group_id == PasswordGroupTable.password_group_id,
            )
            .join(RackTable, AtomTable.rack_id == RackTable.rack_id)
            .join(SiteTable, RackTable.site_id == SiteTable.site_id)
            .all()
        )
        
        for atomObj, rackObj, siteObj, passObj in result:
            try:
                count = count+1
                atom_data_dict = {
                    "atom_id": atomObj.atom_id,
                    "site_name": siteObj.site_name,
                    "rack_name": rackObj.rack_name,
                    "device_name": atomObj.device_name,
                    "ip_address": atomObj.ip_address,
                    "vendor": atomObj.vendor,
                    "device_ru": atomObj.device_ru,
                    "department": atomObj.department,
                    "section": atomObj.section,
                    "function": atomObj.function,
                    "virtual": atomObj.virtual,
                    "device_type": atomObj.device_type,
                    "password_group": passObj.password_group,
                    "creation_date": str(atomObj.creation_date),
                    "modification_date": str(atomObj.modification_date),
                    "atom_table_id":count
                }

                if atomObj.onboard_status is not None:
                    atom_data_dict["onboard_status"] = atomObj.onboard_status
                else:
                    atom_data_dict["onboard_status"] = False

                atom_data_dict["message"] = "Complete"
                atom_data_dict["status"] = 200

                atom_obj_list.append(atom_data_dict)

            except Exception:
                traceback.print_exc()

        print(atom_obj_list, file=sys.stderr)

        if len(atom_obj_list) <= 0:
            atom_obj_list = None

        return JSONResponse(content=atom_obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Atom Devices", status_code=500)


@router.post("/delete-atom", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
def delete_atom(atom_list: List[DeleteAtomRequestSchema]):
    try:
        success_list = []
        error_list = []
        deleted_atoms_lst = []
        atom_found = False 
        transition_atom_found = False
        for atom_obj in atom_list:
            deleted_atom ={}
            atom_obj = atom_obj.dict()
            print("obj is::::::::::::::::::::::::::::::::::::", file=sys.stderr)
           

            if "atom_id" in atom_obj and atom_obj['atom_id'] is not None:
                atoms = configs.db.query(AtomTable).filter_by(atom_id=atom_obj['atom_id']).all()
                if atoms:
                    print("if atom is::::::::::::::::::::::::::::::::::::::::", atoms, file=sys.stderr)
                    for atom in atoms:
                        atom_found = True
                        deleted_atom_id = atom.atom_id
                        atom_ip_address = atom.ip_address
                        print("atom id is::::::::::::::::::::::::::::::", deleted_atom_id, file=sys.stderr)
                        DeleteDBData(atom)
                        print("atom delted successfully:::::::::::::::::::::::::::", file=sys.stderr)
                        deleted_atom['atom_id'] = deleted_atom_id
                        success_list.append(f"{atom_ip_address} : Atom Deleted Successfully")
                else:
                    print("Atom Not Found::::::::::::::::", file=sys.stderr)
                    # error_list.append("Atom Not Found")

            print("start of atom tranistion::::::::::::::", file=sys.stderr)
            if "atom_transition_id" in atom_obj and atom_obj['atom_transition_id'] is not None:
                print("atom tranistion found in :::::::::::::::::", file=sys.stderr)
                atom_transition = configs.db.query(AtomTransitionTable).filter_by(atom_transition_id=atom_obj["atom_transition_id"]).all()
                if atom_transition:
                    print("atom tranistion atom is::::::::::::::::::::::::::::::::", file=sys.stderr)
                    for atoms in atom_transition:
                        transition_atom_found = True
                        atom_tranistion_id = atoms.atom_transition_id
                        transition_atom_ip = atoms.ip_address
                        print("atom tranistion id:::::::::::::::::::::",atom_tranistion_id,file=sys.stderr)
                        DeleteDBData(atoms)
                        print("atom tranistion delted successsfully:::::::::::::::::::::::", file=sys.stderr)
                        deleted_atom['atom_tranistion_id'] = atom_tranistion_id
                        success_list.append(f"{transition_atom_ip} : Atom Tranistion Deleted Successfully")
                else:
                    print("Atom Tranision not found::::::::::::::::::::::::::::", file=sys.stderr)
                    # error_list.append("Tranistion Atom Not Found")
        deleted_atoms_lst.append(deleted_atom)

        if not atom_found and not transition_atom_found:
                error_list.append("Atom / Transition Atom Not Found")

        response = {
            "data": deleted_atoms_lst,
            "success": len(success_list),
            "error": len(error_list),
            "success_list": success_list,
            "error_list": error_list
        }

        return response, 200
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Deleting Atom", status_code=500)
