import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchAps: builder.query({
      query: () => "/api/v1/uam/uam_aps/get_all_aps",
    }),

    deleteAps: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addAps: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    updateAps: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useFetchApsQuery: useFetchRecordsQuery,
  useDeleteApsMutation: useDeleteRecordsMutation,
  // form apis
  useAddApsMutation: useAddRecordMutation,
  useUpdateApsMutation: useUpdateRecordMutation,
} = extendedApi;
