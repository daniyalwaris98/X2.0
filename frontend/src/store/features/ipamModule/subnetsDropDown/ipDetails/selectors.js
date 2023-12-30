export const selectTableData = (state) => state.ipam_ip_details.all_data;
export const selectIpDetailsBySubnetAddress = (state) =>
  state.ipam_ip_details.ip_details_by_subnet_address;
