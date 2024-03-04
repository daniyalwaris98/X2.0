import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import first from "./assets/loc.svg";
import second from "./assets/second.svg";
import third from "./assets/third.svg";
import fourth from "./assets/fourth.svg";
import fifth from "./assets/fourth.svg";
import six from "./assets/fifth.svg";
import seven from "./assets/six.svg";
import { Row, Col } from "antd";

import { DivStyling } from "./TopCard.styled.js";
import axios, { baseUrl } from "../../../utils/axios";
import { SpinLoading } from "../../AllStyling/All.styled.js";

const index = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [myCards, setMyCards] = useState([]);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/dashboardCards");
        setMyCards(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const Pages = (pageName) => {
    if (pageName === "SITES") {
      navigate("/uam/sites");
    } else if (pageName === "RACKS") {
      navigate("/uam/racks");
    } else if (pageName === "DEVICES") {
      navigate("/uam/devices");
    } else if (pageName === "MODULES") {
      navigate("/uam/module");
    } else if (pageName === "SS") {
      navigate("/uam/stackswitches");
    } else if (pageName === "SFPs") {
      navigate("/uam/sfps");
    } else if (pageName === "LICENSES") {
      navigate("/uam/license");
    } else if (pageName === "APs") {
      navigate("/uam/aps");
    }
  };

  const imgFun = (myimg) => {
    if (myimg === "SITES") {
      return first;
    } else if (myimg === "RACKS") {
      return second;
    } else if (myimg === "DEVICES") {
      return third;
    } else if (myimg === "BOARDS") {
      return fourth;
    } else if (myimg === "SUB BOARDS") {
      return fourth;
    } else if (myimg === "SFPS") {
      return fifth;
    } else if (myimg === "LICENSES") {
      return six;
    } else {
      return seven;
    }
  };

  return (
    <SpinLoading spinning={loading} tip="Loading...">
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #e5e5e5",
          boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
          borderRadius: "10px",
          padding: "10px",
          margin: "5px",
          marginTop: "-10px",
          marginRight: "10px",
          marginLeft: "10px",
          paddingRight: "30px",
          paddingLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {myCards.map((item, index) => {
          return (
            <DivStyling key={index}>
              <Row>
                <Col xs={{ span: 6 }} md={{ span: 6 }} lg={{ span: 3 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "10px",
                    }}
                  >
                    <img
                      src={imgFun(item.name)}
                      width="50px"
                      height="50px"
                      style={{ marginRight: "10px" }}
                    />
                    <div style={{ paddingRight: "20%" }}>
                      <p
                        onClick={() => Pages(item.name)}
                        style={{
                          fontWeight: "bold",
                          color: "#9F9F9F",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        {item.name}
                      </p>
                      <p
                        style={{
                          color: "#6c6b75",
                          fontWeight: "700",
                          fontSize: "28px",
                          marginTop: "-15px",
                          marginBottom: "0px",
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </DivStyling>
          );
        })}
      </div>
    </SpinLoading>
  );
};

export default index;
