import React from "react";
import { Navigate } from "react-router-dom";

import AutoDiscoveryModule from "../containers/autoDiscoveryModule";

import ManageNetworks from "../containers/autoDiscoveryModule/manageNetworks";
import Discovery from "../containers/autoDiscoveryModule/discovery";
import ManageDevices from "../containers/autoDiscoveryModule/manageDevices";

import ManageCredentialsDropDown from "../containers/autoDiscoveryModule/manageCredentialsDropDown";
import LoginCredentials from "../containers/autoDiscoveryModule//manageCredentialsDropDown/loginCredentials";

import SNMPDropDown from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown";
import V1V2Credentials from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v1V2Credentials";
import V3Credentials from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v3Credentials";

import { PAGE_PATH as PAGE_PATH_MANAGE_NETWORKS } from "../containers/autoDiscoveryModule/manageNetworks/constants";
import { PAGE_PATH as PAGE_PATH_DISCOVERY } from "../containers/autoDiscoveryModule/discovery/constants";
import { PAGE_PATH as PAGE_PATH_MANAGE_DEVICES } from "../containers/autoDiscoveryModule/manageDevices/constants";

import { DROPDOWN_PATH as DROPDOWN_PATH_MANAGE_CREDENTIALS } from "../containers/autoDiscoveryModule/manageCredentialsDropDown";
import { PAGE_PATH as PAGE_PATH_LOGIN_CREDENTIALS } from "../containers/autoDiscoveryModule/manageCredentialsDropDown/loginCredentials/constants";

import { DROPDOWN_PATH as DROPDOWN_PATH_SNMP } from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown";
import { PAGE_PATH as PAGE_PATH_V1_V2_CREDENTIALS } from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v1V2Credentials/constants";
import { PAGE_PATH as PAGE_PATH_V3_CREDENTIALS } from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v3Credentials/constants";

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
      path: DROPDOWN_PATH_MANAGE_CREDENTIALS,
      element: <ManageCredentialsDropDown />,
      children: [
        {
          path: PAGE_PATH_LOGIN_CREDENTIALS,
          element: <LoginCredentials />,
        },
        {
          path: DROPDOWN_PATH_SNMP,
          element: <SNMPDropDown />,
          children: [
            {
              path: PAGE_PATH_V1_V2_CREDENTIALS,
              element: <V1V2Credentials />,
            },
            {
              path: PAGE_PATH_V3_CREDENTIALS,
              element: <V3Credentials />,
            },
          ],
        },
      ],
    },
  ],
};

export default routes;
