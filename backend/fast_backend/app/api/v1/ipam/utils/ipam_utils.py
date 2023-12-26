import traceback
from subprocess import Popen, PIPE
from netaddr import IPNetwork
from ipaddress import ip_network, ip_address
from ipaddress import ip_interface
from app.ipam_scripts.ipam import *
from app.ipam_scripts.f5 import *
from app.ipam_scripts.ipam_physical_mapping import *
from app.ipam_scripts.fortigate_vip import *
from app.api.v1.ipam.routes.device_routes import *
# from app.api.v1.ipam.ipam_import import *
# from app.api.v1.ipam.ipam_import import *

upIpsQueue = []
totalPingThreads = 200
totalDnsNameThreads = 200
totalDnsIpThreads = 200
totalPortScanThreads = 50
totalNmapScanningThreads = 200
startPort = 1
endPort = 200
# function for date on POST request
def FormatStringDate(date):
    print(date, file=sys.stderr)

    try:
        if date is not None:
            if '-' in date:
                result = datetime.strptime(date, '%d-%m-%Y')
            elif '/' in date:
                result = datetime.strptime(date, '%d/%m/%Y')
            else:
                print("incorrect date format", file=sys.stderr)
                result = datetime(2000, 1, 1)
        else:
            # result = datetime(2000, 1, 1)
            result = datetime(2000, 1, 1)
    except:
        result = datetime(2000, 1, 1)
        print("date format exception", file=sys.stderr)

    return result


# API for date format for GET methods
def FormatDate(date):
    # print(date, addIosTrackerfile=sys.stderr)
    if date is not None:
        result = date.strftime('%d-%m-%Y')
    else:
        # result = datetime(2000, 1, 1)
        result = datetime(1, 1, 2000)

    return result



def ping(ip, subnet_obj_lst):
    print(f"PINGING the IP {ip}", file=sys.stderr)

    objDict = {}
    # ip = ipaddress.IPv4Address(ip)
    ips = str(ip)
    print("ip in ping is>>>>>>>>>", ips, file=sys.stderr)
    # {ping} main cmd to execute {-c} the no of argument to send {shell}is usd to execute in a shell
    # Popen is usd to execute a command
    hostup = Popen(["ping", '-c', '1', ips], stdout=PIPE, shell=True)  # ,shell=True
    print("host up is>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", hostup, file=sys.stderr)
    # it interacts with the subprocess and returns the first element
    output = hostup.communicate()[0]
    print("output is>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", output, file=sys.stderr)
    val1 = hostup.returncode
    if val1 == 0:
        print(ip, "is pinging", file=sys.stderr)
        objDict['ip_address'] = ip
        objDict['status'] = 'Used'
    else:
        print(ip, "is not responding", file=sys.stderr)
        objDict['ip_address'] = ip
        objDict['status'] = 'Unused'
    subnet_obj_lst.append(objDict)


