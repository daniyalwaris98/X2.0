import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchDevices: builder.query({
      query: () => "/api/v1/uam/uam-device/getAllDevices",
    }),
   
    deleteDevice: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/uam-device/deleteDevice",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addDevice: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/add_rack",
        method: "POST",
        body: data,
      }),
    }),
    updateDevice: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/uam-device/editDevice",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useFetchDevicesQuery: useFetchRecordsQuery,
  useDeleteDeviceMutation: useDeleteRecordsMutation,
  // form apis
  useAddDeviceMutation: useAddRecordMutation,
  useUpdateDeviceMutation: useUpdateRecordMutation,
} = extendedApi;
