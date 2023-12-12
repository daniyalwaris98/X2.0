import React, { useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import {
  useFetchRecordsQuery,
  useAddRecordsMutation,
  useDeleteRecordsMutation,
} from "../../../store/features/atomModule/passwordGroup/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/atomModule/passwordGroup/selectors";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import {
  jsonToExcel,
  convertToJson,
  handleFileChange,
  generateObject,
} from "../../../utils/helpers";
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
  FILE_NAME_EXPORT_TEMPLATE,
  TABLE_DATA_UNIQUE_ID,
} from "./constants";
import { TYPE_FETCH, TYPE_BULK } from "../../../hooks/useErrorHandling";
import DefaultPageTableSection from "../../../components/pageSections";

const Index = () => {
  // theme
  const theme = useTheme();

  // states required in hooks
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // hooks
  const { handleSuccessAlert, handleInfoAlert, handleCallbackAlert } =
    useSweetAlert();
  const { v1V2ColumnDefinitions, v3ColumnDefinitions } =
    useIndexTableColumnDefinitions({});
  const v1V2GeneratedColumns = useColumnsGenerator({ v1V2ColumnDefinitions });
  const v3GeneratedColumns = useColumnsGenerator({ v3ColumnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_export: { handleClick: handleDefaultExport },
    default_delete: {
      handleClick: handleDelete,
      visible: selectedRowKeys.length > 0,
    },
    default_add: { handleClick: handleAdd, namePostfix: ELEMENT_NAME },
  });

  // refs
  const fileInputRef = useRef(null);

  // states
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [v1V2Columns, setV1V2Columns] = useState(v1V2GeneratedColumns);
  const [v1V2AvailableColumns, setV1V2AvailableColumns] = useState([]);
  const [v1V2DisplayColumns, setV1V2DisplayColumns] =
    useState(v1V2GeneratedColumns);

  const [v3Columns, setV3Columns] = useState(v3GeneratedColumns);
  const [v3AvailableColumns, setV3AvailableColumns] = useState([]);
  const [v3DisplayColumns, setV3DisplayColumns] = useState(v3GeneratedColumns);

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

  function handleAdd(optionType) {
    setOpen(true);
  }

  function handleClose() {
    setRecordToEdit(null);
    setOpen(false);
  }

  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert("File exported successfully.");
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <Spin
      spinning={
        isFetchRecordsLoading || isAddRecordsLoading || isDeleteRecordsLoading
      }
    >
      {tableConfigurationsOpen ? (
        <DefaultTableConfigurations
          columns={v1V2Columns}
          availableColumns={v1V2AvailableColumns}
          setAvailableColumns={setV1V2AvailableColumns}
          displayColumns={v1V2DisplayColumns}
          setDisplayColumns={setV1V2DisplayColumns}
          setColumns={setV1V2Columns}
          open={tableConfigurationsOpen}
          setOpen={setTableConfigurationsOpen}
        />
      ) : null}

      <DefaultPageTableSection
        PAGE_NAME={PAGE_NAME}
        TABLE_DATA_UNIQUE_ID={TABLE_DATA_UNIQUE_ID}
        buttonsConfigurationList={buttonsConfigurationList}
        selectedRowKeys={selectedRowKeys}
        displayColumns={v1V2DisplayColumns}
        dataSource={dataSource}
        setSelectedRowKeys={setSelectedRowKeys}
      />
      <br />
      <DefaultPageTableSection
        PAGE_NAME={PAGE_NAME}
        TABLE_DATA_UNIQUE_ID={TABLE_DATA_UNIQUE_ID}
        buttonsConfigurationList={buttonsConfigurationList}
        selectedRowKeys={selectedRowKeys}
        displayColumns={v3DisplayColumns}
        dataSource={dataSource}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </Spin>
  );
};

export default Index;