def FetchIpamDevices(atom):
    try:
        print("atom in fetch ipam devices is:::::::::::::::",atom,file=sys.stderr)
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print("Current time format is:", current_time, file=sys.stderr)
        atom_devices = configs.db.query(AtomTable) \
            .join(PasswordGroupTable, AtomTable.password_group_id == PasswordGroupTable.password_group_id) \
            .filter(AtomTable.atom_id == atom).all()
        ipam_lst = []
        # print("ipam devices are::::::::::::::::::::::",ipam_devices,file=sys.stderr)
        ipam_dict = {}
        # Iterate over IPAM devices
        for atom in atom_devices:
            # print("ipam is::::::::::::::::::::::::::::::::::::::::::::",ipam,file=sys.stderr)
            ipam_dict = {
                "atom_id":atom.atom_id,
                "ip_address": atom.ip_address,
                "device_type": atom.device_type,
                "device_name": atom.device_name,
                "time": current_time
            }
            # print("ipam dict is::::::::::::::::::::::::::::::::::::::::::",ipam_dict,file=sys.stderr)
            password_gp = atom.password_group_id
            print("password group exsist is:::::::::::::::::::",password_gp,file=sys.stderr)
            pwd_group_exsist = configs.db.query(PasswordGroupTable).filter_by(password_group_id=password_gp).first()
            print("password_group is:::::::::::::::::::::::",pwd_group_exsist,file=sys.stderr)
            ipam_dict['username'] = pwd_group_exsist.username
            ipam_dict['password'] = pwd_group_exsist.password

            ipam_lst.append(ipam_dict)
        # print("ipamlist is::::::::::::::::::::::::::::::::::::::::",ipam_lst,file=sys.stderr)

        atom = AtomTable()
        f5_lst = []
        fortinet_lst = []

        # Iterate over IPAM devices for F5 Load Balancer
        for data in configs.db.query(AtomTable).filter_by(device_type='f5_ltm').all():
            print("data for f5 load balancer is:::::::::",data,file=sys.stderr)
            ipam_f5_dict = {
                "ip_address": data.ip_address,
                "device_type": data.device_type,
                "device_name": data.device_name,
                "time": current_time
            }

            if data:
                pwd_group_query = configs.db.query(PasswordGroupTable).filter_by(
                    password_group_id=data.password_group_id).first()
                ipam_f5_dict['username'] = pwd_group_query.username
                ipam_f5_dict['password'] = pwd_group_query.password

            # if data.source == "Devices":
            #     pwd_grp_dev = configs.db.query(PasswordGroupTable).filter_by(
            #         password_group_id=atom.password_group_id).first()
            #     ipam_f5_dict['username'] = pwd_grp_dev.username
            #     ipam_f5_dict['password'] = pwd_grp_dev.password

            f5_lst.append(ipam_f5_dict)

        # Iterate over IPAM devices for Fortinet VIP
        for data in configs.db.query(AtomTable).filter_by(device_type='fortinet').all():
            print("data is in fortinet vip is::::::::::::::",data,file=sys.stderr)
            fortinet_dict = {
                "ip_address": data.ip_address,
                "device_type": data.device_type,
                "device_name": data.device_name,
                "time": current_time
            }

            if data:
                query1 = configs.db.query(PasswordGroupTable).filter_by(password_group_id=data.password_group_id).first()
                fortinet_dict['username'] = query1.username
                fortinet_dict['password'] = query1.password

            # if data.source == 'Devices':
            #     query2 = configs.db.query(PasswordGroupTable).filter_by(
            #         password_group_id=atom.password_group_id).first()
            #     fortinet_dict['username'] = query2.username
            #     fortinet_dict['password'] = query2.password

            fortinet_lst.append(fortinet_dict)

        try:
            print("IPAM is being xecuted::::::::::::::::::::::::::::::::::",file=sys.stderr)
            print("IPAM dict is:::::::::::::::::::::",ipam_dict,file=sys.stderr)
            ipam_data = [ipam_dict]
            print("ipam data in fetch ipam devices is::::::::",ipam_data,file=sys.stderr)
            # IPAM(host,ipam_data)
            ipam_instance = IPAM()
            ipam_instance.addInventoryToDB(ipam_dict, ipam_data)
            ipam_instance.poll(ipam_dict)
            print("ipam ended execution:::::::::::::::::::::::::::::::::",file=sys.stderr)

        except Exception as e:
            traceback.print_exc()
            print("Error occurred in IPAM:", file=sys.stderr)
            return {"Response": "Error Occurred In IPAM"}

        try:

            # f5 = F5()
            # host = ipam_dict
            # f5Data = f5_lst
            # f5.addInventoryToDB(host, f5Data)
            # f5.poll(host)
            print("f5 is ended executed:::::::::::::::::::::::::::", f5, file=sys.stderr)
        except Exception as e:
            traceback.print_exc()
            print("Exception Occured in F5")

        try:
            fortigate = FORTIGATEVIP()
        except Exception as e:
            traceback.print_exc()
            print("Error Occured In Fortigate VIP")

        return {
            "ipam_devices": ipam_lst,
            "f5_devices": f5_lst,
            "fortinet_devices": fortinet_lst
        }

    except Exception as e:
        traceback.print_exc()
        return {"Response": "Error Occurred while Fetching IPAM Devices"}


# def Class_obj():
#     try:
#         classes_obj = 
#     except Exception as e:
#         traceback.print_exc()


