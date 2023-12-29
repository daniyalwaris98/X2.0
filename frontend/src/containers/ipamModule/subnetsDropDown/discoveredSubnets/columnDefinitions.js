import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions({}) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.SUBNET_ADDRESS,
    indexColumnNameConstants.SUBNET_NAME,
    indexColumnNameConstants.SUBNET_MASK,
    indexColumnNameConstants.SIZE,
    indexColumnNameConstants.DISCOVER_FROM,
    indexColumnNameConstants.STATUS,
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
