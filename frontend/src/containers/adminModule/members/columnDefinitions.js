import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { DEFAULT_PASSWORD, indexColumnNameConstants } from "./constants";
import { convertToAsterisks } from "../../../utils/helpers";
import useTableActions from "../../../hooks/useTableActions";

export function useIndexTableColumnDefinitions({ handleEdit }) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.USER_NAME,
    indexColumnNameConstants.EMAIL_ADDRESS,
    indexColumnNameConstants.NAME,
    indexColumnNameConstants.ROLE,
    indexColumnNameConstants.STATUS,
    indexColumnNameConstants.COMPANY_NAME,
    indexColumnNameConstants.ACCOUNT_TYPE,
    indexColumnNameConstants.LAST_LOGIN,
    indexColumnNameConstants.TEAM,

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
