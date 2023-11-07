import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/mainLayout";
import AtomModuleRoutes from "./atomModuleRoutes";
import Atom from "../containers/atomModule/atom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [AtomModuleRoutes],
  },
  {
    path: "/Atom",
    element: <Atom />,
  },
]);

export default router;
