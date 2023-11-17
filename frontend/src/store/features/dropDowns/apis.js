import { monetxApi } from "../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchSites: builder.query({
      query: () => "/api/v1/uam/site/get_sites_dropdown",
    }),

    fetchRacks: builder.query({
      query: (params) => ({
        url: `/api/v1/uam/rack/get-racks-by-site-dropdown`,
        params: { site_name: params.site_name },
      }),
    }),

    fetchVendors: builder.query({
      query: () => "/api/v1/atom/static_list/get_vendor_list",
    }),

    fetchFunctions: builder.query({
      query: () => "/api/v1/atom/static_list/get_function_list",
    }),

    fetchDeviceTypes: builder.query({
      query: () => "/api/v1/atom/static_list/get_device_type_list",
    }),

    fetchPasswordGroups: builder.query({
      query: () => "/api/v1/atom/password_group/get_password_group_dropdown",
    }),
  }),
});

export const {
  useFetchSitesQuery,
  useFetchRacksQuery,
  useFetchVendorsQuery,
  useFetchFunctionsQuery,
  useFetchDeviceTypesQuery,
  useFetchPasswordGroupsQuery,
} = extendedApi;
