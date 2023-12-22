import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import { TABLE_DATA_UNIQUE_ID } from "../../../../containers/autoDiscoveryModule/discovery/constants";

const initialState = {
  all_data: [],
};

const discoverySlice = createSlice({
  name: "discovery",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      extendedApi.endpoints.fetchDiscoveredDevicesBySubnet.matchFulfilled,
      (state, action) => {
        state.all_data = action.payload;
      }
    );
  },
});

export default discoverySlice.reducer;
