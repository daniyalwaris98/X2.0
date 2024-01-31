import React from "react";
import { Outlet } from "react-router-dom";
import { getPathAllSegments } from "../../utils/helpers";
import { useAuthorization } from "../../hooks/useAuth";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu/index";
import {
  PAGE_NAME as PAGE_NAME_ATOMS,
  PAGE_PATH as PAGE_PATH_ATOMS,
} from "./atoms/constants";
import {
  PAGE_NAME as PAGE_NAME_PASSWORD_GROUPS,
  PAGE_PATH as PAGE_PATH_PASSWORD_GROUPS,
} from "./passwordGroups/constants";

export const MODULE_NAME = "Atom";
export const MODULE_PATH = "atom_module";

function Index(props) {
  // hooks
  const { getUserInfoFromAccessToken, isPageAllowed } = useAuthorization();

  // user information
  const userInfo = getUserInfoFromAccessToken();
  const roleConfigurations = userInfo?.configuration;

  const menuItems = [
    {
      id: PAGE_PATH_ATOMS,
      name: PAGE_NAME_ATOMS,
      path: PAGE_PATH_ATOMS,
    },
    {
      id: PAGE_PATH_PASSWORD_GROUPS,
      name: PAGE_NAME_PASSWORD_GROUPS,
      path: PAGE_PATH_PASSWORD_GROUPS,
    },
  ].filter((item) => isPageAllowed(roleConfigurations, MODULE_PATH, item.path));

  let pagePath = getPathAllSegments();
  if (pagePath.length === 2 && pagePath[1] === MODULE_PATH) {
    pagePath = [menuItems.length > 0 ? menuItems[0].path : ""];
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
