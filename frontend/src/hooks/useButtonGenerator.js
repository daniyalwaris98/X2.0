import React from "react";
import { useTheme } from "@mui/material/styles";
import DefaultButton, { DropDownButton } from "../components/buttons";

export default function useButtonGenerator() {
  const theme = useTheme();
  const buttonGenerator = ({
    handleClick = () => {
      alert("No handler defined for this button.");
    },
    sx = {},
    type = "default",
    icon = null,
    name = null,
    namePostfix = null,
    options = [],
    selectedRowKeys = null,
    // include more options to make it more powerful and customizable
  }) => {
    if (type === "default") {
      return (
        <>
          {selectedRowKeys ? (
            selectedRowKeys?.length > 0 ? (
              <DefaultButton handleClick={handleClick} sx={sx}>
                {icon}
                {name && namePostfix
                  ? `${name} ${namePostfix}`
                  : name || namePostfix || ""}
              </DefaultButton>
            ) : null
          ) : (
            <DefaultButton handleClick={handleClick} sx={sx}>
              {icon}
              {name && namePostfix
                ? `${name} ${namePostfix}`
                : name || namePostfix || ""}
            </DefaultButton>
          )}
        </>
      );
    } else if (type === "dropDown") {
      return (
        <DropDownButton handleClick={handleClick} sx={sx} options={options}>
          {icon}
          {name && namePostfix
            ? `${name} ${namePostfix}`
            : name || namePostfix || ""}
        </DropDownButton>
      );
    }
  };
  return buttonGenerator;
}
