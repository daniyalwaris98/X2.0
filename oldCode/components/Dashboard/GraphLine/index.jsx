import React, { useState, useEffect } from "react";
import BarChart from "../Charts/BarChart/index.jsx";
import PieChart from "../Charts/PieChart/index.jsx";

import OnBoardDomain from "./OnBoardDomain/index.jsx";
import edn from "../GraphLine/assets/edn.svg";
import ign from "../GraphLine/assets/ign.svg";
import system from "../GraphLine/assets/system.svg";
import itManager from "../GraphLine/assets/itManager.svg";
import { Row, Col } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import { useTranslation, initReactI18next } from "react-i18next";

const GraphLine = () => {
  const { t } = useTranslation();

  const [serviceImg, setServiceImg] = useState(null);
  const [serviceValue, setServiceValue] = useState(null);
  const [serviceName, setServiceName] = useState(null);

  const [loading, setLoading] = useState(false);

  return (
    <Row
      style={{
        // padding: "10px",
        marginTop: "5px",
        // marginRight: "2px",
        marginLeft: "10px",
      }}
      // style={{ padding: '10px', margin: '10px', marginLeft: '30px' }}
      // gutter={16}
    >
      <Col
        xs={{ span: 24 }}
        md={{ span: 7 }}
        lg={{ span: 8 }}
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
              borderLeft: "3px solid #6C6B75",
              borderTopLeftRadius: "6px",
              paddingLeft: "8px",

              alignItems: "center",
              // marginLeft: "1px",
              marginTop: "2px",
              paddingTop: "5px",
            }}
          >
            {/* <b>Onboarded</b> per <b>Month</b> */}
            <b>{t("Onboarded")}</b> {t("per")} <b>{t("Month")}</b>
          </h3>
          <div
            style={{
              margin: "15px auto",
              width: "100%",
              paddingLeft: "5px",
              paddingRight: "5px",
              height: "100%",
            }}
          >
            <PieChart />
          </div>
        </div>
      </Col>
      <Col
        xs={{ span: 24 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
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
              borderLeft: "3px solid rgba(203, 193, 247, 1)",
              borderTopLeftRadius: "6px",
              paddingLeft: "8px",

              alignItems: "center",
              // marginLeft: "1px",
              marginTop: "2px",
              paddingTop: "5px",
            }}
          >
            <b>{t("Count")}</b> {t("per")} <b>{t("Function")}</b>
          </h3>
          <div style={{ margin: "5px auto", width: "100%", height: "100%" }}>
            <BarChart />
          </div>
        </div>
      </Col>
      <Col
        xs={{ span: 24 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        // xl={{ span: 2 }}
      >
        <div
          style={{
            // display: "flex",
            backgroundColor: "rgba(187, 107, 217, 0.15)",
            // backgroundColor: "#000",
            // flexWrap: "wrap",

            justifyContent: "space-between",
            marginRight: "10px",
            borderRadius: "12px",
            backgroundColor: "#fcfcfc",
          }}
        >
          <h3
            style={{
              color: "#6C6B75",
              borderLeft: "3px solid rgba(90, 108, 225, 1)",
              borderTopLeftRadius: "6px",
              paddingLeft: "8px",

              alignItems: "center",
              // marginLeft: "1px",
              marginTop: "2px",
              paddingTop: "5px",
            }}
          >
            <b>{t("Count")}</b> {t("per")} <b>{t("Domain")}</b>
          </h3>
          <div>
            {/* {myFunction.map((item, index) => {
              <> */}
            <OnBoardDomain
            // serviceImg={edn}
            // serviceValue={item.value}
            // serviceName={item.name}
            />
            {/* </>;
            })} */}
          </div>
          {/* <OnBoardDomain
            serviceImg={ign}
            serviceValue={7}
            serviceName={"IGN"}
            // style={{
            //   padding: "10px",
            //   paddingBottom: "15px",
            //   paddingTop: "15px",
            // }}
          />
          <OnBoardDomain
            serviceImg={system}
            serviceValue={97}
            serviceName={"SYSTEM"}
          />
          <OnBoardDomain
            serviceImg={itManager}
            serviceValue={90}
            serviceName={"IT MANAGER"}
          /> */}
        </div>
      </Col>

      {/* <ProfileChildCard
            style={{ display: "block", flex: "2", padding: "5px" }}
          >
            <h3
              style={{
                color: "#6C6B75",
                borderLeft: "3px solid #6C6B75",
                borderRadius: "3px",
                paddingLeft: "6px",
                alignItems: "center",
                marginLeft: "3px",
                marginTop: "2px",
              }}
            >
              <b>Count</b> Per <b>Function</b>
            </h3>
            <div style={{ marginTop: "15px auto", width: 650 }}>
              <BarChart />
            </div>
          </ProfileChildCard>
          <ProfileChildCard
            style={{
              flex: "1",
              display: "block",
              padding: "5px",
            }}
          >
            <h3
              style={{
                color: "#6C6B75",
                borderLeft: "3px solid #6C6B75",
                borderRadius: "3px",
                paddingLeft: "6px",
                alignItems: "center",
                marginLeft: "3px",
                marginTop: "2px",
                marginBottom: "10px",
              }}
            >
              <b>Oboard</b> per <b>month</b>
            </h3>
            <OnBoardDomain
              // style={{
              //   marginBottom: "15px",
              //   backgroundColor: "#000",
              //   borderRadius: "5px",
              //   padding: "1.5em",
              // }}
              serviceImg={edn}
              serviceValue={97}
              serviceName={"EDN"}
            />
            <OnBoardDomain
              serviceImg={ign}
              serviceValue={7}
              serviceName={"IGN"}
              // style={{
              //   padding: "10px",
              //   paddingBottom: "15px",
              //   paddingTop: "15px",
              // }}
            />
            <OnBoardDomain
              serviceImg={system}
              serviceValue={97}
              serviceName={"SYSTEM"}
            />
            <OnBoardDomain
              serviceImg={itManager}
              serviceValue={90}
              serviceName={"IT MANAGER"}
            />
          </ProfileChildCard> */}
    </Row>
  );
};

export default GraphLine;
