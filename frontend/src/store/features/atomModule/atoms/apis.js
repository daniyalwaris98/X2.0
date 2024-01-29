import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchAtoms: builder.query({
      query: () => "/api/v1/atom/atom/get_atoms",
    }),

    getAtomsDevicesFromDiscovery: builder.query({
      query: () => "/api/v1/atom/atom/get_atoms_devices_from_discovery",
    }),

    addAtomsDevicesFromDiscovery: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/add_atom_devices_from_discovery",
        method: "POST",
        body: data,
      }),
    }),

    addAtoms: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/add_atom_devices",
        method: "POST",
        body: data,
      }),
      keepUnusedDataFor: 0,
    }),

    deleteAtoms: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/delete_atom",
        method: "POST",
        body: data,
      }),
    }),

    onBoardAtoms: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/uam_device/on_board_device",
        method: "POST",
        body: data,
      }),
    }),

    addAtom: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/add_atom_device",
        method: "POST",
        body: data,
      }),
    }),

    updateAtom: builder.mutation({
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
  useFetchAtomsQuery: useFetchRecordsQuery,
  useAddAtomsMutation: useAddRecordsMutation,
  useDeleteAtomsMutation: useDeleteRecordsMutation,
  useOnBoardAtomsMutation: useOnBoardRecordsMutation,
  useAddAtomMutation: useAddRecordMutation,
  useUpdateAtomMutation: useUpdateRecordMutation,
  useGetAtomsDevicesFromDiscoveryQuery,
  useAddAtomsDevicesFromDiscoveryMutation,
} = extendedApi;
