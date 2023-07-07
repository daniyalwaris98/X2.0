from app.monitoring.common_utils.utils import *

cisco_ios_xe_oids = {
    'uptime': '1.3.6.1.6.3.10.2.1.3',
    'cpu_utilization': '1.3.6.1.4.1.9.2.1.56',
    'memory_free': '1.3.6.1.4.1.9.9.48.1.1.1.6',
    'memory_used': '1.3.6.1.4.1.9.9.48.1.1.1.5',
    'device_description': '1.3.6.1.2.1.1.1',
    'device_name': '1.3.6.1.2.1.1.5',
    'interfaces': '1.3.6.1.2.1.31.1.1.1.1',
    'download': '1.3.6.1.2.1.2.2.1.10',
    'upload': '1.3.6.1.2.1.2.2.1.16',
    'interface_status': '1.3.6.1.2.1.2.2.1.7',
    'interface_description': '1.3.6.1.2.1.2.2.1.2'
}

cisco_ios_oids = {
    'uptime': '1.3.6.1.6.3.10.2.1.3',
    'cpu_utilization': '1.3.6.1.4.1.9.2.1.56',
    'memory_free': '1.3.6.1.4.1.9.9.48.1.1.1.6',
    'memory_used': '1.3.6.1.4.1.9.9.48.1.1.1.5',
    'device_description': '1.3.6.1.2.1.1.1',
    'device_name': '1.3.6.1.2.1.1.5',
    'interfaces': '1.3.6.1.2.1.31.1.1.1.1',
    'download': '1.3.6.1.2.1.2.2.1.10',
    'upload': '1.3.6.1.2.1.2.2.1.16',
    'interface_status': '1.3.6.1.2.1.2.2.1.7',
    'interface_description': '1.3.6.1.2.1.2.2.1.2'
}


cisco_ios_xr_oids = {
    'uptime': '1.3.6.1.6.3.10.2.1.3',
    'cpu_utilization': '1.3.6.1.4.1.9.2.1.56',
    'memory_used': '1.3.6.1.4.1.9.9.48.1.1.1.5',
    'memory_free': '1.3.6.1.4.1.9.9.48.1.1.1.6',
    'device_description': '1.3.6.1.2.1.1.1',
    'device_name': '1.3.6.1.2.1.1.5',
    'interfaces': '1.3.6.1.2.1.31.1.1.1.1',
    'download': '1.3.6.1.4.1.9.2.2.1.1.6',
    'upload': '1.3.6.1.4.1.9.2.2.1.1.8',
    'interface_status': '1.3.6.1.2.1.2.2.1.7',
    'interface_description': '1.3.6.1.2.1.2.2.1.2'
}


cisco_asa_oids = {
    'uptime': '1.3.6.1.2.1.1.3',
    'cpu_utilization': '1.3.6.1.4.1.9.9.109.1.1.1.1.2.2',
    'memory_used': '1.3.6.1.4.1.9.9.48.1.1.1.5',
    'memory_free': '1.3.6.1.4.1.9.9.48.1.1.1.6',
    'device_description': '1.3.6.1.2.1.1.1',
    'device_name': '1.3.6.1.2.1.1.5',
    'interfaces': '1.3.6.1.2.1.31.1.1.1.1',
    'download': '1.3.6.1.2.1.2.2.1.10',
    'upload': '1.3.6.1.2.1.2.2.1.11',
    'interface_status': '1.3.6.1.2.1.2.2.1.7',
    'interface_description': '1.3.6.1.2.1.2.2.1.2'
}


cisco_wlc_oids = {
    'uptime': '1.3.6.1.2.1.1.3.0',
    'cpu_utilization': '1.3.6.1.4.1.14179.1.1.5.1',
    'memory': '1.3.6.1.4.1.9.9.618.1.8.6',
    'device_description': '1.3.6.1.2.1.1.1',
    'device_name': '1.3.6.1.2.1.1.5',
    'interfaces': '1.3.6.1.2.1.2.2.1.2',
    'interface_status': '1.3.6.1.2.1.2.2.1.7',
    'interface_description': '1.3.6.1.2.1.2.2.1.2',
    'download': '1.3.6.1.2.1.2.2.1.10',
    'upload': '1.3.6.1.2.1.2.2.1.16',
}


fortinet_oids = {
    'uptime': '1.3.6.1.2.1.1.3',
    'cpu_utilization': '1.3.6.1.4.1.12356.101.4.1.3',
    'memory': '1.3.6.1.4.1.12356.101.4.1.4',
    'device_description': '1.3.6.1.2.1.1.1',
    'device_name': '1.3.6.1.2.1.1.5',
    'interfaces': '1.3.6.1.2.1.2.2.1.2',
    'interfacec_status': '1.3.6.1.2.1.2.2.1.8',
    'download': '1.3.6.1.2.1.2.2.1.10',
    'upload': '1.3.6.1.2.1.2.2.1.16',
    'interface_status': '1.3.6.1.2.1.2.2.1.7',
    'interface_description': '1.3.6.1.2.1.2.2.1.2'
}


windows_oids = {
    'uptime': '1.3.6.1.2.1.1.3.0',
    'cpu_utilization': '1.3.6.1.2.1.25.3.3.1.2',
    'memory_total': '1.3.6.1.2.1.25.2.3.1.5',
    'memory_used': '1.3.6.1.2.1.25.2.3.1.6',
    'device_description': '1.3.6.1.2.1.1.1',
    'device_name': '1.3.6.1.2.1.1.5',
    'interfaces': '1.3.6.1.2.1.31.1.1.1.1',
    'interface_status': '1.3.6.1.2.1.2.2.1.8',
    'interface_description': '1.3.6.1.2.1.2.2.1.2',
    'download': '1.3.6.1.2.1.2.2.1.10',
    'upload': '1.3.6.1.2.1.2.2.1.11',
}

