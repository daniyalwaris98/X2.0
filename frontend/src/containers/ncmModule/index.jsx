import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu";
import {
  PAGE_NAME as PAGE_NAME_CONFIG_DATA,
  PAGE_PATH as PAGE_PATH_CONFIG_DATA,
} from "./configData/constants";
import { getPathLastSegment } from "../../utils/helpers";

export const MODULE_PATH = "ncm_module";

const menuItems = [
  {
    id: PAGE_PATH_CONFIG_DATA,
    name: PAGE_NAME_CONFIG_DATA,
    path: PAGE_PATH_CONFIG_DATA,
  },
];

function Index(props) {
  let pagePath = getPathLastSegment();
  if (pagePath === MODULE_PATH) pagePath = PAGE_PATH_CONFIG_DATA;

  return (
    <>
      <Card
        sx={{
          marginBottom: "10px",
          height: "50px",
        }}
      >
        <HorizontalMenu menuItems={menuItems} defaultPage={pagePath} />
      </Card>
      <Outlet />
    </>
  );
}

export default Index;
