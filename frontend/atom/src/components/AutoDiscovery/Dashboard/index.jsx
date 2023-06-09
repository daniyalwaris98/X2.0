import React from "react";

import SNMPStatusGraph from "./echarts/PieCharts";
import TopVendorsForDiscovery from "./echarts/BarChart";
import FunctionCount from "./echarts/BarChart/FunctionCount";
import CredGraph from "./echarts/BarChart/CredentialsGraph";
import TopOsForDiscovery from "./echarts/TopOs";

import { Row, Col } from "antd";

const index = () => {
  return (
    <>
      <div style={{ marginRight: "20px", marginLeft: "20px" }}>
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
                padding: "10px",
                marginRight: "10px",
              }}
            >
              <h2 style={{ fontWeight: 700 }}>SNMP Status</h2>
              <SNMPStatusGraph />
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <h2 style={{ fontWeight: 700 }}>Top Vendors For Discovery</h2>
              <TopVendorsForDiscovery />
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "10px" }}>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
                padding: "10px",
                marginRight: "10px",
              }}
            >
              <h2 style={{ fontWeight: 700 }}>Count Per Function </h2>
              <FunctionCount />
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
                padding: "10px",
                marginRight: "10px",
              }}
            >
              <h2 style={{ fontWeight: 700 }}>Credentials Summary</h2>
              <CredGraph />
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }}>
            <div
              style={{
                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
                padding: "10px",
                //   marginRight:"10px",
                marginTop: "10px",
              }}
            >
              <h2 style={{ fontWeight: 700 }}>Top OS in Auto Discovery</h2>
              <TopOsForDiscovery />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default index;
