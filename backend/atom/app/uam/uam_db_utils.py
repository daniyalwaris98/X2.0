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
            # if atom.virtual is not None:
            #     deviceObj.virtual= atom.virtual
            # else:
            #     deviceObj.virtual = tbf
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

            # if deviceObj.pn_code is not None:
            #     sntcDevice = SNTC_TABLE.query.filter_by(pn_code=deviceObj.pn_code).first()
            #     if sntcDevice:

            #         if sntcDevice.hw_eos_date is not None:
            #             deviceObj.hw_eos_date = sntcDevice.hw_eos_date
            #         if sntcDevice.hw_eol_date is not None:
            #             deviceObj.hw_eol_date = sntcDevice.hw_eol_date
            #         if sntcDevice.sw_eos_date is not None:
            #             deviceObj.sw_eos_date = sntcDevice.sw_eos_date
            #         if sntcDevice.sw_eol_date is not None:
            #             deviceObj.sw_eol_date = sntcDevice.sw_eol_date

            # deviceName = UAM_Device_Table.query.with_entities(UAM_Device_Table.device_name).filter_by(ip_address=deviceObj.ip_address).first()

            status_code = 500
            if update:
                print("Updated device " + ip_addr, file=sys.stderr)
                status_code = UpdateDBData(deviceObj)

            else:
                print("Inserted device " + ip_addr, file=sys.stderr)
                status_code = InsertDBData(deviceObj)

            return status_code
        else:
            print("Device Inventory Not Found", file=sys.stderr)
            return 500
    except Exception as e:
        traceback.print_exc()
        return 500


def InsertUamDeviceBoardData(deviceName, data):
    # print("$$$$$$$$ INSERT UAM DEVICE BOARD DATA ", file=sys.stderr)
    for board in data["board"]:
        boardObj = Board_Table()
        boardObj.device_name = deviceName
        if "board_name" in board:
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
            sntcDevice = SNTC_TABLE.query.filter_by(pn_code=boardObj.pn_code).first()
            if sntcDevice:
                if sntcDevice.hw_eos_date is not None:
                    boardObj.eos_date = sntcDevice.hw_eos_date
                if sntcDevice.hw_eol_date is not None:
                    boardObj.eol_date = sntcDevice.hw_eol_date
                if sntcDevice.manufacturer_date is not None:
                    boardObj.manufacturer_date = sntcDevice.manufacturer_date
        if boardObj.serial_number:
            boardName = (
                Board_Table.query.with_entities(Board_Table.board_name)
                .filter_by(serial_number=boardObj.serial_number)
                .first()
            )
        else:
            boardName = (
                Board_Table.query.with_entities(Board_Table.board_name)
                .filter_by(board_name=boardObj.board_name)
                .first()
            )

        if boardName is not None:
            boardObj.board_name = boardName[0]
            print(
                "Updated board "
                + boardObj.board_name
                + " with serial number "
                + boardObj.serial_number,
                file=sys.stderr,
            )
            boardObj.modification_date = datetime.now()
            UpdateData(boardObj)

        else:
            print(
                "Inserted board "
                + boardObj.board_name
                + " with serial number "
                + boardObj.serial_number,
                file=sys.stderr,
            )
            boardObj.creation_date = datetime.now()
            boardObj.modification_date = datetime.now()
            InsertData(boardObj)


def InsertUamDeviceSubBoardData(deviceName, data):
    # print("$$$$$$$$ INSERT UAM DEVICE SUBBOARD DATA ", file=sys.stderr)
    for subboard in data["sub_board"]:
        subboardObj = Subboard_Table()
        subboardObj.device_name = deviceName
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
        if "software_version" in subboard and subboard["software_version"] is not None:
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
            sntcDevice = SNTC_TABLE.query.filter_by(pn_code=subboardObj.pn_code).first()
        if sntcDevice:
            if sntcDevice.hw_eos_date is not None:
                subboardObj.eos_date = sntcDevice.hw_eos_date
            if sntcDevice.hw_eol_date is not None:
                subboardObj.eol_date = sntcDevice.hw_eol_date

        if subboardObj.serial_number:
            subboardName = (
                Subboard_Table.query.with_entities(Subboard_Table.subboard_name)
                .filter_by(serial_number=subboardObj.serial_number)
                .first()
            )
        else:
            subboardName = (
                Subboard_Table.query.with_entities(Subboard_Table.subboard_name)
                .filter_by(subboard_name=subboardObj.subboard_name)
                .first()
            )
        if subboardName is not None:
            subboardObj.subboard_name = subboardName[0]
            print(
                "Updated subboard "
                + str(subboardObj.subboard_name)
                + " with serial number "
                + subboardObj.serial_number,
                file=sys.stderr,
            )
            subboardObj.modification_date = datetime.now()
            UpdateData(subboardObj)
        else:
            print(
                "Inserted subboard "
                + str(subboardObj.subboard_name)
                + " with serial number "
                + subboardObj.serial_number,
                file=sys.stderr,
            )
            subboardObj.creation_date = datetime.now()
            subboardObj.modification_date = datetime.now()
            InsertData(subboardObj)


