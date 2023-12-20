import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions({}) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.PROFILE_NAME,
    indexColumnNameConstants.USER_NAME,
    indexColumnNameConstants.DESCRIPTION,
    indexColumnNameConstants.PORT,
    indexColumnNameConstants.AUTHENTICATION_PROTOCOL,
    indexColumnNameConstants.AUTHENTICATION_PASSWORD,
    indexColumnNameConstants.ENCRYPTION_PROTOCOL,
    indexColumnNameConstants.ENCRYPTION_PASSWORD,
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
