import { MODULE_PATH as MODULE_PATH_ADMIN } from "../../adminModule";
import { PAGE_PATH as PAGE_PATH_MEMBERS } from "../members/constants";

import { MODULE_PATH as MODULE_PATH_ATOM } from "../../atomModule";
import { MODULE_PATH as MODULE_PATH_AUTO_DISCOVERY } from "../../autoDiscoveryModule";
import { MODULE_PATH as MODULE_PATH_IPAM } from "../../ipamModule";
import { MODULE_PATH as MODULE_PATH_MONITORING } from "../../monitoringModule";
import { MODULE_PATH as MODULE_PATH_NCM } from "../../ncmModule";
import { MODULE_PATH as MODULE_PATH_UAM } from "../../uamModule";

export const defaultConfigurations = {
  [MODULE_PATH_ADMIN]: {
    view: true,
    pages: {
      admin: { view: true, read_only: false },
      [PAGE_PATH_MEMBERS]: { view: true, read_only: false },
      role: { view: true, read_only: false },
      failed_devices: { view: true, read_only: false },
    },
  },

  [MODULE_PATH_ATOM]: {
    view: true,
    pages: {
      atom: { view: true, read_only: false },
      password_group: { view: true, read_only: false },
    },
  },

  [MODULE_PATH_AUTO_DISCOVERY]: {
    view: true,
    pages: {
      dashboard: { view: true, read_only: false },
      manageNetwork: { view: true, read_only: false },
      discovery: { view: true, read_only: false },
      manageDevices: { view: true, read_only: false },
      manageCredentials: { view: true, read_only: false },
    },
  },

  [MODULE_PATH_IPAM]: {
    view: true,
    pages: {
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
