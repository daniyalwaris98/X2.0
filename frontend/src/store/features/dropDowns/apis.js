import { monetxApi } from "../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchSites: builder.query({
      query: () => "/api/v1/uam/site/get-sites-dropdown",
    }),

    fetchRacks: builder.query({
      query: (params) => ({
        url: `/api/v1/uam/rack/get-racks-by-site-dropdown`,
        params: { Site_name: params.site_name },
      }),
    }),

    fetchVendors: builder.query({
      query: () => "/api/v1/atom/static-list/get-vendor-list",
    }),

    fetchFunctions: builder.query({
      query: () => "/api/v1/atom/static-list/get-function-list",
    }),

    fetchDeviceTypes: builder.query({
      query: () => "/api/v1/atom/static-list/get-device-type-list",
    }),

    fetchPasswordGroups: builder.query({
      query: () => "/api/v1/atom/static-list/get-function-list",
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
