import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions({}) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.NAME,
    indexColumnNameConstants.TYPE,
    indexColumnNameConstants.DATA,
    indexColumnNameConstants.ZONE_NAME,
    indexColumnNameConstants.SERVER_NAME,
    indexColumnNameConstants.SERVER_IP,
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
