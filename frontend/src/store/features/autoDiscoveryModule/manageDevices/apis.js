import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchManageDevices: builder.query({
      query: () => "/api/v1/auto_discovery/get_manage_devices",
    }),

    checkCredentialsStatus: builder.query({
      query: () => "/api/v1/auto_discovery/check_credentials_status",
    }),
  }),
});

export const {
  useFetchManageDevicesQuery: useFetchRecordsQuery,
  useCheckCredentialsStatusQuery,
} = extendedApi;

export const useCheckCredentialsStatusLazyQuery =
  extendedApi.endpoints.checkCredentialsStatus.useLazyQuery;
