import React from "react";
import { useTheme } from "@mui/material/styles";
import useButtonGenerator from "../hooks/useButtonGenerator";
import useButtonsConfiguration from "../hooks/useButtonsConfiguration";

export default function DefaultDialogFooter({ handleClose, sx, ...rest }) {
  const theme = useTheme();
  const { buttonsConfigurationList } = useButtonsConfiguration({
    default_cancel: { handleClick: handleClose },
    default_submit: null,
  });
  const buttonGenerator = useButtonGenerator();

  return (
    <div
      style={{ display: "flex", justifyContent: "center", gap: "10px", ...sx }}
      {...rest}
    >
      {buttonsConfigurationList.map((item) => buttonGenerator(item))}
    </div>
  );
}

export function TableConfigurationDialogFooter({
  handleClose,
  handleReset,
  handleSave,
  sx,
  ...rest
}) {
  const theme = useTheme();
  const { buttonsConfigurationList } = useButtonsConfiguration({
    default_cancel: { handleClick: handleClose },
    default_reset: { handleClick: handleReset },
    default_save: { handleClick: handleSave },
  });
  const buttonGenerator = useButtonGenerator();

  return (
    <div
      style={{ display: "flex", justifyContent: "center", gap: "10px", ...sx }}
      {...rest}
    >
      {buttonsConfigurationList.map((item) => buttonGenerator(item))}
    </div>
  );
}

export function DeviceDetailsDialogFooter({ handleClose, sx, ...rest }) {
  const theme = useTheme();
  const { buttonsConfigurationObject } = useButtonsConfiguration({
    default_ok: { handleClick: handleClose },
  });
  const buttonGenerator = useButtonGenerator();

  return (
    <div
      style={{ display: "flex", justifyContent: "center", gap: "10px", ...sx }}
      {...rest}
    >
      {buttonGenerator(buttonsConfigurationObject.default_ok)}
    </div>
  );
}
