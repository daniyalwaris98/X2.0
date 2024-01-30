import React from "react";
import AtomModule from "../containers/atomModule";
import Atoms from "../containers/atomModule/atoms";
import PasswordGroups from "../containers/atomModule/passwordGroups";
import { Navigate } from "react-router-dom";
import { PAGE_PATH as PAGE_PATH_ATOMS } from "../containers/atomModule/atoms/constants";
import { PAGE_PATH as PAGE_PATH_PASSWORD_GROUPS } from "../containers/atomModule/passwordGroups/constants";
import { MODULE_PATH } from "../containers/atomModule";

export default function atomModuleRoutes(roleConfigurations) {
  let children = [
    {
      path: PAGE_PATH_ATOMS,
      element: <Atoms />,
    },
    {
      path: PAGE_PATH_PASSWORD_GROUPS,
      element: <PasswordGroups />,
    },
  ].filter((item) =>
    roleConfigurations
      ? roleConfigurations[MODULE_PATH]?.pages[item.path]?.view
      : true
  );

  if (children.length > 0) {
    if (children[0].path) {
      children = [
        {
          path: `/${MODULE_PATH}`,
          element: <Navigate to={children[0].path} replace />,
        },
        ...children,
      ];
    }
  }

  return {
    path: MODULE_PATH,
    element: <AtomModule />,
    children,
  };
}
