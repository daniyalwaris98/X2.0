import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../containers/login";
import MainLayout from "../layouts/mainLayout";
import AdminModuleRoutes from "./adminModuleRoutes";
import AtomModuleRoutes from "./atomModuleRoutes";
import UamModuleRoutes from "./uamModuleRoutes";
import MonitoringModuleRoutes from "./monitoringModuleRoutes";
import AutoDiscoveryModuleRoutes from "./autoDiscoveryModuleRoutes";
import NCMModuleRoutes from "./ncmModuleRoutes";
import IPAMModuleRoutes from "./ipamModuleRoutes";
import DefaultFallbackUI from "../components/fallbackUI";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <Login />,
    element: <MainLayout />,
    children: [
      AdminModuleRoutes,
      AtomModuleRoutes,
      UamModuleRoutes,
      MonitoringModuleRoutes,
      AutoDiscoveryModuleRoutes,
      NCMModuleRoutes,
      IPAMModuleRoutes,
    ],
    errorElement: <DefaultFallbackUI />,
  },
]);

export default router;
