import React from "react";
import AutoDiscoveryModule from "../containers/autoDiscoveryModule";
import ManageNetworks from "../containers/autoDiscoveryModule/manageNetworks";
import Discovery from "../containers/autoDiscoveryModule/discovery";
import ManageDevices from "../containers/autoDiscoveryModule/manageDevices";
import ManageCredentials from "../containers/autoDiscoveryModule/manageCredentials";
import ManageCredentialsDropDown from "../containers/autoDiscoveryModule/manageCredentialsDropDown";
import Login from "../containers/autoDiscoveryModule//manageCredentialsDropDown/login";
import SNMPDropDown from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown";
import V1V2 from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v1V2";
import V3 from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v3";
import { Navigate } from "react-router-dom";
import { PAGE_PATH as PAGE_PATH_MANAGE_NETWORKS } from "../containers/autoDiscoveryModule/manageNetworks/constants";
import { PAGE_PATH as PAGE_PATH_DISCOVERY } from "../containers/autoDiscoveryModule/discovery/constants";
import { PAGE_PATH as PAGE_PATH_MANAGE_DEVICES } from "../containers/autoDiscoveryModule/manageDevices/constants";
import { PAGE_PATH as PAGE_PATH_MANAGE_CREDENTIALS } from "../containers/autoDiscoveryModule/manageCredentials/constants";
import { DROPDOWN_PATH as DROPDOWN_PATH_MANAGE_CREDENTIALS } from "../containers/autoDiscoveryModule/manageCredentialsDropDown";
import { PAGE_PATH as PAGE_PATH_LOGIN } from "../containers/autoDiscoveryModule/manageCredentialsDropDown/login/constants";
import { DROPDOWN_PATH as DROPDOWN_PATH_SNMP } from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown";
import { PAGE_PATH as PAGE_PATH_V1_V2 } from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v1V2/constants";
import { PAGE_PATH as PAGE_PATH_V3 } from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v3/constants";

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
    {
      path: DROPDOWN_PATH_MANAGE_CREDENTIALS,
      element: <ManageCredentialsDropDown />,
      children: [
        {
          path: PAGE_PATH_LOGIN,
          element: <Login />,
        },
        {
          path: DROPDOWN_PATH_SNMP,
          element: <SNMPDropDown />,
          children: [
            {
              path: PAGE_PATH_V1_V2,
              element: <V1V2 />,
            },
            {
              path: PAGE_PATH_V3,
              element: <V3 />,
            },
          ],
        },
      ],
    },
  ],
};

export default routes;
