import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

//import passwordGroupActive from "./Assets/passwordgroupactive.svg";

//import passwordGroupInctive from "./Assets/passwordgroupinactive.svg";
import dbGreen from "./Assets/dbGreen.png"
import dbGrey from "./Assets/dbGray.png"
import pageGreen from "./Assets/pageGreen.png"
import pageGray from "./Assets/pageGray.png"
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
              <NavbarLink to="/database" mainLoc={pathname === "/database"}>
                {pathname === "/database" ? (
                  <img
                    src={dbGreen}
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
                    src={dbGrey}
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
                Database
              </NavbarLink>
            ) : null}
            &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
            {configData?.atom.pages.password_group.view ? (
              <NavbarLink
                to="/database/password-group"
                mainLoc={pathname === "/database/password-group"}
              >
                {pathname === "/database/password-group" ? (
                  <img
                    
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

&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
            {configData?.atom.pages.password_group.view ? (
              <NavbarLink
                to="/database/summary"
                mainLoc={pathname === "/database/summary"}
              >
                {pathname === "/database/summary" ? (
                  <img
                    src={pageGreen}
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
                    src={pageGray}
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
                Summary
              </NavbarLink>
            ) : null}
          </CenterContainer>
        </NavbarInnerContainer>
      </NavbarContainer>
    </div>
  );
};

export default Navigation;
