import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSelectedDevice } from "../../../store/features/ncmModule/manageConfigurations/selectors";
import { getPathAllSegments } from "../../../utils/helpers";
import Card from "../../../components/cards";
import HorizontalMenu from "../../../components/horizontalMenu/index";
import DefaultDetailCards from "../../../components/detailCards";
import firewallIcon from "../../../resources/designRelatedSvgs/firewall.svg";
import deviceIcon from "../../../resources/designRelatedSvgs/otherDevices.svg";
import switchIcon from "../../../resources/designRelatedSvgs/switches.svg";
import {
  PAGE_NAME as PAGE_NAME_CONFIGURATION_BACKUPS,
  PAGE_PATH as PAGE_PATH_CONFIGURATION_BACKUPS,
} from "./configurationBackups/constants";
import {
  PAGE_NAME as PAGE_NAME_REMOTE_COMMAND_SENDER,
  PAGE_PATH as PAGE_PATH_REMOTE_COMMAND_SENDER,
} from "./remoteCommandSender/constants";
import { PAGE_PATH as PAGE_PATH_MANAGE_CONFIGURATIONS } from "../manageConfigurations/constants";
import { indexColumnNameConstants } from "../manageConfigurations/constants";

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
      {selectedDevice ? (
        <DefaultDetailCards
          data={{
            [indexColumnNameConstants.IP_ADDRESS]:
              selectedDevice[indexColumnNameConstants.IP_ADDRESS],
            [indexColumnNameConstants.DEVICE_NAME]:
              selectedDevice[indexColumnNameConstants.DEVICE_NAME],
            [indexColumnNameConstants.DEVICE_TYPE]:
              selectedDevice[indexColumnNameConstants.DEVICE_TYPE],
            [indexColumnNameConstants.FUNCTION]:
              selectedDevice[indexColumnNameConstants.FUNCTION],
            [indexColumnNameConstants.VENDOR]:
              selectedDevice[indexColumnNameConstants.VENDOR],
          }}
          icons={[deviceIcon, firewallIcon, switchIcon, switchIcon, deviceIcon]}
        />
      ) : null}

      <Card>
        <HorizontalMenu menuItems={menuItems} defaultPagePath={pagePath} />
      </Card>
      <Outlet />
    </>
  );
}

export default Index;
