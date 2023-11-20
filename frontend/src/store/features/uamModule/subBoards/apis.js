import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchSubBoards: builder.query({
      query: () => "/api/v1/uam/uam-module/getAllSubBoards",
    }),
   
    deleteSubBoard: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/delete_rack",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addSubBoard: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/uam-module/addBoard",
        method: "POST",
        body: data,
      }),
    }),
    updateSubBoard: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/edit_rack",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useFetchSubBoardsQuery: useFetchRecordsQuery,
  useDeleteSubBoardMutation: useDeleteRecordsMutation,
  // form apis
  useAddSubBoardMutation: useAddRecordMutation,
  useUpdateSubBoardMutation: useUpdateRecordMutation,
} = extendedApi;
