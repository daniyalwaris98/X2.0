import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMonitoringDevices: builder.query({
      query: () => "/api/v1/monitoring/devices/get_all_monitoring_devices",
    }),

    deleteMonitoringDevices: builder.mutation({
      query: (data) => ({
        url: "/api/v1/monitoring/devices/delete_monitoring_devices",
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
        body: { atom_id: 0, monitoring_credentials_id: 0 },
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
