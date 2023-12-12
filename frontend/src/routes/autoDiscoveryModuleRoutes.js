import React from "react";
import AutoDiscoveryModule from "../containers/autoDiscoveryModule";
import ManageNetworks from "../containers/autoDiscoveryModule/manageNetworks";
import Discovery from "../containers/autoDiscoveryModule/discovery";
import ManageDevices from "../containers/autoDiscoveryModule/manageDevices";
import ManageCredentials from "../containers/autoDiscoveryModule/manageCredentials";
import { Navigate } from "react-router-dom";
import { PAGE_PATH as PAGE_PATH_MANAGE_NETWORKS } from "../containers/autoDiscoveryModule/manageNetworks/constants";
import { PAGE_PATH as PAGE_PATH_DISCOVERY } from "../containers/autoDiscoveryModule/discovery/constants";
import { PAGE_PATH as PAGE_PATH_MANAGE_DEVICES } from "../containers/autoDiscoveryModule/manageDevices/constants";
import { PAGE_PATH as PAGE_PATH_MANAGE_CREDENTIALS } from "../containers/autoDiscoveryModule/manageCredentials/constants";
import { MODULE_PATH } from "../containers/autoDiscoveryModule";

const routes = {
  path: MODULE_PATH,
  element: <AutoDiscoveryModule />,
  children: [
    {
      path: `/${MODULE_PATH}`,
      element: <Navigate to={PAGE_PATH_MANAGE_NETWORKS} replace />,
    },
    {
      path: PAGE_PATH_MANAGE_NETWORKS,
      element: <ManageNetworks />,
    },
    {
      path: PAGE_PATH_DISCOVERY,
      element: <Discovery />,
    },
    {
      path: PAGE_PATH_MANAGE_DEVICES,
      element: <ManageDevices />,
    },
    {
      path: PAGE_PATH_MANAGE_CREDENTIALS,
      element: <ManageCredentials />,
    },
  ],
};

export default routes;
