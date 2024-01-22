import { monetxApi } from "../../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllInterfacesInNetworks: builder.query({
      query: () =>
        "/api/v1/monitoring/monitoring_network/get_all_interfaces_in_networks",
    }),

    getAllAlertsByIpAddress: builder.mutation({
      query: (data) => ({
        url: "/api/v1/monitoring/alerts/get_monitoring_alerts_by_ip_address",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetAllInterfacesInNetworksQuery: useFetchRecordsQuery } =
  extendedApi;
