import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";
import DefaultAnchor from "../../../../../components/anchor";

export function useIndexTableColumnDefinitions({ handleIpAddressClick }) {
  const theme = useTheme();

  const columnDefinitions = [
    {
      data_key: indexColumnNameConstants.IP_ADDRESS,
      render: (text, record) => (
        <DefaultAnchor onClick={() => handleIpAddressClick(record)}>
          {text}
        </DefaultAnchor>
      ),
    },
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
