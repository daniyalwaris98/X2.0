import { ChildCare } from "@mui/icons-material";
import React from "react";
import { useTheme } from "@mui/material/styles";

const DefaultLabel = ({ required, sx, children, ...rest }) => {
  const theme = useTheme();

  return (
    <label
      {...rest}
      style={{
        fontSize: theme.typography.textSize.small,
        ...sx,
      }}
    >
      {children} {required ? <span style={{ color: "red" }}>*</span> : null}
    </label>
  );
};

export default DefaultLabel;
