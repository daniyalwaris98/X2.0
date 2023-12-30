import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import {
  TABLE_DATA_UNIQUE_ID,
  ELEMENT_NAME,
} from "../../../../../containers/ipamModule/subnetsDropDown/ipHistory/constants";

const initialState = {
  all_data: [],
  ip_history_by_ip_address: [],
};

const defaultSlice = createSlice({
  name: ELEMENT_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.getAllIpamIPHistory.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.getIpHistoryByIpAddress.matchFulfilled,
        (state, action) => {
          state.ip_history_by_ip_address = action.payload;
        }
      );
  },
});

export default defaultSlice.reducer;
