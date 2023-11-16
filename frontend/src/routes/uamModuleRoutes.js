import React from "react";
// import AtomModule from "../containers/atomModule";
import UamModule from "../containers/uamModule";
import Sites from "../containers/uamModule/sites";
import Racks from "../containers/uamModule/racks";
import Devices from "../containers/uamModule/devices";
import Modules from "../containers/uamModule/modules";
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
      path: "modules",
      element: <Modules />,
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
