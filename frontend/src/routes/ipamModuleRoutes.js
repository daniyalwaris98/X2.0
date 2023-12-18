import React from "react";
import { Navigate } from "react-router-dom";
import IPAMModule from "../containers/ipamModule";
import Devices from "../containers/ipamModule/devices";
import DeviceSubnets from "../containers/ipamModule/deviceSubnet";
import SubnetsDropDown from "../containers/ipamModule/subnetsDropDown";
import Subnets from "../containers/ipamModule/subnetsDropDown/subnet";
import DiscoverSubnets from "../containers/ipamModule/subnetsDropDown/discoverSubnet";
import IPDetails from "../containers/ipamModule/subnetsDropDown/ipDetails";
import IPHistory from "../containers/ipamModule/subnetsDropDown/ipHistory";
import DNSServersDropDown from "../containers/ipamModule/dnsServerDropDown";
import DNSRecords from "../containers/ipamModule/dnsServerDropDown/dnsRecord";
import DNSServers from "../containers/ipamModule/dnsServerDropDown/dnsServer";
import DNSZones from "../containers/ipamModule/dnsServerDropDown/dnsZones";
import VIPDropDown from "../containers/ipamModule/vipDropDown";
import Firewalls from "../containers/ipamModule/vipDropDown/firewalls";
import LoadBalancers from "../containers/ipamModule/vipDropDown/loadBalancers";
import { PAGE_PATH as PAGE_PATH_DEVICES } from "../containers/ipamModule/devices/constants";
import { PAGE_PATH as PAGE_PATH_DEVICE_SUBNET } from "../containers/ipamModule/deviceSubnet/constants";
import { DROPDOWN_PATH as DROPDOWN_PATH_SUBNETS } from "../containers/ipamModule/subnetsDropDown";
import { PAGE_PATH as PAGE_PATH_SUBNET } from "../containers/ipamModule/subnetsDropDown/subnet/constants";
import { PAGE_PATH as PAGE_PATH_DISCOVER_SUBNET } from "../containers/ipamModule/subnetsDropDown/discoverSubnet/constants";
import { PAGE_PATH as PAGE_PATH_IP_DETAILS } from "../containers/ipamModule/subnetsDropDown/ipDetails/constants";
import { PAGE_PATH as PAGE_PATH_IP_HISTORY } from "../containers/ipamModule/subnetsDropDown/ipHistory/constants";
import { DROPDOWN_PATH as DROPDOWN_PATH_DNS_SERVERS } from "../containers/ipamModule/dnsServerDropDown";
import { PAGE_PATH as PAGE_PATH_DNS_RECORDS } from "../containers/ipamModule/dnsServerDropDown/dnsRecord/constants";
import { PAGE_PATH as PAGE_PATH_DNS_SERVERS } from "../containers/ipamModule/dnsServerDropDown/dnsServer/constants";
import { PAGE_PATH as PAGE_PATH_DNS_ZONES } from "../containers/ipamModule/dnsServerDropDown/dnsZones/constants";
import { DROPDOWN_PATH as DROPDOWN_PATH_VIP } from "../containers/ipamModule/vipDropDown";
import { PAGE_PATH as PAGE_PATH_FIREWALL } from "../containers/ipamModule/vipDropDown/firewalls/constants";
import { PAGE_PATH as PAGE_PATH_LOAD_BALANCERS } from "../containers/ipamModule/vipDropDown/loadBalancers/constants";
import { MODULE_PATH } from "../containers/ipamModule";

const routes = {
  path: MODULE_PATH,
  element: <IPAMModule />,
  children: [
    {
      path: `/${MODULE_PATH}`,
      element: <Navigate to={PAGE_PATH_DEVICES} replace />,
    },
    {
      path: PAGE_PATH_DEVICES,
      element: <Devices />,
    },
    {
      path: PAGE_PATH_DEVICE_SUBNET,
      element: <DeviceSubnets />,
    },
    {
      path: DROPDOWN_PATH_SUBNETS,
      element: <SubnetsDropDown />,
      children: [
        {
          path: PAGE_PATH_SUBNET,
          element: <Subnets />,
        },
        {
          path: PAGE_PATH_DISCOVER_SUBNET,
          element: <DiscoverSubnets />,
        },
        {
          path: PAGE_PATH_IP_DETAILS,
          element: <IPDetails />,
        },
        {
          path: PAGE_PATH_IP_HISTORY,
          element: <IPHistory />,
        },
      ],
    },
    {
      path: DROPDOWN_PATH_DNS_SERVERS,
      element: <DNSServersDropDown />,
      children: [
        {
          path: PAGE_PATH_DNS_RECORDS,
          element: <DNSRecords />,
        },
        {
          path: PAGE_PATH_DNS_SERVERS,
          element: <DNSServers />,
        },
        {
          path: PAGE_PATH_DNS_ZONES,
          element: <DNSZones />,
        },
      ],
    },
    {
      path: DROPDOWN_PATH_VIP,
      element: <VIPDropDown />,
      children: [
        {
          path: PAGE_PATH_FIREWALL,
          element: <Firewalls />,
        },
        {
          path: PAGE_PATH_LOAD_BALANCERS,
          element: <LoadBalancers />,
        },
      ],
    },
  ],
};

export default routes;