def is_valid_ipv4_subnet(subnet):
    try:
        # Convert subnet to a string if it's not already in string format
        subnet_str = str(subnet)

        # Regular expression to validate IPv4 CIDR notation
        ipv4_subnet_regex = r'^(\d{1,3}\.){3}\d{1,3}/(3[0-2]|[1-2][0-9]|[0-9])$'
        return bool(re.match(ipv4_subnet_regex, subnet_str))
    except Exception as e:
        print(f"Error in validating subnet: {e}")
        return False


def GetIps(subnet_data):
    ips = []
    try:
        # Access the subnet information from the AddSubnetInSubnetSchema object
        subnet = subnet_data.subnet

        # Print the type and value of the subnet variable for debugging
        print(f"Type of subnet: {type(subnet)}")
        print(f"Value of subnet: {subnet}")

        if isinstance(subnet, str):
            # Call the is_valid_ipv4_subnet function if the subnet is a string
            if is_valid_ipv4_subnet(subnet):
                network = ip_network(subnet)
                for ip in network.hosts():
                    ips.append(str(ip))
                return ips
            else:
                print(f"{subnet} is not a valid IPv4 subnet")
                return ips
        else:
            print(f"{subnet} is not a string")
            return ips
    except ValueError:
        traceback.print_exc()
        print(f"{subnet} is not a valid IPv4 subnet")
        return ips
def DnsName(ip):
    try:
        data = ""
        try:
            data = str(socket.gethostbyaddr(ip))
        except Exception as e:
            data = 'Not Found'
            traceback.print_exc()

        if data != 'Not Found':
            try:
                ip_tab = IP_TABLE()
                ip_query = configs.db.query(IP_TABLE).filter_by(ip_address=ip).first()
                if ip_query:
                    ip_tab.dns_to_ip = data
                UpdateDBData(ip_tab)
                print("Inserted succesfully DNS name against th ip", file=sys.stderr)


            except Exception as e:
                traceback.print_exc()
        elif data == "Not Found":
            ip_query = configs.db.query(IP_TABLE).filter_by(ip_address=ip).first()
            if ip_query:
                ip_tab.dns_to_ip = data
            UpdateDBData(ip_tab)
    except Exception as e:
        traceback.print_exc()
        print("error occured while addingdns name", file=sys.stderr)


def DnsIP(ip):
    try:
        data = ""
        try:
            result = socket.gethostbyaddr(ip)
            data = list(result)[0]
            print("data is found against::::::::::::::::::::::::", data, file=sys.stderr)
        except Exception as e:
            traceback.print_exc()

            if data:
                if data != 'Not Found':
                    try:
                        ip_tab = IP_TABLE()
                        ip_query = configs.db.query(IP_TABLE).filter_by(ip_address=ip).first()
                        if ip_query:
                            ip_tab.dns_to_ip = data
                        UpdateDBData(ip_tab)
                        print("Inserted succesfully DNS name against th ip", file=sys.stderr)


                    except Exception as e:
                        traceback.print_exc()
                elif data == "Not Found":
                    ip_query = configs.db.query(IP_TABLE).filter_by(ip_address=ip).first()
                    if ip_query:
                        ip_tab.dns_to_ip = data
            UpdateDBData(ip_tab)

    except Exception as e:
        traceback.print_exc()
        print("error occured while updating dnsip")


def nmapPortScanning(ip, port):
    print(f"Scanning POrt {port} of IP {ip}:::::::", file=sys.stderr)
    try:
        scanner = nmap.PortScanner()
        print("nmap port scanning is>>>>>", scanner, file=sys.stderr)
        res = scanner.scan(ip, str(port))
        res = res['scan'][ip]['tcp'][port]['state']
        ip_tab = IP_TABLE()
        if res == 'open':
            new_port = ""
            ip_query = configs.db.query(IP_TABLE).filter_by(ip_address=ip).all()
            for ips in ip_query:
                print("ips is>>>>>>>>>.", ips, file=sys.stderr)
                old_ports = ips.open_ports
                if old_ports:
                    new_port = str(old_ports) + ", " + str(port)
                else:
                    new_port = port

                ips.open_ports = new_port
            UpdateDBData(ip_tab)
            print(f"New Portss {new_port}::::::::::::", file=sys.stderr)
    except Exception as e:
        traceback.print_exc()


