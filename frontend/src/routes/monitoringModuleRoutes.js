import React from "react";
import MonitoringModule from "../containers/monitoringModule";
import Devices from "../containers/monitoringModule/devices";
import Alerts from "../containers/monitoringModule/alerts";
import Credentials from "../containers/monitoringModule/credentials";

import { Navigate } from "react-router-dom";
import { PAGE_PATH as PAGE_PATH_DEVICE } from "../containers/monitoringModule/devices/constants";
import { PAGE_PATH as PAGE_PATH_ALERT } from "../containers/monitoringModule/alerts/constants";
import { PAGE_PATH as PAGE_PATH_CREDENTIAL } from "../containers/monitoringModule/credentials/constants";

import { MODULE_PATH } from "../containers/monitoringModule";


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
  
  ],
};

export default routes;
