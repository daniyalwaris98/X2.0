import { SearchOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";
const data = [
  {
    key: "1",
    name: "	192.168.30.170",
    age: "FG-NETS.international",
    address: "icon",
  },
  {
    key: "2",
    name: "	192.168.30.170",
    age: "FG-NETS.international",
    address: "icon",
  },
  {
    key: "3",
    name: "	192.168.30.170",
    age: "FG-NETS.international",
    address: "icon",
  },
  {
    key: "4",
    name: "	192.168.30.170",
    age: "FG-NETS.international",
    address: "icon",
  },
  {
    key: "2",
    name: "	192.168.30.170",
    age: "FG-NETS.international",
    address: "icon",
  },
  {
    key: "3",
    name: "	192.168.30.170",
    age: "FG-NETS.international",
    address: "icon",
  },
  {
    key: "4",
    name: "	192.168.30.170",
    age: "FG-NETS.international",
    address: "icon",
  },
];
const Tables = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 915,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 915,
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
      title: "IP_address",
      dataIndex: "name",
      key: "name",
      width: "15%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Device",
      dataIndex: "age",
      key: "age",
      width: "15%",
      ...getColumnSearchProps("age"),
    },
    {
      title: "Make & Model",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
      //   sorter: (a, b) => a.address.length - b.address.length,
      //   sortDirections: ["descend", "ascend"],
    },
    {
      title: "SNMP",
      dataIndex: "name",
      key: "name",
      width: "15%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Login",
      dataIndex: "age",
      key: "age",
      width: "15%",
      ...getColumnSearchProps("age"),
    },
    {
      title: "WMI",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
      //   sorter: (a, b) => a.address.length - b.address.length,
      //   sortDirections: ["descend", "ascend"],
    },
    {
      title: "API",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
      //   sorter: (a, b) => a.address.length - b.address.length,
      //   sortDirections: ["descend", "ascend"],
    },
  ];
  return <Table columns={columns} dataSource={data} />;
};
export default Tables;
