import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import { TABLE_DATA_UNIQUE_ID } from "../../../../containers/atomModule/passwordGroup/constants";

const initialState = {
  all_data: [],
};

const passwordGroupSlice = createSlice({
  name: "password_group",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.fetchPasswordGroups.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.addPasswordGroups.matchFulfilled,
        (state, action) => {
          action.payload.data.forEach((responseItem) => {
            const indexToUpdate = state.all_data.findIndex((tableItem) => {
              return (
                tableItem[TABLE_DATA_UNIQUE_ID] ===
                responseItem[TABLE_DATA_UNIQUE_ID]
              );
            });
            if (indexToUpdate !== -1) {
              state.all_data[indexToUpdate] = responseItem;
            } else {
              state.all_data = [responseItem, ...state.all_data];
            }
          });
        }
      )
      .addMatcher(
        extendedApi.endpoints.deletePasswordGroups.matchFulfilled,
        (state, action) => {
          const deletedIds = action.payload?.data || [];
          if (deletedIds.length > 0) {
            state.all_data = state.all_data.filter((item) => {
              const shouldKeepItem = deletedIds.some((deletedId) => {
                return deletedId === item[TABLE_DATA_UNIQUE_ID];
              });
              return !shouldKeepItem;
            });
          }
        }
      )
      .addMatcher(
        extendedApi.endpoints.addPasswordGroup.matchFulfilled,
        (state, action) => {
          state.all_data = [action.payload.data, ...state.all_data];
        }
      )
      .addMatcher(
        extendedApi.endpoints.updatePasswordGroup.matchFulfilled,
        (state, action) => {
          let objectToReplace = action.payload.data;
          state.all_data = state.all_data.map((item) => {
            if (
              item[TABLE_DATA_UNIQUE_ID] ===
              objectToReplace[TABLE_DATA_UNIQUE_ID]
            ) {
              return { ...item, ...objectToReplace };
            } else {
              return item;
            }
          });
        }
      );
  },
});

export default passwordGroupSlice.reducer;
