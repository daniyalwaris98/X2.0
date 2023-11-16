import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchPasswordGroupTableData: builder.query({
      query: () => "/api/v1/uam/site/get_all_sites",
    }),

    addTableMultipleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/site/add_site",
        method: "POST",
        body: data,
      }),
    }),

    deleteTableMultipleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/site/delete_site",
        method: "POST",
        body: data,
      }),
    }),

    // form apis
    addTableSingleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/site/add_site",
        method: "POST",
        body: data,
      }),
    }),

    updateTableSingleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/site/edit_site",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useFetchSlicesTableDataQuery: useFetchTableDataQuery,
  useAddTableMultipleDataMutation,
  useDeleteTableMultipleDataMutation,
  // form apis
  useAddTableSingleDataMutation,
  useUpdateTableSingleDataMutation,
} = extendedApi;
