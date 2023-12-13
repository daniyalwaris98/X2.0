import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions({}) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.IP_ADDRESS,
    indexColumnNameConstants.DEVICE_NAME,
    indexColumnNameConstants.INTERFACE,
    indexColumnNameConstants.INTERFACE_IP,
    indexColumnNameConstants.SUBNET,
    indexColumnNameConstants.SUBNET_MASK,
    indexColumnNameConstants.INTERFACE_DESCRIPTION,
    indexColumnNameConstants.VIRTUAL_IP,
    indexColumnNameConstants.VLAN,
    indexColumnNameConstants.VLAN_NUMBER,
    indexColumnNameConstants.INTERFACE_STATUS,
    indexColumnNameConstants.FETCH_DATE,
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
