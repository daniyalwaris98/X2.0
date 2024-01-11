import React from 'react'
import { Table } from 'antd';


const dataSource = [
    { key: '1', col1: 'CISCO IOS Switch', col2: 'CISCO', col3: 'IOS', col4: '02' },
    { key: '2', col1: 'Fortinet Router', col2: 'FORTINET', col3: 'BIG-IP', col4: '03' },
    { key: '3', col1: 'CISCO IOS Switch', col2: 'CISCO', col3: 'IOS', col4: '02' },
    { key: '4', col1: 'CISCO Switch', col2: 'CISCO', col3: 'CISCO', col4: '02' },
    
  ];
  
  const columns = [
    { title: 'Device Type', dataIndex: 'col1', key: 'col1' },
    { title: 'Vendor ', dataIndex: 'col2', key: 'col2' },
    { title: 'OS Type', dataIndex: 'col3', key: 'col3' },
    { title: 'Devices', dataIndex: 'col4', key: 'col4' },
  ];
  

function NcmDeviceSummaryTable() {
  return (
    <div style={{padding:"0px 15px"}}>
    <Table dataSource={dataSource} columns={columns} />
    </div>
  )
}

export default NcmDeviceSummaryTable