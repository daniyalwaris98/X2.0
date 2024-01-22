import React from 'react';
import { Table, Progress } from 'antd';

const columns = [
  {
    title: 'Subnet',
    dataIndex: 'col1',
    key: 'col1',
    align: 'center',
    render: text => <a style={{ display: 'block', fontWeight: '600', color: 'green' }}>{text}</a>,
  },
  {
    title: 'IP % Space Used',
    dataIndex: 'col2',
    key: 'col2',
    align: 'center',
    render: text => <span style={{ display: 'block', color: 'green' }}>{text}</span>,
  },
  {
    title: 'Progress',
    dataIndex: 'col3',
    key: 'col3',
    align: 'center',
    render: (_, record) => (
      <Progress
        percent={50}  // Replace with the actual percent value from your data
        status="active"
        strokeColor={{
          from: '#108ee9',
          to: '#87d068',
        }}
      />
    ),
  },
];

const data = [
  {
    key: '1',
    col1: '10..66.211.141',
    col2: 'Percentage',
  },
  {
    key: '2',
    col1: '10..66.211.141',
    col2: 'Percentage',
  },
  {
    key: '3',
    col1: '1',
    col2: 'Percentage',
  },
];

const TenSubnetTable = () => {
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'dark-row' : 'light-row';
  };

  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
      bordered={false}
      rowClassName={getRowClassName}
      style={{ border: 'none' }}
      headerStyle={{ background: 'black', color: 'white' }}
    />
  );
};

export default TenSubnetTable;
