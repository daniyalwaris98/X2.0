import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchAlerts: builder.query({
      query: () => "/api/v1/monitoring/alerts/alert_status",
    }),
  }),
});
export const { useFetchAlertsQuery: useFetchRecordsQuery } = extendedApi;
