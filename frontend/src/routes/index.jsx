import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/mainLayout";
import AtomModuleRoutes from "./atomModuleRoutes";
import UamModuleRoutes from "./uamModuleRoutes";
import MonitoringModuleRoutes from "./monitoringModuleRoutes";
import AutoDiscoveryModuleRoutes from "./autoDiscoveryModuleRoutes";
import DefaultFallbackUI from "../components/fallbackUI";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      AtomModuleRoutes,
      UamModuleRoutes,
      MonitoringModuleRoutes,
      AutoDiscoveryModuleRoutes,
    ],
    errorElement: <DefaultFallbackUI />,
  },
]);

export default router;
