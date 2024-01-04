import React from "react";
import MonitoringModule from "../containers/monitoringModule";
// import Devices from "../containers/monitoringModule/devices";
import Alerts from "../containers/monitoringModule/alerts";
import Credentials from "../containers/monitoringModule/credentials";
// import Clouds from "../containers/monitoringModule/clouds";
import Interfaces from "../containers/monitoringModule/serversDropDown/allServersDropDown/interfaces"
import LinuxInterfaces from "../containers/monitoringModule/serversDropDown/linuxDropDown/interfaces"
import Device from "../containers/monitoringModule/devices"
import ServerDevices from "../containers/monitoringModule/serversDropDown/allServersDropDown/devices"


import NetworkDevices from "../containers/monitoringModule/networksDropDown/allDevicesDropDown/devices"
import NetworkInterfaces from "../containers/monitoringModule/networksDropDown/allDevicesDropDown/interfaces"

import RoutersDevices from "../containers/monitoringModule/networksDropDown/routeDropDown/devices"
import RoutersInterfaces from "../containers/monitoringModule/networksDropDown/routeDropDown/interfaces"


import SwitchesDevices from "../containers/monitoringModule/networksDropDown/switchesDropDown/devices"
import SwitchesInterfaces from "../containers/monitoringModule/networksDropDown/switchesDropDown/interfaces"

import LinuxDevices from "../containers/monitoringModule/serversDropDown/linuxDropDown/devices"


import AllDevices from "../containers/monitoringModule/serversDropDown/allServersDropDown/devices";

import CloudsDropDown from "../containers/monitoringModule/cloudsDropDown"
import ServersDropDown from "../containers/monitoringModule/serversDropDown";
import AllServersDropDown from "../containers/monitoringModule/serversDropDown/allServersDropDown"

import NetworkDropDown from "../containers/monitoringModule/networksDropDown"

import RoutersDropDown from "../containers/monitoringModule/networksDropDown/routeDropDown"

import SwitchesDropDown from "../containers/monitoringModule/networksDropDown/switchesDropDown"

import AllDevicesDropDown from "../containers/monitoringModule/networksDropDown/allDevicesDropDown"

import { DROPDOWN_PATH as DROPDOWN_PATH_CLOUDS } from "../containers/monitoringModule/cloudsDropDown";

import AWS from "../containers/monitoringModule/cloudsDropDown/aws"

import Clouds from "../containers/monitoringModule/cloudsDropDown/clouds"

import { Navigate } from "react-router-dom";

import { PAGE_PATH as PAGE_PATH_LINUX_DEVICE } from "../containers/monitoringModule/serversDropDown/linuxDropDown/devices/constants";

import { PAGE_PATH as PAGE_PATH_DEVICE } from "../containers/monitoringModule/devices/constants";
import { PAGE_PATH as PAGE_PATH_ALERTS } from "../containers/monitoringModule/alerts/constants";
import { PAGE_PATH as PAGE_PATH_CREDENTIAL } from "../containers/monitoringModule/credentials/constants";



import { DROPDOWN_PATH as DROPDOWN_PATH_SERVERS } from "../containers/monitoringModule/serversDropDown";
import { DROPDOWN_PATH as DROPDOWN_PATH_ALL_SERVERS } from "../containers/monitoringModule/serversDropDown/allServersDropDown";


import { DROPDOWN_PATH as DROPDOWN_PATH_NETWORKS } from "../containers/monitoringModule/networksDropDown";
import { DROPDOWN_PATH as DROPDOWN_PATH_ALL_DEVICES } from "../containers/monitoringModule/networksDropDown/allDevicesDropDown";

import { DROPDOWN_PATH as DROPDOWN_PATH_ROUTERS } from "../containers/monitoringModule/networksDropDown/routeDropDown";
import { DROPDOWN_PATH as DROPDOWN_PATH_SWITCHES } from "../containers/monitoringModule/networksDropDown/switchesDropDown";








