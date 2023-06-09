import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

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
} from "./Navigation.styled.js";
import { SvgStyling } from "../AllStyling/All.styled.js";
import { Link, NavLink } from "react-router-dom";
import LogoImg from "./Assets/logo.svg";
import dash from "./Assets/dash.svg";
import active_dashboard from "./Assets/active_dashboard.svg";
import atom from "./Assets/atom.svg";
import active_atom from "./Assets/active_atom.svg";
import uam from "./Assets/uam.svg";
import active_uam from "./Assets/active_uam.svg";
// import ipam from './Assets/ipam.svg';
import monitering from "./Assets/monitering.svg";
import active_monitoring from "./Assets/active_monitoring.svg";
import dcm from "./Assets/dcm.svg";
import active_dcm from "./Assets/active_dcm.svg";
import greenAdmin from "./Assets/green_admin.svg";
import greyAdmin from "./Assets/greey_admin.svg";
import admin from "./Assets/admin.svg";
import network_map from "./Assets/network_map.svg";
import physicalMaping from "./Assets/physicalMaping.svg";
import ims from "./Assets/ims.svg";
import inventry from "./Assets/inventry.svg";
// import monitering from './Assets/monitering.svg';
import ipam from "./Assets/ipam.svg";
import active_ipam from "./Assets/active_ipam.svg";

import atomMenu from "./Assets/atomMenu.svg";
import active_atomMenu from "./Assets/activeAtomMenu.svg";
import monitoringMenu from "./Assets/monitoringMenu.svg";
import active_monitoringMenu from "./Assets/activeMonitoringMenu.svg";
import auto_discovery_menu from "./Assets/auto_discovery_menu.svg";
import active_auto_discovery_menu from "./Assets/active_auto_discovery_menu.svg";

// import dcm from './Assets/dcm.svg';
import auto from "./Assets/auto.svg";
import blocks from "./Assets/blocks.svg";
import "./MyNavBarStyle.css";
import { useTranslation, initReactI18next } from "react-i18next";

