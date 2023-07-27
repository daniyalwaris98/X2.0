import sys
import traceback

from datetime import datetime

from app.models.inventory_models import *
from app import db
from app.utilities.db_utils import *


na = "N/A"
tbf = "TBF"


def InsertUamDeviceData(data, atom, ip_addr):
    try:
        # result = (
        #         db.session.query(UAM_Device_Table, Atom_Table)
        #         .join(Atom_Table, Atom_Table.atom_id == UAM_Device_Table.atom_id)
        #         .filter(Atom_Table.ip_address == ip_addr)
        #         .first()
        #     )

        deviceObj = UAM_Device_Table.query.filter_by(atom_id=atom.atom_id).first()

        update = False
        if deviceObj is not None:
            update = True

        else:
            deviceObj = UAM_Device_Table()
            deviceObj.atom_id = atom.atom_id

        if "device" in data:
            if data["device"]["software_version"] is not None:
                deviceObj.software_version = data["device"]["software_version"]
            else:
                deviceObj.software_version = na
            if "patch_version" in data and data["device"]["patch_version"] is not None:
                deviceObj.patch_version = data["device"]["patch_version"]
            else:
                deviceObj.patch_version = na
            if data["device"]["status"] is not None:
                deviceObj.status = data["device"]["status"]
            else:
                deviceObj.status = na

            if data["device"]["manufecturer"] is not None:
                deviceObj.manufacturer = data["device"]["manufecturer"]
            else:
                deviceObj.manufacturer = na

            if data["device"]["authentication"] is not None:
                deviceObj.authentication = data["device"]["authentication"]
            else:
                deviceObj.authentication = na
            if data["device"]["serial_number"] is not None:
                deviceObj.serial_number = data["device"]["serial_number"]
            else:
                deviceObj.serial_number = na
            if data["device"]["pn_code"] is not None:
                deviceObj.pn_code = data["device"]["pn_code"]
            else:
                deviceObj.pn_code = na
            if data["device"]["hw_version"] is not None:
                deviceObj.hardware_version = data["device"]["hw_version"]
            else:
                deviceObj.hardware_version = na
            if data["device"]["max_power"] is not None:
                deviceObj.max_power = data["device"]["max_power"]
            else:
                deviceObj.max_power = na
            if "stack" in data["device"]:
                deviceObj.stack = data["device"]["stack"]
            else:
                deviceObj.stack = 1
            deviceObj.source = "Dynamic"

            if deviceObj.pn_code is not None:
                sntcDevice = SNTC_TABLE.query.filter_by(
                    pn_code=deviceObj.pn_code
                ).first()
                if sntcDevice:
                    if sntcDevice.hw_eos_date is not None:
                        deviceObj.hw_eos_date = sntcDevice.hw_eos_date
                    if sntcDevice.hw_eol_date is not None:
                        deviceObj.hw_eol_date = sntcDevice.hw_eol_date
                    if sntcDevice.sw_eos_date is not None:
                        deviceObj.sw_eos_date = sntcDevice.sw_eos_date
                    if sntcDevice.sw_eol_date is not None:
                        deviceObj.sw_eol_date = sntcDevice.sw_eol_date

            # deviceName = UAM_Device_Table.query.with_entities(UAM_Device_Table.device_name).filter_by(ip_address=deviceObj.ip_address).first()

            status_code = 500
            if update:
                print("Updated device " + ip_addr, file=sys.stderr)
                status_code = UpdateDBData(deviceObj)

            else:
                print("Inserted device " + ip_addr, file=sys.stderr)
                status_code = InsertDBData(deviceObj)

            uam_id = 0
            if status_code == 200:
                uam_id = deviceObj.uam_id

            return status_code, uam_id
        else:
            print("Device Inventory Not Found", file=sys.stderr)
            return 500, 0
    except Exception as e:
        traceback.print_exc()
        return 500, 0