def PortScanner(target):
    print(f"Scanning Ports for IP {target}", file=sys.stderr)
    try:
        open_ports = ""
        begin = startPort
        end = endPort
        threads = []
        for i in range(begin, end + 1):
            th = threading.Thread(target=nmapPortScanning, args=(target, i,))
            th.start()
            threads.append(th)
            if len(threads) == totalNmapScanningThreads:
                for t in threads:
                    t.join()
                threads = []

        else:
            for t in threads:  # if request is less than connections_limit then join the threads and then return data
                t.join()
            # print(f"Scanning Port {i} of IP {target}", file=sys.stderr)
            # scanner = nmap.PortScanner()
            # res = scanner.scan(target,str(i))
            # res = res['scan'][target]['tcp'][i]['state']

            # if res=='open':
            #     print(i, file=sys.stderr)
            # open_ports+=str(i)+","

        # if "," in open_ports:
        #     open_ports = open_ports[0:-1]

        # ExecuteDBQuery(f"update ip_table set open_ports='{open_ports}' where IP_ADDRESS='{target}';")
        # print(f"OPEN PORTS ARE ADDED SUCCESSFULLY FOR {open_ports}",file=sys.stderr)

    except Exception as e:
        print(f"Exceptin Occured in Port Scanning {e}", file=sys.stderr)


def scanPorts(subnet):
    threads = []
    ip_query = configs.db.query(IP_TABLE).filter_by(subnet=subnet,
                                                    status='Used'
                                                    ).all()
    for ips in ip_query:
        print("ips are>>>>>>>>>>>>>>", ips, file=sys.stderr)
        ip = ips.ip_address
        PortScanner(ip)


# def GetIps(subnet):
#     ips = []
#     try:
#         network = ip_network(subnet)
#         for ip in network.hosts():
#             ips.append(str(ip))
#         return ips
#     except Exception as e:
#         traceback.print_exc()
#         print(e)
#         return ips


def sizeCalculator(subnet):
    subnetCdrs = {'/32': 1, '/31': 2, '/30': 2, '/29': 6, '28/': 14, '/27': 30, '/26': 62, '/25': 126, '/24': 254,
                  '/23': 510, '/22': 1022, '/21': 2046, '/20': 4094, '/19': 8190, '/18': 16382, '/17': 32766,
                  '/16': 65534, '/15': 131070, '/14': 262142, '/13': 524286, '/12': 1048574, '/11': 2097150,
                  '/10': 4194302, '/9': 8388606, '/8': 16777214, '/7': 33554430, '/6': 67108862, '/5': 134217726,
                  '/4': 268435454, '/3': 536870910, '/2': 1073741822, '/1': 2147483646, '/0': 4294967294}
    temp_size = 0
    for subnetCdr in subnetCdrs:
        if subnet[-3:] == subnetCdr or subnet[-2:] == subnetCdr:
            temp_size = subnetCdrs[subnetCdr]
    return temp_size


def SubnetMaskCalculator(subnet):
    net = ipaddress.ip_network(subnet, strict=False)
    return str(net.netmask)


def UpIps(subnet):
    availabe_ips = []
    nm = nmap.PortScanner()
    nm.scan(hosts=subnet, arguments='-n -sP')
    hosts_list = [(x, nm[x]['status']['state']) for x in nm.all_hosts()]
    print(f"Host List is {hosts_list}", file=sys.stderr)
    count = 0
    for host, status in hosts_list:
        if status == 'up':
            print(host + ' ' + status, file=sys.stderr)
            count += 1
            availabe_ips.append(host)
    return availabe_ips


def PingTest(host, subnet):
    global upIpsQueue
    try:
        parameter = '-n' if platform.system().lower() == 'windows' else '-c'
        command = ['ping', parameter, '3', host]
        response = subprocess.call(command)
        if response == 0:
            upIpsQueue.append(host)
            time = datetime.now()
            IpTable = IP_TABLE()
            ip_history = IP_HISTORY_TABLE()
            ip_query = configs.db.query(IP_TABLE).filter_by(ip_address=host, subnet=subnet).first()
            if ip_query:
                IpTable.status = 'Used'
                IpTable.status_history = 'UP'
                IpTable.last_used = time
                # inerting ip history tbale

                ip_history.ip_address = host
                ip_history.status = 'Used'
                ip_history.date = time
            UpdateDBData(IpTable)
            print("ip table updated", file=sys.stderr)
            InsertDBData(ip_history)
            print("data inserted to the IP history table::", file=sys.stderr)
        else:
            ip_query = configs.db.query(IP_TABLE).filter_by(ip_address=host, subnet=subnet).first()
            if ip_query:
                IpTable.status = 'Available'
                # IpTable.status_history = 'UP'
                IpTable.last_used = time
                # inerting ip history tbale

                ip_history.ip_address = host
                ip_history.status = 'Available'
                ip_history.date = time
            UpdateDBData(IpTable)
            print("ip table updated", file=sys.stderr)
            InsertDBData(ip_history)
            print("data inserted to the IP history table::", file=sys.stderr)

    except Exception as e:
        traceback.print_exc()


