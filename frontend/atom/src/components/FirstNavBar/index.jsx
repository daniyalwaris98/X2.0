import React, { useState, useEffect } from "react";
import logo from "./images/logo.svg";
import light from "./images/light.svg";
import notification from "./images/notification.svg";
import setting from "./images/setting.svg";
import logout from "./images/logout.svg";
import profile from "./images/profile.svg";
import { Divider, Input } from "antd";
import { SearchOutlined, FlagOutlined } from "@ant-design/icons";
// import ReactLanguageSelect from "react-languages-select";
import ReactFlagsSelect from "react-flags-select";
// import { US, GB } from "country-flag-icons/react/3x2";
import { Row, Col } from "antd";
import { StyledInput, MainStyling } from "./FirstNavBar.styled.js";

//import css module
// import "react-languages-select/css/react-languages-select.css";

const FirstNavBar = () => {
  const [selected, setSelected] = useState("");
  console.log(selected);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    Data = localStorage.getItem("user");
    setUserData(JSON.parse(Data));
    console.log("username");
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
          // style={{
          //   margin: "8px",
          //   backgroundColor: "#353639",
          //   border: "none",
          //   borderRadius: "5px",
          //   paddingLeft: "10px",
          //   color: "#fff",
          // }}
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
        {/* <ReactLanguageSelect
          style={{
            height: "20px",
            marginLeft: "10px",
            backgroundColor: "#839CA91A",
            padding: "10px",
            borderRadius: "50%",
          }}
          //   defaultLanguage="en"
          //   languages={["en", "fr", "de", "it", "es"]}
          //   placeholder={<SearchOutlined />}
          //   alignOptions="left"
          //   customLabels={{
          //     en: <SearchOutlined />,
          //     fr: "FR",
          //     de: "DE",
          //     it: "IT",
          //   }}
          searchable={true}
          searchPlaceholder="Search for a language"
        >
          hello
        </ReactLanguageSelect> */}
        <div
          style={{
            // backgroundColor: "#839CA91A",
            // padding: "10px",
            // borderRadius: "50%",
            marginTop: "14px",
            marginBottom: "12px",
            marginLeft: "10px",
            // width: "40px",
            // height: "40px",
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
