import React from "react";
// import subnet from "./assets/subnet.svg";
import subnet from "../assets/subnet.svg";
import { Row, Col } from "antd";

const index = (props) => {
  return (
    <div
      style={{
        // margin: "2px",
        boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
        borderRadius: "8px",
        // marginTop: '2px',
        height: "294px",

        paddingTop: "105px",
        backgroundColor: "#fcfcfc",
        // width: "120px",
        // height: "100px",
      }}
    >
      <Row>
        <Col xs={{ span: 12 }} md={{ span: 10 }} lg={{ span: 10 }}>
          <img
            src={props.myImg}
            // src={subnet}
            alt=""
            // width="40px"
            // height="40px"
            style={{ marginLeft: "15px" }}
          />
        </Col>
        <Col xs={{ span: 12 }} md={{ span: 14 }} lg={{ span: 14 }}>
          <p
            style={{
              color: "#9F9F9F",
              fontSize: "13px",
              marginTop: "5px",
              marginLeft: "20px",
              marginRight: "10px",
            }}
          >
            {props.Name}
            {/* Total Subnet */}
          </p>
          <p
            style={{
              color: "#6C6B75",
              fontSize: "24px",
              fontWeight: "bold",
              paddingBottom: "10px",
              marginTop: "18px",
              marginLeft: "20px",
            }}
          >
            {props.number}
            {/* 400 */}
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default index;
