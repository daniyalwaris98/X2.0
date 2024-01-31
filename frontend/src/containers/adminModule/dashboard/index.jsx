import React from "react";
import { Row, Col } from "antd";
import TypeSummaryChart from "../../ipamModule/dashboard/components/TypeSummaryChart";
import ConfigurationBackupSummary from "../../ncmModule/dashboard/components/ConfigurationBackupSummary";
// import TypeSummaryChart from "./components/TypeSummaryChart";
// import TopSubnet from "./components/TopSubnet";
// import IpAvailble from "./components/IpAvailble";
// import DNSChart from "./components/DNSChart";
// import TenSubnetTable from "./components/TenSubnetTable";
import TopOpenPorts from "../../ipamModule/dashboard/components/TopOpenPorts";
import SnmpStatus from "../../autoDiscoveryModule/dashboard/components/SnmpStatus";
import TenSubnetTable from "../../ipamModule/dashboard/components/TenSubnetTable";
import DeviceStatus from "./components/DeviceStatus";
import SubnetSummary from "./components/SubnetSummary";
import CredentialSummary from "./components/CredentialSummary";
import Compliance from "../../ncmModule/dashboard/components/Compliance"

function Index() {
  const chartData = [1];
  const chartDatab = [0.85];

  return (
    <>
      <Row
        gutter={[16, 16]}
        justify="space-between"
        style={{ height: "332px", paddingTop: "5px" }}
      >
        <Col span={8}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              Count Per Vendors
            </h5>
            <TypeSummaryChart/>

          </div>
        </Col>

        <Col span={8}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              Subnet Summary
            </h5>
<SubnetSummary/>       
   </div>
        </Col>
        <Col span={8}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              Top Vendors For Discovery{" "}
            </h5>
<ConfigurationBackupSummary/>          </div>
        </Col>
      </Row>
      <Row
        gutter={[16, 16]}
        justify="space-between"
        style={{ height: "332px", paddingTop: "130px" }}
      >
        <Col span={8}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              Configuration Change by Time{" "}
            </h5>
            <TopOpenPorts />
          </div>
        </Col>

        <Col span={8}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              Credentials Summary{" "}
            </h5>
<CredentialSummary/>
          </div>
        </Col>
        <Col span={8}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              SNMP Status{" "}
            </h5>
            <SnmpStatus/>
            {/* <TopSubnet /> */}
          </div>
        </Col>
      </Row>

      <Row
        gutter={[16, 16]}
        justify="space-between"
        style={{ height: "332px", paddingTop: "260px" }}
      >
        <Col span={8}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              Top 5 Subnets by % IP Address Used{" "}
            </h5>
            <TenSubnetTable/>
          </div>
        </Col>

        <Col span={8}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              EOL Summary{" "}
            </h5>
<Compliance/>
          </div>
        </Col>
        <Col span={8}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              Devices with most unused SFPs{" "}
            </h5>
            <TenSubnetTable/>
          </div>
        </Col>
      </Row>

      <Row
        gutter={[16, 16]}
        justify="space-between"
        style={{ height: "332px", paddingTop: "290px" }}
      >
        <Col span={8}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              Sites Location{" "}
            </h5>
            {/* <TypeSummaryChart /> */}
          </div>
        </Col>

        <Col span={16}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              Device Status Overview{" "}
            </h5>
            <DeviceStatus/>
          
          </div>
        </Col>
      </Row>
      
      <Row
        gutter={[16, 16]}
        justify="space-between"
        style={{ height: "332px", paddingTop: "320px" }}
      >
        <Col span={12}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
            Devices By CPU Utilization            </h5>
            <TenSubnetTable/>
          </div>
        </Col>

        <Col span={12}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
            Devices By Memory Utilization            </h5>
            <TenSubnetTable />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Index;
