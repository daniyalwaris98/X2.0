import React from "react";
import { useTheme } from "@mui/material/styles";
import DefaultButton, { DropDownButton } from "./buttons";
import { Typography } from "@mui/material";

export default function PageHeader({ pageName, buttons, selectedRowKeys }) {
  const theme = useTheme();

  const getStylesByType = (type, options) => {
    let sx = {};

    if (type === "Export") {
      sx = {
        backgroundColor: theme?.palette?.drop_down_button?.export_background,
        color: theme?.palette?.drop_down_button?.export_text,
      };
    } else if (type === "Onboard") {
      sx = {
        backgroundColor: theme?.palette?.default_button?.onboard_background,
      };
    } else if (type === "Delete") {
      sx = {
        backgroundColor: theme?.palette?.default_button?.delete_background,
      };
    } else if (type === "Dismantle") {
      sx = {
        backgroundColor: theme?.palette?.default_button?.delete_background,
      };
    } else if (type === "Add") {
      if (options) {
        sx = {
          backgroundColor: theme?.palette?.drop_down_button?.add_background,
          color: theme?.palette?.drop_down_button?.add_text,
        };
      } else {
        sx = {
          backgroundColor: theme?.palette?.drop_down_button?.add_background,
        };
      }
    } else if (type === "Import") {
      sx = {
        backgroundColor: theme?.palette?.default_button?.import_background,
      };
    } else if (type === "Configure Table") {
      sx = {
        backgroundColor:
          theme?.palette?.default_button?.configure_table_background,
        color: theme?.palette?.default_button?.configure_table_text,
        gap: "0px",
        padding: "6px",
      };
    } else {
      sx = {
        backgroundColor: theme?.palette?.default_button?.import_background,
      };
    }
    return sx;
  };

  const renderButton = (buttonNamePostfix, button) => {
    const {
      type,
      icon,
      handleClick,
      text = true,
      selection = false,
      postfix = false,
      options,
    } = button;
    let sx = getStylesByType(type, options);
    if (options) {
      return (
        <DropDownButton
          key={type}
          handleClick={handleClick}
          sx={sx}
          options={options}
        >
          {icon}
          {text ? (postfix ? `${type} ${buttonNamePostfix}` : type) : null}
        </DropDownButton>
      );
    } else {
      return (
        <>
          {selection ? (
            selectedRowKeys && selectedRowKeys.length > 0 ? (
              <DefaultButton key={type} handleClick={handleClick} sx={sx}>
                {icon}
                {text
                  ? postfix
                    ? `${type} ${buttonNamePostfix}`
                    : type
                  : null}
              </DefaultButton>
            ) : null
          ) : (
            <DefaultButton key={type} handleClick={handleClick} sx={sx}>
              {icon}
              {text ? (postfix ? `${type} ${buttonNamePostfix}` : type) : null}
            </DefaultButton>
          )}
        </>
      );
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: theme?.palette?.page_header?.primary_text }}>
          {pageName}
        </Typography>

        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {buttons.map((button) => renderButton(pageName, button))}
        </Typography>
      </Typography>
    </div>
  );
}
