import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import atomActive from "./Assets/atomactive.svg";
import passwordGroupActive from "./Assets/passwordgroupactive.svg";
import atomInActive from "./Assets/atominactive.svg";
import passwordGroupInctive from "./Assets/passwordgroupinactive.svg";

import "./MyNavBarStyle.css";
import {
  NavbarContainer,
  NavbarInnerContainer,
  NavbarLink,
  CenterContainer,
} from "./Navigation.styled.js";

const Navigation = () => {
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
      <NavbarContainer
        style={{
          margin: "0 auto",
        }}
      >
        <NavbarInnerContainer style={{ textAlign: "center" }}>
          <CenterContainer style={{ textAlign: "center" }}>
            {configData?.atom.pages.atom.view ? (
              <NavbarLink to="/atom/main" mainLoc={pathname === "/atom/main"}>
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
          </CenterContainer>
        </NavbarInnerContainer>
      </NavbarContainer>
    </div>
  );
};

export default Navigation;
