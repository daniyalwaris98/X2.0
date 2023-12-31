import { useEffect } from "react";
import useSweetAlert from "./useSweetAlert";

export const TYPE_FETCH = "fetch";
export const TYPE_SINGLE = "single";
export const TYPE_BULK = "bulk";

export default function useErrorHandling({
  data,
  isSuccess,
  isError,
  error,
  type,
  setSelectedRowKeys = null,
  callback = () => {},
}) {
  const {
    handleSuccessAlert,
    handleInfoAlert,
    handleErrorAlert,
    handleCallbackAlert,
  } = useSweetAlert();

  useEffect(() => {
    if (type === TYPE_FETCH) {
      if (isSuccess) {
        // handleSuccessAlert("Data Fetched Successfully");
        console.log("Data Fetched Successfully");
      } else if (isError) {
        if (error?.status === 400) {
          handleErrorAlert(error?.data);
        } else if (error?.status === 404) {
          handleErrorAlert(error?.data?.detail);
        } else if (error?.status === 422) {
          handleErrorAlert(
            error?.data?.detail
              .map(
                (item) =>
                  `${item?.loc[2]} ${item?.msg} in ${item?.loc[0]} at index  ${item?.loc[1]}`
              )
              .join("<br>")
          );
        } else if (error?.status === 500) {
          handleErrorAlert(error?.data);
        } else {
          console.log(error);
        }
      }
    } else if (type === TYPE_SINGLE) {
      if (isSuccess) {
        handleCallbackAlert(data?.message, callback, "success");
        // handleSuccessAlert(data?.message);
      } else if (isError) {
        if (error?.status === 400) {
          handleErrorAlert(error?.data);
        } else if (error?.status === 404) {
          handleErrorAlert(error?.data?.detail);
        } else if (error?.status === 422) {
          handleErrorAlert(
            error?.data?.detail
              .map(
                (item) =>
                  `${item?.loc[2]} ${item?.msg} in ${item?.loc[0]} at index  ${item?.loc[1]}`
              )
              .join("<br>")
          );
        } else if (error?.status === 500) {
          handleErrorAlert(error?.data);
        } else {
          console.log(error);
        }
      }
    } else if (type === TYPE_BULK) {
      if (isSuccess) {
        if (data?.error === 0) {
          handleCallbackAlert(
            "Operation Executed Successfully.",
            callback,
            "success"
          );
          // handleSuccessAlert(data?.success_list?.join("<br>"));
        } else if (data?.success === 0) {
          handleCallbackAlert(
            data?.error_list?.join("<br>"),
            callback,
            "error"
          );
          // handleErrorAlert(data?.error_list?.join("<br>"));
        } else {
          handleCallbackAlert(
            `Operation Executed Successfully with the following Exceptions:<br>${data?.error_list?.join(
              "<br>"
            )}`,
            callback,
            "info"
          );
          // handleInfoAlert(
          //   `${data?.success_list?.join("<br>")}<br>${data?.error_list?.join(
          //     "<br>"
          //   )}`
          // );
        }
      } else if (isError) {
        if (error?.status === 400) {
          handleCallbackAlert(error?.data, callback, "error");
          // handleErrorAlert(error?.data);
        } else if (error?.status === 404) {
          handleCallbackAlert(error?.data?.detail, callback, "error");
          // handleErrorAlert(error?.data?.detail);
        } else if (error?.status === 422) {
          handleCallbackAlert(
            error?.data?.detail
              .map(
                (item) =>
                  `${item?.loc[2]} ${item?.msg} in ${item?.loc[0]} at index  ${item?.loc[1]}`
              )
              .join("<br>"),
            callback,
            "error"
          );
          // handleErrorAlert(
          //   error?.data?.detail
          //     .map(
          //       (item) =>
          //         `${item?.loc[2]} ${item?.msg} in ${item?.loc[0]} at index  ${item?.loc[1]}`
          //     )
          //     .join("<br>")
          // );
        } else if (error?.status === 500) {
          handleCallbackAlert(error?.data, callback, "error");
          // handleErrorAlert(error?.data);
        } else {
          console.log(error);
        }
      }
    }
  }, [isSuccess, isError]);
}
