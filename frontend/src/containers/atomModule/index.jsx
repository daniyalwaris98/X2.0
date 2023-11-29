import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu";
import {
  PAGE_NAME as PAGE_NAME_ATOM,
  PAGE_PATH as PAGE_PATH_ATOM,
} from "./atom/constants";
import {
  PAGE_NAME as PAGE_NAME_PASSWORD_GROUP,
  PAGE_PATH as PAGE_PATH_PASSWORD_GROUP,
} from "./passwordGroup/constants";
import { getPathLastSegment } from "../../utils/helpers";

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
  let pagePath = getPathLastSegment();
  if (pagePath === MODULE_PATH) pagePath = PAGE_PATH_ATOM;

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
