import traceback
from pysnmp.hlapi import *
from pysnmp.hlapi import varbinds
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS,ASYNCHRONOUS
from backend.atom.app.monitoring.common_utils.utils import *
# from utils import *
import sys


host = {'user':'LAB',
        'pwd' : 'nets@1234',
        'auth-key': 'nets@1234',
        'ip_address':'192.168.0.2' }


oids = {
        'uptime':'1.3.6.1.2.1.1.3.0',}


def get_oid_data(engn, community, transport, cnxt, oid):

            try:
                print(f"SNMP walk started for OID {oid}", file=sys.stderr)
                print("i am trying")
                oid = ObjectType(ObjectIdentity(oid))
                all=[]
                
                for(errorIndication, errorStatus, errorIndex, varBinds) in nextCmd(engn, community, transport, cnxt, oid, lexicographicMode=False): 
                    print("i am in for")
                    if errorIndication:
                        print(f'error=>{errorIndication}', file=sys.stderr)
                        
                    elif errorStatus:
                        print('%s at %s' % (errorStatus.prettyPrint(),
                                            errorIndex and varBinds[int(errorIndex) - 1][0] or '?'))
                    else:
                        for varBind in varBinds:
                            all.append(varBind)
                return all                     
            except Exception as e:
                print(f"Failed to run SNMP walk: {e}", file=sys.stderr)
                traceback.print_exc()
                return []



def general(varbinds):
    for varBind in varbinds:
        res = ' = '.join([x.prettyPrint() for x in varBind])
        if 'No Such Instance' not in res:
            result = res.split('=')[1].strip()
            return result



def poll():
        try:
            engn = SnmpEngine()
            community = CommunityData(mpModel=1,communityIndex=host['ip_address'], communityName= 'private')# snmp community
            #community = UsmUserData("SWVV3", "cisco123", "cisco123", authProtocol=usmHMACSHAAuthProtocol, privProtocol=usmAesCfb128Protocol)# snmp community
            transport = UdpTransportTarget((host['ip_address'], 161), timeout=5.0, retries=1)
            cnxt = ContextData()

        except Exception as e:
            print(e)
            print("func not working", file=sys.stderr)      


        try:

            temp = get_oid_data(engn, community, transport, cnxt, oids['uptime'])
            
            value  = general(temp)

        except Exception as e:
            print(e)
            value = 0

        return value


final = poll()

print(final)