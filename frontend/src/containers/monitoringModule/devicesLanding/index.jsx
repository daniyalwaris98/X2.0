import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../../components/cards";
import HorizontalMenu from "../../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_DEVICES_SUMMARY,
  PAGE_PATH as PAGE_PATH_DEVICES_SUMMARY,
} from "./summary/constants";
import {
  PAGE_NAME as PAGE_NAME_DEVICES_INTERFACES,
  PAGE_PATH as PAGE_PATH_DEVICES_INTERFACES,
} from "./interfaces/constants";
import { useSelector } from "react-redux";
import { selectSelectedDevice } from "../../../store/features/monitoringModule/devices/selectors";
import { PAGE_PATH as PAGE_PATH_DEVICES } from "../devices/constants";

export const LANDING_PAGE_NAME = "Device Details";
export const LANDING_PAGE_PATH = "devices_landing";

const menuItems = [
  {
    id: PAGE_PATH_DEVICES_SUMMARY,
    name: PAGE_NAME_DEVICES_SUMMARY,
    path: PAGE_PATH_DEVICES_SUMMARY,
  },
  {
    id: PAGE_PATH_DEVICES_INTERFACES,
    name: PAGE_NAME_DEVICES_INTERFACES,
    path: PAGE_PATH_DEVICES_INTERFACES,
  },
];

function Index(props) {
  const selectedDevice = useSelector(selectSelectedDevice);

  let pagePath = getPathAllSegments();
  if (pagePath.length === 4 && pagePath[3] === LANDING_PAGE_PATH) {
    pagePath = [PAGE_PATH_DEVICES_SUMMARY];
  } else pagePath = pagePath.splice(4);

  return (
    <>
      <Card
        sx={{
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