import { PAGE_PATH as PAGE_PATH_SERVERS_DEVICES } from "../containers/monitoringModule/serversDropDown/allServersDropDown/devices/constants";
import { PAGE_PATH as PAGE_PATH_INTERFACE } from "../containers/monitoringModule/serversDropDown/allServersDropDown/interfaces/constants";

import { PAGE_PATH as PAGE_PATH_LINUX_INTERFACES } from "../containers/monitoringModule/serversDropDown/linuxDropDown/interfaces/constants";


import { PAGE_PATH as PAGE_PATH_NETWORKS_DEVICES } from "../containers/monitoringModule/networksDropDown/allDevicesDropDown/devices/constants";
import { PAGE_PATH as PAGE_PATH_NETWORKS_INTERFACE } from "../containers/monitoringModule/networksDropDown/allDevicesDropDown/interfaces/constants";


import { PAGE_PATH as PAGE_PATH_ROUTERS_INTERFACE } from "../containers/monitoringModule/networksDropDown/routeDropDown/interfaces/constants";
import { PAGE_PATH as PAGE_PATH_ROUTERS_DEVICES } from "../containers/monitoringModule/networksDropDown/routeDropDown/devices/constants";


import { PAGE_PATH as PAGE_PATH_SWITCHES_INTERFACE } from "../containers/monitoringModule/networksDropDown/switchesDropDown/interfaces/constants";
import { PAGE_PATH as PAGE_PATH_SWITCHES_DEVICES } from "../containers/monitoringModule/networksDropDown/switchesDropDown/devices/constants";


// import { PAGE_PATH as PAGE_PATH_CLOUDS } from "../containers/monitoringModule/clouds/constants";

import { PAGE_PATH as PAGE_PATH_AWS } from "../containers/monitoringModule/cloudsDropDown/aws/constants";
import { PAGE_PATH as PAGE_PATH_CLOUDS } from "../containers/monitoringModule/cloudsDropDown/clouds/constants";

import { MODULE_PATH } from "../containers/monitoringModule";


import LinuxDropDown from "../containers/monitoringModule/serversDropDown/linuxDropDown";
// import AllDevicesDropDown from "../containers/monitoringModule/serversDropDown/allServersDropDown";
import { PAGE_PATH as PAGE_PATH_ALL_DEVICES } from "../containers/monitoringModule/serversDropDown/allServersDropDown/devices/constants";

// import { DROPDOWN_PATH as DROPDOWN_PATH_ALL_DEVICES } from "../containers/monitoringModule/serversDropDown/allServersDropDown";
import { DROPDOWN_PATH as DROPDOWN_PATH_LINUX } from "../containers/monitoringModule/serversDropDown/linuxDropDown";




// credential drop down option started
import ManageCredentialsDropDown from "../containers/autoDiscoveryModule/manageCredentialsDropDown";
import LoginCredentials from "../containers/autoDiscoveryModule//manageCredentialsDropDown/loginCredentials";

import SNMPDropDown from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown";


import AWSDropDown from "../containers/monitoringModule/cloudsDropDown/awsDropDown";

import V1V2Credentials from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v1V2Credentials";
import V3Credentials from "../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v3Credentials";


import E3 from "../containers/monitoringModule/cloudsDropDown/awsDropDown/e3";  

import EC2 from "../containers/monitoringModule/cloudsDropDown/awsDropDown/ec2";  
import ELB from "../containers/monitoringModule/cloudsDropDown/awsDropDown/elb";  


// import { DROPDOWN_PATH as DROPDOWN_PATH_MANAGE_CREDENTIALS } from "../containers/autoDiscoveryModule/manageCredentialsDropDown";
import { DROPDOWN_PATH as DROPDOWN_PATH_MANAGE_CREDENTIALS } from "../containers/monitoringModule/manageCredentialsDropDown";
import { PAGE_PATH as PAGE_PATH_LOGIN_CREDENTIALS } from "../containers/monitoringModule/manageCredentialsDropDown/loginCredentials/constants";

import { DROPDOWN_PATH as DROPDOWN_PATH_SNMP } from "../containers/monitoringModule/manageCredentialsDropDown/snmpDropDown";


