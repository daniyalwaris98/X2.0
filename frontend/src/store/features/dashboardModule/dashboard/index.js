
import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import {
  TABLE_DATA_UNIQUE_ID,
  ELEMENT_NAME,
} from "../../../../containers/atomModule/passwordGroups/constants";

import {
  useGetCredentialsSummaryQuery,
  useGetSnmpStatusQuery,
  useGetTopVendorForDiscoveryQuery,
} from "../../autoDiscoveryModule/dashboard/apis";

import { useSelector } from "react-redux";

const initialState = {
    configuration_by_time_data:[],


};

const defaultSlice = createSlice({
  name: ELEMENT_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
    .addMatcher(
      extendedApi.endpoints.getConfigurationByTime.matchFulfilled,
      (state, action) => {
        state.configration_by_time__data = action.payload;
      }
    )     
  },
});

export default defaultSlice.reducer;
