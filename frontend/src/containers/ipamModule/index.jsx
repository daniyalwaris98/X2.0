import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu";
import {
  PAGE_NAME as PAGE_NAME_DEVICES,
  PAGE_PATH as PAGE_PATH_DEVICES,
} from "./devices/constants";
import {
  PAGE_NAME as PAGE_NAME_DEVICE_SUBNET,
  PAGE_PATH as PAGE_PATH_DEVICE_SUBNET,
} from "./deviceSubnet/constants";
import { getPathLastSegment } from "../../utils/helpers";
import {
  DROPDOWN_NAME as DROPDOWN_NAME_SUBNETS,
  DROPDOWN_PATH as DROPDOWN_PATH_SUBNETS,
} from "./subnetsDropDown";
import {
  PAGE_NAME as PAGE_NAME_SUBNETS,
  PAGE_PATH as PAGE_PATH_SUBNETS,
} from "./subnetsDropDown/subnet/constants";
import {
  PAGE_NAME as PAGE_NAME_DISCOVER_SUBNET,
  PAGE_PATH as PAGE_PATH_DISCOVER_SUBNET,
} from "./subnetsDropDown/discoverSubnet/constants";
import {
  PAGE_NAME as PAGE_NAME_IP_DETAILS,
  PAGE_PATH as PAGE_PATH_IP_DETAILS,
} from "./subnetsDropDown/ipDetails/constants";
import {
  PAGE_NAME as PAGE_NAME_IP_HISTORY,
  PAGE_PATH as PAGE_PATH_IP_HISTORY,
} from "./subnetsDropDown/ipHistory/constants";
import {
  DROPDOWN_NAME as DROPDOWN_NAME_DNS_SERVERS,
  DROPDOWN_PATH as DROPDOWN_PATH_DNS_SERVERS,
} from "./dnsServerDropDown";
import {
  PAGE_NAME as PAGE_NAME_DNS_RECORD,
  PAGE_PATH as PAGE_PATH_DNS_RECORD,
} from "./dnsServerDropDown/dnsRecord/constants";
import {
  PAGE_NAME as PAGE_NAME_DNS_SERVER,
  PAGE_PATH as PAGE_PATH_DNS_SERVER,
} from "./dnsServerDropDown/dnsServer/constants";
import {
  PAGE_NAME as PAGE_NAME_DNS_ZONES,
  PAGE_PATH as PAGE_PATH_DNS_ZONES,
} from "./dnsServerDropDown/dnsZones/constants";
import {
  DROPDOWN_NAME as DROPDOWN_NAME_VIP,
  DROPDOWN_PATH as DROPDOWN_PATH_VIP,
} from "./vipDropDown";
import {
  PAGE_NAME as PAGE_NAME_FIREWALLS,
  PAGE_PATH as PAGE_PATH_FIREWALLS,
} from "./vipDropDown/firewalls/constants";
import {
  PAGE_NAME as PAGE_NAME_LOAD_BALANCERS,
  PAGE_PATH as PAGE_PATH_LOAD_BALANCERS,
} from "./vipDropDown/loadBalancers/constants";
import Header from "../../components/horizontalMenu/header";

export const MODULE_PATH = "ipam_module";

const menuItems = [
  {
    id: PAGE_PATH_DEVICES,
    name: PAGE_NAME_DEVICES,
    path: PAGE_PATH_DEVICES,
  },
  {
    id: PAGE_PATH_DEVICE_SUBNET,
    name: PAGE_NAME_DEVICE_SUBNET,
    path: PAGE_PATH_DEVICE_SUBNET,
  },
  {
    id: DROPDOWN_PATH_SUBNETS,
    name: DROPDOWN_NAME_SUBNETS,
    children: [
      {
        id: PAGE_PATH_SUBNETS,
        name: PAGE_NAME_SUBNETS,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_SUBNETS}/${PAGE_PATH_SUBNETS}`,
      },
      {
        id: PAGE_PATH_IP_DETAILS,
        name: PAGE_NAME_IP_DETAILS,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_SUBNETS}/${PAGE_PATH_IP_DETAILS}`,
      },
      {
        id: PAGE_PATH_DISCOVER_SUBNET,
        name: PAGE_NAME_DISCOVER_SUBNET,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_SUBNETS}/${PAGE_PATH_DISCOVER_SUBNET}`,
      },
      {
        id: PAGE_PATH_IP_HISTORY,
        name: PAGE_NAME_IP_HISTORY,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_SUBNETS}/${PAGE_PATH_IP_HISTORY}`,
      },
    ],
  },
  {
    id: DROPDOWN_PATH_DNS_SERVERS,
    name: DROPDOWN_NAME_DNS_SERVERS,
    children: [
      {
        id: PAGE_PATH_DNS_SERVER,
        name: PAGE_NAME_DNS_SERVER,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_DNS_SERVERS}/${PAGE_PATH_DNS_SERVER}`,
      },
      {
        id: PAGE_PATH_DNS_RECORD,
        name: PAGE_NAME_DNS_RECORD,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_DNS_SERVERS}/${PAGE_PATH_DNS_RECORD}`,
      },
      {
        id: PAGE_PATH_DNS_ZONES,
        name: PAGE_NAME_DNS_ZONES,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_DNS_SERVERS}/${PAGE_PATH_DNS_ZONES}`,
      },
    ],
  },
  {
    id: DROPDOWN_PATH_VIP,
    name: DROPDOWN_NAME_VIP,
    children: [
      {
        id: PAGE_PATH_FIREWALLS,
        name: PAGE_NAME_FIREWALLS,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_VIP}/${PAGE_PATH_FIREWALLS}`,
      },
      {
        id: PAGE_PATH_LOAD_BALANCERS,
        name: PAGE_NAME_LOAD_BALANCERS,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_VIP}/${PAGE_PATH_LOAD_BALANCERS}`,
      },
    ],
  },
];

function Index(props) {
  let pagePath = getPathLastSegment();
  if (pagePath === MODULE_PATH) pagePath = PAGE_PATH_DEVICES;

  return (
    <>
      {/* <Header menuItems={menuItems} /> */}

      <Card
        sx={{
          marginBottom: "10px",
          height: "50px",
        }}
      >
        <Header menuItems={menuItems} />
        {/* <HorizontalMenu menuItems={menuItems} defaultPage={pagePath} /> */}
      </Card>
      <Outlet />
    </>
  );
}

export default Index;
