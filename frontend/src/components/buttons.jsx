import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";

export default function DefaultButton({ sx, handleClick, children, ...rest }) {
  const theme = useTheme();

  return (
    <Button
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "5px 12px",
        color: theme.palette.color.main,
        "&:hover": {
          backgroundColor: sx?.backgroundColor,
          opacity: 0.95,
        },
        ...sx,
      }}
      {...rest}
      onClick={handleClick}
    >
      {children.length > 1 ? children[0] : null}
      <span style={{ fontSize: "13px", textTransform: "capitalize" }}>
        {children.length > 1 ? children[1] : children[0]}
      </span>
    </Button>
  );
}
