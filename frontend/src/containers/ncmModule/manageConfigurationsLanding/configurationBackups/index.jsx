import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import CompareModal from "./compareModal";
import RestoreModal from "./restoreModal";
import {
  useFetchRecordsMutation,
  useBackupSingleNcmConfigurationByNcmDeviceIdMutation,
} from "../../../../store/features/ncmModule/manageConfigurations/configurationBackups/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../../store/features/ncmModule/manageConfigurations/configurationBackups/selectors";
import useErrorHandling from "../../../../hooks/useErrorHandling";
import useColumnsGenerator from "../../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import DefaultTableConfigurations from "../../../../components/tableConfigurations";
import useButtonsConfiguration from "../../../../hooks/useButtonsConfiguration";
import { PAGE_NAME, TABLE_DATA_UNIQUE_ID } from "./constants";
import { TABLE_DATA_UNIQUE_ID as MANAGE_CONFIGURATIONS_TABLE_DATA_UNIQUE_ID } from "../../manageConfigurations/constants";
import { TYPE_FETCH, TYPE_BULK } from "../../../../hooks/useErrorHandling";
import { PageTableSectionWithoutScrollAndWidth } from "../../../../components/pageSections";
import { Grid } from "@mui/material";
import BackupDetails from "./backupDetails";
import { Spin } from "antd";
import { selectSelectedDevice } from "../../../../store/features/ncmModule/manageConfigurations/selectors";

const Index = () => {
  // theme
  const theme = useTheme();
  const selectedDevice = useSelector(selectSelectedDevice);

  // hooks
  const { columnDefinitions } = useIndexTableColumnDefinitions({});
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_restore: { handleClick: handleRestoreModalOpen },
    default_backup: { handleClick: handleSingleBackup },
    default_compare: { handleClick: handleCompareModalOpen },
  });

  // states
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState(generatedColumns);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState(generatedColumns);
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  // selectors
  // const dataSource = [
  //   { ncm_history_id: 1, ip_address: "452" },
  //   { ncm_history_id: 2, ip_address: "312" },
  // ];
  const dataSource = useSelector(selectTableData);

  // apis
  const [
    fetchRecords,
    {
      data: fetchRecordsData,
      isSuccess: isFetchRecordsSuccess,
      isLoading: isFetchRecordsLoading,
      isError: isFetchRecordsError,
      error: fetchRecordsError,
    },
  ] = useFetchRecordsMutation();

  const [
    singleBackup,
    {
      data: singleBackupData,
      isSuccess: isSingleBackupSuccess,
      isLoading: isSingleBackupLoading,
      isError: isSingleBackupError,
      error: singleBackupError,
    },
  ] = useBackupSingleNcmConfigurationByNcmDeviceIdMutation();

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: singleBackupData,
    isSuccess: isSingleBackupSuccess,
    isError: isSingleBackupError,
    error: singleBackupError,
    type: TYPE_BULK,
  });

  // effects
  useEffect(() => {
    if (selectedDevice) {
      fetchRecords({
        [MANAGE_CONFIGURATIONS_TABLE_DATA_UNIQUE_ID]:
          selectedDevice[MANAGE_CONFIGURATIONS_TABLE_DATA_UNIQUE_ID],
      });
    }
  }, []);

  // handlers
  function handleSingleBackup() {
    singleBackup({
      [MANAGE_CONFIGURATIONS_TABLE_DATA_UNIQUE_ID]:
        selectedDevice[MANAGE_CONFIGURATIONS_TABLE_DATA_UNIQUE_ID],
    });
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  function handleCompareModalOpen() {
    setCompareModalOpen(true);
  }

  function handleCompareModalClose() {
    setCompareModalOpen(false);
  }

  function handleRestoreModalOpen() {
    setRestoreModalOpen(true);
  }

  function handleRestoreModalClose() {
    setRestoreModalOpen(false);
  }

  return (
    <Spin spinning={isFetchRecordsLoading || isSingleBackupLoading}>
      {/* <Spin spinning={false}> */}
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

      {compareModalOpen ? (
        <CompareModal
          handleClose={handleCompareModalClose}
          open={compareModalOpen}
          ncmDeviceId={selectedDevice?.ncm_device_id}
        />
      ) : null}

      {restoreModalOpen ? (
        <RestoreModal
          handleClose={handleRestoreModalClose}
          open={restoreModalOpen}
          ncmDeviceId={selectedDevice?.ncm_device_id}
        />
      ) : null}

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <PageTableSectionWithoutScrollAndWidth
            PAGE_NAME={PAGE_NAME}
            TABLE_DATA_UNIQUE_ID={TABLE_DATA_UNIQUE_ID}
            buttonsConfigurationList={buttonsConfigurationList}
            displayColumns={displayColumns}
            dataSource={dataSource}
            rowClickable={true}
            selectedRowKey={selectedRowKey}
            setSelectedRowKey={setSelectedRowKey}
          />
        </Grid>
        <Grid item xs={12}>
          <BackupDetails ncmHistoryId={selectedRowKey} />
        </Grid>
      </Grid>
    </Spin>
  );
};

export default Index;
