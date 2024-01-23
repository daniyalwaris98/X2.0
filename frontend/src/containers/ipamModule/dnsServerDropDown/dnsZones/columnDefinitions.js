import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";
import DefaultAnchor from "../../../../components/anchor";

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
    indexColumnNameConstants.ZONE_NAME,
    indexColumnNameConstants.ZONE_TYPE,
    indexColumnNameConstants.LOOKUP_TYPE,
    indexColumnNameConstants.DNS_SERVER,
    indexColumnNameConstants.SERVER_TYPE,
    indexColumnNameConstants.ZONE_STATUS,
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
