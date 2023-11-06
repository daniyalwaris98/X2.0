import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import FailedDevices from "../containers/adminModule/failedDevices";
import Atom from "../containers/atomModule";
import AutoDiscovery from "../containers/autoDiscoveryModule";
import ManageDevices from "../containers/autoDiscoveryModule/manageDevices";
const router = createBrowserRouter([
  {
    path: "/",
    element: <FailedDevices />,
  },
  {
    path: "/auto-discovery",
    element: <AutoDiscovery />,

    children: [
      {
        path: "manage-devices",
        element: <ManageDevices />,
      },
    ],
  },
  {
    path: "/Atom",
    element: <Atom />,
  },
]);

export default router;
