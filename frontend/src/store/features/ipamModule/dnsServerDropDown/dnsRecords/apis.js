import { monetxApi } from "../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllIpamDnsRecords: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_dns_records",
    }),
  }),
});

export const { useGetAllIpamDnsRecordsQuery: useFetchRecordsQuery } =
  extendedApi;
