import { monetxApi } from "../../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchV3s: builder.query({
      query: () => "/api/v1/auto_discovery/get_snmp_v3_credentials",
    }),
    deleteV3s: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/delete_snmp_credentials",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addV3: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/add_snmp_v3_credentials",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchV3sQuery: useFetchRecordsQuery,
  useDeleteV3sMutation: useDeleteRecordsMutation,
  useAddV3Mutation: useAddRecordMutation,
} = extendedApi;
