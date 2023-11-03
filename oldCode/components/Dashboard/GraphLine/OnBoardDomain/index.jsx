import React, { useState, useEffect } from "react";
// import edn from "../assets/edn.svg";
import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Row, Col } from "antd";
import axios, { baseUrl } from "../../../../utils/axios";
import en from "../assets/edn.svg";
import edn from "../assets/edn.svg";
import igw from "../assets/ign.svg";
import system from "../assets/system.svg";

const OnBoardDomain = (props) => {
  const [loading, setLoading] = useState(false);
  const [myFunction, setMyFunction] = useState([]);

  const myImgFun = (myImg) => {
    if (myImg === "EDN") {
      return edn;
    } else if (myImg === "IGW") {
      return igw;
    } else {
      return system;
    }
  };

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/onboardedPerDomain");
        console.log("unction", res.data);
        setMyFunction(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);
  console.log(myFunction);

  return (
    <div style={{ height: "290px" }}>
      {myFunction.map((item, index) => {
        return (
          <>
            <Row
              style={{
                marginTop: "21px",
                marginBottom: "15px",
              }}
            >
              <Col
                xs={{ span: 6 }}
                md={{ span: 6 }}
                lg={{ span: 6 }}
                // xl={{ span: 2 }}
              >
                <div
                  style={{
                    // display: "flex",
                    justifyContent: "space-between",
                    margin: "2px",
                    borderRadius: "12px",
                    marginLeft: "10px",
                    backgroundColor: "#fcfcfc",
                  }}
                >
                  <img
                    src={myImgFun(item.name)}
                    alt=""
                    style={{ padding: "12px" }}
                  />
                </div>
              </Col>
              <Col
                xs={{ span: 11 }}
                md={{ span: 11 }}
                lg={{ span: 11 }}
                // xl={{ span: 2 }}
              >
                <div
                  style={{
                    alignItems: "center",
                    position: "relative",
                    justifyContent: "space-between",
                    margin: "2px",
                    borderRadius: "12px",
                    backgroundColor: "#fcfcfc",
                  }}
                >
                  <p
                    style={{
                      margin: "0",
                      // position: "absolute",
                      paddingTop: "6%",
                      // transform: "translateY(-50%)",
                      marginLeft: "10px",
                      color: "#9F9F9F",
                      fontWeight: "bold",
                    }}
                  >
                    {item.name}
                  </p>
                </div>
              </Col>
              <Col
                xs={{ span: 7 }}
                md={{ span: 7 }}
                lg={{ span: 7 }}
                // xl={{ span: 2 }}
              >
                <div
                  style={{
                    alignItems: "center",
                    position: "relative",

                    // display: "flex",
                    justifyContent: "space-between",
                    margin: "2px",
                    borderRadius: "12px",
                    backgroundColor: "#fcfcfc",
                  }}
                >
                  <h2
                    style={{
                      margin: "0",
                      // position: "absolute",
                      // top: "50%",
                      // transform: "translateY(-50%)",
                      // marginLeft: "160px",
                      paddingTop: "5%",
                      marginLeft: "20px",
                      color: "#676565",
                      fontWeight: "bold",
                    }}
                  >
                    {item.value}
                  </h2>
                </div>
              </Col>
            </Row>
          </>
        );
      })}
    </div>
  );
};

export default OnBoardDomain;
