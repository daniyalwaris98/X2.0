import React from "react";
import UamModule from "../containers/uamModule";
import Sites from "../containers/uamModule/sites";
import Racks from "../containers/uamModule/racks";
import Devices from "../containers/uamModule/devices";
import Boards from "../containers/uamModule/boards";
import SubBoards from "../containers/uamModule/subBoards";
import Sfps from "../containers/uamModule/sfps";
import Licenses from "../containers/uamModule/licenses";
import Aps from "../containers/uamModule/aps";
import Hwlifecycle from "../containers/uamModule/hwLifeCycle";
import { Navigate } from "react-router-dom";

const routes = {
  path: "uam_module",
  element: <UamModule />,
  children: [
    {
      path: "/uam_module", // Set the default path to "atom"
      element: <Navigate to="site" replace />,
    },
    {
      path: "site",
      element: <Sites />,
    },
    {
      path: "rack",
      element: <Racks />,
    },
    {
      path: "device",
      element: <Devices />,
    },
    {
      path: "board",
      element: <Boards />,
    },
    {
      path: "sub_board",
      element: <SubBoards />,
    },
    {
      path: "sfp",
      element: <Sfps />,
    },
    {
      path: "license",
      element: <Licenses />,
    },
    {
      path: "ap",
      element: <Aps />,
    },
    {
      path: "hw_life_cycle",
      element: <Hwlifecycle />,
    },
  ],
};

export default routes;
