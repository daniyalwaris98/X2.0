import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import { TABLE_DATA_UNIQUE_ID } from "../../../../containers/autoDiscoveryModule/manageDevices/constants";

const initialState = {
  all_data: [],
};

const manageDevicesSlice = createSlice({
  name: "manage_devices",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      extendedApi.endpoints.fetchManageDevices.matchFulfilled,
      (state, action) => {
        state.all_data = action.payload;
      }
    );
  },
});

export default manageDevicesSlice.reducer;
