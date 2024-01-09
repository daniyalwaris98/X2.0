import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../utils/helpers";

import {
  PAGE_NAME as PAGE_NAME_DEVICES,
  PAGE_PATH as PAGE_PATH_DEVICES,
} from "./devices/constants";

import {
  PAGE_NAME as PAGE_NAME_SERVER_DEVICES,
  PAGE_PATH as PAGE_PATH_SERVER_DEVICES,
} from "./serversDropDown/allServersDropDown/devices/constants";

import {
  PAGE_NAME as PAGE_NAME_INTERFACES,
  PAGE_PATH as PAGE_PATH_INTERFACES,
} from "./serversDropDown/allServersDropDown/interfaces/constants";

import {
  PAGE_NAME as PAGE_NAME_ALERTS,
  PAGE_PATH as PAGE_PATH_ALERTS,
} from "./alerts/constants";

import {
  PAGE_NAME as PAGE_NAME_CREDENTIAL,
  PAGE_PATH as PAGE_PATH_CREDENTIAL,
} from "./credentials/constants";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_CLOUDS,
  DROPDOWN_PATH as DROPDOWN_PATH_CLOUDS,
} from "./cloudsDropDown";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_LINUX,
  DROPDOWN_PATH as DROPDOWN_PATH_LINUX,
} from "./serversDropDown/linuxDropDown";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_WINDOWS,
  DROPDOWN_PATH as DROPDOWN_PATH_WINDOWS,
} from "./serversDropDown/windowsDropDown";

import {
  PAGE_NAME as PAGE_NAME_AWS,
  PAGE_PATH as PAGE_PATH_AWS,
} from "./cloudsDropDown/aws/constants";

import {
  PAGE_NAME as PAGE_NAME_CLOUDS,
  PAGE_PATH as PAGE_PATH_CLOUDS,
} from "./cloudsDropDown/clouds/constants";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_SERVERS,
  DROPDOWN_PATH as DROPDOWN_PATH_SERVERS,
} from "./serversDropDown";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_ALL_SERVERS,
  DROPDOWN_PATH as DROPDOWN_PATH_ALL_SERVERS,
} from "./serversDropDown/allServersDropDown";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_NETWORKS,
  DROPDOWN_PATH as DROPDOWN_PATH_NETWORKS,
} from "./networksDropDown";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_ALL_DEVICES,
  DROPDOWN_PATH as DROPDOWN_PATH_ALL_DEVICES,
} from "./networksDropDown/allDevicesDropDown";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_ROUTERS,
  DROPDOWN_PATH as DROPDOWN_PATH_ROUTERS,
} from "./networksDropDown/routeDropDown";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_SWITCHES,
  DROPDOWN_PATH as DROPDOWN_PATH_SWITCHES,
} from "./networksDropDown/switchesDropDown";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_FIREWALL,
  DROPDOWN_PATH as DROPDOWN_PATH_FIREWALL,
} from "./networksDropDown/firewallDropDown";

import {
  DROPDOWN_NAME as DROPDOWN_NAME_WIRELESS,
  DROPDOWN_PATH as DROPDOWN_PATH_WIRELESS,
} from "./networksDropDown/wirelessDropDown";


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
} from "./cloudsDropDown/awsDropDown";


import {
  DROPDOWN_NAME as DROPDOWN_NAME_AWS,
  DROPDOWN_PATH as DROPDOWN_PATH_AWS,
} from "./cloudsDropDown/awsDropDown";
// import {
//   DROPDOWN_NAME as DROPDOWN_NAME_CLOUDS,
//   DROPDOWN_PATH as DROPDOWN_PATH_CLOUDS,
// } from "./cloudsDropDown/clouds";
import {
  PAGE_NAME as PAGE_NAME_V1_V2_CREDENTIALS,
  PAGE_PATH as PAGE_PATH_V1_V2_CREDENTIALS,
} from "./manageCredentialsDropDown/snmpDropDown/v1V2Credentials/constants";

import {
  PAGE_NAME as PAGE_NAME_E3,
  PAGE_PATH as PAGE_PATH_E3,
} from "./cloudsDropDown/awsDropDown/e3/constants";
import {
  PAGE_NAME as PAGE_NAME_EC2,
  PAGE_PATH as PAGE_PATH_EC2,
} from "./cloudsDropDown/awsDropDown/ec2/constants";
import {
  PAGE_NAME as PAGE_NAME_ELB,
  PAGE_PATH as PAGE_PATH_ELB,
} from "./cloudsDropDown/awsDropDown/elb/constants";
import {
  PAGE_NAME as PAGE_NAME_V3_CREDENTIALS,
  PAGE_PATH as PAGE_PATH_V3_CREDENTIALS,
} from "./manageCredentialsDropDown/snmpDropDown/v3Credentials/constants";


export const MODULE_PATH = "monitoring_module";

