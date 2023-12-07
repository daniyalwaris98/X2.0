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
        extendedApi.endpoints.addHwLifeCycles.matchFulfilled,
        (state, action) => {
          console.log(state, "addHwLifeCycles state");
          console.log(action, "addHwLifeCycles action");
          // action?.payload?.data?.forEach((responseItem) => {
          //   const indexToUpdate = state.all_data.findIndex((tableItem) => {
          //     return tableItem.sntc_id === responseItem.sntc_id;
          //   });
          //   if (indexToUpdate !== -1) {
          //     state.all_data[indexToUpdate] = responseItem;
          //   } else {
          //     state.all_data.push(responseItem);
          //   }
          // });
        }
      )
      .addMatcher(
        extendedApi.endpoints.syncFromInventory.matchFulfilled,
        (state, action) => {
          console.log(state, "syncFromInventory state");
          console.log(action, "syncFromInventory action");
          // action.payload.data?.forEach((responseItem) => {
          //   const indexToUpdate = state.all_data.findIndex((tableItem) => {
          //     return tableItem.sntc_id === responseItem.sntc_id;
          //   });
          //   if (indexToUpdate !== -1) {
          //     state.all_data[indexToUpdate] = responseItem;
          //   } else {
          //     state.all_data.push(responseItem);
          //   }
          // });
        }
      )
      .addMatcher(
        extendedApi.endpoints.syncToInventory.matchFulfilled,
        (state, action) => {
          console.log(state, "syncToInventory state");
          console.log(action, "syncToInventory action");
          // action.payload.data?.forEach((responseItem) => {
          //   const indexToUpdate = state.all_data.findIndex((tableItem) => {
          //     return tableItem.sntc_id === responseItem.sntc_id;
          //   });
          //   if (indexToUpdate !== -1) {
          //     state.all_data[indexToUpdate] = responseItem;
          //   } else {
          //     state.all_data.push(responseItem);
          //   }
          // });
        }
      )
      .addMatcher(
        extendedApi.endpoints.deleteHwLifeCycle.matchFulfilled,
        (state, action) => {
          const deletedIds = action.payload?.data || [];
          if (deletedIds.length > 0) {
            state.all_data = state.all_data.filter((item) => {
              const shouldKeepItem = deletedIds.some((deletedId) => {
                return deletedId === item.sntc_id;
              });
              return !shouldKeepItem;
            });
          }
        }
      )
      .addMatcher(
        extendedApi.endpoints.updateHwLifeCycle.matchFulfilled,
        (state, action) => {
          let objectToReplace = action.payload.data;
          state.all_data = state.all_data.map((item) => {
            if (item.sntc_id === objectToReplace.sntc_id) {
              return { ...item, ...objectToReplace };
            } else {
              return item;
            }
          });
        }
      );
  },
});

export default hwLifeCycleSlice.reducer;
