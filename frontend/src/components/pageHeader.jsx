import React from "react";
import { useTheme } from "@mui/material/styles";
import DefaultButton, { DropDownButton } from "./buttons";
import { Typography } from "@mui/material";

export default function PageHeader({ pageName, buttons }) {
  const theme = useTheme();

  const renderButton = (button) => {
    const { type, icon, handleClick, options, sx } = button;

    if (options) {
      return (
        <DropDownButton
          key={type}
          handleClick={handleClick}
          sx={sx}
          options={options}
        >
          {icon}
          {type}
        </DropDownButton>
      );
    } else {
      return (
        <DefaultButton key={type} handleClick={handleClick} sx={sx}>
          {icon}
          {type}
        </DefaultButton>
      );
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: theme.palette.textColor.tableText }}>
          {pageName}
        </Typography>

        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {buttons.map(renderButton)}
        </Typography>
      </Typography>
    </div>
  );
}
