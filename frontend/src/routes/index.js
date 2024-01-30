import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../containers/login";
import MainLayout from "../layouts/mainLayout";
import AdminModuleRoutes from "./adminModuleRoutes";
import atomModuleRoutes from "./atomModuleRoutes";
import UamModuleRoutes from "./uamModuleRoutes";
import MonitoringModuleRoutes from "./monitoringModuleRoutes";
import AutoDiscoveryModuleRoutes from "./autoDiscoveryModuleRoutes";
import NcmModuleRoutes from "./ncmModuleRoutes";
import IpamModuleRoutes from "./ipamModuleRoutes";
import DefaultFallbackUI from "../components/fallbackUI";
import {
  getRoleConfigurationsFromToken,
  isModuleAllowed,
} from "../utils/helpers";
import { MODULE_PATH as MODULE_PATH_ADMIN } from "../containers/adminModule";
import { MODULE_PATH as MODULE_PATH_ATOM } from "../containers/atomModule";
import { MODULE_PATH as MODULE_PATH_AUTO_DISCOVERY } from "../containers/autoDiscoveryModule";
import { MODULE_PATH as MODULE_PATH_IPAM } from "../containers/ipamModule";
import { MODULE_PATH as MODULE_PATH_MONITORING } from "../containers/monitoringModule";
import { MODULE_PATH as MODULE_PATH_NCM } from "../containers/ncmModule";
import { MODULE_PATH as MODULE_PATH_UAM } from "../containers/uamModule";

const generateRoutes = (roleConfigurations) => {
  return [
    {
      path: "/",
      // element: <Login />,
      element: <MainLayout />,
      children: [
        isModuleAllowed(roleConfigurations, MODULE_PATH_ADMIN)
          ? AdminModuleRoutes
          : null,
        isModuleAllowed(roleConfigurations, MODULE_PATH_ATOM)
          ? atomModuleRoutes(roleConfigurations)
          : null,
        isModuleAllowed(roleConfigurations, MODULE_PATH_AUTO_DISCOVERY)
          ? AutoDiscoveryModuleRoutes
          : null,
        isModuleAllowed(roleConfigurations, MODULE_PATH_IPAM)
          ? IpamModuleRoutes
          : null,
        isModuleAllowed(roleConfigurations, MODULE_PATH_MONITORING)
          ? MonitoringModuleRoutes
          : null,

        isModuleAllowed(roleConfigurations, MODULE_PATH_NCM)
          ? NcmModuleRoutes
          : null,
        isModuleAllowed(roleConfigurations, MODULE_PATH_UAM)
          ? UamModuleRoutes
          : null,
      ].filter((item) => item !== null),
      errorElement: <DefaultFallbackUI />,
    },
  ];
};

const roleConfigurations = getRoleConfigurationsFromToken();
const routes = generateRoutes(roleConfigurations);
const router = createBrowserRouter(routes);

export default router;
