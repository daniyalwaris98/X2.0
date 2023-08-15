import React, { useState } from "react";
import { StyledMenu, StyledInput } from "./FirstNavBar.styled.js";
import light from "./images/light.svg";
import notification from "./images/notification.svg";
import setting from "./images/setting.svg";
import logout from "./images/logout.svg";
import profile from "./images/profile.svg";

import { SearchOutlined, FlagOutlined } from "@ant-design/icons";
import ReactFlagsSelect from "react-flags-select";
import { Row, Col } from "antd";

const NavComp = () => {
  const [selected, setSelected] = useState("");
  return (
    <StyledMenu style={{ float: "right" }}>
      <ul style={{ listStyle: "none", display: "flex" }}>
        <li>
          <StyledInput
            placeholder="Search..."
            icons={<SearchOutlined style={{ color: "white" }} />}
          />
        </li>
        <li>
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
              marginBottom: "7px",
            }}
          />
        </li>

        <li>
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
        </li>

        <li>
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
        </li>

        <li>
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
        </li>
        <li>
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
        </li>

        <li style={{ marginRight: "15px" }}>
          <Row
            style={{
              backgroundColor: "#839CA91A",
              width: "100%",
              marginLeft: "10px",
              marginRight: "30px",
              marginTop: "10px",
              marginBottom: "5px",
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
                  marginTop: "5px",
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
                style={{
                  marginLeft: "8px",
                  color: "#9F9F9F",
                  fontSize: "10px",
                }}
              >
                Raza Raheem
              </span>
            </Col>
          </Row>
        </li>
      </ul>
    </StyledMenu>
  );
};

export default NavComp;
