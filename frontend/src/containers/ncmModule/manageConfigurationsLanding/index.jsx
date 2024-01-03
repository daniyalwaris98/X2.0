import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../../components/cards";
import HorizontalMenu from "../../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_CONFIGURATIONS,
  PAGE_PATH as PAGE_PATH_CONFIGURATIONS,
} from "./configurationBackups/constants";

export const LANDING_PAGE_NAME = "Manage Configurations";
export const LANDING_PAGE_PATH = "manage_configurations_landing";

const menuItems = [
  {
    id: PAGE_PATH_CONFIGURATIONS,
    name: PAGE_NAME_CONFIGURATIONS,
    path: PAGE_PATH_CONFIGURATIONS,
  },
];

function Index(props) {
  let pagePath = getPathAllSegments();
  if (pagePath.length === 3 && pagePath[2] === LANDING_PAGE_PATH) {
    pagePath = [PAGE_PATH_CONFIGURATIONS];
  } else pagePath = pagePath.splice(3);

  return (
    <>
      <Card
        sx={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <HorizontalMenu menuItems={menuItems} defaultPagePath={pagePath} />
      </Card>
      <Outlet />
    </>
  );
}

export default Index;
