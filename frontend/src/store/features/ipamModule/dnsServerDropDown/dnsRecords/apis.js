import { monetxApi } from "../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getIpamDnsRecordsByDnsZoneId: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ipam/ipam_device/get_dns_record_by_zone_id",
        method: "POST",
        body: data, // {dns_zone_id:""}
      }),
    }),

    getAllIpamDnsRecords: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_dns_records",
    }),
  }),
});

export const { useGetAllIpamDnsRecordsQuery: useFetchRecordsQuery } =
  extendedApi;
