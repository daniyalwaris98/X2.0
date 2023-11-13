import Swal from "sweetalert2";

const sweetAlertWrapper = {
  success: (title, text) => Swal.fire({ icon: "success", title, text }),
  error: (title, text) => Swal.fire({ icon: "error", title, text }),
  warning: (title, text) => Swal.fire({ icon: "warning", title, text }),
  info: (title, text) => Swal.fire({ icon: "info", title, text }),
  custom: (options) => Swal.fire(options),
};

export default sweetAlertWrapper;

export const handleImportSuccessAlert = () => {
  sweetAlertWrapper.success("Success!", "Records added successfully.");
};

export const handleDeleteSuccessAlert = () => {
  sweetAlertWrapper.success("Success!", "Records deleted successfully.");
};

export const handleAddSuccessAlert = () => {
  sweetAlertWrapper.success("Success!", "Record added successfully.");
};

export const handleUpdateSuccessAlert = (message) => {
  sweetAlertWrapper.success(
    "Success!",
    message || "Record updated successfully."
  );
};

export const handleErrorAlert = (message) => {
  sweetAlertWrapper.error("Error!", message);
};

export const handleCustomAlert = (icon, title, text) => {
  sweetAlertWrapper.custom({
    icon,
    title,
    text,
  });
};
