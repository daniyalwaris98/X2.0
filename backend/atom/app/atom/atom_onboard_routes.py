import sys
import traceback

from flask_jsonpify import jsonify
from flask import request

from app import app, db
from app.middleware import token_required

from app.utilities.db_utils import *
from app.atom.atom_utils import *

from app.pullers.NXOS.nxos_inv import NXOSPuller
from app.pullers.IOSXR.ios_xr_inv import XRPuller
from app.pullers.IOSXE.ios_xe_inv import XEPuller
from app.pullers.IOS.ios_inv import IOSPuller
from app.pullers.ACI.aci_inv import ACIPuller
from app.pullers.WLC.cisco_wlc_inv import WLCPuller
from app.pullers.Prime.prime_inv import PrimePuller
from app.pullers.UCS.ucs_cimc_inv import UCSPuller
from app.pullers.A10.a10_inv import A10Puller
from app.pullers.Infoblox.infoblox_inv import InfoboxPuller
from app.pullers.Arista.arista_inv import AristaPuller
from app.pullers.Arbor.arbor_inv import ArborPuller
from app.pullers.Wirefilter.wirefilter_inv import WirefilterPuller
from app.pullers.Fortinet.fortinet_inv import FortinetPuller
from app.pullers.Juniper.juniper_inv import JuniperPuller
from app.pullers.ASA.cisco_asa_inv import ASAPuller
from app.pullers.PaloAlto.palo_alto_inv import PaloAltoPuller
from app.pullers.Pulse_Secure.pulse_secure_inv import PulseSecurePuller
from app.pullers.Symantec.symantec_inv import SymantecPuller
from app.pullers.Fireeye.fireeye_inv import FireEyePuller
from app.pullers.Firepower.firepower_inv import FirePowerPuller
from app.pullers.H3C.h3c import H3CPuller


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
            
            result = db.session.query(Atom_Table, Password_Group_Table).join(Password_Group_Table, Password_Group_Table.password_group_id==Atom_Table.password_group_id).filter(Atom_Table.ip_address==ip).first()
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
