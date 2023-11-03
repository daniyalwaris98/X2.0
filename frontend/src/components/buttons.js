import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const DefaultButton = ({ sx, handleClick, children, ...rest }) => {
  const theme = useTheme();

  return (
    <>
      <Button
        sx={{
          backgroundColor: theme.palette.color.primary,
          color: theme.palette.color.main,
          ...sx,
        }}
        {...rest}
        onClick={handleClick}
      >
        {children}
      </Button>
    </>
  );
};

export default DefaultButton;
