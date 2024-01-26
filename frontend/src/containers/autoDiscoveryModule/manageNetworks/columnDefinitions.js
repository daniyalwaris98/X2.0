import React from "react";
import { Icon } from "@iconify/react";
import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions({ handleEdit } = {}) {
  const columnDefinitions = [
    indexColumnNameConstants.NETWORK_NAME,
    indexColumnNameConstants.SUBNET,
    indexColumnNameConstants.NO_OF_DEVICES,
    indexColumnNameConstants.SCAN_STATUS,
    indexColumnNameConstants.EXCLUDED_IP_RANGE,
    indexColumnNameConstants.NETWORK_NAME,
    indexColumnNameConstants.SUBNET,
    indexColumnNameConstants.NO_OF_DEVICES,
    indexColumnNameConstants.SCAN_STATUS,
    indexColumnNameConstants.EXCLUDED_IP_RANGE,
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
