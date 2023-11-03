import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchTableData: builder.query({
      query: () => "tableData", // Replace 'tableData' with your API endpoint for fetching table data
    }),

    getVideosByMediaTypeAndGenreId: builder.query({
      query: ({ mediaType, genreId, page }) => ({
        url: `/discover/${mediaType}`,
        params: { api_key: TMDB_V3_API_KEY, with_genres: genreId, page },
      }),
    }),

    getVideosByMediaTypeAndCustomGenre: builder.query({
      query: ({ mediaType, apiString, page }) => ({
        url: `/${mediaType}/${apiString}`,
        params: { api_key: TMDB_V3_API_KEY, page },
      }),
      transformResponse: (response, _, { mediaType, apiString }) => {
        return {
          ...response,
          mediaType,
          itemKey: apiString,
        };
      },
    }),

    addTableData: builder.mutation({
      query: (data) => ({
        url: "addTableData", // Replace 'addTableData' with your API endpoint for adding data
        method: "POST",
        body: data,
      }),
    }),

    updateTableData: builder.mutation({
      query: (data) => ({
        url: `updateTableData/${data.id}`, // Replace 'updateTableData' with your API endpoint for updating data
        method: "PUT",
        body: data,
      }),
    }),
    deleteTableData: builder.mutation({
      query: (id) => ({
        url: `deleteTableData/${id}`, // Replace 'deleteTableData' with your API endpoint for deleting data
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchTableDataQuery,
  useGetVideosByMediaTypeAndGenreIdQuery,
  useGetVideosByMediaTypeAndCustomGenreQuery,
  useAddTableDataQuery,
  useUpdateTableDataQuery,
  useDeleteTableDataQuery,
} = extendedApi;
