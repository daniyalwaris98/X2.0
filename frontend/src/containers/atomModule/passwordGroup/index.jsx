import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultCard from "../../../components/cards";
import { Icon } from "@iconify/react";
import { TableStyle } from "../../../styles/main.styled";
import { getTitle } from "../../../utils/helpers";
import Modal from "./modal";
import {
  useFetchTableDataQuery,
  useAddTableMultipleDataMutation,
  useDeleteTableMultipleDataMutation,
} from "../../../store/features/atomModule/passwordGroup/apis";
import { useDispatch, useSelector } from "react-redux";
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
  columnGenerator,
  generateObject,
} from "../../../utils/helpers";
import useColumnSearchProps from "../../../hooks/useColumnSearchProps";
import { Spin } from "antd";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { dataKeysArray } from "./constants";
import PageHeader from "../../../components/pageHeader";

const Index = () => {
  // theme
  const theme = useTheme();

  // hooks
  const { height, width } = useWindowDimensions();
  const getColumnSearchProps = useColumnSearchProps();

  // refs
  const fileInputRef = useRef(null);

  // states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataKeys, setDataKeys] = useState(dataKeysArray);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);

  // selectors
  const dataSource = useSelector(selectTableData);

  // apis
  const {
    data: fetchedTableData,
    isSuccess: isFetchTableDataSuccess,
    isLoading: isFetchTableDataLoading,
    isError: isFetchTableDataError,
    error: fetchTableDataError,
  } = useFetchTableDataQuery();

  const [
    addTableMultipleData,
    {
      data: addedTableMultipleData,
      isSuccess: isAddTableMultipleDataSuccess,
      isLoading: isAddTableMultipleDataLoading,
      isError: isAddTableMultipleDataError,
      error: addTableMultipleDataError,
    },
  ] = useAddTableMultipleDataMutation();

  const [
    deleteTableMultipleData,
    {
      data: deletedTableMultipleData,
      isSuccess: isDeleteTableSingleDataSuccess,
      isLoading: isDeleteTableMultipleDataLoading,
      isError: isDeleteTableMultipleDataError,
      error: deleteTableSingleDataError,
    },
  ] = useDeleteTableMultipleDataMutation();

  // error handling custom hooks
  useErrorHandling({
    data: fetchedTableData,
    isSuccess: isFetchTableDataSuccess,
    isError: isFetchTableDataError,
    error: fetchTableDataError,
    type: "fetch",
  });

  useErrorHandling({
    data: addedTableMultipleData,
    isSuccess: isAddTableMultipleDataSuccess,
    isError: isAddTableMultipleDataError,
    error: addTableMultipleDataError,
    type: "bulk",
  });

  useErrorHandling({
    data: deletedTableMultipleData,
    isSuccess: isDeleteTableSingleDataSuccess,
    isError: isDeleteTableMultipleDataError,
    error: deleteTableSingleDataError,
    type: "bulk",
  });

  // handlers
  const handlePostSeed = (data) => {
    addTableMultipleData(data);
  };

  const deleteData = () => {
    deleteTableMultipleData(selectedRowKeys);
  };

  const handleDelete = () => {
    if (selectedRowKeys.length > 0) {
      handleCallbackAlert(
        "Are you sure you want delete these records?",
        deleteData
      );
    } else {
      handleInfoAlert("No record has been selected to delete!");
    }
  };

  const handleEdit = (record) => {
    setRecordToEdit(record);
    setOpen(true);
  };

  const handleInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddAtom = (optionType) => {
    if (optionType === "Add Manually") {
      setOpen(true);
    } else if (optionType === "From Discovery") {
    }
  };

  const handleClose = () => {
    setRecordToEdit(null);
    setOpen(false);
  };

  const handleChange = (pagination, filters, sorter, extra) => {
    console.log("Various parameters", pagination, filters, sorter, extra);
  };

  const handleExport = (optionType) => {
    if (optionType === "All Devices") {
      jsonToExcel(dataSource, "all_password_groups");
    } else if (optionType === "Template") {
      jsonToExcel([generateObject(dataKeys)], "password_group_template");
    }
    handleSuccessAlert("File exported successfully.");
  };

  // row selection
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // columns
  let columns = columnGenerator(dataKeys, getColumnSearchProps, getTitle);

  columns.push({
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    fixed: "right",
    width: 100,
    render: (text, record) => (
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <Icon onClick={() => handleEdit(record)} icon="bx:edit" />
      </div>
    ),
  });

  return (
    <Spin
      spinning={
        isFetchTableDataLoading ||
        isAddTableMultipleDataLoading ||
        isDeleteTableMultipleDataLoading
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

        <DefaultCard
          sx={{
            backgroundColor: theme.palette.color.main,
            width: `${width - 105}px`,
          }}
        >
          <PageHeader
            pageName="Password Group"
            handleAddAtom={handleAddAtom}
            handleExport={handleExport}
            handleDelete={handleDelete}
            handleInputClick={handleInputClick}
          />

          <TableStyle
            size="small"
            // scroll={{ x: 500 }}
            onChange={handleChange}
            rowSelection={rowSelection}
            columns={columns}
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
