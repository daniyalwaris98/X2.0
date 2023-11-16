import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchPasswordGroupTableData: builder.query({
      query: () => "/api/v1/atom/password_group/get_password_groups",
    }),

    addTableMultipleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/add_password_groups",
        method: "POST",
        body: data,
      }),
    }),

    deleteTableMultipleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/delete_password_group",
        method: "POST",
        body: data,
      }),
    }),

    // form apis
    addTableSingleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/add_password_group",
        method: "POST",
        body: data,
      }),
    }),

    updateTableSingleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/edit_password_group",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useFetchPasswordGroupTableDataQuery: useFetchTableDataQuery,
  useAddTableMultipleDataMutation,
  useDeleteTableMultipleDataMutation,
  // form apis
  useAddTableSingleDataMutation,
  useUpdateTableSingleDataMutation,
} = extendedApi;
