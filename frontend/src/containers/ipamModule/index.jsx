import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu";
import {
  PAGE_NAME as PAGE_NAME_DEVICES,
  PAGE_PATH as PAGE_PATH_DEVICES,
} from "./devices/constants";
import {
  PAGE_NAME as PAGE_NAME_DEVICE_SUBNET,
  PAGE_PATH as PAGE_PATH_DEVICE_SUBNET,
} from "./deviceSubnet/constants";
import { getPathLastSegment } from "../../utils/helpers";

export const MODULE_PATH = "ipam_module";

const menuItems = [
  {
    id: PAGE_PATH_DEVICES,
    name: PAGE_NAME_DEVICES,
    path: PAGE_PATH_DEVICES,
  },
  {
    id: PAGE_PATH_DEVICE_SUBNET,
    name: PAGE_NAME_DEVICE_SUBNET,
    path: PAGE_PATH_DEVICE_SUBNET,
  },
];

function Index(props) {
  let pagePath = getPathLastSegment();
  if (pagePath === MODULE_PATH) pagePath = PAGE_PATH_DEVICES;

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