const Navigation = () => {
  const { pathname } = useLocation();
  const module = useLocation().pathname.split("/")[1];

  const { t } = useTranslation();

  const [extendNavbar, setExtendNavbar] = useState(false);
  const [configData, setConfigData] = useState();
  // JSON.parse(localStorage.getItem("monetx_configuration"))
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
    // let config = localStorage.getItem("monetx_configuration");
    // setConfigData(JSON.parse(config));
    // console.log(JSON.parse(config));
  }, []);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isVisible, setVisible] = useState(false);
  useEffect(() => {
    // setSelected(localStorage.setItem("lang", selected));

    localStorage.getItem("lang");
  }, []);
  useEffect(() => {
    if (!isFirstLoad) {
      window.location.reload();
    } else {
      setIsFirstLoad(false);
    }
  }, [isVisible]);
  // console.log(configData);
  return (
    <div>
      <NavbarContainer extendNavbar={extendNavbar}>
        <NavbarInnerContainer>
          <LeftContainer>
            <NavbarLinkContainer>
              {configData?.dashboard.view ? (
                <>
                  <NavbarLink
                    to="/"
                    // end
                    mainLoc={pathname === "/"}
                    // //activeStyle
                    style={{
                      display: "flex",
                      // width: "110px",
                      textAlign: "center",
                    }}
                  >
                    {pathname === "/" ? (
                      <SvgStyling
                        src={active_dashboard}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                          // filter: "red",
                        }}
                      />
                    ) : (
                      <img
                        src={dash}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    )}
                    Dashboard
                  </NavbarLink>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </>
              ) : null}
              {/* {configData?.dashboard.view ? (
                <>
                  <NavbarLink
                    to="/dashboard-new"
                    // end
                    mainLoc={pathname === "/dashboard-new"}
                    // //activeStyle
                    style={{
                      display: "flex",
                      // width: "110px",
                      textAlign: "center",
                    }}
                  >
                    {pathname === "/dashboard-new" ? (
                      <SvgStyling
                        src={active_dashboard}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                          // filter: "red",
                        }}
                      />
                    ) : (
                      <img
                        src={dash}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    )}
                    New Dashboard
                  </NavbarLink>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </>
              ) : null} */}
              {configData?.atom.view ? (
                <>
                  <NavbarLink
                    to="/atom/main"
                    exact
                    activeStyle={selectedStyle}
                    mainLoc={
                      pathname === "/atom/main" ||
                      pathname === "/atom/password-group"
                    }
                    //activeStyle
                    style={{
                      display: "flex",
                      // width: "80px",
                      textAlign: "center",
                    }}
                  >
                    {pathname === "/atom/main" ||
                    pathname === "/atom/password-group" ? (
                      <img
                        src={active_atomMenu}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    ) : (
                      <img
                        src={atomMenu}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    )}
                    Atom
                  </NavbarLink>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </>
              ) : null}
              {configData?.atom.view ? (
                <>
                  <NavbarLink
                    to="/auto-discovery/main"
                    exact
                    activeStyle={selectedStyle}
                    mainLoc={
                      pathname === "/auto-discovery/main" ||
                      pathname === "/auto-discovery/manage-devices" ||
                      pathname === "/auto-discovery/manage-network" ||
                      pathname === "/auto-discovery/manage-credentials" ||
                      pathname === "/auto-discovery/network" ||
                      pathname === "/auto-discovery/discovery"
                    }
                    //activeStyle
                    style={{
                      display: "flex",
                      // width: "80px",
                      textAlign: "center",
                    }}
                  >
                    {pathname === "/auto-discovery/main" ||
                    pathname === "/auto-discovery/manage-devices" ||
                    pathname === "/auto-discovery/manage-network" ||
                    pathname === "/auto-discovery/manage-credentials" ||
                    pathname === "/auto-discovery/network" ||
                    pathname === "/auto-discovery/discovery" ? (
                      <img
                        src={active_auto_discovery_menu}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    ) : (
                      <img
                        src={auto_discovery_menu}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    )}
                    Auto-Discovery
                  </NavbarLink>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </>
              ) : null}
              {configData?.uam.view ? (
                <>
                  <NavbarLink
                    to="/uam/devices"
                    mainLoc={
                      pathname === "/uam/devices" ||
                      pathname === "/uam/sites" ||
                      pathname === "/uam/racks" ||
                      pathname === "/uam/boards" ||
                      pathname === "/uam/subboards" ||
                      pathname === "/uam/sfps" ||
                      pathname === "/uam/license" ||
                      pathname === "/uam/module" ||
                      pathname === "/uam/stackswitches" ||
                      pathname === "/uam/aps" ||
                      pathname === "/uam/hardwarelifecycle"
                    }
                    //activeStyle
                    style={{
                      display: "flex",
                      // width: "80px",
                      textAlign: "center",
                    }}
                  >
                    {pathname === "/uam/devices" ||
                    pathname === "/uam/sites" ||
                    pathname === "/uam/racks" ||
                    pathname === "/uam/boards" ||
                    pathname === "/uam/subboards" ||
                    pathname === "/uam/sfps" ||
                    pathname === "/uam/license" ||
                    pathname === "/uam/module" ||
                    pathname === "/uam/stackswitches" ||
                    pathname === "/uam/aps" ||
                    pathname === "/uam/hardwarelifecycle" ? (
                      <img
                        src={active_uam}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    ) : (
                      <img
                        src={uam}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    )}
                    UAM
                  </NavbarLink>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </>
              ) : null}
              {/* {configData?.network_mapping.view ? (
                <>
                  <NavbarLink
                    to="/network-mapping"
                    //activeStyle
                    style={{
                      display: "flex",
                      // width: "155px",
                      textAlign: "center",
                      display: "none",
                    }}
                  >
                    <img
                      src={network_map}
                      alt=""
                      style={{
                        marginRight: "10px",
                        marginBottom: "5px",
                        width: "20px",
                        height: "20px",
                        paddingTop: "1px",
                      }}
                    />
                    Network Mapping
                  </NavbarLink>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </>
              ) : null} */}
              {configData?.ipam.view ? (
                <>
                  <NavbarLink
                    to="/ipam/main"
                    mainLoc={
                      pathname === "/ipam/main" ||
                      pathname === "/ipam/devices" ||
                      pathname === "/ipam/Device-Subnet" ||
                      pathname === "/ipam/subnet/main" ||
                      pathname === "/ipam/subnet/ip-details" ||
                      pathname === "/ipam/subnet/discovered-subnet" ||
                      pathname === "/ipam/subnet/ip-history" ||
                      pathname === "/ipam/dns/main" ||
                      pathname === "/ipam/dns/zones" ||
                      pathname === "/ipam/dns/records" ||
                      pathname === "/ipam/vip/main" ||
                      pathname === "/ipam/vip/firewall"
                    }
                    //activeStyle
                    style={{
                      display: "flex",
                      // width: "80px",
                      textAlign: "center",
                    }}
                  >
                    {pathname === "/ipam/main" ||
                    pathname === "/ipam/devices" ||
                    pathname === "/ipam/subnet/main" ||
                    pathname === "/ipam/subnet/ip-details" ||
                    pathname === "/ipam/subnet/discovered-subnet" ||
                    pathname === "/ipam/subnet/ip-history" ||
                    pathname === "/ipam/Device-Subnet" ||
                    pathname === "/ipam/dns/main" ||
                    pathname === "/ipam/dns/zones" ||
                    pathname === "/ipam/dns/records" ||
                    pathname === "/ipam/vip/main" ||
                    pathname === "/ipam/vip/firewall" ? (
                      <img
                        src={active_ipam}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    ) : (
                      <img
                        src={ipam}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    )}

                    {t("IPAM")}

                    {/* IPAM */}
                  </NavbarLink>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </>
              ) : null}
              {/* {configData?.dcm.view ? (
                <>
                  <NavbarLink
                    to="/dccm/main"
                    mainLoc={
                      pathname === "/dccm/main" || pathname === "/dccm/devices"
                    }
                    //activeStyle
                    style={{
                      display: "flex",
                      textAlign: "center",
                    }}
                  >
                    {pathname === "/dccm/main" ||
                    pathname === "/dccm/devices" ? (
                      <img
                        src={active_dcm}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "20px",
                          height: "20px",
                          paddingTop: "1px",
                        }}
                      />
                    ) : (
                      <img
                        src={dcm}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "20px",
                          height: "20px",
                          paddingTop: "1px",
                        }}
                      />
                    )}
                    DCCM
                  </NavbarLink>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </>
              ) : null} */}

              {configData?.monitering.view ? (
                <>
                  <NavbarLink
                    to="/monitoring/main"
                    mainLoc={
                      pathname === "/monitoring/main" ||
                      pathname === "/monitoring/device" ||
                      pathname === "/monitoring/network/main" ||
                      pathname === "/monitoring/alert" ||
                      pathname === "/monitoring/network/router" ||
                      pathname === "/monitoring/network/interface" ||
                      pathname === "/monitoring/network/router-interface" ||
                      pathname === "/monitoring/network/switches" ||
                      pathname === "/monitoring/network/switches-interfaces" ||
                      pathname === "/monitoring/network/firewall" ||
                      pathname === "/monitoring/network/firewall-interface" ||
                      pathname === "/monitoring/network/wireless" ||
                      pathname === "/monitoring/network/wireless-interface" ||
                      pathname === "/monitoring/all-servers" ||
                      pathname === "/monitoring/all-servers-interface" ||
                      pathname === "/monitoring/servers-windows-devices" ||
                      pathname === "/monitoring/servers-windows-interface" ||
                      pathname === "/monitoring/servers-linux-devices" ||
                      pathname === "/monitoring/servers-linux-interface" ||
                      pathname === "/monitoring/credentials" ||
                      pathname === "/monitoringsummary/main" ||
                      pathname === "/monitoring/cloud" ||
                      pathname === "/monitoring/cloud/cloudSummary" ||
                      pathname === "/monitoring/cloud/instance-details" ||
                      pathname === "/monitoring/cloud/dashboard-data" ||
                      pathname === "/monitoring/cloud/s3-dashboard-data" ||
                      pathname === "/monitoring/cloud/ELB-dashboard-data"
                    }
                    //activeStyle
                    style={{
                      display: "flex",
                      textAlign: "center",
                    }}
                  >
                    {pathname === "/monitoring/main" ||
                    pathname === "/monitoring/device" ||
                    pathname === "/monitoring/network/main" ||
                    pathname === "/monitoring/alert" ||
                    pathname === "/monitoring/network/router" ||
                    pathname === "/monitoring/network/interface" ||
                    pathname === "/monitoring/network/router-interface" ||
                    pathname === "/monitoring/network/switches" ||
                    pathname === "/monitoring/network/switches-interfaces" ||
                    pathname === "/monitoring/network/firewall" ||
                    pathname === "/monitoring/network/firewall-interface" ||
                    pathname === "/monitoring/network/wireless" ||
                    pathname === "/monitoring/network/wireless-interface" ||
                    pathname === "/monitoring/all-servers" ||
                    pathname === "/monitoring/all-servers-interface" ||
                    pathname === "/monitoring/servers-windows-devices" ||
                    pathname === "/monitoring/servers-windows-interface" ||
                    pathname === "/monitoring/servers-linux-devices" ||
                    pathname === "/monitoring/servers-linux-interface" ||
                    pathname === "/monitoring/credentials" ||
                    pathname === "/monitoringsummary/main" ||
                    pathname === "/monitoring/cloud" ||
                    pathname === "/monitoring/cloud/cloudSummary" ||
                    pathname === "/monitoring/cloud/instance-details" ||
                    pathname === "/monitoring/cloud/dashboard-data" ||
                    pathname === "/monitoring/cloud/s3-dashboard-data" ||
                    pathname === "/monitoring/cloud/ELB-dashboard-data" ? (
                      <img
                        src={active_monitoringMenu}
                        width="20px"
                        height="13px"
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    ) : (
                      <img
                        src={monitoringMenu}
                        width="20px"
                        height="13px"
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    )}
                    Monitoring
                  </NavbarLink>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </>
              ) : null}
              {configData?.atom.view ? (
                <>
                  <NavbarLink
                    to="/ncm/main"
                    exact
                    activeStyle={selectedStyle}
                    mainLoc={
                      pathname === "/ncm/main" ||
                      pathname === "/ncm/config-management" ||
                      pathname === "/ncmconfig-management/main" ||
                      pathname === "/ncm/config-data"
                    }
                    //activeStyle
                    style={{
                      display: "flex",
                      // width: "80px",
                      textAlign: "center",
                    }}
                  >
                    {pathname === "/ncm/main" ||
                    pathname === "/ncm/config-management" ||
                    pathname === "/ncmconfig-management/main" ||
                    pathname === "/ncm/config-data" ? (
                      <img
                        src={active_atom}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    ) : (
                      <img
                        src={atom}
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    )}
                    NCM
                  </NavbarLink>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </>
              ) : null}
              {configData?.admin.view ? (
                <>
                  <NavbarLink
                    to="/admin/failed-devices"
                    mainLoc={
                      pathname === "/admin/show-member" ||
                      pathname === "/admin/role" ||
                      pathname === "/admin/failed-devices"
                    }
                    //activeStyle
                    style={{
                      display: "flex",
                      textAlign: "center",
                    }}
                  >
                    {pathname === "/admin/show-member" ||
                    pathname === "/admin/role" ||
                    pathname === "/admin/failed-devices" ? (
                      <img
                        src={greenAdmin}
                        width="20px"
                        height="13px"
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    ) : (
                      <img
                        src={greyAdmin}
                        width="20px"
                        height="13px"
                        alt=""
                        style={{
                          marginRight: "10px",
                          marginBottom: "5px",
                          width: "18px",
                          height: "18px",
                          paddingTop: "1px",
                        }}
                      />
                    )}
                    Admin
                  </NavbarLink>
                </>
              ) : null}
              {/* <NavbarLink to="/physical-mapping" //activeStyle>
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
              <NavbarLink to="/ims" //activeStyle>
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
              <NavbarLink to="/inventry" //activeStyle>
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
              <NavbarLink to="/monitering" //activeStyle>
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

              <NavbarLink to="/auto-discovery" //activeStyle>
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
              <NavbarLink to="/ipam" //activeStyle>
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
              <NavbarLink to="/dcm" //activeStyle>
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
            </NavbarLinkContainer>

            <OpenLinksButton
              onClick={() => {
                setExtendNavbar((curr) => !curr);
              }}
            >
              {extendNavbar ? <>&#10005;</> : <> &#8801;</>}
            </OpenLinksButton>
          </LeftContainer>
          {/* <RightContainer> */}
          {/* <Logo src={LogoImg} style={{ width: "150px" }}></Logo> */}
          {/* <button
              style={{
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
            </button> */}
          {/* </RightContainer> */}
        </NavbarInnerContainer>
        {extendNavbar &&
          (userRole === "User" ? (
            <NavbarExtendedContainer style={{ zIndex: "999" }}>
              {configData?.dashboard.view ? (
                <NavbarLinkExtended to="/" mainLoc={pathname === "/"}>
                  Dashboard
                </NavbarLinkExtended>
              ) : null}
              {configData?.atom.view ? (
                <NavbarLinkExtended
                  to="/atom/main"
                  mainLoc={
                    pathname === "/atom/main" ||
                    pathname === "/atom/password-group"
                  }
                >
                  Atom
                </NavbarLinkExtended>
              ) : null}

              {/* <NavbarLinkExtended to="/atom/password-group">
  Password Group
</NavbarLinkExtended> */}
              {configData?.uam.view ? (
                <NavbarLinkExtended
                  to="/uam/devices"
                  mainLoc={
                    pathname === "/uam/devices" ||
                    pathname === "/uam/sites" ||
                    pathname === "/uam/racks" ||
                    pathname === "/uam/boards" ||
                    pathname === "/uam/subboards" ||
                    pathname === "/uam/sfps" ||
                    pathname === "/uam/license"
                  }
                >
                  {" "}
                  UAM
                </NavbarLinkExtended>
              ) : null}
              {configData?.network_mapping.view ? (
                <NavbarLinkExtended to="/network-mapping">
                  Network Mapping
                </NavbarLinkExtended>
              ) : null}
              {configData?.ipam.view ? (
                <NavbarLinkExtended
                  to="/ipam/main"
                  mainLoc={
                    pathname === "/ipam/main" ||
                    pathname === "/ipam/devices" ||
                    pathname === "/ipam/Device-Subnet" ||
                    pathname === "/ipam/subnet/main" ||
                    pathname === "/ipam/subnet/ip-details" ||
                    pathname === "/ipam/subnet/discovered-subnet" ||
                    pathname === "/ipam/subnet/ip-history" ||
                    pathname === "/ipam/dns/main" ||
                    pathname === "/ipam/dns/zones" ||
                    pathname === "/ipam/dns/records"
                  }
                >
                  {" "}
                  IPAM
                </NavbarLinkExtended>
              ) : null}

              {configData?.monitering.view ? (
                <NavbarLinkExtended
                  to="/monitoring/main"
                  mainLoc={
                    pathname === "/monitoring/main" ||
                    pathname === "/monitoring/device"
                  }
                >
                  Monitering
                </NavbarLinkExtended>
              ) : null}

              {/* {configData?.dcm.view ? (
                <NavbarLinkExtended to="/dcm" mainLoc={pathname === "/dcm"}>
                  {" "}
                  DCCM
                </NavbarLinkExtended>
              ) : null} */}

              {configData?.admin.view ? (
                <NavbarLinkExtended
                  to="/admin/failed-devices"
                  mainLoc={
                    pathname === "/admin/show-member" ||
                    pathname === "/admin/role" ||
                    pathname === "/admin/failed-devices"
                  }
                >
                  {" "}
                  Admin
                </NavbarLinkExtended>
              ) : null}
            </NavbarExtendedContainer>
          ) : (
            <NavbarExtendedContainer style={{ zIndex: "999" }}>
              {configData?.dashboard.view ? (
                <NavbarLinkExtended to="/">Dashboard</NavbarLinkExtended>
              ) : null}
              {configData?.atom.view ? (
                <NavbarLinkExtended
                  to="/atom/main"
                  mainLoc={
                    pathname === "/atom/main" ||
                    pathname === "/atom/password-group"
                  }
                >
                  Atom
                </NavbarLinkExtended>
              ) : null}

              {/* <NavbarLinkExtended to="/atom/password-group">
              Password Group
            </NavbarLinkExtended> */}
              {configData?.uam.view ? (
                <NavbarLinkExtended
                  to="/uam/devices"
                  mainLoc={
                    pathname === "/uam/devices" ||
                    pathname === "/uam/sites" ||
                    pathname === "/uam/racks" ||
                    pathname === "/uam/boards" ||
                    pathname === "/uam/subboards" ||
                    pathname === "/uam/sfps" ||
                    pathname === "/uam/license"
                  }
                >
                  {" "}
                  UAM
                </NavbarLinkExtended>
              ) : null}
              {configData?.network_mapping.view ? (
                <NavbarLinkExtended to="/network-mapping">
                  Network Mapping
                </NavbarLinkExtended>
              ) : null}
              {configData?.ipam.view ? (
                <NavbarLinkExtended
                  to="/ipam/main"
                  mainLoc={
                    pathname === "/ipam/main" ||
                    pathname === "/ipam/devices" ||
                    pathname === "/ipam/Device-Subnet" ||
                    pathname === "/ipam/subnet/main" ||
                    pathname === "/ipam/subnet/ip-details" ||
                    pathname === "/ipam/subnet/discovered-subnet" ||
                    pathname === "/ipam/subnet/ip-history" ||
                    pathname === "/ipam/dns/main" ||
                    pathname === "/ipam/dns/zones" ||
                    pathname === "/ipam/dns/records"
                  }
                >
                  {" "}
                  IPAM
                </NavbarLinkExtended>
              ) : null}

              {configData?.monitering.view ? (
                <NavbarLinkExtended
                  to="/monitoring/main"
                  mainLoc={
                    pathname === "/monitoring/main" ||
                    pathname === "/monitoring/device"
                  }
                >
                  Monitering
                </NavbarLinkExtended>
              ) : null}

              {/* {configData?.dcm.view ? (
                <NavbarLinkExtended to="/dcm" mainLoc={pathname === "/dcm"}>
                  {" "}
                  DCCM
                </NavbarLinkExtended>
              ) : null} */}

              {configData?.admin.view ? (
                <NavbarLinkExtended
                  to="/admin/show-member"
                  mainLoc={
                    pathname === "/admin/show-member" ||
                    pathname === "/admin/role" ||
                    pathname === "/admin/failed-devices"
                  }
                >
                  {" "}
                  Admin
                </NavbarLinkExtended>
              ) : null}
            </NavbarExtendedContainer>
          ))}
      </NavbarContainer>
    </div>
  );
};

const selectedStyle = {
  backgroundColor: "black",
  color: "#000 ",
};

export default Navigation;
