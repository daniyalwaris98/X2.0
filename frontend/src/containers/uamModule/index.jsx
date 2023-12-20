import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_SITE,
  PAGE_PATH as PAGE_PATH_SITE,
} from "./sites/constants";
import {
  PAGE_NAME as PAGE_NAME_RACK,
  PAGE_PATH as PAGE_PATH_RACK,
} from "./racks/constants";
import {
  PAGE_NAME as PAGE_NAME_DEVICE,
  PAGE_PATH as PAGE_PATH_DEVICE,
} from "./devices/constants";
import {
  PAGE_NAME as PAGE_NAME_BOARD,
  PAGE_PATH as PAGE_PATH_BOARD,
} from "./boards/constants";
import {
  PAGE_NAME as PAGE_NAME_SUB_BOARD,
  PAGE_PATH as PAGE_PATH_SUB_BOARD,
} from "./subBoards/constants";
import {
  PAGE_NAME as PAGE_NAME_SFP,
  PAGE_PATH as PAGE_PATH_SFP,
} from "./sfps/constants";
import {
  PAGE_NAME as PAGE_NAME_LICENSE,
  PAGE_PATH as PAGE_PATH_LICENSE,
} from "./licenses/constants";
import {
  PAGE_NAME as PAGE_NAME_AP,
  PAGE_PATH as PAGE_PATH_AP,
} from "./aps/constants";
import {
  PAGE_NAME as PAGE_NAME_HW_LIFE_CYCLE,
  PAGE_PATH as PAGE_PATH_HW_LIFE_CYCLE,
} from "./hwLifeCycle/constants";

export const MODULE_PATH = "uam_module";

const menuItems = [
  { id: PAGE_PATH_SITE, name: PAGE_NAME_SITE, path: PAGE_PATH_SITE },
  { id: PAGE_PATH_RACK, name: PAGE_NAME_RACK, path: PAGE_PATH_RACK },
  { id: PAGE_PATH_DEVICE, name: PAGE_NAME_DEVICE, path: PAGE_PATH_DEVICE },
  { id: PAGE_PATH_BOARD, name: PAGE_NAME_BOARD, path: PAGE_PATH_BOARD },
  {
    id: PAGE_PATH_SUB_BOARD,
    name: PAGE_NAME_SUB_BOARD,
    path: PAGE_PATH_SUB_BOARD,
  },
  { id: PAGE_PATH_SFP, name: PAGE_NAME_SFP, path: PAGE_PATH_SFP },
  { id: PAGE_PATH_LICENSE, name: PAGE_NAME_LICENSE, path: PAGE_PATH_LICENSE },
  { id: PAGE_PATH_AP, name: PAGE_NAME_AP, path: PAGE_PATH_AP },
  {
    id: PAGE_PATH_HW_LIFE_CYCLE,
    name: PAGE_NAME_HW_LIFE_CYCLE,
    path: PAGE_PATH_HW_LIFE_CYCLE,
  },
];

function Index(props) {
  let pagePath = getPathAllSegments();
  if (pagePath.length === 2 && pagePath[1] === MODULE_PATH) {
    pagePath = [PAGE_PATH_SITE];
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
