import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_DASHBOARD,
  PAGE_PATH as PAGE_PATH_DASHBOARD,
} from "./dashboard/constants";
import {
  PAGE_NAME as PAGE_NAME_MANAGE_CONFIGURATIONS,
  PAGE_PATH as PAGE_PATH_MANAGE_CONFIGURATIONS,
} from "./manageConfigurations/constants";
export const MODULE_PATH = "ncm_module";

const menuItems = [
  {
    id: PAGE_PATH_DASHBOARD,
    name: PAGE_NAME_DASHBOARD,
    path: PAGE_PATH_DASHBOARD,
  },
  {
    id: PAGE_PATH_MANAGE_CONFIGURATIONS,
    name: PAGE_NAME_MANAGE_CONFIGURATIONS,
    path: PAGE_PATH_MANAGE_CONFIGURATIONS,
  },
];

function Index(props) {
  let pagePath = getPathAllSegments();
  if (pagePath.length === 2 && pagePath[1] === MODULE_PATH) {
    pagePath = [PAGE_PATH_MANAGE_CONFIGURATIONS];
  } else pagePath = pagePath.splice(2);

  return (
    <>
      <Card>
        <HorizontalMenu menuItems={menuItems} defaultPagePath={pagePath} />
      </Card>
      <Outlet />
    </>
  );
}

export default Index;
