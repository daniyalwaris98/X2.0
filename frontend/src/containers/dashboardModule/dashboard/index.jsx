import React from "react";
import { Row, Col } from "antd";
import ConfigurationBackupSummary from "./components/ConfigurationBackupSummary";
import CountPerVendors from "./components/CountPerVendors";
import TopOpenPorts from "../../ipamModule/dashboard/components/TopOpenPorts";
import SnmpStatus from "../../autoDiscoveryModule/dashboard/components/SnmpStatus";
import TenSubnetTable from "../../ipamModule/dashboard/components/TenSubnetTable";
import DeviceStatus from "./components/DeviceStatus";
import SubnetSummary from "./components/SubnetSummary";
import CredentialSummary from "./components/CredentialSummary";
import Compliance from "../../ncmModule/dashboard/components/Compliance";
import TopVendorForDiscovery from "../../autoDiscoveryModule/dashboard/components/TopVendorForDiscovery";
import {Progress }from "antd";
import MainTable from "./components/MainTable";
import TypeSummaryChart from "../../ipamModule/dashboard/components/TypeSummaryChart";
import TopSubnet from "../../ipamModule/dashboard/components/TopSubnet";
import {
  useGetConfigurationByTimeQuery,
} from "../../../store/features/dashboardModule/dashboard/apis";


import {
  useGetTypeSummaryQuery,
  useGetSubnetSummaryQuery,
} from "../../../store/features/ipamModule/dashboard/apis";
import {
 useGetTopVendorForDiscoveryQuery,
 useGetCredentialsSummaryQuery,
 useGetSnmpStatusQuery
} from "../../../store/features/autoDiscoveryModule/dashboard/apis";

