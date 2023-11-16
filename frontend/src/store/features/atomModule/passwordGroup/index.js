import { extendedApi } from "./apis";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";

const initialState = {
  table_data: [],
};

const passwordGroupSlice = createSlice({
  name: "password_group",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.fetchPasswordGroupTableData.matchFulfilled,
        (state, action) => {
          state.table_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.addTableMultipleData.matchFulfilled,
        (state, action) => {
          action.payload.data.forEach((responseItem) => {
            const indexToUpdate = state.table_data.findIndex((tableItem) => {
              return (
                tableItem.password_group_id === responseItem.password_group_id
              );
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
          const deletedIds = action.payload?.data || [];
          if (deletedIds.length > 0) {
            state.table_data = state.table_data.filter((item) => {
              const shouldKeepItem = deletedIds.some((deletedId) => {
                return deletedId === item.password_group_id;
              });
              return !shouldKeepItem;
            });
          }
        }
      )

      .addMatcher(
        extendedApi.endpoints.addTableSingleData.matchFulfilled,
        (state, action) => {
          state.table_data.push(action.payload.data);
        }
      )
      .addMatcher(
        extendedApi.endpoints.updateTableSingleData.matchFulfilled,
        (state, action) => {
          let objectToReplace = action.payload.data;
          state.table_data = state.table_data.map((item) => {
            if (item.password_group_id === objectToReplace.password_group_id) {
              return { ...item, ...objectToReplace };
            } else {
              return item;
            }
          });
        }
      );
  },
});

// export const { setNextPage, initiateItem } = passwordGroupSlice.actions;
export default passwordGroupSlice.reducer;
