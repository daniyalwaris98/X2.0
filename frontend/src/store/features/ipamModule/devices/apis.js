import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllIpamDevices: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_all_ipam_devices",
    }),

    getIpamDevicesFetchDates: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_ipam_devices_fetch_dates",
    }),

    getIpamDevicesByFetchDate: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ipam/ipam_device/get_ipam_devices_by_fetch_dates",
        method: "POST",
        body: data, //{date:""}
      }),
    }),

    fetchIpamDevices: builder.query({
      query: () => "/api/v1/ipam/ipam_device/fetch_ipam_devices",
    }),

    getAtomsToAddInIpamDevices: builder.query({
      query: () => "/api/v1/ipam/ipam_device/get_atom_in_ipam",
    }),

    addAtomsInIpamDevices: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ipam/ipam_device/add_atom_in_ipam",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllIpamDevicesQuery: useFetchRecordsQuery,
  useGetAtomsToAddInIpamDevicesQuery,
  useAddAtomsInIpamDevicesMutation,
  useGetIpamDevicesFetchDatesQuery,
  useGetIpamDevicesByFetchDateMutation,
} = extendedApi;

export const useFetchIpamDevicesLazyQuery =
  extendedApi.endpoints.fetchIpamDevices.useLazyQuery;
