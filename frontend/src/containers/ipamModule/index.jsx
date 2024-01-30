import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_DASHBOARD,
  PAGE_PATH as PAGE_PATH_DASHBOARD,
} from "./dashboard/constants";
import {
  PAGE_NAME as PAGE_NAME_DEVICES,
  PAGE_PATH as PAGE_PATH_DEVICES,
} from "./devices/constants";
import {
  DROPDOWN_NAME as DROPDOWN_NAME_SUBNETS,
  DROPDOWN_PATH as DROPDOWN_PATH_SUBNETS,
} from "./subnetsDropDown";
import {
  PAGE_NAME as PAGE_NAME_SUBNETS,
  PAGE_PATH as PAGE_PATH_SUBNETS,
} from "./subnetsDropDown/subnets/constants";
import {
  PAGE_NAME as PAGE_NAME_DISCOVERED_SUBNETS,
  PAGE_PATH as PAGE_PATH_DISCOVERED_SUBNETS,
} from "./subnetsDropDown/discoveredSubnets/constants";
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
  PAGE_NAME as PAGE_NAME_DNS_RECORDS,
  PAGE_PATH as PAGE_PATH_DNS_RECORDS,
} from "./dnsServerDropDown/dnsRecords/constants";
import {
  PAGE_NAME as PAGE_NAME_DNS_SERVERS,
  PAGE_PATH as PAGE_PATH_DNS_SERVERS,
} from "./dnsServerDropDown/dnsServers/constants";
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

export const MODULE_NAME = "IPAM";
export const MODULE_PATH = "ipam_module";

const menuItems = [
  {
    id: PAGE_PATH_DASHBOARD,
    name: PAGE_NAME_DASHBOARD,
    path: PAGE_PATH_DASHBOARD,
  },
  {
    id: PAGE_PATH_DEVICES,
    name: PAGE_NAME_DEVICES,
    path: PAGE_PATH_DEVICES,
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
        id: PAGE_PATH_DISCOVERED_SUBNETS,
        name: PAGE_NAME_DISCOVERED_SUBNETS,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_SUBNETS}/${PAGE_PATH_DISCOVERED_SUBNETS}`,
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
        id: PAGE_PATH_DNS_SERVERS,
        name: PAGE_NAME_DNS_SERVERS,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_DNS_SERVERS}/${PAGE_PATH_DNS_SERVERS}`,
      },
      {
        id: PAGE_PATH_DNS_RECORDS,
        name: PAGE_NAME_DNS_RECORDS,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_DNS_SERVERS}/${PAGE_PATH_DNS_RECORDS}`,
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
  let pagePath = getPathAllSegments();
  if (pagePath.length === 2 && pagePath[1] === MODULE_PATH) {
    pagePath = [PAGE_PATH_DEVICES];
  } else pagePath = pagePath.splice(2);

  return (
    <>
      <Card>
        <HorizontalMenu menuItems={menuItems} defaultPagePath={pagePath} />
      </Card>
      <Outlet />
    </>
  );
}

export default Index;
