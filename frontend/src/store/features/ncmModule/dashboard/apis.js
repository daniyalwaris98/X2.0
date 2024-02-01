import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({



    getConfigurationBackupSummary: builder.query({
      query: () => "/api/v1/ncm/ncm_dashboard/ncm_backup_summery_dashboard",
      
    }),
  
    getConfigurationChangeByDevice: builder.query({           
      query: () => "/api/v1/ncm/ncm_dashboard/ncm_change_summery_by_device",
    }),

    
  


  }),
});

export const {
  useGetConfigurationBackupSummaryQuery, useGetConfigurationChangeByDeviceQuery

} = extendedApi;
