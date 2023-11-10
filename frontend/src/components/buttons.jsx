import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function DefaultButton({ sx, handleClick, children, ...rest }) {
  const theme = useTheme();

  return (
    <Button
      sx={{
        ...sx,
      }}
      {...rest}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
