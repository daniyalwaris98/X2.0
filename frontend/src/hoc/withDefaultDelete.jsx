import React, { useEffect } from "react";
import useErrorHandling from "../hooks/useErrorHandling";
import useSweetAlert from "../hooks/useSweetAlert";
import { TYPE_BULK } from "../hooks/useErrorHandling";

export default function withDefaultDelete({
  Component,
  useDeleteRecordsMutation,
  selectedRowKeys,
  setSelectedRowKeys,
}) {
  return function WithDefaultDelete() {
    const { handleInfoAlert, handleCallbackAlert } = useSweetAlert();

    const [
      deleteRecords,
      {
        data: deleteRecordsData,
        isSuccess: isDeleteRecordsSuccess,
        isLoading: isDeleteRecordsLoading,
        isError: isDeleteRecordsError,
        error: deleteRecordsError,
      },
    ] = useDeleteRecordsMutation();

    useErrorHandling({
      data: deleteRecordsData,
      isSuccess: isDeleteRecordsSuccess,
      isError: isDeleteRecordsError,
      error: deleteRecordsError,
      type: TYPE_BULK,
    });

    useEffect(() => {
      setSelectedRowKeys((prev) =>
        prev.filter((item) => !deleteRecordsData?.data.includes(item))
      );
    }, [isDeleteRecordsSuccess]);

    function deleteData(allowed) {
      if (allowed) {
        deleteRecords(selectedRowKeys);
      } else {
        setSelectedRowKeys([]);
      }
    }

    function handleDelete() {
      if (selectedRowKeys.length > 0) {
        handleCallbackAlert(
          "Are you sure you want delete these records?",
          deleteData
        );
      } else {
        handleInfoAlert("No record has been selected to delete!");
      }
    }

    return <Component handleDelete={handleDelete} />;
  };
}
