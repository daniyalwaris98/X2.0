import React from "react";
import { Row, Col } from "antd";
import TypeSummaryChart from "./components/TypeSummaryChart";
import TopSubnet from "./components/TopSubnet";
import IpAvailble from "./components/IpAvailble";
import DNSChart from "./components/DNSChart";
import TenSubnetTable from "./components/TenSubnetTable";
import TopOpenPorts from "./components/TopOpenPorts";

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
              Type Summary
            </h5>
            <TypeSummaryChart />
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
            <TenSubnetTable />
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
              Top 10 Subnets by % IP Address Used{" "}
            </h5>
            <TopSubnet />
          </div>
        </Col>
      </Row>
      <Row
        gutter={[16, 16]}
        justify="space-between"
        style={{ height: "332px", paddingTop: "140px" }}
      >
        <Col span={7}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              IP Availability Summary{" "}
            </h5>

            <IpAvailble />
          </div>
        </Col>

        <Col span={10}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              Top 10 Open Ports
            </h5>
            <TopOpenPorts />
          </div>
        </Col>
        <Col span={7}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              DNS{" "}
            </h5>
            <div style={{ display: "flex" }}>
              <DNSChart color="#3D9E47" data={chartData} />
              <DNSChart color={"#E36263"} data={chartDatab} />
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Index;
