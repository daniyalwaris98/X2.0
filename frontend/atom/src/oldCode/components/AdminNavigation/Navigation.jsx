import React, { useState, useEffect } from "react";
import {
  NavbarContainer,
  NavbarInnerContainer,
  NavbarLinkContainer,
  NavbarLink,
  CenterContainer,
} from "./Navigation.styled.js";

import profile from "./assets/profile.svg";
import role from "./assets/role.svg";
import failed from "./assets/failed.svg";
import "./MyNavBarStyle.css";
import { useLocation } from "react-router-dom";

const Navigation = () => {
  const { pathname } = useLocation();
  const [extendNavbar, setExtendNavbar] = useState(false);
  const [configData, setConfigData] = useState(null);
  let userData;

  useEffect(() => {
    let user = localStorage.getItem("user");
    userData = JSON.parse(user);
    const test = userData.monetx_configuration;
    let t = eval(test);
    let config = JSON.parse(t);
    setConfigData(config);
  }, []);
  return (
    <div>
      <NavbarContainer extendNavbar={extendNavbar} style={{ margin: "0 auto" }}>
        <NavbarInnerContainer style={{ textAlign: "center" }}>
          <CenterContainer style={{ textAlign: "center" }}>
            <NavbarLinkContainer>
              {configData?.admin.pages.show_member.view ? (
                <NavbarLink
                  to="/admin/show-member"
                  mainLoc={pathname === "/admin/show-member"}

                  //  activeStyle
                >
                  <img
                    src={profile}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Show Member &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}
              {configData?.admin.pages.role.view ? (
                <NavbarLink
                  to="/admin/role"
                  mainLoc={pathname === "/admin/role"}

                  //  activeStyle
                >
                  <img
                    src={role}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Role &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}

              {configData?.admin.pages.failed_devices.view ? (
                <NavbarLink
                  to="/admin/failed-devices"
                  mainLoc={pathname === "/admin/failed-devices"}

                  // activeStyle
                >
                  <img
                    src={failed}
                    alt=""
                    style={{
                      marginRight: "10px",
                      marginBottom: "5px",
                      width: "20px",
                      height: "20px",
                      paddingTop: "4px",
                    }}
                  />
                  Failed Devices &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null}
            </NavbarLinkContainer>
          </CenterContainer>
        </NavbarInnerContainer>
      </NavbarContainer>
    </div>
  );
};

export default Navigation;
