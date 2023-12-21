import { monetxApi } from "../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchSSHLoginCredentials: builder.query({
      query: () => "/api/v1/auto_discovery/get_ssh_login_credentials",
    }),
  }),
});

export const { useFetchSSHLoginCredentialsQuery: useFetchRecordsQuery } =
  extendedApi;
