import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../utils/helpers";

import {
  PAGE_NAME as PAGE_NAME_DEVICES,
  PAGE_PATH as PAGE_PATH_DEVICES,
} from "./devices/constants";

////////////////////////////////////////////////
import {
  DROPDOWN_NAME as DROPDOWN_NAME_NETWORKS,
  DROPDOWN_PATH as DROPDOWN_PATH_NETWORKS,
} from "./networksDropDown";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_NETWORKS_ALL_DEVICES,
  DROPDOWN_PATH as DROPDOWN_PATH_NETWORKS_ALL_DEVICES,
} from "./networksDropDown/allDevicesDropDown";

import {
  PAGE_NAME as PAGE_NAME_NETWORKS_ALL_DEVICES_DEVICES,
  PAGE_PATH as PAGE_PATH_NETWORKS_ALL_DEVICES_DEVICES,
} from "./networksDropDown/allDevicesDropDown/devices/constants";

import {
  PAGE_NAME as PAGE_NAME_NETWORKS_ALL_DEVICES_INTERFACES,
  PAGE_PATH as PAGE_PATH_NETWORKS_ALL_DEVICES_INTERFACES,
} from "./networksDropDown/allDevicesDropDown/interfaces/constants";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_ROUTERS,
  DROPDOWN_PATH as DROPDOWN_PATH_ROUTERS,
} from "./networksDropDown/routersDropDown";

import {
  PAGE_NAME as PAGE_NAME_ROUTERS_DEVICES,
  PAGE_PATH as PAGE_PATH_ROUTERS_DEVICES,
} from "./networksDropDown/routersDropDown/devices/constants";

import {
  PAGE_NAME as PAGE_NAME_ROUTERS_INTERFACES,
  PAGE_PATH as PAGE_PATH_ROUTERS_INTERFACES,
} from "./networksDropDown/routersDropDown/interfaces/constants";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_SWITCHES,
  DROPDOWN_PATH as DROPDOWN_PATH_SWITCHES,
} from "./networksDropDown/switchesDropDown";

import {
  PAGE_NAME as PAGE_NAME_SWITCHES_DEVICES,
  PAGE_PATH as PAGE_PATH_SWITCHES_DEVICES,
} from "./networksDropDown/switchesDropDown/devices/constants";

import {
  PAGE_NAME as PAGE_NAME_SWITCHES_INTERFACES,
  PAGE_PATH as PAGE_PATH_SWITCHES_INTERFACES,
} from "./networksDropDown/switchesDropDown/interfaces/constants";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_FIREWALLS,
  DROPDOWN_PATH as DROPDOWN_PATH_FIREWALLS,
} from "./networksDropDown/firewallsDropDown";

import {
  PAGE_NAME as PAGE_NAME_FIREWALLS_DEVICES,
  PAGE_PATH as PAGE_PATH_FIREWALLS_DEVICES,
} from "./networksDropDown/firewallsDropDown/devices/constants";

import {
  PAGE_NAME as PAGE_NAME_FIREWALLS_INTERFACES,
  PAGE_PATH as PAGE_PATH_FIREWALLS_INTERFACES,
} from "./networksDropDown/firewallsDropDown/interfaces/constants";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_WIRELESS,
  DROPDOWN_PATH as DROPDOWN_PATH_WIRELESS,
} from "./networksDropDown/wirelessDropDown";

import {
  PAGE_NAME as PAGE_NAME_WIRELESS_DEVICES,
  PAGE_PATH as PAGE_PATH_WIRELESS_DEVICES,
} from "./networksDropDown/wirelessDropDown/devices/constants";

import {
  PAGE_NAME as PAGE_NAME_WIRELESS_INTERFACES,
  PAGE_PATH as PAGE_PATH_WIRELESS_INTERFACES,
} from "./networksDropDown/wirelessDropDown/interfaces/constants";

//////////////////////////////////////////////////
import {
  DROPDOWN_NAME as DROPDOWN_NAME_SERVERS,
  DROPDOWN_PATH as DROPDOWN_PATH_SERVERS,
} from "./serversDropDown";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_SERVERS_ALL_DEVICES,
  DROPDOWN_PATH as DROPDOWN_PATH_SERVERS_ALL_DEVICES,
} from "./serversDropDown/allDevicesDropDown";

