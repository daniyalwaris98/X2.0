import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions({}) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.IP_ADDRESS,
    indexColumnNameConstants.DEVICE_TYPE,
    indexColumnNameConstants.DEVICE_NAME,
    indexColumnNameConstants.VENDOR,
    indexColumnNameConstants.TOTAL_INTERFACES,
    indexColumnNameConstants.FUNCTION,
    indexColumnNameConstants.STATUS,
    indexColumnNameConstants.DISCOVERED_TIME,
    indexColumnNameConstants.DEVICE_DESCRIPTION,
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
