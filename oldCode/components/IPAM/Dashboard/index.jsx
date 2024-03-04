import React, { useState, useEffect } from "react";
import { Row, Col, Progress } from "antd";
import BarChart from "./BarChart";
import { SpinLoading, TableStyling } from "../../AllStyling/All.styled";
import axios, { baseUrl } from "../../../utils/axios";
import OpenPortsBarChart from "./BarChart/OpenPortBarChart.jsx";
import blue from "./assets/blue.svg";
import green from "./assets/green.svg";
import pink from "./assets/pink.svg";
import SubnetSummaryChart from "./Charts/Pie";
import DnsChart from "./Charts/Doughnut";
import one from "./assets/one.svg";
import two from "./assets/two.svg";
import { useNavigate } from "react-router-dom";
import SummaryChart from "./Charts/echarts/doughtnet";
import SubnetSummary from "./Charts/echarts/pie";

const index = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [ipAvailibityLoading, setIpAvailibityLoading] = useState(false);
  const [ipAvailibity, setIpAvailibity] = useState("");

  useEffect(() => {
    const serviceCalls = async () => {
      setTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/topTenSubnetsPercentage");

        // deviceExcelData = res.data;
        setTableData(res.data);
        // setRowCount(excelData.length);
        setTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setTableLoading(false);
      }
    };
    serviceCalls();
  }, []);
  useEffect(() => {
    const serviceCalls = async () => {
      setIpAvailibityLoading(true);

      try {
        const res = await axios.get(baseUrl + "/ipAvailibity");

        setIpAvailibity(res.data);
        setIpAvailibityLoading(false);
      } catch (err) {
        console.log(err.response);
        setIpAvailibityLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const column = [
    {
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",
      render: (text, record) => (
        <p
          onClick={() => {
            navigate("/ipam/subnet/ip-details", {
              state: {
                subnet: text,
              },
            });
          }}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            fontWeight: "400",
            // textAlign: "center",
            paddingLeft: "12px",
            // color: "blue",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "IP % Space Used",
      dataIndex: "space_usage",
      key: "space_usage",
      render: (text) => (
        <div
          onClick={() => {
            console.log(text);
          }}
          style={{
            // textAlign: "center",
            // marginLeft: "20px",
            marginTop: "-10px",
            paddingRight: "75px",
            paddingLeft: "15px",
          }}
        >
          {text <= 60 ? (
            <Progress
              strokeColor="#66B127"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}
          {text > 60 && text <= 80 ? (
            <Progress
              strokeColor="#F57A40"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}

          {text > 80 && text <= 100 ? (
            <Progress
              strokeColor="#CC050C"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}
        </div>
      ),
    },
    // {
    //   title: "Subnet",
    //   dataSource: "subnet",
    //   key: "subnet",
    //   render: (text, record) => (
    //     <p
    //       style={{
    //         color: "#66B127",
    //         textDecoration: "underline",
    //         fontWeight: "400",
    //         textAlign: "center",
    //         // color: "blue",
    //         cursor: "pointer",
    //       }}
    //     >
    //       {text}

    //       {/* 45 */}
    //     </p>
    //   ),
    // },
    // {
    //   title: "IP % Space Used",
    //   dataSource: "space_usage",
    //   key: "space_usage",
    //   render: (text, record) => (
    //     <Progress
    //       style={{ paddingRight: "10px", paddingLeft: "10px" }}
    //       strokeColor="#66B127"
    //       // percent="97"
    //       percent={text}
    //       size="small"
    //       status="active"
    //     />
    //   ),
    // },
  ];

  return (
    <div style={{ height: "100%", paddingBottom: "15px" }}>
      <br />
      <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
        {/* <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }}>
          <div
            style={{
              // display: "flex",
              height: "100%",
              // paddingTop: '15px',
              marginRight: "10px",
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
              borderRadius: "12px",
              backgroundColor: "#fcfcfc",
            }}
          >
            <h3
              style={{
                color: "#000",
                borderLeft: "3px solid #3D9E47",
                borderTopLeftRadius: "6px",
                paddingLeft: "10px",
                alignItems: "center",
                // marginLeft: '-6px',
                paddingTop: "4px",
                fontWeight: "bold",
              }}
            >
              Top Sites
            </h3>
            <div
              style={{
                marginTop: "20px",
                // position: "relative",
                width: "100%",
                // height: "900px",

                // minHeight: 900,
              }}
            >
              <BarChart />
            </div>
          </div>
        </Col> */}
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
          <div
            style={{
              // display: "flex",
              height: "100%",
              // paddingTop: '15px',
              marginRight: "10px",
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
              borderRadius: "12px",
              backgroundColor: "#fcfcfc",
            }}
          >
            <h3
              style={{
                color: "#000",
                borderLeft: "5px solid #3D9E47",
                borderTopLeftRadius: "6px",
                paddingLeft: "13px",
                float: "left",
                // alignItems: "center",
                // marginLeft: '-6px',
                paddingTop: "10px",
                fontWeight: "bold",
              }}
            >
              Top 10 Subnets by % IP Address Used
            </h3>
            <SpinLoading spinning={tableLoading}>
              <TableStyling
                // rowSelection={DeviceRowSelection}
                // scroll={{ x: 2000 }}
                pagination={{ pageSize: 5 }}
                // rowKey="subnet_address"
                columns={column}
                dataSource={tableData}
                // pagination={false}
                // style={{ width: "100%" }}
              />
            </SpinLoading>
          </div>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
          <div
            style={{
              marginTop: "-18px",
              // display: "flex",
              height: "100%",
              // paddingTop: '15px',
              marginRight: "10px",
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
              borderRadius: "12px",
              backgroundColor: "#fcfcfc",
            }}
          >
            <h3
              style={{
                color: "#000",
                borderLeft: "5px solid #3D9E47",
                borderTopLeftRadius: "6px",
                paddingLeft: "13px",
                float: "left",
                // alignItems: "center",
                // marginLeft: '-6px',
                paddingTop: "10px",
                fontWeight: "bold",
              }}
            >
              TCP Open Ports
            </h3>
            <div
              style={{
                marginTop: "20px",
                // position: "relative",
                width: "100%",
                // height: "900px",

                // minHeight: 900,
              }}
            >
              <OpenPortsBarChart />
            </div>
          </div>
        </Col>
      </Row>
      <br />
      <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
          <SpinLoading spinning={ipAvailibityLoading}>
            <div
              style={{
                // display: "flex",
                height: "100%",
                // paddingTop: '15px',
                marginRight: "10px",
                marginTop: "8px",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 1px 5px 0px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #3D9E47",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  float: "left",
                  // alignItems: "center",
                  // marginLeft: '-6px',
                  paddingTop: "10px",
                  fontWeight: "bold",
                }}
              >
                IP Availability Summary
              </h3>
              <br />
              <br />
              <SummaryChart />
            </div>
          </SpinLoading>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
          <div
            style={{
              marginRight: "10px",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 1px 5px 0px",
              borderRadius: "12px",
              backgroundColor: "#fcfcfc",
            }}
          >
            <h3
              style={{
                color: "#000",
                borderLeft: "5px solid #3D9E47",
                borderTopLeftRadius: "6px",
                paddingLeft: "13px",
                float: "left",
                paddingTop: "10px",
                fontWeight: "bold",
              }}
            >
              DNS Summary
            </h3>
            <DnsChart />
          </div>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 8 }}>
          <div
            style={{
              // display: "flex",
              // height: "100%",
              // paddingTop: '15px',
              marginRight: "10px",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 1px 5px 0px",
              borderRadius: "12px",
              backgroundColor: "#fcfcfc",
            }}
          >
            <h3
              style={{
                color: "#000",
                borderLeft: "5px solid #3D9E47",
                borderTopLeftRadius: "6px",
                paddingLeft: "13px",
                float: "left",
                // alignItems: "center",
                // marginLeft: '-6px',
                paddingTop: "10px",
                fontWeight: "bold",
              }}
            >
              Subnet Summary
            </h3>
            <br />
            <br />
            {/* <SubnetSummaryChart /> */}
            <SubnetSummary />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default index;