def InsertUamDeviceBoardData(uam_id, data):
    for board in data["board"]:
        try:
            if "board_name" not in board.keys():
                continue

            if board["board_name"] is None:
                continue

            board["board_name"] = board["board_name"].strip()
            if board["board_name"] == "":
                continue

            boardObj = Board_Table.query.filter_by(
                board_name=board["board_name"], uam_id=uam_id
            ).first()

            update = False
            if boardObj is not None:
                update = True
            else:
                boardObj = Board_Table()
                boardObj.uam_id = uam_id
                boardObj.board_name = board["board_name"]

            if board["slot_id"] is not None:
                boardObj.device_slot_id = board["slot_id"]
            else:
                boardObj.device_slot_id = na

            if board["hw_version"] is not None:
                boardObj.hardware_version = board["hw_version"]
            else:
                boardObj.hardware_version = na

            if board["software_version"] is not None:
                boardObj.software_version = board["software_version"]
            else:
                boardObj.software_version = na

            if board["serial_number"] is not None:
                boardObj.serial_number = board["serial_number"]
            else:
                boardObj.serial_number = na

            if board["status"] is not None:
                boardObj.status = board["status"]
            else:
                boardObj.status = na

            if board["pn_code"] is not None:
                boardObj.pn_code = board["pn_code"]
            else:
                boardObj.pn_code = na

            if boardObj.pn_code is not None:
                sntcDevice = SNTC_TABLE.query.filter_by(
                    pn_code=boardObj.pn_code
                ).first()
                if sntcDevice:
                    if sntcDevice.hw_eos_date is not None:
                        boardObj.eos_date = sntcDevice.hw_eos_date
                    if sntcDevice.hw_eol_date is not None:
                        boardObj.eol_date = sntcDevice.hw_eol_date
                    if sntcDevice.manufacturer_date is not None:
                        boardObj.manufacturer_date = sntcDevice.manufacturer_date

            # if boardObj.serial_number:
            #     boardName = (
            #         Board_Table.query.with_entities(Board_Table.board_name)
            #         .filter_by(serial_number=boardObj.serial_number)
            #         .first()
            #     )
            # else:
            #     boardName = (
            #         Board_Table.query.with_entities(Board_Table.board_name)
            #         .filter_by(board_name=boardObj.board_name)
            #         .first()
            #     )

            if update:
                print(
                    "Updated board "
                    + boardObj.board_name
                    + " with serial number "
                    + boardObj.serial_number,
                    file=sys.stderr,
                )
                UpdateDBData(boardObj)

            else:
                print(
                    "Inserted board "
                    + boardObj.board_name
                    + " with serial number "
                    + boardObj.serial_number,
                    file=sys.stderr,
                )
                InsertDBData(boardObj)

        except Exception:
            traceback.print_exc()


