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
    title: 'IP Address',
    dataIndex: 'address',
    key: 'address',
    align: 'start',
    render: text => <a style={{ display: 'block', fontWeight: '600', color: 'green' }}>{text}</a>,
  },
  {
    title: 'Device Name',
    dataIndex: 'device_name',
    key: 'device_name',
    align: 'start',
    render: text => <a style={{ display: 'block', fontWeight: '600', color: 'black' }}>{text}</a>,
  },
  {
    title: 'Progress',
    dataIndex: 'value',
    key: 'value',
    align: 'start',
    render: (_, record) => (
      <Progress
        percent={record.value}  // Use the actual percentage value from your data
        status="active"
        strokeColor={record.value > 50 ? '#FF0000' : { from: '#108ee9', to: '#87d068' }}
      />
    ),
  },
  {
    title: 'Function',
    dataIndex: 'function',
    key: 'function',
    align: 'start',
    render: text => <a style={{ display: 'block', fontWeight: '600', color: 'black' }}>{text}</a>,
  },
];  

const data = [
  {
    key: '1',
    address: '10.66.211.141',
    device_name:"KSA_RO-1",
    value: 50,
    function:"Router",
  },
  {
    key: '2',
    address: '10.66.211.141',
    device_name:"KSA_RO-1",
    value: 10 ,
    function:"Router",
 
  },
  {
    key: '3',
    address: '10.66.211.141',
    device_name:"KSA_RO-1",
    value: 60,
    function:"Router",
  
  },
  {
    key: '4',
    address: '10.66.211.141',
    device_name:"KSA_RO-1",
    value: 50,
    function:"Router",
  },
  {
    key: '5',
    address: '10.66.211.141',
    device_name:"KSA_RO-1",
    value: 10 ,
    function:"Router",
 
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
    // dataSource={topTenData || []}
    dataSource={data || []}

    columns={columns}
    pagination={false}
    bordered={false}
    rowClassName={getRowClassName}
    style={{ border: 'none', overflow: "scroll", height: "400px",padding:"0 20px" }}
    headerStyle={{ background: 'black', color: 'white' }}
  />
  
  );
};

export default TenSubnetTable;
