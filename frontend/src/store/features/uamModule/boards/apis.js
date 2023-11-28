import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchBoards: builder.query({
      query: () => "/api/v1/uam/uam-module/get_all_boards",
    }),

    deleteBoard: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addBoard: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/uam-module/add_board",
        method: "POST",
        body: data,
      }),
    }),
    updateBoard: builder.mutation({
      query: (data) => ({
        url: "",
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
