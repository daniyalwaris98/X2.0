import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";

export function useIndexTableColumnDefinitions({ handleEdit }) {
  const theme = useTheme();

  const columnDefinitions = [
    "subboard_name",
    "device_name",
    "serial_number",
    "status",
    "pn_code",
    "subboard_type",
    "subrack_id",
    "slot_number",
    "subslot_number",
    "device_slot_number",
    "software_version",
    "hardware_version",
    "manufacturer_date",
    "eos_date",
    "eol_date",
    "creation_date",
    "modification_date",
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
