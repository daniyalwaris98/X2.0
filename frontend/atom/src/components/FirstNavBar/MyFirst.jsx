import React, { useState, useEffect } from "react";
import logo from "./images/logo.svg";
import notification from "./images/notification.svg";
import setting from "./images/setting.svg";
import logout from "./images/logout.svg";
import { useLocation } from "react-router-dom";
import axios, { baseUrl } from "../../utils/axios";

import profile from "./images/profile.svg";
import { Input, Dropdown, Menu, Drawer } from "antd";
import { SearchOutlined, FlagOutlined } from "@ant-design/icons";
import ReactFlagsSelect from "react-flags-select";
import { Row, Col } from "antd";
import { StyledMenu, MainStyling } from "./FirstNavBar.styled.js";
import { useNavigate } from "react-router-dom";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import styled from "styled-components";

const FirstNavBar = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState("");
  const [showMenu, setShowMenu] = useState(true);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const Data = localStorage.getItem("user");
    setUserData(JSON.parse(Data));

    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  }, []);

  const SelectedLanguage = (code) => {
    props.i18n.changeLanguage(code);

    setSelected(code);
    localStorage.setItem("lang", code);
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setSelected(localStorage.getItem("lang"));
  }, [selected]);

  const Logout = () => {
    localStorage.removeItem("monetx_token");
    localStorage.removeItem("user");
    localStorage.removeItem("monetx_configuration");
    window.location.href = "/login";
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Row
          style={{
            width: "100%",
            marginRight: "30px",
            marginTop: "5px",
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
                padding: "10px",
                borderRadius: "50%",
                marginTop: "3px",
              }}
            />
          </Col>
          <Col style={{ marginTop: "2px" }}>
            <p
              style={{
                marginLeft: "8px",
                color: "#9F9F9F",
                fontSize: "12px",
                marginTop: "2px",
              }}
            >
              {userData?.user_name}
            </p>

            <p
              style={{
                marginLeft: "8px",
                color: "#9F9F9F",
                fontSize: "10px",
                marginTop: "-8px",
              }}
            >
              {userData?.user_role}
            </p>
          </Col>
        </Row>
      </Menu.Item>
      <Menu.Item>
        <p onClick={showDrawer}>License Information</p>
      </Menu.Item>
      <Menu.Item>
        <p onClick={() => navigate("/end-user")}>End-User</p>
      </Menu.Item>
      <Menu.Item>
        <p onClick={Logout}>Logout</p>
      </Menu.Item>
    </Menu>
  );
  const [DaysLeft, setDaysLeft] = useState("");
  const data = localStorage.getItem("user");

  useEffect(() => {
    if (data) {
      const licenseData = async () => {
        const a = JSON.parse(data);
        const res = await axios.post(baseUrl + "/licenseVerification", {
          username: a.user_name,
        });

        setDaysLeft(res.data.day_left);
      };
      licenseData();
    }
  }, [data]);
  return (
    <div>
      <div
        style={{ backgroundColor: "#2D2F35", display: "flex", height: "50px" }}
      >
        <div style={{ display: "flex", flex: "2" }}>
          <img
            src={logo}
            alt=""
            style={{
              padding: "2px",
              width: "130px",

              paddingBottom: "5px",
              marginLeft: "32px",
            }}
          />
        </div>
        {showMenu ? (
          <StyledMenu>
            <MenuOutlined
              style={{ color: "#fff", fontSize: "24px" }}
              onClick={() => setShowMenu(!showMenu)}
            />
          </StyledMenu>
        ) : (
          <StyledMenu>
            <CloseOutlined
              style={{ color: "#fff", fontSize: "24px" }}
              onClick={() => setShowMenu(!showMenu)}
            />
          </StyledMenu>
        )}

        {showMenu === true ? (
          <MainStyling style={{ float: "right" }}>
            <ul style={{ listStyle: "none", display: "flex" }}>
              <li>
                <StyledInput
                  style={{ marginTop: "23px", display: "none" }}
                  placeholder="Search..."
                  icons={<SearchOutlined style={{ color: "white" }} />}
                />
              </li>
              <li></li>
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
                    display: "none",
                    marginTop: "17px",
                    marginBottom: "12px",
                  }}
                />
              </li>
              <li>
                <div
                  style={{
                    display: "none",
                    marginTop: "23px",
                    marginBottom: "12px",
                    marginLeft: "10px",
                  }}
                >
                  <ReactFlagsSelect
                    selected={selected}
                    defaultCountry="DE"
                    onSelect={(code) => SelectedLanguage(code)}
                    countries={["US", "DE"]}
                    customLabels={{
                      US: "en",

                      DE: "de",
                    }}
                    placeholder={<FlagOutlined />}
                  />
                </div>
              </li>
              <li>
                <Dropdown
                  overlay={menu}
                  style={{ width: "50px", height: "50px", cursor: "pointer" }}
                >
                  <img
                    src={setting}
                    width="40px"
                    height="40px"
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "#839CA91A",
                      padding: "10px",
                      borderRadius: "50%",
                      marginTop: "5px",
                      cursor: "pointer",
                    }}
                  />
                </Dropdown>
              </li>
              <li>
                <img
                  title="Logout"
                  src={logout}
                  onClick={Logout}
                  alt=""
                  width="40px"
                  height="40px"
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#839CA91A",
                    padding: "10px",
                    paddingLeft: "14px",
                    paddingRight: "12px",
                    cursor: "pointer",
                    borderRadius: "50%",
                    marginTop: "5px",
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
                    marginTop: "5px",
                    height: "40px",
                    borderRadius: "10px",
                  }}
                >
                  <Col>
                    <img
                      src={profile}
                      alt=""
                      width="35px"
                      height="35px"
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "#839CA91A",
                        padding: "10px",
                        borderRadius: "50%",
                        marginTop: "2px",
                      }}
                    />
                  </Col>
                  <Col style={{ marginTop: "0px" }}>
                    <p
                      style={{
                        marginLeft: "8px",
                        color: "#9F9F9F",
                        fontSize: "12px",
                        marginTop: "2px",
                      }}
                    >
                      {userData?.user_name}
                    </p>

                    <p
                      style={{
                        marginLeft: "8px",
                        color: "#9F9F9F",
                        fontSize: "10px",
                        marginTop: "-10px",
                      }}
                    >
                      {userData?.user_role}
                    </p>
                  </Col>
                </Row>
              </li>
            </ul>
          </MainStyling>
        ) : null}
      </div>
      <Drawer
        title="License Information"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div>
          <br />
          <p>Remaining Days</p>
          <div
            style={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <h2
              style={{
                color: "#6ab344",
                textAlign: "center",
                fontSize: "56px",
                fontWeight: 700,
              }}
            >
              {DaysLeft}
            </h2>
            <p style={{ marginTop: "45px" }}>Days Left</p>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
const StyledInput = styled(Input)`
  height: 2.2rem;
  margin-left: 8px;
  border-radius: 12px;
  border: 1px solid #6ab344 !important;
  box-shadow: none !important;
  overflow: hidden;
  width: 100%;
  &:focus {
    border: 1px solid #6ab344 !important;
  }
`;

export default FirstNavBar;
