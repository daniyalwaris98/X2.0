import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    ipamFetchDevices: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_all_ipam_devices",
    }),

    ipamFetchAtoms: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_atom_in_ipam",
    }),
  }),
});

export const {
  useIpamFetchDevicesQuery: useFetchRecordsQuery,
  useIpamFetchAtomsQuery,
} = extendedApi;
