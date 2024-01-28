import React from "react";
import { Icon } from "@iconify/react";
import { indexColumnNameConstants } from "./constants";
import DefaultAnchor from "../../../../components/anchor";

export function useIndexTableColumnDefinitions({
  handleEdit,
  handleIpAddressClick,
} = {}) {
  const columnDefinitions = [
    {
      data_key: indexColumnNameConstants.SUBNET_ADDRESS,
      render: (text, record) => (
        <DefaultAnchor onClick={() => handleIpAddressClick(record)}>
          {text}
        </DefaultAnchor>
      ),
    },
    indexColumnNameConstants.SUBNET_NAME,
    indexColumnNameConstants.SUBNET_MASK,
    indexColumnNameConstants.SUBNET_SIZE,
    indexColumnNameConstants.SUBNET_USAGE,
    indexColumnNameConstants.SUBNET_LOCATION,
    indexColumnNameConstants.SUBNET_STATUS,
    indexColumnNameConstants.DISCOVERED_FROM,
    indexColumnNameConstants.SCAN_DATE,
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
