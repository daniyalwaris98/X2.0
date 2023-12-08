export const selectTableData = (state) => state.device.all_data;
export const selectSitesByIPAddressData = (state) =>
  state.device.sites_by_ip_address;
export const selectRacksByIPAddressData = (state) =>
  state.device.racks_by_ip_address;
export const selectBoardsByIPAddressData = (state) =>
  state.device.boards_by_ip_address;
export const selectSubBoardsByIPAddressData = (state) =>
  state.device.sub_boards_by_ip_address;
export const selectSFPsByIPAddressData = (state) =>
  state.device.sfps_by_ip_address;
export const selectLicensesByIPAddressData = (state) =>
  state.device.licenses_by_ip_address;
