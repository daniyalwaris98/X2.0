import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";
import Tooltip from "@mui/material/Tooltip";

export function useIndexTableColumnDefinitions({ handleEdit, handleScan }) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.IP_ADDRESS,
    indexColumnNameConstants.SERVER_NAME,
    indexColumnNameConstants.TYPE,
    indexColumnNameConstants.NUMBER_OF_ZONES,
    indexColumnNameConstants.USER_NAME,
    indexColumnNameConstants.PASSWORD,
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
          <Tooltip title="Scan">
            <Icon
              fontSize={"15px"}
              onClick={() => handleScan(record)}
              icon="bx:scan"
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Icon
              fontSize={"15px"}
              onClick={() => handleEdit(record)}
              icon="bx:edit"
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
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
