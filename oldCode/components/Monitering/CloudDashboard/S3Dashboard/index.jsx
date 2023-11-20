import React, { useState, useEffect } from "react";
import { Col, Divider, Row } from "antd";
import inputicon from "../assets/input.svg";
import outputicon from "../assets/output.svg";
import inputbyte from "../assets/inputbyte.svg";
import outputbyte from "../assets/outputbyte.svg";
import CpuUtilization from "../echarts/Gauge/CpuUtilization";
import MemoryUtilization from "../echarts/Gauge/MemoryUtilization";
import { useLocation } from "react-router-dom";
import axios, { baseUrl } from "../../../../utils/axios";
import size from "../assets/size.svg";
import count from "../assets/count.svg";

import NoOfObjects from "../GraphS3/NoOfObjects";
import BucketGraph from "../GraphS3/BucketGraph";
import { SpinLoading } from "../../../AllStyling/All.styled";

const index = () => {
  const data = useLocation();
  console.log(data.state);

  const [bucket_name, setbucket_name] = useState(data.state.bucket_name);
  const [allData, setAllData] = useState("");
  const [mainLoading, setMainLoading] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const loadAllData = async () => {
  //       setMainLoading(true);
  //       const res = await axios.post(baseUrl + "/getS3MonitoringData", {
  //         bucket_name: bucket_name,
  //       });

  //       console.log("getMonitoringDevicesCards", res);
  //       setAllData(res.data);
  //       setMainLoading(false);
  //     };
  //     loadAllData();
  //   }, 10000); // 3 minutes in milliseconds

  //   return () => clearInterval(interval);
  // }, []);
  useEffect(() => {
    const loadAllData = async () => {
      setMainLoading(true);
      const res = await axios.post(baseUrl + "/getS3MonitoringData", {
        bucket_name: bucket_name,
      });

      console.log("getMonitoringDevicesCards", res);
      setAllData(res.data);

      setMainLoading(false);
    };
    loadAllData();
  }, []);
  return (
    <div style={{ margin: "15px", marginLeft: "15px", marginRight: "15px" }}>
      <SpinLoading spinning={mainLoading}>
        <div
          style={{
            borderRadius: "12px",
            backgroundColor: "#fcfcfc",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
          }}
        >
          <h3
            style={{
              // color: "#66b127",
              borderLeft: "5px solid #66b127",
              borderTopLeftRadius: "6px",
              paddingLeft: "13px",
              alignItems: "center",
              textAlign: "left",
              // marginLeft: '-6px',
              paddingTop: "8px",
              fontWeight: "bold",
            }}
          >
            S3 Summary
          </h3>
          <div style={{ display: "flex", padding: "10px" }}>
            <div
              style={{
                padding: "10px",
                paddingLeft: "20px",
                width: "200px",
                height: "70px",
                borderRight: "0.5px solid rgba(0,0,0,0.1)",
              }}
            >
              <h5>Instance name :</h5>
              <p style={{ color: "#66b127" }}>{allData.bucket_name}</p>
            </div>

            <div
              style={{
                padding: "10px",
                paddingLeft: "20px",
                width: "200px",
                height: "70px",
                borderRight: "0.5px solid rgba(0,0,0,0.1)",
              }}
            >
              <h5>Region ID :</h5>
              <p style={{ color: "#66b127" }}>{allData.region_id}</p>
            </div>
            <div
              style={{
                padding: "10px",
                paddingLeft: "20px",
                width: "200px",
                height: "70px",
                borderRight: "0.5px solid rgba(0,0,0,0.1)",
              }}
            >
              <h5>Account Label :</h5>
              <p style={{ color: "#66b127" }}>{allData.account_label}</p>
            </div>
            <div
              style={{
                padding: "10px",
                paddingLeft: "20px",
                // width: "200px",
                height: "70px",
                borderRight: "0.5px solid rgba(0,0,0,0.1)",
              }}
            >
              <h5>Time:</h5>
              <p style={{ color: "#66b127" }}>{allData.timestamp}</p>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "10px",
            borderRadius: "12px",
            backgroundColor: "#fcfcfc",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
          }}
        >
          {/* <h3
            style={{
              // color: "#66b127",
              borderLeft: "5px solid #66b127",
              borderTopLeftRadius: "6px",
              paddingLeft: "13px",
              alignItems: "center",
              textAlign: "left",
              // marginLeft: '-6px',
              paddingTop: "8px",
              fontWeight: "bold",
            }}
          >
            S3 Summary
          </h3> */}
          <Row style={{ padding: "15px" }}>
            <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
              <div style={{ textAlign: "center" }}>
                <div>
                  <img src={size} alt="" />
                  <p style={{ marginTop: "8px" }}>Bucket Size</p>
                  <h2
                    style={{
                      marginTop: "-15px",
                      fontSize: "22px",
                      fontWeight: 600,
                    }}
                  >
                    {(Math.round(allData.bucket_size * 100) / 100).toFixed(2)}{" "}
                    <sub>GBs</sub>
                  </h2>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
              <div style={{ textAlign: "center" }}>
                <div>
                  <img src={count} alt="" />
                  <p style={{ marginTop: "8px" }}>Number of Objects</p>
                  <h2
                    style={{
                      marginTop: "-15px",
                      fontSize: "22px",
                      fontWeight: 600,
                    }}
                  >
                    {allData.number_of_objects}
                  </h2>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </SpinLoading>

      <Row style={{ padding: "15px" }}>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
          <div
            style={{
              marginTop: "10px",
              borderRadius: "12px",
              backgroundColor: "#fcfcfc",
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
              marginRight: "15px",
            }}
          >
            <h3
              style={{
                // color: "#66b127",
                borderLeft: "5px solid #66b127",
                borderTopLeftRadius: "6px",
                paddingLeft: "13px",
                alignItems: "center",
                textAlign: "left",
                // marginLeft: '-6px',
                paddingTop: "8px",
                fontWeight: "bold",
              }}
            >
              Bucket Size
            </h3>
            <BucketGraph bucket_name={bucket_name} />
          </div>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
          <div
            style={{
              marginTop: "10px",
              borderRadius: "12px",
              backgroundColor: "#fcfcfc",
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
            }}
          >
            <h3
              style={{
                // color: "#66b127",
                borderLeft: "5px solid #66b127",
                borderTopLeftRadius: "6px",
                paddingLeft: "13px",
                alignItems: "center",
                textAlign: "left",
                // marginLeft: '-6px',
                paddingTop: "8px",
                fontWeight: "bold",
              }}
            >
              Number of Objects
            </h3>
            <NoOfObjects bucket_name={bucket_name} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default index;
