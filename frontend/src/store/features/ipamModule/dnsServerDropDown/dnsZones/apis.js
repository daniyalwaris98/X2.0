import { monetxApi } from "../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllIpamDnsZones: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_dns_zones",
    }),
  }),
});

export const { useGetAllIpamDnsZonesQuery: useFetchRecordsQuery } = extendedApi;
