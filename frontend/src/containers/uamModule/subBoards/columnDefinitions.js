import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";

export function useIndexTableColumnDefinitions() {
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
