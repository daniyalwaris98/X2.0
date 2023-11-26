import React from "react";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material/styles";

export default function useSweetAlert() {
  const theme = useTheme();

  const sweetAlertWrapper = {
    success: (title, text) =>
      Swal.fire({
        icon: "success",
        title,
        html: text,
        background: theme?.palette?.sweet_alert?.background,
        color: theme?.palette?.sweet_alert?.primary_text,
        confirmButtonColor:
          theme?.palette?.default_button?.success_alert_background,
      }),
    error: (title, text) =>
      Swal.fire({
        icon: "error",
        title,
        html: text,
        background: theme?.palette?.sweet_alert?.background,
        color: theme?.palette?.sweet_alert?.primary_text,
        confirmButtonColor:
          theme?.palette?.default_button?.error_alert_background,
      }),
    warning: (title, text) =>
      Swal.fire({
        icon: "warning",
        title,
        html: text,
        background: theme?.palette?.sweet_alert?.background,
        color: theme?.palette?.sweet_alert?.primary_text,
        confirmButtonColor:
          theme?.palette?.default_button?.warning_alert_background,
      }),
    info: (title, text) =>
      Swal.fire({
        icon: "info",
        title,
        html: text,
        background: theme?.palette?.sweet_alert?.background,
        color: theme?.palette?.sweet_alert?.primary_text,
        confirmButtonColor:
          theme?.palette?.default_button?.info_alert_background,
      }),
    custom: (options) => Swal.fire(options),
    callback: (icon, title, text, callback) =>
      Swal.fire({
        icon,
        title,
        html: text,
        background: theme?.palette?.sweet_alert?.background,
        color: theme?.palette?.sweet_alert?.primary_text,
        confirmButtonColor:
          theme?.palette?.default_button?.success_alert_background,
      }).then((result) => {
        if (result.isConfirmed && callback) {
          callback();
        }
      }),
  };

  const handleSuccessAlert = (message) => {
    sweetAlertWrapper.success("Success!", message);
  };

  const handleErrorAlert = (message) => {
    sweetAlertWrapper.error("Error!", message);
  };

  const handleWarningAlert = (message) => {
    sweetAlertWrapper.warning("Warning!", message);
  };

  const handleInfoAlert = (message) => {
    sweetAlertWrapper.info("Info!", message);
  };

  const handleCustomAlert = (icon, title, text) => {
    sweetAlertWrapper.custom({
      icon,
      title,
      text,
    });
  };

  const handleCallbackAlert = (
    message,
    callback,
    type = "warning",
    title = null
  ) => {
    if (type === "success") {
      sweetAlertWrapper.callback(type, title ?? "Success!", message, callback);
    } else if (type === "error") {
      sweetAlertWrapper.callback(type, title ?? "Error!", message, callback);
    } else if (type === "warning") {
      sweetAlertWrapper.callback(type, title ?? "Warning!", message, callback);
    } else if (type === "info") {
      sweetAlertWrapper.callback(type, title ?? "Info!", message, callback);
    }
  };
  return {
    sweetAlertWrapper,
    handleSuccessAlert,
    handleErrorAlert,
    handleWarningAlert,
    handleInfoAlert,
    handleCustomAlert,
    handleCallbackAlert,
  };
}
