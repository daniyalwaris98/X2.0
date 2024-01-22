// admin module
import { MODULE_PATH as MODULE_PATH_ADMIN } from "..";
import { PAGE_PATH as PAGE_PATH_MEMBERS } from "../members/constants";

import { PAGE_PATH as PAGE_PATH_FAILED_DEVICES_AUTO_DISCOVERY } from "../failedDevicesLanding/autoDiscovery/constants";
import { PAGE_PATH as PAGE_PATH_FAILED_DEVICES_IPAM } from "../failedDevicesLanding/ipam/constants";
import { PAGE_PATH as PAGE_PATH_FAILED_DEVICES_MONITORING } from "../failedDevicesLanding/monitoring/constants";
import { PAGE_PATH as PAGE_PATH_FAILED_DEVICES_NCM } from "../failedDevicesLanding/ncm/constants";
import { PAGE_PATH as PAGE_PATH_FAILED_DEVICES_UAM } from "../failedDevicesLanding/uam/constants";

import { PAGE_PATH as PAGE_PATH_ROLES } from "../roles/constants";

// atom module
import { MODULE_PATH as MODULE_PATH_ATOM } from "../../atomModule";
import { PAGE_PATH as PAGE_PATH_ATOMS } from "../../atomModule/atoms/constants";
import { PAGE_PATH as PAGE_PATH_PASSWORD_GROUPS } from "../../atomModule/passwordGroups/constants";

// auto_discovery module
import { MODULE_PATH as MODULE_PATH_AUTO_DISCOVERY } from "../../autoDiscoveryModule";
import { PAGE_PATH as PAGE_PATH_AUTO_DISCOVERY_DASHBOARD } from "../../autoDiscoveryModule/dashboard/constants";
import { PAGE_PATH as PAGE_PATH_DISCOVERY } from "../../autoDiscoveryModule/discovery/constants";
import { PAGE_PATH as PAGE_PATH_LOGIN_CREDENTIALS } from "../../autoDiscoveryModule/manageCredentialsDropDown/loginCredentials/constants";
import { PAGE_PATH as PAGE_PATH_V1_V2_CREDENTIALS } from "../../autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v1V2Credentials/constants";
import { PAGE_PATH as PAGE_PATH_V3_CREDENTIALS } from "../../autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v3Credentials/constants";
import { PAGE_PATH as PAGE_PATH_MANAGE_DEVICES } from "../../autoDiscoveryModule/manageDevices/constants";
import { PAGE_PATH as PAGE_PATH_MANAGE_NETWORKS } from "../../autoDiscoveryModule/manageNetworks/constants";

// ipam module
import { MODULE_PATH as MODULE_PATH_IPAM } from "../../ipamModule";
import { PAGE_PATH as PAGE_PATH_IPAM_DASHBOARD } from "../../ipamModule/dashboard";

// monitoring module
import { MODULE_PATH as MODULE_PATH_MONITORING } from "../../monitoringModule";

// ncm module
import { MODULE_PATH as MODULE_PATH_NCM } from "../../ncmModule";

// uam module
import { MODULE_PATH as MODULE_PATH_UAM } from "../../uamModule";

export const defaultConfiguration = {
  [MODULE_PATH_ADMIN]: {
    view: true,
    pages: {
      [PAGE_PATH_MEMBERS]: { view: true, read_only: false },
      [PAGE_PATH_FAILED_DEVICES_AUTO_DISCOVERY]: {
        view: true,
        read_only: false,
      },
      [PAGE_PATH_FAILED_DEVICES_IPAM]: { view: true, read_only: false },
      [PAGE_PATH_FAILED_DEVICES_MONITORING]: { view: true, read_only: false },
      [PAGE_PATH_FAILED_DEVICES_NCM]: { view: true, read_only: false },
      [PAGE_PATH_FAILED_DEVICES_UAM]: { view: true, read_only: false },
      [PAGE_PATH_ROLES]: { view: true, read_only: false },
    },
  },

  [MODULE_PATH_ATOM]: {
    view: true,
    pages: {
      [PAGE_PATH_ATOMS]: { view: true, read_only: false },
      [PAGE_PATH_PASSWORD_GROUPS]: { view: true, read_only: false },
    },
  },

  [MODULE_PATH_AUTO_DISCOVERY]: {
    view: true,
    pages: {
      // [PAGE_PATH_AUTO_DISCOVERY_DASHBOARD]: { view: true, read_only: false },
      dashboard: { view: true, read_only: false },
      [PAGE_PATH_DISCOVERY]: { view: true, read_only: false },
      [PAGE_PATH_LOGIN_CREDENTIALS]: { view: true, read_only: false },
      [PAGE_PATH_V1_V2_CREDENTIALS]: { view: true, read_only: false },
      [PAGE_PATH_V3_CREDENTIALS]: { view: true, read_only: false },
      [PAGE_PATH_MANAGE_DEVICES]: { view: true, read_only: false },
      [PAGE_PATH_MANAGE_NETWORKS]: { view: true, read_only: false },
    },
  },

  [MODULE_PATH_IPAM]: {
    view: true,
    pages: {
      // [PAGE_PATH_IPAM_DASHBOARD]: { view: true, read_only: false },
      dashboard: { view: true, read_only: false },
      devices: { view: true, read_only: false },
      devices_subnet: { view: true, read_only: false },
      subnet: { view: true, read_only: false },
      ip_detail: { view: true, read_only: false },
      discover_subnet: { view: true, read_only: false },
      ip_history: { view: true, read_only: false },
      dns_server: { view: true, read_only: false },
      dns_zones: { view: true, read_only: false },
      dns_records: { view: true, read_only: false },
      vpi: { view: true, read_only: false },
      loadbalancer: { view: true, read_only: false },
      firewall: { view: true, read_only: false },
    },
  },

  [MODULE_PATH_MONITORING]: {
    view: true,
    pages: {
      monitoring: { view: true, read_only: false },
      device: { view: true, read_only: false },
      network: { view: true, read_only: false },
      router: { view: true, read_only: false },
      switches: { view: true, read_only: false },
      firewall: { view: true, read_only: false },
      wireless: { view: true, read_only: false },
      server: { view: true, read_only: false },
      windows: { view: true, read_only: false },
      linux: { view: true, read_only: false },
      alerts: { view: true, read_only: false },
      cloud: { view: true, read_only: false },
      credentials: { view: true, read_only: false },
    },
  },

  [MODULE_PATH_NCM]: {
    view: true,
    pages: {
      dashboard: { view: true, read_only: false },
      config_data: { view: true, read_only: false },
    },
  },

  [MODULE_PATH_UAM]: {
    view: true,
    pages: {
      sites: { view: true, read_only: false },
      racks: { view: true, read_only: false },
      devices: { view: true, read_only: false },
      modules: { view: true, read_only: false },
      sfps: { view: true, read_only: false },
      hwlifecycle: { view: true, read_only: false },
      aps: { view: true, read_only: false },
      license: { view: true, read_only: false },
    },
  },
};
