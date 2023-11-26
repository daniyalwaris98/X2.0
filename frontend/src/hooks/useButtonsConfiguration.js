import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";

export default function useButtonsConfiguration(buttonDetails) {
  const theme = useTheme();

  const configurations = {
    default_button: {
      name: "Default Button",
      handleClick: () =>
        alert(
          "Configuration for this button key does not exist in useButtonsConfiguration hook"
        ),
      sx: {
        backgroundColor: theme?.palette?.default_button?.import_background,
        color: theme?.palette?.default_button?.primary_text,
      },
    },
    configure_table: {
      icon: <Icon fontSize="20px" icon="material-symbols:stack-outline" />,
      sx: {
        backgroundColor:
          theme?.palette?.default_button?.configure_table_background,
        color: theme?.palette?.default_button?.configure_table_text,
      },
    },
    default_export: {
      name: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
      sx: {
        backgroundColor: theme?.palette?.drop_down_button?.export_background,
        color: theme?.palette?.drop_down_button?.export_text,
        border: `1px solid ${theme?.palette?.drop_down_button?.border}`,
      },
    },
    default_delete: {
      name: "Delete",
      icon: <Icon fontSize="16px" icon="mingcute:delete-line" />,
      sx: {
        backgroundColor: theme?.palette?.default_button?.delete_background,
        color: theme?.palette?.default_button?.primary_text,
      },
    },
    default_add: {
      name: "Add",
      icon: <Icon fontSize="16px" icon="gridicons:add-outline" />,
      postfix: true,
      sx: {
        backgroundColor: theme?.palette?.drop_down_button?.add_background,
        color: theme?.palette?.default_button?.primary_text,
      },
    },
    default_import: {
      name: "Import",
      icon: <Icon fontSize="16px" icon="pajamas:import" />,
      sx: {
        backgroundColor: theme?.palette?.default_button?.import_background,
        color: theme?.palette?.default_button?.primary_text,
      },
    },
    atom_export: {
      category: "dropDown",
      name: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
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
      sx: {
        backgroundColor: theme?.palette?.drop_down_button?.export_background,
        color: theme?.palette?.drop_down_button?.export_text,
      },
    },
    default_onboard: {
      name: "Onboard",
      icon: <Icon fontSize="16px" icon="fluent:board-20-regular" />,
      sx: {
        backgroundColor: theme?.palette?.default_button?.onboard_background,
        color: theme?.palette?.default_button?.primary_text,
      },
    },
    atom_add: {
      category: "dropDown",
      name: "Add",
      icon: <Icon fontSize="16px" icon="gridicons:add-outline" />,
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
      sx: {
        backgroundColor: theme?.palette?.drop_down_button?.add_background,
        color: theme?.palette?.drop_down_button?.add_text,
      },
    },
    template_export: {
      category: "dropDown",
      name: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
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
      sx: {
        backgroundColor: theme?.palette?.drop_down_button?.export_background,
        color: theme?.palette?.drop_down_button?.export_text,
      },
    },
    default_dismantle: {
      name: "Dismantle",
      icon: <Icon fontSize="16px" icon="fluent:board-20-regular" />,
      sx: {
        backgroundColor: theme?.palette?.default_button?.delete_background,
        color: theme?.palette?.default_button?.primary_text,
      },
    },

    default_cancel: {
      name: "Cancel",
      sx: {
        backgroundColor: theme?.palette?.default_button?.delete_background,
        color: theme?.palette?.default_button?.primary_text,
      },
    },

    default_submit: {
      name: "Submit",
      type: "submit",
      sx: {
        backgroundColor: theme?.palette?.default_button?.add_background,
        color: theme?.palette?.default_button?.primary_text,
      },
    },
    default_reset: {
      name: "Reset",
      sx: {
        backgroundColor: theme?.palette?.default_button?.add_background,
        color: theme?.palette?.default_button?.primary_text,
      },
    },
    default_save: {
      name: "Save",
      sx: {
        backgroundColor: theme?.palette?.default_button?.add_background,
        color: theme?.palette?.default_button?.primary_text,
      },
    },
  };

  const pageHeaderButtonsConfigurationList = Object.keys(buttonDetails).map(
    (key) => {
      if (configurations[key]) {
        return { ...configurations[key], ...buttonDetails[key] };
      } else {
        return configurations.default_button;
      }
    }
  );

  const pageHeaderButtonsConfigurationObject = Object.keys(
    buttonDetails
  ).reduce((generatedConfiguration, key) => {
    if (configurations[key]) {
      generatedConfiguration[key] = {
        ...configurations[key],
        ...buttonDetails[key],
      };
      return generatedConfiguration;
    } else {
      generatedConfiguration[key] = {
        ...configurations.default_button,
        ...buttonDetails[key],
      };
      return generatedConfiguration;
    }
  }, {});

  return {
    pageHeaderButtonsConfigurationList,
    pageHeaderButtonsConfigurationObject,
  };
}