def InsertUamDeviceSubBoardData(uam_id, data):
    # print("$$$$$$$$ INSERT UAM DEVICE SUBBOARD DATA ", file=sys.stderr)
    for subboard in data["sub_board"]:
        try:
            if "subboard_name" not in subboard.keys():
                continue

            if subboard["subboard_name"] is None:
                continue

            subboard["subboard_name"] = subboard["subboard_name"].strip()
            if subboard["subboard_name"] == "":
                continue

            subboardObj = Subboard_Table.query.filter_by(
                board_name=subboard["subboard_name"], uam_id=uam_id
            ).first()

            update = False
            if subboardObj is not None:
                update = True
            else:
                subboardObj = Subboard_Table()
                subboardObj.uam_id = uam_id
                subboardObj.subboard_name = subboard["subboard_name"]

            if subboard["subboard_type"] is not None:
                subboardObj.subboard_type = subboard["subboard_type"]
            else:
                subboardObj.subboard_type = na

            if "subrack_id" in subboard and subboard["subrack_id"] is not None:
                subboardObj.subrack_id = subboard["subrack_id"]
            else:
                subboardObj.subrack_id = na

            if subboard["slot_number"] is not None:
                subboardObj.slot_number = subboard["slot_number"]
            else:
                subboardObj.slot_number = na

            if subboard["subslot_number"] is not None:
                subboardObj.subslot_number = subboard["subslot_number"]
            else:
                subboardObj.subslot_number = na

            if subboard["hw_version"] is not None:
                subboardObj.hardware_version = subboard["hw_version"]
            else:
                subboardObj.hardware_version = na

            if (
                "software_version" in subboard
                and subboard["software_version"] is not None
            ):
                subboardObj.software_version = subboard["software_version"]
            else:
                subboardObj.software_version = na

            if subboard["serial_number"] is not None:
                subboardObj.serial_number = subboard["serial_number"]
            else:
                subboardObj.serial_number = na

            if subboard["status"] is not None:
                subboardObj.status = subboard["status"]
            else:
                subboardObj.status = na

            if subboard["pn_code"] is not None:
                subboardObj.pn_code = subboard["pn_code"]
            else:
                subboardObj.pn_code = na

            if subboardObj.pn_code is not None:
                sntcDevice = SNTC_TABLE.query.filter_by(
                    pn_code=subboardObj.pn_code
                ).first()

                if sntcDevice:
                    if sntcDevice.hw_eos_date is not None:
                        subboardObj.eos_date = sntcDevice.hw_eos_date
                    if sntcDevice.hw_eol_date is not None:
                        subboardObj.eol_date = sntcDevice.hw_eol_date

            # if subboardObj.serial_number:
            #     subboardName = (
            #         Subboard_Table.query.with_entities(Subboard_Table.subboard_name)
            #         .filter_by(serial_number=subboardObj.serial_number)
            #         .first()
            #     )
            # else:
            #     subboardName = (
            #         Subboard_Table.query.with_entities(Subboard_Table.subboard_name)
            #         .filter_by(subboard_name=subboardObj.subboard_name)
            #         .first()
            #     )

            if update:
                print(
                    "Updated subboard "
                    + str(subboardObj.subboard_name)
                    + " with serial number "
                    + subboardObj.serial_number,
                    file=sys.stderr,
                )
                UpdateDBData(subboardObj)
            else:
                print(
                    "Inserted subboard "
                    + str(subboardObj.subboard_name)
                    + " with serial number "
                    + subboardObj.serial_number,
                    file=sys.stderr,
                )
                InsertDBData(subboardObj)

        except Exception:
            traceback.print_exc()


