import React from "react";
import NCMModule from "../containers/ncmModule";
import ConfigData from "../containers/ncmModule/manageConfigurations";
import ManageConfigurationsLanding from "../containers/ncmModule/manageConfigurationsLanding";
import ConfigurationBackups from "../containers/ncmModule/manageConfigurationsLanding/configurationBackups";
import RemoteCommandSender from "../containers/ncmModule/manageConfigurationsLanding/remoteCommandSender";
import { Navigate } from "react-router-dom";
import { PAGE_PATH as PAGE_PATH_CONFIG_DATA } from "../containers/ncmModule/manageConfigurations/constants";
import { LANDING_PAGE_PATH as LANDING_PAGE_PATH_MANAGE_CONFIGURATIONS } from "../containers/ncmModule/manageConfigurationsLanding";
import { PAGE_PATH as PAGE_PATH_CONFIGURATION_BACKUPS } from "../containers/ncmModule/manageConfigurationsLanding/configurationBackups/constants";
import { PAGE_PATH as PAGE_PATH_REMOTE_COMMAND_SENDER } from "../containers/ncmModule/manageConfigurationsLanding/remoteCommandSender/constants";
import { MODULE_PATH } from "../containers/ncmModule";

const routes = {
  path: MODULE_PATH,
  element: <NCMModule />,
  children: [
    {
      path: `/${MODULE_PATH}`,
      element: <Navigate to={PAGE_PATH_CONFIG_DATA} replace />,
    },
    {
      path: PAGE_PATH_CONFIG_DATA,
      element: <ConfigData />,
    },
    {
      path: LANDING_PAGE_PATH_MANAGE_CONFIGURATIONS,
      element: <ManageConfigurationsLanding />,
      children: [
        {
          path: `/${MODULE_PATH}/${LANDING_PAGE_PATH_MANAGE_CONFIGURATIONS}`,
          element: <Navigate to={PAGE_PATH_CONFIGURATION_BACKUPS} replace />,
        },
        {
          path: PAGE_PATH_CONFIGURATION_BACKUPS,
          element: <ConfigurationBackups />,
        },
        {
          path: PAGE_PATH_REMOTE_COMMAND_SENDER,
          element: <RemoteCommandSender />,
        },
      ],
    },
  ],
};

export default routes;
