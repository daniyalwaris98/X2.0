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
import { Link, useLocation } from "react-router-dom";
import LogoImg from "./Assets/logo.svg";
import dash from "./Assets/dash.svg";
import atom from "./Assets/atomvariant.svg";
import lock from "./Assets/pass.svg";
import uam from "./Assets/uam.svg";
import physicalMaping from "./Assets/physicalMaping.svg";
import ims from "./Assets/ims.svg";
import inventry from "./Assets/inventry.svg";
import monitering from "./Assets/monitering.svg";
import ipam from "./Assets/ipam.svg";
import dcm from "./Assets/dcm.svg";
import auto from "./Assets/auto.svg";
import blocks from "./Assets/blocks.svg";
import "./MyNavBarStyle.css";

import atomActive from "./Assets/atomactive.svg";
import passwordGroupActive from "./Assets/passwordgroupactive.svg";

import atomInActive from "./Assets/atominactive.svg";
import passwordGroupInctive from "./Assets/passwordgroupinactive.svg";

// import {useLocation} from "react-router-dom";

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

    // let userAllData = localStorage.getItem("user");
    // let config = localStorage.getItem("monetx_configuration");
    // setUserData(JSON.parse(userAllData));
    // setConfigData(JSON.parse(config));
    // console.log(JSON.parse(config));
  }, []);

  return (
    <div>
      <NavbarContainer
        extendNavbar={extendNavbar}
        style={{
          margin: "0 auto",
          // borderBottom: "1px solid rgba(175, 175, 175, 0.4)",
        }}
      >
        <NavbarInnerContainer style={{ textAlign: "center" }}>
          <CenterContainer style={{ textAlign: "center" }}>
            <NavbarLinkContainer
              style={
                {
                  // borderBottom: "1px solid rgba(175, 175, 175, 0.4)",
                }
              }
            >
              {configData?.atom.pages.atom.view ? (
                <NavbarLink
                  to="/atom/main"
                  mainLoc={pathname === "/atom/main"}

                  // activeStyle
                >
                  {pathname === "/atom/main" ? (
                    <img
                      src={atomActive}
                      alt=""
                      style={{
                        marginRight: "10px",
                        marginBottom: "5px",
                        width: "24px",
                        height: "24px",
                        paddingTop: "1px",
                        // filter: "red",
                      }}
                    />
                  ) : (
                    <img
                      src={atomInActive}
                      alt=""
                      style={{
                        marginRight: "10px",
                        marginBottom: "5px",
                        width: "24px",
                        height: "24px",
                        paddingTop: "1px",
                      }}
                    />
                  )}
                  Atom
                </NavbarLink>
              ) : null}
              &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              {configData?.atom.pages.password_group.view ? (
                <NavbarLink
                  to="/atom/password-group"
                  mainLoc={pathname === "/atom/password-group"}

                  //  activeStyle
                >
                  {pathname === "/atom/password-group" ? (
                    <img
                      src={passwordGroupActive}
                      alt=""
                      style={{
                        marginRight: "10px",
                        marginBottom: "5px",
                        width: "24px",
                        height: "24px",
                        paddingTop: "1px",
                        // filter: "red",
                      }}
                    />
                  ) : (
                    <img
                      src={passwordGroupInctive}
                      alt=""
                      style={{
                        marginRight: "10px",
                        marginBottom: "5px",
                        width: "24px",
                        height: "24px",
                        paddingTop: "1px",
                      }}
                    />
                  )}
                  Password Group
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
                DCCM
              </NavbarLink> */}
              <OpenLinksButton
                onClick={() => {
                  setExtendNavbar((curr) => !curr);
                }}
              >
                {extendNavbar ? <>&#10005;</> : <> &#8801;</>}
              </OpenLinksButton>
            </NavbarLinkContainer>
          </CenterContainer>

          {/* <RightContainer>
           <button
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
            <NavbarLinkExtended to="/atom/main">Atom</NavbarLinkExtended>
            <NavbarLinkExtended to="/atom/password-group">
              Password Group
            </NavbarLinkExtended>
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
