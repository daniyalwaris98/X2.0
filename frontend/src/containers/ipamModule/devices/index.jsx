import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Modal from "./modal";
import {
  useFetchRecordsQuery,
  useFetchIpamDevicesLazyQuery,
  useGetIpamDevicesFetchDatesQuery,
  useGetIpamDevicesByFetchDateMutation,
} from "../../../store/features/ipamModule/devices/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/ipamModule/devices/selectors";
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
  ELEMENT_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
} from "./constants";
import { TYPE_FETCH, TYPE_BULK } from "../../../hooks/useErrorHandling";
import { PageTableSectionWithCustomPageHeader } from "../../../components/pageSections";
import CustomPageHeader from "./customPageHeader";

const Index = () => {
  // theme
  const theme = useTheme();

  // hooks
  const { handleSuccessAlert } = useSweetAlert();
  const { columnDefinitions } = useIndexTableColumnDefinitions({});
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_export: { handleClick: handleDefaultExport },
    default_fetch: { handleClick: handleFetch },
    default_add: { handleClick: handleAdd, namePostfix: ELEMENT_NAME },
  });

  // states
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
    fetchIpamDevices,
    {
      data: fetchIpamDevicesData,
      isSuccess: isFetchIpamDevicesSuccess,
      isLoading: isFetchIpamDevicesLoading,
      isError: isFetchIpamDevicesError,
      error: fetchIpamDevicesError,
    },
  ] = useFetchIpamDevicesLazyQuery();

  // apis
  const {
    data: getIpamDevicesFetchDatesData,
    isSuccess: isGetIpamDevicesFetchDatesSuccess,
    isLoading: isGetIpamDevicesFetchDatesLoading,
    isError: isGetIpamDevicesFetchDatesError,
    error: getIpamDevicesFetchDatesError,
  } = useGetIpamDevicesFetchDatesQuery();

  const [
    getIpamDevicesByFetchDate,
    {
      data: getIpamDevicesByFetchDateData,
      isSuccess: isGetIpamDevicesByFetchDateSuccess,
      isLoading: isGetIpamDevicesByFetchDateLoading,
      isError: isGetIpamDevicesByFetchDateError,
      error: getIpamDevicesByFetchDateError,
    },
  ] = useGetIpamDevicesByFetchDateMutation();

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: fetchIpamDevicesData,
    isSuccess: isFetchIpamDevicesSuccess,
    isError: isFetchIpamDevicesError,
    error: fetchIpamDevicesError,
    type: TYPE_BULK,
  });

  useErrorHandling({
    data: getIpamDevicesFetchDatesData,
    isSuccess: isGetIpamDevicesFetchDatesSuccess,
    isError: isGetIpamDevicesFetchDatesError,
    error: getIpamDevicesFetchDatesError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: getIpamDevicesByFetchDateData,
    isSuccess: isGetIpamDevicesByFetchDateSuccess,
    isError: isGetIpamDevicesByFetchDateError,
    error: getIpamDevicesByFetchDateError,
    type: TYPE_BULK,
  });

  // handlers
  function handleFetch() {
    fetchIpamDevices();
  }

  function handleAdd() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert("File exported successfully.");
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  function handleDateChange(date) {
    getIpamDevicesByFetchDate({ date });
  }

  return (
    <Spin
      spinning={
        isFetchRecordsLoading ||
        isFetchIpamDevicesLoading ||
        isGetIpamDevicesFetchDatesLoading ||
        isGetIpamDevicesByFetchDateLoading
      }
    >
      {open ? <Modal handleClose={handleClose} open={open} /> : null}

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

      <PageTableSectionWithCustomPageHeader
        customPageHeader={
          <CustomPageHeader
            pageName={PAGE_NAME}
            buttonsConfigurationList={buttonsConfigurationList}
            handleDateChange={handleDateChange}
          />
        }
        TABLE_DATA_UNIQUE_ID={TABLE_DATA_UNIQUE_ID}
        displayColumns={displayColumns}
        dataSource={dataSource}
      />
    </Spin>
  );
};

export default Index;
