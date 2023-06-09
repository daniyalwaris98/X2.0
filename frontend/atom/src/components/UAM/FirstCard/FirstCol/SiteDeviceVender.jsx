import React, { useState } from "react";
// import location from "./assets/location.svg";

import { Row, Col } from "antd";

const SiteDeviceVender = (props) => {
  return (
    <div style={{ marginBottom: "5px" }}>
      <div
        style={{
          // margin: '2px',
          // border: "0.6px solid rgba(0, 0, 0, 0.1)",
          // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",

          border: "1px solid #e5e5e5",
          boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",

          // border: '1px solid',
          borderRadius: "8px",
          paddingTop: "29px",
          paddingBottom: "0px",
          backgroundColor: "#fcfcfc",
          // width: "120px",
          // height: "100px",
        }}
      >
        <Row style={{ paddingLeft: "20px" }}>
          <Col xs={{ span: 12 }} md={{ span: 10 }} lg={{ span: 10 }}>
            <img
              src={props.myImg}
              alt=""
              // width="40px"
              // height="40px"
              style={{ marginLeft: "8px" }}
            />
          </Col>
          <Col xs={{ span: 12 }} md={{ span: 14 }} lg={{ span: 14 }}>
            <p
              style={{
                color: "#9F9F9F",
                fontSize: "12px",

                marginLeft: "18px",
                marginRight: "10px",
              }}
            >
              {props.Name}
            </p>
            <p
              style={{
                color: "#6C6B75",
                fontSize: "18px",
                fontWeight: "bold",
                paddingBottom: "10px",
                marginTop: "-4px",
                marginLeft: "18px",
              }}
            >
              {props.myNumber}
            </p>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SiteDeviceVender;
