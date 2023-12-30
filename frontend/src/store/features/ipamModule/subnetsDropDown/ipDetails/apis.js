import { monetxApi } from "../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllIpamIPDetails: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_all_ip_details",
    }),

    getIpDetailsBySubnetAddress: builder.query({
      query: (params) => ({
        url: `/api/v1/ipam/ipam_device/get_ip_detail_by_subnet`,
        params,
      }),
    }),
  }),
});

export const {
  useGetAllIpamIPDetailsQuery: useFetchRecordsQuery,
  useGetIpDetailsBySubnetAddressQuery,
} = extendedApi;
