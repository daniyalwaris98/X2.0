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
import DefaultPageTableSection from "../../../components/pageSections";
import { PAGE_NAME } from "../../atomModule/atoms/constants";
import { ATOM_ID } from "../../atomModule/atoms/constants";
import { useFetchMonitoringCredentialsNamesQuery } from "../../../store/features/dropDowns/apis";
import { selectMonitoringCredentialsNames } from "../../../store/features/dropDowns/selectors";
import { MONITORING_CREDENTIALS_ID, CREDENTIALS } from "./constants";

const Index = ({ handleClose, open }) => {
  const theme = useTheme();

  // dropdown apis
  const {
    error: monitoringCredentialsNamesError,
    isLoading: isMonitoringCredentialsNamesLoading,
  } = useFetchMonitoringCredentialsNamesQuery();

  // selectors
  const monitoringCredentialsNames = useSelector(
    selectMonitoringCredentialsNames
  );

  const monitoringCredentialsOptions = monitoringCredentialsNames.map(
    (item) => ({
      name: item[CREDENTIALS],
      value: item[MONITORING_CREDENTIALS_ID],
    })
  );

  console.log("monitoringCredentialsNames", monitoringCredentialsNames);
  // states required in hooks
  const [selectedRows, setSelectedRows] = useState([]);
  const [dropdownValues, setDropdownValues] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // hooks
  const { columnDefinitionsForMonitoringDevices: columnDefinitions } =
    useIndexTableColumnDefinitions({
      dropDowns: {
        handler: handleSelectsChange,
        data: {
          [MONITORING_CREDENTIALS_ID]: monitoringCredentialsOptions,
        },
      },
    });
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

  // row selection

  function customOnSelectChange(selectedRowKeys, selectedRows) {
    setSelectedRowKeys(selectedRowKeys);
    const defaultMonitoringCredentialId =
      monitoringCredentialsNames.length > 0
        ? monitoringCredentialsNames[0][MONITORING_CREDENTIALS_ID]
        : "";
    setSelectedRows(
      selectedRows.map((row) => ({
        ...row,
        [MONITORING_CREDENTIALS_ID]:
          dropdownValues[MONITORING_CREDENTIALS_ID][row.id] ||
          defaultMonitoringCredentialId,
      }))
    );
  }

  // handlers
  function handleSelectsChange(selectName, recordId, value) {
    setDropdownValues((prevValues) => {
      return {
        ...prevValues,
        [selectName]: {
          ...(prevValues[selectName] || {}),
          [recordId]: value,
        },
      };
    });
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  function handleAdd() {
    addAtomsInMonitoring(
      selectedRows.map((item) => ({
        [ATOM_ID]: item[ATOM_ID],
        [MONITORING_CREDENTIALS_ID]: item[MONITORING_CREDENTIALS_ID],
      }))
    );
  }

  return (
    <DefaultDialog title={`${"Add"} ${PAGE_NAME}`} open={open}>
      <Grid container style={{ marginTop: "15px" }}>
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

            <DefaultPageTableSection
              PAGE_NAME={PAGE_NAME}
              TABLE_DATA_UNIQUE_ID={TABLE_DATA_UNIQUE_ID}
              buttonsConfigurationList={buttonsConfigurationList}
              displayColumns={displayColumns}
              dataSource={dataSource}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              dynamicWidth={false}
              defaultPageSize={7}
              customOnSelectChange={customOnSelectChange}
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
