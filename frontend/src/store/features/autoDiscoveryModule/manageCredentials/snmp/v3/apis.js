import { monetxApi } from "../../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchV3Credentials: builder.query({
      query: () => "/api/v1/auto_discovery/get_snmp_v3_credentials",
    }),
    deleteV3Credentials: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/delete_snmp_credentials",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addV3Credential: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/add_snmp_v3_credentials",
        method: "POST",
        body: data,
      }),
    }),
    updateV3Credential: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/edit_snmp_v3_credentials",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchV3CredentialsQuery: useFetchRecordsQuery,
  useDeleteV3CredentialsMutation: useDeleteRecordsMutation,
  useAddV3CredentialMutation: useAddRecordMutation,
  useUpdateV3CredentialMutation: useUpdateRecordMutation,
} = extendedApi;
