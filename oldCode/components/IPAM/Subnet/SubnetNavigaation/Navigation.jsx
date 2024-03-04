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
} from "./Navigation.styled.js";
import server from "../../assets/server.svg";
import scope from "../../assets/scope.svg";
import dns_server from "../../assets/dns_server.svg";
import dns_zones from "../../assets/dns_zone.svg";

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
        <NavbarInnerContainer style={{ textAlign: "left" }}>
          <CenterContainer style={{ textAlign: "left" }}>
            <NavbarLinkContainer>
              {configData?.ipam.pages.subnet.view ? (
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
              ) : null}
              {configData?.ipam.pages.subnet.view ? (
                <NavbarLink to="/ipam/subnet/ip-details" activeStyle>
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
                  IP Details &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}
              {configData?.ipam.pages.subnet.view ? (
                <NavbarLink to="/ipam/subnet/discovered-subnet" activeStyle>
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
                  Discovered Subnet &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}
              {configData?.ipam.pages.subnet.view ? (
                <NavbarLink to="/ipam/subnet/ip-history" activeStyle>
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
                  IP History &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}

              {/* <div class="dropdown">
                <button class="dropbtn">
                  Dropdown
                  <i class="fa fa-caret-down"></i>
                </button>
                <div class="dropdown-content">
                  <a href="#">Link 1</a>
                  <a href="#">Link 2</a>
                  <a href="#">Link 3</a>
                </div>
              </div> */}
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
              {/* <OpenLinksButton
                onClick={() => {
                  setExtendNavbar((curr) => !curr);
                }}
              >
                {extendNavbar ? <>&#10005;</> : <> &#8801;</>}
              </OpenLinksButton> */}
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
