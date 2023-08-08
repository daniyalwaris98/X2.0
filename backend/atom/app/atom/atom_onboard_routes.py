from app.atom.atom_utils import *



@app.route("/onBoardDevice", methods=['POST'])
@token_required
def OnBoardDevice(user_data):
    try:
        postData = request.get_json()
        print(postData, file=sys.stderr)
        
        successList = []
        errorList = []
        
        objList = []
        print('Started at: ' +
                datetime.now().strftime('%Y-%m-%dT%H:%M:%S'), file=sys.stderr)
        for ip in postData:
            print(ip, file=sys.stderr)
            
            result = db.session.query(Atom_Table, Password_Group_Table).join(Password_Group_Table, Password_Group_Table.password_group==Atom_Table.password_group).filter(Atom_Table.ip_address==ip).first()
            response = True
            if result is None:
                pass
            
            else:
                atom, password_group = result
                
                atom = atom.as_dict()
                password_group = password_group.as_dict()
                
                atom.update(password_group)
                
                objList = []
                objList.append(atom)
            
                
                if atom['device_type'] == 'a10':
                    print("A10 device puller started", file=sys.stderr)
                    pullerA10 = A10Puller()
                    response = pullerA10.get_inventory_data(objList)
                
                # arbor
                elif atom['device_type'] == 'arbor':
                    print("Arbor device puller started", file=sys.stderr)
                    pullerArbor = ArborPuller()
                    response = pullerArbor.get_inventory_data(objList)
                
                # arista
                elif atom['device_type'] == 'arista':
                    print("Arista device puller started", file=sys.stderr)
                    pullerArista = AristaPuller()
                    response = pullerArista.get_inventory_data(objList)
                
                # cisco_aci
                elif atom['device_type'] == 'cisco_aci' or atom['device_type'] == 'cisco_apic':
                    print("ACI device puller started", file=sys.stderr)
                    pullerAci = ACIPuller()
                    response = pullerAci.get_inventory_data(objList)
                # cisco_aireos
                
                #cisco_apic

                #cisco_asa
                elif atom['device_type'] == 'cisco_asa':
                    print("ASA device puller started", file=sys.stderr)
                    pullerASA = ASAPuller()
                    # pullerASA96 = ASA96Puller()
                    response = pullerASA.get_inventory_data(objList)
                    # response = pullerASA96.get_inventory_data(objList)
                
                # cisco_ios
                elif atom['device_type'] == 'cisco_ios':
                    print("IOS device puller started", file=sys.stderr)
                    pullerIOS = IOSPuller()
                    response = pullerIOS.get_inventory_data(objList)
                
                # cisco_ios_xe
                elif atom['device_type'] == 'cisco_ios_xe':
                    atom['device_type'] = 'cisco_ios'
                    print("IOS-XE device puller started", file=sys.stderr)
                    pullerXE = XEPuller()
                    response = pullerXE.get_inventory_data(objList)
                
                # cisco_ios_xr
                elif atom['device_type'] == 'cisco_ios_xr':
                    atom['device_type'] = 'cisco_xr'
                    print("IOS-XR device puller started", file=sys.stderr)
                    pullerXR = XRPuller()
                    response = pullerXR.get_inventory_data(objList)
                
                # cisco_nxos
                elif atom['device_type'] == 'cisco_nxos':
                    print("NXOS device puller started", file=sys.stderr)
                    pullerNXOS = NXOSPuller()
                    response = pullerNXOS.get_inventory_data(objList)
                    
                # cisco_ucs
                elif atom['device_type'] == 'cisco_ucs':
                    print("UCS device puller started", file=sys.stderr)
                    pullerUcs = UCSPuller()
                    response = pullerUcs.get_inventory_data(objList)

                # cisco_wlc
                elif atom['device_type'] == 'cisco_wlc' or atom['device_type'] == 'cisco_wlc_ssh':
                    atom['device_type'] = 'cisco_wlc_ssh'
                    print("WLC device puller started", file=sys.stderr)
                    pullerWlc = WLCPuller()
                    response = pullerWlc.get_inventory_data(objList)
                
                # extream_os

                # f5_itm

                # fireeye
                elif atom['device_type'] == 'fireeye':
                    print("FireEye device puller started", file=sys.stderr)
                    pullerFireeye = FireEyePuller()
                    response = pullerFireeye.get_inventory_data(objList)

                # firepower
                elif atom['device_type'] == 'firepower':
                    print("FirePower device puller started", file=sys.stderr)
                    pullerFirePower = FirePowerPuller()
                    response = pullerFirePower.get_inventory_data(objList)

                # fortinet
                elif atom['device_type'] == 'fortinet':
                    print("Fortinet device puller started", file=sys.stderr)
                    PullerFortinet = FortinetPuller()
                    response = PullerFortinet.get_inventory_data(objList)

                # greatbay
                elif atom['device_type'] == 'greatbay':
                    print("GreatBay device puller started", file=sys.stderr)
                    pullerGreatBay = PrimePuller()
                    response = pullerGreatBay.get_inventory_data(objList)

                # huawei

                #h3c / hp_comware
                elif atom['device_type'] == 'h3c' or atom['device_type'] == 'hp_comware':
                    atom['device_type'] = 'hp_comware'
                    print("H3C / HP_Comware device puller started", file=sys.stderr)
                    h3cPuller = H3CPuller()
                    response = h3cPuller.get_inventory_data(objList)


                # infobox
                elif atom['device_type'] == 'infobox':
                    print("InfoBox device puller started", file=sys.stderr)
                    pullerInfoBox = InfoboxPuller()
                    response = pullerInfoBox.get_inventory_data(objList)

                # juniper 
                # juniper_screenos
                elif atom['device_type'] == 'juniper' or atom['device_type'] == 'juniper_screenos':
                    atom['device_type'] = 'juniper'
                    print("Juniper device puller started", file=sys.stderr)
                    PullerJuniper = JuniperPuller()
                    response = PullerJuniper.get_inventory_data(objList)

                # linux

                # paloalto
                elif atom['device_type'] == 'paloalto':
                    atom['device_type'] = 'paloalto_panos'
                    print("PaloAlto device puller started", file=sys.stderr)
                    pullerPaloAlto = PaloAltoPuller()
                    response = pullerPaloAlto.get_inventory_data(objList)

                # prime
                elif atom['device_type'] == 'prime':
                    print("Prime device puller started", file=sys.stderr)
                    pullerPrime = PrimePuller()
                    response = pullerPrime.get_inventory_data(objList)

                # pulse_secure
                elif atom['device_type'] == 'pulse_secure':
                    print("PulseSecure device puller started", file=sys.stderr)
                    pullerPulseSecure = PulseSecurePuller()
                    response = pullerPulseSecure.get_inventory_data(
                        objList)

                # symantec
                elif atom['device_type'] == 'symantec':
                    print("Symantec device puller started", file=sys.stderr)
                    pullerSymantec = SymantecPuller()
                    response = pullerSymantec.get_inventory_data(objList)

                # wire_filter
                elif atom['device_type'] == 'wire_filter':
                    print("WireFilter device puller started", file=sys.stderr)
                    pullerWireFilter = WirefilterPuller()
                    response = pullerWireFilter.get_inventory_data(objList)

                # window
            
            if response:
                errorList.append(f"{ip} : Error While Onboarding")
            else:
                successList.append(f"{ip} : Device Onboarded Successfully")
                
            
        
        return f"** Onboard Summary **\nFailed : {len(errorList)}\nSuccessful : {len(successList)}", 200
            
    except Exception as e:
        traceback.print_exc()
        return "Server Error", 500


