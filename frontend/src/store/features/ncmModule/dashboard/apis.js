import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getConfigurationChangeByDevice: builder.query({    
       
      query: () => "/api/v1/ncm/ncm_dashboard/ncm_change_summery_by_device",
    }),

    // getAllNcmDevices: builder.query({
    //     query: () => "/api/v1/ncm/ncm_dashboard/ncm_change_summery_by_device",
    //   }),
    //   getAllNcmDevices: builder.query({
    //     query: () => "/api/v1/ncm/ncm_dashboard/ncm_change_summery_by_device",
    //   }),


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
