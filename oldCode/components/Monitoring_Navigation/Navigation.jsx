import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, Dropdown, Menu, Space } from "antd";
import {
  NavbarContainer,
  LeftContainer,
  RightContainer,
  NavbarExtendedContainer,
  NavbarInnerContainer,
  NavbarLinkContainer,
  NavbarLink,
  Logo,
  OpenLinksButton,
  NavbarLinkExtended,
  CenterContainer,
  SubNavbarLink,
  SubMenuLink,
} from "./Navigation.styled.js";
import server from "../IPAM/assets/server.svg";
import scope from "../IPAM/assets/scope.svg";
import dns_server from "../IPAM/assets/dns_server.svg";
import dns_zones from "../IPAM/assets/dns_zone.svg";
import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import LogoImg from "./Assets/logo.svg";
import dash from "./Assets/dash.svg";
import loc from "./Assets/loc.svg";
import racks from "./Assets/racks.svg";
import sfps from "./Assets/sfps.svg";
import devices from "./Assets/devices.svg";
import boards from "./Assets/boards.svg";
import subBoards from "./Assets/boards.svg";
import licensce from "./Assets/licensce.svg";
import dcm from "./Assets/dcm.svg";
import auto from "./Assets/auto.svg";
import blocks from "./Assets/blocks.svg";
import "./MyNavBarStyle.css";
import {
  AlertsIcon,
  CloudIcon,
  DashboardIcon,
  DeviceIcon,
  NetworkIcon,
  ServerIcon,
} from "../../svg/index.js";

const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: (
          <Link to="/ipam/dns/" activeStyle>
            All
          </Link>
        ),
      },
      {
        key: "2",
        label: (
          <Link to="/ipam" activeStyle>
            Devices
          </Link>
        ),
      },
      {
        key: "3",
        label: (
          <Link to="/ipam/dns/main" activeStyle>
            Interface
          </Link>
        ),
      },
    ]}
  />
);

