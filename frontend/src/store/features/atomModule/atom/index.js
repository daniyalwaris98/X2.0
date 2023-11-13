import { extendedApi } from "./apis";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";

const initialState = {
  table_data: [],
};

const atomSlice = createSlice({
  name: "atom",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.fetchTableData.matchFulfilled,
        (state, action) => {
          state.table_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.addTableMultipleData.matchFulfilled,
        (state, action) => {
          state.table_data.push(...action.payload);
        }
      )
      .addMatcher(
        extendedApi.endpoints.deleteTableMultipleData.matchFulfilled,
        (state, action) => {
          const deletedIds = action.payload?.[0]?.data || [];
          if (deletedIds.length > 0) {
            state.table_data = state.table_data.filter((item) => {
              const atomId = item.atom_id;
              const transitionId = item.atom_transition_id;
              return !deletedIds.some(
                (id) =>
                  id.atom_id === atomId ||
                  id.atom_transition_id === transitionId
              );
            });
          }
        }
      )
      .addMatcher(
        extendedApi.endpoints.addTableSingleData.matchFulfilled,
        (state, action) => {
          action.payload.data.atom_table_id = Date.now();
          state.table_data.push(action.payload.data);
        }
      )
      .addMatcher(
        extendedApi.endpoints.updateTableSingleData.matchFulfilled,
        (state, action) => {
          let objectToReplace = action.payload.data;
          state.table_data = state.table_data.map((item) => {
            const { atom_id, atom_transition_id } = item;

            if (
              atom_id === objectToReplace.atom_id ||
              atom_transition_id === objectToReplace.atom_transition_id
            ) {
              return { ...item, ...objectToReplace };
            }

            return item;
          });
        }
      );
  },
});

// export const { setNextPage, initiateItem } = atomSlice.actions;
export default atomSlice.reducer;
