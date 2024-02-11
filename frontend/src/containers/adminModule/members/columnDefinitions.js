import React from "react";
import { Icon } from "@iconify/react";
import { DefaultTextWithSwitch } from "../../../components/textWithSwitch";
import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions({ handleEdit } = {}) {
  const columnDefinitions = [
    indexColumnNameConstants.USER_NAME,
    {
      data_key: indexColumnNameConstants.PASSWORD,
      render: (text, record) => <DefaultTextWithSwitch text={text} />,
    },
    indexColumnNameConstants.EMAIL_ADDRESS,
    indexColumnNameConstants.NAME,
    indexColumnNameConstants.ROLE,
    indexColumnNameConstants.STATUS,
    indexColumnNameConstants.ACCOUNT_TYPE,
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
