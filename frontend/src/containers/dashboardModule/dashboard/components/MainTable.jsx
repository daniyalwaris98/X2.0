import React from 'react';
import { Table, Progress } from 'antd';
import { useSelector } from "react-redux";

const MainTable = ({ tableData, tableColumns }) => {
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'dark-row' : 'light-row';
  };

  return (
    <Table
      dataSource={tableData}
      columns={tableColumns}
      pagination={false}
      bordered={false}
      rowClassName={getRowClassName}
      style={{ border: 'none', height: "400px" ,overflow:"auto"}}
      // Fix table header at the top
      headerStyle={{ background: 'black', color: 'white', position: 'sticky', top: 0, zIndex: 1 }}
    />
  );
};

export default MainTable;
