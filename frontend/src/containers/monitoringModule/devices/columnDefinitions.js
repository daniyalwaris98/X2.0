import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";


// DEVICE_ID: TABLE_DATA_UNIQUE_ID,
// MONITORING_ID: "monitoring_id",
// IP_ADDRESS: "ip_address",
// DEVICE_TYPE: "device_type",
// DEVICE_NAME: "device_name",
// VENDOR: "vendor",
// FUNCTION: "function",
// SOURCE: "source",
// CREDENTIALS: "credentials",
// ACTIVE: "active",
// STATUS: "status",
// SNMP_STATUS: "snmp_status",

export function useIndexTableColumnDefinitions() {
  const columnDefinitions = [
    indexColumnNameConstants.DEVICE_NAME,
    indexColumnNameConstants.IP_ADDRESS,
    indexColumnNameConstants.STATUS,   // PING STATUS
    indexColumnNameConstants.ACTIVE, // MONITORING STATUS
    indexColumnNameConstants.VENDOR,
    indexColumnNameConstants.FUNCTION,
    indexColumnNameConstants.DEVICE_TYPE,
    indexColumnNameConstants.SOURCE,
    indexColumnNameConstants.CREDENTIALS,
 
    // indexColumnNameConstants.STATUS,
    // indexColumnNameConstants.SNMP_STATUS,

  ];

  const plainColumnDefinitions = [
    indexColumnNameConstants.DEVICE_NAME,
    indexColumnNameConstants.IP_ADDRESS,
    indexColumnNameConstants.STATUS,   // PING STATUS
    indexColumnNameConstants.ACTIVE, // MONITORING STATUS
    indexColumnNameConstants.VENDOR,
    indexColumnNameConstants.FUNCTION,
    indexColumnNameConstants.DEVICE_TYPE,
    indexColumnNameConstants.SOURCE,
    indexColumnNameConstants.CREDENTIALS,
 
    // indexColumnNameConstants.STATUS,
    // indexColumnNameConstants.SNMP_STATUS,

  ];

  const dataKeys = columnDefinitions
    .map((item) => {
      if (typeof item === "object") {
        return item.data_key;
      } else {
        return item;
      }
    })
    .filter((item) => true);

  return {
    plainColumnDefinitions,
    columnDefinitions,
    dataKeys,
  };
}
