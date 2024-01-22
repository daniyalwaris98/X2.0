import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAlerts: builder.query({
      query: () => "/api/v1/monitoring/alerts/get_monitoring_alerts",
    }),
  }),
});
export const { useGetAllAlertsQuery: useFetchRecordsQuery } = extendedApi;
