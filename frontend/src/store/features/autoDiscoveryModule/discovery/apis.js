import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchAutoDiscoveryDiscoveredDevicesBySubnet: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/get_discovery_data",
        method: "POST",
        body: data,
      }),
    }),

    fetchAutoDiscoveryDiscoveryFunctionCountsBySubnet: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/get_discovery_function_count",
        method: "POST",
        body: data,
      }),
    }),

    autoDiscoveryAutoDiscoverDevicesBySubnet: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/auto_discover",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchAutoDiscoveryDiscoveredDevicesBySubnetMutation:
    useFetchRecordsMutation,
  useFetchAutoDiscoveryDiscoveryFunctionCountsBySubnetMutation,
  useAutoDiscoveryAutoDiscoverDevicesBySubnetMutation,
} = extendedApi;