juniper_oids = {
    'uptime':'1.3.6.1.4.1.2636.3.1.5',
    'cpu_utilization':'1.3.6.1.4.1.2636.3.1.13.1.8.9.1',
    'memory': '1.3.6.1.4.1.2636.3.1.13.1.11.9',
    'device_description':'1.3.6.1.2.1.1.1',
    'device_name':'1.3.6.1.2.1.1.5',
    'interfaces':'1.3.6.1.2.1.31.1.1.1.1',
    'interface_status':'1.3.6.1.2.1.2.2.1.7',
    'interface_description':'1.3.6.1.2.1.2.2.1.2',
    'download':'1.3.6.1.4.1.2636.3.3.1.1.1',
    'upload': '1.3.6.1.4.1.2636.3.3.1.1.4',
}


palo_oids = {
    'uptime':'1.3.6.1.2.1.25.1.1.0',
    'cpu_utilization':'1.3.6.1.2.1.25.3.3.1.2.2',
    'memory_used': '1.3.6.1.2.1.25.2.3.1.6.1020',
    'memory_total' : '1.3.6.1.2.1.25.2.3.1.5.1020',
    'device_description':'1.3.6.1.2.1.1.1',
    'device_name':'1.3.6.1.2.1.1.5',
    'interfaces':'1.3.6.1.2.1.2.2.1.2',
    'interfacec_status' :'1.3.6.1.2.1.2.2.1.8',
    'interface_status':'1.3.6.1.2.1.2.2.1.7',
    'interface_description':'1.3.6.1.2.1.2.2.1.2',
    'download':'1.3.6.1.2.1.2.2.1.10',
    'upload': '1.3.6.1.2.1.2.2.1.16'
}


extream_oids = {
    'uptime': '1.3.6.1.2.1.1.3.0',

    'cpu_utilization': '1.3.6.1.4.1.1916.1.32.1.4.1.7',

    'memory_total': ' 1.3.6.1.4.1.1916.1.32.2.2.1.2',
    'memory_free': '1.3.6.1.4.1.1916.1.32.2.2.1.3',
    'memory_used_system': '1.3.6.1.4.1.1916.1.32.2.2.1.4',
    'memory_used_user': '1.3.6.1.4.1.1916.1.32.2.2.1.5',

    'device_description': '1.3.6.1.2.1.1.1.0',
    'device_name': '1.3.6.1.2.1.1.5.0',

    'interfaces': '1.3.6.1.2.1.31.1.1.1.1',
    'interface_status': '1.3.6.1.2.1.2.2.1.8',
    'interface_description': '1.3.6.1.2.1.2.2.1.2',
    'download': '1.3.6.1.2.1.2.2.1.10',
    'upload': '1.3.6.1.2.1.2.2.1.11',
}


linux_oids = {
        'uptime':'1.3.6.1.2.1.1.3',
        'cpu_utilization':'1.3.6.1.4.1.2021.11.9',
        
        'memory_total': '1.3.6.1.4.1.2021.4.5',
        'memory_free': '1.3.6.1.4.1.2021.4.11',
        
        'device_description':'1.3.6.1.2.1.1.1',
        'device_name':'1.3.6.1.2.1.1.5',

        'interfaces':'1.3.6.1.2.1.2.2.1.2',
        'interface_status':'1.3.6.1.2.1.2.2.1.7',
        'interface_description':'1.3.6.1.2.1.2.2.1.2',
        
        'download':'1.3.6.1.2.1.2.2.1.10',
        'upload': '1.3.6.1.2.1.2.2.1.16',
}

class CommonPuller(object):
    def __init__(self):
        pass

    def poll(self, host):
        output = dict()

        status = ping(host[1])[0]
        print(host[1]+" : "+status, file=sys.stderr)
        updatequery = f"update monitoring_devices_table set status = '{status}' where ip_address='{host[1]}';"
        db.session.execute(updatequery)
        db.session.commit()

        # if status == "Down":
        #     return


        if host[2].lower() == "cisco_ios":
            output = getSnmpData(host, cisco_ios_oids)
        elif host[2].lower() == "cisco_ios_xe":
            output = getSnmpData(host, cisco_ios_xe_oids)
        elif host[2].lower() == "cisco_ios_xr":
            output = getSnmpData(host, cisco_ios_xr_oids)
        elif host[2].lower() == "cisco_asa":
            output = getSnmpData(host, cisco_asa_oids)
        elif host[2].lower() == "cisco_wlc":
            output = getSnmpData(host, cisco_wlc_oids)
        elif host[2].lower() == "fortinet":
            output = getSnmpData(host, fortinet_oids)
        elif host[2].lower() == "window":
            output = getSnmpData(host, windows_oids)
        elif host[2].lower() == "juniper":
            output = getSnmpData(host, juniper_oids)
        elif host[2].lower() == "paloalto":
            output = getSnmpData(host, palo_oids)
        elif host[2].lower() == "extream":
            output = getSnmpData(host, extream_oids)
        elif host[2].lower() == "linux":
            output = getSnmpData(host, linux_oids)
        else:
            print(f"\n-------- {host[1]}: Support Not Available for {host[2]} --------\n", file=sys.stderr)
