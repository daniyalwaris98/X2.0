from app.api.v1.atom.utils.atom_utils import *
from app.schema.validation_schema import Validator
# from app.schema.response_schema import Response200


router = APIRouter(
    prefix="/atom",
    tags=["atom"],
)


@router.post("/add_atom_device", responses={
    200: {"model": Response200},
    400: {"model": str},
    500: {"model": str}
})
async def add_atom(atom: AddAtomRequestSchema):
    try:
        print("add atom is being executed::::::::::::::::::::::::::::",file=sys.stderr)
        response, status = add_complete_atom(atom, False)
        # print("atom is:::::::::::::::::::::::::::::::::::::::",atom,file=sys.stderr)
        print("atom is::::::::::::::::::::::::::::::::::::",atom,file=sys.stderr)
        print("validation error is being executed::::::::::::::::::::::::::::::",file=sys.stderr)
        validation_errors = Validator.validate_data(AddAtomRequestSchema, atom)
        print("validation_error in aadd atom device is:::::::::::::::::",validation_errors,file=sys.stderr)
        if validation_errors:
            # print("validation error occured :::::::::::::::::::::::::::::::::::::",file=sys.stderr)
            return validation_errors,422
        else:
            print("No validation error occured in add atom::::::::::::::::::::::::::::",file=sys.stderr)

        if status != 200:
            response, status = add_transition_atom(atom, False)
            print("if reponse not 200::::::::::::::::::::::::::::::::::::::::::",response,file=sys.stderr)
        # print("response in add atom is::::::::::::::::::::::::::::::::::::::",add_atom,file=sys.stderr)

        return JSONResponse(content=response, status_code=status)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Adding Atom Device", status_code=500)


@router.post("/add_atom_devices", responses={
    200: {"model": SummeryResponseSchema},
    500: {"model": str}
})
async def add_atoms(atom_objs: list[AddAtomRequestSchema]):
    try:

        row = 0
        error_list = []
        success_list = []
        data_lst = []
        data_filtered_lst = []
        
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
                    for key,value in msg.items():
                            print("key for msg ares::::::::::::::::::::",key,file=sys.stderr)
                            print("values are:::::::::::::::::::::::::::::",value,file=sys.stderr)

                            if key =='data':
                                data_lst.append(value)
                            if key == 'message':
                                if value not in success_list:
                                    print("values for the message is::::::::::::::::::::::",value,file=sys.stderr)
                                    success_list.append(value)
                elif transit_atom is not None:
                    msg, status = add_transition_atom(atomObj, True)
                    print("tranistion atom is not none::::::::::::::::::::",msg,file=sys.stderr)
                    print('status is no none for tranistiona atom is::::::::::::::::::::::::',status,file=sys.stderr)
                    print("data list is::::::::::::::::::::::",msg,file=sys.stderr)
                    for key,value in msg.items():
                        print("key for msg ares::::::::::::::::::::",key,file=sys.stderr)
                        print("values are:::::::::::::::::::::::::::::",value,file=sys.stderr)

                        if key =='data':
                            data_lst.append(value)
                        if key == 'message':
                           if value not in success_list:
                                    print("values for the message is::::::::::::::::::::::",value,file=sys.stderr)
                                    success_list.append(value)
                else:
                    msg, status = add_complete_atom(atomObj, False)
                    # print("msg for add complete atom is34343434343434:::::::::::::::::::::",msg,file=sys.stderr)
                    # for key,value in msg.items():
                    #         print("key for msg ares::::::::::::::::::::",key,file=sys.stderr)
                    #         print("values are:::::::::::::::::::::::::::::",value,file=sys.stderr)

                    #         if key =='data':
                    #             data_lst.append(value)
                    #         if key == 'message':
                    #             if value not in success_list:
                    #                 print("values for the message is::::::::::::::::::::::",value,file=sys.stderr)
                    #                 success_list.append(value)

                    if status != 200:
                        msg, status = add_transition_atom(atomObj, False)
                        print("msg if status not 200 for tanistiona tom is:::::",msg,file=sys.stderr)
                        print("status if tranistion not 200 is::::::::::::::::::",status,file=sys.stderr)
                        for key,value in msg.items():
                            print("key for msg ares::::::::::::::::::::",key,file=sys.stderr)
                            print("values are:::::::::::::::::::::::::::::",value,file=sys.stderr)

                            if key =='data':
                                data_lst.append(value)
                            if key == 'message':
                                if value not in success_list:
                                    print("values for the message is::::::::::::::::::::::",value,file=sys.stderr)
                                    success_list.append(value)
            
            except Exception:
                traceback.print_exc()
                status = 500
                msg = f"{atomObj['ip_address']} : Exception Occurred"
            # print("data list with vues are:::::::::::::::::::: ",data_lst,file=sys.stderr)
            print("success list with the data is :::::::::::::::::::::::::::::::::",success_list,file=sys.stderr)
            # if status == 200:
            #     success_list.append(msg)
            # else:
            #     error_list.append(msg)
            # unique_data = {}
            # # Loop through messages to filter unique data
            # for msg_item in data_lst:
            #     if msg_item['atom_transition_id'] not in unique_data and msg_item['ip_address'] not in unique_data:
            #         unique_data[msg_item['atom_transition_id']] = msg_item
            # data_lst = list(unique_data.values())
            # success_list = list(set(success_list))
            print("data list with vues are:::::::::::::::::::: ",data_lst,file=sys.stderr)
            seen_ids = set()
            filtered_dict = {}
            for item in data_lst:
                atom_id = item['atom_transition_id']
                if atom_id not in filtered_dict:
                    filtered_dict[atom_id] = item

            filtered_list = list(filtered_dict.values())
            unique_success_list = list(success_list)
            print("data filtered list is:::::::::::::::::::::::::::",filtered_list,file=sys.stderr)
            print("unique suucess list is::::::::::::::",unique_success_list,file=sys.stderr)

        response = SummeryResponseSchema(
            data = filtered_list,
            success=len(unique_success_list),
            error=len(error_list),
            success_list=unique_success_list,
            error_list=error_list
        )
        return (response),200

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Adding Atom Devices", status_code=500)