const menuItems = [
  { id: PAGE_PATH_DEVICES, name: PAGE_NAME_DEVICES, path: PAGE_PATH_DEVICES },
  { id: PAGE_PATH_ALERTS, name: PAGE_NAME_ALERTS, path: PAGE_PATH_ALERTS },
  // { id: PAGE_PATH_CREDENTIAL, name: PAGE_NAME_CREDENTIAL, path: PAGE_PATH_CREDENTIAL },

  // {
  //   id: DROPDOWN_PATH_CLOUDS,
  //   name: DROPDOWN_NAME_CLOUDS,
  //   children: [
  //     {
  //       id: PAGE_PATH_AWS,
  //       name: PAGE_NAME_AWS,
  //       path: `/${MODULE_PATH}/${DROPDOWN_PATH_CLOUDS}/${PAGE_PATH_AWS}`,
  //     },
  //   ],
  // },

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
            id: PAGE_PATH_E3,
            name: PAGE_NAME_E3,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_CLOUDS}/${DROPDOWN_PATH_AWS}/${PAGE_PATH_E3}`,
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
    id: DROPDOWN_PATH_SERVERS,
    name: DROPDOWN_NAME_SERVERS,
    children: [
      {
        id: DROPDOWN_PATH_ALL_SERVERS,
        name: DROPDOWN_NAME_ALL_SERVERS,
        children: [
          {
            id: PAGE_PATH_SERVER_DEVICES,
            name: PAGE_NAME_SERVER_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_ALL_SERVERS}/${PAGE_PATH_SERVER_DEVICES}`,
          },
          {
            id: PAGE_PATH_INTERFACES,
            name: PAGE_NAME_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_ALL_SERVERS}/${PAGE_PATH_INTERFACES}`,
          },
        ],
      },
      {
        id: DROPDOWN_PATH_LINUX,
        name: DROPDOWN_NAME_LINUX,
        children: [
          {
            id: PAGE_PATH_DEVICES,
            name: PAGE_NAME_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_LINUX}/${PAGE_PATH_DEVICES}`,
          },
          {
            id: PAGE_PATH_INTERFACES,
            name: PAGE_NAME_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_LINUX}/${PAGE_PATH_INTERFACES}`,
          },
        ],
      },
      {
        id: DROPDOWN_PATH_WINDOWS,
        name: DROPDOWN_NAME_WINDOWS,
        children: [
          {
            id: PAGE_PATH_DEVICES,
            name: PAGE_NAME_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_WINDOWS}/${PAGE_PATH_DEVICES}`,
          },
          {
            id: PAGE_PATH_INTERFACES,
            name: PAGE_NAME_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_WINDOWS}/${PAGE_PATH_INTERFACES}`,
          },
        ],
      },
    ],
  },

  {
    id: DROPDOWN_PATH_NETWORKS,
    name: DROPDOWN_NAME_NETWORKS,
    children: [
      {
        id: DROPDOWN_PATH_ALL_DEVICES,
        name: DROPDOWN_NAME_ALL_DEVICES,
        children: [
          {
            id: PAGE_PATH_DEVICES,
            name: PAGE_NAME_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_ALL_DEVICES}/${PAGE_PATH_DEVICES}`,
          },
          {
            id: PAGE_PATH_INTERFACES,
            name: PAGE_NAME_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_ALL_DEVICES}/${PAGE_PATH_INTERFACES}`,
          },
        ],
      },
      {
        id: DROPDOWN_PATH_ROUTERS,
        name: DROPDOWN_NAME_ROUTERS,
        children: [
          {
            id: PAGE_PATH_DEVICES,
            name: PAGE_NAME_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_ROUTERS}/${PAGE_PATH_DEVICES}`,
          },
          {
            id: PAGE_PATH_INTERFACES,
            name: PAGE_NAME_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_ROUTERS}/${PAGE_PATH_INTERFACES}`,
          },
        ],
      },

      {
        id: DROPDOWN_PATH_SWITCHES,
        name: DROPDOWN_NAME_SWITCHES,
        children: [
          {
            id: PAGE_PATH_DEVICES,
            name: PAGE_NAME_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_SWITCHES}/${PAGE_PATH_DEVICES}`,
          },
          {
            id: PAGE_PATH_INTERFACES,
            name: PAGE_NAME_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_SWITCHES}/${PAGE_PATH_INTERFACES}`,
          },
        ],
      },
      {
        id: DROPDOWN_PATH_FIREWALL,
        name: DROPDOWN_NAME_FIREWALL,
        children: [
          {
            id: PAGE_PATH_DEVICES,
            name: PAGE_NAME_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_FIREWALL}/${PAGE_PATH_DEVICES}`,
          },
          {
            id: PAGE_PATH_INTERFACES,
            name: PAGE_NAME_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_FIREWALL}/${PAGE_PATH_INTERFACES}`,
          },
        ],
      },
      {
        id: DROPDOWN_PATH_WIRELESS,
        name: DROPDOWN_NAME_WIRELESS,
        children: [
          {
            id: PAGE_PATH_DEVICES,
            name: PAGE_NAME_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_WIRELESS}/${PAGE_PATH_DEVICES}`,
          },
          {
            id: PAGE_PATH_INTERFACES,
            name: PAGE_NAME_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_NETWORKS}/${DROPDOWN_PATH_WIRELESS}/${PAGE_PATH_INTERFACES}`,
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
    pagePath = [PAGE_PATH_DEVICES, PAGE_PATH_DEVICES];
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



