import React from "react";
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import useButtonGenerator from "../../../hooks/useButtonGenerator";
import DefaultSelect from "../../../components/selects";
import DefaultOption from "../../../components/options";
import {} from "../../../store/features/ipamModule/devices/apis";
import { selectIpamDevicesFetchDates } from "../../../store/features/ipamModule/devices/selectors";
import { useSelector } from "react-redux";

export default function CustomPageHeader({
  pageName,
  buttonsConfigurationList,
  handleDateChange,
}) {
  const theme = useTheme();
  const buttonGenerator = useButtonGenerator();

  // selectors
  const fetchDates = useSelector(selectIpamDevicesFetchDates);

  return (
    <div style={{ padding: "10px" }}>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: theme?.palette?.page_header?.primary_text }}>
          {pageName}
        </Typography>

        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <DefaultSelect
            id="selectOption"
            onChange={handleDateChange}
            sx={{ height: "31px", width: "180px", outline: "none" }}
          >
            <DefaultOption value="">Select Fetch Date...</DefaultOption>
            {fetchDates.map((option, index) => (
              <DefaultOption key={index} value={option}>
                {option}
              </DefaultOption>
            ))}
          </DefaultSelect>
          {buttonsConfigurationList?.map((buttonConfiguration) => {
            return buttonGenerator(buttonConfiguration);
          })}
        </Typography>
      </Typography>
    </div>
  );
}
