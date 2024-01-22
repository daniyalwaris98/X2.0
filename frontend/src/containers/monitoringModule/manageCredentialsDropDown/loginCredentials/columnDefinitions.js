import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";
import { convertToAsterisks } from "../../../../utils/helpers";

export function useIndexTableColumnDefinitions({}) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.USER_NAME,
    indexColumnNameConstants.PROFILE_NAME,
    {
      data_key: indexColumnNameConstants.PASSWORD,
      render: (text, record) => convertToAsterisks(text),
    },
    indexColumnNameConstants.CATEGORY,
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