@app.route("/addDeviceStatically", methods=['POST'])
@token_required
def AddDeviceStatically(user_data):

    # request.headers.get('X-Auth-Key') == session.get('token', None):
    if True:
        try:
            deviceObj = request.get_json()

            print(deviceObj, file=sys.stderr)

            if Phy_Table.query.with_entities(Phy_Table.site_name).filter_by(site_name=deviceObj['site_name']).first() != None and Rack_Table.query.with_entities(Rack_Table.rack_name).filter_by(rack_name=deviceObj['rack_name']).first() != None:
                device = Device_Table()
                device.site_id = deviceObj['site_name']
                device.rack_id = deviceObj['rack_name']
                atom = Atom.query.filter_by(
                    ip_address=deviceObj['ip_address']).first()
                if not atom:
                    print(
                        f"IP ADDRESS {deviceObj['ip_address']} is not in Atom", file=sys.stderr)
                    return jsonify({'response': "Not in Atom"}), 500

                atom.onboard_status = 'true'
                UpdateData(atom)

                device.device_name = deviceObj['device_name']
                device.ip_address = deviceObj['ip_address']

                if deviceObj['software_version']:
                    device.software_version = deviceObj['software_version']
                if deviceObj['patch_version']:
                    device.patch_version = deviceObj['patch_version']
                if deviceObj['status']:
                    device.status = deviceObj['status']
                if deviceObj['ru']:
                    device.ru = deviceObj['ru']
                if deviceObj['department']:
                    device.department = deviceObj['department']
                if deviceObj['section']:
                    device.section = deviceObj['section']
                # if deviceObj['criticality']:
                #     device.criticality = deviceObj['criticality']
                if deviceObj['function']:
                    device.function = deviceObj['function']
                # if deviceObj['domain']:
                #     device.cisco_domain = deviceObj['domain']
                if deviceObj['manufacturer']:
                    device.manufacturer = deviceObj['manufacturer']
                if deviceObj['hw_eos_date']:
                    device.hw_eos_date = FormatStringDate(
                        deviceObj['hw_eos_date'])
                if deviceObj['hw_eol_date']:
                    device.hw_eol_date = FormatStringDate(
                        deviceObj['hw_eol_date'])
                if deviceObj['sw_eos_date']:
                    device.sw_eos_date = FormatStringDate(
                        deviceObj['sw_eos_date'])
                if deviceObj['sw_eol_date']:
                    device.sw_eol_date = FormatStringDate(
                        deviceObj['sw_eol_date'])
                if deviceObj['virtual']:
                    device.virtual = deviceObj['virtual']
                if deviceObj['rfs_date']:
                    device.rfs_date = FormatStringDate(deviceObj['rfs_date'])
                if deviceObj['authentication']:
                    device.authentication = deviceObj['authentication']
                if deviceObj['serial_number']:
                    device.serial_number = deviceObj['serial_number']
                if deviceObj['pn_code']:
                    device.pn_code = deviceObj['pn_code']
                if deviceObj['subrack_id_number']:
                    device.subrack_id_number = deviceObj['subrack_id_number']
                if deviceObj['manufacturer_date']:
                    device.manufacturer_date = FormatStringDate(
                        deviceObj['manufacturer_date'])
                if deviceObj['hardware_version']:
                    device.hardware_version = deviceObj['hardware_version']
                if deviceObj['max_power']:
                    device.max_power = deviceObj['max_power']
                if deviceObj['site_type']:
                    device.site_type = deviceObj['site_type']
                if deviceObj['stack']:
                    device.stack = deviceObj['stack']
                if deviceObj['contract_number']:
                    device.contract_number = deviceObj['contract_number']
                if deviceObj['contract_expiry']:
                    device.contract_expiry = FormatStringDate(
                        deviceObj['contract_expiry'])
                device.source = 'Static'

                if Device_Table.query.with_entities(Device_Table.device_name).filter_by(ip_address=deviceObj['ip_address']).first() is not None:
                    device.device_name = Device_Table.query.with_entities(
                        Device_Table.device_name).filter_by(ip_address=deviceObj['ip_address']).first()[0]
                    print("Updated " +
                          deviceObj['ip_address'], file=sys.stderr)
                    device.modification_date = datetime.now()
                    UpdateData(device)

                else:
                    print("Inserted " +
                          deviceObj['ip_address'], file=sys.stderr)
                    device.creation_date = datetime.now()
                    device.modification_date = datetime.now()
                    InsertData(device)

                return jsonify({'response': "success", "code": "200"})
            else:
                print("Rack Name or Site Name does not exists", file=sys.stderr)
                return jsonify({'response': "Rack Name or Site Name does not Exists"}), 500
        except Exception as e:
            traceback.print_exc()
            return str(e), 500

    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401
