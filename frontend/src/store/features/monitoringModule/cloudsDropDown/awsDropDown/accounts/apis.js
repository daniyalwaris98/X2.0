import { monetxApi } from "../../../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMonitoringAwsAccounts: builder.query({
      query: () => "/api/v1/atom/password_group/get_password_groups",
    }),

    deleteMonitoringAwsAccounts: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/delete_password_group",
        method: "POST",
        body: data,
      }),
    }),

    addMonitoringAwsAccount: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/add_password_group",
        method: "POST",
        body: data,
      }),
    }),

    updateMonitoringAwsAccount: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/edit_password_group",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllMonitoringAwsAccountsQuery: useFetchRecordsQuery,
  useDeleteMonitoringAwsAccountsMutation: useDeleteRecordsMutation,
  useAddMonitoringAwsAccountMutation: useAddRecordMutation,
  useUpdateMonitoringAwsAccountMutation: useUpdateRecordMutation,
} = extendedApi;
