import React from "react";
import { useTheme } from "@mui/material/styles";

export default function DefaultInput({
  field,
  type = "text",
  sx,
  children,
  ...rest
}) {
  const theme = useTheme();

  return (
    <input
      {...field}
      type={type}
      style={{
        borderStyle: "solid",
        borderColor: theme.palette.color.inputBorderColor,
        borderRadius: "5px",
        padding: "5px 10px",
        width: "90%",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </input>
  );
}
