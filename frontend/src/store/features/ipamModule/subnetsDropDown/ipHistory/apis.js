import { monetxApi } from "../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllIpamIPHistory: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_all_ip_history",
    }),
  }),
});

export const { useGetAllIpamIPHistoryQuery: useFetchRecordsQuery } =
  extendedApi;
