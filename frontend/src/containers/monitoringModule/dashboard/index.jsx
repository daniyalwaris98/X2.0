import React, { useEffect } from "react";
import { Row, Col } from "antd";
import ConfigurationChangeByVendor from "../../../components/charts/ConfigurationChangeByVendor";
// import { selectTableData } from "../../../store/features/ncmModule/dashboard/selectors";
import { useSelector } from "react-redux";

import { 
  useGetHeatMapQuery,
  useGetMemoryQuery,
  useGetCpuQuery,
  useGetTopInterfacesQuery,
  useGetSnapshotQuery

} from "../../../store/features//monitoringModule/dashboard/apis";
import HeatMap from "./components/HeatMap";
import TenSubnetTable from "../../ipamModule/dashboard/components/TenSubnetTable";
import {Progress} from "antd";
import MainTable from "../../dashboardModule/dashboard/components/MainTable";

function Index() {
  const {
    data: heatmapData,
    isSuccess: isHeatmapDataSuccess,
    isLoading: isHeatmapDataLoading,
    isError: isHeatmapDataError,
    error: heatmapDataError,
  } = useGetHeatMapQuery();

  const {
    data: memoryData,
    isSuccess: isMemorySuccess,
    isLoading: isMemoryLoading,
    isError: isMemoryError,
    error: memoryError,
  } = useGetMemoryQuery();
  console.log("memory ",memoryData)

  const {
    data: cpuData,
    isSuccess: isCpuSuccess,
    isLoading: isCpuLoading,
    isError: isCpuError,
    error: cpuError,
  } = useGetCpuQuery();
  console.log("cpu",cpuData)

  const {
    data: topInterfacesData,
    isSuccess: isTopInterfacesSuccess,
    isLoading: isTopInterfacesLoading,
    isError: isTopInterfacesError,
    error: topInterfacesError,
  } = useGetTopInterfacesQuery();

  const {
    data: snapshotData,
    isSuccess: isSnapshotSuccess,
    isLoading: isSnapshotLoading,
    isError: isSnapshotError,
    error: snapshotError,
  } = useGetSnapshotQuery();
  

  console.log("snapshotData", snapshotData);
  const companyData = {
    Cisco: 50,
    Fortinet: 10,
    PaloAlto: 5,
    Huawai: 3,
    Linux: 50,
    Citrix: 10,
    Hp: 20,
    Juniper: 10,
  };
  const heatmap = [
    {
      fill: "#E2B200",
      name: "Attention",
      value: 0,
    },
    {
      fill: "#C0C0C0",
      name: "Not Monitored",
      value: 0,
    },
    {
      fill: "#66B127",
      name: "Clear",
      value: 0,
    },
    {
      fill: "#FF9A40",
      name: "Critical",
      value: 0,
    },
    {
      fill: "#808080",
      name: "InActive",
      value: 0,
    },
    {
      fill: "#DC3938",
      name: "Device Down",
      value: 0,
    },
    {
      fill: "#0504aa",
      name: "Total",
      value: 0,
    },
    {
      fill: "#808080",
      name: "InActive",
      value: 0,
    },
    {
      fill: "#DC3938",
      name: "Device Down",
      value: 0,
    },
    {
      fill: "#0504aa",
      name: "Total",
      value: 0,
    },
    {
      fill: "#808080",
      name: "InActive",
      value: 0,
    },
    {
      fill: "#DC3938",
      name: "Device Down",
      value: 0,
    },
    {
      fill: "#0504aa",
      name: "Total",
      value: 0,
    },
    {
      fill: "#DC3938",
      name: "Device Down",
      value: 0,
    },
    {
      fill: "#0504aa",
      name: "Total",
      value: 0,
    },
    {
      fill: "#DC3938",
      name: "Device Down",
      value: 0,
    },
    {
      fill: "#0504aa",
      name: "Total",
      value: 0,
    },
    {
      fill: "#DC3938",
      name: "Device Down",
      value: 0,
    },
    {
      fill: "#0504aa",
      name: "Total",
      value: 0,
    },
    {
      fill: "#DC3938",
      name: "Device Down",
      value: 0,
    },
    {
      fill: "#0504aa",
      name: "Total",
      value: 0,
    },
  ];

  const tableDataSnapshot = [
    {
      key: '1',
      name: '10.66.211.141',
      alarms:"A",
      devices: 50
    },
    {
      key: '2',
      name: '10.66.211.141',
      alarms:"A",
      devices: 50
    },{
      key: '3',
      name: '10.66.211.141',
      alarms:"A",
      devices: 50
    },
  ];
  const tableColumnsSnapshot =[
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'start',
      render: text => <a style={{ display: 'block', fontWeight: '600', color: 'green' }}>{text}</a>,
    },
    {
      title: 'Alarms',
      dataIndex: 'alarms',
      key: 'alarms',
      align: 'start',
      render: text => <a style={{ display: 'block', fontWeight: '600', color: 'black' }}>{text}</a>,
    },
    {
      title: 'Devices',
      dataIndex: 'devices',
      key: 'devices',
      align: 'center',
      render: (text) => <span style={{fontWeight: '600', color: 'black'}}>{text}</span>, // Render the value directly
    },
    
  ]
 

  const tableColumns = [
   
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      align: 'start',
      render: text => <a style={{ display: 'block', fontWeight: '600', color: 'green' }}>{text}</a>,
    },
    {
      title: 'Device Name',
      dataIndex: 'device_name',
      key: 'device_name',
      align: 'start',
      render: text => <a style={{ display: 'block', fontWeight: '600', color:"#262626" }}>{text}</a>,
    },
    {
      title: 'Progress',
      dataIndex: 'value',
      key: 'value',
      align: 'center',
      render: (_, record) => (
        <Progress
          percent={record.value}
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
      render: text => <a style={{ display: 'block', fontWeight: '600', color:"#262626" }}>{text}</a>,
    },
  ];

  const tableData = [
    {
      key: '1',
      ip: '10.66.211.141',
      device_name:"KSA_RO-1",
      value: 50,
      function:"Router",
    },
    {
      key: '2',
      ip: '10.66.211.141',
      device_name:"KSA_RO-02",
      value: 10,
      function:"Router",

    },
    {
      key: '3',
      ip: '10.66.211.141',
      device_name:"KSA_RO-03",
      value: 60,
      function:"Router",

    },
    {
      key: '4',
      ip: '10.66.211.41',
      device_name:"KSA_RO-04",
      value: 10,
      function:"Router",

    },
    {
      key: '5',
      ip: '10.66.211.1',
      device_name:"KSA_RO-05",
      value: 50,
      function:"Router",

    },
   
  ];
  return (
    <>
      <Row gutter={[32, 32]} justify="space-between">
        <Col span={24}>
          <div className="container" style={{ padding: "0 0 5px 0" }}>
            <h6 className="heading">Infrastructure HeatMap</h6>
            <HeatMap data={heatmapData !== undefined ? heatmapData : []} />
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]} justify="space-between" className="page_row">
        <Col span={12}>
          <div className="container">
            <h6 className="heading">Devices By CPU Utilization</h6>
            {/* <TenSubnetTable /> */}
            <MainTable tableData={tableData} tableColumns={tableColumns} />

          </div>
        </Col>

        <Col span={12}>
          <div className="container">
            <h6 className="heading">Devices By Memory Utilization</h6>
            <TenSubnetTable />
          </div>
        </Col>
      </Row>
      <Row gutter={[24, 24]} justify="space-between" className="page_row">
        <Col span={12}>
          <div className="container">
            <h6 className="heading">Interfaces By Bandwidth Utilization</h6>
            <TenSubnetTable />
          </div>
        </Col>

        <Col span={12}>
          <div className="container">
            <h6 className="heading">Infrastructure Snapshot</h6>
            <MainTable tableData={snapshotData} tableColumns={tableColumnsSnapshot} />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Index;
