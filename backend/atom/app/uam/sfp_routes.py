from app.api.v1.uam.uam_utils import *


@app.route("/sfpStatus", methods=["GET"])
@token_required
def SfpStatus(user_data):
    try:
        queryString = "select distinct MODE,count(MODE) from sfp_table where MODE!='' and MODE is NOT NULL group by MODE;"
        result = db.session.execute(queryString)
        objList = []
        for row in result:
            status = row[0]
            count = row[1]
            objDict = {}
            objDict[status] = count
            # objDict['value'] = count
            objList.append(objDict)
        y = {}
        for i in objList:
            for j in i:
                y[j] = i[j]

        print(y, file=sys.stderr)
        return (y), 200
    except Exception as e:
        traceback.print_exc()
        return "Error While Fetching SFP Data", 500


@app.route("/sfpMode", methods=["GET"])
@token_required
def SfpMode(user_data):
    try:
        queryString = f"select PORT_TYPE,count(PORT_TYPE) from sfp_table where PORT_TYPE!='' and PORT_TYPE is not NULL group by PORT_TYPE;"
        result = db.session.execute(queryString)
        objList = []
        for row in result:
            mode = row[0]
            count = row[1]
            objDict = {}
            objDict[mode] = count
            # objDict['value'] = count
            objList.append(objDict)
        print(objList, file=sys.stderr)
        y = {}
        for i in objList:
            for j in i:
                y[j] = i[j]

        print(y, file=sys.stderr)
        return (y), 200
    except Exception as e:
        traceback.print_exc()
        return "Error While Fetching SFP Data", 500


@app.route("/getSfpsDetailsByIpAddress", methods=["GET"])
@token_required
def GetSfpsDetailsByIpAddress(user_data):
    try:
        ip_address = None
        try:
            ip_address = request.args.get("ipaddress")
        except Exception:
            traceback.print_exc()
            return "Ip Address Is Missing From URL", 500

        if ip_address is not None:
            try:
                results = (
                    db.session.query(Sfps_Table, UAM_Device_Table, Atom_Table)
                    .join(
                        UAM_Device_Table, Sfps_Table.uam_id == UAM_Device_Table.uam_id
                    )
                    .join(Atom_Table, UAM_Device_Table.atom_id == Atom_Table.atom_id)
                    .filter(Atom_Table.ip_address == ip_address)
                    .all()
                )

                objList = []
                for sfp, uam, atom in results:
                    objDict = {}
                    objDict["sfp_id"] = sfp.sfp_id
                    objDict["device_name"] = atom.device_name
                    objDict["media_type"] = sfp.media_type
                    objDict["port_name"] = sfp.port_name
                    objDict["port_type"] = sfp.port_type
                    # objDict['connector'] =  connector
                    objDict["mode"] = sfp.mode
                    # objDict['speed'] = speed
                    # objDict['wavelength'] = wavelength
                    # objDict['optical_direction_type'] =optical_direction_type
                    # objDict['pn_code'] = pn_code
                    objDict["creation_date"] = FormatDate(sfp.creation_date)
                    objDict["modification_date"] = FormatDate(sfp.modification_date)
                    objDict["status"] = sfp.status
                    objDict["eos_date"] = FormatDate(sfp.eos_date)
                    objDict["eol_date"] = FormatDate(sfp.eol_date)
                    # objDict['rfs_date'] = FormatDate((rfs_date))
                    objDict["serial_number"] = sfp.serial_number
                    objList.append(objDict)

                return jsonify(objList), 200

            except Exception:
                traceback.print_exc()
                return "Error While Fetching Data", 500
        else:
            print("Can not Get Ip Address from URL", file=sys.stderr)
            return "Ip Address Is Missing From URL", 500
    except Exception:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/getAllSfps", methods=["GET"])
@token_required
def GetAllSfps(user_data):
    try:
        results = (
            db.session.query(Sfps_Table, UAM_Device_Table, Atom_Table)
            .join(UAM_Device_Table, Sfps_Table.uam_id == UAM_Device_Table.uam_id)
            .join(Atom_Table, UAM_Device_Table.atom_id == Atom_Table.atom_id)
            .all()
        )

        objList = []
        
        for sfp, uam, atom in results:
            sfpDataDict = {}
            sfpDataDict["sfp_id"] = sfp.sfp_id
            sfpDataDict["device_name"] = atom.device_name
            sfpDataDict["media_type"] = sfp.media_type
            sfpDataDict["port_name"] = sfp.port_name
            sfpDataDict["port_type"] = sfp.port_type
            # sfpDataDict['connector'] = sfpObj.connector
            sfpDataDict["mode"] = sfp.mode
            # sfpDataDict['speed'] = sfpObj.speed
            # sfpDataDict['wavelength'] = sfpObj.wavelength
            # sfpDataDict['manufacturer'] = sfpObj.manufacturer
            # sfpDataDict['optical_direction_type'] = sfpObj.optical_direction_type
            # sfpDataDict['pn_code'] = sfpObj.pn_code
            sfpDataDict["creation_date"] = FormatDate(sfp.creation_date)
            sfpDataDict["modification_date"] = FormatDate(sfp.modification_date)
            sfpDataDict["status"] = sfp.status
            sfpDataDict["eos_date"] = FormatDate(sfp.eos_date)
            sfpDataDict["eol_date"] = FormatDate(sfp.eol_date)
            # sfpDataDict['rfs_date'] = FormatDate((sfpObj.rfs_date))
            sfpDataDict["serial_number"] = sfp.serial_number
            
            objList.append(sfpDataDict)

        return jsonify(objList), 200

    except Exception:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/editSfps", methods=["POST"])
@token_required
def EditSfps(user_data):
    try:
        sfpsObj = request.get_json()
        print(sfpsObj, file=sys.stderr)
        sfps = (
            Sfps_Table.query.with_entities(Sfps_Table)
            .filter_by(sfp_id=sfpsObj["sfp_id"])
            .first()
        )

        sfps.rfs_date = FormatStringDate(sfpsObj["rfs_date"])

        if UpdateDBData(sfps) == 200:
           return "SFP Updated Successfully", 200
        else:
            return "Error While Updating SFP", 500

    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500
