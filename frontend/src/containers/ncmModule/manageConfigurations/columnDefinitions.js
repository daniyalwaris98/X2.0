import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";
import { Link } from "react-router-dom";

export function useIndexTableColumnDefinitions({
  handleEdit,
  handleIpAddressClick,
}) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.DEVICE_NAME,
    {
      data_key: indexColumnNameConstants.IP_ADDRESS,
      render: (text, record) => (
        <a onClick={() => handleIpAddressClick(record)}>{text}</a>
        // <Link to="manage_configurations_landing">{text}</Link>
      ),
    },
    // indexColumnNameConstants.IP_ADDRESS,
    indexColumnNameConstants.RCS,
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
    .filter((item) => item !== indexColumnNameConstants.ACTIONS);

  return {
    columnDefinitions,
    dataKeys,
  };
}
