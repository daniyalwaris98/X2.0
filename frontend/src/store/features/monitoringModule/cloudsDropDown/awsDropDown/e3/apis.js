import { monetxApi } from "../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllmonitoringe3Records: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_dns_records",
    }),
  }),
});

export const { useGetAllmonitoringe3RecordsQuery: useFetchRecordsQuery } =
  extendedApi;
