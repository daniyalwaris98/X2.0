import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  all_data: [],
};

const hwLifeCycleSlice = createSlice({
  name: "hw_life_cycle",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.fetchHwLifeCycle.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.syncFromInventory.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.syncToInventory.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.deleteHwLifeCycleByPNCode.matchFulfilled,
        (state, action) => {
          // const deletedIds = action.payload?.data || [];
          // if (deletedIds.length > 0) {
          //   state.all_data = state.all_data.filter((item) => {
          //     const shouldKeepItem = deletedIds.some((deletedId) => {
          //       return deletedId === item.site_id;
          //     });
          //     return !shouldKeepItem;
          //   });
          // }
        }
      );
  },
});

export default hwLifeCycleSlice.reducer;
