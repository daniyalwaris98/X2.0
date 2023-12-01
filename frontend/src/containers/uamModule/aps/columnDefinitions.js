import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";

export function useIndexTableColumnDefinitions() {
  const theme = useTheme();

  const columnDefinitions = [
    "board_name",
    "device_name",
    "serial_number",
    "pn_code",
    "status",
    "device_slot_id",
    "software_version",
    "hardware_version",
    "manufacture_date",
    "eos_date",
    "eol_date",
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
