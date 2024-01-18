import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNcmDevices: builder.query({
      query: () => "/api/v1/ncm/ncm_device/get_all_ncm_devices",
    }),

    getAtomsToAddInNcmDevices: builder.query({
      query: () => "/api/v1/ncm/ncm_device/get_atom_in_ncm",
    }),

    addAtomsInNcmDevices: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ncm/ncm_device/add_ncm_from_atom",
        method: "POST",
        body: data,
      }),
    }),

    deleteNcmDevices: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ncm/ncm_device/delete_ncm_devices",
        method: "POST",
        body: data,
      }),
    }),

    // call this api on loop when bulk backup starts, end the loop when this api returns empty array
    getAllCompletedBackups: builder.query({
      query: () => "/api/v1/ncm/ncm_device/get_all_true_backup",
    }),

    bulkBackupNcmConfigurationsByDeviceIds: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ncm/ncm_device/bulk_backup_configuration",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllNcmDevicesQuery: useFetchRecordsQuery,
  useGetAtomsToAddInNcmDevicesQuery,
  useAddAtomsInNcmDevicesMutation,
  useDeleteNcmDevicesMutation: useDeleteRecordsMutation,
  // useGetAllCompletedBackupsQuery,
  useBulkBackupNcmConfigurationsByDeviceIdsMutation,
} = extendedApi;

export const useGetAllCompletedBackupsLazyQuery =
  extendedApi.endpoints.getAllCompletedBackups.useLazyQuery;
