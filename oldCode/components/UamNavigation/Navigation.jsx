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
} from "./Navigation.styled.js";
import loc from "./Assets/loc.svg";
import racks from "./Assets/racks.svg";
import sfps from "./Assets/sfps.svg";
import devices from "./Assets/devices.svg";
import boards from "./Assets/boards.svg";
import licensce from "./Assets/licensce.svg";
import { useLocation } from "react-router-dom";

import "./MyNavBarStyle.css";
import { ApsIcon, LifeCycleIcon } from "../../svg/index.js";

const Navigation = () => {
  const [extendNavbar, setExtendNavbar] = useState(false);
  const { pathname } = useLocation();

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
      <NavbarContainer extendNavbar={extendNavbar} style={{ margin: "0 auto" }}>
        <NavbarInnerContainer style={{ textAlign: "center" }}>
          <CenterContainer style={{ textAlign: "center" }}>
            <NavbarLinkContainer>
              {configData?.uam.pages.sites.view ? (
                <NavbarLink to="/uam/sites" mainLoc={pathname === "/uam/sites"}>
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
                  Sites &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}

              {configData?.uam.pages.racks.view ? (
                <NavbarLink to="/uam/racks" mainLoc={pathname === "/uam/racks"}>
                  <img
                    src={racks}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Racks &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}

              {configData?.uam.pages.devices.view ? (
                <NavbarLink
                  to="/uam/devices"
                  mainLoc={pathname === "/uam/devices"}
                >
                  <img
                    src={devices}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Devices &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}

              {configData?.uam.pages.modules.view ? (
                <NavbarLink
                  to="/uam/module"
                  mainLoc={pathname === "/uam/module"}
                >
                  <img
                    src={boards}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Modules &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}

              {configData?.uam.pages.sfps.view ? (
                <NavbarLink to="/uam/sfps" mainLoc={pathname === "/uam/sfps"}>
                  <img
                    src={sfps}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  SFPs &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}

              {configData?.uam.pages.license.view ? (
                <NavbarLink
                  to="/uam/license"
                  mainLoc={pathname === "/uam/license"}
                >
                  <img
                    src={licensce}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Licenses &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}
              {configData?.uam.pages.aps.view ? (
                <NavbarLink to="/uam/aps" mainLoc={pathname === "/uam/aps"}>
                  <span className="icon">
                    <ApsIcon />
                  </span>
                  {/* <img
                    src={licensce}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  /> */}
                  APs &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}
              {configData?.uam.pages.hwlifecycle.view ? (
                <NavbarLink
                  to="/uam/hardwarelifecycle"
                  mainLoc={pathname === "/uam/hardwarelifecycle"}

                  //  activeStyle
                >
                  <span className="icon">
                    <LifeCycleIcon />
                  </span>
                  {/* <img
                    src={licensce}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  /> */}
                  HW Lifecycle &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}
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
          <NavbarExtendedContainer style={{ height: "auto", zIndex: 3 }}>
            <NavbarLinkExtended
              to="/uam/sites"
              mainLoc={pathname === "/uam/sites"}
            >
              Sites
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/uam/racks"
              mainLoc={pathname === "/uam/racks"}
            >
              Racks
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/uam/racks"
              mainLoc={pathname === "/uam/devices"}
            >
              Devices
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/uam/racks"
              mainLoc={pathname === "/uam/module"}
            >
              Modules
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/uam/racks"
              mainLoc={pathname === "/uam/stackswitches"}
            >
              Stack Switches
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/uam/racks"
              mainLoc={pathname === "/uam/sfps"}
            >
              SFPs
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/uam/racks"
              mainLoc={pathname === "/uam/license"}
            >
              Licenses
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/uam/racks"
              mainLoc={pathname === "/uam/aps"}
            >
              APs
            </NavbarLinkExtended>
            <NavbarLinkExtended
              to="/uam/racks"
              mainLoc={pathname === "/uam/hardwarelifecycle"}
            >
              HW Lifecycle
            </NavbarLinkExtended>
          </NavbarExtendedContainer>
        )}
      </NavbarContainer>
    </div>
  );
};

export default Navigation;
