import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { DEFAULT_PASSWORD, indexColumnNameConstants } from "./constants";
import { convertToAsterisks } from "../../../utils/helpers";

export function useIndexTableColumnDefinitions({ handleEdit }) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.PASSWORD_GROUP,
    indexColumnNameConstants.PASSWORD_GROUP_TYPE,
    indexColumnNameConstants.USER_NAME,
    {
      data_key: indexColumnNameConstants.PASSWORD,
      render: (text, record) => convertToAsterisks(text),
    },
    {
      data_key: indexColumnNameConstants.SECRET_PASSWORD,
      render: (text, record) => convertToAsterisks(text),
    },
    {
      data_key: indexColumnNameConstants.ACTIONS,
      search: false,
      fixed: "right",
      align: "center",
      width: 100,
      render: (text, record) => {
        return record[indexColumnNameConstants.PASSWORD_GROUP] !==
          DEFAULT_PASSWORD ? (
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
        ) : null;
      },
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
