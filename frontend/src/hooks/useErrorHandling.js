import { useEffect } from "react";
import {
  handleSuccessAlert,
  handleInfoAlert,
  handleErrorAlert,
} from "../components/sweetAlertWrapper";

export default function useErrorHandling({
  data,
  isSuccess,
  isError,
  error,
  type,
}) {
  useEffect(() => {
    if (type === "bulkAdd") {
      if (isError) {
        if (error.status === 500) {
          handleErrorAlert(error.data);
        } else if (error.status === 422) {
          handleErrorAlert(
            error.data.detail.map((item) => item.msg).join("<br>")
          );
        }
      } else if (isSuccess) {
        if (data[0]?.error === 0) {
          handleSuccessAlert(
            data[0]?.success_list.map((item) => item.message).join("<br>")
          );
        } else if (data[0]?.success === 0) {
          handleErrorAlert(
            data[0]?.error_list.map((item) => item.message).join("<br>")
          );
        } else {
          handleInfoAlert(
            `${data[0]?.success_list
              .map((item) => item.message)
              .join("<br>")}\n${data[0]?.error_list
              .map((item) => item.message)
              .join("<br>")}`
          );
        }
      }
    } else if (type === "bulkDelete") {
      if (isError) {
        if (error.status === 500) {
          handleErrorAlert(error.data);
        } else if (error.status === 422) {
          handleErrorAlert(
            error.data.detail.map((item) => item.msg).join("\n")
          );
        }
      } else if (isSuccess) {
        if (data[0]?.error === 0) {
          handleSuccessAlert(data[0]?.success_list.join("<br>"));
        } else if (data[0]?.success === 0) {
          handleErrorAlert(data[0]?.error_list.join("<br>"));
        } else {
          handleInfoAlert(
            `${data[0]?.success_list.join(
              "<br>"
            )}<br>Errors:${data[0]?.error_list.join("<br>")}`
          );
        }
      }
    } else if (type === "single") {
      if (isError) {
        handleErrorAlert(error.data);
      } else if (isSuccess) {
        handleSuccessAlert(data.message);
      }
    }
  }, [isSuccess, isError]);
}
