import { configureStore } from "@reduxjs/toolkit";
import { monetxApi } from "./features/apiSlice";

// admin module
import adminAutoDiscoveryFailedDevicesReducer from "./features/adminModule/failedDevices/autoDiscovery";
import adminRolesReducer from "./features/adminModule/roles";

// atom module
import atomAtomsReducer from "./features/atomModule/atoms";
import atomPasswordGroupsReducer from "./features/atomModule/passwordGroups";

// uam module
import uamSitesReducer from "./features/uamModule/sites";
import uamRacksReducer from "./features/uamModule/racks";
import uamDevicesReducer from "./features/uamModule/devices";
import uamBoardsReducer from "./features/uamModule/boards";
import uamSubBoardsReducer from "./features/uamModule/subBoards";
import uamSFPsReducer from "./features/uamModule/sfps";
import uamLicenseReducer from "./features/uamModule/licenses";
import uamAPsReducer from "./features/uamModule/aps";
import uamHWLifeCyclesReducer from "./features/uamModule/hwLifeCycles";

// monitoring module
import monitoringDevicesReducer from "./features/monitoringModule/devices";

import monitoringAllNetworksDevicesReducer from "./features/monitoringModule/networksDropDown/allDevices/devices";
import monitoringAllNetworksInterfacesReducer from "./features/monitoringModule/networksDropDown/allDevices/interfaces";

import monitoringFirewallsDevicesReducer from "./features/monitoringModule/networksDropDown/firewalls/devices";
import monitoringFirewallsInterfacesReducer from "./features/monitoringModule/networksDropDown/firewalls/interfaces";

import monitoringRoutersDevicesReducer from "./features/monitoringModule/networksDropDown/routers/devices";
import monitoringRoutersInterfacesReducer from "./features/monitoringModule/networksDropDown/routers/interfaces";

import monitoringSwitchesDevicesReducer from "./features/monitoringModule/networksDropDown/switches/devices";
import monitoringSwitchesInterfacesReducer from "./features/monitoringModule/networksDropDown/switches/interfaces";

import monitoringWirelessDevicesReducer from "./features/monitoringModule/networksDropDown/wireless/devices";
import monitoringWirelessInterfacesReducer from "./features/monitoringModule/networksDropDown/wireless/interfaces";

import monitoringAllServersDevicesReducer from "./features/monitoringModule/serversDropDown/allDevices/devices";
import monitoringAllServersInterfacesReducer from "./features/monitoringModule/serversDropDown/allDevices/interfaces";

import monitoringLinuxDevicesReducer from "./features/monitoringModule/serversDropDown/linux/devices";
import monitoringLinuxInterfacesReducer from "./features/monitoringModule/serversDropDown/linux/interfaces";

import monitoringWindowsDevicesReducer from "./features/monitoringModule/serversDropDown/windows/devices";
import monitoringWindowsInterfacesReducer from "./features/monitoringModule/serversDropDown/windows/interfaces";

import monitoringAlertsReducer from "./features/monitoringModule/alerts";

import monitoringInterfacesReducer from "./features/monitoringModule/devicesLanding/interfaces";
import monitoringSummaryReducer from "./features/monitoringModule/devicesLanding/summary";

import monitoringEC2Reducer from "./features/monitoringModule/cloudsDropDown/awsDropDown/ec2";
import monitoringS3Reducer from "./features/monitoringModule/cloudsDropDown/awsDropDown/s3";
import monitoringELBReducer from "./features/monitoringModule/cloudsDropDown/awsDropDown/elb";

import monitoringLoginCredentialsReducer from "./features/monitoringModule/manageCredentials/loginCredentials";
import monitoringV1V2CredentialsReducer from "./features/monitoringModule/manageCredentials/snmpCredentials/v1V2Credentials";
import monitoringV3CredentialsReducer from "./features/monitoringModule/manageCredentials/snmpCredentials/v3Credentials";

// auto discovery module
import autoDiscoveryManageNetworksReducer from "./features/autoDiscoveryModule/manageNetworks";
import autoDiscoveryManageDevicesReducer from "./features/autoDiscoveryModule/manageDevices";
import autoDiscoveryDiscoveryReducer from "./features/autoDiscoveryModule/discovery";

import autoDiscoverySSHLoginCredentialsReducer from "./features/autoDiscoveryModule/manageCredentials/loginCredentials";

import autoDiscoveryV1V2CredentialsReducer from "./features/autoDiscoveryModule/manageCredentials/snmpCredentials/v1V2Credentials";
import autoDiscoveryV3CredentialsReducer from "./features/autoDiscoveryModule/manageCredentials/snmpCredentials/v3Credentials";

// ipam module
import ipamDevicesReducer from "./features/ipamModule/devices";

import ipamSubnetsReducer from "./features/ipamModule/subnetsDropDown/subnets";
import ipamDiscoveredSubnetsReducer from "./features/ipamModule/subnetsDropDown/discoveredSubnets";
import ipamIpDetailsReducer from "./features/ipamModule/subnetsDropDown/ipDetails";
import ipamIpHistoryReducer from "./features/ipamModule/subnetsDropDown/ipHistory";