def CheckUpIps(subnet):
    upCount = 0
    upIpsList = []
    ips = GetIps(subnet)
    '''
    for ip in ips:
        status=PingTest(str(ip))
        if status:
            upCount+=1
            upIpsList.append(ip)
            ExecuteDBQuery(f"update ip_table set STATUS='Used' where IP_ADDRESS='{ip}' and SUBNET='{subnet}';")

            usage =UsageCalculator(len(upIpsList),sizeCalculator(subnet))
            ExecuteDBQuery(f"update subnet_display_table set `usage`='{usage}' where subnet_address='{subnet}';")
        else:
            ExecuteDBQuery(f"update ip_table set STATUS='Available' where IP_ADDRESS='{ip}' and SUBNET='{subnet}';")    

    '''
    threads = []
    global upIpsQueue
    upIpsQueue = []

    for ip in ips:
        th = threading.Thread(target=PingTest, args=(str(ip), subnet,))
        th.start()
        threads.append(th)
        if len(threads) == CheckUpIps:
            for t in threads:
                t.join()
            threads = []

    else:
        for t in threads:  # if request is less than connections_limit then join the threads and then return data
            t.join()
        # return upIpsList
    upIpsList = upIpsQueue.copy()

    return upIpsQueue


def UsageCalculator(available_ips, total_ips):
    # count = 20
    if total_ips == 0:
        total_ips = 1
    usage = f"{round(available_ips / (total_ips) * 100, 2)}"
    return usage


def calculateDnsIp(subnet):
    try:
        threads = []
        ip_query = configs.db.query(IP_TABLE).filter_by(status='Used', subnet=subnet).all()
        for row in ip_query:
            print("row is>>>>>>>>>>", row, file=sys.stderr)
            ip = row.ip_address
            th = threading.Threads(target=DnsIP, args=(ip))
            th.start()
            threads.append(th)
            if len(threads) == totalDnsIpThreads:
                for thread in threads:
                    thread.join()
                threads = []
            else:
                for thread in threads:
                    thread.join()
    except Exception as e:
        traceback.print_exc()


def getPhysicalMapping(subnet_list):
    try:
        threads = []
        physical_mapping = IPAMPM()
        for subnet in subnet_list:
            hosts = []
            result1 = configs.db.query(IPAM_DEVICES_FETCH_TABLE).filter_by(subnet=subnet).all()
            for row in result1:
                print('row is>>>>>>>', row, file=sys.stderr)
                device_name = row.device_name
                if device_name:
                    ip_address = password_group = device_type = user_name = password = ""
                    result2 = configs.db.query(AtomTable).filter_by(ip_address=ip_address).first()
                    password_group = result2.password_group_id
                    device_type = row.device_type
                    if password_group:
                        result4 = configs.db.query(PasswordGroupTable).filter_by(
                            password_group_id=password_group).first()
                        user_name = result4.username
                        passowrd = result4.password

                    host = {
                        "ip_address": ip_address,
                        "user": user_name,
                        "pwd": passowrd,
                        "sw_type": device_type,
                        "device_name": device_name
                    }
                    hosts.append(host)
                    print(f"Host is {host}:::::", file=sys.stderr)
        physical_mapping.get_inventory_data(hosts)


    except Exception as e:
        traceback.print_exc()


