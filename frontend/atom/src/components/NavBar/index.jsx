import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import Atom from "../Atom";
import PasswordGroup from "../PasswordGroup";
import Login from "../Login";
import UAM from "../UAM";
import UAMData from "../UAM/UamData";
import Sites from "../UAM/Sites";
import Racks from "../UAM/Racks";
import Devices from "../UAM/Devices";
import Boards from "../UAM/Boards";
import SFPS from "../UAM/SFPS";
import Licensce from "../UAM/Licensce";
import Aps from "../UAM/Aps";

import Admin from "../Admin";
import Subnet from "../IPAM/Subnet";
import Role from "../Admin/Role";
import FailedDevices from "../Admin/FailedDevices";
import EndUser from "../EndUser";
import NetworkMap from "../NetworkMapping";
import MyFirst from "../FirstNavBar/MyFirst.jsx";
import IPAM from "../IPAM/index.jsx";
import Subnet_Main from "../IPAM/Subnet/Subnet_main.jsx";
import IpamDevices from "../IPAM/Devices";
import Dns_servers from "../IPAM/DNS_Servers";
import Dns_zone from "../IPAM/DNS_Zone";
import Monitering from "../Monitering";
import Device_Subnet from "../IPAM/Device_Subnet";
import AtomMain from "../Atom/Atom";
import AdminShowMember from "../Admin/ShowMem";
import PageNotFound from "../PageNotFound";
import IpamDashboard from "../IPAM/Dashboard";
import IP_Details from "../IPAM/Subnet/IP_Details";
import Discovered_subnet from "../IPAM/Subnet/Discovered_subnet";
import Ip_history from "../IPAM/Subnet/IP_history";
import Main_Monitoring from "../Monitering/Main_Monitoring.jsx";
import Monitoring_Atom from "../Monitering/Atom";

import NetworkMain from "../Monitering/Network/index_Main.jsx";
import NetworkInterface from "../Monitering/Network/Interface.jsx";
import Router from "../Monitering/Network/Router";
import RouterInterface from "../Monitering/Network/Router/Interface.jsx";
import Firewall from "../Monitering/Network/FireWalls";
import FireWallInterface from "../Monitering/Network/FireWalls/Interface.jsx";
import Switches from "../Monitering/Network/Switches";
import SwitchesInterface from "../Monitering/Network/Switches/Interface.jsx";
import Wireless from "../Monitering/Network/Wireless";
import WirelessInterface from "../Monitering/Network/Wireless/Interface.jsx";

import AllServer from "../Monitering/Servers/index_Main.jsx";
import AllServerInterface from "../Monitering/Servers/Interface.jsx";

import ServerWindow from "../Monitering/Servers/windows";
import ServerWindowInterface from "../Monitering/Servers/windows/Interface.jsx";

import ServerLinux from "../Monitering/Servers/Linux";
import ServerLinuxInterface from "../Monitering/Servers/Linux/Interface.jsx";

import DNS from "../IPAM/DNS_ServerMain";
import DNSMain from "../IPAM/DNS_ServerMain/indexMain.jsx";
import DNSZones from "../IPAM/DNS_ServerMain/DNS_Zones";
import DNSRecords from "../IPAM/DNS_ServerMain/DNS_Records";

import MoniteringSummary from "../MonitoringSummary";
import MainMoniteringSummary from "../MonitoringSummary/index_Main.jsx";
import DeviceSummary from "../MonitoringSummary/Summary";

import MainMoniteringSummaryInterface from "../MonitoringSummaryInterfaces/index_Main.jsx";
import MoniteringAlert from "../Monitering/Alert";
import MoniteringCredentials from "../Monitering/Credentials";
import MoniteringInterface from "../MonitoringSummaryInterfaces/index_Main.jsx";
import AddNetwork from "../AutoDiscovery/Network";

import CloudDashboard from "../Monitering/CloudDashboard";
import CloudS3Dashboard from "../Monitering/CloudDashboard/S3Dashboard";

import HardwareLifeCycle from "../UAM/HardwareLifeCycle";
import DCCM from "../DCM";
import DCCMMain from "../DCM/indexMain.jsx";
import DCCMDevices from "../DCM/Device";