@router.post("/edit_atom", responses={
    200: {"model": Response200},
    400: {"model": str},
    500: {"model": str}
})
async def edit_atom(atom: EditAtomRequestSchema):
    try:
        atom = atom.dict()
        response, status = edit_atom_util(atom)
        print("response in edit atom is::::::::::::::::::::::::::::",response,file=sys.stderr)

        return JSONResponse(response)
    except Exception:
        traceback.print_exc()
        return "Error Occurred While Updating Atom Device", 500


@router.get("/get_atoms", responses={
    200: {"model": list[GetAtomResponseSchema] | None},
    500: {"model": str}
})
async def get_atoms():
    try:

        atom_obj_list = []
        count = 0
        try:
            transition_list = get_transition_atoms()
            count = len(transition_list)
            for trans_atom in transition_list:
                atom_obj_list.append(trans_atom)
                # count = len(trans_atom)

            print("count for atom is::::::::::::::::::::::::::::::",count,file=sys.stderr)
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

                count +=1

            except Exception:
                traceback.print_exc()

        print(atom_obj_list, file=sys.stderr)

        if len(atom_obj_list) <= 0:
            atom_obj_list = None

        return JSONResponse(content=atom_obj_list, status_code=200)

    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Atom Devices", status_code=500)


@router.post("/delete_atom", responses={
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
           

            if "atom_id" in atom_obj and atom_obj['atom_id'] is not None and atom_obj['atom_id'] != 0:
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
                        deleted_atoms_lst.append(deleted_atom)
                else:
                    not_found_atom_id = atom_obj['atom_id']
                    print(f"Atom Not Found for atom_id: {not_found_atom_id}", file=sys.stderr)
                    error_list.append(f"Atom Not Found for atom_id: {not_found_atom_id}")

            print("start of atom tranistion::::::::::::::", file=sys.stderr)
            if "atom_transition_id" in atom_obj and atom_obj['atom_transition_id'] is not None and atom_obj['atom_transition_id'] != 0:
                print("atom tranistion found in :::::::::::::::::", file=sys.stderr)
                atom_transition = configs.db.query(AtomTransitionTable).filter_by(atom_transition_id=atom_obj["atom_transition_id"]).all()
                if atom_transition:
                    print("atom tranistion atom is::::::::::::::::::::::::::::::::", file=sys.stderr)
                    for atoms in atom_transition:
                        transition_atom_found = True
                        atom_transition_id = atoms.atom_transition_id
                        transition_atom_ip = atoms.ip_address
                        print("atom tranistion id:::::::::::::::::::::",atom_transition_id,file=sys.stderr)
                        DeleteDBData(atoms)
                        print("atom tranistion delted successsfully:::::::::::::::::::::::", file=sys.stderr)
                        deleted_atom['atom_transition_id'] = atom_transition_id
                        success_list.append(f"{transition_atom_ip} : Atom Tranistion Deleted Successfully")
                        deleted_atoms_lst.append(deleted_atom)
                else:
                    not_found_atom_transition_id = atom_obj['atom_transition_id']
                    print("Not found atom tranistion id is::::::::::::",file=sys.stderr)
                    print(f"Atom Transition Not Found for id: {not_found_atom_transition_id}", file=sys.stderr)
                    error_list.append(f"Atom Transition Not Found for id: {not_found_atom_transition_id}")
        

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
