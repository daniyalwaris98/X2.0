import { monetxApi } from "../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllIpamIPHistory: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_all_ip_history",
    }),

    getIpHistoryByIpAddress: builder.query({
      query: (params) => ({
        url: `/api/v1/ipam/ipam_device/get_history_by_ip`,
        params,
      }),
    }),
  }),
});

export const {
  useGetAllIpamIPHistoryQuery: useFetchRecordsQuery,
  useGetIpHistoryByIpAddressQuery,
} = extendedApi;
