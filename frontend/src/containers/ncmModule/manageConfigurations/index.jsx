import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/ncmModule/manageConfigurations/selectors";
import { setSelectedDevice } from "../../../store/features/ncmModule/manageConfigurations";
import {
  useFetchRecordsQuery,
  useDeleteRecordsMutation,
  useBulkBackupNcmConfigurationsByDeviceIdsMutation,
  useGetAllCompletedBackupsLazyQuery,
} from "../../../store/features/ncmModule/manageConfigurations/apis";
import { jsonToExcel } from "../../../utils/helpers";
import {
  DELETE_PROMPT,
  DELETE_SELECTION_PROMPT,
  SUCCESSFUL_FILE_EXPORT_MESSAGE,
} from "../../../utils/constants";
import useErrorHandling, {
  TYPE_FETCH,
  TYPE_BULK,
} from "../../../hooks/useErrorHandling";
import useSweetAlert from "../../../hooks/useSweetAlert";
import useButtonsConfiguration from "../../../hooks/useButtonsConfiguration";
import useColumnsGenerator from "../../../hooks/useColumnsGenerator";
import DefaultPageTableSection from "../../../components/pageSections";
import DefaultTableConfigurations from "../../../components/tableConfigurations";
import DefaultSpinner from "../../../components/spinners";
import { PAGE_PATH as PAGE_PATH_CONFIGURATION_BACKUPS } from "../manageConfigurationsLanding/configurationBackups/constants";
import { PAGE_PATH as PAGE_PATH_REMOTE_COMMAND_SENDER } from "../manageConfigurationsLanding/remoteCommandSender/constants";
import { LANDING_PAGE_RELATIVE_PATH as PAGE_PATH_MANAGE_CONFIGURATIONS_LANDING } from "../manageConfigurationsLanding";
import AddModal from "./addModal";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import {
  PAGE_NAME,
  ELEMENT_NAME_BULK,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
} from "./constants";

const Index = () => {
  // refs
  const intervalIdRef = useRef(null);

  // states required in hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isBackupButtonLoading, setIsBackupButtonLoading] = useState(false);

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
      loader: isBackupButtonLoading,
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

  const [
    getAllCompletedBackups,
    {
      data: getAllCompletedBackupsData,
      isSuccess: isGetAllCompletedBackupsSuccess,
      isLoading: isGetAllCompletedBackupsLoading,
      isError: isGetAllCompletedBackupsError,
      error: getAllCompletedBackupsError,
    },
  ] = useGetAllCompletedBackupsLazyQuery();

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

  // effects
  useEffect(() => {
    getAllCompletedBackups();
  }, []);

  // Check if getAllCompletedBackupsData is an empty array and clear the interval
  useEffect(() => {
    setIsBackupButtonLoading(
      getAllCompletedBackupsData !== undefined
        ? getAllCompletedBackupsData.length > 0
          ? true
          : false
        : true
    );

    if (getAllCompletedBackupsData?.length === 0 && intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    if (getAllCompletedBackupsData?.length > 0 && !intervalIdRef.current) {
      intervalIdRef.current = setInterval(() => {
        getAllCompletedBackups();
      }, 5000); // in milliseconds
    }
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [getAllCompletedBackupsData]);

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
      handleCallbackAlert(DELETE_PROMPT, deleteData);
    } else {
      handleInfoAlert(DELETE_SELECTION_PROMPT);
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
    handleSuccessAlert(SUCCESSFUL_FILE_EXPORT_MESSAGE);
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <DefaultSpinner
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
    </DefaultSpinner>
  );
};

export default Index;
