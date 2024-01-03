import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import CompareModal from "./compareModal";
import RestoreModal from "./restoreModal";
import {
  useFetchRecordsMutation,
  useBackupSingleNcmConfigurationByNcmDeviceIdMutation,
} from "../../../../store/features/ncmModule/manageConfigurations/configurationBackups/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../../store/features/atomModule/passwordGroups/selectors";
import { jsonToExcel } from "../../../../utils/helpers";
import useErrorHandling from "../../../../hooks/useErrorHandling";
import useSweetAlert from "../../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import DefaultTableConfigurations from "../../../../components/tableConfigurations";
import useButtonsConfiguration from "../../../../hooks/useButtonsConfiguration";
import {
  PAGE_NAME,
  ELEMENT_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
} from "./constants";
import { TYPE_FETCH, TYPE_BULK } from "../../../../hooks/useErrorHandling";
import { PageTableSectionWithoutScrollAndWidth } from "../../../../components/pageSections";
import { Grid } from "@mui/material";
import BackupDetails from "./backupDetails";
import { Spin } from "antd";

const Index = () => {
  // theme
  const theme = useTheme();

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

  // selectors
  const dataSource = [{ backup_id: 1 }, { backup_id: 2 }];
  // const dataSource = useSelector(selectTableData);

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
    fetchRecords();
  }, []);

  // handlers
  function handleSingleBackup() {
    singleBackup();
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
        />
      ) : null}

      {restoreModalOpen ? (
        <RestoreModal
          handleClose={handleRestoreModalClose}
          open={restoreModalOpen}
        />
      ) : null}

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <PageTableSectionWithoutScrollAndWidth
            PAGE_NAME={PAGE_NAME}
            TABLE_DATA_UNIQUE_ID={TABLE_DATA_UNIQUE_ID}
            buttonsConfigurationList={buttonsConfigurationList}
            displayColumns={displayColumns}
            dataSource={dataSource}
            onRow
          />
        </Grid>
        <Grid item xs={6}>
          <BackupDetails />
        </Grid>
      </Grid>
    </Spin>
  );
};

export default Index;
