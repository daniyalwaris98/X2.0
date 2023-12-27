import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchIPAMSubnets: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_all_subnet",
    }),

    fetchAtomsForIPAM: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_atom_in_ipam",
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
  useFetchIPAMSubnetsQuery: useFetchRecordsQuery,
  useFetchAtomsForIPAMQuery,
  useAutoDiscoverDevicesBySubnetMutation,
} = extendedApi;
