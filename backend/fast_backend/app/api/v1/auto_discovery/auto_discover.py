import ipaddress
import sys
import threading
import traceback

import nmap
from pysnmp.entity.rfc3413.oneliner import cmdgen
from pysnmp.hlapi import *


def discover_ip_list(ip_list, results):
    for ip in ip_list:
        try:
            scanner = nmap.PortScanner()
            scanner.scan(ip, arguments='-O -T5')
            host = scanner.all_hosts()[0]

            udp = nmap.PortScanner()
            udp.scan(ip, arguments='-sU -T5')

            data_list = extract_ip_data(scanner, udp, host)

            if data_list is not None:
                results.append(data_list)

        except Exception:
            print("Error In DiscoverIPList For " + ip, file=sys.stderr)


def get_range_inventory_data(start_ip, end_ip):
    ip_list = get_all_ips_from_range(start_ip, end_ip)

    if len(ip_list) < 10:
        poll_size = len(ip_list)
    else:
        poll_size = 10

    ip_polls = create_poll(ip_list, poll_size)
    threads = []
    results = []
    for poll in ip_polls:
        th = threading.Thread(target=discover_ip_list, args=(poll, results))
        th.start()
        threads.append(th)

    for t in threads:
        t.join()

    return results


def get_subnet_inventory_data(subnet, exclude):
    ip_list = get_all_ips_from_subnet(subnet)

    try:
        index1 = exclude.rfind('-')
        start = int(exclude[:index1])
        end = int(exclude[index1 + 1:])

        first = ip_list[:start]
        last = ip_list[end + 1:]

        ip_list = first + last

        # dot = subnet.rfind('.')
        # startIP = subnet[:dot+1]+str(start)
        # endIP = subnet[:dot+1]+str(end)

    except Exception:
        traceback.print_exc()

    if len(ip_list) < 10:
        poll_size = len(ip_list)
    else:
        poll_size = 10

    ip_polls = create_poll(ip_list, poll_size)

    threads = []
    results = []
    for poll in ip_polls:
        th = threading.Thread(target=discover_ip_list, args=(poll, results))
        th.start()
        threads.append(th)

    # if len(threads) == poll:
    #     for t in threads:
    #         t.join()
    #     threads = []
    # else:
    #     # if request is less than connections_limit then join the threads and then return data
    #     for t in threads:  
    #         t.join()
    #     return inv_data

    for t in threads:
        t.join()

    return results


def snmp_enabled(ip_address):
    community_string = 'public'

    # Create an SNMP session
    cmd_generator = cmdgen.CommandGenerator()

    # Retrieve the SNMP version from the Microsoft server
    error_indication, error_status, error_index, var_binds = cmd_generator.getCmd(
        cmdgen.CommunityData(community_string),
        cmdgen.UdpTransportTarget((ip_address, 161)),
        '1.3.6.1.2.1.1.1.0'
    )

    # Check for errors
    if error_indication:
        return "Null"
    else:
        try:

            for name in var_binds:
                version = name.prettyPrint()
                index = version.index(':')
                version = version[0:index]
                return version
        except Exception:
            return 'Unresolved'


def extract_ip_data(scanner, udp, host):
    if scanner[host]['status']['state'] != 'up':
        return None

    # print(scanner[host],file=sys.stderr)

    try:
        device = scanner[host]['osmatch'][0]['osclass'][0]['osfamily']
    except Exception:
        device = "Unknown"

    try:
        device_model = scanner[host]['osmatch'][0]['name']
    except Exception:
        device_model = "Unknown"

    try:
        device_type = scanner[host]['osmatch'][0]['osclass'][0]['type']
    except Exception:
        device_type = "Unknown"

    try:
        vendor = scanner[host]['osmatch'][0]['osclass'][0]['vendor']
    except Exception:
        vendor = "Unknown"

    try:
        if udp[host]['udp'][161]['state'] == 'open':
            snmp_status = "Enabled"
        else:
            snmp_status = "Not Enabled"
    except Exception:
        snmp_status = "Not Enabled"
    snmp_version = "Null"

    # ipAddressList = []
    # queryString = f"select IP_ADDRESS from auto_discovery_table;"
    # result = db.session.execute(queryString)
    # from datetime import datetime
    # date = datetime.now()
    # for row in result:
    #     ipAddressList.append(row[0])

    # if host not in ipAddressList:
    #     queryString = f"INSERT INTO auto_discovery_table (IP_ADDRESS,DEVICE_TYPE,MAKE_MODEL,`TYPE`,VENDOR,SNMP_STATUS,SNMP_VERSION,CREATION_DATE,MODIFICATION_DATE) VALUES ('{host}', '{device}', '{device_model}', '{device_type}', '{vendor}', '{snmp_status}', '{snmp_version}','{date}','{date}');"
    #     db.session.execute(queryString)
    #     db.session.execute()
    #     print(f"Successfully Inserted to Database for {host}", file=sys.stderr)
    # else:
    #     queryString = f"UPDATE auto_discovery_table SET IP_ADDRESS='{host},DEVICE_TYPE='{device}',MAKE_MODEL='{device_model}',`TYPE`='{device_type}',VENDOR='{vendor}',SNMP_STATUS='{snmp_status}',SNMP_VERSION='{snmp_version}',MODIFICATION_DATE='{date}' where IP_ADDRESS='{host}';"
    #     db.session.execute(queryString)
    #     db.session.commit()
    #     print(f"Successfully Updated to Database for {host}", file=sys.stderr)

    print(f"""
    \n
    IP - {host}
    Device Type: {device}
    Make and Model: {device_model}
    Function: {device_type}
    Vendor: {vendor}
    SNMP Status: {snmp_status}
    SNMP Version: {snmp_version}
    \n""", file=sys.stderr)

    return [host, device, device_model, device_type, vendor, snmp_status, snmp_version]


