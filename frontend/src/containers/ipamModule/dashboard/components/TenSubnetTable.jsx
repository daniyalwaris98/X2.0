import React from 'react';
import { Table, Progress } from 'antd';
import { useSelector } from "react-redux";


import {
selectTopTenSubnet,
// selectNcmChangeByVendor

} from "../../../../store/features/ipamModule/dashboard/selectors";


import {
useGetTopTenSubnetQuery,
// useGetNcmChangeByVendorQuery

} from "../../../../store/features/ipamModule/dashboard/apis";

const columns = [
  {
    title: 'Subnet',
    dataIndex: 'col1',
    key: 'col1',
    align: 'center',
    render: text => <a style={{ display: 'block', fontWeight: '600', color: 'green' }}>{text}</a>,
  },
  {
    title: 'Progress',
    dataIndex: 'col3',
    key: 'col3',
    align: 'center',
    render: (_, record) => (
      <Progress
        percent={record.col3}  // Use the actual percentage value from your data
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
  },
  {
    key: '2',
    col1: '10..66.211.141',
  },
  {
    key: '3',
    col1: '1',
  },
];

const TenSubnetTable = () => {
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'dark-row' : 'light-row';
  };


  const {
    data: topTenData,
    isSuccess: isTopTenSuccess,
    isLoading: isTopTenLoading,
    isError: isTopTenError,
    error: topTenError,
   
  } = useGetTopTenSubnetQuery();

  console.log("husnain",topTenData)


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
