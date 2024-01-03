import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultDialog from "../../../../components/dialogs";
import { CancelDialogFooter } from "../../../../components/dialogFooters";
import Grid from "@mui/material/Grid";
import {
  useGetAllDeletedNcmConfigurationBackupsByNcmDeviceIdMutation,
  useRestoreNcmConfigurationBackupsByNcmHistoryIdsMutation,
} from "../../../../store/features/ncmModule/manageConfigurations/configurationBackups/apis";
import { useSelector } from "react-redux";
import { selectDeletedConfigurationBackups } from "../../../../store/features/ncmModule/manageConfigurations/configurationBackups/selectors";
import { Spin } from "antd";
import useErrorHandling from "../../../../hooks/useErrorHandling";
import useColumnsGenerator from "../../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import DefaultTableConfigurations from "../../../../components/tableConfigurations";
import useButtonsConfiguration from "../../../../hooks/useButtonsConfiguration";
import { ATOM_ID as TABLE_DATA_UNIQUE_ID } from "../../../atomModule/atoms/constants";
import { TYPE_FETCH, TYPE_BULK } from "../../../../hooks/useErrorHandling";
import { PageTableSectionWithoutScrollAndWidth } from "../../../../components/pageSections";
import { PAGE_NAME } from "./constants";

const Index = ({ handleClose, open, ncmDeviceId }) => {
  const theme = useTheme();

  // states required in hooks
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // hooks
  const { restoreColumnDefinitions: columnDefinitions } =
    useIndexTableColumnDefinitions({});
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_restore: {
      handleClick: handleAdd,
      visible: selectedRowKeys.length > 0,
    },
  });

  // states
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState(generatedColumns);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState(generatedColumns);

  // apis
  const [
    getDeletedBackups,
    {
      data: getDeletedBackupsData,
      isSuccess: isGetDeletedBackupsSuccess,
      isLoading: isGetDeletedBackupsLoading,
      isError: isGetDeletedBackupsError,
      error: getDeletedBackupsError,
    },
  ] = useGetAllDeletedNcmConfigurationBackupsByNcmDeviceIdMutation();

  const [
    restoreBackups,
    {
      data: restoreBackupsData,
      isSuccess: isRestoreBackupsSuccess,
      isLoading: isRestoreBackupsLoading,
      isError: isRestoreBackupsError,
      error: restoreBackupsError,
    },
  ] = useRestoreNcmConfigurationBackupsByNcmHistoryIdsMutation();

  // error handling custom hooks
  useErrorHandling({
    data: getDeletedBackupsData,
    isSuccess: isGetDeletedBackupsSuccess,
    isError: isGetDeletedBackupsError,
    error: getDeletedBackupsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: restoreBackupsData,
    isSuccess: isRestoreBackupsSuccess,
    isError: isRestoreBackupsError,
    error: restoreBackupsError,
    type: TYPE_BULK,
    callback: handleClose,
  });

  // effects
  useEffect(() => {
    getDeletedBackups({ ncm_device_id: ncmDeviceId });
  }, []);

  // getting dropdowns data from the store
  const dataSource = useSelector(selectDeletedConfigurationBackups);

  // handlers
  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  function handleAdd() {
    restoreBackups(selectedRowKeys);
  }

  return (
    <DefaultDialog title={`${"Restore"} ${PAGE_NAME}`} open={open}>
      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <Spin
            spinning={isGetDeletedBackupsLoading || isRestoreBackupsLoading}
          >
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

            <PageTableSectionWithoutScrollAndWidth
              PAGE_NAME={PAGE_NAME}
              TABLE_DATA_UNIQUE_ID={TABLE_DATA_UNIQUE_ID}
              buttonsConfigurationList={buttonsConfigurationList}
              displayColumns={displayColumns}
              dataSource={dataSource}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
            />
          </Spin>
        </Grid>
        <Grid item xs={12}>
          <CancelDialogFooter handleClose={handleClose} />
        </Grid>
      </Grid>
    </DefaultDialog>
  );
};

export default Index;