import { DROPDOWN_PATH as DROPDOWN_PATH_AWS } from "../containers/monitoringModule/cloudsDropDown/awsDropDown";

import { PAGE_PATH as PAGE_PATH_V1_V2_CREDENTIALS } from "../containers/monitoringModule/manageCredentialsDropDown/snmpDropDown/v1V2Credentials/constants";

import { PAGE_PATH as PAGE_PATH_E3 } from "../containers/monitoringModule/cloudsDropDown/awsDropDown/e3/constants";
import { PAGE_PATH as PAGE_PATH_EC2 } from "../containers/monitoringModule/cloudsDropDown/awsDropDown/ec2/constants";
import { PAGE_PATH as PAGE_PATH_ELB } from "../containers/monitoringModule/cloudsDropDown/awsDropDown/elb/constants";





import { PAGE_PATH as PAGE_PATH_V3_CREDENTIALS } from "../containers/monitoringModule/manageCredentialsDropDown/snmpDropDown/v3Credentials/constants";


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
      element: <Device />,
    },
    {
      path: PAGE_PATH_ALERTS,
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
          path: PAGE_PATH_CLOUDS,
          element: <Clouds />,
        },
        {
          path: DROPDOWN_PATH_AWS,
          element: <AWSDropDown />,
          children: [
            {
              path: PAGE_PATH_E3,
              element: <E3/>,
            },
            {
              path: PAGE_PATH_EC2,
              element: <EC2 />,
            },
            {
              path: PAGE_PATH_ELB,
              element: <ELB />,
            },
          ],
        },

      ],
    },





    {
      path: DROPDOWN_PATH_CLOUDS,
      element: <CloudsDropDown />,
      children: [
        {
          path: PAGE_PATH_CLOUDS,
          element: <Clouds />,
        },
        {
          path: DROPDOWN_PATH_AWS,
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



    // {
    //   path: DROPDOWN_PATH_SERVERS,
    //   element: <ServersDropDown />,
    //   children: [
    //     {
    //       path: DROPDOWN_PATH_ALL_SERVERS,
    //       element: <AllServersDropDown />,
    //       children: [
    //         {
    //           path: PAGE_PATH_SERVERS_DEVICES,
    //           element: <ServerDevices />,
    //         },
    //         {
    //           path: PAGE_PATH_INTERFACE,
    //           element: <Interfaces />,
    //         },

    //       ],
    //     },
    //     {
    //       path: DROPDOWN_PATH_LINUX,
    //       element: <LinuxDropDown />,
    //       children: [
    //         {
    //           path: PAGE_PATH_LINUX_DEVICE,
    //           element: <LinuxDevices />,
    //         },
    //         {
    //           path: PAGE_PATH_LINUX_INTERFACES,
    //           element: <LinuxInterfaces />,
    //         },

    //       ],
    //     },
    //   ],
    // },

    {
      path: DROPDOWN_PATH_NETWORKS,
      element: <NetworkDropDown />,
      children: [
        {
          path: DROPDOWN_PATH_ALL_DEVICES,
          element: <AllDevicesDropDown />,
          children: [
            {
              path: PAGE_PATH_NETWORKS_DEVICES,
              element: <NetworkDevices />,
            },
            {
              path: PAGE_PATH_NETWORKS_INTERFACE,
              element: <NetworkInterfaces />,
            },

          ],
        },
        {
          path: DROPDOWN_PATH_ROUTERS,
          element: <RoutersDropDown />,
          children: [
            {
              path: PAGE_PATH_ROUTERS_DEVICES,
              element: <RoutersDevices />,
            },
            {
              path: PAGE_PATH_ROUTERS_INTERFACE,
              element: <RoutersInterfaces />,
            },

          ],
        },
        {
          path: DROPDOWN_PATH_SWITCHES,
          element: <SwitchesDropDown />,
          children: [
            {
              path: PAGE_PATH_SWITCHES_DEVICES,
              element: <SwitchesDevices />,
            },
            {
              path: PAGE_PATH_SWITCHES_INTERFACE,
              element: <SwitchesInterfaces />,
            },

          ],
        },
      
      ],
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
