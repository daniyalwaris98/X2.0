import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultCard from "../../../components/cards";
import { Icon } from "@iconify/react";
import DefaultTable from "../../../components/tables";
import { getTitle } from "../../../utils/helpers";
import Modal from "./modal";
import {
  useFetchRecordsQuery,
  useAddRecordsMutation,
  useDeleteRecordsMutation,
} from "../../../store/features/atomModule/atom/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/atomModule/atom/selectors";
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
import DefaultTableConfigurations from "../../../components/tableConfigurations";

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
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState([]);
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

  // effects
  useEffect(() => {
    //columns
    let generatedColumns = columnGenerator(
      dataKeys,
      getColumnSearchProps,
      getTitle
    );
    generatedColumns = [
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "80px",

        render: (text, record) => {
          const icon = record.atom_id ? (
            <Icon
              fontSize={"22px"}
              color={theme?.palette?.icon?.complete}
              icon="ep:success-filled"
            />
          ) : (
            <Icon
              fontSize={"23px"}
              color={theme?.palette?.icon?.incomplete}
              icon="material-symbols:info"
            />
          );

          return <div style={{ textAlign: "center" }}>{icon}</div>;
        },
      },
      ...generatedColumns,
      {
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
      },
    ];
    setColumns(generatedColumns);
    setAvailableColumns([]);
    setDisplayColumns(generatedColumns);
  }, []);

  // handlers
  const handlePostSeed = (data) => {
    addRecords(data);
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
      deleteRecords(filteredDeleteData);
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

  const handleOnboard = () => {
    handleInfoAlert("Onboard Clicked!");
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

  const handleAdd = (optionType) => {
    if (optionType === "Add Manually") {
      setOpen(true);
    } else if (optionType === "From Discovery") {
    }
  };

  const handleClose = () => {
    setRecordToEdit(null);
    setOpen(false);
  };

  const handleTableConfigurationsOpen = () => {
    setTableConfigurationsOpen(true);
  };

  const handleChange = (pagination, filters, sorter, extra) => {
    console.log("Various parameters", pagination, filters, sorter, extra);
  };

  const handleExport = (optionType) => {
    if (optionType === "All Devices") {
      jsonToExcel(dataSource, "all_atoms");
    } else if (optionType === "Template") {
      jsonToExcel([generateObject(dataKeys)], "atom_template");
    } else if (optionType === "Completed") {
      jsonToExcel(
        dataSource.filter((item) => item.hasOwnProperty("atom_id")),
        "complete_atoms"
      );
    } else if (optionType === "Incomplete") {
      jsonToExcel(
        dataSource.filter((item) => item.hasOwnProperty("atom_transition_id")),
        "incomplete_atoms"
      );
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

  // page header buttons
  const buttons = [
    {
      type: "Table Configurations",
      icon: <Icon fontSize="16px" icon="fluent:board-20-regular" />,
      handleClick: handleTableConfigurationsOpen,
    },
    {
      type: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
      handleClick: handleExport,
      options: [
        {
          type: "All Devices",
          icon: <Icon fontSize="16px" icon="icon-park-outline:data-all" />,
        },
        {
          type: "Template",
          icon: (
            <Icon fontSize="16px" icon="streamline:chat-bubble-square-write" />
          ),
        },
        {
          type: "Completed",
          icon: (
            <Icon
              fontSize="16px"
              icon="ep:success-filled"
              color={theme?.palette?.icon?.complete}
            />
          ),
        },
        {
          type: "Incomplete",
          icon: (
            <Icon
              fontSize="16px"
              icon="material-symbols:info"
              color={theme?.palette?.icon?.incomplete}
            />
          ),
        },
      ],
    },
    {
      type: "Onboard",
      icon: <Icon fontSize="16px" icon="fluent:board-20-regular" />,
      handleClick: handleOnboard,
    },
    {
      type: "Delete",
      icon: <Icon fontSize="16px" icon="mingcute:delete-line" />,
      handleClick: handleDelete,
    },
    {
      type: "Add",
      icon: <Icon fontSize="16px" icon="gridicons:add-outline" />,
      handleClick: handleAdd,
      options: [
        {
          type: "Add Manually",
          icon: <Icon fontSize="16px" icon="icon-park-outline:manual-gear" />,
        },
        {
          type: "From Discovery",
          icon: (
            <Icon fontSize="16px" icon="icon-park-outline:discovery-index" />
          ),
        },
      ],
    },
    {
      type: "Import",
      icon: <Icon fontSize="16px" icon="pajamas:import" />,
      handleClick: handleInputClick,
    },
  ];

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
            open={open}
            handleClose={handleClose}
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
          <PageHeader pageName="Atom" buttons={buttons} />
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? "even" : "odd")}
            size="small"
            scroll={{ x: 3000 }}
            onChange={handleChange}
            rowSelection={rowSelection}
            columns={displayColumns}
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
