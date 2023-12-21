import { monetxApi } from "../../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchV1V2s: builder.query({
      query: () => "/api/v1/auto_discovery/get_snmp_v1_v2_credentials",
    }),
    deleteV1V2s: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/delete_snmp_credentials",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addV1V2: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/add_snmp_v1_v2_credentials",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchV1V2sQuery: useFetchRecordsQuery,
  useDeleteV1V2sMutation: useDeleteRecordsMutation,
  useAddV1V2Mutation: useAddRecordMutation,
} = extendedApi;
