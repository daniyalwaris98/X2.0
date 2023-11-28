import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";

export function useIndexTableColumnDefinitions({ handleEdit }) {
  const theme = useTheme();

  const columnDefinitions = [
    {
      data_key: "status",
      search: false,
      width: "80px",
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
    "ip_address",
    "site_name",
    "rack_name",
    "device_name",
    "device_ru",
    "department",
    "domain",
    "section",
    "function",
    "virtual",
    "device_type",
    "vendor",
    "criticality",
    "password_group",
    {
      data_key: "actions",
      search: false,
      fixed: "right",
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
    .filter((item) => item !== "status" && item !== "actions");

  return {
    columnDefinitions,
    dataKeys,
  };
}
