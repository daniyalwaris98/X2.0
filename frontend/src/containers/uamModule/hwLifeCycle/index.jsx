import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Modal from "./modal";
import {
  useFetchRecordsQuery,
  useDeleteRecordsMutation,
  useSyncFromInventoryQuery,
  useSyncToInventoryQuery,
} from "../../../store/features/uamModule/hwLifeCycle/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/uamModule/hwLifeCycle/selectors";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { jsonToExcel, generateObject } from "../../../utils/helpers";
import { Spin } from "antd";
import useErrorHandling from "../../../hooks/useErrorHandling";
import DefaultTableConfigurations from "../../../components/tableConfigurations";
import useSweetAlert from "../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import useButtonsConfiguration from "../../../hooks/useButtonsConfiguration";
import {
  PAGE_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
} from "./constants";
import { TYPE_FETCH, TYPE_BULK } from "../../../hooks/useErrorHandling";
import DefaultPageTableSection from "../../../components/pageSections";

const Index = () => {
  // theme
  const theme = useTheme();

  // states required in hooks
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // hooks
  const { height, width } = useWindowDimensions();
  const { handleSuccessAlert, handleInfoAlert, handleCallbackAlert } =
    useSweetAlert();
  const { columnDefinitions, dataKeys } = useIndexTableColumnDefinitions({
    handleEdit,
  });
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { dropdownButtonOptionsConstants, buttonsConfigurationList } =
    useButtonsConfiguration({
      configure_table: { handleClick: handleTableConfigurationsOpen },
      template_export: { handleClick: handleExport },
      default_delete: {
        handleClick: handleDelete,
        visible: selectedRowKeys.length > 0,
      },
      inventory_sync: { handleClick: handleSync, namePostfix: PAGE_NAME },
      default_import: { handleClick: handleDefaultAdd },
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

  const {
    data: syncFromInventoryData,
    isSuccess: isSyncFromInventorySuccess,
    isLoading: isSyncFromInventoryLoading,
    isError: isSyncFromInventoryError,
    error: syncFromInventoryError,
    refetch: syncFromInventory,
  } = useSyncFromInventoryQuery({ skip: true });

  const {
    data: syncToInventoryData,
    isSuccess: isSyncToInventorySuccess,
    isLoading: isSyncToInventoryLoading,
    isError: isSyncToInventoryError,
    error: syncToInventoryError,
    refetch: syncToInventory,
  } = useSyncToInventoryQuery({ skip: true });

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
    data: syncFromInventoryData,
    isSuccess: isSyncFromInventorySuccess,
    isError: isSyncFromInventoryError,
    error: syncFromInventoryError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: syncToInventoryData,
    isSuccess: isSyncToInventorySuccess,
    isError: isSyncToInventoryError,
    error: syncToInventoryError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: deleteRecordsData,
    isSuccess: isDeleteRecordsSuccess,
    isError: isDeleteRecordsError,
    error: deleteRecordsError,
    type: TYPE_BULK,
  });

  // handlers
  function deleteData(allowed) {
    if (allowed) {
      const result = dataSource
        .filter((obj) => selectedRowKeys.includes(obj.sntc_id))
        .map((obj) => obj.pn_code);
      deleteRecords(result);
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

  function handleEdit(record) {
    setRecordToEdit(record);
    setOpen(true);
  }

  function handleDefaultAdd() {
    setOpen(true);
  }

  function handleSync(optionType) {
    const { SYNC_FROM_INVENTORY, SYNC_TO_INVENTORY } =
      dropdownButtonOptionsConstants.inventory_sync;
    if (optionType === SYNC_FROM_INVENTORY) {
      syncFromInventory();
    } else if (optionType === SYNC_TO_INVENTORY) {
      syncToInventory();
    }
  }

  function handleClose() {
    setRecordToEdit(null);
    setOpen(false);
  }

  function handleExport(optionType) {
    const { ALL_DATA, TEMPLATE } =
      dropdownButtonOptionsConstants.template_export;
    if (optionType === ALL_DATA) {
      jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    } else if (optionType === TEMPLATE) {
      jsonToExcel([generateObject(dataKeys)], "site_template");
    } else {
      jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    }
    handleSuccessAlert("File exported successfully.");
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <Spin
      spinning={
        isFetchRecordsLoading ||
        isSyncFromInventoryLoading ||
        isSyncToInventoryLoading ||
        isDeleteRecordsLoading
      }
    >
      <div>
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
          selectedRowKeys={selectedRowKeys}
          displayColumns={displayColumns}
          dataSource={dataSource}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </div>
    </Spin>
  );
};

export default Index;
