import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions({ handleEdit = null }) {
  const theme = useTheme();

  const columnDefinitions = [
    {
      data_key: indexColumnNameConstants.STATUS,
      search: false,
      width: "80px",
      align: "center",
      render: (text, record) => {
        const icon = record.atom_id ? (
          <Icon
            fontSize={"22px"}
            color={theme?.palette?.icon?.complete}
            icon="ep:success-filled"
          />
        ) : (
          <Icon
            fontSize={"23px"}
            color={theme?.palette?.icon?.incomplete}
            icon="material-symbols:info"
          />
        );

        return <div style={{ textAlign: "center" }}>{icon}</div>;
      },
    },
    indexColumnNameConstants.IP_ADDRESS,
    indexColumnNameConstants.SITE_NAME,
    indexColumnNameConstants.RACK_NAME,
    indexColumnNameConstants.DEVICE_NAME,
    indexColumnNameConstants.DEVICE_RU,
    indexColumnNameConstants.DEPARTMENT,
    indexColumnNameConstants.DOMAIN,
    indexColumnNameConstants.SECTION,
    indexColumnNameConstants.FUNCTION,
    indexColumnNameConstants.VIRTUAL,
    indexColumnNameConstants.DEVICE_TYPE,
    indexColumnNameConstants.VENDOR,
    indexColumnNameConstants.CRITICALITY,
    indexColumnNameConstants.PASSWORD_GROUP,
    {
      data_key: indexColumnNameConstants.ONBOARD_STATUS,
      title: "Board",
      fixed: "right",
      align: "center",
      width: 80,
      render: (text, record) => (
        <div
          style={{
            textAlign: "center",
          }}
        >
          {record.onboard_status === true ? (
            <span
              style={{
                display: "inline-block",
                borderRadius: "10px",
                backgroundColor: "#c2dfbf",
                color: "#3D9E47",
                padding: "1px 15px",
              }}
            >
              True
            </span>
          ) : record.onboard_status === false ? (
            <div
              style={{
                display: "inline-block",
                borderRadius: "10px",
                backgroundColor: "#ffe2dd",
                color: "#E34444",
                padding: "1px 15px",
              }}
            >
              False
            </div>
          ) : null}
        </div>
      ),
    },
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

  const columnDefinitionsForIpamDevices = [
    indexColumnNameConstants.IP_ADDRESS,
    indexColumnNameConstants.DEVICE_NAME,
    indexColumnNameConstants.FUNCTION,
    indexColumnNameConstants.VENDOR,
    {
      data_key: indexColumnNameConstants.ONBOARD_STATUS,
      title: "Board",
      fixed: "right",
      align: "center",
      width: 80,
      render: (text, record) => (
        <div
          style={{
            textAlign: "center",
          }}
        >
          {record.on_board_status === true ? (
            <span
              style={{
                display: "inline-block",
                borderRadius: "10px",
                backgroundColor: "#c2dfbf",
                color: "#3D9E47",
                padding: "1px 15px",
              }}
            >
              True
            </span>
          ) : record.on_board_status === false ? (
            <div
              style={{
                display: "inline-block",
                borderRadius: "10px",
                backgroundColor: "#ffe2dd",
                color: "#E34444",
                padding: "1px 15px",
              }}
            >
              False
            </div>
          ) : null}
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
    .filter(
      (item) =>
        item !== indexColumnNameConstants.STATUS &&
        item !== indexColumnNameConstants.ACTIONS &&
        item !== indexColumnNameConstants.ONBOARD_STATUS
    );

  return {
    columnDefinitions,
    columnDefinitionsForIpamDevices,
    dataKeys,
  };
}
