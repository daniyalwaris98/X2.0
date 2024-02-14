import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getConfigurationByTime: builder.query({           
      query: () => "/api/v1/main_dashboard/main_change-configuration-by-time",
    }),


    
   

  }),
});

export const {
  useGetConfigurationByTimeQuery
} = extendedApi;
