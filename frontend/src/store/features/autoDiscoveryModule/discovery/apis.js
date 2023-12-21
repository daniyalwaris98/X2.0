import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchDiscoveredDevices: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/get_discovery_data",
        method: "POST",
        body: data,
      }),
    }),

    fetchDiscoveryFunctionAllSubnetsCounts: builder.query({
      query: () => "/api/v1/auto_discovery/auto_discovery_function_count",
    }),

    fetchDiscoveryFunctionCountsBySubnet: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/get_discovery_function_count",
        method: "POST",
        body: data,
      }),
    }),

    autoDiscoverDevicesBySubnet: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/auto_discover",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchDiscoveredDevicesMutation: useFetchRecordsMutation,
  useFetchDiscoveryFunctionAllSubnetsCountsQuery,
  useFetchDiscoveryFunctionCountsBySubnetMutation,
  useAutoDiscoverDevicesBySubnetMutation,
} = extendedApi;
