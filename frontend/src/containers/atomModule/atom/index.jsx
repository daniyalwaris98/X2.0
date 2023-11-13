import React, { useState, useRef, useEffect } from "react";
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
  useUpdateTableSingleDataMutation,
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
  convertToJson,
  handleFileChange,
  columnGenerator,
} from "../../../utils/helpers";
import useColumnSearchProps from "../../../hooks/useColumnSearchProps";

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
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);

  // selectors
  const dataSource = useSelector(selectTableData);

  // apis
  const { data, error, isLoading } = useFetchTableDataQuery();

  const [
    addTableMultipleData,
    {
      isLoading: isAddTableMultipleDataLoading,
      isError: isAddTableMultipleDataError,
    },
  ] = useAddTableMultipleDataMutation();

  const [
    deleteTableMultipleData,
    {
      isLoading: isDeleteTableMultipleDataLoading,
      isError: isDeleteTableMultipleDataError,
    },
  ] = useDeleteTableMultipleDataMutation();

  const [
    updateTableSingleData,
    {
      data: updatedTableSingleData,
      isSuccess: isUpdateTableSingleDataSuccess,
      isLoading: isUpdateTableSingleDataLoading,
      isError: isUpdateTableSingleDataError,
      error: updateTableSingleDataError,
    },
  ] = useUpdateTableSingleDataMutation();

  // effects
  useEffect(() => {
    if (isUpdateTableSingleDataError) {
      handleErrorAlert(updateTableSingleDataError.data);
    } else if (isUpdateTableSingleDataSuccess) {
      handleSuccessAlert(updatedTableSingleData.message);
    }
  }, [isUpdateTableSingleDataSuccess, isUpdateTableSingleDataError]);

  // handlers
  const handlePostSeed = (data) => {
    addTableMultipleData(data);
  };

  const handleDelete = () => {
    if (selectedRowKeys.length > 0) {
      handleCallbackAlert(
        "warning",
        "Are you sure you want delete these records?",
        deleteData
      );
    } else {
      handleInfoAlert("No record has been selected");
    }
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

  // row selection
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // columns
  let columns = columnGenerator(
    [
      "ip_address",
      "site_name",
      "rack_name",
      "device_name",
      "device_ru",
      "department",
      "domain",
      "section",
      "function",
      "virtual",
      "device_type",
      "vendor",
      "criticality",
      "password_group",
    ],
    getColumnSearchProps,
    getTitle
  );

  columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "80px",

      // ...getColumnSearchProps("status"),
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
        {/* <Icon icon="tdesign:dart-board" /> */}
        <Icon onClick={() => handleEdit(record)} icon="bx:edit" />
      </div>
    ),
  });

  //   {
  //     title: "Board",
  //     dataIndex: "board",
  //     key: "board",
  //     render: (text, record) => {
  //       const icon =
  //         record.board === "true" ? (
  //           <div
  //             style={{
  //               color: "#3D9E47",
  //               background: "#F1F6EE",
  //               width: "80%",
  //               margin: "0 auto",
  //               padding: "3px 2px",
  //               borderRadius: "15px",
  //               textAlign: "center",
  //             }}
  //           >
  //             true
  //           </div>
  //         ) : (
  //           <div
  //             style={{
  //               color: "#E34444",
  //               background: "#FFECE9",
  //               width: "80%",
  //               margin: "0 auto",
  //               padding: "3px 2px",
  //               borderRadius: "15px",
  //               textAlign: "center",
  //             }}
  //           >
  //             false
  //           </div>
  //         );

  //       return <span>{icon}</span>;
  //     },
  //   },

  return (
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
          updateTableSingleData={updateTableSingleData}
        />
      ) : null}

      <DefaultCard
        sx={{
          backgroundColor: theme.palette.color.main,
          width: `${width - 105}px`,
        }}
      >
        <div
          style={{
            padding: "10px",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: theme.palette.textColor.tableText }}>
              ATOM
            </Typography>

            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <DefaultButton
                handleClick={handleDelete}
                sx={{ backgroundColor: theme.palette.color.danger }}
              >
                <Icon fontSize="16px" icon="ic:baseline-plus" />
                Delete
              </DefaultButton>

              <DefaultButton
                sx={{ backgroundColor: theme.palette.color.primary }}
              >
                <Icon fontSize="16px" icon="ic:baseline-plus" />
                Export
              </DefaultButton>

              <DefaultButton
                handleClick={handleClickOpen}
                sx={{ backgroundColor: theme.palette.color.primary }}
              >
                <Icon fontSize="16px" icon="ic:baseline-plus" />
                Add
              </DefaultButton>

              <DefaultButton
                handleClick={handleInputClick}
                sx={{ backgroundColor: theme.palette.color.primary }}
              >
                <Icon fontSize="16px" icon="pajamas:import" /> Import
              </DefaultButton>
            </Typography>
          </Typography>
        </div>
        <TableStyle
          size="small"
          scroll={{ x: 4000 }}
          onChange={handleChange}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          rowKey="atom_table_id"
          style={{ whiteSpace: "pre" }}
          pagination={{
            defaultPageSize: 50,
            pageSizeOptions: [50, 100, 500, 1000],
          }}
        />
      </DefaultCard>
    </div>
  );
};

export default Index;
