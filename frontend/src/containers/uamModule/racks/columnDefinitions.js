import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";

export function useIndexTableColumnDefinitions({ handleEdit }) {
  const theme = useTheme();

  const columnDefinitions = [
    "rack_name",
    "site_name",
    "serial_number",
    "manufacture_date",
    "unit_position",
    "status",
    "ru",
    "rfs_date",
    "height",
    "width",
    "pn_code",
    "rack_model",
    "brand",
    {
      data_key: "actions",
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
    .filter((item) => item !== "status" && item !== "actions");

  return {
    columnDefinitions,
    dataKeys,
  };
}
