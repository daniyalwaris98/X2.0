import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchAtomTableData: builder.query({
      query: () => "/api/v1/atom/atom/get_atoms",
    }),

    addTableMultipleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/add_atom_devices",
        method: "POST",
        body: data,
      }),
    }),

    deleteTableMultipleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/delete_atom",
        method: "POST",
        body: data,
      }),
    }),

    // form apis
    addTableSingleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/add_atom_device",
        method: "POST",
        body: data,
      }),
    }),

    updateTableSingleData: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/edit_atom",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useFetchAtomTableDataQuery: useFetchTableDataQuery,
  useAddTableMultipleDataMutation,
  useDeleteTableMultipleDataMutation,
  // form apis
  useAddTableSingleDataMutation,
  useUpdateTableSingleDataMutation,
} = extendedApi;
