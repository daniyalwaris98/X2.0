import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";

export function useIndexTableColumnDefinitions() {
  const theme = useTheme();

  const columnDefinitions = [
    "ip_address",
    "device_name",
    "device_type",
    "site_name",
    "rack_name",
    "software_type",
    "software_version",
    "patch_version",
    "manufacturer",
    "creation_date",
    "modification_date",
    "hw_eos_date",
    "hw_eol_date",
    "sw_eos_date",
    "sw_eol_date",
    "rfs_date",
    "contract_expiry",
    "uptime",
    "manufacture_date",
    "authentication",
    "serial_number",
    "pn_code",
    "subrack_id_number",
    "hardware_version",
    "max_power",
    "site_type",
    "source",
    "stack",
    "contract_number",
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
