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
import { PAGE_PATH as PAGE_PATH_SITE } from "../containers/uamModule/sites/constants";
import { PAGE_PATH as PAGE_PATH_RACK } from "../containers/uamModule/racks/constants";
import { PAGE_PATH as PAGE_PATH_DEVICE } from "../containers/uamModule/devices/constants";
import { PAGE_PATH as PAGE_PATH_BOARD } from "../containers/uamModule/boards/constants";
import { PAGE_PATH as PAGE_PATH_SUB_BOARD } from "../containers/uamModule/subBoards/constants";
import { PAGE_PATH as PAGE_PATH_SFP } from "../containers/uamModule/sfps/constants";
import { PAGE_PATH as PAGE_PATH_LICENSE } from "../containers/uamModule/licenses/constants";
import { PAGE_PATH as PAGE_PATH_AP } from "../containers/uamModule/aps/constants";
import { PAGE_PATH as PAGE_PATH_HW_LIFE_CYCLE } from "../containers/uamModule/hwLifeCycle/constants";
import { MODULE_PATH } from "../containers/uamModule";

const routes = {
  path: MODULE_PATH,
  element: <UamModule />,
  children: [
    {
      path: `/${MODULE_PATH}`,
      element: <Navigate to={PAGE_PATH_SITE} replace />,
    },
    {
      path: PAGE_PATH_SITE,
      element: <Sites />,
    },
    {
      path: PAGE_PATH_RACK,
      element: <Racks />,
    },
    {
      path: PAGE_PATH_DEVICE,
      element: <Devices />,
    },
    {
      path: PAGE_PATH_BOARD,
      element: <Boards />,
    },
    {
      path: PAGE_PATH_SUB_BOARD,
      element: <SubBoards />,
    },
    {
      path: PAGE_PATH_SFP,
      element: <Sfps />,
    },
    {
      path: PAGE_PATH_LICENSE,
      element: <Licenses />,
    },
    {
      path: PAGE_PATH_AP,
      element: <Aps />,
    },
    {
      path: PAGE_PATH_HW_LIFE_CYCLE,
      element: <Hwlifecycle />,
    },
  ],
};

export default routes;
