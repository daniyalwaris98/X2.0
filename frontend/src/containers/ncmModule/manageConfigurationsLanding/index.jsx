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

export const LANDING_PAGE_NAME = "Manage Configurations";
export const LANDING_PAGE_PATH =
  "manage_configurations/manage_configurations_landing";

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
            padding: "10px",
            height: "100px",
          }}
        >
          <div
            style={{
              border: "1px solid grey",
              width: "20%",
              backgroundColor: "#DBDBDB",
            }}
          >
            IP Address: {selectedDevice?.ip_address}
          </div>
          &nbsp; &nbsp;
          <div
            style={{
              border: "1px solid grey",
              width: "20%",
              backgroundColor: "#DBDBDB",
            }}
          >
            Device Name: {selectedDevice?.device_name}
          </div>
          &nbsp; &nbsp;
          <div
            style={{
              border: "1px solid grey",
              width: "20%",
              backgroundColor: "#DBDBDB",
            }}
          >
            Device Type:{selectedDevice?.device_type}
          </div>
          &nbsp; &nbsp;
          <div
            style={{
              border: "1px solid grey",
              width: "20%",
              backgroundColor: "#DBDBDB",
            }}
          >
            Function:{selectedDevice?.function}
          </div>
          &nbsp; &nbsp;
          <div
            style={{
              border: "1px solid grey",
              width: "20%",
              backgroundColor: "#DBDBDB",
            }}
          >
            Vendor:{selectedDevice?.vendor}
          </div>
        </div>
      </Card>

      <Card
      // sx={{
      //   borderTopLeftRadius: 0,
      //   borderTopRightRadius: 0,
      // }}
      >
        <HorizontalMenu menuItems={menuItems} defaultPagePath={pagePath} />
      </Card>
      <Outlet />
    </>
  );
}

export default Index;
