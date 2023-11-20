import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/mainLayout";
import AtomModuleRoutes from "./atomModuleRoutes";
import UamModuleRoutes from "./uamModuleRoutes"
import Atom from "../containers/atomModule/atom";
import Uam from "../containers/uamModule/sites"
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [AtomModuleRoutes, UamModuleRoutes],
  },
  {
    path: "/Atom",
    element: <Atom />,
  },
  {
    path: "/Uam",
    element: <Uam />,
  },
]);

export default router;
