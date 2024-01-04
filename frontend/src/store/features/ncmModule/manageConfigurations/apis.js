import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNcmConfigurations: builder.query({
      query: () => "/api/v1/atom/password_group/get_password_groups",
    }),

    addNcmConfigurations: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/add_password_groups",
        method: "POST",
        body: data,
      }),
    }),

    deleteNcmConfigurations: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/delete_password_group",
        method: "POST",
        body: data,
      }),
    }),

    addNcmConfiguration: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/add_password_group",
        method: "POST",
        body: data,
      }),
    }),

    updateNcmConfiguration: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/edit_password_group",
        method: "POST",
        body: data,
      }),
    }),

    bulkBackupNcmConfigurationsByDeviceIds: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/edit_password_group",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllNcmConfigurationsQuery: useFetchRecordsQuery,
  useAddNcmConfigurationsMutation: useAddRecordsMutation,
  useDeleteNcmConfigurationsMutation: useDeleteRecordsMutation,
  useAddNcmConfigurationMutation: useAddRecordMutation,
  useUpdateNcmConfigurationMutation: useUpdateRecordMutation,
  useBulkBackupNcmConfigurationsByDeviceIdsMutation,
} = extendedApi;
