import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  useFetchRecordsQuery,
  useDismantleRecordsMutation,
} from "../../../store/features/uamModule/devices/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/uamModule/devices/selectors";
import { jsonToExcel } from "../../../utils/helpers";
import { Spin } from "antd";
import useErrorHandling, { TYPE_BULK } from "../../../hooks/useErrorHandling";
import DefaultTableConfigurations from "../../../components/tableConfigurations";
import useSweetAlert from "../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import useButtonsConfiguration from "../../../hooks/useButtonsConfiguration";
import {
  PAGE_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
} from "./constants";
import { TYPE_FETCH } from "../../../hooks/useErrorHandling";
import DefaultPageTableSection from "../../../components/pageSections";
import DetailsByIPAdressModal from "./modal";

const Index = () => {
  // theme
  const theme = useTheme();

  // states required in hooks
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // hooks
  const { handleCallbackAlert, handleSuccessAlert, handleInfoAlert } =
    useSweetAlert();
  const { columnDefinitions } = useIndexTableColumnDefinitions({
    handleIPAddressClick,
  });
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_export: { handleClick: handleDefaultExport },
    default_dismantle: {
      handleClick: handleDismantle,
      visible: selectedRowKeys.length > 0,
    },
  });

  // states
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDetailsByIPAddressModal, setOpenDetailsByIPAddressModal] =
    useState(false);
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState(generatedColumns);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState(generatedColumns);

  // selectors
  // const dataSource = [{ ip_address: "10.20.23.71" }];
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
    dismantleRecords,
    {
      data: dismantleRecordsData,
      isSuccess: isDismantleRecordsSuccess,
      isLoading: isDismantleRecordsLoading,
      isError: isDismantleRecordsError,
      error: dismantleRecordsError,
    },
  ] = useDismantleRecordsMutation();

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: dismantleRecordsData,
    isSuccess: isDismantleRecordsSuccess,
    isError: isDismantleRecordsError,
    error: dismantleRecordsError,
    type: TYPE_BULK,
    callback: handleEmptySelectedRowKeys,
  });

  // handlers
  function handleIPAddressClick(record) {
    setSelectedRecord(record);
    setOpenDetailsByIPAddressModal(true);
  }

  function handleDetailsByIPAddressModalClose() {
    setOpenDetailsByIPAddressModal(false);
  }

  function handleEmptySelectedRowKeys() {
    setSelectedRowKeys([]);
  }

  function dismantleData(allowed) {
    if (allowed) {
      dismantleRecords(selectedRowKeys);
    } else {
      setSelectedRowKeys([]);
    }
  }

  function handleDismantle() {
    if (selectedRowKeys.length > 0) {
      handleCallbackAlert(
        "Are you sure you want dismantle these records?",
        dismantleData
      );
    } else {
      handleInfoAlert("No record has been selected to dismantle!");
    }
  }

  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert("File exported successfully.");
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <Spin spinning={isFetchRecordsLoading}>
      {openDetailsByIPAddressModal ? (
        <DetailsByIPAdressModal
          handleClose={handleDetailsByIPAddressModalClose}
          open={openDetailsByIPAddressModal}
          record={selectedRecord}
        />
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