def MultiPurpose(options):
    try:
        size = 0
        total_up_ips = 0
        subnett = ''
        print("scheduler started::::::::::::::::::", file=sys.stderr)
        subnet_display = SUBNET_DISPLAY_TABLE()
        ip_data = IP_TABLE()

        print("subnet waiting is>>>>>>>>>>", subnet_waiting, file=sys.stderr)
        subnet_lst = []
        for subnets in subnet_waiting:
            print("subnets in subnet waiting is::::::::::", subnets, file=sys.stderr)
            try:
                subnet_lst.append(subnets.subnet_address)
            except Exception as e:
                traceback.print_exc()
        print("subnet list is:::::::::::::::::::::", subnet_lst, file=sys.stderr)

        for subnet in subnet_lst:
            print("subnet is:::::::::::::::::::::::", subnet, file=sys.stderr)
            get_subnet = configs.db.query(SUBNET_DISPLAY_TABLE).filter_by(subnet_address=subnet).all()
            get_subnet_scan = configs.db.query(SUBNET_DISPLAY_TABLE).filter_by(subnet_address=subnet,
                                                                               status='Scanning').all()
            subnet_waiting = configs.db.query(SUBNET_DISPLAY_TABLE).filter_by(status='Waiting').all()
            try:
                subnett = subnet
                try:

                    size = sizeCalculator(subnet)
                    try:
                        for subnt in get_subnet:
                            if get_subnet:
                                subnt.status = 'Scanning'
                                subnt.size = size
                                UpdateDBData(subnet_display)
                                print("Subnet Display Table Updated Successfully::::::", file=sys.stderr)
                            else:
                                print("No subnet found in subnet display table:::::", file=sys.stderr)
                    except Exception as e:
                        for subnetscan in get_subnet_scan:
                            subnetscan.status = 'Failed'
                        UpdateDBData(get_subnet_scan)
                        traceback.print_exc()
                except Exception as e:
                    traceback.print()
                for subnet in subnet_lst:
                    print("Getting IP Adress::::::::::::::::::", file=sys.stderr)
                    try:
                        ips = GetIps(subnet)
                        date = datetime.now()
                        for ip in ips:
                            ipExists = False
                            get_ip = configs.db.query(IP_TABLE).filter_by(ip_address=ip, subnet=subnet).all()
                            for row in get_ip:
                                if ip == row.ip_address:
                                    ipExists = True
                            if ipExists:
                                print("IP Exsist::::::", file=sys.stderr)
                            else:
                                for row in get_ip:
                                    row.ip_address = ip
                                    row.subnet = subnet
                        InsertDBData(ip_data)
                        print("data inserted to ip tabl::::::", file=sys.stderr)
                    except Exception as e:
                        for row in get_subnet_scan:
                            print("row is::::::::::::", row, file=sys.stderr)
                            row.staus = 'Failed'
                            row.scan_date = datetime.now()
                        UpdateDBData(get_subnet_scan)
                        traceback.print_exc()

                    print("Finished Getting IP Address:::::::::::::", file=sys.stderr)
                    for subnet in subnet_lst:
                        print("Calculating Usage::::::::::::::::::::", file=sys.stderr)
                        try:
                            upIpsList = CheckUpIps(subnet)
                            usage = UsageCalculator(len(upIpsList), sizeCalculator(subnet))
                            for row in get_subnet:
                                print("row in get subnet is:::::::", file=sys.stderr)
                                row.usage = usage
                                print(f"Usage {row.usage} Upaded successfuly for subnet {subnet}:::", file=sys.stderr)
                            UpdateDBData(subnet_display)
                        except Exception as e:
                            for row in get_subnet_scan:
                                print("row is::::::::::::", row, file=sys.stderr)
                                row.staus = 'Failed'
                                row.scan_date = datetime.now()
                            UpdateDBData(get_subnet_scan)
                            traceback.print_exc()

                    print("Populating F5 VIP:::::::::::::::::::", file=sys.stderr)

                    for subnet in subnet_lst:
                        try:
                            ip_result = configs.db.query(IP_TABLE).filter_by(subnet).all()
                            for ips in ip_result:
                                try:
                                    ip = row.ip_address
                                    f5_ip = configs.db.query(f5).filter_by(node=ip).all()
                                    vip = ""
                                    for row in f5_ip:
                                        vip = row.vip
                                    ip_dat = configs.db.query(IP_TABLE).filet(ip_address=ip).all()
                                    for ips in ip_dat:
                                        ips.vip = vip
                                    UpdateDBData(ip_data)
                                except Exception as e:
                                    traceback.print_exc()
                        except Exception as e:
                            traceback.print_exc()
                    print("populating firewall in VIP:::::::::", file=sys.stderr)

                    for subnet in subnet_lst:
                        try:
                            ip_result = configs.db.query(IP_TABLE).filter_by(subnet).all()
                            for ips in ip_result:
                                try:
                                    ip = row.ip_address
                                    f5_ip = configs.db.query(firewall_vip).filter_by(internal_ip=ip).all()
                                    vip = ""
                                    for row in f5_ip:
                                        vip = row.vip
                                    ip_dat = configs.db.query(IP_TABLE).filet(ip_address=ip).all()
                                    for ips in ip_dat:
                                        ips.vip = vip
                                    UpdateDBData(ip_data)
                                except Exception as e:
                                    traceback.print_exc()
                        except Exception as e:
                            traceback.print_exc()

                    if "DNS Scan" in options:
                        for subnet in subnet_lst:
                            print("Resolving Host IP::::::::::::::::", file=sys.stderr)
                            try:
                                calculateDnsIp(subnet)
                            except Exception as e:
                                traceback.print_exc()

                        print("Finished Resolving Host IP::::::::", file=sys.stderr)
                    try:
                        print("getting pyhsical maaping::::::::::", file=sys.stderr)
                        getPhysicalMapping(subnet_lst)
                    except Exception as e:
                        traceback.print_exc()

                    print("Finished Getting Physical Mapping::::::::", file=sys.stderr)

                    scanPorts(subnet)
                    get_subntt_scan = configs.db.query(SUBNET_DISPLAY_TABLE).filter_by(subnet_address=subnett).all()
                    for subnet in get_subntt_scan:
                        subnet.status = 'Scanned'
                        subnet.scan_date = datetime.now()
                    UpdateDBData(subnet_display)
            except Exception as e:
                subnet_scanned_stat = configs.db.query(SUBNET_DATA_TABLE).filter_by(subnet_address=subnet,
                                                                                    status='Scanning').all()
                for row in subnet_scanned_stat:
                    row.status = 'Failed'
                    row.scan_date = datetime.now()
                UpdateDBData(subnet_display)
                traceback.print_exc()
    except Exception as e:

        traceback.print_exc()

