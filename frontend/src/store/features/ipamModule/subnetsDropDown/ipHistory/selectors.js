export const selectTableData = (state) => state.ipam_ip_history.all_data;
export const selectIpHistoryByIpAddress = (state) =>
  state.ipam_ip_history.ip_history_by_ip_address;
