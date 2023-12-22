import { monetxApi } from "../../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchV1V2Credentials: builder.query({
      query: () => "/api/v1/auto_discovery/get_snmp_v1_v2_credentials",
    }),
    deleteV1V2Credentials: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/delete_snmp_credentials",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addV1V2Credential: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/add_snmp_v1_v2_credentials",
        method: "POST",
        body: data,
      }),
    }),
    updateV1V2Credential: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/edit_snmp_v1_v2_credentials",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchV1V2CredentialsQuery: useFetchRecordsQuery,
  useDeleteV1V2CredentialsMutation: useDeleteRecordsMutation,
  useAddV1V2CredentialMutation: useAddRecordMutation,
  useUpdateV1V2CredentialMutation: useUpdateRecordMutation,
} = extendedApi;
