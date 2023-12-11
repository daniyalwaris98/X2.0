import React from "react";
import { Outlet, useParams } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu";
import {
  PAGE_NAME as PAGE_NAME_DEVICE,
  PAGE_PATH as PAGE_PATH_DEVICE,
} from "./devices/constants";
import {
  PAGE_NAME as PAGE_NAME_ALERT,
  PAGE_PATH as PAGE_PATH_ALERT,
} from "./alerts/constants";
import {
  PAGE_NAME as PAGE_NAME_CREDENTIAL,
  PAGE_PATH as PAGE_PATH_CREDENTIAL,
} from "./credentials/constants";

import { getPathLastSegment } from "../../utils/helpers";

export const MODULE_PATH = "monitoring_module";

const menuItems = [
  { id: PAGE_PATH_DEVICE, name: PAGE_NAME_DEVICE, path: PAGE_PATH_DEVICE },
  { id: PAGE_PATH_ALERT, name: PAGE_NAME_ALERT, path: PAGE_PATH_ALERT },
  { id: PAGE_PATH_CREDENTIAL, name: PAGE_NAME_CREDENTIAL, path: PAGE_PATH_CREDENTIAL },
 
];

function Index(props) {
  let pagePath = getPathLastSegment();
  if (pagePath === MODULE_PATH) pagePath = PAGE_PATH_DEVICE;

  return (
    <>
      <Card
        sx={{
          marginBottom: "10px",
          height: "50px",
          boxShadow: "unset !important",
        }}
      >
        <HorizontalMenu menuItems={menuItems} defaultPage={pagePath} />
      </Card>
      <Outlet />
    </>
  );
}

export default Index;
