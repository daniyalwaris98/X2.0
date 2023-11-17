import { monetxApi } from "../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
<<<<<<< HEAD
    fetchSites: builder.query({
=======
    fetchSiteNames: builder.query({
>>>>>>> 3342d746a7f22cc25b90e82409495e78b87aeb3e
      query: () => "/api/v1/uam/site/get_sites_dropdown",
    }),

    fetchRackNames: builder.query({
      query: (params) => ({
        url: `/api/v1/uam/rack/get-racks-by-site-dropdown`,
        params: { site_name: params.site_name },
      }),
    }),

<<<<<<< HEAD
    fetchVendors: builder.query({
      query: () => "/api/v1/atom/static_list/get_vendor_list",
    }),

    fetchFunctions: builder.query({
      query: () => "/api/v1/atom/static_list/get_function_list",
    }),

    fetchDeviceTypes: builder.query({
=======
    fetchVendorNames: builder.query({
      query: () => "/api/v1/atom/static_list/get_vendor_list",
    }),

    fetchFunctionNames: builder.query({
      query: () => "/api/v1/atom/static_list/get_function_list",
    }),

    fetchDeviceTypeNames: builder.query({
>>>>>>> 3342d746a7f22cc25b90e82409495e78b87aeb3e
      query: () => "/api/v1/atom/static_list/get_device_type_list",
    }),

    fetchPasswordGroupNames: builder.query({
      query: () => "/api/v1/atom/password_group/get_password_group_dropdown",
    }),

    fetchPasswordGroupTypeNames: builder.query({
      query: () => "/api/v1/atom/static_list/get_password_group_type_dropdown",
    }),
  }),
});

export const {
  useFetchSiteNamesQuery,
  useFetchRackNamesQuery,
  useFetchVendorNamesQuery,
  useFetchFunctionNamesQuery,
  useFetchDeviceTypeNamesQuery,
  useFetchPasswordGroupNamesQuery,
  useFetchPasswordGroupTypeNamesQuery,
} = extendedApi;
