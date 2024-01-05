import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";
import { Link } from "react-router-dom";

export function useIndexTableColumnDefinitions({
  handleIpAddressClick,
  handleRcsClick,
}) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.DEVICE_NAME,
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
    indexColumnNameConstants.VENDOR,
    indexColumnNameConstants.FUNCTION,
    indexColumnNameConstants.PASSWORD_GROUP,
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
            onClick={() => handleRcsClick(record)}
            icon="clarity:command-line"
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
