import { monetxApi } from "../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getIpamDnsZonesByDnsServerId: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ipam/ipam_device/get_dns_zones_by_server_id",
        method: "POST",
        body: data, // {dns_server_id:""}
      }),
    }),

    getAllIpamDnsZones: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_dns_zones",
    }),
  }),
});

export const { useGetAllIpamDnsZonesQuery: useFetchRecordsQuery } = extendedApi;
