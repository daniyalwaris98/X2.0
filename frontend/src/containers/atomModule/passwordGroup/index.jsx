import React, { useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultCard from "../../../components/cards";
import DefaultTable from "../../../components/tables";
import Modal from "./modal";
import {
  useFetchRecordsQuery,
  useAddRecordsMutation,
  useDeleteRecordsMutation,
} from "../../../store/features/atomModule/passwordGroup/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/atomModule/passwordGroup/selectors";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import {
  handleSuccessAlert,
  handleInfoAlert,
  handleCallbackAlert,
} from "../../../components/sweetAlertWrapper";
import {
  jsonToExcel,
  convertToJson,
  handleFileChange,
  generateObject,
  getTableScrollWidth,
} from "../../../utils/helpers";
import { Spin } from "antd";
import useErrorHandling from "../../../hooks/useErrorHandling";
import PageHeader from "../../../components/pageHeader";
import useColumnsGenerator from "../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import DefaultTableConfigurations from "../../../components/tableConfigurations";
import useButtonsConfiguration from "../../../hooks/useButtonsConfiguration";

const Index = () => {
  // theme
  const theme = useTheme();

  // states required in hooks
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // hooks
  const { height, width } = useWindowDimensions();
  const { columnDefinitions, dataKeys } = useIndexTableColumnDefinitions({
    handleEdit,
  });
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { pageHeaderButtonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    template_export: { handleClick: handleExport },
    default_delete: { handleClick: handleDelete, selectedRowKeys },
    default_add: { handleClick: handleAdd, namePostfix: "Password Group" },
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
    type: "fetch",
  });

  useErrorHandling({
    data: addRecordsData,
    isSuccess: isAddRecordsSuccess,
    isError: isAddRecordsError,
    error: addRecordsError,
    type: "bulk",
  });

  useErrorHandling({
    data: deleteRecordsData,
    isSuccess: isDeleteRecordsSuccess,
    isError: isDeleteRecordsError,
    error: deleteRecordsError,
    type: "bulk",
  });

  // handlers
  function handlePostSeed(data) {
    addRecords(data);
  }

  function deleteData() {
    deleteRecords(selectedRowKeys);
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

  function handleInputClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleAdd(optionType) {
    setOpen(true);
  }

  function handleClose() {
    setRecordToEdit(null);
    setOpen(false);
  }

  function handleChange(pagination, filters, sorter, extra) {
    console.log("Various parameters", pagination, filters, sorter, extra);
  }

  function handleExport(optionType) {
    if (optionType === "All Data") {
      jsonToExcel(dataSource, "all_password_groups");
    } else if (optionType === "Template") {
      jsonToExcel([generateObject(dataKeys)], "password_group_template");
    }
    handleSuccessAlert("File exported successfully.");
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  // row selection
  function onSelectChange(selectedRowKeys) {
    setSelectedRowKeys(selectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Spin
      spinning={
        isFetchRecordsLoading || isAddRecordsLoading || isDeleteRecordsLoading
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

        <DefaultCard sx={{ width: `${width - 105}px` }}>
          <PageHeader
            pageName="Password Group"
            buttons={pageHeaderButtonsConfigurationList}
            selectedRowKeys={selectedRowKeys}
          />
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? "even" : "odd")}
            size="small"
            scroll={{ x: getTableScrollWidth(displayColumns) }}
            onChange={handleChange}
            rowSelection={rowSelection}
            columns={displayColumns}
            dataSource={dataSource}
            rowKey="password_group_id"
            style={{ whiteSpace: "pre" }}
            pagination={{
              defaultPageSize: 9,
              pageSizeOptions: [9, 50, 100, 500, 1000],
            }}
          />
        </DefaultCard>
      </div>
    </Spin>
  );
};

export default Index;
