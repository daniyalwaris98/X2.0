import React from "react";
import { useTheme } from "@mui/material/styles";
import DefaultButton, {
  DropDownButton,
  DropDownCheckboxButton,
} from "../components/buttons";

export default function useButtonGenerator() {
  const theme = useTheme();
  const buttonGenerator = ({
    // coming from page
    handleClick = () => {
      console.log("No handler defined for this button.");
    },
    visible = true,
    namePostfix = null,
    // coming from button Configuration
    sx = {},
    iconPosition = "left",
    category = "default",
    icon = null,
    name = null,
    options = [],
    // coming from page
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
      return <>{visible ? defaultButton : null}</>;
    } else if (category === "dropDown") {
      let dropDownButton = (
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
      return <>{visible ? dropDownButton : null}</>;
    } else if (category === "dropDownCheckbox") {
      let dropDownCheckboxButton = (
        <DropDownCheckboxButton
          handleClick={handleClick}
          sx={sx}
          options={options}
        >
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
        </DropDownCheckboxButton>
      );
      return <>{visible ? dropDownCheckboxButton : null}</>;
    }
  };
  return buttonGenerator;
}
