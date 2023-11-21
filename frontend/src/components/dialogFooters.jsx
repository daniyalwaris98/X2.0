import React from "react";
import { useTheme } from "@mui/material/styles";
import DefaultButton from "./buttons";

export default function DefaultDialogFooter({ handleClose, sx, ...rest }) {
  const theme = useTheme();

  return (
    <div style={{ display: "flex", justifyContent: "center", ...sx }} {...rest}>
      <DefaultButton
        handleClick={handleClose}
        sx={{
          backgroundColor: theme?.palette?.default_button?.cancel_background,
        }}
      >
        <></>
        Cancel
      </DefaultButton>
      &nbsp; &nbsp;
      <DefaultButton
        type="submit"
        sx={{
          backgroundColor: theme?.palette?.default_button?.submit_background,
        }}
      >
        <></>
        Submit
      </DefaultButton>
    </div>
  );
}
