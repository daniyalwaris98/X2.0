import React, { useState, useEffect } from "react";
import logo from "./images/logo.svg";
import light from "./images/light.svg";
import notification from "./images/notification.svg";
import setting from "./images/setting.svg";
import logout from "./images/logout.svg";
import profile from "./images/profile.svg";
import { Divider } from "antd";
import { SearchOutlined, FlagOutlined } from "@ant-design/icons";
import ReactFlagsSelect from "react-flags-select";
import { Row, Col } from "antd";
import { StyledInput } from "./FirstNavBar.styled.js";

const FirstNavBar = () => {
  const [selected, setSelected] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    Data = localStorage.getItem("user");
    setUserData(JSON.parse(Data));
  }, []);

  return (
    <div style={{ backgroundColor: "#2D2F35", display: "flex" }}>
      <div style={{ display: "flex", flex: "2" }}>
        <img
          src={logo}
          alt=""
          style={{
            padding: "3px",
            width: "150px",
            paddingBottom: "13px",
            marginLeft: "10px",
          }}
        />
        <Divider
          type="vertical"
          style={{
            backgroundColor: "#B7B4B44D",
            height: "50px",
            marginTop: "5px",
            marginLeft: "20px",
          }}
        />
        <p
          style={{
            color: "#6C6B75",
            fontSize: "22px",
            paddingTop: "7px",
            margin: "6px",
            marginLeft: "20px",
          }}
        >
          Dashboard
        </p>
      </div>
      <div style={{ display: "flex", float: "right" }}>
        <StyledInput
          placeholder="Search..."
          icons={<SearchOutlined style={{ color: "white" }} />}
        />
        <img
          src={light}
          alt=""
          width="40px"
          height="40px"
          style={{
            backgroundColor: "#839CA91A",
            padding: "10px",
            borderRadius: "50%",
            marginTop: "12px",
            marginBottom: "12px",
          }}
        />
        <img
          src={notification}
          alt=""
          width="40px"
          height="40px"
          style={{
            marginLeft: "10px",
            backgroundColor: "#839CA91A",
            padding: "10px",
            borderRadius: "50%",
            marginTop: "12px",
            marginBottom: "12px",
          }}
        />

        <div
          style={{
            marginTop: "14px",
            marginBottom: "12px",
            marginLeft: "10px",
          }}
        >
          <ReactFlagsSelect
            selected={selected}
            onSelect={(code) => setSelected(code)}
            countries={["US", "GB", "FR", "DE", "IT"]}
            customLabels={{
              US: "US",
              GB: "GB",
              FR: "FR",
              DE: "DE",
              IT: "IT",
            }}
            placeholder={<FlagOutlined />}
          />
        </div>
        <img
          src={setting}
          alt=""
          width="40px"
          height="40px"
          style={{
            marginLeft: "10px",
            backgroundColor: "#839CA91A",
            padding: "10px",
            borderRadius: "50%",
            marginTop: "12px",
            marginBottom: "12px",
          }}
        />
        <img
          src={logout}
          alt=""
          width="40px"
          height="40px"
          style={{
            marginLeft: "10px",
            backgroundColor: "#839CA91A",
            padding: "10px",

            borderRadius: "50%",
            marginTop: "12px",
            marginBottom: "12px",
          }}
        />
        <Row
          style={{
            backgroundColor: "#839CA91A",
            width: "100%",
            marginLeft: "10px",
            marginRight: "20px",
            marginTop: "10px",
            marginBottom: "12px",
            borderRadius: "10px",
          }}
        >
          <Col>
            <img
              src={profile}
              alt=""
              width="40px"
              height="40px"
              style={{
                marginLeft: "10px",
                backgroundColor: "#839CA91A",
                padding: "10px",
                borderRadius: "50%",
                marginTop: "15px",
                marginBottom: "5px",
              }}
            />
          </Col>
          <Col style={{ marginTop: "2px" }}>
            <span
              style={{
                marginLeft: "8px",
                color: "#9F9F9F",
                fontSize: "12px",
              }}
            >
              Raza Raheem
            </span>
            <br />
            <span
              style={{ marginLeft: "8px", color: "#9F9F9F", fontSize: "10px" }}
            >
              Raza Raheem
            </span>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default FirstNavBar;
