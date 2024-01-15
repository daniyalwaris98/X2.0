import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions({ handleIpAddressClick }) {
  const theme = useTheme();

  const columnDefinitions = [
    {
      data_key: indexColumnNameConstants.IP_ADDRESS,
      render: (text, record) => (
        <a
          style={{ color: "green" }}
          onClick={() => handleIpAddressClick(record)}
        >
          {text}
        </a>
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
