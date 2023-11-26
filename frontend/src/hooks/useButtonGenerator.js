import React from "react";
import { useTheme } from "@mui/material/styles";
import DefaultButton, { DropDownButton } from "../components/buttons";

export default function useButtonGenerator() {
  const theme = useTheme();
  const buttonGenerator = ({
    handleClick = () => {
      // alert("No handler defined for this button.");
    },
    sx = {},
    category = "default",
    icon = null,
    name = null,
    namePostfix = null,
    options = [],
    selectedRowKeys = null,
    iconPosition = "left",
    ...rest
    // include more options to make it more powerful and customizable
  }) => {
    if (category === "default") {
      let defaultButton = (
        <DefaultButton handleClick={handleClick} sx={sx} {...rest}>
          {iconPosition === "left" ? icon : null}
          {name || namePostfix ? (
            <span
              style={{
                fontSize: "13px",
                textTransform: "capitalize",
                gap: "5px",
              }}
            >
              {name} {namePostfix}
            </span>
          ) : null}
          {iconPosition === "right" ? icon : null}
        </DefaultButton>
      );
      return (
        <>
          {selectedRowKeys
            ? selectedRowKeys?.length > 0
              ? defaultButton
              : null
            : defaultButton}
        </>
      );
    } else if (category === "dropDown") {
      return (
        <DropDownButton handleClick={handleClick} sx={sx} options={options}>
          {iconPosition === "left" ? icon : null}
          {name || namePostfix ? (
            <span
              style={{
                fontSize: "13px",
                textTransform: "capitalize",
                gap: "5px",
              }}
            >
              {name} {namePostfix}
            </span>
          ) : null}
          {iconPosition === "right" ? icon : null}
        </DropDownButton>
      );
    }
  };
  return buttonGenerator;
}
