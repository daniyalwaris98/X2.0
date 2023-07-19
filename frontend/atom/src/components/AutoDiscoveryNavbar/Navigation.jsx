import React, { useState, useEffect } from "react";
import {
  NavbarContainer,
  RightContainer,
  NavbarExtendedContainer,
  NavbarInnerContainer,
  NavbarLinkContainer,
  NavbarLink,
  OpenLinksButton,
  NavbarLinkExtended,
  CenterContainer,
} from "./Navigation.styled.js";
import { useLocation } from "react-router-dom";
import blocks from "./Assets/blocks.svg";
import "./MyNavBarStyle.css";
import discovery from "./Assets/discovery.svg";
import manageDevices from "./Assets/manage_devices.svg";
import manageCredientials from "./Assets/manage_cre.svg";
import { DiscoveryIcon, NetworkIcon } from "../../svg/index.js";

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
      <NavbarContainer
        extendNavbar={extendNavbar}
        style={{
          margin: "0 auto",
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
                  to="/auto-discovery/main"
                  mainLoc={pathname === "/auto-discovery/main"}

                  // activeStyle
                >
                  <img
                    src={discovery}
                    alt=""
                    style={{
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Dashboard &nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}
              {configData?.atom.pages.password_group.view ? (
                <NavbarLink
                  to="/auto-discovery/network"
                  mainLoc={pathname === "/auto-discovery/network"}

                  //  activeStyle
                >
                  <span className="icon">
                    <NetworkIcon />
                  </span>
                  Manage Network &nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}

              {configData?.atom.pages.atom.view ? (
                <NavbarLink
                  to="/auto-discovery/discovery"
                  mainLoc={pathname === "/auto-discovery/discovery"}

                  // activeStyle
                >
                  <span className="icon">
                    <DiscoveryIcon />
                  </span>
                  Discovery &nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}

              {configData?.atom.pages.password_group.view ? (
                <NavbarLink
                  to="/auto-discovery/manage-devices"
                  mainLoc={pathname === "/auto-discovery/manage-devices"}

                  //  activeStyle
                >
                  <img
                    src={manageDevices}
                    alt=""
                    style={{
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Manage Devices &nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}

              {configData?.atom.pages.password_group.view ? (
                <NavbarLink
                  to="/auto-discovery/manage-credentials"
                  mainLoc={pathname === "/auto-discovery/manage-credentials"}

                  //  activeStyle
                >
                  <img
                    src={manageCredientials}
                    alt=""
                    style={{
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Manage Credentials &nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}

              <OpenLinksButton
                onClick={() => {
                  setExtendNavbar((curr) => !curr);
                }}
              >
                {extendNavbar ? <>&#10005;</> : <> &#8801;</>}
              </OpenLinksButton>
            </NavbarLinkContainer>
          </CenterContainer>

          <RightContainer>
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
          </RightContainer>
        </NavbarInnerContainer>
        {extendNavbar && (
          <NavbarExtendedContainer>
            <NavbarLinkExtended to="/atom/main">Atom</NavbarLinkExtended>
            <NavbarLinkExtended to="/atom/password-group">
              Password Group
            </NavbarLinkExtended>
          </NavbarExtendedContainer>
        )}
      </NavbarContainer>
    </div>
  );
};

export default Navigation;
