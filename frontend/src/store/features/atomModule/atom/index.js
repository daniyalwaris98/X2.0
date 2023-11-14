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
          let responseData = action.payload[0]?.success_list.map(
            (item) => item.data
          );

          responseData.forEach((responseItem) => {
            const indexToUpdate = state.table_data.findIndex((tableItem) => {
              let atomId = responseItem.atom_id;
              let atomTransitionId = responseItem.atom_transition_id;

              if (atomId) {
                return tableItem.atom_id === atomId;
              } else {
                return tableItem.atom_transition_id === atomTransitionId;
              }
            });

            if (indexToUpdate !== -1) {
              state.table_data[indexToUpdate] = responseItem;
            } else {
              state.table_data.push(responseItem);
            }
          });
        }
      )
      .addMatcher(
        extendedApi.endpoints.deleteTableMultipleData.matchFulfilled,
        (state, action) => {
          const deletedIds = action.payload[0]?.data || [];
          if (deletedIds.length > 0) {
            state.table_data = state.table_data.filter((item) => {
              const atomId = item.atom_id;
              const transitionId = item.atom_transition_id;
              const shouldKeepItem = deletedIds.some((id) => {
                if (atomId) {
                  return id.atom_id === atomId;
                } else {
                  return id.atom_tranistion_id === transitionId;
                }
              });
              return !shouldKeepItem;
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
