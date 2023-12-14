import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import {
  indexV1V2ColumnNameConstants,
  indexV3ColumnNameConstants,
} from "./constants";

export function useIndexTableColumnDefinitions({}) {
  const theme = useTheme();

  const v1V2ColumnDefinitions = [
    indexV1V2ColumnNameConstants.DESCRIPTION,
    indexV1V2ColumnNameConstants.VERSION,
    indexV1V2ColumnNameConstants.PROFILE_NAME,
    indexV1V2ColumnNameConstants.COMMUNITY,
  ];

  const v3ColumnDefinitions = [
    indexV3ColumnNameConstants.PROFILE_NAME,
    indexV3ColumnNameConstants.USER_NAME,
    indexV3ColumnNameConstants.DESCRIPTION,
    indexV3ColumnNameConstants.PORT,
    indexV3ColumnNameConstants.AUTHENTICATION_PROTOCOL,
    indexV3ColumnNameConstants.AUTHENTICATION_PASSWORD,
    indexV3ColumnNameConstants.ENCRYPTION_PROTOCOL,
    indexV3ColumnNameConstants.ENCRYPTION_PASSWORD,
  ];

  const v1V2DataKeys = v1V2ColumnDefinitions
    .map((item) => {
      if (typeof item === "object") {
        return item.data_key;
      } else {
        return item;
      }
    })
    .filter((item) => true);

  const v3DataKeys = v3ColumnDefinitions
    .map((item) => {
      if (typeof item === "object") {
        return item.data_key;
      } else {
        return item;
      }
    })
    .filter((item) => true);

  return {
    v1V2ColumnDefinitions,
    v3ColumnDefinitions,
    v1V2DataKeys,
    v3DataKeys,
  };
}
