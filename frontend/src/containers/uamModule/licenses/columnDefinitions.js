import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";

export function useIndexTableColumnDefinitions() {
  const theme = useTheme();

  const columnDefinitions = [
    "device_name",
    "license_name",
    "status",
    "license_description",
    "rfs_date",
    "activation_date",
    "expiry_date",
    "grace_period",
    "serial_number",
    "capacity",
    "usage",
    "pn_code",
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
