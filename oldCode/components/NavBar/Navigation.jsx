import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  NavbarContainer,
  LeftContainer,
  NavbarExtendedContainer,
  NavbarInnerContainer,
  NavbarLinkContainer,
  NavbarLink,
  OpenLinksButton,
  NavbarLinkExtended,
} from "./Navigation.styled.js";
import { SvgStyling } from "../AllStyling/All.styled.js";
import dash from "./Assets/dash.svg";
import active_dashboard from "./Assets/active_dashboard.svg";
import atom from "./Assets/atom.svg";
import active_atom from "./Assets/active_atom.svg";
import uam from "./Assets/uam.svg";
import active_uam from "./Assets/active_uam.svg";
import greenAdmin from "./Assets/green_admin.svg";
import greyAdmin from "./Assets/greey_admin.svg";
import ipam from "./Assets/ipam.svg";
import active_ipam from "./Assets/active_ipam.svg";
import atomMenu from "./Assets/atomMenu.svg";
import active_atomMenu from "./Assets/activeAtomMenu.svg";
import monitoringMenu from "./Assets/monitoringMenu.svg";
import active_monitoringMenu from "./Assets/activeMonitoringMenu.svg";
import auto_discovery_menu from "./Assets/auto_discovery_menu.svg";
import active_auto_discovery_menu from "./Assets/active_auto_discovery_menu.svg";
import { useTranslation } from "react-i18next";
import "./MyNavBarStyle.css";

const Navigation = () => {
  const { pathname } = useLocation();

  const { t } = useTranslation();

  const [extendNavbar, setExtendNavbar] = useState(false);
  const [configData, setConfigData] = useState();
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
  }, []);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    localStorage.getItem("lang");
  }, []);

  useEffect(() => {
    if (!isFirstLoad) {
      window.location.reload();
    } else {
      setIsFirstLoad(false);
    }
  }, [isVisible]);

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
                    mainLoc={pathname === "/"}
                    style={{
                      display: "flex",
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
                    style={{
                      display: "flex",
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
                    style={{
                      display: "flex",
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
                    style={{
                      display: "flex",
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
                    style={{
                      display: "flex",
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
                  </NavbarLink>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </>
              ) : null}

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
                    style={{
                      display: "flex",
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
            </NavbarLinkContainer>

            <OpenLinksButton
              onClick={() => {
                setExtendNavbar((curr) => !curr);
              }}
            >
              {extendNavbar ? <>&#10005;</> : <> &#8801;</>}
            </OpenLinksButton>
          </LeftContainer>
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