import {
  PAGE_NAME as PAGE_NAME_SERVERS_ALL_DEVICES_DEVICES,
  PAGE_PATH as PAGE_PATH_SERVERS_ALL_DEVICES_DEVICES,
} from "./serversDropDown/allDevicesDropDown/devices/constants";

import {
  PAGE_NAME as PAGE_NAME_SERVERS_ALL_DEVICES_INTERFACES,
  PAGE_PATH as PAGE_PATH_SERVERS_ALL_DEVICES_INTERFACES,
} from "./serversDropDown/allDevicesDropDown/interfaces/constants";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_LINUX,
  DROPDOWN_PATH as DROPDOWN_PATH_LINUX,
} from "./serversDropDown/linuxDropDown";

import {
  PAGE_NAME as PAGE_NAME_LINUX_DEVICES,
  PAGE_PATH as PAGE_PATH_LINUX_DEVICES,
} from "./serversDropDown/linuxDropDown/devices/constants";

import {
  PAGE_NAME as PAGE_NAME_LINUX_INTERFACES,
  PAGE_PATH as PAGE_PATH_LINUX_INTERFACES,
} from "./serversDropDown/linuxDropDown/interfaces/constants";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_WINDOWS,
  DROPDOWN_PATH as DROPDOWN_PATH_WINDOWS,
} from "./serversDropDown/windowsDropDown";

import {
  PAGE_NAME as PAGE_NAME_WINDOWS_DEVICES,
  PAGE_PATH as PAGE_PATH_WINDOWS_DEVICES,
} from "./serversDropDown/windowsDropDown/devices/constants";

import {
  PAGE_NAME as PAGE_NAME_WINDOWS_INTERFACES,
  PAGE_PATH as PAGE_PATH_WINDOWS_INTERFACES,
} from "./serversDropDown/windowsDropDown/interfaces/constants";

///////////////////////////////////////////////
import {
  PAGE_NAME as PAGE_NAME_ALERTS,
  PAGE_PATH as PAGE_PATH_ALERTS,
} from "./alerts/constants";

/////////////////////////////////////////////////
import {
  DROPDOWN_NAME as DROPDOWN_NAME_CLOUDS,
  DROPDOWN_PATH as DROPDOWN_PATH_CLOUDS,
} from "./cloudsDropDown";

import {
  PAGE_NAME as PAGE_NAME_CLOUDS,
  PAGE_PATH as PAGE_PATH_CLOUDS,
} from "./cloudsDropDown/clouds/constants";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_AWS,
  DROPDOWN_PATH as DROPDOWN_PATH_AWS,
} from "./cloudsDropDown/awsDropDown";

import {
  PAGE_NAME as PAGE_NAME_S3,
  PAGE_PATH as PAGE_PATH_S3,
} from "./cloudsDropDown/awsDropDown/s3/constants";

import {
  PAGE_NAME as PAGE_NAME_EC2,
  PAGE_PATH as PAGE_PATH_EC2,
} from "./cloudsDropDown/awsDropDown/ec2/constants";

import {
  PAGE_NAME as PAGE_NAME_ELB,
  PAGE_PATH as PAGE_PATH_ELB,
} from "./cloudsDropDown/awsDropDown/elb/constants";

////////////////////////////////////////////////////
import {
  DROPDOWN_NAME as DROPDOWN_NAME_MANAGE_CREDENTIALS,
  DROPDOWN_PATH as DROPDOWN_PATH_MANAGE_CREDENTIALS,
} from "./manageCredentialsDropDown";

import {
  PAGE_NAME as PAGE_NAME_LOGIN_CREDENTIALS,
  PAGE_PATH as PAGE_PATH_LOGIN_CREDENTIALS,
} from "./manageCredentialsDropDown/loginCredentials/constants";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_SNMP_CREDENTIALS,
  DROPDOWN_PATH as DROPDOWN_PATH_SNMP_CREDENTIALS,
} from "./manageCredentialsDropDown/snmpDropDown";

import {
  PAGE_NAME as PAGE_NAME_V1_V2_CREDENTIALS,
  PAGE_PATH as PAGE_PATH_V1_V2_CREDENTIALS,
} from "./manageCredentialsDropDown/snmpDropDown/v1V2Credentials/constants";

import {
  PAGE_NAME as PAGE_NAME_V3_CREDENTIALS,
  PAGE_PATH as PAGE_PATH_V3_CREDENTIALS,
} from "./manageCredentialsDropDown/snmpDropDown/v3Credentials/constants";