import CloudELBDashboard from "../Monitering/CloudDashboard/ELBDashboard";

import FireWall from "../IPAM/Vip/Firewall";
import LoadBalancer from "../IPAM/Vip/LoadBalancer";
import Vip from "../IPAM/Vip";

import NCM from "../NCM";
import NCMMain from "../NCM/indexMain.jsx";
import ConfigManagement from "../NcsSummary/ConfigManagement";
import ConfigData from "../NCM/ConfigData";
import MainNCMSummary from "../NcsSummary/index_Main.jsx";

import AutoDiscovery from "../AutoDiscovery";
import AutoDiscoveryMain from "../AutoDiscovery/indexMain.jsx";
import AutoDiscoveryDashboard from "../AutoDiscovery/Dashboard";
import ManageDevices from "../AutoDiscovery/ManageDevices";
import ManageNetwork from "../AutoDiscovery/ManageNetwork";
import ManageCredentials from "../AutoDiscovery/ManageCredentials";
import CloudDetail from "../Monitering/clouds/CloudDetails";

import AWS from "../Monitering/clouds/AWS";
import InstanceDetail from "../Monitering/clouds/InstanceDetails";

import LicenseKey from "../LicenseKey";
import LicenseRenewal from "../licenseRenewal";
import axios, { baseUrl } from "../../utils/axios";
import NewDashboard from "../NewDashboard";

