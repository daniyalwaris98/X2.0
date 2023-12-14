import React from "react";
import NCMModule from "../containers/ncmModule";
import ConfigData from "../containers/ncmModule/configData";
import { Navigate } from "react-router-dom";
import { PAGE_PATH as PAGE_PATH_CONFIG_DATA } from "../containers/ncmModule/configData/constants";
import { MODULE_PATH } from "../containers/ncmModule";

const routes = {
  path: MODULE_PATH,
  element: <NCMModule />,
  children: [
    {
      path: `/${MODULE_PATH}`,
      element: <Navigate to={PAGE_PATH_CONFIG_DATA} replace />,
    },
    {
      path: PAGE_PATH_CONFIG_DATA,
      element: <ConfigData />,
    },
  ],
};

export default routes;
