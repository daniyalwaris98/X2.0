import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/autoDiscoveryModule/discovery/selectors";
import {
  useGetAllAutoDiscoveryDiscoveredDevicesLazyQuery,
  useFetchRecordsMutation,
} from "../../../store/features/autoDiscoveryModule/discovery/apis";
import { jsonToExcel } from "../../../utils/helpers";
import { SUCCESSFUL_FILE_EXPORT_MESSAGE } from "../../../utils/constants";
import DefaultPageTableSection from "../../../components/pageSections";
import DefaultTableConfigurations from "../../../components/tableConfigurations";
import DefaultSpinner from "../../../components/spinners";
import useErrorHandling, { TYPE_FETCH } from "../../../hooks/useErrorHandling";
import useSweetAlert from "../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../hooks/useColumnsGenerator";
import useButtonsConfiguration from "../../../hooks/useButtonsConfiguration";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import DeviceCounts from "./deviceCounts";
import StartScanningBar from "./startScanningBar";
import {
  PAGE_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
  ALL,
  indexColumnNameConstants,
} from "./constants";

const Index = () => {
  // hooks
  const { handleSuccessAlert } = useSweetAlert();
  const { columnDefinitions } = useIndexTableColumnDefinitions({});
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_export: { handleClick: handleDefaultExport },
  });

  // states
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState(generatedColumns);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState(generatedColumns);

  // selectors
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

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: fetchRecordsMutationData,
    isSuccess: isFetchRecordsMutationSuccess,
    isError: isFetchRecordsMutationError,
    error: fetchRecordsMutationError,
    type: TYPE_FETCH,
  });

  // effects
  useEffect(() => {
    fetchRecords();
  }, []);

  // handlers
  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert(SUCCESSFUL_FILE_EXPORT_MESSAGE);
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  function handleSubnetChange(data) {
    if (data[indexColumnNameConstants.SUBNET] === ALL) {
      fetchRecords();
    } else {
      fetchRecordsMutation(data);
    }
  }

  return (
    <DefaultSpinner spinning={isFetchRecordsLoading}>
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

      <DeviceCounts />

      <StartScanningBar handleChange={handleSubnetChange} />

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
