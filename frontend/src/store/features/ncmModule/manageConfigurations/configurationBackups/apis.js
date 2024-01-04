import { monetxApi } from "../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNcmConfigurationBackupsByNcmDeviceId: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/add_password_groups",
        method: "POST",
        body: { ncm_device_id: 1 },
      }),
    }),

    deleteSingleNcmConfigurationBackupByNcmHistoryId: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/delete_password_group",
        method: "POST",
        body: { ncm_history_id: 1 },
      }),
    }),

    getNcmConfigurationBackupDetailsByNcmHistoryId: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/add_password_groups",
        method: "POST",
        body: { ncm_history_id: 1 },
      }),
    }),

    getAllDeletedNcmConfigurationBackupsByNcmDeviceId: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/add_password_groups",
        method: "POST",
        body: { ncm_device_id: 1 },
      }),
    }),

    restoreNcmConfigurationBackupsByNcmHistoryIds: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/add_password_groups",
        method: "POST",
        body: [0, 1, 2, 3],
      }),
    }),

    backupSingleNcmConfigurationByNcmDeviceId: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/add_password_groups",
        method: "POST",
        body: { ncm_device_id: 1 },
      }),
    }),
  }),
});

export const {
  useGetAllNcmConfigurationBackupsByNcmDeviceIdMutation:
    useFetchRecordsMutation,
  useDeleteSingleNcmConfigurationBackupByNcmHistoryIdMutation:
    useDeleteRecordsMutation,
  useGetNcmConfigurationBackupDetailsByNcmHistoryIdMutation,
  useGetAllDeletedNcmConfigurationBackupsByNcmDeviceIdMutation,
  useRestoreNcmConfigurationBackupsByNcmHistoryIdsMutation,
  useBackupSingleNcmConfigurationByNcmDeviceIdMutation,
} = extendedApi;