const Navigation = () => {
  const { pathname } = useLocation();
  const [extendNavbar, setExtendNavbar] = useState(false);

  const [configData, setConfigData] = useState(null);

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      let user = localStorage.getItem("user");
      user = JSON.parse(user);

      setUserRole(user?.user_role);
      const test = user?.monetx_configuration;

      let t = eval(test);
      let config = JSON.parse(t);
      setConfigData(config);
    }
  }, []);

  return (
    <div>
      <NavbarContainer extendNavbar={extendNavbar} style={{ margin: "0 auto" }}>
        <NavbarInnerContainer style={{ textAlign: "center" }}>
          <CenterContainer style={{ textAlign: "center" }}>
            <NavbarLinkContainer>
              {configData?.monitering.pages.monitering.view ? (
                <NavbarLink
                  to="/monitoring/main"
                  mainLoc={pathname === "/monitoring/main"}
                  activeStyle
                >
                  <span className="icon">
                    <DashboardIcon />
                  </span>
                  Dashboard
                </NavbarLink>
              ) : null}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {configData?.monitering.pages.device.view ? (
                <NavbarLink
                  to="/monitoring/device"
                  mainLoc={pathname === "/monitoring/device"}
                  activeStyle
                >
                  <span className="icon">
                    <DeviceIcon />
                  </span>
                  Devices
                </NavbarLink>
              ) : null}
              &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
              {configData?.monitering.pages.network.view ? (
                <ul id="nav">
                  <li>
                    <SubMenuLink
                      to="/monitoring/network/main"
                      mainLoc={
                        pathname === "/monitoring/network/main" ||
                        pathname === "/monitoring/network/interface" ||
                        pathname === "/monitoring/network/router" ||
                        pathname === "/monitoring/network/router-interface" ||
                        pathname === "/monitoring/network/switches" ||
                        pathname ===
                          "/monitoring/network/switches-interfaces" ||
                        pathname === "/monitoring/network/printers" ||
                        pathname === "/monitoring/network/printers-interface" ||
                        pathname === "/monitoring/network/firewall" ||
                        pathname === "/monitoring/network/firewall-interface" ||
                        pathname === "/monitoring/network/wireless" ||
                        pathname === "/monitoring/network/wireless-interface"
                      }
                      activeStyle
                      className="dropbtn"
                      style={{
                        textAlign: "left",
                        zIndex: 999999999999,
                        marginTop: "12px",

                        width: "100%",
                      }}
                    >
                      <span className="icon">
                        <NetworkIcon />
                      </span>
                      Networks &nbsp;&nbsp;
                      <DownOutlined />
                      <i className="fa fa-caret-down"></i>
                    </SubMenuLink>
                    <ul>
                      <li>
                        <SubMenuLink
                          style={{ padding: "5px", listStyle: "none" }}
                          to="/monitoring/network/main"
                          mainLoc={
                            pathname === "/monitoring/network/main" ||
                            pathname === "/monitoring/network/interface"
                          }
                          activeStyle
                        >
                          All Devices &nbsp; »
                        </SubMenuLink>
                        <ul>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/network/main"
                              mainLoc={pathname === "/monitoring/network/main"}
                              activeStyle
                            >
                              Devices
                            </SubMenuLink>
                          </li>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/network/interface"
                              mainLoc={
                                pathname === "/monitoring/network/interface"
                              }
                              activeStyle
                            >
                              Interfaces
                            </SubMenuLink>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <SubMenuLink
                          style={{ padding: "5px" }}
                          to="/monitoring/network/router"
                          mainLoc={
                            pathname === "/monitoring/network/router" ||
                            pathname === "/monitoring/network/router-interface"
                          }
                          activeStyle
                        >
                          Routers &nbsp; »
                        </SubMenuLink>

                        <ul>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/network/router"
                              mainLoc={
                                pathname === "/monitoring/network/router"
                              }
                              activeStyle
                            >
                              Devices
                            </SubMenuLink>
                          </li>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/network/router-interface"
                              mainLoc={
                                pathname ===
                                "/monitoring/network/router-interface"
                              }
                              activeStyle
                            >
                              Interfaces
                            </SubMenuLink>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <SubMenuLink
                          style={{ padding: "5px" }}
                          to="/monitoring/network/switches"
                          mainLoc={
                            pathname === "/monitoring/network/switches" ||
                            pathname ===
                              "/monitoring/network/switches-interfaces"
                          }
                          activeStyle
                        >
                          Switches &nbsp; »
                        </SubMenuLink>
                        <ul>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/network/switches"
                              mainLoc={
                                pathname === "/monitoring/network/switches"
                              }
                              activeStyle
                            >
                              Devices
                            </SubMenuLink>
                          </li>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/network/switches-interfaces"
                              mainLoc={
                                pathname ===
                                "/monitoring/network/switches-interfaces"
                              }
                              activeStyle
                            >
                              Interfaces
                            </SubMenuLink>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <SubMenuLink
                          style={{ padding: "5px" }}
                          to="/monitoring/network/firewall"
                          mainLoc={
                            pathname === "/monitoring/network/firewall" ||
                            pathname ===
                              "/monitoring/network/firewall-interface"
                          }
                          activeStyle
                        >
                          Firewalls &nbsp; »
                        </SubMenuLink>

                        <ul>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/network/firewall"
                              mainLoc={
                                pathname === "/monitoring/network/firewall"
                              }
                              activeStyle
                            >
                              Devices
                            </SubMenuLink>
                          </li>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/network/firewall-interface"
                              mainLoc={
                                pathname ===
                                "/monitoring/network/firewall-interface"
                              }
                              activeStyle
                            >
                              Interfaces
                            </SubMenuLink>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <SubMenuLink
                          style={{ padding: "5px" }}
                          to="/monitoring/network/wireless"
                          mainLoc={
                            pathname === "/monitoring/network/wireless" ||
                            pathname ===
                              "/monitoring/network/wireless-interface"
                          }
                          activeStyle
                        >
                          Wireless &nbsp; »
                        </SubMenuLink>

                        <ul>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/network/wireless"
                              mainLoc={
                                pathname === "/monitoring/network/wireless"
                              }
                              activeStyle
                            >
                              Devices
                            </SubMenuLink>
                          </li>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/network/wireless-interface"
                              mainLoc={
                                pathname ===
                                "/monitoring/network/wireless-interface"
                              }
                              activeStyle
                            >
                              Interfaces
                            </SubMenuLink>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              ) : null}
              &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
              {configData?.monitering.pages.server.view ? (
                <ul id="nav">
                  <li>
                    <SubMenuLink
                      to="/monitoring/all-servers"
                      mainLoc={
                        pathname === "/monitoring/servers-windows-devices" ||
                        pathname === "/monitoring/servers-windows-interface" ||
                        pathname === "/monitoring/servers-linux-devices" ||
                        pathname === "/monitoring/servers-linux-interface" ||
                        pathname === "/monitoring/all-servers" ||
                        pathname === "/monitoring/all-servers-interface"
                      }
                      activeStyle
                      className="dropbtn"
                      style={{
                        textAlign: "left",
                        zIndex: 999999999999,
                        marginTop: "12px",

                        width: "100%",
                      }}
                    >
                      <span className="icon">
                        <ServerIcon />
                      </span>
                      Servers &nbsp;&nbsp;
                      <DownOutlined />
                      <i className="fa fa-caret-down"></i>
                    </SubMenuLink>
                    <ul>
                      <li>
                        <SubMenuLink
                          style={{ padding: "5px" }}
                          to="/monitoring/all-servers"
                          mainLoc={
                            pathname === "/monitoring/all-servers" ||
                            pathname === "/monitoring/all-servers-interface"
                          }
                          activeStyle
                        >
                          All Servers &nbsp; »
                        </SubMenuLink>
                        <ul>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/all-servers"
                              mainLoc={
                                // pathname === "/monitoring/network/main"

                                pathname === "/monitoring/all-servers"
                                // || pathname === "/monitoring/servers-windows-interface"
                              }
                              activeStyle
                            >
                              Devices
                            </SubMenuLink>
                          </li>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/all-servers-interface"
                              mainLoc={
                                pathname === "/monitoring/all-servers-interface"
                              }
                              activeStyle
                            >
                              Interfaces
                            </SubMenuLink>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <SubMenuLink
                          style={{ padding: "5px" }}
                          to="/monitoring/servers-windows-devices"
                          mainLoc={
                            pathname ===
                              "/monitoring/servers-windows-devices" ||
                            pathname === "/monitoring/servers-windows-interface"
                          }
                          activeStyle
                        >
                          Windows &nbsp; »
                        </SubMenuLink>

                        <ul>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/servers-windows-devices"
                              mainLoc={
                                pathname ===
                                "/monitoring/servers-windows-devices"
                              }
                              activeStyle
                            >
                              Devices
                            </SubMenuLink>
                          </li>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/servers-windows-interface"
                              mainLoc={
                                pathname ===
                                "/monitoring/servers-windows-interface"
                              }
                              activeStyle
                            >
                              Interfaces
                            </SubMenuLink>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <SubMenuLink
                          style={{ padding: "5px" }}
                          to="/monitoring/servers-linux-devices"
                          mainLoc={
                            pathname === "/monitoring/servers-linux-devices" ||
                            pathname === "/monitoring/servers-linux-interface"
                          }
                          activeStyle
                        >
                          Linux &nbsp; »
                        </SubMenuLink>
                        <ul>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/servers-linux-devices"
                              mainLoc={
                                pathname === "/monitoring/servers-linux-devices"
                              }
                              activeStyle
                            >
                              Devices
                            </SubMenuLink>
                          </li>
                          <li>
                            <SubMenuLink
                              style={{ padding: "5px" }}
                              to="/monitoring/servers-linux-interface"
                              mainLoc={
                                pathname ===
                                "/monitoring/servers-linux-interface"
                              }
                              activeStyle
                            >
                              Interfaces
                            </SubMenuLink>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              ) : null}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {configData?.monitering.pages.alerts.view ? (
                <NavbarLink
                  to="/monitoring/alert"
                  mainLoc={pathname === "/monitoring/alert"}
                  activeStyle
                >
                  <span className="icon">
                    <AlertsIcon />
                  </span>
                  Alerts
                </NavbarLink>
              ) : null}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {configData?.monitering.pages.cloud.view ? (
                <div class="dropdown">
                  <NavbarLink
                    to="/monitoring/cloud"
                    mainLoc={
                      pathname === "/monitoring/cloud" ||
                      pathname === "/monitoring/cloud/cloudSummary"
                    }
                    activeStyle
                    class="dropbtn"
                    style={{
                      textAlign: "left",
                      zIndex: 999999999999,
                      paddingBottom: "3px",
                    }}
                  >
                    <CloudIcon />
                    Clouds &nbsp;&nbsp;
                    <DownOutlined />
                    <i class="fa fa-caret-down"></i>
                  </NavbarLink>
                  <div
                    class="dropdown-content"
                    style={{
                      color: "black",
                      textAlign: "left",
                      zIndex: 999999999999,
                    }}
                  >
                    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                      <SubNavbarLink
                        to="/monitoring/cloud"
                        mainLoc={pathname === "/monitoring/cloud"}
                        activeStyle
                      >
                        AWS
                      </SubNavbarLink>
                    </div>
                  </div>
                </div>
              ) : null}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {configData?.monitering.pages.credentials.view ? (
                <NavbarLink
                  to="/monitoring/credentials"
                  mainLoc={pathname === "/monitoring/credentials"}
                  activeStyle
                >
                  <img
                    src={dns_zones}
                    alt=""
                    style={{
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Credentials
                </NavbarLink>
              ) : null}
              &nbsp;&nbsp;
            </NavbarLinkContainer>
          </CenterContainer>
        </NavbarInnerContainer>
        {extendNavbar && <NavbarExtendedContainer></NavbarExtendedContainer>}
      </NavbarContainer>
    </div>
  );
};

export default Navigation;
