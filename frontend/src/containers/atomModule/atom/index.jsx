import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultButton from "../../../components/buttons";
import DefaultCard from "../../../components/cards";
import { Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { TableStyle } from "../../../styles/main.styled";
import { getTitle } from "../../../utils/helpers";
import Modal from "./modal";
import {
  useFetchTableDataQuery,
  useAddTableMultipleDataMutation,
  useDeleteTableMultipleDataMutation,
} from "../../../store/features/atomModule/atom/apis";
import { useDispatch, useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/atomModule/atom/selectors";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import {
  handleSuccessAlert,
  handleInfoAlert,
  handleCallbackAlert,
  handleErrorAlert,
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
  const { data, error, isLoading } = useFetchTableDataQuery();

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
    data: addedTableMultipleData,
    isSuccess: isAddTableMultipleDataSuccess,
    isError: isAddTableMultipleDataError,
    error: addTableMultipleDataError,
    type: "bulkAdd",
  });

  useErrorHandling({
    data: deletedTableMultipleData,
    isSuccess: isDeleteTableSingleDataSuccess,
    isError: isDeleteTableMultipleDataError,
    error: deleteTableSingleDataError,
    type: "bulkDelete",
  });

  // handlers
  const handlePostSeed = (data) => {
    addTableMultipleData(data);
  };

  const deleteData = () => {
    const deleteData = selectedRowKeys.map((rowKey) => {
      const dataObject = dataSource.find((row) => row.atom_table_id === rowKey);

      if (dataObject) {
        const { atom_id, atom_transition_id } = dataObject;

        return {
          atom_id: atom_id || null,
          atom_transition_id: atom_transition_id || null,
        };
      }

      return null;
    });

    const filteredDeleteData = deleteData.filter((data) => data !== null);

    if (filteredDeleteData.length > 0) {
      deleteTableMultipleData(filteredDeleteData);
    }
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setRecordToEdit(null);
    setOpen(false);
  };

  const handleChange = (pagination, filters, sorter, extra) => {
    console.log("Various parameters", pagination, filters, sorter, extra);
  };

  const handleExport = () => {
    jsonToExcel(dataSource, "atom");
    handleSuccessAlert("File exported successfully.");
  };

  const handleExportTemplate = () => {
    jsonToExcel([generateObject(dataKeys)], "atom_template");
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

  columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "80px",

      render: (text, record) => {
        const icon = record.atom_id ? (
          <Icon
            fontSize={"22px"}
            color={theme.palette.color.primary}
            icon="ep:success-filled"
          />
        ) : (
          <Icon
            fontSize={"23px"}
            color={theme.palette.color.info}
            icon="material-symbols:info"
          />
        );

        return <div style={{ textAlign: "center" }}>{icon}</div>;
      },
    },
    ...columns,
  ];

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
        isLoading ||
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
            pageName="Atom"
            handleDelete={handleDelete}
            handleExportTemplate={handleExportTemplate}
            handleExport={handleExport}
            handleClickOpen={handleClickOpen}
            handleInputClick={handleInputClick}
          />

          <TableStyle
            size="small"
            scroll={{ x: 3000 }}
            onChange={handleChange}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            rowKey="atom_table_id"
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
