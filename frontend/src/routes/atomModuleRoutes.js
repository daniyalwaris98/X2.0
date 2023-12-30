import React from "react";
import AtomModule from "../containers/atomModule";
import Atoms from "../containers/atomModule/atoms";
import PasswordGroups from "../containers/atomModule/passwordGroups";
import { Navigate } from "react-router-dom";
import { PAGE_PATH as PAGE_PATH_ATOMS } from "../containers/atomModule/atoms/constants";
import { PAGE_PATH as PAGE_PATH_PASSWORD_GROUPS } from "../containers/atomModule/passwordGroups/constants";
import { MODULE_PATH } from "../containers/atomModule";

const routes = {
  path: MODULE_PATH,
  element: <AtomModule />,
  children: [
    {
      path: `/${MODULE_PATH}`,
      element: <Navigate to={PAGE_PATH_ATOMS} replace />,
    },
    {
      path: PAGE_PATH_ATOMS,
      element: <Atoms />,
    },
    {
      path: PAGE_PATH_PASSWORD_GROUPS,
      element: <PasswordGroups />,
    },
  ],
};

export default routes;
