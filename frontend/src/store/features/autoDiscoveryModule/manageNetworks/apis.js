import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchNetworks: builder.query({
      query: () => "/api/v1/auto_discovery/get_all_networks",
    }),
    addNetworks: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/add_networks",
        method: "POST",
        body: data,
      }),
    }),
    deleteNetworks: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/delete_networks",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addNetwork: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/add_network",
        method: "POST",
        body: data,
      }),
    }),
    updateNetwork: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auto_discovery/edit_network",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchNetworksQuery: useFetchRecordsQuery,
  useAddNetworksMutation: useAddRecordsMutation,
  useDeleteNetworksMutation: useDeleteRecordsMutation,
  // form apis
  useAddNetworkMutation: useAddRecordMutation,
  useUpdateNetworkMutation: useUpdateRecordMutation,
} = extendedApi;
