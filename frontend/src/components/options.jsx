import React from "react";
import { useTheme } from "@mui/material/styles";

export default function DefaultOption({ value, sx, children, ...rest }) {
  const theme = useTheme();

  return (
    <option
      style={{
        color: theme.palette.textColor.input,
        ...sx,
      }}
      {...rest}
      value={value}
    >
      {children}
    </option>
  );
}
