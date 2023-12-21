import React from "react";
import MonitoringModule from "../containers/monitoringModule";
// import Devices from "../containers/monitoringModule/devices";
import Alerts from "../containers/monitoringModule/alerts";
import Credentials from "../containers/monitoringModule/credentials";
import Clouds from "../containers/monitoringModule/clouds";
import Interfaces from "../containers/monitoringModule/serversDropDown/allServersDropDown/interfaces"
import Devices from "../containers/monitoringModule/serversDropDown/allServersDropDown/devices"

import AllDevices from "../containers/monitoringModule/serversDropDown/allServersDropDown/devices";

import CloudsDropDown from "../containers/monitoringModule/cloudsDropDown"
import ServersDropDown from "../containers/monitoringModule/serversDropDown";
import AllServersDropDown from "../containers/monitoringModule/serversDropDown/allServersDropDown"

import { DROPDOWN_PATH as DROPDOWN_PATH_CLOUDS } from "../containers/monitoringModule/cloudsDropDown";

import AWS from "../containers/monitoringModule/cloudsDropDown/aws"

import { Navigate } from "react-router-dom";
import { PAGE_PATH as PAGE_PATH_DEVICE } from "../containers/monitoringModule/devices/constants";
import { PAGE_PATH as PAGE_PATH_ALERT } from "../containers/monitoringModule/alerts/constants";
import { PAGE_PATH as PAGE_PATH_CREDENTIAL } from "../containers/monitoringModule/credentials/constants";

import { DROPDOWN_PATH as DROPDOWN_PATH_ALL_SERVERS } from "../containers/monitoringModule/serversDropDown/allServersDropDown";


import { PAGE_PATH as PAGE_PATH_DEVICES } from "../containers/monitoringModule/serversDropDown/allServersDropDown/devices/constants";
import { PAGE_PATH as PAGE_PATH_INTERFACE } from "../containers/monitoringModule/serversDropDown/allServersDropDown/interfaces/constants";




import { PAGE_PATH as PAGE_PATH_CLOUDS } from "../containers/monitoringModule/clouds/constants";

import { PAGE_PATH as PAGE_PATH_AWS } from "../containers/monitoringModule/cloudsDropDown/aws/constants";
import { MODULE_PATH } from "../containers/monitoringModule";


import LinuxDropDown from "../containers/monitoringModule/serversDropDown/linuxDropDown";
import AllDevicesDropDown from "../containers/monitoringModule/serversDropDown/allServersDropDown";
import { PAGE_PATH as PAGE_PATH_ALL_DEVICES } from "../containers/monitoringModule/serversDropDown/allServersDropDown/devices/constants";

import { DROPDOWN_PATH as DROPDOWN_PATH_ALL_DEVICES } from "../containers/monitoringModule/serversDropDown/allServersDropDown";
import { DROPDOWN_PATH as DROPDOWN_PATH_SERVERS } from "../containers/monitoringModule/serversDropDown";
import { DROPDOWN_PATH as DROPDOWN_PATH_LINUX } from "../containers/monitoringModule//serversDropDown/linuxDropDown";


const routes = {
  path: MODULE_PATH,
  element: <MonitoringModule />,
  children: [
    {
      path: `/${MODULE_PATH}`,
      element: <Navigate to={PAGE_PATH_DEVICE} replace />,
    },
    {
      path: PAGE_PATH_DEVICE,
      element: <Devices />,
    },
    {
      path: PAGE_PATH_ALERT,
      element: <Alerts />,
    },
    {
      path: PAGE_PATH_CREDENTIAL,
      element: <Credentials />,
    },
    {
      path: DROPDOWN_PATH_CLOUDS,
      element: <CloudsDropDown />,
      children: [
        {
          path: PAGE_PATH_AWS,
          element: <AWS />,
        },

      ],
    },




    {
      path: DROPDOWN_PATH_SERVERS,
      element: <ServersDropDown />,
      children: [
        {
          path: DROPDOWN_PATH_ALL_SERVERS,
          element: <AllServersDropDown />,
          children: [
            {
              path: PAGE_PATH_DEVICE,
              element: <Devices />,
            },
            {
              path: PAGE_PATH_INTERFACE,
              element: <Interfaces />,
            },

          ],
        },
      ],
    },
    {
      path: DROPDOWN_PATH_SERVERS,
      element: <serversDropDown />,
      children: [
        {
          path: DROPDOWN_PATH_LINUX,
          element: <LinuxDropDown />,
          children: [
            {
              path: PAGE_PATH_ALL_DEVICES,
              element: <AllDevices />,
            },

          ],
        },
      ],
    },

  ],
};

export default routes;
