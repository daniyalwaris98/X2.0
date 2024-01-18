import { monetxApi } from "../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdminFailedDevices: builder.query({
      query: () => "/api/v1/atom/password_group/get_password_groups",
    }),
  }),
});

export const { useGetAllAdminFailedDevicesQuery: useFetchRecordsQuery } =
  extendedApi;
