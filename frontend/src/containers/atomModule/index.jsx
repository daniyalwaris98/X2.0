import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_ATOM,
  PAGE_PATH as PAGE_PATH_ATOM,
} from "./atom/constants";
import {
  PAGE_NAME as PAGE_NAME_PASSWORD_GROUP,
  PAGE_PATH as PAGE_PATH_PASSWORD_GROUP,
} from "./passwordGroup/constants";

export const MODULE_PATH = "atom_module";

const menuItems = [
  { id: PAGE_PATH_ATOM, name: PAGE_NAME_ATOM, path: PAGE_PATH_ATOM },
  {
    id: PAGE_PATH_PASSWORD_GROUP,
    name: PAGE_NAME_PASSWORD_GROUP,
    path: PAGE_PATH_PASSWORD_GROUP,
  },
];

function Index(props) {
  let pagePath = getPathAllSegments();
  if (pagePath.length === 2 && pagePath[1] === MODULE_PATH) {
    pagePath = [PAGE_PATH_ATOM];
  } else pagePath = pagePath.splice(2);

  return (
    <>
      <Card
        sx={{
          marginBottom: "10px",
          height: "50px",
        }}
      >
        <HorizontalMenu menuItems={menuItems} defaultPagePath={pagePath} />
      </Card>
      <Outlet />
    </>
  );
}

export default Index;
