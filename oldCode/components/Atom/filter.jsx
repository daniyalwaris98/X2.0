import React, { useState } from "react";
import { Table, Input } from "antd";

const MyTable = () => {
  const [data, setData] = useState([
    { key: "1", name: "John", age: 25 },
    { key: "2", name: "Jane", age: 30 },
    { key: "3", name: "Bob", age: 22 },
    // Add more data...
  ]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <button onClick={() => clearFilters()}>Reset</button>
          <button onClick={() => confirm()}>Filter</button>
        </div>
      ),
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    { title: "Age", dataIndex: "age", key: "age" },
    // Add more columns...
  ];

  return <Table dataSource={data} columns={columns} />;
};

export default MyTable;
