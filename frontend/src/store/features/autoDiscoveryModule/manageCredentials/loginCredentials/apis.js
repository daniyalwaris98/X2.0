import { monetxApi } from "../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchAutoDiscoverySSHLoginCredentials: builder.query({
      query: () => "/api/v1/auto_discovery/get_ssh_login_credentials",
    }),
  }),
});

export const {
  useFetchAutoDiscoverySSHLoginCredentialsQuery: useFetchRecordsQuery,
} = extendedApi;
