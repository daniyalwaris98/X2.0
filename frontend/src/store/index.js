import { configureStore } from "@reduxjs/toolkit";
import { monetxApi } from "./features/apiSlice";

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
import monitoringAlertsReducer from "./features/monitoringModule/alerts";

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
  whitelist: ["ncm_manage_configurations"], // only persist specified reducers
};

const rootReducer = combineReducers({
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
  monitoring_alerts: monitoringAlertsReducer,

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
