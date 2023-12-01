import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";

export function useIndexTableColumnDefinitions() {
  const theme = useTheme();

  const columnDefinitions = [
    "sfp_id",
    "uam_id",
    "device_name",
    "status",
    "serial_number",
    "media_type",
    "port_name",
    "port_type",
    "connector",
    "mode",
    "speed",
    "wavelength",
    "optical_direction_type",
    "pn_code",
    "eos_date",
    "eol_date",
    "rfs_date",
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
