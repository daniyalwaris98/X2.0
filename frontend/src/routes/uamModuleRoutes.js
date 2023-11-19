import React from "react";
import UamModule from "../containers/uamModule";
import Sites from "../containers/uamModule/sites";
import Racks from "../containers/uamModule/racks";
import Devices from "../containers/uamModule/devices";
import Sfps from "../containers/uamModule/sfps";
import Licenses from "../containers/uamModule/licences";
import Aps from "../containers/uamModule/aps";
import Hwlifecycle from "../containers/uamModule/hwLiveCycle";

const routes = {
  path: "uam_module",
  element: <UamModule />,
  children: [
    {
      path: "sites",
      element: <Sites />,
    },
    {
      path: "racks",
      element: <Racks />,
    },
    {
      path: "devices",
      element: <Devices />,
    },
    {
      path: "boards",
      element: <Devices />,
    },
    {
      path: "sub_boards",
      element: <Devices />,
    },
    {
      path: "sfps",
      element: <Sfps />,
    },
    {
      path: "licenses",
      element: <Licenses />,
    },
    {
      path: "aps",
      element: <Aps />,
    },
    {
      path: "hw_lifecycle",
      element: <Hwlifecycle />,
    },
  ],
};

export default routes;
