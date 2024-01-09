import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMonitoringDevices: builder.query({
      query: () => "/api/v1/monitoring/devices/get_all_monitoring_devices",
    }),

    fetchMonitoringDevices: builder.query({
      query: () => "/api/v1/ipam/ipam_device/fetch_ipam_devices",
    }),

    deleteMonitoringDevices: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/delete_password_group",
        method: "POST",
        body: data,
      }),
    }),

    getAtomsToAddInMonitoringDevices: builder.query({
      query: () => "/api/v1/monitoring/devices/get_atom_in_monitoring",
    }),

    addAtomsInMonitoringDevices: builder.mutation({
      query: (data) => ({
        url: "/api/v1/monitoring/devices/add_atom_in_monitoring",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllMonitoringDevicesQuery: useFetchRecordsQuery,
  useDeleteMonitoringDevicesMutation: useDeleteRecordsMutation,
  useGetAtomsToAddInMonitoringDevicesQuery,
  useAddAtomsInMonitoringDevicesMutation,
} = extendedApi;

export const useFetchMonitoringDevicesLazyQuery =
  extendedApi.endpoints.fetchMonitoringDevices.useLazyQuery;
