import React from "react";
import { useTheme } from "@mui/material/styles";
import DefaultButton, { DropDownButton } from "./buttons";
import { Typography } from "@mui/material";
import { Icon } from "@iconify/react";

export default function PageHeader({
  pageName,
  handleDelete,
  handleExport,
  handleAddAtom,
  handleInputClick,
}) {
  const theme = useTheme();

  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      <Typography
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: theme.palette.textColor.tableText }}>
          {pageName}
        </Typography>

        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <DropDownButton
            handleClick={handleExport}
            sx={{
              backgroundColor: theme.palette.color.main,
              color: theme.palette.textColor.default,
            }}
            options={[
              {
                type: "All Devices",
                icon: (
                  <Icon
                    style={{ marginBottom: "-1px" }}
                    color={theme.palette.textColor.tertiary}
                    icon="icon-park-outline:data-all"
                  />
                ),
              },
              {
                type: "Template",
                icon: (
                  <Icon
                    style={{ marginBottom: "-1px" }}
                    color={theme.palette.textColor.tertiary}
                    icon="subway:write"
                  />
                ),
              },
              {
                type: "Completed",
                icon: (
                  <Icon
                    fontSize={16}
                    style={{ marginBottom: "-3px" }}
                    color={theme.palette.color.primary}
                    icon="ep:success-filled"
                  />
                ),
              },
              {
                type: "Incomplete",
                icon: (
                  <Icon
                    fontSize={18}
                    style={{ marginBottom: "-3px" }}
                    color={theme.palette.color.info}
                    icon="material-symbols:info"
                  />
                ),
              },
            ]}
          >
            <Icon fontSize="16px" icon="fe:export" />
            Export
          </DropDownButton>

          <DefaultButton
            handleClick={handleDelete}
            sx={{ backgroundColor: theme.palette.color.danger }}
          >
            <Icon fontSize="16px" icon="mingcute:delete-line" />
            Delete
          </DefaultButton>

          <DropDownButton
            handleClick={handleAddAtom}
            sx={{
              backgroundColor: theme.palette.color.primary,
              color: theme.palette.textColor.main,
            }}
            options={[
              {
                type: "Add Manually",
                icon: (
                  <Icon
                    style={{ marginBottom: "-2px" }}
                    color={theme.palette.textColor.tertiary}
                    icon="icon-park-outline:data-all"
                  />
                ),
              },
              {
                type: "From Discovery",
                icon: (
                  <Icon
                    style={{ marginBottom: "-2px" }}
                    color={theme.palette.textColor.tertiary}
                    icon="subway:write"
                  />
                ),
              },
            ]}
          >
            <Icon fontSize="16px" icon="gridicons:add-outline" />
            Add Atom
          </DropDownButton>
          <DefaultButton
            handleClick={handleInputClick}
            sx={{ backgroundColor: theme.palette.color.primary }}
          >
            <Icon fontSize="16px" icon="pajamas:import" /> Import
          </DefaultButton>
        </Typography>
      </Typography>
    </div>
  );
}
