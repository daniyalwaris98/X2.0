import React from "react";

import {
  MainProfileCard,
  ProfileChildMainCard,
  ProfileChildCard,
} from "./ThirdLine.styled.js";
import MyTable from "./MyTable";
import MyMap from "./Map";
import { Row, Col } from "antd";
import { useTranslation, initReactI18next } from "react-i18next";

const index = () => {
  const { t } = useTranslation();

  return (
    <Row
      style={{
        // padding: "10px",
        marginTop: "5px",
        marginRight: "10px",
        marginLeft: "10px",
      }}
    >
      <Col
        xs={{ span: 24 }}
        md={{ span: 12 }}
        lg={{ span: 12 }}
        // xl={{ span: 2 }}
      >
        <div
          style={{
            // display: "flex",
            justifyContent: "space-between",
            marginRight: "10px",
            borderRadius: "12px",
            backgroundColor: "#fcfcfc",
          }}
        >
          <h3
            style={{
              color: "#6C6B75",
              borderLeft: "3px solid rgba(130, 247, 163, 1)",
              borderTopLeftRadius: "6px",
              paddingLeft: "8px",

              alignItems: "center",
              // marginLeft: "1px",
              marginTop: "2px",
              paddingTop: "5px",
            }}
          >
            {t("Top")} {t("Devices")}
          </h3>
          <div>
            <MyTable />
          </div>
        </div>
      </Col>
      <Col
        xs={{ span: 24 }}
        md={{ span: 12 }}
        lg={{ span: 12 }}
        // xl={{ span: 2 }}
      >
        <div
          style={{
            // display: "flex",
            justifyContent: "space-between",
            // marginRight: "10px",
            borderRadius: "12px",
            backgroundColor: "#fcfcfc",
          }}
        >
          <h3
            style={{
              color: "#6C6B75",
              borderLeft: "3px solid rgba(5, 178, 211, 1)",
              borderTopLeftRadius: "6px",
              paddingLeft: "8px",

              alignItems: "center",
              // marginLeft: "1px",
              marginTop: "2px",
              paddingTop: "5px",
            }}
          >
            {t("Site")} {t("Location")}
          </h3>
          <div style={{ borderRadius: "8px", padding: "5px" }}>
            <MyMap />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default index;
