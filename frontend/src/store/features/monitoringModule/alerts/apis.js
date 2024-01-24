import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAlerts: builder.query({
      query: () => "/api/v1/monitoring/alerts/get_monitoring_alerts",
    }),

    getAlertsHistoryByIpAddress: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ipam/ipam_device/delete_dns_servers",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useGetAllAlertsQuery: useFetchRecordsQuery,
  useGetAlertsHistoryByIpAddressMutation,
} = extendedApi;
