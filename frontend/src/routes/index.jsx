import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/mainLayout";
import AtomModuleRoutes from "./atomModuleRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [AtomModuleRoutes],
  },
]);

export default router;
