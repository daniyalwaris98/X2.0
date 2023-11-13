import Swal from "sweetalert2";

const sweetAlertWrapper = {
  success: (title, text) => Swal.fire({ icon: "success", title, text }),
  error: (title, text) => Swal.fire({ icon: "error", title, text }),
  warning: (title, text) => Swal.fire({ icon: "warning", title, text }),
  info: (title, text) => Swal.fire({ icon: "info", title, text }),
  custom: (options) => Swal.fire(options),
  callback: (title, text, callback) =>
    Swal.fire({ icon: "success", title, text }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    }),
};

export default sweetAlertWrapper;

export const handleSuccessAlert = (message) => {
  sweetAlertWrapper.success("Success!", message);
};

export const handleErrorAlert = (message) => {
  sweetAlertWrapper.error("Error!", message);
};

export const handleWarningAlert = (message) => {
  sweetAlertWrapper.warning("Warning!", message);
};

export const handleInfoAlert = (message) => {
  sweetAlertWrapper.info("Info!", message);
};

export const handleCustomAlert = (icon, title, text) => {
  sweetAlertWrapper.custom({
    icon,
    title,
    text,
  });
};

export const handleCallbackAlert = (type, message, callback, title = "") => {
  if (type === "success") {
    sweetAlertWrapper.success(title ?? "Success!", message, callback);
  } else if (type === "error") {
    sweetAlertWrapper.error(title ?? "Error!", message, callback);
  } else if (type === "warning") {
    sweetAlertWrapper.warning(title ?? "Warning!", message, callback);
  } else if (type === "info") {
    sweetAlertWrapper.info(title ?? "Info!", message, callback);
  }
};
