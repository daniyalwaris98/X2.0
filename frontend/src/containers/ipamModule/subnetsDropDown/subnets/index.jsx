import React, { useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import Modal from "./modal";
import {
  useFetchRecordsQuery,
  useAddRecordsMutation,
  useDeleteRecordsMutation,
  useGetIpDetailsBySubnetLazyQuery,
  useScanAllIpamSubnetsMutation,
  useScanIpamSubnetMutation,
} from "../../../../store/features/ipamModule/subnetsDropDown/subnets/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../../store/features/ipamModule/subnetsDropDown/subnets/selectors";
import {
  jsonToExcel,
  convertToJson,
  handleFileChange,
  generateObject,
} from "../../../../utils/helpers";
import { Spin } from "antd";
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
  FILE_NAME_EXPORT_TEMPLATE,
  TABLE_DATA_UNIQUE_ID,
  indexColumnNameConstants,
  PORT_SCAN,
  DNS_SCAN,
} from "./constants";
import { TYPE_FETCH, TYPE_BULK } from "../../../../hooks/useErrorHandling";
import DefaultPageTableSection from "../../../../components/pageSections";

const Index = () => {
  // theme
  const theme = useTheme();

  // states required in hooks
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // hooks
  const { handleSuccessAlert, handleInfoAlert, handleCallbackAlert } =
    useSweetAlert();
  const { buttonsConfigurationObject } = useButtonsConfiguration({
    default_scan: {
      handleClick: handleScan,
    },
  });
  const { columnDefinitions, dataKeys } = useIndexTableColumnDefinitions({
    buttonsConfigurationObject,
    handleEdit,
  });
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { dropdownButtonOptionsConstants, buttonsConfigurationList } =
    useButtonsConfiguration({
      configure_table: { handleClick: handleTableConfigurationsOpen },
      template_export: { handleClick: handleExport },
      default_scan: {
        handleClick: handleBulkScan,
      },
      default_delete: {
        handleClick: handleDelete,
        visible: selectedRowKeys.length > 0,
      },
      default_add: { handleClick: handleDefaultAdd, namePostfix: ELEMENT_NAME },
      default_import: { handleClick: handleInputClick },
    });

  // refs
  const fileInputRef = useRef(null);

  // states
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState(generatedColumns);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState(generatedColumns);

  // selectors
  const dataSource = [{}, {}, {}, {}, {}];
  // const dataSource = useSelector(selectTableData);

  // apis
  const {
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isLoading: isFetchRecordsLoading,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
  } = useFetchRecordsQuery();

  const [
    addRecords,
    {
      data: addRecordsData,
      isSuccess: isAddRecordsSuccess,
      isLoading: isAddRecordsLoading,
      isError: isAddRecordsError,
      error: addRecordsError,
    },
  ] = useAddRecordsMutation();

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
    getIpDetailsBySubnet,
    {
      data: getIpDetailsBySubnetData,
      isSuccess: isGetIpDetailsBySubnetSuccess,
      isLoading: isGetIpDetailsBySubnetLoading,
      isError: isGetIpDetailsBySubnetError,
      error: getIpDetailsBySubnetError,
    },
  ] = useGetIpDetailsBySubnetLazyQuery();

  const [
    scanAllIpamSubnets,
    {
      data: scanAllIpamSubnetsData,
      isSuccess: isScanAllIpamSubnetsSuccess,
      isLoading: isScanAllIpamSubnetsLoading,
      isError: isScanAllIpamSubnetsError,
      error: scanAllIpamSubnetsError,
    },
  ] = useScanAllIpamSubnetsMutation();

  const [
    scanIpamSubnet,
    {
      data: scanIpamSubnetData,
      isSuccess: isScanIpamSubnetSuccess,
      isLoading: isScanIpamSubnetLoading,
      isError: isScanIpamSubnetError,
      error: scanIpamSubnetError,
    },
  ] = useScanIpamSubnetMutation();

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: addRecordsData,
    isSuccess: isAddRecordsSuccess,
    isError: isAddRecordsError,
    error: addRecordsError,
    type: TYPE_BULK,
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
    data: getIpDetailsBySubnetData,
    isSuccess: isGetIpDetailsBySubnetSuccess,
    isError: isGetIpDetailsBySubnetError,
    error: getIpDetailsBySubnetError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: scanAllIpamSubnetsData,
    isSuccess: isScanAllIpamSubnetsSuccess,
    isError: isScanAllIpamSubnetsError,
    error: scanAllIpamSubnetsError,
    type: TYPE_BULK,
  });

  useErrorHandling({
    data: scanIpamSubnetData,
    isSuccess: isScanIpamSubnetSuccess,
    isError: isScanIpamSubnetError,
    error: scanIpamSubnetError,
    type: TYPE_BULK,
  });

  // effects

  // handlers
  function handleEmptySelectedRowKeys() {
    setSelectedRowKeys([]);
  }

  function handlePostSeed(data) {
    addRecords(data);
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
      handleCallbackAlert(
        "Are you sure you want delete these records?",
        deleteData
      );
    } else {
      handleInfoAlert("No record has been selected to delete!");
    }
  }

  function handleEdit(record) {
    setRecordToEdit(record);
    setOpen(true);
  }

  function handleDefaultAdd() {
    setRecordToEdit(null);
    setOpen(true);
  }

  function handleInputClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleScan(record) {
    scanIpamSubnet({
      [indexColumnNameConstants.SUBNET_ADDRESS]:
        record[indexColumnNameConstants.SUBNET_ADDRESS],
      [PORT_SCAN]: true,
      [DNS_SCAN]: true,
    });
  }

  function handleBulkScan(data) {
    scanAllIpamSubnets(data);
  }

  function handleClose() {
    setRecordToEdit(null);
    setOpen(false);
  }

  function handleExport(optionType) {
    const { ALL_DATA, TEMPLATE } =
      dropdownButtonOptionsConstants.template_export;
    if (optionType === ALL_DATA) {
      jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    } else if (optionType === TEMPLATE) {
      jsonToExcel([generateObject(dataKeys)], FILE_NAME_EXPORT_TEMPLATE);
    }
    handleSuccessAlert("File exported successfully.");
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <Spin
      spinning={
        isFetchRecordsLoading ||
        isAddRecordsLoading ||
        isDeleteRecordsLoading ||
        isGetIpDetailsBySubnetLoading ||
        isScanAllIpamSubnetsLoading ||
        isScanIpamSubnetLoading
      }
    >
      <div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e, convertToJson, handlePostSeed)}
        />

        {open ? (
          <Modal
            handleClose={handleClose}
            open={open}
            recordToEdit={recordToEdit}
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
      </div>
    </Spin>
  );
};

export default Index;