import ipamDnsServersReducer from "./features/ipamModule/dnsServerDropDown/dnsServers";
import ipamDnsRecordsReducer from "./features/ipamModule/dnsServerDropDown/dnsRecords";
import ipamDnsZonesReducer from "./features/ipamModule/dnsServerDropDown/dnsZones";

import ipamFirewalls from "./features/ipamModule/vipDropDown/firewalls";
import ipamLoadBalancers from "./features/ipamModule/vipDropDown/loadBalancers";

// ncm module
import ncmManageConfigurationsReducer from "./features/ncmModule/manageConfigurations";
import ncmConfigurationBackupsReducer from "./features/ncmModule/manageConfigurations/configurationBackups";
import ncmRemoteCommandSenderReducer from "./features/ncmModule/manageConfigurations/remoteCommandSender";

import dropDownsReducer from "./features/dropDowns";

// import necessary functions from redux-persist
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root", // key for the localStorage object
  storage, // define which storage to use
  whitelist: ["ncm_manage_configurations", "monitoring_devices"], // only persist specified reducers
};

const rootReducer = combineReducers({
  // admin module
  admin_auto_discovery_failed_devices: adminAutoDiscoveryFailedDevicesReducer,
  admin_roles_reducer: adminRolesReducer,

  // atom module
  atom_atoms: atomAtomsReducer,
  atom_password_groups: atomPasswordGroupsReducer,

  // uam module
  uam_sites: uamSitesReducer,
  uam_racks: uamRacksReducer,
  uam_devices: uamDevicesReducer,
  uam_boards: uamBoardsReducer,
  uam_sub_boards: uamSubBoardsReducer,
  uam_sfps: uamSFPsReducer,
  uam_licenses: uamLicenseReducer,
  uam_aps: uamAPsReducer,
  uam_hw_life_cycles: uamHWLifeCyclesReducer,

  // monitoring module
  monitoring_devices: monitoringDevicesReducer,

  monitoring_all_networks_devices: monitoringAllNetworksDevicesReducer,
  monitoring_all_networks_interfaces: monitoringAllNetworksInterfacesReducer,

  monitoring_firewalls_devices: monitoringFirewallsDevicesReducer,
  monitoring_firewalls_interfaces: monitoringFirewallsInterfacesReducer,

  monitoring_routers_devices: monitoringRoutersDevicesReducer,
  monitoring_routers_interfaces: monitoringRoutersInterfacesReducer,

  monitoring_switches_devices: monitoringSwitchesDevicesReducer,
  monitoring_switches_interfaces: monitoringSwitchesInterfacesReducer,

  monitoring_wireless_devices: monitoringWirelessDevicesReducer,
  monitoring_wireless_interfaces: monitoringWirelessInterfacesReducer,

  monitoring_all_servers_devices: monitoringAllServersDevicesReducer,
  monitoring_all_servers_interfaces: monitoringAllServersInterfacesReducer,

  monitoring_linux_devices: monitoringLinuxDevicesReducer,
  monitoring_linux_interfaces: monitoringLinuxInterfacesReducer,

  monitoring_windows_devices: monitoringWindowsDevicesReducer,
  monitoring_windows_interfaces: monitoringWindowsInterfacesReducer,

  monitoring_alerts: monitoringAlertsReducer,

  monitoring_interfaces: monitoringInterfacesReducer,
  monitoring_summary: monitoringSummaryReducer,

  monitoring_ec2: monitoringEC2Reducer,
  monitoring_s3: monitoringS3Reducer,
  monitoring_elb: monitoringELBReducer,

  monitoring_login_credentials: monitoringLoginCredentialsReducer,
  monitoring_v1_v2_credentials: monitoringV1V2CredentialsReducer,
  monitoring_v3_credentials: monitoringV3CredentialsReducer,

  // auto discovery module
  auto_discovery_manage_networks: autoDiscoveryManageNetworksReducer,
  auto_discovery_manage_devices: autoDiscoveryManageDevicesReducer,
  auto_discovery_discovery: autoDiscoveryDiscoveryReducer,

  auto_discovery_login_credentials: autoDiscoverySSHLoginCredentialsReducer,

  auto_discovery_v1_v2_credentials: autoDiscoveryV1V2CredentialsReducer,
  auto_discovery_v3_credentials: autoDiscoveryV3CredentialsReducer,

  // ipam module
  ipam_devices: ipamDevicesReducer,

  ipam_subnets: ipamSubnetsReducer,
  ipam_discovered_subnets: ipamDiscoveredSubnetsReducer,
  ipam_ip_details: ipamIpDetailsReducer,
  ipam_ip_history: ipamIpHistoryReducer,

  ipam_dns_servers: ipamDnsServersReducer,
  ipam_dns_records: ipamDnsRecordsReducer,
  ipam_dns_zones: ipamDnsZonesReducer,

  ipam_firewalls: ipamFirewalls,
  ipam_load_balancers: ipamLoadBalancers,

  // ncm module
  ncm_manage_configurations: ncmManageConfigurationsReducer,
  ncm_configuration_backups: ncmConfigurationBackupsReducer,
  ncm_remote_command_sender: ncmRemoteCommandSenderReducer,

  // dropdowns
  drop_downs: dropDownsReducer,

  [monetxApi.reducerPath]: monetxApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(monetxApi.middleware),
});

export const persistor = persistStore(store);
