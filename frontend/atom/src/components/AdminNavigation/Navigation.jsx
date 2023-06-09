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
    console.log(userData.user_role);
    let t = eval(test);
    let config = JSON.parse(t);
    setConfigData(config);

    // let config = localStorage.getItem("monetx_configuration");
    // setConfigData(JSON.parse(config));
    // // console.log(JSON.parse(config));
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
              {/* {configData?.admin.pages.failed_devices.view ? (
                <NavbarLink
                  to="/admin/enduser"
                  mainLoc={pathname === "/admin/enduser"}

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
                  End User &nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarLink>
              ) : null} */}
            </NavbarLinkContainer>
          </CenterContainer>
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
