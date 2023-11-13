import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sites: [],
  racks: [],
  vendors: [],
  functions: [],
  device_types: [],
  password_groups: [],
};

const dropDownsSlice = createSlice({
  name: "dropDowns",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.fetchSites.matchFulfilled,
        (state, action) => {
          state.sites = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchRacks.matchFulfilled,
        (state, action) => {
          state.racks = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchVendors.matchFulfilled,
        (state, action) => {
          state.vendors = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchFunctions.matchFulfilled,
        (state, action) => {
          state.functions = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchDeviceTypes.matchFulfilled,
        (state, action) => {
          state.device_types = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchPasswordGroups.matchFulfilled,
        (state, action) => {
          state.password_groups = action.payload;
        }
      );
  },
});

export default dropDownsSlice.reducer;
