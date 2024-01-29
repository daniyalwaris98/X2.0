import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../../store/features/monitoringModule/manageCredentials/loginCredentials/selectors";
import {
  useFetchRecordsQuery,
  useDeleteRecordsMutation,
} from "../../../../store/features/monitoringModule/manageCredentials/loginCredentials/apis";
import { jsonToExcel } from "../../../../utils/helpers";
import {
  DELETE_PROMPT,
  DELETE_SELECTION_PROMPT,
  SUCCESSFUL_FILE_EXPORT_MESSAGE,
} from "../../../../utils/constants";
import useErrorHandling, {
  TYPE_FETCH,
  TYPE_BULK,
} from "../../../../hooks/useErrorHandling";
import useSweetAlert from "../../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../../hooks/useColumnsGenerator";
import useButtonsConfiguration from "../../../../hooks/useButtonsConfiguration";
import DefaultPageTableSection from "../../../../components/pageSections";
import DefaultTableConfigurations from "../../../../components/tableConfigurations";
import DefaultSpinner from "../../../../components/spinners";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import Modal from "./modal";
import {
  PAGE_NAME,
  ELEMENT_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
} from "./constants";

const Index = () => {
  // states required in hooks
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // hooks
  const { handleSuccessAlert, handleInfoAlert, handleCallbackAlert } =
    useSweetAlert();
  const { columnDefinitions } = useIndexTableColumnDefinitions({
    handleEdit,
  });
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_export: { handleClick: handleDefaultExport },
    default_delete: {
      handleClick: handleDelete,
      visible: selectedRowKeys.length > 0,
    },
    default_add: { handleClick: handleAdd, namePostfix: ELEMENT_NAME },
  });

  // states
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState(generatedColumns);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState(generatedColumns);

  // selectors
  const dataSource = useSelector(selectTableData);

  // apis
  const {
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isLoading: isFetchRecordsLoading,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
  } = useFetchRecordsQuery();

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

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: deleteRecordsData,
    isSuccess: isDeleteRecordsSuccess,
    isError: isDeleteRecordsError,
    error: deleteRecordsError,
    type: TYPE_BULK,
    callback: handleEmptySelectedRowKeys,
  });

  // handlers
  function handleEmptySelectedRowKeys() {
    setSelectedRowKeys([]);
  }

  function deleteData(allowed) {
    if (allowed) {
      deleteRecords(selectedRowKeys);
    } else {
      setSelectedRowKeys([]);
    }
  }

  function handleDelete() {
    if (selectedRowKeys.length > 0) {
      handleCallbackAlert(DELETE_PROMPT, deleteData);
    } else {
      handleInfoAlert(DELETE_SELECTION_PROMPT);
    }
  }

  function handleEdit(record) {
    setRecordToEdit(record);
    setOpen(true);
  }

  function handleAdd() {
    setOpen(true);
  }

  function handleClose() {
    setRecordToEdit(null);
    setOpen(false);
  }

  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert(SUCCESSFUL_FILE_EXPORT_MESSAGE);
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <DefaultSpinner spinning={isFetchRecordsLoading || isDeleteRecordsLoading}>
      {open ? (
        <Modal
          handleClose={handleClose}
          open={open}
          recordToEdit={recordToEdit}
        />
      ) : null}

      {tableConfigurationsOpen ? (
        <DefaultTableConfigurations
          columns={columns}
          availableColumns={availableColumns}
          setAvailableColumns={setAvailableColumns}
          displayColumns={displayColumns}
          setDisplayColumns={setDisplayColumns}
          setColumns={setColumns}
          open={tableConfigurationsOpen}
          setOpen={setTableConfigurationsOpen}
        />
      ) : null}

      <DefaultPageTableSection
        PAGE_NAME={PAGE_NAME}
        TABLE_DATA_UNIQUE_ID={TABLE_DATA_UNIQUE_ID}
        buttonsConfigurationList={buttonsConfigurationList}
        displayColumns={displayColumns}
        dataSource={dataSource}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </DefaultSpinner>
  );
};

export default Index;
