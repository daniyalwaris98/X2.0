import React, { useState, useEffect } from "react";
import {
  NavbarContainer,
  NavbarExtendedContainer,
  NavbarInnerContainer,
  NavbarLinkContainer,
  NavbarLink,
  OpenLinksButton,
  NavbarLinkExtended,
  CenterContainer,
  SubNavbarLink,
} from "./Navigation.styled.js";

import devices_subnet from "./Assets/device_subnet.svg";
import device from "./Assets/device.svg";
import ipam_dashboard from "./Assets/ipam_dashboard.svg";
import subnet from "./Assets/subnet.svg";

import { DownOutlined } from "@ant-design/icons";
import "./MyNavBarStyle.css";
import { useLocation } from "react-router-dom";
import { IpIcon, DnsIcon } from "../../svg/index.js";

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
              {configData?.ipam.view ? (
                <NavbarLink
                  to="/ipam/main"
                  mainLoc={pathname === "/ipam/main"}
                  activeStyle
                >
                  <img
                    src={ipam_dashboard}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Dashboard
                </NavbarLink>
              ) : null}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {configData?.ipam.pages.devices.view ? (
                <NavbarLink
                  to="/ipam/devices"
                  mainLoc={pathname === "/ipam/devices"}
                  activeStyle
                >
                  <img
                    src={device}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Devices
                </NavbarLink>
              ) : null}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {configData?.ipam.pages.devices_subnet.view ? (
                <NavbarLink
                  to="/ipam/Device-Subnet"
                  mainLoc={pathname === "/ipam/Device-Subnet"}
                  activeStyle
                >
                  <img
                    src={devices_subnet}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Device/Subnet
                </NavbarLink>
              ) : null}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {configData?.ipam.pages.subnet.view ? (
                <>
                  <div class="dropdown">
                    <NavbarLink
                      to="/ipam/subnet/main"
                      mainLoc={
                        pathname === "/ipam/subnet/main" ||
                        pathname === "/ipam/subnet/ip-details" ||
                        pathname === "/ipam/subnet/discovered-subnet" ||
                        pathname === "/ipam/subnet/ip-history"
                      }
                      activeStyle
                      class="dropbtn"
                      style={{
                        // color: "#878787",
                        textAlign: "left",
                        zIndex: 999999999999,
                        paddingBottom: "3px",
                      }}
                    >
                      <img
                        src={subnet}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "20px",
                          height: "20px",
                          paddingTop: "4px",
                        }}
                      />{" "}
                      Subnets &nbsp;&nbsp;
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
                          to="/ipam/subnet/main"
                          mainLoc={pathname === "/ipam/subnet/main"}
                          activeStyle
                        >
                          Subnet
                        </SubNavbarLink>
                      </div>
                      {/* <a href="#">Link 1</a> */}
                      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                        <SubNavbarLink
                          to="/ipam/subnet/ip-details"
                          mainLoc={pathname === "/ipam/subnet/ip-details"}
                          activeStyle
                        >
                          IP Details
                        </SubNavbarLink>
                      </div>
                      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                        <SubNavbarLink
                          to="/ipam/subnet/discovered-subnet"
                          mainLoc={
                            pathname === "/ipam/subnet/discovered-subnet"
                          }
                          activeStyle
                        >
                          Discovered Subnet
                        </SubNavbarLink>
                      </div>
                      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                        <SubNavbarLink
                          to="/ipam/subnet/ip-history"
                          mainLoc={pathname === "/ipam/subnet/ip-history"}
                          activeStyle
                        >
                          IP History
                        </SubNavbarLink>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              &nbsp;&nbsp;&nbsp;
              {configData?.ipam.pages.dns_server.view ? (
                <div class="dropdown">
                  <NavbarLink
                    to="/ipam/dns/main"
                    mainLoc={
                      pathname === "/ipam/dns/main" ||
                      pathname === "/ipam/dns/zones" ||
                      pathname === "/ipam/dns/records"
                    }
                    activeStyle
                    class="dropbtn"
                    style={{
                      textAlign: "left",
                      zIndex: 999999999999,
                      paddingBottom: "3px",
                    }}
                  >
                    <span className="nav-icon">
                      <DnsIcon />
                    </span>
                    DNS Servers &nbsp;&nbsp;
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
                        to="/ipam/dns/main"
                        mainLoc={pathname === "/ipam/dns/main"}
                        activeStyle
                      >
                        DNS Server
                      </SubNavbarLink>
                    </div>
                    {/* <a href="#">Link 1</a> */}
                    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                      <SubNavbarLink
                        to="/ipam/dns/zones"
                        mainLoc={pathname === "/ipam/dns/zones"}
                        activeStyle
                      >
                        DNS Zones
                      </SubNavbarLink>
                    </div>
                    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                      <SubNavbarLink
                        to="/ipam/dns/records"
                        mainLoc={pathname === "/ipam/dns/records"}
                        activeStyle
                      >
                        DNS Records
                      </SubNavbarLink>
                    </div>
                  </div>
                </div>
              ) : null}
              {configData?.ipam.pages.vpi.view ? (
                <div class="dropdown">
                  <NavbarLink
                    to="/ipam/vip/main"
                    mainLoc={
                      pathname === "/ipam/vip/main" ||
                      pathname === "/ipam/vip/firewall"
                    }
                    activeStyle
                    class="dropbtn"
                    style={{
                      textAlign: "left",
                      zIndex: 999999999999,
                      paddingBottom: "3px",
                    }}
                  >
                    <span className="nav-icon">
                      <IpIcon />
                    </span>
                    VIP &nbsp;&nbsp;
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
                        to="/ipam/vip/main"
                        mainLoc={pathname === "/ipam/vip/main"}
                        activeStyle
                      >
                        Load Balancer
                      </SubNavbarLink>
                    </div>
                    {/* <a href="#">Link 1</a> */}
                    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                      <SubNavbarLink
                        to="/ipam/vip/firewall"
                        mainLoc={pathname === "/ipam/vip/firewall"}
                        activeStyle
                      >
                        Firewall
                      </SubNavbarLink>
                    </div>
                  </div>
                </div>
              ) : null}
              &nbsp;&nbsp;&nbsp;
            </NavbarLinkContainer>
          </CenterContainer>
          <OpenLinksButton
            style={{ float: "left", marginTop: "-26px" }}
            onClick={() => {
              setExtendNavbar((curr) => !curr);
            }}
          >
            {extendNavbar ? (
              <p style={{ marginTop: "7px" }}>&#215;</p>
            ) : (
              <> &#8801;</>
            )}
          </OpenLinksButton>
        </NavbarInnerContainer>
        {extendNavbar && (
          <NavbarExtendedContainer style={{ zIndex: "999" }}>
            <NavbarLinkExtended
              to="/ipam/main"
              mainLoc={pathname === "/ipam/main"}
            >
              Dashboard
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/ipam/devices"
              mainLoc={pathname === "/ipam/devices"}
            >
              Devices
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/ipam/Device-Subnet"
              mainLoc={pathname === "/ipam/Device-Subnet"}
            >
              Device Subnet
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/ipam/subnet/main"
              mainLoc={pathname === "/ipam/subnet/main"}
            >
              {" "}
              Subnet
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/ipam/subnet/ip-details"
              mainLoc={pathname === "/ipam/subnet/ip-details"}
            >
              IP Details
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/ipam/subnet/discovered-subnet"
              mainLoc={pathname === "/ipam/subnet/discovered-subnet"}
            >
              Discovered Subnet
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/ipam/subnet/ip-history"
              mainLoc={pathname === "/ipam/subnet/ip-history"}
            >
              IP History
            </NavbarLinkExtended>

            <NavbarLinkExtended
              to="/ipam/dns/main"
              mainLoc={pathname === "/ipam/dns/main"}
            >
              DNS Server
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/ipam/dns/zones"
              mainLoc={pathname === "/ipam/dns/zones"}
            >
              DNS Zones
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/ipam/dns/records"
              mainLoc={pathname === "/ipam/dns/records"}
            >
              DNS Records
            </NavbarLinkExtended>
          </NavbarExtendedContainer>
        )}
      </NavbarContainer>
    </div>
  );
};

export default Navigation;
