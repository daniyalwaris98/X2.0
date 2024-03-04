import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/autoDiscoveryModule/discovery/selectors";
import { selectFunctionRunningStatus } from "../../../store/features/commons/selectors";
import {
  useGetAllAutoDiscoveryDiscoveredDevicesLazyQuery,
  useFetchRecordsMutation,
  useGetAutoDiscoveryDiscoveryFunctionCountsBySubnetMutation,
} from "../../../store/features/autoDiscoveryModule/discovery/apis";
import { useGetFunctionRunningStatusMutation } from "../../../store/features/commons/apis";
import { jsonToExcel } from "../../../utils/helpers";
import { SUCCESSFUL_FILE_EXPORT_MESSAGE } from "../../../utils/constants";
import { useAuthorization } from "../../../hooks/useAuth";
import useErrorHandling, {
  TYPE_FETCH,
  TYPE_SINGLE,
} from "../../../hooks/useErrorHandling";
import useSweetAlert from "../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../hooks/useColumnsGenerator";
import useButtonsConfiguration from "../../../hooks/useButtonsConfiguration";
import DefaultPageTableSection from "../../../components/pageSections";
import DefaultTableConfigurations from "../../../components/tableConfigurations";
import DefaultSpinner from "../../../components/spinners";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import FunctionCounts from "./functionCounts";
import StartScanningBar from "./startScanningBar";
import {
  PAGE_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
  ALL,
  indexColumnNameConstants,
  PAGE_PATH,
} from "./constants";
import { MODULE_PATH } from "..";

const Index = () => {
  // hooks
  const { getUserInfoFromAccessToken, isPageEditable } = useAuthorization();

  // user information
  const userInfo = getUserInfoFromAccessToken();
  const roleConfigurations = userInfo?.configuration;

  // states
  const [pageEditable, setPageEditable] = useState(
    isPageEditable(roleConfigurations, MODULE_PATH, PAGE_PATH)
  );

  // hooks
  const { handleSuccessAlert, handleInfoAlert } = useSweetAlert();
  const { columnDefinitions } = useIndexTableColumnDefinitions({});
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_export: { handleClick: handleDefaultExport },
  });

  // refs
  const functionRunningStatusRef = useRef(null);

  // states
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState(generatedColumns);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState(generatedColumns);

  // selectors
  const dataSource = useSelector(selectTableData);
  const functionRunningStatus = useSelector(selectFunctionRunningStatus);

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
  ] = useGetAllAutoDiscoveryDiscoveredDevicesLazyQuery();

  const [
    fetchRecordsMutation,
    {
      data: fetchRecordsMutationData,
      isSuccess: isFetchRecordsMutationSuccess,
      isLoading: isFetchRecordsMutationLoading,
      isError: isFetchRecordsMutationError,
      error: fetchRecordsMutationError,
    },
  ] = useFetchRecordsMutation();

  const [
    fetchFunctionCounts,
    {
      data: fetchFunctionCountsData,
      isSuccess: isFetchFunctionCountsSuccess,
      isLoading: isFetchFunctionCountsLoading,
      isError: isFetchFunctionCountsError,
      error: fetchFunctionCountsError,
    },
  ] = useGetAutoDiscoveryDiscoveryFunctionCountsBySubnetMutation();

  const [
    getFunctionRunningStatusMutation,
    {
      data: getFunctionRunningStatusMutationData,
      isSuccess: isGetFunctionRunningStatusMutationSuccess,
      isLoading: isGetFunctionRunningStatusMutationLoading,
      isError: isGetFunctionRunningStatusMutationError,
      error: getFunctionRunningStatusMutationError,
    },
  ] = useGetFunctionRunningStatusMutation();

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: fetchFunctionCountsData,
    isSuccess: isFetchFunctionCountsSuccess,
    isError: isFetchFunctionCountsError,
    error: fetchFunctionCountsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: fetchRecordsMutationData,
    isSuccess: isFetchRecordsMutationSuccess,
    isError: isFetchRecordsMutationError,
    error: fetchRecordsMutationError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: getFunctionRunningStatusMutationData,
    isSuccess: isGetFunctionRunningStatusMutationSuccess,
    isError: isGetFunctionRunningStatusMutationError,
    error: getFunctionRunningStatusMutationError,
    type: TYPE_SINGLE,
    showMessage: false,
  });

  // effects
  useEffect(() => {
    fetchRecords();
    fetchFunctionCounts({ subnet: ALL });
  }, []);

  useEffect(() => {
    getFunctionRunningStatusMutation({ function_name: "auto_discover" });

    if (functionRunningStatus?.running && !functionRunningStatusRef.current) {
      functionRunningStatusRef.current = setInterval(
        () =>
          getFunctionRunningStatusMutation({
            function_name: "auto_discover",
          }),
        5000
      );
    }

    return () => {
      if (functionRunningStatusRef.current)
        clearInterval(functionRunningStatusRef.current);
    };
  }, []);

  useEffect(() => {
    if (functionRunningStatus?.running && !functionRunningStatusRef.current) {
      functionRunningStatusRef.current = setInterval(
        () =>
          getFunctionRunningStatusMutation({
            function_name: "auto_discover",
          }),
        5000
      );
    }

    if (functionRunningStatusRef.current && !functionRunningStatus?.running)
      clearInterval(functionRunningStatusRef.current);
  }, [getFunctionRunningStatusMutationData]);

  // handlers
  function handleDefaultExport() {
    if (dataSource?.length > 0) {
      jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
      handleSuccessAlert(SUCCESSFUL_FILE_EXPORT_MESSAGE);
    } else {
      handleInfoAlert("No data to export.");
    }
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  function handleSubnetChange(data) {
    if (data[indexColumnNameConstants.SUBNET] === ALL) {
      fetchRecords();
      fetchFunctionCounts({ subnet: ALL });
    } else {
      fetchRecordsMutation(data);
      fetchFunctionCounts(data);
    }
    handleInfoAlert("Discovery process has been started successfully.");
    getFunctionRunningStatusMutation({ function_name: "auto_discover" });
  }

  return (
    <DefaultSpinner
      spinning={
        isFetchRecordsLoading ||
        isFetchRecordsMutationLoading ||
        isFetchFunctionCountsLoading
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

      <FunctionCounts />

      {pageEditable ? (
        <StartScanningBar
          handleChange={handleSubnetChange}
          scanning={functionRunningStatus?.running}
        />
      ) : null}

      <DefaultPageTableSection
        PAGE_NAME={PAGE_NAME}
        TABLE_DATA_UNIQUE_ID={TABLE_DATA_UNIQUE_ID}
        buttonsConfigurationList={buttonsConfigurationList}
        displayColumns={displayColumns}
        dataSource={dataSource}
      />
    </DefaultSpinner>
  );
};

export default Index;
