import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  all_data: [],
};

const rackSlice = createSlice({
  name: "rack",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.fetchRacks.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.deleteRack.matchFulfilled,
        (state, action) => {
          const deletedIds = action.payload?.data || [];
          if (deletedIds.length > 0) {
            state.all_data = state.all_data.filter((item) => {
              const shouldKeepItem = deletedIds.some((deletedId) => {
                return deletedId === item.rack_id;
              });
              return !shouldKeepItem;
            });
          }
        }
      )
      .addMatcher(
        extendedApi.endpoints.addRack.matchFulfilled,
        (state, action) => {
          state.all_data.push(action.payload.data);
        }
      )
      .addMatcher(
        extendedApi.endpoints.updateRack.matchFulfilled,
        (state, action) => {
          let objectToReplace = action.payload.data;
          state.all_data = state.all_data.map((item) => {
            if (item.rack_id === objectToReplace.rack_id) {
              return { ...item, ...objectToReplace };
            } else {
              return item;
            }
          });
        }
      );
  },
});

export default rackSlice.reducer;
