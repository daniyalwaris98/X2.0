import React from "react";
import AtomModule from "../containers/atomModule";
import Atom from "../containers/atomModule/atom";
import PasswordGroup from "../containers/atomModule/passwordGroup";
import { Navigate } from "react-router-dom";
import { PAGE_PATH as PAGE_PATH_ATOM } from "../containers/atomModule/atom/constants";
import { PAGE_PATH as PAGE_PATH_PASSWORD_GROUP } from "../containers/atomModule/passwordGroup/constants";
import { MODULE_PATH } from "../containers/atomModule";

const routes = {
  path: MODULE_PATH,
  element: <AtomModule />,
  children: [
    {
      path: `/${MODULE_PATH}`,
      element: <Navigate to={PAGE_PATH_ATOM} replace />,
    },
    {
      path: PAGE_PATH_ATOM,
      element: <Atom />,
    },
    {
      path: PAGE_PATH_PASSWORD_GROUP,
      element: <PasswordGroup />,
    },
  ],
};

export default routes;
