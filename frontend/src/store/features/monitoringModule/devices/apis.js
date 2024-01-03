import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchDevices: builder.query({
      query: () => "/api/v1/monitoring/devices/get_all_monitoring_devices",
    }),

    deleteDevices: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/site/delete_sites",
        method: "POST",
        body: data,
      }),
    }),

    // form apis
    addDevice: builder.mutation({
      query: (data) => ({
        url: "/api/v1/monitoring/devices/add_monitoring_device",
        method: "POST",
        body: data,
      }),
    }),

    updateDevice: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/site/edit_site",
        method: "POST",
        body: data,
      }),
    }),
  }), 
});
export const {
  useFetchDevicesQuery: useFetchRecordsQuery,
  useDeleteDevicesMutation: useDeleteRecordsMutation,
  // form apis
  useAddDeviceMutation: useAddRecordMutation,
  useUpdateDeviceMutation: useUpdateRecordMutation,
} = extendedApi;
