import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";
import DefaultAnchor from "../../../components/anchor";

export function useIndexTableColumnDefinitions({
  handleEdit,
  handleIpAddressClick,
}) {
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
    indexColumnNameConstants.FUNCTION,
    indexColumnNameConstants.SOURCE,
    indexColumnNameConstants.CREDENTIALS,
    indexColumnNameConstants.SNMP_STATUS,
    indexColumnNameConstants.ACTIVE,
    indexColumnNameConstants.STATUS,
    indexColumnNameConstants.PING_STATUS,
    {
      data_key: indexColumnNameConstants.ACTIONS,
      search: false,
      fixed: "right",
      align: "center",
      width: 100,
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <Icon
            fontSize={"15px"}
            onClick={() => handleEdit(record)}
            icon="bx:edit"
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
    },
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
