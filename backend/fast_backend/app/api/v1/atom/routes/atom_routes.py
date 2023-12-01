from app.api.v1.atom.utils.atom_utils import *
from app.schema.validation_schema import Validator
# from app.schema.response_schema import Response200


router = APIRouter(
    prefix="/atom",
    tags=["atom"],
)

###test
@router.post("/add_atom_device", responses={
    200: {"model": Response200},
    400: {"model": str},
    500: {"model": str}
})
async def add_atom(atom: AddAtomRequestSchema):
    try:
        print("add atom is being executed::::::::::::::::::::::::::::",file=sys.stderr)
        response, status = add_complete_atom(atom, False)
        print("response of add complete atom is::::::::::::::::::::::::::::",response,file=sys.stderr)
        print("status for add complete atom is :::::::::::::::::::::",status,file=sys.stderr)
        atom_response = response
        if status != 200:
            response, status = add_transition_atom(atom, False)
            if isinstance(response,dict):
                print("if reponse not 200::::::::::::::::::::::::::::::::::::::::::",response,file=sys.stderr)
                transition_message = response.get('message', '')
                print("tranistion message is:::::::::::::::",transition_message,file=sys.stderr)
                # Appending the transition atom message to the existing atom_response message
                updated_message = f"{atom_response} {transition_message}"
                print("update message is:::::::::::::::::::",updated_message,file=sys.stderr)
                # Assigning the updated_message to the 'message' key in the existing response
                response['message'] = updated_message
                print("reposne message is::::::::::::::::::",response['message'],file=sys.stderr)
                return JSONResponse(content=response, status_code=status)
            else:
                return JSONResponse(content=response, status_code=status)
        elif status ==400:
            print("status is 400:::::::::::::::::::::::::::::::::",400,file=sys.stderr)
            return JSONResponse(content = response,status_code = 400)
        else:
            return JSONResponse(content = response,status_code = status)

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
        filtered_list = []  
        unique_success_list = []
        for atomObj in atom_objs:
            print("step1::::::::::::::::::::::",file=sys.stderr)
            try:
                row += 1
                atomObj["ip_address"] = atomObj["ip_address"].strip()
                if atomObj["ip_address"] == "":
                    error_list.append(f"Row {row} : IP Address Can Not Be Empty")
                    

                atom = configs.db.query(AtomTable).filter(
                    AtomTable.ip_address == atomObj["ip_address"]).first()
                transit_atom = configs.db.query(AtomTransitionTable).filter(
                    AtomTransitionTable.ip_address == atomObj["ip_address"]
                ).first()

                if atom is not None:
                    msg, status = add_complete_atom(atomObj, True)
                    print("msg in atom is ::::::::::::::::",msg,file=sys.stderr)
                    if isinstance(msg,dict):
                        for key,value in msg.items():
                                print("key for msg ares for instance::::::::::::::::::::",key,file=sys.stderr)
                                print("values are instance:::::::::::::::::::::::::::::",value,file=sys.stderr)

                                if key =='data':
                                    data_lst.append(value)
                                if key == 'message':
                                    if value not in success_list:
                                        success_list.append(value)
                    else:
                        print("atom msg ims not a dict and it is string",file=sys.stderr)
                        error_list.append(msg)
                elif transit_atom is not None:
                    msg, status = add_transition_atom(atomObj, True)
                   
                    for key,value in msg.items():
                    

                        if key =='data':
                            data_lst.append(value)
                        if key == 'message':
                           if value not in success_list:
                                    # print("values for the message is::::::::::::::::::::::",value,file=sys.stderr)
                                    success_list.append(value)
                else:
                    msg, status = add_complete_atom(atomObj, False)
                    print("msg for add complete atom is34343434343434:::::::::::::::::::::",msg,file=sys.stderr)
                    if isinstance(msg, dict):
                        for key,value in msg.items():
                                print("key for msg ares::::::::::::::::::::",key,file=sys.stderr)
                                print("values are:::::::::::::::::::::::::::::",value,file=sys.stderr)

                                if key =='data':
                                    data_lst.append(value)
                                if key == 'message':
                                    if value not in success_list:
                                        print("values for the message is::::::::::::::::::::::",value,file=sys.stderr)
                                        success_list.append(value)

                    if status != 200:
                        msg, status = add_transition_atom(atomObj, False)
                        if isinstance(msg,dict):
                            for key,value in msg.items():
                                if key =='data':
                                    data_lst.append(value)
                                if key == 'message':
                                    if value not in success_list:
                                        # print("values for the message is::::::::::::::::::::::",value,file=sys.stderr)
                                        success_list.append(value)
                        else:
                            error_list.append(msg)
            except Exception:
                traceback.print_exc()
                status = 500
                msg = f"{atomObj['ip_address']} : Exception Occurred"
            seen_ids = set()
            filtered_dict = {}
            for item in data_lst:
                print("step2 is:::::::::::::::::::::::::::::::::::::::::::")
                atom_transition_id = item.get('atom_transition_id')
                atom_id = item.get('atom_id')
    
                # Case: atom_transition_id is present, but atom_id is missing
                if atom_transition_id is not None and atom_id is None:
                    if atom_transition_id not in filtered_dict:
                        filtered_dict[atom_transition_id] = item
                
                # Case: atom_id is present, but atom_transition_id is missing
                elif atom_id is not None and atom_transition_id is None:
                    if atom_id not in filtered_dict:
                        filtered_dict[atom_id] = item
                
                # Case: Both atom_transition_id and atom_id are present
                elif atom_transition_id is not None and atom_id is not None:
                    if atom_transition_id not in filtered_dict and atom_id not in filtered_dict:
                        filtered_dict[atom_transition_id] = item
                        filtered_dict[atom_id] = item
            filtered_list.append(filtered_dict.values())
            unique_success_list.append(success_list)
            # filtered_list = list(filtered_dict.values())
            # unique_success_list = list(success_list)
        print("step 3 is::::::::::::::::::::::::::::::::::::::::",file=sys.stderr)
        print("filtered data list is:::::::::::::::",filtered_list,file=sys.stderr)
        print("unique success liset is:::::::::::::::::::::::::::",unique_success_list,file=sys.stderr)
        if not filtered_list:
            print("step4::::::::::::::::::::::::::::::::::Filtered list is None")
            error_list.append("Empty Import")
        response = SummeryResponseSchema(
            data = filtered_list,
            success=len(unique_success_list),
            error=len(error_list),
            success_list=unique_success_list,
            error_list=error_list
        )
        return response

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

            # print("count for atom is::::::::::::::::::::::::::::::",count,file=sys.stderr)
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
        sorted_list = sorted(atom_obj_list, key=lambda x: x['creation_date'], reverse=True)
        # print("sorted list based on the creation date is::::::::::::::::::::::",sorted_list,file=sys.stderr)
        if len(atom_obj_list) <= 0:
            atom_obj_list = None

        return JSONResponse(content=sorted_list, status_code=200)

    except Exception:
        configs.db.rollback()
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Fetching Atom Devices", status_code=500)


