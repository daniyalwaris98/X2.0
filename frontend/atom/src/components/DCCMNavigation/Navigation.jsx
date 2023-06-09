import React, { useState, useEffect } from "react";
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
} from "./Navigation.styled.js";

import devices_subnet from "./Assets/device_subnet.svg";
import device from "./Assets/device.svg";
import ipam_dashboard from "./Assets/ipam_dashboard.svg";
import subnet from "./Assets/subnet.svg";

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
import { useLocation } from "react-router-dom";

const Navigation = () => {
  const { pathname } = useLocation();

  const [extendNavbar, setExtendNavbar] = useState(false);

  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
    console.log(JSON.parse(config));
  }, []);

  return (
    <div>
      <NavbarContainer extendNavbar={extendNavbar} style={{ margin: "0 auto" }}>
        <NavbarInnerContainer style={{ textAlign: "center" }}>
          <CenterContainer style={{ textAlign: "center" }}>
            <NavbarLinkContainer>
              {configData?.ipam.pages.ipam.view ? (
                <NavbarLink
                  to="/dccm/main"
                  mainLoc={pathname === "/dccm/main"}
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
              {/* {configData?.ipam.pages.ipam.view ? (
                <NavbarLink to="/ipam/dashboard" activeStyle>
                  <img
                    src={loc}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Dashboard &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null} */}
              {/* {configData?.ipam.pages.dhcp_servers.view ? (
                <NavbarLink to="/ipam/dhcp_servers" activeStyle>
                  <img
                    src={server}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  DHCP Servers &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null} */}
              {/* {configData?.ipam.pages.dhcp_scope.view ? (
                <NavbarLink to="/ipam/dhcp_scope" activeStyle>
                  <img
                    src={scope}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  DHCP Scopes &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null} */}
              {/* {configData?.ipam.pages.dns_servers.view ? (
                <NavbarLink to="/ipam/dns_servers" activeStyle>
                  <img
                    src={dns_server}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  DNS Servers &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null} */}
              {/* {configData?.ipam.pages.dns_zones.view ? (
                <NavbarLink to="/ipam/dns_zones" activeStyle>
                  <img
                    src={dns_zones}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  DNS Zones &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null} */}
              {configData?.ipam.pages.devices.view ? (
                <NavbarLink
                  to="/dccm/devices"
                  mainLoc={pathname === "/dccm/devices"}
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
              {/* {configData?.ipam.pages.subnet.view ? (
                <NavbarLink to="/ipam/subnet/main" activeStyle>
                  <img
                    src={dns_zones}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Subnet &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null} */}
              {/* <NavbarLink to="/password-group" activeStyle>
                <img
                  src={dash}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                    paddingTop: "4px",
                    
                  }}
                />
                Password Group
              </NavbarLink> */}
              {/* <NavbarLink to="/physical-mapping" activeStyle>
                <img
                  src={physicalMaping}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                Physical Mapping
              </NavbarLink>
              <NavbarLink to="/ims" activeStyle>
                <img
                  src={ims}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                    // fill: "#000",
                  }}
                />
                IMS
              </NavbarLink>
              <NavbarLink to="/inventry" activeStyle>
                <img
                  src={inventry}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                Inventry
              </NavbarLink>
              <NavbarLink to="/monitering" activeStyle>
                <img
                  src={monitering}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                Monitering
              </NavbarLink>

              <NavbarLink to="/auto-discovery" activeStyle>
                <img
                  src={auto}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                Auto Discovery
              </NavbarLink>
              <NavbarLink to="/ipam" activeStyle>
                <img
                  src={ipam}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                IPAM
              </NavbarLink>
              <NavbarLink to="/dcm" activeStyle>
                <img
                  src={dcm}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                DCM
              </NavbarLink> */}
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
          {/* <RightContainer> */}
          {/* <Logo src={LogoImg} style={{ width: "150px" }}></Logo> */}
          {/* <button
              style={{
                display: "none",
                width: "150px",
                background:
                  "linear-gradient(270deg, #3C9E35 0%, #6FB525 108.27%)",
                borderRadius: "5px",

                outline: "none",
                overflow: "none",
                border: "0px",
                margin: "5px",
                lineHeight: "50px",
                fontSize: "16px",
                color: "white",
                cursor: "pointer",
              }}
            >
              <img
                src={blocks}
                alt=""
                style={{ margin: "auto", paddingBottom: "5px" }}
              />{" "}
              Add Widgets
            </button>
          </RightContainer> */}
        </NavbarInnerContainer>
        {extendNavbar && (
          <NavbarExtendedContainer style={{ zIndex: "999" }}>
            {/* <NavbarLinkExtended to="/uam/sites">Sites</NavbarLinkExtended>
            <NavbarLinkExtended to="/uam/racks">Racks</NavbarLinkExtended> */}
            {/* <NavbarLinkExtended to="/atom/password-group">
              Password Group
            </NavbarLinkExtended> */}

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
