import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import AddModal from "./addModal";
import {
  useFetchRecordsQuery,
  useDeleteRecordsMutation,
  useBulkBackupNcmConfigurationsByDeviceIdsMutation,
} from "../../../store/features/ncmModule/manageConfigurations/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/ncmModule/manageConfigurations/selectors";
import { jsonToExcel } from "../../../utils/helpers";
import { Spin } from "antd";
import useErrorHandling from "../../../hooks/useErrorHandling";
import useSweetAlert from "../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import DefaultTableConfigurations from "../../../components/tableConfigurations";
import useButtonsConfiguration from "../../../hooks/useButtonsConfiguration";
import {
  PAGE_NAME,
  ELEMENT_NAME_BULK,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
} from "./constants";
import { TYPE_FETCH, TYPE_BULK } from "../../../hooks/useErrorHandling";
import DefaultPageTableSection from "../../../components/pageSections";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedDevice } from "../../../store/features/ncmModule/manageConfigurations";
import { PAGE_PATH as PAGE_PATH_CONFIGURATION_BACKUPS } from "../manageConfigurationsLanding/configurationBackups/constants";
import { PAGE_PATH as PAGE_PATH_REMOTE_COMMAND_SENDER } from "../manageConfigurationsLanding/remoteCommandSender/constants";
import { LANDING_PAGE_RELATIVE_PATH as PAGE_PATH_MANAGE_CONFIGURATIONS_LANDING } from "../manageConfigurationsLanding";

const Index = () => {
  // theme
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // states required in hooks
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // hooks
  const { handleSuccessAlert, handleInfoAlert, handleCallbackAlert } =
    useSweetAlert();
  const { columnDefinitions } = useIndexTableColumnDefinitions({
    handleIpAddressClick,
    handleRcsClick,
  });
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_export: { handleClick: handleDefaultExport },
    default_delete: {
      handleClick: handleDelete,
      visible: selectedRowKeys.length > 0,
    },
    default_backup: {
      handleClick: handleBulkBackup,
      visible: selectedRowKeys.length > 0,
    },
    default_add: { handleClick: handleAdd, namePostfix: ELEMENT_NAME_BULK },
  });

  // states
  const [addModalOpen, setAddModalOpen] = useState(false);
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

  const [
    bulkBackup,
    {
      data: bulkBackupData,
      isSuccess: isBulkBackupSuccess,
      isLoading: isBulkBackupLoading,
      isError: isBulkBackupError,
      error: bulkBackupError,
    },
  ] = useBulkBackupNcmConfigurationsByDeviceIdsMutation();

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

  useErrorHandling({
    data: bulkBackupData,
    isSuccess: isBulkBackupSuccess,
    isError: isBulkBackupError,
    error: bulkBackupError,
    type: TYPE_BULK,
  });

  // handlers
  function handleIpAddressClick(record) {
    dispatch(setSelectedDevice(record));
    navigate(
      `${PAGE_PATH_MANAGE_CONFIGURATIONS_LANDING}/${PAGE_PATH_CONFIGURATION_BACKUPS}`
    );
  }

  function handleRcsClick(record) {
    dispatch(setSelectedDevice(record));
    navigate(
      `${PAGE_PATH_MANAGE_CONFIGURATIONS_LANDING}/${PAGE_PATH_REMOTE_COMMAND_SENDER}`
    );
  }

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
      handleCallbackAlert(
        "Are you sure you want delete these records?",
        deleteData
      );
    } else {
      handleInfoAlert("No record has been selected to delete!");
    }
  }

  function handleAdd() {
    setAddModalOpen(true);
  }

  function handleAddClose() {
    setAddModalOpen(false);
  }

  function handleBulkBackup() {
    bulkBackup(selectedRowKeys);
  }

  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert("File exported successfully.");
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <Spin
      spinning={
        isFetchRecordsLoading || isDeleteRecordsLoading || isBulkBackupLoading
      }
    >
      {addModalOpen ? (
        <AddModal handleClose={handleAddClose} open={addModalOpen} />
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
    </Spin>
  );
};

export default Index;