def InsertUamDeviceSfpData(uam_id, data):
    for sfp in data["sfp"]:
        try:
            if "serial_number" not in sfp:
                continue

            if sfp["serial_number"] is None:
                continue

            sfp["serial_number"] = sfp["serial_number"].strip()
            if sfp["serial_number"] == "":
                continue

            sfpData = Sfps_Table.query.filter_by(
                serial_number=sfp["serial_number"], uam_id=uam_id
            ).first()

            update = False
            if sfpData is not None:
                update = True
            else:
                sfpData = Sfps_Table()
                sfpData.uam_id = uam_id
                sfpData.serial_number = sfp["serial_number"]

            if sfp["media_type"] is not None:
                sfpData.media_type = sfp["media_type"]
            else:
                sfpData.media_type = na

            if sfp["port_name"] is not None:
                sfpData.port_name = sfp["port_name"].strip()
            else:
                sfpData.port_name = na

            if sfp["port_type"] is not None:
                sfpData.port_type = sfp["port_type"]
            else:
                sfpData.port_type = na

            if sfp["connector"] is not None:
                sfpData.connector = sfp["connector"]
            else:
                sfpData.connector = na

            if sfp["mode"] is not None:
                sfpData.mode = sfp["mode"]
            else:
                sfpData.mode = na

            if sfp["speed"] is not None:
                sfpData.speed = sfp["speed"]
            else:
                sfpData.speed = na

            if sfp["wavelength"] is not None:
                sfpData.wavelength = sfp["wavelength"]
            else:
                sfpData.wavelength = na

            if sfp["manufacturer"] is not None:
                sfpData.manufacturer = sfp["manufacturer"]
            else:
                sfpData.manufacturer = na

            if sfp["optical_direction_type"] is not None:
                sfpData.optical_direction_type = sfp["optical_direction_type"]
            else:
                sfpData.optical_direction_type = na

            if sfp["pn_code"] is not None:
                sfpData.pn_code = sfp["pn_code"]
            else:
                sfpData.pn_code = na

            if sfp["status"] is not None:
                sfpData.status = sfp["status"]
            else:
                sfpData.status = na

            if sfpData.pn_code is not None:
                sntcDevice = SNTC_TABLE.query.filter_by(pn_code=sfpData.pn_code).first()
                if sntcDevice:
                    if sntcDevice.hw_eos_date is not None:
                        sfpData.eos_date = sntcDevice.hw_eos_date
                    if sntcDevice.hw_eol_date is not None:
                        sfpData.eol_date = sntcDevice.hw_eol_date

            # if sfpObj:
            #     if sfpObj.serial_number=="NE":
            #         sfpObj = Sfps_Table.query.with_entities(Sfps_Table).filter_by(device_name=sfpData.device_name).filter_by(port_name=sfpData.port_name.strip()).first()

            if update:
                print(
                    "Updated sfp "
                    + str(sfpData.port_name)
                    + " with serial number "
                    + sfpData.serial_number,
                    file=sys.stderr,
                )
                UpdateDBData(sfpData)
            else:
                print(
                    "Inserted sfp "
                    + str(sfpData.port_name)
                    + " with serial number "
                    + sfpData.serial_number,
                    file=sys.stderr,
                )
                InsertDBData(sfpData)
        except Exception:
            traceback.print_exc()


def InsertUamDeviceLicenseData(uam_id, data):
    # print("$$$$$$$$ INSERT UAM DEVICE LICENSE DATA ", file=sys.stderr)
    for license in data["license"]:
        try:
            if "name" not in license:
                continue

            if license["name"] is None:
                continue

            license["name"] = license["name"].strip()
            if license["name"] == "":
                continue

            licenseData = License_Table.query.filter_by(
                license_name=license["name"], uam_id=uam_id
            ).first()

            update = False
            if licenseData is not None:
                update = True
            else:
                licenseData = License_Table()
                licenseData.uam_id = uam_id
                licenseData.license_name = license["name"]

            if license["description"] is not None:
                licenseData.license_description = license["description"]
            else:
                licenseData.license_description = na

            if "activation_date" in license:
                licenseData.activation_date = FormatStringDate(
                    license["activation_date"]
                )

            if license["grace_period"] is not None:
                licenseData.grace_period = license["grace_period"]
            else:
                licenseData.grace_period = na

            if "expiry_date" in license:
                licenseData.expiry_date = FormatStringDate(license["expiry_date"])

            if license["serial_number"] is not None:
                licenseData.serial_number = license["serial_number"]
            else:
                licenseData.serial_number = na

            if license["status"] is not None:
                licenseData.status = license["status"]
            else:
                licenseData.status = na

            if license["capacity"] is not None:
                licenseData.capacity = license["capacity"]
            else:
                licenseData.capacity = na

            if license["usage"] is not None:
                licenseData.usage = license["usage"]
            else:
                licenseData.usage = na

            if license["pn_code"] is not None:
                licenseData.pn_code = license["pn_code"]
            else:
                licenseData.pn_code = na

            if update:
                UpdateDBData(licenseData)
            else:
                InsertDBData(licenseData)
        except Exception:
            traceback.print_exc()


