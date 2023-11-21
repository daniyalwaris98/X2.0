import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchBoards: builder.query({
      query: () => "/api/v1/uam/uam-module/getAllBoards",
    }),
   
    deleteBoard: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/delete_rack",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addBoard: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/uam-module/addBoard",
        method: "POST",
        body: data,
      }),
    }),
    updateBoard: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/edit_rack",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useFetchBoardsQuery: useFetchRecordsQuery,
  useDeleteBoardMutation: useDeleteRecordsMutation,
  // form apis
  useAddBoardMutation: useAddRecordMutation,
  useUpdateBoardMutation: useUpdateRecordMutation,
} = extendedApi;
