import React, { useState, useRef } from "react";
import Highlighter from "react-highlight-words";
import { useTheme } from "@mui/material/styles";
import DefaultButton from "../../../components/buttons";
import DefaultCard from "../../../components/cards";
import { Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import DefaultTable from "../../../components/tables";
import { TableStyle } from "../../../styles/main.styled";
import { Button, Input, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import DefaultModal from "../../../components/modals";

import Modal from "./modal";

const data = [
  {
    key: "1",
    status: "online",
    ip_address: "192.168.1.1",
    device_name: "Edge_Ro-1s",
    device_type: "cisco_ios",
    onboard_status: "true",
    board: "false",
  },
  {
    key: "2",
    status: "offline",
    ip_address: "192.168.1.1",
    device_name: "Edge_Ro-1",
    device_type: "cisco_ios",
    onboard_status: "true",
    board: "true",
  },
  {
    key: "3",
    status: "online",
    ip_address: "192.168.1.1",
    device_name: "Edge_Ro-1e",
    device_type: "cisco_ios",
    onboard_status: "true",
    board: "false",
  },
  {
    key: "4",
    status: "offline",
    ip_address: "192.168.1.1",
    device_name: "Edge_Ro-1",
    device_type: "cisco_ios",
    onboard_status: "true",
    board: "true",
  },
  {
    key: "5",
    status: "online",
    ip_address: "192.168.1.1",
    device_name: "Edge_Ro-1",
    device_type: "cisco_ios",
    onboard_status: "true",
    board: "true",
  },
  {
    key: "6",
    status: "offline",
    ip_address: "192.168.1.1",
    device_name: "Edge_Ro-1",
    device_type: "cisco_ios",
    onboard_status: "true",
    board: "true",
  },
  {
    key: "7",
    status: "online",
    ip_address: "192.168.1.1",
    device_name: "Edge_Ro-1s",
    device_type: "cisco_ios",
    onboard_status: "true",
    board: "false",
  },
  {
    key: "8",
    status: "offline",
    ip_address: "192.168.1.1",
    device_name: "Edge_Ro-1",
    device_type: "cisco_ios",
    onboard_status: "true",
    board: "true",
  },
  {
    key: "9",
    status: "online",
    ip_address: "192.168.1.1",
    device_name: "Edge_Ro-1e",
    device_type: "cisco_ios",
    onboard_status: "true",
    board: "false",
  },
  {
    key: "10",
    status: "offline",
    ip_address: "192.168.1.1",
    device_name: "Edge_Ro-1",
    device_type: "cisco_ios",
    onboard_status: "true",
    board: "true",
  },
  {
    key: "11",
    status: "online",
    ip_address: "192.168.1.1",
    device_name: "Edge_Ro-1",
    device_type: "cisco_ios",
    onboard_status: "true",
    board: "true",
  },
  {
    key: "12",
    status: "offline",
    ip_address: "192.168.1.1",
    device_name: "Edge_Ro-1",
    device_type: "cisco_ios",
    onboard_status: "true",
    board: "true",
  },
];

const Index = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [dataSource, setDataSource] = useState(data);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState();

  const customStyle = {
    backgroundColor: theme.palette.background.default,
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
            borderColor: "#3D9E47",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 30,
              backgroundColor: "#3D9E47",
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
              borderColor: "#3D9E47",
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
    },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      ...getColumnSearchProps("ip_address"),
    },
    {
      title: "Device Name",
      dataIndex: "device_name",
      key: "device_name",
      ...getColumnSearchProps("device_name"),
    },
    {
      title: "Device Type",
      dataIndex: "device_type",
      key: "device_type",
      ...getColumnSearchProps("device_type"),
    },
    {
      title: "Onboard Status",
      dataIndex: "onboard_status",
      key: "onboard_status",
    },
    {
      title: "Board",
      dataIndex: "board",
      key: "board",
    },
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
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {console.log(record, "record")}
          <Icon
            onClick={() => handleDelete(record)}
            icon="material-symbols:delete-outline"
          />
          <Icon icon="tdesign:dart-board" />
          <Icon onClick={() => handleEdit(record)} icon="bx:edit" />
        </div>
      ),
    },
  ];

  const handleDelete = (record) => {
    const updatedDataSource = dataSource.filter(
      (item) => item.key !== record.key
    );
    setDataSource(updatedDataSource);
  };

  const handleEdit = (record) => {
    // Set the record to be edited in state or pass it to the modal
    setRecordToEdit(record);
    // Open the edit modal
    setEditModalVisible(true);
  };

  return (
    <div>
      <DefaultModal style={{ width: "500px" }} open={editModalVisible}>
        <h1>hello</h1>
      </DefaultModal>
      <Modal handleClose={handleClose} open={open} />
      <DefaultCard
        sx={{
          backgroundColor: theme.palette.color.main,
          margin: "0 auto",
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
              marginBottom: "17px",
            }}
          >
            <DefaultButton
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "7px 25px",
                border: `1px solid ${theme.palette.color.checkboxBorder}`,
              }}
              handleClick={handleClickOpen}
            >
              <Icon
                color={theme.palette.textColor.tableText}
                fontSize="16px"
                icon="ic:baseline-plus"
              />
              <Typography
                sx={{
                  fontSize: "16px",
                  textTransform: "capitalize",
                  color: theme.palette.textColor.tableText,
                }}
              >
                Export
              </Typography>
            </DefaultButton>
            <DefaultButton
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                // width: "150px",
                padding: "7px 25px",

                backgroundColor: theme.palette.color.primary,
                color: theme.palette.color.main,
                "&:hover": {
                  backgroundColor: theme.palette.color.primary,
                },
              }}
              handleClick={() => {
                console.log("clicked");
              }}
            >
              <Icon fontSize="16px" icon="pajamas:import" />
              <Typography
                sx={{ fontSize: "16px", textTransform: "capitalize" }}
              >
                Import
              </Typography>
            </DefaultButton>
          </Typography>
        </Typography>

        <TableStyle
          // rowStyle={(data, index) => (index % 2 !== 0 ? customStyle : "")}
          // rowClassName={(data, index) =>
          //   index % 2 !== 0 ? "rowClassName" : ""
          // }
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", `${dataSource.length}`],
          }}
          scroll={{
            x: 1300,
          }}
        />
      </DefaultCard>
    </div>
  );
};

export default Index;
