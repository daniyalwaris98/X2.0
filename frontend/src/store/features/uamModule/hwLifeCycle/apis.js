import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchHwLifeCycle: builder.query({
      query: () => "/api/v1/uam/uam-license/getAllLicenses",
    }),

    deleteHwLifeCycle: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addHwLifeCycle: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    updateHwLifeCycle: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useFetchHwLifeCycleQuery: useFetchRecordsQuery,
  useDeleteHwLifeCycleMutation: useDeleteRecordsMutation,
  // form apis
  useAddHwLifeCycleMutation: useAddRecordMutation,
  useUpdateHwLifeCycleMutation: useUpdateRecordMutation,
} = extendedApi;
