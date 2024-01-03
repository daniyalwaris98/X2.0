import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_MANAGE_CONFIGURATIONS,
  PAGE_PATH as PAGE_PATH_MANAGE_CONFIGURATIONS,
} from "./manageConfigurations/constants";
import {
  LANDING_PAGE_NAME as LANDING_PAGE_NAME_MANAGE_CONFIGURATIONS,
  LANDING_PAGE_PATH as LANDING_PAGE_PATH_MANAGE_CONFIGURATIONS,
} from "./manageConfigurationsLanding";
export const MODULE_PATH = "ncm_module";

const menuItems = [
  {
    id: PAGE_PATH_MANAGE_CONFIGURATIONS,
    name: PAGE_NAME_MANAGE_CONFIGURATIONS,
    path: PAGE_PATH_MANAGE_CONFIGURATIONS,
  },
  {
    id: LANDING_PAGE_PATH_MANAGE_CONFIGURATIONS,
    name: LANDING_PAGE_NAME_MANAGE_CONFIGURATIONS,
    path: LANDING_PAGE_PATH_MANAGE_CONFIGURATIONS,
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