/////////////////////////////////////////////////////
export const MODULE_PATH = "monitoring_module";

const menuItems = [
  { id: PAGE_PATH_DEVICES, name: PAGE_NAME_DEVICES, path: PAGE_PATH_DEVICES },
  {
    id: DROPDOWN_PATH_NETWORKS,
    name: DROPDOWN_NAME_NETWORKS,
    children: [
      {
        id: DROPDOWN_PATH_NETWORKS_ALL_DEVICES,
        name: DROPDOWN_NAME_NETWORKS_ALL_DEVICES,
        children: [
          {
            id: PAGE_PATH_NETWORKS_ALL_DEVICES_DEVICES,
            name: PAGE_NAME_NETWORKS_ALL_DEVICES_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_NETWORKS_ALL_DEVICES}/${PAGE_PATH_NETWORKS_ALL_DEVICES_DEVICES}`,
          },
          {
            id: PAGE_PATH_NETWORKS_ALL_DEVICES_INTERFACES,
            name: PAGE_NAME_NETWORKS_ALL_DEVICES_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_NETWORKS_ALL_DEVICES}/${PAGE_PATH_NETWORKS_ALL_DEVICES_INTERFACES}`,
          },
        ],
      },
      {
        id: DROPDOWN_PATH_ROUTERS,
        name: DROPDOWN_NAME_ROUTERS,
        children: [
          {
            id: PAGE_PATH_ROUTERS_DEVICES,
            name: PAGE_NAME_ROUTERS_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_ROUTERS}/${PAGE_PATH_ROUTERS_DEVICES}`,
          },
          {
            id: PAGE_PATH_ROUTERS_INTERFACES,
            name: PAGE_NAME_ROUTERS_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_ROUTERS}/${PAGE_PATH_ROUTERS_INTERFACES}`,
          },
        ],
      },
      {
        id: DROPDOWN_PATH_SWITCHES,
        name: DROPDOWN_NAME_SWITCHES,
        children: [
          {
            id: PAGE_PATH_SWITCHES_DEVICES,
            name: PAGE_NAME_SWITCHES_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_SWITCHES}/${PAGE_PATH_SWITCHES_DEVICES}`,
          },
          {
            id: PAGE_PATH_SWITCHES_INTERFACES,
            name: PAGE_NAME_SWITCHES_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_SWITCHES}/${PAGE_PATH_SWITCHES_INTERFACES}`,
          },
        ],
      },
      {
        id: DROPDOWN_PATH_FIREWALLS,
        name: DROPDOWN_NAME_FIREWALLS,
        children: [
          {
            id: PAGE_PATH_FIREWALLS_DEVICES,
            name: PAGE_NAME_FIREWALLS_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_FIREWALLS}/${PAGE_PATH_FIREWALLS_DEVICES}`,
          },
          {
            id: PAGE_PATH_FIREWALLS_INTERFACES,
            name: PAGE_NAME_FIREWALLS_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_FIREWALLS}/${PAGE_PATH_FIREWALLS_INTERFACES}`,
          },
        ],
      },
      {
        id: DROPDOWN_PATH_WIRELESS,
        name: DROPDOWN_NAME_WIRELESS,
        children: [
          {
            id: PAGE_PATH_WIRELESS_DEVICES,
            name: PAGE_NAME_WIRELESS_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_WIRELESS}/${PAGE_PATH_WIRELESS_DEVICES}`,
          },
          {
            id: PAGE_PATH_WIRELESS_INTERFACES,
            name: PAGE_NAME_WIRELESS_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_WIRELESS}/${PAGE_PATH_WIRELESS_INTERFACES}`,
          },
        ],
      },
    ],
  },
  {
    id: DROPDOWN_PATH_SERVERS,
    name: DROPDOWN_NAME_SERVERS,
    children: [
      {
        id: DROPDOWN_PATH_SERVERS_ALL_DEVICES,
        name: DROPDOWN_NAME_SERVERS_ALL_DEVICES,
        children: [
          {
            id: PAGE_PATH_SERVERS_ALL_DEVICES_DEVICES,
            name: PAGE_NAME_SERVERS_ALL_DEVICES_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_SERVERS_ALL_DEVICES}/${PAGE_PATH_SERVERS_ALL_DEVICES_DEVICES}`,
          },
          {
            id: PAGE_PATH_SERVERS_ALL_DEVICES_INTERFACES,
            name: PAGE_NAME_SERVERS_ALL_DEVICES_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_SERVERS_ALL_DEVICES}/${PAGE_PATH_SERVERS_ALL_DEVICES_INTERFACES}`,
          },
        ],
      },
      {
        id: DROPDOWN_PATH_LINUX,
        name: DROPDOWN_NAME_LINUX,
        children: [
          {
            id: PAGE_PATH_LINUX_DEVICES,
            name: PAGE_NAME_LINUX_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_LINUX}/${PAGE_PATH_LINUX_DEVICES}`,
          },
          {
            id: PAGE_PATH_LINUX_INTERFACES,
            name: PAGE_NAME_LINUX_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_LINUX}/${PAGE_PATH_LINUX_INTERFACES}`,
          },
        ],
      },
      {
        id: DROPDOWN_PATH_WINDOWS,
        name: DROPDOWN_NAME_WINDOWS,
        children: [
          {
            id: PAGE_PATH_WINDOWS_DEVICES,
            name: PAGE_NAME_WINDOWS_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_WINDOWS}/${PAGE_PATH_WINDOWS_DEVICES}`,
          },
          {
            id: PAGE_PATH_WINDOWS_INTERFACES,
            name: PAGE_NAME_WINDOWS_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_WINDOWS}/${PAGE_PATH_WINDOWS_INTERFACES}`,
          },
        ],
      },
    ],
  },
  { id: PAGE_PATH_ALERTS, name: PAGE_NAME_ALERTS, path: PAGE_PATH_ALERTS },
  {
    id: DROPDOWN_PATH_CLOUDS,
    name: DROPDOWN_NAME_CLOUDS,
    children: [
      {
        id: PAGE_PATH_CLOUDS,
        name: PAGE_NAME_CLOUDS,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_CLOUDS}/${PAGE_PATH_CLOUDS}`,
      },
      {
        id: DROPDOWN_PATH_AWS,
        name: DROPDOWN_NAME_AWS,
        children: [
          {
            id: PAGE_PATH_S3,
            name: PAGE_NAME_S3,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_CLOUDS}/${DROPDOWN_PATH_AWS}/${PAGE_PATH_S3}`,
          },
          {
            id: PAGE_PATH_EC2,
            name: PAGE_NAME_EC2,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_CLOUDS}/${DROPDOWN_PATH_AWS}/${PAGE_PATH_EC2}`,
          },
          {
            id: PAGE_PATH_ELB,
            name: PAGE_NAME_ELB,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_CLOUDS}/${DROPDOWN_PATH_AWS}/${PAGE_PATH_ELB}`,
          },
        ],
      },
    ],
  },
  {
    id: DROPDOWN_PATH_MANAGE_CREDENTIALS,
    name: DROPDOWN_NAME_MANAGE_CREDENTIALS,
    children: [
      {
        id: PAGE_PATH_LOGIN_CREDENTIALS,
        name: PAGE_NAME_LOGIN_CREDENTIALS,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_MANAGE_CREDENTIALS}/${PAGE_PATH_LOGIN_CREDENTIALS}`,
      },
      {
        id: DROPDOWN_PATH_SNMP_CREDENTIALS,
        name: DROPDOWN_NAME_SNMP_CREDENTIALS,
        children: [
          {
            id: PAGE_PATH_V1_V2_CREDENTIALS,
            name: PAGE_NAME_V1_V2_CREDENTIALS,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_MANAGE_CREDENTIALS}/${DROPDOWN_PATH_SNMP_CREDENTIALS}/${PAGE_PATH_V1_V2_CREDENTIALS}`,
          },
          {
            id: PAGE_PATH_V3_CREDENTIALS,
            name: PAGE_NAME_V3_CREDENTIALS,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_MANAGE_CREDENTIALS}/${DROPDOWN_PATH_SNMP_CREDENTIALS}/${PAGE_PATH_V3_CREDENTIALS}`,
          },
        ],
      },
    ],
  },
];

function Index(props) {
  let pagePath = getPathAllSegments();
  if (pagePath.length === 2 && pagePath[1] === MODULE_PATH) {
    pagePath = [PAGE_PATH_DEVICES];
  } else pagePath = pagePath.slice(2);

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