@router.post("/delete_atom", responses={
    200: {"model": DeleteResponseSchema},
    500: {"model": str}
})
def delete_atom(atom_list: List[DeleteAtomRequestSchema]):
    try:
        success_list = []
        error_list = []
        deleted_atoms_lst = []
        atom_found = False 
        transition_atom_found = False
        delete_atom = {}
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

            print("start of atom transition::::::::::::::", file=sys.stderr)
            if "atom_transition_id" in atom_obj and atom_obj['atom_transition_id'] is not None and atom_obj['atom_transition_id'] != 0:
                print("atom transition found in :::::::::::::::::", file=sys.stderr)
                atom_transition = configs.db.query(AtomTransitionTable).filter_by(atom_transition_id=atom_obj["atom_transition_id"]).all()
                if atom_transition:
                    print("atom transition atom is::::::::::::::::::::::::::::::::", file=sys.stderr)
                    for atoms in atom_transition:
                        transition_atom_found = True
                        atom_transition_id = atoms.atom_transition_id
                        transition_atom_ip = atoms.ip_address
                        print("atom transition id:::::::::::::::::::::",atom_transition_id,file=sys.stderr)
                        DeleteDBData(atoms)
                        print("atom transition delted successsfully:::::::::::::::::::::::", file=sys.stderr)
                        deleted_atom['atom_transition_id'] = atom_transition_id
                        success_list.append(f"{transition_atom_ip} : Atom Transition Deleted Successfully")
                        deleted_atoms_lst.append(deleted_atom)
                else:
                    not_found_atom_transition_id = atom_obj['atom_transition_id']
                    print("Not found atom tranistion id is::::::::::::",file=sys.stderr)
                    print(f"Atom transition Not Found for id: {not_found_atom_transition_id}", file=sys.stderr)
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

        return response
    except Exception:
        traceback.print_exc()
        return JSONResponse(content="Error Occurred While Deleting Atom", status_code=500)
