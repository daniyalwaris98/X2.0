import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";
import { Switch } from "antd";

export function useIndexTableColumnDefinitions({ handleEdit }) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.ACCOUNT_LABEL,
    indexColumnNameConstants.AWS_ACCESS_KEY,
    indexColumnNameConstants.AWS_SECRET_ACCESS_KEY,
    indexColumnNameConstants.ACCESS_TYPE,
    indexColumnNameConstants.STATUS,
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
