from app.monitoring.device_monitoring.monitoring_utils import *


@app.route("/addMonitoringDevice", methods=["POST"])
@token_required
def addMonitoringDevice(user_data):
    try:
        MonitoringObj = request.get_json()
        
        msg, status = AddMonitoringDevice(MonitoringObj, 0, False)
        
        if 'Row 0 : ' in msg:
            msg = msg[8:]
        
        return msg, status
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/addMonitoringDevices", methods=["POST"])
@token_required
def addMonitoringDevices(user_data):
    try:
        
        successList = []
        errorList = []
        monitoringObjs = request.get_json()
        
        row = 0
        for monitoringObj in monitoringObjs:
            row = row + 1
            msg, status = AddMonitoringDevice(monitoringObj, row, False)
            
            if status == 200:
                successList.append(msg)
            else:
                errorList.append(msg)
        
        responseDict = {
            "success": len(successList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": successList,
        }
        
        return jsonify(responseDict), 200
        
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500    

@app.route("/getAllMonitoringDevices", methods=["GET"])
@token_required
def GetMonitorings(user_data):
    try:
        MonitoringObjList = []
        results = (
            db.session.query(Monitoring_Devices_Table, Atom_Table)
            .join(Atom_Table, Monitoring_Devices_Table.atom_id == Atom_Table.atom_id)
            .all()
        )
        
        for MonitoringObj, atom in results:
            snmp_cred = ""
            MonitoringDataDict = {}
            
            if MonitoringObj.monitoring_credentials_id is not None:
                credentails = Monitoring_Credentails_Table.query.filter_by(monitoring_credentials_id=MonitoringObj.monitoring_credentials_id).first()
            
                if credentails is None:
                    MonitoringObj.monitoring_credentials_id = None
                    UpdateDBData(MonitoringObj)
                else:
                    snmp_cred = credentails.profile_name

            MonitoringDataDict["monitoring_id"] = MonitoringObj.monitoring_device_id
            MonitoringDataDict["ip_address"] = atom.ip_address
            MonitoringDataDict["device_type"] = atom.device_type
            MonitoringDataDict["device_name"] = atom.device_name
            MonitoringDataDict["vendor"] = MonitoringObj.vendor
            MonitoringDataDict["function"] = atom.function
            MonitoringDataDict["source"] = MonitoringObj.source
            MonitoringDataDict["credentials"] = snmp_cred
            MonitoringDataDict["active"] = MonitoringObj.active
            MonitoringDataDict["status"] = MonitoringObj.ping_status
            MonitoringDataDict["snmp_status"] = MonitoringObj.snmp_status
            MonitoringDataDict["creation_date"] = str(MonitoringObj.creation_date)
            MonitoringDataDict["modification_date"] = str(MonitoringObj.modification_date)
            MonitoringObjList.append(MonitoringDataDict)
            
        
        content = gzip.compress(json.dumps(MonitoringObjList).encode("utf8"), 5)
        response = make_response(content)
        response.headers["Content-length"] = len(content)
        response.headers["Content-Encoding"] = "gzip"
        return response

    except Exception as e:
        traceback.print_exc()
        return "Server Error While Fetching Monitoring Devices", 500


@app.route("/getAtomInMonitoring", methods=["GET"])
@token_required
def GetAtomInMonitoring(user_data):
    try:
        MonitoringObjList = []
        atoms = Atom_Table.query.all()
        
        for atom in atoms:
            
            monitoringDevice = Monitoring_Devices_Table.query.filter_by(atom_id=atom.atom_id).first()
            
            if monitoringDevice is None:
                MonitoringObjList.append({
                    "ip_address" : atom.ip_address,
                    "device_name": atom.device_name,
                    "device_type" : atom.device_type
                })
        
        content = gzip.compress(json.dumps(MonitoringObjList).encode("utf8"), 5)
        response = make_response(content)
        response.headers["Content-length"] = len(content)
        response.headers["Content-Encoding"] = "gzip"
        return response
    except Exception as e:
        traceback.print_exc()
        return "Error While Fetching Data From Atom", 500



@app.route("/addAtomInMonitoring", methods=["POST"])
@token_required
def addAtomInMonitoring(user_data):
    try:
        successList = []
        errorList = []
        ipList = request.get_json()
        for ip in ipList:
            atom = Atom_Table.query.filter_by(ip_address=ip).first()
            
            if atom is None:
                errorList.append(f"{ip} : Device Not Found In Atom")
                continue
            
            monitoringDevice = Monitoring_Devices_Table.query.filter_by(atom_id=atom.atom_id).first()
            
            if monitoringDevice is None:
                monitoringDevice = Monitoring_Devices_Table()
                monitoringDevice.atom_id = atom.atom_id
                monitoringDevice.ping_status = "NA"
                monitoringDevice.snmp_status = "NA"
                monitoringDevice.active = "Inactive"
                
                if InsertDBData(monitoringDevice) == 200:
                    successList.append(f"{ip} : Device Added Successfully")
                else:
                    errorList.append(f"{ip} : Error While Inserting Device")
                
            else:
                errorList.append(f"{ip} : Device Already Exist In Monitoring")
        
        responseDict = {
            "success": len(successList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": successList,
        }
        
        return jsonify(responseDict), 200
    
    except Exception as e:
        traceback.print_exc()
        return "Server Error While Adding Atom In Monitoring", 500


@app.route("/deleteDeviceInMonitoring", methods=["POST"])
@token_required
def deleteAtomInMonitoring(user_data):
    if True:
        try:
            from app import client

            org = "monetx"
            bucket = "monitoring"
            delete_api = client.delete_api()
            """
            Delete Data
            """
            date_helper = get_date_helper()
            start = "1970-01-01T00:00:00Z"
            stop = date_helper.to_utc(datetime.now())
            MonitoringObj = request.get_json()
            print(
                "#####printing data returned by delete api",
                MonitoringObj,
                file=sys.stderr,
            )
            for mid in MonitoringObj:
                queryString = (
                    f"DELETE FROM monitoring_devices_table WHERE IP_ADDRESS='{mid}';"
                )
                db.session.execute(queryString)
                db.session.commit()
                predicatereq1 = f'_measurement="Devices" AND IP_ADDRESS ="{mid}"'
                predicatereq2 = f'_measurement="Interfaces" AND IP_ADDRESS ="{mid}"'
                delete_api.delete(
                    start,
                    stop,
                    bucket=f"{bucket}",
                    org=f"{org}",
                    predicate=predicatereq1,
                )
                delete_api.delete(
                    start,
                    stop,
                    bucket=f"{bucket}",
                    org=f"{org}",
                    predicate=predicatereq2,
                )
            return "Response deleted", 200
        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500


@app.route("/getAllDevicesInNetwork", methods=["GET"])  # yes
def GetAllDevicesInNetwork():
    final_list = []
    if True:
        try:
            from app import client

            org = "monetx"
            final = None
            query_api = client.query_api()
            query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "monitoring")\
            |> range(start:-60d)\
            |> filter(fn: (r) => r["_measurement"] == "Devices")\
            |> filter(fn: (r) => r["FUNCTION"] != "VM")\
            |> last()\
            |> schema.fieldsAsCols()'

            result = query_api.query(org="monetx", query=query)
            results = []

            try:
                for table in result:
                    for record in table.records:
                        objDict = {}
                        try:
                            if record["IP_ADDRESS"]:
                                objDict["ip_address"] = record["IP_ADDRESS"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["IP_ADDRESS"]:
                                objDict["ip_address"] = record["IP_ADDRESS"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["FUNCTION"]:
                                objDict["function"] = record["FUNCTION"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["Response"]:
                                objDict["response"] = record["Response"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["STATUS"]:
                                objDict["status"] = record["STATUS"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass

                        try:
                            if record["Uptime"]:
                                objDict["uptime"] = record["Uptime"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass

                        try:
                            if record["VENDOR"]:
                                objDict["vendor"] = record["VENDOR"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["CPU"]:
                                objDict["cpu"] = record["CPU"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["Memory"]:
                                objDict["memory"] = record["Memory"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["PACKETS_LOSS"]:
                                objDict["packets"] = record["PACKETS_LOSS"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["DEVICE_NAME"]:
                                objDict["device_name"] = record["DEVICE_NAME"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["INTERFACES"]:
                                objDict["interfaces"] = record["INTERFACES"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["Date"]:
                                objDict["date"] = record["Date"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["DEVICE_DESCRIPTION"]:
                                objDict["device_description"] = record[
                                    "DEVICE_DESCRIPTION"
                                ]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["DISCOVERED_TIME"]:
                                objDict["discovered_time"] = record["DISCOVERED_TIME"]

                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))
                        try:
                            if record["DEVICE_TYPE"]:
                                objDict["device_type"] = record["DEVICE_TYPE"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass

                        results.append(objDict)

                    final = sorted(results, key=lambda k: k["date"], reverse=False)
                if final != None:
                    final_list = list({v["ip_address"]: v for v in final}.values())
                    print("printing final list", final_list, file=sys.stderr)
                # for v in final:
                #     for i in v.items():
                #         print(i,file=sys.stderr)
                # for i in results:
                #     for key,value in i.item():

                return jsonify(final_list), 200
            except Exception as e:
                print("Error", str(e), file=sys.stderr)
                traceback.print_exc()
                return "Error ", 500
        #     print(objList,file=sys.stderr)
        #     return jsonify(objList),200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllInterfacesInNetwork", methods=["GET"])  # yes
def GetAllInterfacesInNetwork():
    if True:
        from app import client

        org = "monetx"
        query_api = client.query_api()
        query = f'import "strings"\
        import "influxdata/influxdb/schema"\
        from(bucket: "monitoring")\
        |> range(start: -60d)\
        |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
        |> filter(fn: (r) => r["FUNCTION"] != "VM")\
        |> schema.fieldsAsCols()\
        |> sort(columns: ["_time"], desc: true)\
        |> unique(column: "Interface_Name")\
        |> yield(name: "unique")'
        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    print(record, file=sys.stderr)
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Status"]:
                            objDict["interface_status"] = record["Status"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Download"] == None or record["Download"] == "":
                            objDict["download_speed"] = 0
                        else:
                            objDict["download_speed"] = round(
                                float(record["Download"]), 2
                            )
                    except Exception as e:
                        objDict["download_speed"] = 0
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Upload"] == None or record["Upload"] == "":
                            objDict["upload_speed"] = 0
                        else:
                            objDict["upload_speed"] = round(float(record["Upload"]), 2)
                    except Exception as e:
                        objDict["upload_speed"] = 0
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if (
                            record["Interface_Name"] == None
                            or record["Interface_Name"] == ""
                        ):
                            continue
                        else:
                            objDict["interface_name"] = record["Interface_Name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        continue
                    try:
                        if record["Interface_Des"]:
                            objDict["interface_description"] = record["Interface_Des"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    results.append(objDict)

            final_interfaces = list(
                {
                    dictionary["interface_name"]: dictionary for dictionary in results
                }.values()
            )

            print(results, file=sys.stderr)
            return jsonify(final_interfaces)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllDevicesInRouters", methods=["GET"])  # yes
@token_required
def getAllDevicesInRouters(user_data):
    if True:
        # try:
        #     objList = []
        #     deviceObjs = MONITORING_ROUTERS_DEVICES_TABLE.query.all()
        #     for deviceObj in deviceObjs:
        #         objDict = {}
        #         objDict['device_id'] = deviceObj.device_id
        #         objDict['device_name'] = deviceObj.device_name
        #         objDict['status'] = deviceObj.status
        #         objDict['ip_address'] = deviceObj.ip_address
        #         objDict['device_type'] = deviceObj.device_type
        #         objDict['function'] = deviceObj.function
        #         objDict['vendor'] = deviceObj.vendor
        #         objDict['interfaces'] = deviceObj.interfaces
        #         objDict['discovered_time'] = str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((deviceObj.discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))
        #         objDict['date'] = deviceObj.date
        #         objDict['device_description'] = deviceObj.device_description
        #         objList.append(objDict)
        #     print(objList,file=sys.stderr)
        #     return jsonify(objList),200
        # except Exception as e:
        #     print(str(e),file=sys.stderr)
        #     traceback.print_exc()
        #     return "Something Went Wrong!", 500
        from app import client

        # token = "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A=="
        org = "monetx"
        # bucket = "monitoring"

        # client = DataFrameClient(host='localhost',port=8086, username='root',password='As123456?', database='monitoring')
        # client.switch_database('monitoring')
        # result = client.query("select * from Devices")

        # 2
        # Query script
        # from app import client

        query_api = client.query_api()
        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "monitoring")\
            |> range(start: -60d)\
            |> filter(fn: (r) => r["_measurement"] == "Devices")\
            |> filter(fn: (r) => r["FUNCTION"] == "Router")\
            |> last()\
            |> schema.fieldsAsCols()'

        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    print("printing record:", record, file=sys.stderr)
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Response"]:
                            objDict["response"] = record["Response"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["STATUS"]:
                            objDict["status"] = record["STATUS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["Uptime"]:
                            objDict["uptime"] = record["Uptime"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["CPU"]:
                            objDict["cpu"] = record["CPU"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Memory"]:
                            objDict["memory"] = record["Memory"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["PACKETS_LOSS"]:
                            objDict["packets"] = record["PACKETS_LOSS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["INTERFACES"]:
                            objDict["interfaces"] = record["INTERFACES"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_DESCRIPTION"]:
                            objDict["device_description"] = record["DEVICE_DESCRIPTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DISCOVERED_TIME"]:
                            objDict["discovered_time"] = record["DISCOVERED_TIME"]

                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    results.append(objDict)
            final = sorted(results, key=lambda k: k["date"], reverse=False)

            final_list = list({v["ip_address"]: v for v in final}.values())
            print(results, file=sys.stderr)
            return jsonify(final_list)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllInterfacesInRouters", methods=["GET"])  # yes
@token_required
def GetAllInterfacesInRouters(user_data):
    if True:
        # try:
        #     objList = []
        #     interfaceObjs = MONITORING_ROUTERS_INTERFACES_TABLE().query.all()
        #     for interfaceObj in interfaceObjs:
        #         objDict = {}
        #         objDict['interface_name'] = interfaceObj.interface_name
        #         objDict['upload_speed'] = interfaceObj.upload_speed
        #         objDict['download_speed'] = interfaceObj.download_speed
        #         objDict['date'] = interfaceObj.date
        #         objDict['ip_address'] = interfaceObj.ip_address
        #         objDict['interface_status'] = interfaceObj.interface_status
        #         objDict['interface_description'] = interfaceObj.interface_description
        #         objList.append(objDict)
        #     print(objList,file=sys.stderr)
        #     return jsonify(objList),200
        # except Exception as e:
        #     print(str(e),file=sys.stderr)
        #     traceback.print_exc()
        #     return "Something Went Wrong!", 500
        from app import client

        # token = "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A=="
        org = "monetx"
        # bucket = "monitoring"

        # client = DataFrameClient(host='localhost',port=8086, username='root',password='As123456?', database='monitoring')
        # client.switch_database('monitoring')
        # result = client.query("select * from Devices")

        # 2
        # Query script
        # from app import client

        query_api = client.query_api()
        query = f'import "strings"\
        import "influxdata/influxdb/schema"\
        from(bucket: "monitoring")\
        |> range(start: -60d)\
        |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
        |> filter(fn: (r) => r["FUNCTION"] == "Router")\
        |> schema.fieldsAsCols()\
        |> sort(columns: ["_time"], desc: true)\
        |> unique(column: "Interface_Name")\
        |> yield(name: "unique")'
        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Status"]:
                            objDict["interface_status"] = record["Status"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if (
                            record["Interface_Name"] == None
                            or record["Interface_Name"] == ""
                        ):
                            continue
                        else:
                            objDict["interface_name"] = record["Interface_Name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        continue
                    try:
                        if record["Interface_Des"]:
                            objDict["interface_description"] = record["Interface_Des"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Download"]:
                            objDict["download_speed"] = record["Download"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Upload"]:
                            objDict["upload_speed"] = record["Upload"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    results.append(objDict)
            final_interfaces = list(
                {
                    dictionary["interface_name"]: dictionary for dictionary in results
                }.values()
            )

            print(final_interfaces, file=sys.stderr)
            return jsonify(final_interfaces)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllDevicesInSwitches", methods=["GET"])  # yes
@token_required
def GetAllDevicesInSwitches(user_data):
    if True:
        from app import client

        org = "monetx"

        query_api = client.query_api()
        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "monitoring")\
            |> range(start: -60d)\
            |> filter(fn: (r) => r["_measurement"] == "Devices")\
            |> filter(fn: (r) => r["FUNCTION"] == "Switch")\
            |> last()\
            |> schema.fieldsAsCols()'

        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Response"]:
                            objDict["response"] = record["Response"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["STATUS"]:
                            objDict["status"] = record["STATUS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["Uptime"]:
                            objDict["uptime"] = record["Uptime"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["CPU"]:
                            objDict["cpu"] = record["CPU"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Memory"]:
                            objDict["memory"] = record["Memory"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["PACKETS_LOSS"]:
                            objDict["packets"] = record["PACKETS_LOSS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["INTERFACES"]:
                            objDict["interfaces"] = record["INTERFACES"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_DESCRIPTION"]:
                            objDict["device_description"] = record["DEVICE_DESCRIPTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DISCOVERED_TIME"]:
                            objDict["discovered_time"] = record["DISCOVERED_TIME"]

                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    results.append(objDict)
            final = sorted(results, key=lambda k: k["date"], reverse=False)

            final_list = list({v["ip_address"]: v for v in final}.values())
            print(results, file=sys.stderr)

            return jsonify(final_list)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllInterfacesInSwitches", methods=["GET"])  # yes
@token_required
def GetAllInterfacesInSwitches(user_data):
    if True:
        from app import client

        org = "monetx"

        query_api = client.query_api()
        query = f'import "strings"\
        import "influxdata/influxdb/schema"\
        from(bucket: "monitoring")\
        |> range(start: -60d)\
        |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
        |> filter(fn: (r) => r["FUNCTION"] == "Switch")\
        |> schema.fieldsAsCols()\
        |> sort(columns: ["_time"], desc: true)\
        |> unique(column: "Interface_Name")\
        |> yield(name: "unique")'

        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Status"]:
                            objDict["interface_status"] = record["Status"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if (
                            record["Interface_Name"] == None
                            or record["Interface_Name"] == ""
                        ):
                            continue
                        else:
                            objDict["interface_name"] = record["Interface_Name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        continue
                    try:
                        if record["Interface_Des"]:
                            objDict["interface_description"] = record["Interface_Des"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Download"]:
                            objDict["download_speed"] = record["Download"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Upload"]:
                            objDict["upload_speed"] = record["Upload"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    results.append(objDict)
            final_interfaces = list(
                {
                    dictionary["interface_name"]: dictionary for dictionary in results
                }.values()
            )

            print(final_interfaces, file=sys.stderr)
            return jsonify(final_interfaces)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllDevicesInFirewalls", methods=["GET"])  # yes
@token_required
def GetAllDevicesInFirewalls(user_data):
    if True:
        from app import client

        org = "monetx"

        query_api = client.query_api()
        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "monitoring")\
            |> range(start: -60d)\
            |> filter(fn: (r) => r["_measurement"] == "Devices")\
            |> filter(fn: (r) => r["FUNCTION"] == "Firewall")\
            |> last()\
            |> schema.fieldsAsCols()'
        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Response"]:
                            objDict["response"] = record["Response"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["STATUS"]:
                            objDict["status"] = record["STATUS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["Uptime"]:
                            objDict["uptime"] = record["Uptime"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["CPU"]:
                            objDict["cpu"] = record["CPU"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Memory"]:
                            objDict["memory"] = record["Memory"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["PACKETS_LOSS"]:
                            objDict["packets"] = record["PACKETS_LOSS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["INTERFACES"]:
                            objDict["interfaces"] = record["INTERFACES"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_DESCRIPTION"]:
                            objDict["device_description"] = record["DEVICE_DESCRIPTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DISCOVERED_TIME"]:
                            objDict["discovered_time"] = record["DISCOVERED_TIME"]

                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    results.append(objDict)
            final = sorted(results, key=lambda k: k["date"], reverse=False)

            final_list = list({v["ip_address"]: v for v in final}.values())
            print(results, file=sys.stderr)
            return jsonify(final_list)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllInterfacesInFirewalls", methods=["GET"])  # yes
@token_required
def GetAllInterfacesInFirewalls(user_data):
    if True:
        from app import client

        org = "monetx"

        query_api = client.query_api()
        query = f'import "strings"\
        import "influxdata/influxdb/schema"\
        from(bucket: "monitoring")\
        |> range(start: -60d)\
        |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
        |> filter(fn: (r) => r["FUNCTION"] == "Firewall")\
        |> schema.fieldsAsCols()\
        |> sort(columns: ["_time"], desc: true)\
        |> unique(column: "Interface_Name")\
        |> yield(name: "unique")'

        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    print("printing record:", record, file=sys.stderr)
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Status"]:
                            objDict["interface_status"] = record["Status"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if (
                            record["Interface_Name"] == None
                            or record["Interface_Name"] == ""
                        ):
                            continue
                        else:
                            objDict["interface_name"] = record["Interface_Name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        continue
                    try:
                        if record["Interface_Des"]:
                            objDict["interface_description"] = record["Interface_Des"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Download"]:
                            objDict["download_speed"] = record["Download"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Upload"]:
                            objDict["upload_speed"] = record["Upload"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    results.append(objDict)
            final_interfaces = list(
                {
                    dictionary["interface_name"]: dictionary for dictionary in results
                }.values()
            )

            print(final_interfaces, file=sys.stderr)
            return jsonify(final_interfaces)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllDevicesInWireless", methods=["GET"])  # yes
@token_required
def GetAllDevicesInWireless(user_data):
    if True:
        from app import client

        org = "monetx"

        query_api = client.query_api()
        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "monitoring")\
            |> range(start: -60d)\
            |> filter(fn: (r) => r["_measurement"] == "Devices")\
            |> filter(fn: (r) => r["FUNCTION"] == "Wireless")\
            |> last()\
            |> schema.fieldsAsCols()'

        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Response"]:
                            objDict["response"] = record["Response"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["STATUS"]:
                            objDict["status"] = record["STATUS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["Uptime"]:
                            objDict["uptime"] = record["Uptime"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["CPU"]:
                            objDict["cpu"] = record["CPU"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Memory"]:
                            objDict["memory"] = record["Memory"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["PACKETS_LOSS"]:
                            objDict["packets"] = record["PACKETS_LOSS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["INTERFACES"]:
                            objDict["interfaces"] = record["INTERFACES"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_DESCRIPTION"]:
                            objDict["device_description"] = record["DEVICE_DESCRIPTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DISCOVERED_TIME"]:
                            objDict["discovered_time"] = record["DISCOVERED_TIME"]

                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    results.append(objDict)

                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))
            final = sorted(results, key=lambda k: k["date"], reverse=False)

            final_list = list({v["ip_address"]: v for v in final}.values())
            print(results, file=sys.stderr)
            return jsonify(final_list)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllInterfacesInWireless", methods=["GET"])  # yes
@token_required
def GetAllInterfacesInWireless(user_data):
    if True:
        from app import client

        org = "monetx"
        query_api = client.query_api()
        query = f'import "strings"\
        import "influxdata/influxdb/schema"\
        from(bucket: "monitoring")\
        |> range(start: -60d)\
        |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
        |> filter(fn: (r) => r["FUNCTION"] == "Wireless")\
        |> schema.fieldsAsCols()\
        |> sort(columns: ["_time"], desc: true)\
        |> unique(column: "Interface_Name")\
        |> yield(name: "unique")'

        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Status"]:
                            objDict["interface_status"] = record["Status"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if (
                            record["Interface_Name"] == None
                            or record["Interface_Name"] == ""
                        ):
                            continue
                        else:
                            objDict["interface_name"] = record["Interface_Name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        continue
                    try:
                        if record["Interface_Des"]:
                            objDict["interface_description"] = record["Interface_Des"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Download"]:
                            objDict["download_speed"] = record["Download"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Upload"]:
                            objDict["upload_speed"] = record["Upload"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    results.append(objDict)
            final_interfaces = list(
                {
                    dictionary["interface_name"]: dictionary for dictionary in results
                }.values()
            )

            print(final_interfaces, file=sys.stderr)
            return jsonify(final_interfaces)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/addMonitoringCredentials", methods=["POST"])
@token_required
def AddMonitoringCredentials(user_data):
    if True:
        try:
            credentialObj = request.get_json()

            print(credentialObj, file=sys.stderr)

            credential = MONITORING_CREDENTIALS_TABLE()
            if "credentials" in credentialObj:
                credential.credentials = credentialObj["credentials"]
            if "category" in credentialObj:
                credential.category = credentialObj["category"]
            if "profile_name" in credentialObj:
                credential.profile_name = credentialObj["profile_name"]
            if "description" in credentialObj:
                credential.description = credentialObj["description"]
            if "ip_address" in credentialObj:
                credential.ip_address = credentialObj["ip_address"]
            if "community" in credentialObj:
                credential.snmp_read_community = credentialObj["community"]
            if "port" in credentialObj:
                credential.snmp_port = credentialObj["port"]
            if "username" in credentialObj:
                credential.username = credentialObj["username"]

            if "authentication_password" in credentialObj:
                credential.password = credentialObj["authentication_password"]
            if "password" in credentialObj:
                credential.password = credentialObj["password"]
            if "encryption_password" in credentialObj:
                credential.encryption_password = credentialObj["encryption_password"]

            if "authentication_protocol" in credentialObj:
                credential.authentication_method = credentialObj[
                    "authentication_protocol"
                ]

            if "encryption_protocol" in credentialObj:
                credential.encryption_method = credentialObj["encryption_protocol"]

            credential.date = datetime.now()
            if (
                MONITORING_CREDENTIALS_TABLE.query.with_entities(
                    MONITORING_CREDENTIALS_TABLE.profile_name
                )
                .filter_by(profile_name=credentialObj["profile_name"])
                .first()
                is not None
            ):
                credential.credentials_id = (
                    MONITORING_CREDENTIALS_TABLE.query.with_entities(
                        MONITORING_CREDENTIALS_TABLE.credentials_id
                    )
                    .filter_by(profile_name=credentialObj["profile_name"])
                    .first()[0]
                )
                return "Duplicate Entry", 500
            else:
                InsertData(credential)
                print(
                    f"Inserted {credential.credentials_id} Credentials Successfully",
                    file=sys.stderr,
                )
                return "Credentials Successfully Added", 200

        except Exception as e:
            print(f"in exception block Successfully", file=sys.stderr)
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return "Something Went Wrong!", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllDevicesInServers", methods=["GET"])  # yes
# @token_required
def GetAllDevicesInServers():
    if True:
        from app import client

        org = "monetx"

        query_api = client.query_api()

        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "monitoring")\
            |> range(start: -60d)\
            |> filter(fn: (r) => r["_measurement"] == "Devices")\
            |> filter(fn: (r) => r["FUNCTION"] == "VM")\
            |> last()\
            |> schema.fieldsAsCols()'
        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Response"]:
                            objDict["response"] = record["Response"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["STATUS"]:
                            objDict["status"] = record["STATUS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["Uptime"]:
                            objDict["uptime"] = record["Uptime"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["CPU"]:
                            objDict["cpu"] = record["CPU"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Memory"]:
                            objDict["memory"] = record["Memory"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["PACKETS_LOSS"]:
                            objDict["packets"] = record["PACKETS_LOSS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["INTERFACES"]:
                            objDict["interfaces"] = record["INTERFACES"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_DESCRIPTION"]:
                            objDict["device_description"] = record["DEVICE_DESCRIPTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DISCOVERED_TIME"]:
                            objDict["discovered_time"] = record["DISCOVERED_TIME"]

                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    results.append(objDict)
            # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))
            final = sorted(results, key=lambda k: k["date"], reverse=False)

            final_list = list({v["ip_address"]: v for v in final}.values())
            print(results, file=sys.stderr)
            return jsonify(final_list)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllInterfacesInServers", methods=["GET"])  # yes
@token_required
def GetAllInterfacesInServers(user_data):
    if True:
        from app import client

        org = "monetx"

        query_api = client.query_api()
        query = f'import "strings"\
        import "influxdata/influxdb/schema"\
        from(bucket: "monitoring")\
        |> range(start: -60d)\
        |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
        |> filter(fn: (r) => r["FUNCTION"] == "VM")\
        |> schema.fieldsAsCols()\
        |> sort(columns: ["_time"], desc: true)\
        |> unique(column: "Interface_Name")\
        |> yield(name: "unique")'
        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Status"]:
                            objDict["interface_status"] = record["Status"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if (
                            record["Interface_Name"] == None
                            or record["Interface_Name"] == ""
                        ):
                            continue
                        else:
                            objDict["interface_name"] = record["Interface_Name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        continue
                    try:
                        if record["Interface_Des"]:
                            objDict["interface_description"] = record["Interface_Des"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Download"]:
                            objDict["download_speed"] = record["Download"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Upload"]:
                            objDict["upload_speed"] = record["Upload"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    results.append(objDict)
            final_interfaces = list(
                {
                    dictionary["interface_name"]: dictionary for dictionary in results
                }.values()
            )

            print(final_interfaces, file=sys.stderr)
            return jsonify(final_interfaces)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllDevicesInWindows", methods=["GET"])  # yes
@token_required
def GetAllDevicesInWindows(user_data):
    if True:
        from app import client

        org = "monetx"

        query_api = client.query_api()
        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "monitoring")\
            |> range(start: -60d)\
            |> filter(fn: (r) => r["_measurement"] == "Devices")\
            |> filter(fn: (r) => r["FUNCTION"] == "VM")\
            |> filter(fn: (r) => r["DEVICE_TYPE"] == "Window")\
            |> last()\
            |> schema.fieldsAsCols()'

        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Response"]:
                            objDict["response"] = record["Response"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["STATUS"]:
                            objDict["status"] = record["STATUS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["Uptime"]:
                            objDict["uptime"] = record["Uptime"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["CPU"]:
                            objDict["cpu"] = record["CPU"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Memory"]:
                            objDict["memory"] = record["Memory"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["PACKETS_LOSS"]:
                            objDict["packets"] = record["PACKETS_LOSS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["INTERFACES"]:
                            objDict["interfaces"] = record["INTERFACES"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_DESCRIPTION"]:
                            objDict["device_description"] = record["DEVICE_DESCRIPTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DISCOVERED_TIME"]:
                            objDict["discovered_time"] = record["DISCOVERED_TIME"]

                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    results.append(objDict)
            final = sorted(results, key=lambda k: k["date"], reverse=False)

            final_list = list({v["ip_address"]: v for v in final}.values())
            print(final_list, file=sys.stderr)
            return jsonify(final_list)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllInterfacesInWindows", methods=["GET"])  # yes
@token_required
def GetAllInterfacesInWindows(user_data):
    if True:
        from app import client

        org = "monetx"
        query_api = client.query_api()
        query = f'import "strings"\
        import "influxdata/influxdb/schema"\
        from(bucket: "monitoring")\
        |> range(start: -60d)\
        |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
        |> filter(fn: (r) => r["FUNCTION"] == "VM")\
        |> filter(fn: (r) => r["DEVICE_TYPE"] == "Window")\
        |> schema.fieldsAsCols()\
        |> sort(columns: ["_time"], desc: true)\
        |> unique(column: "Interface_Name")\
        |> yield(name: "unique")'

        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Status"]:
                            objDict["interface_status"] = record["Status"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if (
                            record["Interface_Name"] == None
                            or record["Interface_Name"] == ""
                        ):
                            continue
                        else:
                            objDict["interface_name"] = record["Interface_Name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        continue
                    try:
                        if record["Interface_Des"]:
                            objDict["interface_description"] = record["Interface_Des"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Download"]:
                            objDict["download_speed"] = record["Download"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Upload"]:
                            objDict["upload_speed"] = record["Upload"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    results.append(objDict)
            final_interfaces = list(
                {
                    dictionary["interface_name"]: dictionary for dictionary in results
                }.values()
            )

            print(final_interfaces, file=sys.stderr)
            return jsonify(final_interfaces)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllDevicesInLinux", methods=["GET"])  # yes
@token_required
def GetAllDevicesInLinux(user_data):
    if True:
        from app import client

        org = "monetx"

        query_api = client.query_api()

        query = f'import "strings"\
            import "influxdata/influxdb/schema"\
            from(bucket: "monitoring")\
            |> range(start: -60d)\
            |> filter(fn: (r) => r["_measurement"] == "Devices")\
            |> filter(fn: (r) => r["FUNCTION"] == "VM")\
            |> filter(fn: (r) => r["DEVICE_TYPE"] == "Linux")\
            |> last()\
            |> schema.fieldsAsCols()'
        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Response"]:
                            objDict["response"] = record["Response"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["STATUS"]:
                            objDict["status"] = record["STATUS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["Uptime"]:
                            objDict["uptime"] = record["Uptime"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["CPU"]:
                            objDict["cpu"] = record["CPU"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Memory"]:
                            objDict["memory"] = record["Memory"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["PACKETS_LOSS"]:
                            objDict["packets"] = record["PACKETS_LOSS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["INTERFACES"]:
                            objDict["interfaces"] = record["INTERFACES"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_DESCRIPTION"]:
                            objDict["device_description"] = record["DEVICE_DESCRIPTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DISCOVERED_TIME"]:
                            objDict["discovered_time"] = record["DISCOVERED_TIME"]

                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    results.append(objDict)

                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

            final = sorted(results, key=lambda k: k["date"], reverse=False)

            final_list = list({v["ip_address"]: v for v in final}.values())
            print(final_list, file=sys.stderr)
            return jsonify(final_list)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500

    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getAllInterfacesInLinux", methods=["GET"])  # yes
@token_required
def GetAllInterfacesInLinux(user_data):
    if True:
        from app import client

        org = "monetx"
        query_api = client.query_api()
        query = f'import "strings"\
        import "influxdata/influxdb/schema"\
        from(bucket: "monitoring")\
        |> range(start: -60d)\
        |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
        |> filter(fn: (r) => r["FUNCTION"] == "VM")\
        |> filter(fn: (r) => r["DEVICE_TYPE"] == "Linux")\
        |> schema.fieldsAsCols()\
        |> sort(columns: ["_time"], desc: true)\
        |> unique(column: "Interface_Name")\
        |> yield(name: "unique")'

        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Status"]:
                            objDict["interface_status"] = record["Status"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if (
                            record["Interface_Name"] == None
                            or record["Interface_Name"] == ""
                        ):
                            continue
                        else:
                            objDict["interface_name"] = record["Interface_Name"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        continue
                    try:
                        if record["Interface_Des"]:
                            objDict["interface_description"] = record["Interface_Des"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Download"]:
                            objDict["download_speed"] = record["Download"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Upload"]:
                            objDict["upload_speed"] = record["Upload"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_TYPE"]:
                            objDict["device_type"] = record["DEVICE_TYPE"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    results.append(objDict)
            final_interfaces = list(
                {
                    dictionary["interface_name"]: dictionary for dictionary in results
                }.values()
            )

            print(results, file=sys.stderr)
            return jsonify(final_interfaces)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getDevCredentials", methods=["GET"])
@token_required
def getDevCredentials(user_data):
    if True:
        try:
            queryString = "select PROFILE_NAME from monitoring_credentials_table;"
            results = db.session.execute(queryString)
            final = []
            for result in results:
                final.append(result[0])
            return jsonify(final), 200
        except Exception as e:
            return "Error in getting credentials: ", 500


# @app.route("/getpoll", methods=["GET"])
# def getpoll():
#     """33 | 192.168.30.167 | Juniper     | SNMP_V1_V2 | JuniperUser1 | Static | Juniper   | Firewall | InActive | Up     | NULL      | 2022-10-24 14:31:17 |
#     |            34 | 192.168.30.168 | Palo        | SNMP_V1_V2 | JuniperUser1 | Static | Palo Alto | Firewall | InActive | Up     | NULL      | 2022-10-24 14:31:17 |
#     |            35 | 192.168.30.151 | Cisco_IOS   | SNMP_V1_V2 | WlcUser1     | Static | Cisco     | Switch   | InActive | Up     | NULL      | 2022-10-24 14:31:17 |
#     |            36 | 192.168.30.152 | Cisco_IOS   | SNMP_V1_V2 | WlcUser1     | Static | Cisco     | Switch   | InActive | Up     | NULL      | 2022-10-24 14:31:17 |
#     |            37 | 192.168.30.186 | Cisco_IOS   | SNMP_V1_V2 | WlcUser1     | Static | Cisco     | Switch   | InActive | Up     | NULL      | 2022-10-24 14:31:17 |
#     |            38 | 192.168.0.2    | Fortinet    | SNMP_V1_V2 | JuniperUser1 | Static | Fortinet  | Firewall | InActive | Up     | NULL      | 2022-10-24 14:31:17 |
#     |            50 | 192.168.10.220 | Window      | SNMP_V1_V2 | JuniperUser1 | Static | Microsoft | Server   | InActive | Up     | NULL      | 2022-10-24 15:07:27 |
#     |            51 | 192.168.10.224 | Window      | SNMP_V1_V2 | JuniperUser1 | Static | Microsoft | Server   | InActive | Up     | NULL      | 2022-10-24 15:07:27 |
#     |            53 | 192.168.0.230  | Cisco_WLC   | SNMP_V1_V2 | WlcUser1     | Static | Cisco     | Wireless | InActive | Up     | NULL      | 2022-10-25 08:32:44 |
#     """

#     host = (
#         "6",
#         "91.147.126.26",
#         "Cisco_IOS",
#         "SNMP_V1_V2",
#         "WlcUser1",
#         "Static",
#         "Cisco",
#         "Switch",
#     )
#     obj = IOSPuller()
#     obj.poll(host)
#     return "started"


@app.route("/getCpuDashboard", methods=["GET"])
# @token_required
def cpu_stats_fetching():
    from app import client

    org = "monetx"
    query_api = client.query_api()
    query = f'import "strings"\
    import "influxdata/influxdb/schema"\
    from(bucket: "monitoring")\
     |> range(start:-1d)\
     |> filter(fn: (r) => r["_measurement"] == "Devices")\
     |> last()\
     |> schema.fieldsAsCols()'

    result = query_api.query(org="monetx", query=query)
    results = []

    try:
        for table in result:
            for record in table.records:
                objDict = {}
                try:
                    if record["CPU"]:
                        try:
                            if record["IP_ADDRESS"]:
                                objDict["ip_address"] = record["IP_ADDRESS"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["FUNCTION"]:
                                objDict["function"] = record["FUNCTION"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["Response"]:
                                objDict["response"] = record["Response"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["STATUS"]:
                                objDict["status"] = record["STATUS"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass

                        try:
                            if record["Uptime"]:
                                objDict["uptime"] = record["Uptime"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass

                        try:
                            if record["VENDOR"]:
                                objDict["vendor"] = record["VENDOR"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["CPU"]:
                                objDict["cpu"] = float(record["CPU"])
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            objDict["cpu"] = float(0)
                        try:
                            if record["Memory"]:
                                objDict["memory"] = float(record["Memory"])
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            objDict["memory"] = float(0)
                        try:
                            if record["PACKETS_LOSS"]:
                                objDict["packets"] = record["PACKETS_LOSS"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["DEVICE_NAME"]:
                                objDict["device_name"] = record["DEVICE_NAME"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["INTERFACES"]:
                                objDict["interfaces"] = record["INTERFACES"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["Date"]:
                                objDict["date"] = record["Date"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["DEVICE_DESCRIPTION"]:
                                objDict["device_description"] = record[
                                    "DEVICE_DESCRIPTION"
                                ]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["DISCOVERED_TIME"]:
                                objDict["discovered_time"] = record["DISCOVERED_TIME"]

                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                        results.append(objDict)
                    else:
                        pass
                except:
                    pass
        final_list = []
        cpulist = sorted(results, key=lambda k: k["cpu"], reverse=True)
        ip_list = []
        i = 0
        for dct in cpulist:
            if dct["ip_address"] in ip_list:
                pass
            else:
                final_list.append(dct)
                ip_list.append(dct["ip_address"])
        last_list = [x for x in final_list if not (x.get("cpu") < 0.1)]
        if len(last_list) > 4:
            return jsonify(last_list[0:4])
        else:
            return jsonify(last_list)
    except Exception as e:
        print("Error", str(e), file=sys.stderr)
        traceback.print_exc()
        return "Error ", 500


@app.route("/getMemoryDashboard", methods=["GET"])
# @token_required
def memory_stats_fetching():
    try:
        from app import client

        org = "monetx"
        query_api = client.query_api()
        query = 'import "strings"\
        import "influxdata/influxdb/schema"\
        from(bucket: "monitoring")\
            |> range(start:-1d)\
            |> filter(fn: (r) => r["_measurement"] == "Devices")\
            |> last()\
            |> schema.fieldsAsCols()'

        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    try:
                        if record["IP_ADDRESS"]:
                            objDict["ip_address"] = record["IP_ADDRESS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["FUNCTION"]:
                            objDict["function"] = record["FUNCTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Response"]:
                            objDict["response"] = record["Response"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["STATUS"]:
                            objDict["status"] = record["STATUS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["Uptime"]:
                            objDict["uptime"] = record["Uptime"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass

                    try:
                        if record["VENDOR"]:
                            objDict["vendor"] = record["VENDOR"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["CPU"]:
                            objDict["cpu"] = float(record["CPU"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict["cpu"] = float(0)
                    try:
                        if record["Memory"]:
                            objDict["memory"] = float(record["Memory"])
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        objDict["memory"] = float(0)
                    try:
                        if record["PACKETS_LOSS"]:
                            objDict["packets"] = record["PACKETS_LOSS"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_NAME"]:
                            objDict["device_name"] = record["DEVICE_NAME"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["INTERFACES"]:
                            objDict["interfaces"] = record["INTERFACES"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["Date"]:
                            objDict["date"] = record["Date"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DEVICE_DESCRIPTION"]:
                            objDict["device_description"] = record["DEVICE_DESCRIPTION"]
                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    try:
                        if record["DISCOVERED_TIME"]:
                            objDict["discovered_time"] = record["DISCOVERED_TIME"]

                    except Exception as e:
                        print("error", str(e), file=sys.stderr)
                        pass
                    # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                    results.append(objDict)
                    print(result, file=sys.stderr)

            memorylist = sorted(results, key=lambda k: k.get("memory", 0), reverse=True)
            final_list = []
            ip_list = []
            i = 0
            for dct in memorylist:
                if dct["ip_address"] in ip_list:
                    pass
                else:
                    final_list.append(dct)
                    ip_list.append(dct["ip_address"])
            last_list = [
                x
                for x in final_list
                if x.get("memory") is not None and (x.get("memory") >= 0.1)
            ]

            # memorylist = sorted(results, key=lambda k: k['memory'], reverse=True)
            # final_list = []
            # ip_list = []
            # i = 0
            # for dct in memorylist:
            #     if dct['ip_address'] in ip_list:
            #         pass
            #     else:
            #         final_list.append(dct)
            #         ip_list.append(dct['ip_address'])
            # last_list = [x for x in final_list if not (x.get('memory') < 0.1)]

            if len(last_list) > 4:
                return jsonify(last_list[0:4])
            else:
                return jsonify(last_list)
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500
    except Exception as e:
        print("Error", str(e), file=sys.stderr)
        traceback.print_exc()
        return "Error ", 500


@app.route("/getTopInterfaces", methods=["GET"])  # yes
# @token_required
def GetTopInterfaces():
    if True:
        from app import client

        org = "monetx"
        query_api = client.query_api()
        query = f'import "strings"\
        import "influxdata/influxdb/schema"\
        from(bucket: "monitoring")\
        |> range(start: -1d)\
        |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
        |> schema.fieldsAsCols()\
        |> sort(columns: ["_time"], desc: true)\
        |> unique(column: "Interface_Name")\
        |> yield(name: "unique")'
        result = query_api.query(org="monetx", query=query)
        results = []

        try:
            for table in result:
                for record in table.records:
                    objDict = {}
                    if record["Download"]:
                        try:
                            if record["IP_ADDRESS"]:
                                objDict["ip_address"] = record["IP_ADDRESS"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass
                        try:
                            if record["DEVICE_NAME"]:
                                objDict["device_name"] = record["DEVICE_NAME"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass

                        try:
                            if record["Interface_Name"]:
                                objDict["interface_name"] = record["Interface_Name"]
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            pass

                        try:
                            if record["Download"]:
                                objDict["download_speed"] = round(
                                    float(record["Download"]), 2
                                )
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            objDict["download_speed"] = float(0)
                        try:
                            if record["Upload"]:
                                objDict["upload_speed"] = round(
                                    float(record["Upload"]), 2
                                )
                        except Exception as e:
                            print("error", str(e), file=sys.stderr)
                            objDict["upload_speed"] = float(0)

                        # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                        results.append(objDict)

            sortlist = sorted(results, key=lambda k: k["download_speed"], reverse=True)
            # print(sortlist,file=sys.stderr)
            # test_list = ({v['interface_name']: v for v in sortlist}.values())
            # test_list = list(test_list)
            output = {}
            for v in sortlist:
                if "interface_name" in v:
                    interface_name = v["interface_name"]
                    output[interface_name] = v

            output = list(output.values())

            return jsonify(output[0:9])
        except Exception as e:
            print("Error", str(e), file=sys.stderr)
            traceback.print_exc()
            return "Error ", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getdata", methods=["GET"])
@token_required
def data_fetching(user_data):
    from app import client

    org = "monetx"
    query_api = client.query_api()
    query = f'import "strings"\
    import "influxdata/influxdb/schema"\
    from(bucket: "monitoring")\
     |> range(start:-60d)\
     |> filter(fn: (r) => r["_measurement"] == "Devices")\
     |> last()\
     |> schema.fieldsAsCols()'

    result = query_api.query(org="monetx", query=query)
    results = []

    try:
        for table in result:
            for record in table.records:
                print("printing record:", record, file=sys.stderr)
                objDict = {}
                try:
                    if record["FUNCTION"]:
                        objDict["function"] = record["FUNCTION"]
                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    pass
                try:
                    if record["Response"]:
                        objDict["response"] = record["Response"]
                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    pass
                try:
                    if record["STATUS"]:
                        objDict["status"] = record["STATUS"]
                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    pass

                try:
                    if record["Uptime"]:
                        objDict["uptime"] = record["Uptime"]
                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    pass

                try:
                    if record["VENDOR"]:
                        objDict["vendor"] = record["VENDOR"]
                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    pass
                try:
                    if record["CPU"]:
                        objDict["cpu"] = record["CPU"]
                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    pass
                try:
                    if record["Memory"]:
                        objDict["memory"] = record["Memory"]
                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    pass
                try:
                    if record["PACKETS_LOSS"]:
                        objDict["packets"] = record["PACKETS_LOSS"]
                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    pass
                try:
                    if record["DEVICE_NAME"]:
                        objDict["device_name"] = record["DEVICE_NAME"]
                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    pass
                try:
                    if record["INTERFACES"]:
                        objDict["interfaces"] = record["INTERFACES"]
                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    pass
                try:
                    if record["Date"]:
                        objDict["date"] = record["Date"]
                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    pass
                try:
                    if record["DEVICE_DESCRIPTION"]:
                        objDict["device_description"] = record["DEVICE_DESCRIPTION"]
                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    pass
                try:
                    if record["DISCOVERED_TIME"]:
                        objDict["discovered_time"] = record["DISCOVERED_TIME"]

                except Exception as e:
                    print("error", str(e), file=sys.stderr)
                    pass
                # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                results.append(objDict)

        print(results, file=sys.stderr)
        return jsonify(results)
    except Exception as e:
        print("Error", str(e), file=sys.stderr)
        traceback.print_exc()
        return "Error ", 500

        # objDict[record.get_field()]=record.get_value()

    # 3
    # pass

    # with InfluxDBClient(url="http://localhost:8086", token=tok, org="my-org") as client:

    # Query: using Table structure
    # tables = client.query_api().query(org=org, query='from(bucket:"monitoring") |> range(start: -60d)').to_json()
    # Serialize to values
    # output = tables.to_json()
    # print(tables,file=sys.stderr)
    # return jsonify(tables)


@app.route("/getintdata", methods=["GET"])
@token_required
def int_fetching(user_data):
    # 1
    # Store the URL of your InfluxDB instance
    from app import client

    # token = "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A=="
    org = "monetx"
    # bucket = "monitoring"

    # client = DataFrameClient(host='localhost',port=8086, username='root',password='As123456?', database='monitoring')
    # client.switch_database('monitoring')
    # result = client.query("select * from Devices")

    # 2
    # Query script
    # from app import client

    query_api = client.query_api()
    query = f'import "strings"\
    import "influxdata/influxdb/schema"\
    from(bucket: "monitoring")\
    |> range(start: -60d)\
    |> filter(fn: (r) => r["_measurement"] == "Interfaces")\
    |> unique()\
    |> schema.fieldsAsCols()'

    result = query_api.query(org="monetx", query=query)
    results = []

    try:
        for table in result:
            for record in table.records:
                objDict = {}
                if record["IP_ADDRESS"]:
                    objDict["ip_address"] = record["IP_ADDRESS"]
                if record["FUNCTION"]:
                    objDict["function"] = record["FUNCTION"]
                if record["STATUS"]:
                    objDict["status"] = record["STATUS"]
                if record["VENDOR"]:
                    objDict["vendor"] = record["VENDOR"]
                if record["Interface_Name"]:
                    objDict["interface_name"] = record["Interface_Name"]
                if record["Interface_Des"]:
                    objDict["interface_des"] = record["Interface_Des"]
                if record["Download"]:
                    objDict["download"] = record["Download"]
                if record["Upload"]:
                    objDict["upload"] = record["Upload"]
                if record["Date"]:
                    objDict["date"] = record["Date"]

                # str(datetime.strptime((str(datetime.now()).split('.')[0]),"%Y-%m-%d %H:%M:%S")-datetime.strptime((record['discovered_time'].discovered_time.split('.'))[0],"%Y-%m-%d %H:%M:%S"))

                results.append(objDict)
                print("printing object of interfaces route", objDict, file=sys.stderr)
        print(results, file=sys.stderr)
        return jsonify(results)
    except Exception as e:
        print("Error", str(e), file=sys.stderr)
        traceback.print_exc()
        return "Error ", 500

        # objDict[record.get_field()]=record.get_value()

    # 3
    # pass

    # with InfluxDBClient(url="http://localhost:8086", token=tok, org="my-org") as client:

    # Query: using Table structure
    # tables = client.query_api().query(org=org, query='from(bucket:"monitoring") |> range(start: -60d)').to_json()
    # Serialize to values
    # output = tables.to_json()
    # print(tables,file=sys.stderr)
    # return jsonify(tables)


@app.route("/datapush", methods=["GET"])
def data_dumping():
    from app import client

    org = "monetx"
    bucket = "monitoring"
    # # # writing into database
    print("i am in client", file=sys.stderr)
    write_api = client.write_api(write_options=SYNCHRONOUS)
    data = (
        influxdb_client.Point("192.168.30.167" + " D")
        .field("Device", "JUNIPER")
        .field("Type", "Juniper")
        .field("Status", "DOWN")
        .field("Response", "46")
        .field("Uptime", "7836")
    )
    print("data point set", file=sys.stderr)
    try:
        write_api.write(bucket, org, data)
        return f"Data added "

    except Exception as e:
        print("in exception", str(e))
        return f"Database connection issue: {e}"

        # if len(final_interfaces.items()) > 0:
        #     print("in full Interfaces block")
        #     for k in final_interfaces.keys():
        #         data = influxdb_client.Point(host[1]+" I").tag('Interfaces',k).field('Device',host[1]).field('Type',"Juniper").field('Status',final_interfaces[k]['Status'][0]).field('Download',float(final_interfaces[k]['Download'])).field('Upload',float(final_interfaces[k]['Upload']))
        #         try:
        #             write_api.write(bucket, org, data)
        #         except Exception as e:
        #             print("in exception",str(e))

        #             return f"Database connection issue: {e}"
        # else:
        #     print("in null interfaces block")
        #     data = influxdb_client.Point(host[1]+" I").tag('Interfaces','NA').field('Device',host[1]).field('Type',"Juniper").field('Download',0).field('Upload',0)
        #     try:
        #         write_api.write(bucket, org, data)
        #     except Exception as e:
        #         print("in exception",str(e))

        #         return f"Database connection issue: {e}"
        #     print(data,write_api)
        # return (final_interfaces,output)


@app.route("/testingdb", methods=["GET"])
def postingdata():
    # # # writing into database
    from app import client

    print("i am in client")
    write_api = client.write_api(write_options=SYNCHRONOUS)

    dictionary = [
        {
            "measurement": "Devices",
            "tags": {
                "DEVICE_NAME": "output['device_name']",
                "STATUS": "output['status']",
                "IP_ADDRESS": "host[1]",
                "FUNCTION": "host[2]",
                "VENDOR": "host[6]",
            },
            "time": datetime.now(),
            "fields": {
                "INTERFACES": 22,
                "DISCOVERED_TIME": str(datetime.now()),
                "DEVICE_DESCRIPTION": "output['device_description']",
                "CPU": "output['cpu']",
                "Memory": "output['memory']",
                "PACKETS_LOSS": "output['packets']",
                "Response": "output['response']",
            },
        }
    ]

    # data = influxdb_client.Point.from_dict(dictionary, WritePrecision.NS)

    # ("Devices").tag('DEVICE_NAME',host[1]).tag('STATUS','{host[2]}').tag('IP_ADDRESS',output['status']).tag('DEVICE_TYPE', output['response']).tag('FUNCTION',output['Uptime']).field('CPU Utilization',output['CPU Utilization']).field('Memory Utilization',output['Memory Utilization'])
    try:
        write_api.write(bucket="monitoring", record=dictionary)
        print("data point set", file=sys.stderr)

        traceback.print_exc()

        return "ho gyaaa babu bhaiya", 200
    except Exception as e:
        print(f"Database connection issue: {e}", file=sys.stderr)
        traceback.print_exc()
        return str(e), 500


@app.route("/getSnapshot", methods=["GET"])
# @token_required
def snapshot():
    if True:
        try:
            queryString = f"select `function`,count(`function`) from monitoring_devices_table where active='Active' group by `function`;"
            results = db.session.execute(queryString)

            queryString1 = "select `function`,count(`function`) from alerts_table where date > now() - interval 1 day  group by `function` ;"
            results1 = db.session.execute(queryString1)

            MonitoringDataDict = {}
            MonitoringDataDict1 = {}

            for MonitoringObj in results:
                MonitoringDataDict[MonitoringObj[0]] = MonitoringObj[1]

            for MonitoringObj in results1:
                MonitoringDataDict1[MonitoringObj[0]] = MonitoringObj[1]

            final = []
            for key, Value in MonitoringDataDict.items():
                print(key, Value, file=sys.stderr)
                # print(key,file=sys.stderr)
                try:
                    final.append(
                        {
                            "name": key,
                            "devices": MonitoringDataDict[key],
                            "alarms": MonitoringDataDict1[key],
                        }
                    )
                except Exception as e:
                    print(e, file=sys.stderr)
                    final.append(
                        {"name": key, "devices": MonitoringDataDict[key], "alarms": 0}
                    )

            return jsonify(final), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getMonitoringHeatmap", methods=["GET"])
@token_required
def monHeatmap(user_data):
    if True:
        try:
            sqlquery = f"select * from monitoring_devices_table;"
            results = db.session.execute(sqlquery)

            objList = []

            for result in results:
                xyDict = {}
                dataDict = {}
                dataDict["name"] = result[1]
                status = result[9]
                if status == "Up":
                    status = 1
                if status == "Down":
                    status = 0
                xyDict["x"] = result[7]
                xyDict["y"] = status
                dataDict["data"] = [xyDict]

                objList.append(dataDict)

            return jsonify(objList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getMonitoringSpiral", methods=["GET"])
def monSpiral():
    if True:
        try:
            sqlquery = f"select count(device_heatmap) from monitoring_devices_table where device_heatmap='Device Down';"
            service_down = db.session.execute(sqlquery).scalar()
            sqlquery = "select count(device_heatmap) from monitoring_devices_table where device_heatmap = 'Critical';"
            critical = db.session.execute(sqlquery).scalar()
            sqlquery = "select count(device_heatmap) from monitoring_devices_table where device_heatmap = 'Attention';"
            attention = db.session.execute(sqlquery).scalar()
            # trouble variable
            sqlquery = f"select count(device_heatmap) from monitoring_devices_table where device_heatmap='InActive';"
            no_monitoring = db.session.execute(sqlquery).scalar()
            sqlquery = f"select count(device_heatmap) from monitoring_devices_table where device_heatmap='Clear';"
            clear = db.session.execute(sqlquery).scalar()
            queryString = f"select count(DEVICE_HEATMAP) from monitoring_devices_table where DEVICE_HEATMAP='Not Monitored';"
            not_monitored = db.session.execute(queryString).scalar()
            sqlquery = f"select count(ip_address) from monitoring_devices_table;"
            total = (
                service_down
                + critical
                + attention
                + no_monitoring
                + clear
                + not_monitored
            )
            objlist = [
                {"fill": "#E2B200", "name": "Attention", "value": int(attention)},
                {
                    "fill": "#C0C0C0",
                    "name": "Not Monitored",
                    "value": int(not_monitored),
                },
                {"fill": "#66B127", "name": "Clear", "value": int(clear)},
                {"fill": "#FF9A40", "name": "Critical", "value": int(critical)},
                {"fill": "#808080", "name": "InActive", "value": int(no_monitoring)},
                {"fill": "#DC3938", "name": "Device Down", "value": int(service_down)},
                {"fill": "#0504aa", "name": "Total", "value": int(total)},
            ]

            return jsonify(objlist), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getDCStatus", methods=["GET"])
@token_required
def DCStatus(user_data):
    if True:
        try:
            total = []
            # Up,critical,informational,InActive,Down
            sqlquery = (
                f"select ip_address,device_heatmap from monitoring_devices_table;"
            )
            results = db.session.execute(sqlquery)
            for device in results:
                devDict = {}
                devDict["ip_address"] = device[0]
                devDict["status"] = device[1]
                total.append(devDict)
            print(total, file=sys.stderr)
            return jsonify(total), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getNewDCStatus", methods=["GET"])
@token_required
def GetNewDCStatus(user_data):
    if True:
        try:
            total = []
            # Up,critical,informational,InActive,Down
            sqlquery = f"select ip_address,device_heatmap,`function` from monitoring_devices_table;"
            results = db.session.execute(sqlquery)
            for device in results:
                devDict = {}
                devDict["id"] = device[0]
                devDict["label"] = device[0]
                devDict["status"] = device[1]
                devDict["function"] = device[2]
                total.append(devDict)
            for dic in total:
                dic["title"] = f"{dic['id']}\n{dic['status']}"

                dic["image"] = "./img/" + dic["function"] + ".svg"
            staticDict = {
                "function": "MonetX",
                "image": "MonetX",
                "label": "MonetX",
                "id": "1",
                "status": "N/A",
                "title": "MonetX",
            }

            total.append(staticDict)
            y = {}
            y["nodes"] = total
            edgesList = []
            for dic in total:
                objDict = {}
                ip_address = dic["id"]
                status = dic["status"]
                if status == "Clear":
                    status = "#5AB127"
                elif status == "Active":
                    status = "#90EE90"
                elif status == "InActive":
                    status = "#A8A6A6"
                elif status == "Attention":
                    status = "#E2B200"
                elif status == "Not Monitored":
                    status = "#D7D7D7"
                elif status == "Critical":
                    status = "#FF9A40"
                elif status == "Device Down":
                    status = "#DC3938"
                elif status == "N/A":
                    status = "None"
                else:
                    status = "#D7D7D7"
                if "#" in status:
                    objDict["id"] = ip_address
                    objDict["from"] = "1"
                    objDict["to"] = ip_address
                    objDict["color"] = {"color": status}

                    edgesList.append(objDict)

            y["edges"] = edgesList
            return (y), 200
        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
    return jsonify({"Response": "Service not Available"}), 503


@app.route("/getV1V2Credentials", methods=["GET"])
def V2Credentials():
    if True:
        try:
            MonitoringObjList = []

            queryString = f"select profile_name,description,snmp_read_community,snmp_port,CREDENTIALS_ID from monitoring_credentials_table where category='v1/v2'"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict["profile_name"] = MonitoringObj[0]
                MonitoringDataDict["description"] = MonitoringObj[1]
                MonitoringDataDict["community"] = MonitoringObj[2]
                MonitoringDataDict["port"] = MonitoringObj[3]
                MonitoringDataDict["cred_id"] = MonitoringObj[4]

                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getWMICredentials", methods=["GET"])
def WMICredentials():
    if True:
        try:
            MonitoringObjList = []

            queryString = f"select profile_name,username,password,CREDENTIALS_ID from monitoring_credentials_table where category='wmi'"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict["profile_name"] = MonitoringObj[0]
                MonitoringDataDict["username"] = MonitoringObj[1]
                MonitoringDataDict["password"] = MonitoringObj[2]
                MonitoringDataDict["cred_id"] = MonitoringObj[3]

                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/getV3Credentials", methods=["GET"])
def V3Credentials():
    if True:
        try:
            MonitoringObjList = []

            queryString = f"select profile_name,username,description,snmp_port,authentication_method,password,encryption_method,encryption_password,CREDENTIALS_ID from monitoring_credentials_table where category='v3';"
            results = db.session.execute(queryString)

            for MonitoringObj in results:
                MonitoringDataDict = {}
                MonitoringDataDict["profile_name"] = MonitoringObj[0]
                MonitoringDataDict["username"] = MonitoringObj[1]
                MonitoringDataDict["description"] = MonitoringObj[2]
                MonitoringDataDict["port"] = MonitoringObj[3]
                MonitoringDataDict["authentication_protocol"] = MonitoringObj[4]

                # if  MonitoringObj[4] == "usmHMACMD5AuthProtocol":
                #     MonitoringDataDict['authentication_protocol'] = "MD5"
                # if MonitoringObj[4] == "usmHMACSHAAuthProtocol":
                #      MonitoringDataDict['authentication_protocol'] = "SHA"
                # if MonitoringObj[4] == "usmHMAC192SHA256AuthProtocol":
                #      MonitoringDataDict['authentication_protocol'] = "SHA-256"
                # if  MonitoringObj[4] == "usmHMAC384SHA512AuthProtocol":
                #      MonitoringDataDict['authentication_protocol'] = "SHA-512"

                # Auth
                # usmHMACMD5AuthProtocol
                # usmHMACSHAAuthProtocol
                # usmHMAC128SHA224AuthProtocol
                # usmHMAC192SHA256AuthProtocol
                # usmHMAC256SHA384AuthProtocol
                # usmHMAC384SHA512AuthProtocol
                # Encryp
                # usm3DESEDEPrivProtocol
                # usmAesCfb128Protocol
                # usmAesCfb192Protocol
                # usmAesCfb256Protocol

                MonitoringDataDict["authentication_password"] = MonitoringObj[5]

                MonitoringDataDict["encryption_protocol"] = MonitoringObj[6]
                # if MonitoringObj[6] == "usmDESPrivProtocol":
                #     MonitoringDataDict['encryption_protocol'] = "DES"
                # if MonitoringObj[6] == "usmAesCfb128Protocol":
                #     MonitoringDataDict['encryption_protocol'] = "AES-128"
                # if MonitoringObj[6] == "usmAesCfb192Protocol":
                #     MonitoringDataDict['encryption_protocol'] = "AES-192"
                # if MonitoringObj[6] == "usmAesCfb256Protocol":
                #     MonitoringDataDict['encryption_protocol'] = "AES-256"
                MonitoringDataDict["encryption_password"] = MonitoringObj[7]
                MonitoringDataDict["cred_id"] = MonitoringObj[8]
                MonitoringObjList.append(MonitoringDataDict)

            return jsonify(MonitoringObjList), 200

        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500
    else:
        print("Service not Available", file=sys.stderr)
        return jsonify({"Response": "Service not Available"}), 503


@app.route("/deleteMonitoringCreds", methods=["POST"])
@token_required
def deleteV3Credentials(user_data):
    if True:
        try:
            MonitoringObj = request.get_json()
            print(MonitoringObj, file=sys.stderr)
            for mid in MonitoringObj:
                queryString = f"DELETE FROM monitoring_credentials_table WHERE CREDENTIALS_ID={mid};"
                db.session.execute(queryString)
                db.session.commit()
            return "Response deleted", 200
        except Exception as e:
            traceback.print_exc()
            return "Something Went Wrong!", 500


@app.route("/deleteMonitoringdata", methods=["POST"])
def DeleteMonitoringData():
    try:
        org = "monetx"
        bucket = "monitoring"
        measurement = "Devices"
        ip_address = "192.168.0.2"
        url = f"http://localhost:8086/api/v2/delete?org={org}&bucket={bucket}"
        headers = {
            "Authorization": "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A==",
            "Content-Type": "application/json",
        }
        data = {
            "start": "-60d",
            "predicate": f'measurement="{measurement}" AND IP_ADDRESS="{ip_address}"',
        }

        requests.post(url, headers=headers, data=data)

        return "deleted"

    except Exception as e:
        print(
            "printing exception while deleteing data in influxdb",
            str(e),
            file=sys.stderr,
        )
        return str(e)


@app.route("/deleteAllMonitoringdata", methods=["GET"])
def DeleteAllMonitoringData():
    try:
        org = "monetx"
        bucket = "monitoring"
        from app import client

        from influxdb_client import InfluxDBClient

        delete_api = client.delete_api()

        """
        Delete Data
        """
        date_helper = get_date_helper()
        start = "1970-01-01T00:00:00Z"
        stop = date_helper.to_utc(datetime.now())
        delete_api.delete(
            start, stop, f'_measurement="Devices"', bucket=f"{bucket}", org=f"{org}"
        )
        delete_api.delete(
            start, stop, f'_measurement="Interfaces"', bucket=f"{bucket}", org=f"{org}"
        )

        """
        Close client
        """
        return "deleted"

    except Exception as e:
        print(
            "printing exception while deleteing data in influxdb",
            str(e),
            file=sys.stderr,
        )
        return str(e)


@app.route("/deleteIPMonitoringdata", methods=["GET"])
def DeleteIPMonitoringData():
    try:
        from app import client

        org = "monetx"
        bucket = "monitoring"

        from influxdb_client import InfluxDBClient

        predicatereq1 = f'_measurement="Devices" AND IP_ADDRESS ="{ip_address}"'
        predicatereq2 = f'_measurement="Interfaces" AND IP_ADDRESS ="{ip_address}"'

        delete_api = client.delete_api()

        """
        Delete Data
        """
        date_helper = get_date_helper()
        start = "1970-01-01T00:00:00Z"
        stop = date_helper.to_utc(datetime.now())
        delete_api.delete(
            start, stop, bucket=f"{bucket}", org=f"{org}", predicate=predicatereq1
        )
        delete_api.delete(
            start, stop, bucket=f"{bucket}", org=f"{org}", predicate=predicatereq2
        )

        """
        Close client
        """
        return "deleted"

    except Exception as e:
        print(
            "printing exception while deleteing data in influxdb",
            str(e),
            file=sys.stderr,
        )
        return str(e)


@app.route("/deleteMonitoringAlerts", methods=["POST"])
@token_required
def DeleteMonitoringAlerts(user_data):
    if True:
        try:
            monitoringObj = request.get_json()
            response = False
            queryString = f"delete from alerts_table where IP_ADDRESS='{monitoringObj['ip_address']}';"
            db.session.execute(queryString)
            db.session.commit()
            response = True
            if response:
                return (
                    f"Alerts Deleted Successfully for {monitoringObj['ip_address']}",
                    200,
                )
            else:
                return "Deletion was Unsuccessful", 500
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({"message": "Authentication Failed"}), 401


@app.route("/possibleReasonForAlerts", methods=["POST"])
@token_required
def PossibleReasonForAlerts(user_data):
    if True:
        try:
            monitoringObj = request.get_json()
            output = ""
            description = (monitoringObj["description"]).lower()
            if "of cpu" in description:
                output = "High CPU due to a broadcast storm\nHigh CPU due to BGP scanner\nHigh CPU Utilization in Exec and Virtual Exec Processes\nHigh CPU due to Non-Reverse Path Forwarding (RPF) traffic\nHigh CPU due to Multicast"

            elif "memory" in description:
                output = "Memory leaks\nProcesses running on a device to see what’s using memory\nMemory size not large enough to support OS image (if you upgraded recently)\nMemory fragmentation"

            elif "offline" in description:
                output = "Power outage or brownout\nUpstream switch or router on the network is also having issues\nDevice misconfiguration\nICMP traffic to device blocked\nEmergency maintenance\nHardware malfunction\nCrash related to the operating system\nDevice removed from network"
            if output == "":
                return "Nothing to Display", 500

            else:
                print(output, file=sys.stderr)
                return output, 200
        except Exception as e:
            print(str(e), file=sys.stderr)
            traceback.print_exc()
            return str(e), 500
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({"message": "Authentication Failed"}), 401
