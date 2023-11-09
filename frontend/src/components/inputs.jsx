import React from "react";
import { useTheme } from "@mui/material/styles";

const DefaultInput = ({ field, type = "text", sx, children, ...rest }) => {
  const theme = useTheme();

  return (
    <input
      {...field}
      type={type}
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
    </input>
  );
};

export default DefaultInput;