const SecondNavBar = (props) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [configData, setConfigData] = useState(null);
  const [token, setToken] = useState("");

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

  useEffect(() => {
    let mainkey = localStorage.getItem("monetx_token");
    if (mainkey) {
      setToken(mainkey);
    } else {
      navigate("/login");
    }
  }, [pathname]);

  const data = localStorage.getItem("user");
  const [keyResp, setKeyResp] = useState("");
  useEffect(() => {
    if (data !== null) {
      const licenseData = async () => {
        const a = JSON.parse(data);

        const res = await axios.post(baseUrl + "/licenseValidationAfterLogin", {
          username: a.user_name,
        });
        setKeyResp(res.data);
      };
      licenseData();
    }
  }, [keyResp, data]);

  useEffect(() => {
    if (keyResp !== "" && keyResp !== "TRUE") {
      navigate("/license-renewal");
    }
  }, [keyResp]);

  useEffect(() => {
    let mainAuthToken = localStorage.getItem("monetx_token");
    if (mainAuthToken === "") {
      navigate("/login");
    }
  }, [token]);

  return (
    <div>
      {pathname !== "/login" && (
        <>
          <MyFirst />
          <Navigation />
        </>
      )}

      <Routes>
        {token ? (
          keyResp !== "TRUE" && keyResp !== "" ? (
            <>
              <Route path="/license-renewal" element={<LicenseRenewal />} />

              <Route
                exact
                path="/"
                element={<Navigate to="/license-renewal" replace />}
              />
              <Route path="*" element={<LicenseRenewal />} />
            </>
          ) : (
            <>
              <Route
                exact
                path="/license-renewal"
                element={<Navigate to="/" replace />}
              />
              <Route path="/" element={<NewDashboard />} />

              <Route path="/license-key" element={<LicenseKey />} />

              <Route path="/login" element={<Login />} />

              {configData?.monitering.view ? (
                <Route path="monitoring" element={<Monitering />}>
                  {configData?.monitering.view ? (
                    <Route path="main" element={<Main_Monitoring />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}

                  {configData?.monitering.pages.device.view ? (
                    <Route
                      path="/monitoring/device"
                      element={<Monitoring_Atom />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.network.view ? (
                    <Route
                      path="/monitoring/network/main"
                      element={<NetworkMain />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.network.view ? (
                    <Route
                      path="/monitoring/network/interface"
                      element={<NetworkInterface />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}

                  {configData?.monitering.pages.router.view ? (
                    <Route
                      path="/monitoring/network/router"
                      element={<Router />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.router.view ? (
                    <Route
                      path="/monitoring/network/router-interface"
                      element={<RouterInterface />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.switches.view ? (
                    <Route
                      path="/monitoring/network/switches"
                      element={<Switches />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.switches.view ? (
                    <Route
                      path="/monitoring/network/switches-interfaces"
                      element={<SwitchesInterface />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}

                  {configData?.monitering.pages.firewall.view ? (
                    <Route
                      path="/monitoring/network/firewall"
                      element={<Firewall />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.firewall.view ? (
                    <Route
                      path="/monitoring/network/firewall-interface"
                      element={<FireWallInterface />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.wireless.view ? (
                    <Route
                      path="/monitoring/network/wireless"
                      element={<Wireless />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.wireless.view ? (
                    <Route
                      path="/monitoring/network/wireless-interface"
                      element={<WirelessInterface />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}

                  {configData?.monitering.pages.server.view ? (
                    <Route
                      path="/monitoring/all-servers"
                      element={<AllServer />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.server.view ? (
                    <Route
                      path="/monitoring/all-servers-interface"
                      element={<AllServerInterface />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}

                  {configData?.monitering.pages.windows.view ? (
                    <Route
                      path="/monitoring/servers-windows-devices"
                      element={<ServerWindow />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.windows.view ? (
                    <Route
                      path="/monitoring/servers-windows-interface"
                      element={<ServerWindowInterface />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.linux.view ? (
                    <Route
                      path="/monitoring/servers-linux-devices"
                      element={<ServerLinux />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.linux.view ? (
                    <Route
                      path="/monitoring/servers-linux-interface"
                      element={<ServerLinuxInterface />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.alerts.view ? (
                    <Route
                      path="/monitoring/alert"
                      element={<MoniteringAlert />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.credentials.view ? (
                    <Route
                      path="/monitoring/credentials"
                      element={<MoniteringCredentials />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.cloud.view ? (
                    <Route path="/monitoring/cloud" element={<AWS />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.cloud.view ? (
                    <Route
                      path="/monitoring/cloud/cloudSummary"
                      element={<CloudDetail />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.cloud.view ? (
                    <Route
                      path="/monitoring/cloud/dashboard"
                      element={<CloudDashboard />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.pages.cloud.view ? (
                    <Route
                      path="/monitoring/cloud/instance-details"
                      element={<InstanceDetail />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                </Route>
              ) : null}

              {configData?.monitering.pages.cloud.view ? (
                <Route
                  path="/monitoring/cloud/dashboard-data"
                  element={<CloudDashboard />}
                />
              ) : (
                <Route path="main" element={<></>} />
              )}
              {configData?.monitering.pages.cloud.view ? (
                <Route
                  path="/monitoring/cloud/s3-dashboard-data"
                  element={<CloudS3Dashboard />}
                />
              ) : (
                <Route path="main" element={<></>} />
              )}
              {configData?.monitering.pages.cloud.view ? (
                <Route
                  path="/monitoring/cloud/elb-dashboard-data"
                  element={<CloudELBDashboard />}
                />
              ) : (
                <Route path="main" element={<></>} />
              )}

              {configData?.monitering.view ? (
                <Route path="monitoringsummary" element={<MoniteringSummary />}>
                  {configData?.monitering.view ? (
                    <Route path="main" element={<MainMoniteringSummary />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}

                  {configData?.monitering.view ? (
                    <Route
                      path="/monitoringsummary/interface"
                      element={<MainMoniteringSummaryInterface />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.monitering.view ? (
                    <Route
                      path="/monitoringsummary/device-summary"
                      element={<DeviceSummary />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                </Route>
              ) : null}

              {configData?.monitering.view ? (
                <Route
                  path="/monitoringsummary/main"
                  element={<MainMoniteringSummary />}
                />
              ) : (
                <Route path="main" element={<></>} />
              )}
              {configData?.ncm.pages.config_data.view ? (
                <Route path="/ncmsummary/main" element={<MainNCMSummary />} />
              ) : (
                <Route path="main" element={<></>} />
              )}

              {configData?.ncm.pages.config_data.view ? (
                <Route
                  path="/ncmconfig-management/main"
                  element={<ConfigManagement />}
                />
              ) : (
                <Route path="main" element={<></>} />
              )}

              {configData?.monitering.view ? (
                <Route
                  path="/monitoringinterfacesummary/main"
                  element={<MoniteringInterface />}
                />
              ) : (
                <Route path="main" element={<></>} />
              )}

              {configData?.atom.view ? (
                <Route path="atom" element={<Atom />}>
                  {configData?.atom.pages.atom.view ? (
                    <Route path="main" element={<AtomMain />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.atom.pages.password_group.view ? (
                    <Route path="password-group" element={<PasswordGroup />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                </Route>
              ) : null}

              {configData?.atom.view ? (
                <Route path="auto-discovery" element={<AutoDiscovery />}>
                  {configData?.atom.pages.atom.view ? (
                    <Route path="main" element={<AutoDiscoveryDashboard />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.atom.pages.atom.view ? (
                    <Route path="discovery" element={<AutoDiscoveryMain />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.atom.pages.atom.view ? (
                    <Route path="network" element={<AddNetwork />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.atom.pages.password_group.view ? (
                    <Route path="manage-devices" element={<ManageDevices />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.atom.pages.password_group.view ? (
                    <Route path="manage-network" element={<ManageNetwork />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.atom.pages.password_group.view ? (
                    <Route
                      path="manage-credentials"
                      element={<ManageCredentials />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                </Route>
              ) : null}

              {configData?.ncm.view ? (
                <Route path="ncm" element={<NCM />}>
                  {configData?.ncm.pages.dashboard.view ? (
                    <Route path="main" element={<NCMMain />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.ncm.pages.config_data.view ? (
                    <Route path="config-data" element={<ConfigData />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                </Route>
              ) : null}

              {configData?.uam.view ? (
                <Route path="uam" element={<UAM />}>
                  {configData?.uam.view ? (
                    <Route path="main" element={<UAMData />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.uam.pages.sites.view ? (
                    <Route path="sites" element={<Sites />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.uam.pages.racks.view ? (
                    <Route path="racks" element={<Racks />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.uam.pages.devices.view ? (
                    <Route path="devices" element={<Devices />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.uam.pages.modules.view ? (
                    <Route path="module" element={<Boards />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}

                  {configData?.uam.pages.sfps.view ? (
                    <Route path="sfps" element={<SFPS />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.uam.pages.license.view ? (
                    <Route path="license" element={<Licensce />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.uam.pages.license.view ? (
                    <Route path="aps" element={<Aps />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.uam.pages.license.view ? (
                    <Route
                      path="hardwarelifecycle"
                      element={<HardwareLifeCycle />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                </Route>
              ) : null}

              <Route path="/network-mapping" element={<NetworkMap />} />
              <Route path="/server-name-main" element={<Dns_servers />} />

              {configData?.ipam.view ? (
                <Route path="ipam" element={<IPAM />}>
                  {configData?.ipam.view ? (
                    <Route path="main" element={<IpamDashboard />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.ipam.view ? (
                    <Route path="/ipam/main" element={<IpamDashboard />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}

                  {configData?.ipam.pages.dns_server.view ? (
                    <Route path="/ipam/dns_servers" element={<Dns_servers />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.ipam.pages.dns_zones.view ? (
                    <Route path="/ipam/dns_zones" element={<Dns_zone />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.ipam.pages.devices.view ? (
                    <Route path="/ipam/devices" element={<IpamDevices />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.ipam.pages.devices_subnet.view ? (
                    <Route
                      path="/ipam/Device-Subnet"
                      element={<Device_Subnet />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.ipam.pages.subnet.view ? (
                    <Route path="/ipam/subnet" element={<Subnet />}>
                      {configData?.ipam.view ? (
                        <Route path="main" element={<Subnet_Main />} />
                      ) : (
                        <Route path="main" element={<></>} />
                      )}
                      {configData?.ipam.pages.subnet.view ? (
                        <Route
                          path="/ipam/subnet/main"
                          element={<Subnet_Main />}
                        />
                      ) : (
                        <Route path="main" element={<></>} />
                      )}
                      {configData?.ipam.pages.ip_detail.view ? (
                        <Route
                          path="/ipam/subnet/ip-details"
                          element={<IP_Details />}
                        />
                      ) : (
                        <Route path="main" element={<></>} />
                      )}
                      {configData?.ipam.pages.discover_subnet.view ? (
                        <Route
                          path="/ipam/subnet/discovered-subnet"
                          element={<Discovered_subnet />}
                        />
                      ) : (
                        <Route path="main" element={<></>} />
                      )}
                      {configData?.ipam.pages.ip_history.view ? (
                        <Route
                          path="/ipam/subnet/ip-history"
                          element={<Ip_history />}
                        />
                      ) : (
                        <Route path="main" element={<></>} />
                      )}
                    </Route>
                  ) : (
                    <Route path="main" element={<></>} />
                  )}

                  {configData?.ipam.pages.vpi.view ? (
                    <Route path="/ipam/vip" element={<Vip />}>
                      {configData?.ipam.pages.loadbalancer.view ? (
                        <Route path="main" element={<LoadBalancer />} />
                      ) : (
                        <Route path="main" element={<></>} />
                      )}
                      {configData?.ipam.pages.loadbalancer.view ? (
                        <Route
                          path="/ipam/vip/main"
                          element={<LoadBalancer />}
                        />
                      ) : (
                        <Route path="main" element={<></>} />
                      )}
                      {configData?.ipam.pages.firewall.view ? (
                        <Route
                          path="/ipam/vip/firewall"
                          element={<FireWall />}
                        />
                      ) : (
                        <Route path="main" element={<></>} />
                      )}
                    </Route>
                  ) : (
                    <Route path="main" element={<></>} />
                  )}

                  {configData?.ipam.pages.dns_server.view ? (
                    <Route path="/ipam/dns" element={<DNS />}>
                      {configData?.ipam.pages.dns_server.view ? (
                        <Route path="main" element={<DNSMain />} />
                      ) : (
                        <Route path="main" element={<></>} />
                      )}
                      {configData?.ipam.pages.dns_server.view ? (
                        <Route path="/ipam/dns/main" element={<DNSMain />} />
                      ) : (
                        <Route path="main" element={<></>} />
                      )}
                      {configData?.ipam.pages.dns_zones.view ? (
                        <Route path="/ipam/dns/zones" element={<DNSZones />} />
                      ) : (
                        <Route path="main" element={<></>} />
                      )}
                      {configData?.ipam.pages.dns_records.view ? (
                        <Route
                          path="/ipam/dns/records"
                          element={<DNSRecords />}
                        />
                      ) : (
                        <Route path="main" element={<></>} />
                      )}
                    </Route>
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                </Route>
              ) : null}

              {configData?.atom.pages.atom.view ? (
                <Route path="dccm" element={<DCCM />}>
                  {configData?.admin.view ? (
                    <Route path="main" element={<DCCMMain />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.admin.pages.show_member.view ? (
                    <Route path="/dccm/devices" element={<DCCMDevices />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                </Route>
              ) : null}
              {configData?.atom.pages.atom.view ? (
                <Route path="end-user" element={<EndUser />}></Route>
              ) : null}
              {configData?.admin.view ? (
                <Route path="admin" element={<Admin />}>
                  {configData?.admin.pages.show_member.view ? (
                    <Route path="main" element={<AdminShowMember />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.admin.pages.show_member.view ? (
                    <Route
                      path="/admin/show-member"
                      element={<AdminShowMember />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.admin.pages.role.view ? (
                    <Route path="/admin/role" element={<Role />} />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                  {configData?.admin.pages.failed_devices.view ? (
                    <Route
                      path="/admin/failed-devices"
                      element={<FailedDevices />}
                    />
                  ) : (
                    <Route path="main" element={<></>} />
                  )}
                </Route>
              ) : null}
              <Route path="*" element={<PageNotFound />} />
            </>
          )
        ) : (
          <Route path="/login" element={<Login />} />
        )}
      </Routes>
    </div>
  );
};

export default SecondNavBar;
