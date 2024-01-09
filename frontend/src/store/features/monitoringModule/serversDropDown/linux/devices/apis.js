import { monetxApi } from "../../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    autoDiscoveryFetchV1V2Credentials: builder.query({
      query: () =>
        "/api/v1/monitoring/monitoring_server/get_all_devices_in_linux",
    }),
  }),
});

export const {
  useAutoDiscoveryFetchV1V2CredentialsQuery: useFetchRecordsQuery,
  useAutoDiscoveryDeleteV1V2CredentialsMutation: useDeleteRecordsMutation,
  useAutoDiscoveryAddV1V2CredentialMutation: useAddRecordMutation,
  useAutoDiscoveryUpdateV1V2CredentialMutation: useUpdateRecordMutation,
} = extendedApi;
