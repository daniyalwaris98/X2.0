from mac_vendor_lookup import AsyncMacLookup
import sys
import traceback
import nmap
async def get_vendor_information_by_mac_address(mac_address):
    try:
        mac = AsyncMacLookup()
        print("::::::::::::::::::::::mac in get vendor information::::::::::::",mac,file=sys.stderr)
        print("mac address information is::::::::::::::::::::::",await mac.lookup(mac_address),"::::::::::::::::::::::",file=sys.stderr)
    except Exception as e:
        traceback.print_exc()
        print("Error while getting the vendor information by mac address",str(e),file=sys.stderr)


def nmap_port_scanner_for_ip_address(ip_address):
    try:
        nm = nmap.PortScanner()
        # Use -sV for service/version info, -O for OS detection, and --osscan-guess to make a best guess about the OS
        nm.scan(ip_address, arguments='-sV -O --osscan-guess')

        for host in nm.all_hosts():
            print(f'Host : {host} ({nm[host].hostname()})',file=sys.stderr)
            print(f'State : {nm[host].state()}',file=sys.stderr)

            # OS and vendor information
            if 'osclass' in nm[host]:
                for osclass in nm[host]['osclass']:
                    print(f"OS Type: {osclass['osfamily']} {osclass['osgen']} ({osclass['type']})",file=sys.stderr)
                    if 'vendor' in osclass:
                        print(f"Vendor: {osclass['vendor']}",file=sys.stderr)

            # Device type
            if 'osmatch' in nm[host]:
                for osmatch in nm[host]['osmatch']:
                    print(f"Device Type: {osmatch['name']}",file=sys.stderr)

            # Protocol and service information
            for proto in nm[host].all_protocols():
                print(f'---------------------------------------',file=sys.stderr)
                print(f'Protocol : {proto}',file=sys.stderr)

                lport = nm[host][proto].keys()
                for port in lport:
                    print(f'port : {port}\tstate : {nm[host][proto][port]["state"]}',file=sys.stderr)
                    if 'name' in nm[host][proto][port]:
                        print(f'service: {nm[host][proto][port]["name"]}',file=sys.stderr)
                    if 'version' in nm[host][proto][port]:
                        print(f'version: {nm[host][proto][port]["version"]}',file=sys.stderr)
                    if 'product' in nm[host][proto][port]:
                        print(f'product: {nm[host][proto][port]["product"]}',file=sys.stderr)
    except Exception as e:
        traceback.print_exc()
        print(f"Error during Nmap scan: {e}")

