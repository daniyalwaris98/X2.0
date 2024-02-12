import React from "react";
import { Row, Col } from "antd";
import ConfigurationBackupSummary from "./components/ConfigurationBackupSummary";
import CountPerVendors from "./components/CountPerVendors"
import TopOpenPorts from "../../ipamModule/dashboard/components/TopOpenPorts";
import SnmpStatus from "../../autoDiscoveryModule/dashboard/components/SnmpStatus";
import TenSubnetTable from "../../ipamModule/dashboard/components/TenSubnetTable";
import DeviceStatus from "./components/DeviceStatus";
import SubnetSummary from "./components/SubnetSummary";
import CredentialSummary from "./components/CredentialSummary";
import Compliance from "../../ncmModule/dashboard/components/Compliance";

function Index() {
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

  return (
    <>
      <Row gutter={[16, 16]} justify="space-between" style={rowStyle}>
        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Count Per Vendors</h5>
            {/* <CountPerVendors/> */}
                      </div>
        </Col>

        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Subnet Summary</h5>
            <SubnetSummary />
          </div>
        </Col>

        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Top Vendors For Discovery</h5>
            {/* <ConfigurationBackupSummary /> */}
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="space-between" style={rowStyle}>
        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Configuration Change by Time</h5>
            <TopOpenPorts />
          </div>
        </Col>

        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Credentials Summary</h5>
            <CredentialSummary />
          </div>
        </Col>

        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>SNMP Status</h5>
            <SnmpStatus />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="space-between" style={rowStyle}>
        <Col span={8}>
          <div style={colStyle}>
            <h5 style={title}>Top 5 Subnets by % IP Address Used</h5>
            <TenSubnetTable />
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
            <TenSubnetTable />
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
            <TenSubnetTable />
          </div>
        </Col>

        <Col span={12}>
          <div style={colStyle}>
            <h5 style={title}>Devices By Memory Utilization</h5>
            <TenSubnetTable />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Index;