def get_all_ips_from_subnet(subnet):
    return [str(ip) for ip in ipaddress.IPv4Network(subnet)]


def create_poll(ips, poll_size):
    return [ips[i:i + poll_size] for i in range(0, len(ips), poll_size)]


def get_all_ips_from_range(start_ip, end_ip):
    """
    Get all live IP addresses between start_ip and end_ip
    """
    # Convert the start and end IP addresses to IPv4Address objects
    start_ip = ipaddress.IPv4Address(start_ip)
    end_ip = ipaddress.IPv4Address(end_ip)

    live_ips = []

    # Iterate through all IP addresses between start_ip and end_ip
    for ip_int in range(int(start_ip), int(end_ip) + 1):
        ip_address = ipaddress.IPv4Address(ip_int)
        ip_str = str(ip_address)
        live_ips.append(ip_str)

        # try:
        #     socket.create_connection((ip_str, 80), timeout=1)
        #     live_ips.append(ip_str)
        # except OSError:
        #     pass

    return live_ips


def test_snmp_v2_credentials(ip_address, credentials):
    for credential in credentials:

        print(f"\nTesting SNMP Credentials : {ip_address} : {credential}\n")

        # Create an SNMP session
        cmd_generator = cmdgen.CommandGenerator()

        # Retrieve the SNMP version from the Microsoft server
        error_indication, error_status, error_index, var_binds = cmd_generator.getCmd(
            cmdgen.CommunityData(credential),
            cmdgen.UdpTransportTarget((ip_address, 161)),
            '1.3.6.1.2.1.1.1.0'
        )

        # Check for errors
        if error_indication:
            print(f'{ip_address} : {credential} : SNMP GET request failed: %s' %
                  error_indication, file=sys.stderr)
        elif error_status:
            print(f'{ip_address} : {credential} : SNMP GET request failed: %s at %s' % (
                error_status.prettyPrint(),
                error_index and var_binds[int(error_index) - 1][0] or '?'), file=sys.stderr)
        else:
            for varBind in var_binds:
                print(' = '.join([x.prettyPrint()
                                  for x in varBind]), file=sys.stderr)

            try:
                snmp_version = "Unknown"
                for name in var_binds:
                    version = name.prettyPrint()
                    index = version.index(':')
                    snmp_version = version[0:index]
            except Exception:
                snmp_version = 'Unresolved'
            return {'ip_address': ip_address, 'snmp_version': snmp_version,
                    'credential': credential}

    return None


def test_snmp_v_credentials(ip_address, credentials):
    for credential in credentials:

        user = UsmUserData(userName=credential['username'],
                           authKey=credential['authentication_password'],
                           authProtocol=credential['authentication_protocol'],
                           privKey=credential['encryption_password'],
                           privProtocol=credential['encryption_protocol'])

        # Define SNMPv3 parameters
        snmp_engine = SnmpEngine()
        target = UdpTransportTarget(
            ('target_host', credential['port']))  # Define SNMPv3 request
        oid = ObjectIdentity('SNMPv2-MIB', 'sysDescr', 0)
        get_req = getCmd(snmp_engine, user, target,
                         ContextData(), ObjectType(oid))
        # Try to establish SNMPv3 connection and retrieve response
        try:
            error_indication, error_status, error_index, var_binds = next(get_req)
            if error_indication:
                print(f'{ip_address} : {credential} : SNMP GET request failed: %s' %
                      error_indication, file=sys.stderr)
            elif error_status:
                print(f'{ip_address} : {credential} : SNMP GET request failed: %s at %s' % (
                    error_status.prettyPrint(),
                    error_index and var_binds[int(error_index) - 1][0] or '?'), file=sys.stderr)
            else:
                for varBind in var_binds:
                    print(' = '.join([x.prettyPrint()
                                      for x in varBind]), file=sys.stderr)

                try:
                    snmp_version = "Unknown"
                    for name in var_binds:
                        version = name.prettyPrint()
                        index = version.index(':')
                        snmp_version = version[0:index]
                except Exception:
                    snmp_version = 'Unresolved'

                return {'ip_address': ip_address, 'snmp_version': snmp_version,
                        'credential': credential}
        except Exception:
            print('SNMPv3 connection failed: %s')

    return None
