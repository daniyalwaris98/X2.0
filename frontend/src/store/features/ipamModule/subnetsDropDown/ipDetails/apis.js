import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchIPDetails: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_all_ip_details",
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
  useFetchIPDetailsQuery: useFetchRecordsQuery,
  useFetchAtomsForIPAMQuery,
  useAutoDiscoverDevicesBySubnetMutation,
} = extendedApi;