# def FetchIpamDevices():
#     try:
#         current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#         print("current time format is>>>>", current_time, file=sys.stderr)
#         ipam_devices = configs.db.query(IPAM_DEVICES_TABLE) \
#         .join(PasswordGroupTable, IPAM_DEVICES_TABLE.password_group == PasswordGroupTable.password_group) \
#         .all()
#         ipam_lst = []
#         for ipam in ipam_devices:
#             ipam_dict = {
#                 "ip_address": ipam.ip_address,
#                 "device_type": ipam.device_type,
#                 "device_name": ipam.device_name
#             }
#             print("ipam is:::::::::::::::::::::::::::::::::::",ipam,file=sys.stderr)
#                 # Access password group information from the related object
#             ipam_dict['username'] = ipam.password_group.username
#             ipam_dict['password'] = ipam.password_group.password

#             ipam_lst.append(ipam_dict)
#         print("ipam lst after joining is::::::::::::::::::::::::",ipam_lst,file=sys.stderr) 

#         atom = AtomTable()

#         for ipam in ipam_devices:
#             print("ipam in fetch ipam devices is>>>>>", ipam, file=sys.stderr)
#             ipam_dict = {
#                 "ip_address": ipam.ip_address,
#                 "device_type": ipam.device_type,
#                 "device_name": ipam.device_name
#             }
#             print("ipam.password group is::::::::::::::::",ipam.password_group,file=sys.stderr)
#             if ipam.source == 'Atom' or ipam.source == 'Static':
#                 pwd_group = configs.db.query(PasswordGroupTable).filter_by(password_group=ipam.password_group).first()
#                 print("password group in Fetch Ipam devices is>>>>>", pwd_group, file=sys.stderr)
#                 ipam_dict['username'] = pwd_group.username
#                 ipam_dict['password'] = pwd_group.password