function Index() {
  const {
    data: typeSummaryData,
    isSuccess: isTypeSummarySuccess,
    isLoading: isTypeSummaryLoading,
    isError: isTypeSummaryError,
    error: typeSummaryError,
  } = useGetTypeSummaryQuery();

  // console.log("typeSummaryData", typeSummaryData)
  const {
    data: subnetSummaryData,
    isSuccess: isSubnetSummarySuccess,
    isLoading: isSubnetSummaryLoading,
    isError: isSubnetSummaryError,
    error: subnetSummaryError,
  } = useGetSubnetSummaryQuery();
  const {
    data: topVendorData,
    isSuccess: isTopVendorSuccess,
    isLoading: isTopVendorLoading,
    isError: isTopVendorError,
    error: topVendorError,
  } = useGetTopVendorForDiscoveryQuery();

  const {
    data: credentialsSummaryData,
    isSuccess: isCredentialsSummarySuccess,
    isLoading: isCredentialsSummaryLoading,
    isError: isCredentialsSummaryError,
    error: credentialsSummaryError,
  } = useGetCredentialsSummaryQuery();
  const {
    data: snmpStatusData,
    isSuccess: isSnmpStatusSuccess,
    isLoading: isSnmpStatusLoading,
    isError: isSnmpStatusError,
    error: SnmpStatusError,
  } = useGetSnmpStatusQuery();


  const {
    data: configurationByTimeData,
    isSuccess: isConfigurationByTimeSuccess,
    isLoading: isConfigurationByTimeLoading,
    isError: isConfigurationByTimeError,
    error: configurationByTimeError,
  } = useGetConfigurationByTimeQuery();
  console.log("configurationByTimeData",configurationByTimeData)
  const colStyle = {
    backgroundColor: "#FFFFFF", // Grey background color
    borderRadius: "8px",
    height: "100%",
    padding: "10px",
  };

  const rowStyle = {
    marginBottom: "40px", // Add margin between rows
  };
  const title = {
    margin:"0px",
    fontSize:"16px"
  }
  const data = [
    { vendor: 'A', counts: 50 },
    { vendor: 'B', counts: 30 },
    { vendor: 'C', counts: 40 },
    { vendor: 'D', counts: 60 },
    { vendor: 'E', counts: 20 },
    { vendor: 'F', counts: 35 },
  ];

  const chartData = {
    ports: ['Port 1', 'Port 2', 'Port 3', 'Port 4'],
    counts: [10, 20, 15, 30],
  };
  const apiResponse = [
    {
      name: "Sales",
      value: 4200
    },
    {
      name: "Admin",
      value: 3000
    },
    {
      name: "Inform",
      value: 20000
    },
    {
      name : "Customer",
      value: 35000
    },
   
  ];

  const tableData = [
    {
      key: '1',
      subnet: '10.66.211.141',
      value: 50
    },
    {
      key: '2',
      subnet: '10.66.211.141',
      value: 10
    },
    {
      key: '3',
      subnet: '1',
      value: 60
    },
  ];

  const tableColumns = [
    {
      title: 'Subnet',
      dataIndex: 'subnet',
      key: 'subnet',
      align: 'start',
      render: text => <a style={{ display: 'block', fontWeight: '600', color: 'green' }}>{text}</a>,
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
  ];

  const tableDataSFPS = [
    {
      key: '1',
      subnet: '10.66.211.141',
      DeviceName:"ASR1006",
      value: 50
    },
    {
      key: '2',
      subnet: '10.66.211.141',
      DeviceName:"ASR1006",
      value: 10
    },
    {
      key: '3',
      subnet: '1',
      DeviceName:"ASR1006",
      value: 60
    },
  ];

  const tableColumnsSFPS = [
    {
      title: 'Subnet',
      dataIndex: 'subnet',
      key: 'subnet',
      align: 'start',
      render: text => <a style={{ display: 'block', fontWeight: '600', color: 'green' }}>{text}</a>,
    },
    {
      title: 'Device Name',
      dataIndex: 'DeviceName',
      key: 'DeviceName',
      align: 'start',
      render: text => <a style={{ display: 'block', fontWeight: '600', color: 'green' }}>{text}</a>,
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
  ];
  const tableDataCPU = [
    {
      key: '1',
      subnet: '10.66.211.141',
      DeviceName:"ASR1006",
      value: 50,
      function:"Router",
      
    },
    {
      key: '2',
      subnet: '10.66.211.141',
      DeviceName:"ASR1006",
      value: 10,
      function:"Router",
    },
    {
      key: '3',
      subnet: '1',
      DeviceName:"ASR1006",
      value: 60,
      function:"Router",
    },
  ];

  const tableColumnsCPU = [
    {
      title: 'Subnet',
      dataIndex: 'subnet',
      key: 'subnet',
      align: 'start',
      render: text => <a style={{ display: 'block', fontWeight: '600', color: 'green' }}>{text}</a>,
    },
    {
      title: 'Device Name',
      dataIndex: 'DeviceName',
      key: 'DeviceName',
      align: 'start',
      render: text => <a style={{ display: 'block', fontWeight: '600', color: 'green' }}>{text}</a>,
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
      render: text => <a style={{ display: 'block', fontWeight: '600', color: 'green' }}>{text}</a>,
    }];
  return (
    <>
      <Row gutter={[16, 16]} justify="space-between" style={rowStyle}>
        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Count Per Vendors</h5>
            {/* <CountPerVendors data={typeSummaryData}/> */}
            <TypeSummaryChart  data={typeSummaryData !== undefined ? typeSummaryData:[]}/>
                      </div>
        </Col>

        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Subnet Summary</h5>
            <TopSubnet
              data={subnetSummaryData !== undefined ? subnetSummaryData : []}
            />
          </div>
        </Col>

        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Top Vendors For Discovery</h5>
            <TopVendorForDiscovery data={topVendorData !== undefined? topVendorData:[]} />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="space-between" style={rowStyle}>
        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Configuration Change by Time</h5>
            <TopOpenPorts chartData={chartData} />
          </div>
        </Col>

        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Credentials Summary</h5>
            <CredentialSummary data={credentialsSummaryData !== undefined? credentialsSummaryData:[]} />
          </div>
        </Col>

        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>SNMP Status</h5>
            <SnmpStatus  responseData={snmpStatusData}/>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="space-between" style={rowStyle}>
        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Top 5 Subnets by % IP Address Used</h5>
            <MainTable tableData={tableData} tableColumns={tableColumns} />
          </div>
        </Col>

        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>EOL Summary</h5>
            <Compliance />
          </div>
        </Col>

        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Devices with most unused SFPs</h5>
            <MainTable tableData={tableDataSFPS} tableColumns={tableColumnsSFPS} />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="space-between" style={rowStyle}>
        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Sites Location</h5>
            {/* <TypeSummaryChart /> */}
          </div>
        </Col>

        <Col span={16}>
          <div style={colStyle}>
            <h5 style={title}>Device Status Overview</h5>
            <DeviceStatus />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="space-between" style={rowStyle}>
        <Col span={12}>
          <div style={colStyle}>
            <h5 style={title}>Devices By CPU Utilization</h5>
            <MainTable tableData={tableDataCPU} tableColumns={tableColumnsCPU} />
          </div>
        </Col>

        <Col span={12}>
          <div style={colStyle}>
            <h5 style={title}>Devices By Memory Utilization</h5>
            <MainTable tableData={tableDataCPU} tableColumns={tableColumnsCPU} />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Index;
