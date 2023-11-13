import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchTableData: builder.query({
      query: () => "/api/v1/atom/atom/get-atoms",
    }),

    addTableMultipleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/add-atom-devices",
        method: "POST",
        body: data,
      }),
    }),

    deleteTableMultipleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/delete-atom",
        method: "POST",
        body: data,
      }),
    }),

    // form apis
    addTableSingleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/add-atom-device",
        method: "POST",
        body: data,
      }),
    }),

    updateTableSingleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/edit-atom",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchTableDataQuery,
  useAddTableMultipleDataMutation,
  useDeleteTableMultipleDataMutation,
  // form apis
  useAddTableSingleDataMutation,
  useUpdateTableSingleDataMutation,
} = extendedApi;