def InsertUamDeviceSfpData(deviceName, data):
    # print("$$$$$$$$ INSERT UAM DEVICE SFP DATA ", file=sys.stderr)
    for sfp in data["sfp"]:
        sfpData = Sfps_Table()
        sfpData.device_name = deviceName
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
        if sfp["serial_number"] is not None:
            sfpData.serial_number = sfp["serial_number"]
        else:
            sfpData.serial_number = na

        if sfpData.pn_code is not None:
            sntcDevice = SNTC_TABLE.query.filter_by(pn_code=sfpData.pn_code).first()
            if sntcDevice:
                if sntcDevice.hw_eos_date is not None:
                    sfpData.eos_date = sntcDevice.hw_eos_date
                if sntcDevice.hw_eol_date is not None:
                    sfpData.eol_date = sntcDevice.hw_eol_date

        sfpObj = (
            Sfps_Table.query.with_entities(Sfps_Table)
            .filter_by(serial_number=sfpData.serial_number)
            .first()
        )

        # if sfpObj:
        #     if sfpObj.serial_number=="NE":
        #         sfpObj = Sfps_Table.query.with_entities(Sfps_Table).filter_by(device_name=sfpData.device_name).filter_by(port_name=sfpData.port_name.strip()).first()

        if sfpObj:
            sfpData.sfp_id = sfpObj.sfp_id
            print(
                "Updated sfp "
                + str(sfpData.port_name)
                + " with serial number "
                + sfpData.serial_number,
                file=sys.stderr,
            )
            sfpData.modification_date = datetime.now()
            UpdateData(sfpData)
        else:
            print(
                "Inserted sfp "
                + str(sfpData.port_name)
                + " with serial number "
                + sfpData.serial_number,
                file=sys.stderr,
            )
            sfpData.creation_date = datetime.now()
            sfpData.modification_date = datetime.now()
            InsertData(sfpData)


def InsertUamDeviceLicenseData(device_name, data):
    # print("$$$$$$$$ INSERT UAM DEVICE LICENSE DATA ", file=sys.stderr)
    for license in data["license"]:
        if license["name"] != "":
            licenseData = License_Table()
            if "name" in license:
                licenseData.license_name = license["name"]
            if license["description"] is not None:
                licenseData.license_description = license["description"]
            else:
                licenseData.license_description = na
            # licenseData.device_name = license['device_name']
            licenseData.device_name = device_name
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

            licenseName = (
                License_Table.query.with_entities(License_Table.license_name)
                .filter_by(license_name=licenseData.license_name)
                .first()
            )

            if licenseName is not None:
                licenseData = licenseName[0]
                UpdateData(licenseData)
            else:
                InsertData(licenseData)

    # atom.onboard_status = 'true'
    # UpdateData(atom)


# def InsertUamDeviceApsData(device_name, data):
#                 for ap in data['aps']:
#                             if ap['name'] != "":
#                                 apsData = APS_TABLE()
#                                 if 'name' in ap:
#                                     apsData.ap_name = ap['name']
#                                 if ap['description'] is not None:
#                                     apsData.description = ap['description']
#                                 else:
#                                     apsData.description= na
#                                 # licenseData.device_name = license['device_name']
#                                 apsData.controller_name = device_name
#                                 if 'ip_addr' in ap:
#                                     apsData.ap_ip = ap['ip_addr']

#                                 if ap['serial_number'] is not None:
#                                     apsData.serial_number = ap['serial_number']
#                                 else:
#                                     apsData.serial_number= na
#                                 if ap['hw_version'] is not None:
#                                     apsData.hardware_version = ap['hw_version']
#                                 else:
#                                     apsData.hardware_version= na
#                                 if ap['software_version'] is not None:
#                                     apsData.software_version = ap['software_version']
#                                 else:
#                                     apsData.software_version= na

#                                 apName = APS_TABLE.query.with_entities(APS_TABLE.ap_name).filter_by(ap_name=apsData.ap_name).first()


#                                 if apName is not None:
#                                     apData = apName[0]
#                                     UpdateData(apData)
#                                 else:
#                                     InsertData(apData)
def UamInventoryData(pullerData):
    error = False
    failed = False
    try:
        for ip_addr in pullerData.keys():
            print(f"\n\n{ip_addr} : Checking Device For Onboarding", file=sys.stderr)
            data = pullerData[ip_addr]

            if data["status"] == "error":
                print(f"\n\n{ip_addr} : Error - Login Failed Skipping", file=sys.stderr)
                error = True
                failed = True

            elif data["status"] == "success":
                atom = Atom_Table.query.filter_by(ip_address=ip_addr).first()
                if atom is None:
                    print(f"\n\n{ip_addr} : Error - Not Found In Atom", file=sys.stderr)
                    # return "IP Address Not Found",500
                    failed = True
                    error = True
                    continue

                print(f"\n\n{ip_addr} : Device Found in Atom", file=sys.stderr)

                status_code = InsertUamDeviceData(data, atom, ip_addr)

                if status_code == 200:
                    atom.onboard_status = "True"
                    UpdateDBData(atom)

                    # try:
                    #     InsertUamDeviceBoardData(name, data)
                    # except Exception:
                    #     print(f"\n\n{ip_addr} : Error In Board Insertion", file=sys.stderr)
                    #     traceback.print_exc()

                    # try:
                    #     InsertUamDeviceSubBoardData(name, data)
                    # except Exception:
                    #     print(f"\n\n{ip_addr} : Error In Sub-Board Insertion", file=sys.stderr)
                    #     traceback.print_exc()

                    # try:
                    #     InsertUamDeviceSfpData(name, data)
                    # except Exception:
                    #     print(f"\n\n{ip_addr} : Error In Sfp Insertion", file=sys.stderr)
                    #     traceback.print_exc()

                    # try:
                    #     InsertUamDeviceLicenseData(name, data)
                    # except Exception:
                    #     print(f"\n\n{ip_addr} : Error In License Insertion", file=sys.stderr)
                    #     traceback.print_exc()

                else:
                    print("Device Not Found", file=sys.stderr)
        # else:
        #     print(
        #         f"Error while getting data from device {ip_addr} error {e}",
        #         file=sys.stderr,
        #     )
        #     error = True
        #     failed = True

    except Exception as e:
        traceback.print_exc()
        print(
            f"Error while getting data from device {ip_addr} error {e}", file=sys.stderr
        )
        error = True
        failed = True
    return failed
