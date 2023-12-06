import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchHwLifeCycle: builder.query({
      query: () => "/api/v1/uam/uam_sntc/get_all_sntc",
    }),

    syncFromInventory: builder.query({
      query: () => "/api/v1/uam/uam_sntc/sync_from_inventory",
    }),

    syncToInventory: builder.query({
      query: () => "/api/v1/uam/uam_sntc/sync_to_inventory",
    }),

    deleteHwLifeCycleByPNCode: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/uam_sntc/delete_pn_code",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchHwLifeCycleQuery: useFetchRecordsQuery,
  useDeleteHwLifeCycleByPNCodeMutation: useDeleteRecordsMutation,
  useSyncFromInventoryQuery,
  useSyncToInventoryQuery,
} = extendedApi;
