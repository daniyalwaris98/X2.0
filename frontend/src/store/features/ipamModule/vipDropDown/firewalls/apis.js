import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchDiscoveredDevicesBySubnet: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/get_discovery_data",
        method: "POST",
        body: data,
      }),
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
  useFetchDiscoveredDevicesBySubnetMutation: useFetchRecordsMutation,
  useFetchDiscoveryFunctionAllSubnetsCountsQuery,
  useFetchDiscoveryFunctionCountsBySubnetMutation,
  useAutoDiscoverDevicesBySubnetMutation,
} = extendedApi;