def InsertUamDeviceApsData(uam_id, data):
    for ap in data["aps"]:
        try:
            if "serial_number" not in ap:
                continue

            if ap["serial_number"] is None:
                continue

            ap["serial_number"] = ap["serial_number"].strip()
            if ap["serial_number"] == "":
                continue

            apsData = APS_TABLE.query.filter_by(
                serial_number=ap["serial_number"], uam_id=uam_id
            ).first()

            update = False
            if apsData is not None:
                update = True
            else:
                apsData = APS_TABLE()
                apsData.uam_id = uam_id
                apsData.serial_number = ap["serial_number"]

            if "name" in ap:
                apsData.ap_name = ap["name"]

            if ap["description"] is not None:
                apsData.description = ap["description"]
            else:
                apsData.description = na

            if "ip_addr" in ap:
                apsData.ap_ip = ap["ip_addr"]

            if ap["serial_number"] is not None:
                apsData.serial_number = ap["serial_number"]
            else:
                apsData.serial_number = na

            if ap["hw_version"] is not None:
                apsData.hardware_version = ap["hw_version"]
            else:
                apsData.hardware_version = na

            if ap["software_version"] is not None:
                apsData.software_version = ap["software_version"]
            else:
                apsData.software_version = na

            if update:
                UpdateDBData(apsData)
            else:
                InsertDBData(apsData)
        except Exception:
            traceback.print_exc()


def UamInventoryData(pullerData):
    failed = False
    try:
        for ip_addr in pullerData.keys():
            print(f"\n\n{ip_addr} : Checking Device For Onboarding", file=sys.stderr)
            data = pullerData[ip_addr]

            if data["status"] == "error":
                print(f"\n\n{ip_addr} : Error - Login Failed Skipping", file=sys.stderr)
                failed = True

            elif data["status"] == "success":
                atom = Atom_Table.query.filter_by(ip_address=ip_addr).first()
                if atom is None:
                    print(f"\n\n{ip_addr} : Error - Not Found In Atom", file=sys.stderr)
                    # return "IP Address Not Found",500
                    failed = True
                    continue

                print(f"\n\n{ip_addr} : Device Found in Atom", file=sys.stderr)

                status_code, uam_id = InsertUamDeviceData(data, atom, ip_addr)

                if status_code == 200 and uam_id != 0:
                    atom.onboard_status = "True"
                    UpdateDBData(atom)

                    try:
                        InsertUamDeviceBoardData(uam_id, data)
                        print(
                            f"\n{ip_addr} : Boards Added Successfully", file=sys.stderr
                        )
                    except Exception:
                        print(
                            f"\n{ip_addr} : Error In Board Insertion", file=sys.stderr
                        )
                        traceback.print_exc()

                    try:
                        InsertUamDeviceSubBoardData(uam_id, data)
                        print(
                            f"\n{ip_addr} : Sub-Boards Added Successfully",
                            file=sys.stderr,
                        )
                    except Exception:
                        print(
                            f"\n{ip_addr} : Error In Sub-Board Insertion",
                            file=sys.stderr,
                        )
                        traceback.print_exc()

                    try:
                        InsertUamDeviceSfpData(uam_id, data)
                        print(f"\n{ip_addr} : SFPs Added Successfully", file=sys.stderr)
                    except Exception:
                        print(
                            f"\n\n{ip_addr} : Error In Sfp Insertion", file=sys.stderr
                        )
                        traceback.print_exc()

                    try:
                        InsertUamDeviceLicenseData(uam_id, data)
                        print(
                            f"\n{ip_addr} : Licenses Added Successfully",
                            file=sys.stderr,
                        )
                    except Exception:
                        print(
                            f"\n\n{ip_addr} : Error In License Insertion",
                            file=sys.stderr,
                        )
                        traceback.print_exc()

                else:
                    print("Device Not Found", file=sys.stderr)
        else:
            print(
                f"Error while getting data from device {ip_addr} error {e}",
                file=sys.stderr,
            )
            failed = True

    except Exception as e:
        traceback.print_exc()
        print(
            f"Error while getting data from device {ip_addr} error {e}", file=sys.stderr
        )
        failed = True
    return failed
