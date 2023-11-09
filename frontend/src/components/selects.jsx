import React from "react";
import { useTheme } from "@mui/material/styles";

const DefaultSelect = ({ field, sx, children, ...rest }) => {
  const theme = useTheme();

  return (
    <select
      {...field}
      style={{
        borderStyle: "solid",
        borderColor: theme.palette.color.inputBorderColor,
        borderRadius: "5px",
        padding: "5px 15px",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </select>
  );
};

export default DefaultSelect;
