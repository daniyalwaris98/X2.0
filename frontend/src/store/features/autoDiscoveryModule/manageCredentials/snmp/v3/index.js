import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import { TABLE_DATA_UNIQUE_ID } from "../../../../../../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v3/constants";

const initialState = {
  all_data: [],
};

const v3Slice = createSlice({
  name: "v3",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.fetchV3s.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.deleteV3s.matchFulfilled,
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
        extendedApi.endpoints.addV3.matchFulfilled,
        (state, action) => {
          state.all_data = [action.payload.data, ...state.all_data];
        }
      );
  },
});

export default v3Slice.reducer;
