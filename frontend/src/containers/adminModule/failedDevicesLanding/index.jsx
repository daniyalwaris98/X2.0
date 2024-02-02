import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../../components/cards";
import HorizontalMenu from "../../../components/horizontalMenu/index";
import { getPathAllSegments } from "../../../utils/helpers";
import firewallIcon from "../../../resources/designRelatedSvgs/firewall.svg";
import deviceIcon from "../../../resources/designRelatedSvgs/otherDevices.svg";
import switchIcon from "../../../resources/designRelatedSvgs/switches.svg";
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
import { useAuthorization } from "../../../hooks/useAuth";
import { MODULE_PATH } from "..";
import DefaultDetailCards from "../../../components/detailCards";

export const LANDING_PAGE_NAME = "Failed Devices";
export const LANDING_PAGE_PATH = "failed_devices_landing";

function Index(props) {
  let menuItems = [
    {
      id: PAGE_PATH_AUTO_DISCOVERY,
      name: PAGE_NAME_AUTO_DISCOVERY,
      path: PAGE_PATH_AUTO_DISCOVERY,
      icon: "iconamoon:discover-light",
    },
    {
      id: PAGE_PATH_IPAM,
      name: PAGE_NAME_IPAM,
      path: PAGE_PATH_IPAM,
      icon: "carbon:kubernetes-ip-address",
    },
    {
      id: PAGE_PATH_MONITORING,
      name: PAGE_NAME_MONITORING,
      path: PAGE_PATH_MONITORING,
      icon: "eos-icons:monitoring",
    },
    {
      id: PAGE_PATH_NCM,
      name: PAGE_NAME_NCM,
      path: PAGE_PATH_NCM,
      icon: "carbon:network-2",
    },
    {
      id: PAGE_PATH_UAM,
      name: PAGE_NAME_UAM,
      path: PAGE_PATH_UAM,
      icon: "icon-park-outline:category-management",
    },
  ];

  // hooks
  const { getUserInfoFromAccessToken, filterPageMenus } = useAuthorization();

  // user information
  const userInfo = getUserInfoFromAccessToken();
  const roleConfigurations = userInfo?.configuration;

  menuItems = filterPageMenus(menuItems, roleConfigurations, MODULE_PATH);

  const selectedDevice = useSelector(selectSelectedDevice);

  let pagePath = getPathAllSegments();
  if (pagePath.length === 4 && pagePath[3] === LANDING_PAGE_PATH) {
    pagePath = [PAGE_PATH_AUTO_DISCOVERY];
  } else pagePath = pagePath.splice(4);

  return (
    <>
      {selectedDevice ? (
        <DefaultDetailCards
          data={{
            [PAGE_PATH_AUTO_DISCOVERY]:
              selectedDevice[PAGE_PATH_AUTO_DISCOVERY],
            [PAGE_PATH_IPAM]: selectedDevice[PAGE_PATH_IPAM],
            [PAGE_PATH_MONITORING]: selectedDevice[PAGE_PATH_MONITORING],
            [PAGE_PATH_NCM]: selectedDevice[PAGE_PATH_NCM],
            [PAGE_PATH_UAM]: selectedDevice[PAGE_PATH_UAM],
          }}
          icons={[
            "iconamoon:discover-light",
            "carbon:kubernetes-ip-address",
            "eos-icons:monitoring",
            "carbon:network-2",
            "icon-park-outline:category-management",
          ]}
        />
      ) : null}
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
