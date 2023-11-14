import React from "react";
import { useTheme } from "@mui/material/styles";
import DefaultButton from "./buttons";
import { Typography } from "@mui/material";
import { Icon } from "@iconify/react";

export default function PageHeader({
  pageName,
  handleDelete,
  handleExportTemplate,
  handleExport,
  handleClickOpen,
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
          <DefaultButton
            handleClick={handleDelete}
            sx={{ backgroundColor: theme.palette.color.danger }}
          >
            <Icon fontSize="16px" icon="mingcute:delete-line" />
            Delete
          </DefaultButton>

          <DefaultButton
            handleClick={handleExportTemplate}
            sx={{ backgroundColor: theme.palette.color.primary }}
          >
            <Icon fontSize="16px" icon="fe:export" />
            Export Template
          </DefaultButton>

          <DefaultButton
            handleClick={handleExport}
            sx={{ backgroundColor: theme.palette.color.primary }}
          >
            <Icon fontSize="16px" icon="fe:export" />
            Export
          </DefaultButton>

          <DefaultButton
            handleClick={handleClickOpen}
            sx={{ backgroundColor: theme.palette.color.primary }}
          >
            <Icon fontSize="16px" icon="gridicons:add-outline" />
            Add Atom
          </DefaultButton>

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
