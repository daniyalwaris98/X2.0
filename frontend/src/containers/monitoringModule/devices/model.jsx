import React, { useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultDialog from "../../../components/dialogs";
import { CancelDialogFooter } from "../../../components/dialogFooters";
import Grid from "@mui/material/Grid";
import {
  useGetAtomsToAddInMonitoringDevicesQuery,
  useAddAtomsInMonitoringDevicesMutation,
} from "../../../store/features/monitoringModule/devices/apis";
import { useSelector } from "react-redux";
import { selectAtomsToAddInMonitoringDevicesData } from "../../../store/features/monitoringModule/devices/selectors";
import { Spin } from "antd";
import useErrorHandling from "../../../hooks/useErrorHandling";
import useColumnsGenerator from "../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "../../atomModule/atoms/columnDefinitions";
import DefaultTableConfigurations from "../../../components/tableConfigurations";
import useButtonsConfiguration from "../../../hooks/useButtonsConfiguration";
import { ATOM_ID as TABLE_DATA_UNIQUE_ID } from "../../atomModule/atoms/constants";
import { TYPE_FETCH, TYPE_BULK } from "../../../hooks/useErrorHandling";
import { PageTableSectionWithoutWidth } from "../../../components/pageSections";
import { PAGE_NAME } from "../../atomModule/atoms/constants";

const Index = ({ handleClose, open }) => {
  const theme = useTheme();

  // states required in hooks
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // hooks
  const { columnDefinitionsForMonitoringDevices: columnDefinitions } =
    useIndexTableColumnDefinitions({});
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_add: {
      handleClick: handleAdd,
      namePostfix: PAGE_NAME,
      visible: selectedRowKeys.length > 0,
    },
  });

  // states
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState(generatedColumns);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState(generatedColumns);

  // apis
  const {
    data: getAtomsToAddInMonitoringDevicesData,
    isSuccess: isGetAtomsToAddInMonitoringDevicesSuccess,
    isLoading: isGetAtomsToAddInMonitoringDevicesLoading,
    isError: isGetAtomsToAddInMonitoringDevicesError,
    error: getAtomsToAddInMonitoringDevicesError,
  } = useGetAtomsToAddInMonitoringDevicesQuery();

  const [
    addAtomsInMonitoring,
    {
      data: addAtomsInMonitoringDevicesData,
      isSuccess: isAddAtomsInMonitoringDevicesSuccess,
      isLoading: isAddAtomsInMonitoringDevicesLoading,
      isError: isAddAtomsInMonitoringDevicesError,
      error: addAtomsInMonitoringDevicesError,
    },
  ] = useAddAtomsInMonitoringDevicesMutation();

  // error handling custom hooks
  useErrorHandling({
    data: getAtomsToAddInMonitoringDevicesData,
    isSuccess: isGetAtomsToAddInMonitoringDevicesSuccess,
    isError: isGetAtomsToAddInMonitoringDevicesError,
    error: getAtomsToAddInMonitoringDevicesError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: addAtomsInMonitoringDevicesData,
    isSuccess: isAddAtomsInMonitoringDevicesSuccess,
    isError: isAddAtomsInMonitoringDevicesError,
    error: addAtomsInMonitoringDevicesError,
    type: TYPE_BULK,
    callback: handleClose,
  });

  // getting dropdowns data from the store
  const dataSource = useSelector(selectAtomsToAddInMonitoringDevicesData);

  // handlers
  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  function handleAdd() {
    addAtomsInMonitoring(selectedRowKeys);
  }

  return (
    <DefaultDialog
      sx={{ content: { padding: 0 } }}
      title={`${"Add"} ${PAGE_NAME}`}
      open={open}
    >
      <Grid container>
        <Grid item xs={12}>
          <Spin
            spinning={
              isGetAtomsToAddInMonitoringDevicesLoading ||
              isAddAtomsInMonitoringDevicesLoading
            }
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

            <PageTableSectionWithoutWidth
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