#             if ipam.source == 'Device':
#                 pwd_group_devices = configs.db.query(PasswordGroupTable).filter_by(
#                     password_group_id=atom.password_group_id).first()
#                 print("query string is>>>>>>>>>>>>>>>>>>>>", pwd_group_devices, file=sys.stderr)
#                 ipam_dict['username'] = pwd_group_devices.username
#                 ipam_dict['password'] = pwd_group_devices.password

#             ipam_lst.append(ipam_dict)
#         print("ipam list is>>>>>>>>>>>>", ipam_lst, file=sys.stderr)

#         ######## F5 Load Balancer #######################3
#         f5_lst = []
#         f5_query = configs.db.query(IPAM_DEVICES_TABLE).filter_by(device_type='f5_ltm').all()
#         print("f5 query is>>>>>>>>>>>>>>>>>>>>", f5_query, file=sys.stderr)
#         for data in f5_query:
#             print("data>>>>>>>>>>>>>>>>>>>>>>>", data, file=sys.stderr)
#             ipam_f5_dict = {
#                 "ip_address": data.ip_address,
#                 "device_type": data.device_type,
#                 "device_name": data.device_name,
#                 "time": current_time
#             }
#             if data.source == 'Atom' or data.source == 'Static':
#                 pwd_group_query = configs.db.query(PasswordGroupTable).filter_by(
#                     password_group=data.password_group).first()
#                 ipam_f5_dict['username'] = pwd_group_query.username
#                 ipam_f5_dict['password'] = pwd_group_query.pasword

#             if data.source == "Device":
#                 pwd_grp_dev = configs.db.query(PasswordGroupTable).filter_by(
#                     password_group_id=atom.password_group_id).first()
#                 print("password group devices for f5 is>>>>", pwd_grp_dev, file=sys.stderr)
#                 ipam_f5_dict['username'] = pwd_grp_dev.username
#                 ipam_f5_dict['password'] = pwd_grp_dev.password
#             f5_lst.append(ipam_f5_dict)
#         print("f5 list is>>>>>>>>>>>>>>>>>>", f5_lst, file=sys.stderr)

#         ################## Firtinet VIP #######################################
#         fortinet_lst = []
#         fortinet_query = configs.db.query(IPAM_DEVICES_TABLE).filter_by(device_type='fortinet').all()
#         print("fortinet query is>>>>>>>>>>>>>>>>>>>>>>", fortinet_query, file=sys.stderr)
#         for data in fortinet_query:
#             fortinet_dict = {
#                 "ip_address": data.ip_address,
#                 "device_type": data.device_type,
#                 "device_name": data.device_name,
#                 "time": current_time
#             }

#             if data.source == 'Atom' or data.source == 'Static':
#                 query1 = configs.db.query(PasswordGroupTable).filter_by(password_group=data.password_group).first()
#                 fortinet_dict['username'] = query1.username
#                 fortinet_dict['password'] = query1.password

#             if data.source == 'Devices':
#                 query2 = configs.db.query(PasswordGroupTable).filter_by(
#                     password_group_id=atom.password_group_id).first()
#                 print("query2 is>>>>>>>>>>>>>>>>>>>>", query2, file=sys.stderr)
#                 fortinet_dict['username'] = query2.username
#                 fortinet_dict['passwprd'] = query2.password

#             fortinet_lst.append(fortinet_dict)

#         try:
#             ipam = IPAM()
#         except Exception as e:
#             traceback.print_exc()
#             print("Error Ocrred In Ipam:::::::::",file=sys.stderr)
#             return {"Reponse":"Error Occured In IPAM"}


#     except Exception as e:
#         traceback.print_exc()
#         return {"Repsonse": "Error Occured while Fetching IPAM Devcies"}
def is_valid_ipv4_subnet(subnet):
    # Regular expression to validate IPv4 CIDR notation
    ipv4_subnet_regex = r'^(\d{1,3}\.){3}\d{1,3}/(3[0-2]|[1-2][0-9]|[0-9])$'
    return bool(re.match(ipv4_subnet_regex, subnet))

subnet_input = '192.168.0.5/24'
is_valid = is_valid_ipv4_subnet(subnet_input)

if is_valid:
    print(f"{subnet_input} is a valid IPv4 subnet.",file=sys.stderr)
else:
    print(f"{subnet_input} is NOT a valid IPv4 subnet.",file=sys.stderr)