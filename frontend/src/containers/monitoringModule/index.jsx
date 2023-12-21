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
  PAGE_NAME as PAGE_NAME_INTERFACES,
  PAGE_PATH as PAGE_PATH_INTERFACES,
} from "./serversDropDown/allServersDropDown/interfaces/constants";


import {
  PAGE_NAME as PAGE_NAME_DEVICE,
  PAGE_PATH as PAGE_PATH_DEVICE,
} from "./devices/constants";
import {
  PAGE_NAME as PAGE_NAME_ALERT,
  PAGE_PATH as PAGE_PATH_ALERT,
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
  DROPDOWN_NAME as DROPDOWN_NAME_ALL_SERVERS,
  DROPDOWN_PATH as DROPDOWN_PATH_ALL_SERVERS,
} from "./serversDropDown/allServersDropDown";
import {
  DROPDOWN_NAME as DROPDOWN_NAME_SERVERS,
  DROPDOWN_PATH as DROPDOWN_PATH_SERVERS,
} from "./serversDropDown";


import { getPathLastSegment } from "../../utils/helpers";

export const MODULE_PATH = "monitoring_module";

const menuItems = [
  { id: PAGE_PATH_DEVICE, name: PAGE_NAME_DEVICE, path: PAGE_PATH_DEVICE },
  { id: PAGE_PATH_ALERT, name: PAGE_NAME_ALERT, path: PAGE_PATH_ALERT },
  { id: PAGE_PATH_CREDENTIAL, name: PAGE_NAME_CREDENTIAL, path: PAGE_PATH_CREDENTIAL },

  // {
  //   id: DROPDOWN_PATH_DNS_SERVERS,
  //   name: DROPDOWN_NAME_DNS_SERVERS,
  //   children: [
  //     {
  //       id: PAGE_PATH_DNS_SERVER,
  //       name: PAGE_NAME_DNS_SERVER,
  //       path: `/${MODULE_PATH}/${DROPDOWN_PATH_DNS_SERVERS}/${PAGE_PATH_DNS_SERVER}`,
  //     },
  //     {
  //       id: PAGE_PATH_DNS_RECORD,
  //       name: PAGE_NAME_DNS_RECORD,
  //       path: `/${MODULE_PATH}/${DROPDOWN_PATH_DNS_SERVERS}/${PAGE_PATH_DNS_RECORD}`,
  //     },
  //     {
  //       id: PAGE_PATH_DNS_ZONES,
  //       name: PAGE_NAME_DNS_ZONES,
  //       path: `/${MODULE_PATH}/${DROPDOWN_PATH_DNS_SERVERS}/${PAGE_PATH_DNS_ZONES}`,
  //     },
  //   ],
  // },
  {
    id: DROPDOWN_PATH_CLOUDS,
    name: DROPDOWN_NAME_CLOUDS,
    children: [
      {
        id: PAGE_PATH_AWS,
        name: PAGE_NAME_AWS,
        path: `/${MODULE_PATH}/${DROPDOWN_PATH_CLOUDS}/${PAGE_PATH_AWS}`,
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
            id: PAGE_PATH_DEVICES,
            name: PAGE_NAME_DEVICES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_ALL_SERVERS}/${PAGE_PATH_DEVICES}`,
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
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_ALL_SERVERS}/${PAGE_PATH_DEVICES}`,
          },
          {
            id: PAGE_PATH_INTERFACES,
            name: PAGE_NAME_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_ALL_SERVERS}/${PAGE_PATH_INTERFACES}`,
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
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_ALL_SERVERS}/${PAGE_PATH_DEVICES}`,
          },
          {
            id: PAGE_PATH_INTERFACES,
            name: PAGE_NAME_INTERFACES,
            path: `/${MODULE_PATH}/${DROPDOWN_PATH_SERVERS}/${DROPDOWN_PATH_ALL_SERVERS}/${PAGE_PATH_INTERFACES}`,
          },
        ],
      },
    ],
  },
  




];

function Index(props) {
  let pagePath = getPathAllSegments();
  if (pagePath.length === 2 && pagePath[1] === MODULE_PATH) {
    pagePath = [PAGE_PATH_DEVICES,PAGE_PATH_DEVICES
    
    
    ];
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




