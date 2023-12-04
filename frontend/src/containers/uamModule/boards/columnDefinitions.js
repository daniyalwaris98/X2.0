import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions() {
  const columnDefinitions = [
    indexColumnNameConstants.BOARD_NAME,
    indexColumnNameConstants.DEVICE_NAME,
    indexColumnNameConstants.SERIAL_NUMBER,
    indexColumnNameConstants.PN_CODE,
    indexColumnNameConstants.STATUS,
    indexColumnNameConstants.DEVICE_SLOT_ID,
    indexColumnNameConstants.SOFTWARE_VERSION,
    indexColumnNameConstants.HARDWARE_VERSION,
    indexColumnNameConstants.MANUFACTURE_DATE,
    indexColumnNameConstants.EOS_DATE,
    indexColumnNameConstants.EOL_DATE,
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
