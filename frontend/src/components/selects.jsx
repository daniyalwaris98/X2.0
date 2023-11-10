import React from "react";
import { useTheme } from "@mui/material/styles";

export default function DefaultSelect({ field, sx, children, ...rest }) {
  const theme = useTheme();

  return (
    <select
      {...field}
      style={{
        color: theme.palette.textColor.input,
        border: `2px solid ${theme.palette.color.inputBorderColor}`,
        borderRadius: "5px",
        padding: "5px 15px",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </select>
  );
}
