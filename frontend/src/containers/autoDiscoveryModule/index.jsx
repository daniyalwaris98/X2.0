import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_MANAGE_NETWORKS,
  PAGE_PATH as PAGE_PATH_MANAGE_NETWORKS,
} from "./manageNetworks/constants";
import {
  PAGE_NAME as PAGE_NAME_DISCOVERY,
  PAGE_PATH as PAGE_PATH_DISCOVERY,
} from "./discovery/constants";
import {
  PAGE_NAME as PAGE_NAME_MANAGE_DEVICES,
  PAGE_PATH as PAGE_PATH_MANAGE_DEVICES,
} from "./manageDevices/constants";
import {
  PAGE_NAME as PAGE_NAME_MANAGE_CREDENTIALS,
  PAGE_PATH as PAGE_PATH_MANAGE_CREDENTIALS,
} from "./manageCredentials/constants";
import { getPathLastSegment } from "../../utils/helpers";

export const MODULE_PATH = "auto_discovery_module";

const menuItems = [
  {
    id: PAGE_PATH_MANAGE_NETWORKS,
    name: PAGE_NAME_MANAGE_NETWORKS,
    path: PAGE_PATH_MANAGE_NETWORKS,
  },
  {
    id: PAGE_PATH_DISCOVERY,
    name: PAGE_NAME_DISCOVERY,
    path: PAGE_PATH_DISCOVERY,
  },
  {
    id: PAGE_PATH_MANAGE_DEVICES,
    name: PAGE_NAME_MANAGE_DEVICES,
    path: PAGE_PATH_MANAGE_DEVICES,
  },
  {
    id: PAGE_PATH_MANAGE_CREDENTIALS,
    name: PAGE_NAME_MANAGE_CREDENTIALS,
    path: PAGE_PATH_MANAGE_CREDENTIALS,
  },
];

function Index(props) {
  let pagePath = getPathAllSegments();
  if (pagePath.length === 2 && pagePath[1] === MODULE_PATH) {
    pagePath = [PAGE_PATH_MANAGE_NETWORKS];
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
