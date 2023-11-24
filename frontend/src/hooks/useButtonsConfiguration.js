import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";

export default function useButtonsConfiguration({
  handleTableConfigurationsOpen = () => {
    alert("handleTableConfigurationsOpen is missing");
  },
  handleExport = () => {
    alert("handleExport is missing");
  },
  handleDelete = () => {
    alert("handleDelete is missing");
  },
  handleDismantle = () => {
    alert("handleDismantle is missing");
  },
  handleAdd = () => {
    alert("handleAdd is missing");
  },
  handleOnboard = () => {
    alert("handleOnboard is missing");
  },
  handleInputClick = () => {
    alert("handleInputClick is missing");
  },
}) {
  const theme = useTheme();

  const pageHeaderButtonsDefaultConfiguration = [
    {
      type: "Configure Table",
      icon: <Icon fontSize="20px" icon="material-symbols:stack-outline" />,
      handleClick: handleTableConfigurationsOpen,
      text: false,
    },
    {
      type: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
      handleClick: handleExport,
      options: [
        {
          type: "All Data",
          icon: <Icon fontSize="16px" icon="icon-park-outline:data-all" />,
        },
        {
          type: "Template",
          icon: (
            <Icon fontSize="16px" icon="streamline:chat-bubble-square-write" />
          ),
        },
      ],
    },
    {
      type: "Delete",
      icon: <Icon fontSize="16px" icon="mingcute:delete-line" />,
      handleClick: handleDelete,
      selection: true,
    },
    {
      type: "Add",
      icon: <Icon fontSize="16px" icon="gridicons:add-outline" />,
      handleClick: handleAdd,
      postfix: true,
    },
    {
      type: "Import",
      icon: <Icon fontSize="16px" icon="pajamas:import" />,
      handleClick: handleInputClick,
    },
  ];

  const pageHeaderButtonsAtomConfiguration = [
    {
      type: "Configure Table",
      icon: <Icon fontSize="20px" icon="material-symbols:stack-outline" />,
      handleClick: handleTableConfigurationsOpen,
      text: false,
    },
    {
      type: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
      handleClick: handleExport,
      options: [
        {
          type: "All Data",
          icon: <Icon fontSize="16px" icon="icon-park-outline:data-all" />,
        },
        {
          type: "Template",
          icon: (
            <Icon fontSize="16px" icon="streamline:chat-bubble-square-write" />
          ),
        },
        {
          type: "Completed",
          icon: (
            <Icon
              fontSize="16px"
              icon="ep:success-filled"
              color={theme?.palette?.icon?.complete}
            />
          ),
        },
        {
          type: "Incomplete",
          icon: (
            <Icon
              fontSize="16px"
              icon="material-symbols:info"
              color={theme?.palette?.icon?.incomplete}
            />
          ),
        },
      ],
    },
    {
      type: "Onboard",
      icon: <Icon fontSize="16px" icon="fluent:board-20-regular" />,
      handleClick: handleOnboard,
      selection: true,
    },
    {
      type: "Delete",
      icon: <Icon fontSize="16px" icon="mingcute:delete-line" />,
      handleClick: handleDelete,
      selection: true,
    },
    {
      type: "Add",
      icon: <Icon fontSize="16px" icon="gridicons:add-outline" />,
      handleClick: handleAdd,
      postfix: true,
      options: [
        {
          type: "Add Manually",
          icon: <Icon fontSize="16px" icon="icon-park-outline:manual-gear" />,
        },
        {
          type: "From Discovery",
          icon: (
            <Icon fontSize="16px" icon="icon-park-outline:discovery-index" />
          ),
        },
      ],
    },
    {
      type: "Import",
      icon: <Icon fontSize="16px" icon="pajamas:import" />,
      handleClick: handleInputClick,
    },
  ];

  const pageHeaderButtonsSingleAddConfiguration = [
    {
      type: "Configure Table",
      icon: <Icon fontSize="20px" icon="material-symbols:stack-outline" />,
      handleClick: handleTableConfigurationsOpen,
      text: false,
    },
    {
      type: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
      handleClick: handleExport,
      options: [
        {
          type: "All Data",
          icon: <Icon fontSize="16px" icon="icon-park-outline:data-all" />,
        },
      ],
    },
    {
      type: "Delete",
      icon: <Icon fontSize="16px" icon="mingcute:delete-line" />,
      handleClick: handleDelete,
      selection: true,
    },
    {
      type: "Add",
      icon: <Icon fontSize="16px" icon="gridicons:add-outline" />,
      handleClick: handleAdd,
      postfix: true,
    },
  ];

  const pageHeaderButtonsExportConfiguration = [
    {
      type: "Configure Table",
      icon: <Icon fontSize="20px" icon="material-symbols:stack-outline" />,
      handleClick: handleTableConfigurationsOpen,
      text: false,
    },
    {
      type: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
      handleClick: handleExport,
      options: [
        {
          type: "All Data",
          icon: <Icon fontSize="16px" icon="icon-park-outline:data-all" />,
        },
      ],
    },
  ];

  const pageHeaderButtonsDismantleConfiguration = [
    {
      type: "Configure Table",
      icon: <Icon fontSize="20px" icon="material-symbols:stack-outline" />,
      handleClick: handleTableConfigurationsOpen,
      text: false,
    },
    {
      type: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
      handleClick: handleExport,
      options: [
        {
          type: "All Data",
          icon: <Icon fontSize="16px" icon="icon-park-outline:data-all" />,
        },
      ],
    },
    {
      type: "Dismantle",
      icon: <Icon fontSize="16px" icon="fluent:board-20-regular" />,
      handleClick: handleDismantle,
      selection: true,
    },
  ];

  return {
    pageHeaderButtonsDefaultConfiguration,
    pageHeaderButtonsAtomConfiguration,
    pageHeaderButtonsSingleAddConfiguration,
    pageHeaderButtonsExportConfiguration,
    pageHeaderButtonsDismantleConfiguration,
  };
}
