import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apiss
    fetchCredentials: builder.query({
      query: () => "/api/v1/monitoring/credentials/add_snmp-v2_credentials",
    }),
  }),
});
export const { useFetchCredentialsQuery: useFetchRecordsQuery } = extendedApi;
