import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import first from "./assets/loc.svg";
import second from "./assets/second.svg";
import third from "./assets/third.svg";
import fourth from "./assets/fourth.svg";
import fifth from "./assets/fourth.svg";
import six from "./assets/fifth.svg";
import seven from "./assets/six.svg";
import { Row, Col, Divider } from "antd";

import { DivStyling } from "./TopCard.styled.js";
import axios, { baseUrl } from "../../../utils/axios";
import {
  TableStyling,
  StyledImportFileInput,
  StyledButton,
  OnBoardStyledButton,
  AddAtomStyledButton,
  StyledExportButton,
  StyledInput,
  Styledselect,
  InputWrapper,
  StyledSubmitButton,
  StyledModalButton,
  ColStyling,
  AddStyledButton,
  TableStyle,
  SpinLoading,
} from "../../AllStyling/All.styled.js";

const index = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [myCards, setMyCards] = useState([]);

  const ingredients = [
    { index: 3, span: 4 },
    { name: 4, span: 4 },
    { name: 5, span: 4 },
  ];

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/dashboardCards");
        console.log("dashboardCards", res);
        setMyCards(res.data);
        console.log(myCards);
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
    // <div
    //   style={{
    //     background: "#FCFCFC",
    //     padding: "10px",
    //     // flexWrap: "wrap"
    //   }}
    // >
    <SpinLoading spinning={loading} tip="Loading...">
      <div
        style={{
          // background: "#FCFCFC",

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
          // borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {myCards.map((item, index) => {
          return (
            <>
              {/* {index === 3 && (index === 4) & (index === 5) ? { span:  } : null} */}

              {/* <div style={{ display: "flex", width: "16%" }}> */}
              <DivStyling
              // borderRight={index !== 7}
              // style={{
              //   display: "flex",
              //   // flexWrap: "wrap",
              //   // justifyContent: "center",
              //   // borderRight: "1px solid #E8E8E8",
              //   paddingTop: "40px",
              //   paddingRight: "16px",
              //   marginRight: "-2px",
              //   paddingTop: "15px",
              //   float: "left",
              // }}
              >
                <Row>
                  {/* <Col xs={{ span: 24 }} md={{ span: 1 }} lg={{ span: 1 }}>
                  <img
                    src={imgFun(item.name)}
                    alt=""
                    width="50px"
                    height="50px"
                    style={{ marginRight: "5px", marginLeft: "5px" }}
                  />
                </Col> */}
                  {/* <Col xs={{ span: 24 }} md={{ span: 2 }} lg={{ span: 2 }}>
                  <div style={{ marginLeft: "20px", marginRight: "5px" }}>
                    <p
                      onClick={() => Pages(item.name)}
                      style={{
                        fontWeight: "bold",
                        color: "#9F9F9F",
                        fontSize: "10px",
                        width: "100%",
                        paddingTop: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {item.name}
                    </p>
                    <p style={{ color: "#9F9F9F", fontWeight: "bold" }}>
                      {item.value}
                    </p>
                  </div>
                </Col> */}

                  <Col xs={{ span: 6 }} md={{ span: 6 }} lg={{ span: 3 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingTop: "10px",
                        // borderRight: "1px solid #E8E8E8",
                      }}
                    >
                      <img
                        src={imgFun(item.name)}
                        alt=""
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
              {/* </div> */}
            </>
          );
        })}

        {/* <Col span={1} style={{ marginLeft: "12px" }}>
          <h3 style={{ fontWeight: "bold", color: "#9F9F9F" }}>Raza</h3>
          <p style={{ color: "#9F9F9F", fontWeight: "bold" }}>67</p>
        </Col> */}
        {/* <Divider
          type="vertical"
          style={{ height: "65px", marginLeft: "35px" }}
        /> */}
        {/* <Col
        xs={{ span: 6 }}
        md={{ span: 6 }}
        lg={{ span: 3 }}
       
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderRight: "1px solid #E8E8E8",
        }}
      >
        <img
          src={second}
          alt=""
          width="50px"
          height="50px"
          style={{ marginRight: "10px" }}
        />
        <div style={{ paddingRight: "20%" }}>
          <h3 style={{ fontWeight: "bold", color: "#9F9F9F" }}>Raza</h3>
          <p style={{ color: "#9F9F9F", fontWeight: "bold" }}>67</p>
        </div>
      </Col>
     
      <Col
        xs={{ span: 6 }}
        md={{ span: 6 }}
        lg={{ span: 3 }}
        
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderRight: "1px solid #E8E8E8",
        }}
      >
        <img
          src={third}
          alt=""
          width="50px"
          height="50px"
          style={{ marginRight: "10px" }}
        />
        <div style={{ paddingRight: "20%" }}>
          <h3 style={{ fontWeight: "bold", color: "#9F9F9F" }}>Raza</h3>
          <p style={{ color: "#9F9F9F", fontWeight: "bold" }}>67</p>
        </div>
      </Col>
     
      <ColStyling
        xs={{ span: 6 }}
        md={{ span: 6 }}
        lg={{ span: 3 }}
      
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <img
          src={fourth}
          alt=""
          width="50px"
          height="50px"
          style={{ marginRight: "10px" }}
        />
        <div style={{ paddingRight: "20%" }}>
          <h3 style={{ fontWeight: "bold", color: "#9F9F9F" }}>Raza</h3>
          <p style={{ color: "#9F9F9F", fontWeight: "bold" }}>67</p>
        </div>
      </ColStyling>
  
      <Col
        xs={{ span: 6 }}
        md={{ span: 6 }}
        lg={{ span: 3 }}
        // xl={{ span: 2 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderRight: "1px solid #E8E8E8",
        }}
      >
        <img
          src={fourth}
          alt=""
          width="50px"
          height="50px"
          style={{ marginRight: "10px" }}
        />
        <div style={{ paddingRight: "20%" }}>
          <h3 style={{ fontWeight: "bold", color: "#9F9F9F" }}>Raza</h3>
          <p style={{ color: "#9F9F9F", fontWeight: "bold" }}>67</p>
        </div>
      </Col>
  
      <Col
        xs={{ span: 6 }}
        md={{ span: 6 }}
        lg={{ span: 3 }}
        // xl={{ span: 2 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderRight: "1px solid #E8E8E8",
        }}
      >
        <img
          src={fifth}
          alt=""
          width="50px"
          height="50px"
          style={{ marginRight: "10px" }}
        />
        <div style={{ paddingRight: "20%" }}>
          <h3 style={{ fontWeight: "bold", color: "#9F9F9F" }}>Raza</h3>
          <p style={{ color: "#9F9F9F", fontWeight: "bold" }}>67</p>
        </div>
      </Col>

      <Col
        xs={{ span: 6 }}
        md={{ span: 6 }}
        lg={{ span: 3 }}
        // xl={{ span: 2 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderRight: "1px solid #E8E8E8",
        }}
      >
        <img
          src={six}
          alt=""
          width="50px"
          height="50px"
          style={{ marginRight: "10px" }}
        />
        <div style={{ paddingRight: "20%" }}>
          <h3 style={{ fontWeight: "bold", color: "#9F9F9F" }}>Raza</h3>
          <p style={{ color: "#9F9F9F", fontWeight: "bold" }}>67</p>
        </div>
      </Col>
     
      <Col
        xs={{ span: 6 }}
        md={{ span: 6 }}
        lg={{ span: 3 }}
        // xl={{ span: 2 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <img
          src={seven}
          alt=""
          width="50px"
          height="50px"
          style={{ marginRight: "10px" }}
        />
        <div style={{ paddingRight: "20%" }}>
          <h3 style={{ fontWeight: "bold", color: "#9F9F9F" }}>Raza</h3>
          <p style={{ color: "#9F9F9F", fontWeight: "bold" }}>67</p>
        </div>
      </Col> */}
      </div>
    </SpinLoading>
  );
};

export default index;
