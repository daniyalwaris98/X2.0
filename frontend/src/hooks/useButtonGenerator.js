import React from "react";
import { useTheme } from "@mui/material/styles";
import DefaultButton, {
  DropDownButton,
  DropDownCheckboxButton,
} from "../components/buttons";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function useButtonGenerator() {
  const theme = useTheme();
  const buttonGenerator = ({
    // coming from page
    handleClick = () => {
      console.log("No handler defined for this button.");
    },
    visible = true,
    loader = false,
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
    const antIcon = (
      <LoadingOutlined style={{ fontSize: 24, color: "#3D9E47" }} spin />
    );
    if (category === "default") {
      let defaultButton = (
        <Spin spinning={loader} indicator={antIcon}>
          <DefaultButton handleClick={handleClick} sx={sx} {...rest}>
            {iconPosition === "left" ? icon : null}
            {name || namePostfix ? (
              <span
                style={{
                  fontSize: "13px",
                  textTransform: "capitalize",
                  gap: "5px",
                  whiteSpace: "nowrap", // Add this line to prevent line breaks
                }}
              >
                {name} {namePostfix}
              </span>
            ) : null}
            {iconPosition === "right" ? icon : null}
          </DefaultButton>
        </Spin>
      );
      return <>{visible ? defaultButton : null}</>;
    } else if (category === "dropDown") {
      let dropDownButton = (
        <Spin spinning={loader}>
          <DropDownButton handleClick={handleClick} sx={sx} options={options}>
            {iconPosition === "left" ? icon : null}
            {name || namePostfix ? (
              <span
                style={{
                  fontSize: "13px",
                  textTransform: "capitalize",
                  gap: "5px",
                  whiteSpace: "nowrap", // Add this line to prevent line breaks
                }}
              >
                {name} {namePostfix}
              </span>
            ) : null}
            {iconPosition === "right" ? icon : null}
          </DropDownButton>
        </Spin>
      );
      return <>{visible ? dropDownButton : null}</>;
    } else if (category === "dropDownCheckbox") {
      let dropDownCheckboxButton = (
        <Spin spinning={loader}>
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
                  whiteSpace: "nowrap", // Add this line to prevent line breaks
                }}
              >
                {name} {namePostfix}
              </span>
            ) : null}
            {iconPosition === "right" ? icon : null}
          </DropDownCheckboxButton>
        </Spin>
      );
      return <>{visible ? dropDownCheckboxButton : null}</>;
    }
  };
  return buttonGenerator;
}
