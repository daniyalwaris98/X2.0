import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({

    getConfigurationBackupSummary: builder.query({
      query: () => "/api/v1/ncm/ncm_dashboard/ncm_change_summery_by_device",
    }),

    getConfigurationChangeByDevice: builder.query({           
      query: () => "/api/v1/ncm/ncm_dashboard/ncm_change_summery_by_device",
    }),

    
      getRecentRCMAlarms: builder.query({
        query: () => "/api/v1/ncm/ncm_dashboard/get_ncm_alarm_by_category_graph",
      }),


    // deleteNcmDevices: builder.mutation({
    //   query: (data) => ({
    //     url: "/api/v1/ncm/ncm_device/delete_ncm_devices",
    //     method: "POST",
    //     body: data,
    //   }),
    // }),

    // call this api on loop when bulk backup starts, end the loop when this api returns empty array
    // getAllCompletedBackups: builder.query({
    //   query: () => "/api/v1/ncm/ncm_device/get_all_ncm_devices",
    // }),

    // bulkBackupNcmConfigurationsByDeviceIds: builder.mutation({
    //   query: (data) => ({
    //     url: "/api/v1/ncm/ncm_device/bulk_backup_configuration",
    //     method: "POST",
    //     body: data,
    //   }),
    // }),
  }),
});

export const {
useGetConfigurationChangeByDeviceQuery

} = extendedApi;
