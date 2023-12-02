import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions({ handleEdit }) {
  const theme = useTheme();

  const columnDefinitions = [
    indexColumnNameConstants.IP_ADDRESS,
    indexColumnNameConstants.DEVICE_NAME,
    indexColumnNameConstants.DEVICE_TYPE,
    indexColumnNameConstants.SITE_NAME,
    indexColumnNameConstants.RACK_NAME,
    indexColumnNameConstants.SOFTWARE_TYPE,
    indexColumnNameConstants.SOFTWARE_VERSION,
    indexColumnNameConstants.PATCH_VERSION,
    indexColumnNameConstants.MANUFACTURER,
    indexColumnNameConstants.HW_EOS_DATE,
    indexColumnNameConstants.HW_EOL_DATE,
    indexColumnNameConstants.SW_EOS_DATE,
    indexColumnNameConstants.SW_EOL_DATE,
    indexColumnNameConstants.RFS_DATE,
    indexColumnNameConstants.CONTRACT_EXPIRY,
    indexColumnNameConstants.UP_TIME,
    indexColumnNameConstants.MANUFACTURE_DATE,
    indexColumnNameConstants.AUTHENTICATION,
    indexColumnNameConstants.SERIAL_NUMBER,
    indexColumnNameConstants.PN_CODE,
    indexColumnNameConstants.SUB_RACK_ID_NUMBER,
    indexColumnNameConstants.HARDWARE_VERSION,
    indexColumnNameConstants.MAX_POWER,
    indexColumnNameConstants.SITE_TYPE,
    indexColumnNameConstants.SOURCE,
    indexColumnNameConstants.STACK,
    indexColumnNameConstants.CONTRACT_NUMBER,
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
    columnDefinitions,
    dataKeys,
  };
}
