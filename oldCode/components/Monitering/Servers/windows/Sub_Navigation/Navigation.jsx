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

import dns_zones from "../../../../IPAM/assets/dns_zone.svg";

import loc from "./Assets/loc.svg";

import "./MyNavBarStyle.css";

const Navigation = () => {
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
                  to="/monitoring/servers-windows-devices"
                  activeStyle
                >
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
                  Devices
                </NavbarLink>
              ) : null}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {configData?.ipam.pages.devices.view ? (
                <NavbarLink
                  to="/monitoring/servers-windows-interface"
                  activeStyle
                >
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
                  Interfaces
                </NavbarLink>
              ) : null}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {/* <div class="dropdown">
                <NavbarLink
                  to="/monitoring/network/main"
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
                    src={loc}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />{" "}
                  Network &nbsp;&nbsp;
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
                    <SubNavbarLink to="/monitoring/network/main" activeStyle>
                      Network
                    </SubNavbarLink>
                  </div>

                  <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <SubNavbarLink to="/monitoring/network/router" activeStyle>
                      Router
                    </SubNavbarLink>
                  </div>
                  <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <SubNavbarLink
                      to="/monitoring/network/switches"
                      activeStyle
                    >
                      Switches
                    </SubNavbarLink>
                  </div>
                  <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <SubNavbarLink
                      to="/monitoring/network/printers"
                      activeStyle
                    >
                      Printers
                    </SubNavbarLink>
                  </div>
                  <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <SubNavbarLink
                      to="/monitoring/network/firewall"
                      activeStyle
                    >
                      Firewall
                    </SubNavbarLink>
                  </div>
                  <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <SubNavbarLink
                      to="/monitoring/network/wireless"
                      activeStyle
                    >
                      Wireless
                    </SubNavbarLink>
                  </div>
                </div>
              </div> */}
            </NavbarLinkContainer>
          </CenterContainer>
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
          <NavbarExtendedContainer>
            {/* <NavbarLinkExtended to="/uam/sites">Sites</NavbarLinkExtended>
            <NavbarLinkExtended to="/uam/racks">Racks</NavbarLinkExtended> */}
            {/* <NavbarLinkExtended to="/atom/password-group">
              Password Group
            </NavbarLinkExtended> */}

            {/* <NavbarLinkExtended to="/physical-mapping">
              Physical Mapping
            </NavbarLinkExtended>
            <NavbarLinkExtended to="/ims"> IMS</NavbarLinkExtended>
            <NavbarLinkExtended to="/inventry"> Inventry</NavbarLinkExtended>
            <NavbarLinkExtended to="/monitering">Monitering</NavbarLinkExtended>
            <NavbarLinkExtended to="/auto-discovery">
              Auto Discovery
            </NavbarLinkExtended>
            <NavbarLinkExtended to="/ipam">IPAM</NavbarLinkExtended>
            <NavbarLinkExtended to="/dcm">DCM</NavbarLinkExtended> */}
          </NavbarExtendedContainer>
        )}
      </NavbarContainer>
    </div>
  );
};

export default Navigation;
