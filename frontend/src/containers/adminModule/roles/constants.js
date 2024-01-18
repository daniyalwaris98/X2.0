export const PAGE_NAME = "Roles";
export const ELEMENT_NAME = "role";
export const PAGE_PATH = "roles";
export const FILE_NAME_EXPORT_ALL_DATA = "all_roles";
export const FILE_NAME_EXPORT_TEMPLATE = "roles_template";
export const TABLE_DATA_UNIQUE_ID = "role_id";
export const indexColumnNameConstants = {
  ROLE: "role",
  ACTIONS: "actions",
};
export const defaultConfigurations = {
  dashboard: {
    view: true,
    pages: {
      dashboard: { view: true, read_only: false },
    },
  },

  atom: {
    view: true,
    pages: {
      atom: { view: true, read_only: false },
      password_group: { view: true, read_only: false },
    },
  },

  autoDiscovery: {
    view: true,
    pages: {
      dashboard: { view: true, read_only: false },
      manageNetwork: { view: true, read_only: false },
      discovery: { view: true, read_only: false },
      manageDevices: { view: true, read_only: false },
      manageCredentials: { view: true, read_only: false },
    },
  },

  ncm: {
    view: true,
    pages: {
      dashboard: { view: true, read_only: false },
      config_data: { view: true, read_only: false },
    },
  },

  uam: {
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

  ipam: {
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
  monitoring: {
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
  dcm: {
    view: true,
    pages: {
      dashboard: { view: true, read_only: false },
      devices: { view: true, read_only: false },
    },
  },
  admin: {
    view: true,
    pages: {
      admin: { view: true, read_only: false },
      show_member: { view: true, read_only: false },
      role: { view: true, read_only: false },
      failed_devices: { view: true, read_only: false },
    },
  },
};
