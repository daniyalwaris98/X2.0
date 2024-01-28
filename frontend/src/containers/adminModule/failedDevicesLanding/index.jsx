import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../../components/cards";
import HorizontalMenu from "../../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../../utils/helpers";
import {
  PAGE_NAME as PAGE_NAME_AUTO_DISCOVERY,
  PAGE_PATH as PAGE_PATH_AUTO_DISCOVERY,
} from "./autoDiscovery/constants";
import {
  PAGE_NAME as PAGE_NAME_IPAM,
  PAGE_PATH as PAGE_PATH_IPAM,
} from "./ipam/constants";
import {
  PAGE_NAME as PAGE_NAME_MONITORING,
  PAGE_PATH as PAGE_PATH_MONITORING,
} from "./monitoring/constants";
import {
  PAGE_NAME as PAGE_NAME_NCM,
  PAGE_PATH as PAGE_PATH_NCM,
} from "./ncm/constants";
import {
  PAGE_NAME as PAGE_NAME_UAM,
  PAGE_PATH as PAGE_PATH_UAM,
} from "./uam/constants";
import { useSelector } from "react-redux";
import { selectSelectedDevice } from "../../../store/features/monitoringModule/devices/selectors";

export const LANDING_PAGE_NAME = "Failed Devices";
export const LANDING_PAGE_PATH = "failed_devices_landing";

const menuItems = [
  {
    id: PAGE_PATH_AUTO_DISCOVERY,
    name: PAGE_NAME_AUTO_DISCOVERY,
    path: PAGE_PATH_AUTO_DISCOVERY,
  },
  {
    id: PAGE_PATH_IPAM,
    name: PAGE_NAME_IPAM,
    path: PAGE_PATH_IPAM,
  },
  {
    id: PAGE_PATH_MONITORING,
    name: PAGE_NAME_MONITORING,
    path: PAGE_PATH_MONITORING,
  },
  {
    id: PAGE_PATH_NCM,
    name: PAGE_NAME_NCM,
    path: PAGE_PATH_NCM,
  },
  {
    id: PAGE_PATH_UAM,
    name: PAGE_NAME_UAM,
    path: PAGE_PATH_UAM,
  },
];

function Index(props) {
  const selectedDevice = useSelector(selectSelectedDevice);

  let pagePath = getPathAllSegments();
  if (pagePath.length === 4 && pagePath[3] === LANDING_PAGE_PATH) {
    pagePath = [PAGE_PATH_AUTO_DISCOVERY];
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
            <div style={{ marginBottom: "15px" }}>Auto Discovery: </div>
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
            <div style={{ marginBottom: "15px" }}>IPAM: </div>
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
            <div style={{ marginBottom: "15px" }}>Monitoring: </div>
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
            <div style={{ marginBottom: "15px" }}>NCM: </div>
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
            <div style={{ marginBottom: "15px" }}>UAM: </div>
            <div style={{ color: "green" }}>{selectedDevice?.vendor}</div>
          </div>
        </div>
      </Card>
      <Card>
        <HorizontalMenu menuItems={menuItems} defaultPagePath={pagePath} />
      </Card>
      <Outlet />
      <br />
      <br />
      <br />
    </>
  );
}

export default Index;
