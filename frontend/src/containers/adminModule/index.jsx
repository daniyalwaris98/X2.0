import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_MEMBERS,
  PAGE_PATH as PAGE_PATH_MEMBERS,
} from "./members/constants";
import {
  LANDING_PAGE_NAME as LANDING_PAGE_NAME_FAILED_DEVICE,
  LANDING_PAGE_PATH as LANDING_PAGE_PATH_FAILED_DEVICE,
} from "./failedDevicesLanding";
import {
  PAGE_NAME as PAGE_NAME_ROLES,
  PAGE_PATH as PAGE_PATH_ROLES,
} from "./roles/constants";
import { useAuthorization } from "../../hooks/useAuth";

export const MODULE_NAME = "Admin";
export const MODULE_PATH = "admin_module";

function Index(props) {
  // hooks
  const { getUserInfoFromAccessToken, isPageAllowed } = useAuthorization();

  // user information
  const userInfo = getUserInfoFromAccessToken();
  const roleConfigurations = userInfo?.configuration;

  const menuItems = [
    { id: PAGE_PATH_MEMBERS, name: PAGE_NAME_MEMBERS, path: PAGE_PATH_MEMBERS },
    {
      id: LANDING_PAGE_PATH_FAILED_DEVICE,
      name: LANDING_PAGE_NAME_FAILED_DEVICE,
      path: LANDING_PAGE_PATH_FAILED_DEVICE,
    },
    { id: PAGE_PATH_ROLES, name: PAGE_NAME_ROLES, path: PAGE_PATH_ROLES },
  ].filter((item) => isPageAllowed(roleConfigurations, MODULE_PATH, item.path));

  let pagePath = getPathAllSegments();
  if (pagePath.length === 2 && pagePath[1] === MODULE_PATH) {
    pagePath = [PAGE_PATH_MEMBERS];
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
