import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_ATOMS,
  PAGE_PATH as PAGE_PATH_ATOMS,
} from "./atoms/constants";
import {
  PAGE_NAME as PAGE_NAME_PASSWORD_GROUPS,
  PAGE_PATH as PAGE_PATH_PASSWORD_GROUPS,
} from "./passwordGroups/constants";

export const MODULE_PATH = "atom_module";

const menuItems = [
  { id: PAGE_PATH_ATOMS, name: PAGE_NAME_ATOMS, path: PAGE_PATH_ATOMS },
  {
    id: PAGE_PATH_PASSWORD_GROUPS,
    name: PAGE_NAME_PASSWORD_GROUPS,
    path: PAGE_PATH_PASSWORD_GROUPS,
  },
];

function Index(props) {
  let pagePath = getPathAllSegments();
  if (pagePath.length === 2 && pagePath[1] === MODULE_PATH) {
    pagePath = [PAGE_PATH_ATOMS];
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
