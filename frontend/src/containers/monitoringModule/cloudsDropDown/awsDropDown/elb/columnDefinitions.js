import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions({}) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.LOAD_BALANCER_NAME,
    indexColumnNameConstants.LOAD_BALANCER_TYPE,
    indexColumnNameConstants.LOAD_BALANCER_SCHEME,
    indexColumnNameConstants.LOAD_BALANCER_ARN,
    indexColumnNameConstants.ACCESS_KEY,
    indexColumnNameConstants.MONITORING_STATUS,
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
