import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../../components/cards";
import HorizontalMenu from "../../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_CONFIGURATION_BACKUPS,
  PAGE_PATH as PAGE_PATH_CONFIGURATION_BACKUPS,
} from "./configurationBackups/constants";
import {
  PAGE_NAME as PAGE_NAME_REMOTE_COMMAND_SENDER,
  PAGE_PATH as PAGE_PATH_REMOTE_COMMAND_SENDER,
} from "./remoteCommandSender/constants";
import { useSelector } from "react-redux";
import { selectSelectedDevice } from "../../../store/features/ncmModule/manageConfigurations/selectors";
import { PAGE_PATH as PAGE_PATH_MANAGE_CONFIGURATIONS } from "../manageConfigurations/constants";

export const LANDING_PAGE_NAME = "Manage Configurations";
export const LANDING_PAGE_RELATIVE_PATH = "manage_configurations_landing";
export const LANDING_PAGE_PATH = `${PAGE_PATH_MANAGE_CONFIGURATIONS}/${LANDING_PAGE_RELATIVE_PATH}`;

const menuItems = [
  {
    id: PAGE_PATH_CONFIGURATION_BACKUPS,
    name: PAGE_NAME_CONFIGURATION_BACKUPS,
    path: PAGE_PATH_CONFIGURATION_BACKUPS,
  },
  {
    id: PAGE_PATH_REMOTE_COMMAND_SENDER,
    name: PAGE_NAME_REMOTE_COMMAND_SENDER,
    path: PAGE_PATH_REMOTE_COMMAND_SENDER,
  },
];

function Index(props) {
  const selectedDevice = useSelector(selectSelectedDevice);

  let pagePath = getPathAllSegments();
  if (pagePath.length === 4 && pagePath[3] === LANDING_PAGE_PATH) {
    pagePath = [PAGE_PATH_CONFIGURATION_BACKUPS];
  } else pagePath = pagePath.splice(4);

  return (
    <>
      <Card
        sx={{
          // borderTopLeftRadius: 0,
          // borderTopRightRadius: 0,
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "14px",
            height: "90px",
          }}
        >
          <div
            style={{
              border: "1px solid #DBDBDB",
              borderRadius: "7px",
              width: "20%",
              backgroundColor: "#FAFAFA",
              padding: "10px",
            }}
          >
            <div style={{ marginBottom: "15px" }}>IP Address: </div>
            <div style={{ color: "green" }}>{selectedDevice?.ip_address}</div>
          </div>
          &nbsp; &nbsp;
          <div
            style={{
              border: "1px solid #DBDBDB",
              borderRadius: "7px",
              width: "20%",
              backgroundColor: "#FAFAFA",
              padding: "10px",
            }}
          >
            <div style={{ marginBottom: "15px" }}>Device Name: </div>
            <div style={{ color: "green" }}>{selectedDevice?.device_name}</div>
          </div>
          &nbsp; &nbsp;
          <div
            style={{
              border: "1px solid #DBDBDB",
              borderRadius: "7px",
              width: "20%",
              backgroundColor: "#FAFAFA",
              padding: "10px",
            }}
          >
            <div style={{ marginBottom: "15px" }}>Device Type: </div>
            <div style={{ color: "green" }}>{selectedDevice?.device_type}</div>
          </div>
          &nbsp; &nbsp;
          <div
            style={{
              border: "1px solid #DBDBDB",
              borderRadius: "7px",
              width: "20%",
              backgroundColor: "#FAFAFA",
              padding: "10px",
            }}
          >
            <div style={{ marginBottom: "15px" }}>Function: </div>
            <div style={{ color: "green" }}>{selectedDevice?.function}</div>
          </div>
          &nbsp; &nbsp;
          <div
            style={{
              border: "1px solid #DBDBDB",
              borderRadius: "7px",
              width: "20%",
              backgroundColor: "#FAFAFA",
              padding: "10px",
            }}
          >
            <div style={{ marginBottom: "15px" }}>Vendor: </div>
            <div style={{ color: "green" }}>{selectedDevice?.vendor}</div>
          </div>
        </div>
      </Card>

      <Card>
        <HorizontalMenu menuItems={menuItems} defaultPagePath={pagePath} />
      </Card>
      <Outlet />
    </>
  );
}

export default Index;
