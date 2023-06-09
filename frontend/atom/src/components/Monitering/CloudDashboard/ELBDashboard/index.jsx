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

// import NoOfObjects from "../GraphS3/NoOfObjects";
// import BucketGraph from "../GraphS3/BucketGraph";
import { SpinLoading } from "../../../AllStyling/All.styled";

const index = () => {
  const data = useLocation();
  console.log(data.state);

  const [lb_arn, setlb_arn] = useState(data.state.lb_arn);
  const [allData, setAllData] = useState("");
  const [mainLoading, setMainLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const loadAllData = async () => {
        setMainLoading(true);
        const res = await axios.post(baseUrl + "/getELBMonitoringData", {
          lb_arn: lb_arn,
        });

        console.log("getELBMonitoringData", res);
        setAllData(res.data);
        setMainLoading(false);
      };
      loadAllData();
    }, 10000); // 3 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const loadAllData = async () => {
      setMainLoading(true);
      const res = await axios.post(baseUrl + "/getELBMonitoringData", {
        lb_arn: lb_arn,
      });

      console.log("getELBMonitoringData", res);
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
            ELB Summary
          </h3>
          <div style={{ display: "flex", padding: "10px" }}>
              <div
                style={{
                  padding: "10px",
                  paddingLeft: "20px",
                  // width: "200px",
                  height: "70px",
                  borderRight: "0.5px solid rgba(0,0,0,0.1)",
                }}
              >
                <h5>LB name :</h5>
                <p style={{ color: "#66b127" }}>{allData.lb_name}</p>
                <Divider type="vertical" />
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
                <Divider type="vertical" />
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
                <Divider type="vertical" />
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
                <Divider type="vertical" />
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
            ELB Summary
          </h3>
          <Row style={{ padding: "15px" }}>
            <Col xs={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }}>
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
            <Col xs={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }}>
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
                {allData.HealthyHostCount}
                  </h2>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }}>
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
               {allData.HTTPCode_ELB_5XX_Count}
                  </h2>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }}>
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
               {allData.HTTPCode_ELB_4XX_Count}
                  </h2>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }}>
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
                  {allData.HTTPCode_ELB_3XX_Count}
                  </h2>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }}>
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
                   {allData.HTTPCode_ELB_2XX_Count}
                  </h2>
                </div>
              </div>
            </Col>
          </Row>
          <Row style={{ padding: "15px" }}>
            <Col xs={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }}>
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
            <Col xs={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }}>
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
                {allData.HealthyHostCount}
                  </h2>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }}>
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
                {allData.RequestCount}
                  </h2>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }}>
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
                 {allData.ConsumedLCUs}
                  </h2>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }}>
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
                  {allData.ActiveConnectionCount}
                  </h2>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }}>
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
                   {allData.NewConnectionCount}
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
            {/* <BucketGraph bucket_name={bucket_name} /> */}
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
            {/* <NoOfObjects bucket_name={bucket_name} /> */}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default index;
