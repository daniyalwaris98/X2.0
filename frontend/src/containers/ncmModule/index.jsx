import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_CONFIG_DATA,
  PAGE_PATH as PAGE_PATH_CONFIG_DATA,
} from "./configData/constants";

export const MODULE_PATH = "ncm_module";

const menuItems = [
  {
    id: PAGE_PATH_CONFIG_DATA,
    name: PAGE_NAME_CONFIG_DATA,
    path: PAGE_PATH_CONFIG_DATA,
  },
];

function Index(props) {
  let pagePath = getPathAllSegments();
  if (pagePath.length === 2 && pagePath[1] === MODULE_PATH) {
    pagePath = [PAGE_PATH_CONFIG_DATA];
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
