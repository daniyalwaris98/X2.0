import React from "react";
import { Navigate } from "react-router-dom";
import IPAMModule from "../containers/ipamModule";
import Devices from "../containers/ipamModule/devices";
import DeviceSubnets from "../containers/ipamModule/deviceSubnet";
import { PAGE_PATH as PAGE_PATH_DEVICES } from "../containers/ipamModule/devices/constants";
import { PAGE_PATH as PAGE_PATH_DEVICE_SUBNET } from "../containers/ipamModule/deviceSubnet/constants";
import { MODULE_PATH } from "../containers/ipamModule";

const routes = {
  path: MODULE_PATH,
  element: <IPAMModule />,
  children: [
    {
      path: `/${MODULE_PATH}`,
      element: <Navigate to={PAGE_PATH_DEVICES} replace />,
    },
    {
      path: PAGE_PATH_DEVICES,
      element: <Devices />,
    },
    {
      path: PAGE_PATH_DEVICE_SUBNET,
      element: <DeviceSubnets />,
    },
  ],
};

export default routes;
