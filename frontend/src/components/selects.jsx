import React from "react";
import { useTheme } from "@mui/material/styles";

const DefaultSelect = ({ sx, children, ...rest }) => {
  const theme = useTheme();

  return (
    <select
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
