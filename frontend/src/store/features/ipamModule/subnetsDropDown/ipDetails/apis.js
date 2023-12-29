import { monetxApi } from "../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllIpamIPDetails: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_all_ip_details",
    }),
  }),
});

export const { useGetAllIpamIPDetailsQuery: useFetchRecordsQuery } =
  extendedApi;
