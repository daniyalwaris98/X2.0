import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions({}) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.IP_ADDRESS,
    indexColumnNameConstants.SUBNET,
    indexColumnNameConstants.MAC_ADDRESS,
    indexColumnNameConstants.STATUS,
    indexColumnNameConstants.VIP,
    indexColumnNameConstants.ASSET_TAG,
    indexColumnNameConstants.CONFIGURATION_SWITCH,
    indexColumnNameConstants.CONFIGURATION_INTERFACE,
    indexColumnNameConstants.OPEN_PORTS,
    indexColumnNameConstants.IP_TO_DNS,
    indexColumnNameConstants.DNS_TO_IP,
  ];

  const dataKeys = columnDefinitions
    .map((item) => {
      if (typeof item === "object") {
        return item.data_key;
      } else {
        return item;
      }
    })
    .filter((item) => true);

  return {
    columnDefinitions,
    dataKeys,
  };
}
