import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthorization } from "../../hooks/useAuth";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_SITES,
  PAGE_PATH as PAGE_PATH_SITES,
} from "./sites/constants";
import {
  PAGE_NAME as PAGE_NAME_RACKS,
  PAGE_PATH as PAGE_PATH_RACKS,
} from "./racks/constants";
import {
  PAGE_NAME as PAGE_NAME_DEVICES,
  PAGE_PATH as PAGE_PATH_DEVICES,
} from "./devices/constants";
import {
  PAGE_NAME as PAGE_NAME_BOARDS,
  PAGE_PATH as PAGE_PATH_BOARDS,
} from "./boards/constants";
import {
  PAGE_NAME as PAGE_NAME_SUB_BOARDS,
  PAGE_PATH as PAGE_PATH_SUB_BOARDS,
} from "./subBoards/constants";
import {
  PAGE_NAME as PAGE_NAME_SFPS,
  PAGE_PATH as PAGE_PATH_SFPS,
} from "./sfps/constants";
import {
  PAGE_NAME as PAGE_NAME_LICENSES,
  PAGE_PATH as PAGE_PATH_LICENSES,
} from "./licenses/constants";
import {
  PAGE_NAME as PAGE_NAME_APS,
  PAGE_PATH as PAGE_PATH_APS,
} from "./aps/constants";
import {
  PAGE_NAME as PAGE_NAME_HW_LIFE_CYCLES,
  PAGE_PATH as PAGE_PATH_HW_LIFE_CYCLES,
} from "./hwLifeCycles/constants";

export const MODULE_NAME = "UAM";
export const MODULE_PATH = "uam_module";

let menuItems = [
  { id: PAGE_PATH_SITES, name: PAGE_NAME_SITES, path: PAGE_PATH_SITES },
  { id: PAGE_PATH_RACKS, name: PAGE_NAME_RACKS, path: PAGE_PATH_RACKS },
  { id: PAGE_PATH_DEVICES, name: PAGE_NAME_DEVICES, path: PAGE_PATH_DEVICES },
  { id: PAGE_PATH_BOARDS, name: PAGE_NAME_BOARDS, path: PAGE_PATH_BOARDS },
  {
    id: PAGE_PATH_SUB_BOARDS,
    name: PAGE_NAME_SUB_BOARDS,
    path: PAGE_PATH_SUB_BOARDS,
  },
  { id: PAGE_PATH_SFPS, name: PAGE_NAME_SFPS, path: PAGE_PATH_SFPS },
  {
    id: PAGE_PATH_LICENSES,
    name: PAGE_NAME_LICENSES,
    path: PAGE_PATH_LICENSES,
  },
  { id: PAGE_PATH_APS, name: PAGE_NAME_APS, path: PAGE_PATH_APS },
  {
    id: PAGE_PATH_HW_LIFE_CYCLES,
    name: PAGE_NAME_HW_LIFE_CYCLES,
    path: PAGE_PATH_HW_LIFE_CYCLES,
  },
];

function Index(props) {
  // hooks
  const { getUserInfoFromAccessToken, filterPageMenus } = useAuthorization();

  // user information
  const userInfo = getUserInfoFromAccessToken();
  const roleConfigurations = userInfo?.configuration;

  menuItems = filterPageMenus(menuItems, roleConfigurations, MODULE_PATH);

  let pagePath = getPathAllSegments();
  if (pagePath.length === 2 && pagePath[1] === MODULE_PATH) {
    pagePath = [PAGE_PATH_SITES];
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
