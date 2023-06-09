import React, { useState, useEffect } from "react";
import {
  NavbarContainer,
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
import { useLocation } from "react-router-dom";
import atom from "./Assets/atomA.svg";
import blocks from "./Assets/blocks.svg";
import "./MyNavBarStyle.css";
import { DashboardIcon } from "../../svg/index.js";

const Navigation = () => {
  const { pathname } = useLocation();
  const [extendNavbar, setExtendNavbar] = useState(false);
  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      let user = localStorage.getItem("user");
      user = JSON.parse(user);

      const test = user?.monetx_configuration;

      let t = eval(test);
      let config = JSON.parse(t);
      setConfigData(config);
    }
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
            <NavbarLinkContainer>
              {configData?.ncm.pages.dashboard.view ? (
                <NavbarLink to="/ncm/main" mainLoc={pathname === "/ncm/main"}>
                  <span className="icon">
                    <DashboardIcon />
                  </span>
                  Dashboard
                </NavbarLink>
              ) : null}
              {configData?.ncm.pages.config_data.view ? (
                <NavbarLink
                  to="/ncm/config-data"
                  mainLoc={pathname === "/ncm/config-data"}
                >
                  <img
                    src={atom}
                    alt=""
                    style={{
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Config Data
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
            <NavbarLinkExtended to="/ncm/main">Dashboard</NavbarLinkExtended>

            <NavbarLinkExtended to="/ncm/config-management">
              Config Management
            </NavbarLinkExtended>
          </NavbarExtendedContainer>
        )}
      </NavbarContainer>
    </div>
  );
};

export default Navigation;
