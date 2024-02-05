import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import {
  TABLE_DATA_UNIQUE_ID,
  ELEMENT_NAME,
} from "../../../../containers/atomModule/passwordGroups/constants";

import {
  useGetConfigurationBackupSummaryQuery,
  useGetConfigurationChangeByDeviceQuery,
} from "../../ncmModule/dashboard/apis";

import { useSelector } from "react-redux";

const initialState = {
  top_ten_subnet_data: [],

};

const defaultSlice = createSlice({
  name: ELEMENT_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.getTopTenSubnet.matchFulfilled,
        (state, action) => {
          state.top_ten_subnet_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.getNcmChangeByVendor.matchFulfilled,
        (state, action) => {
          state.ncm_change_by_vendor_data = action.payload;
        }
      )
    //   .addMatcher(
    //     extendedApi.endpoints.getConfigurationChangeByDevice.matchFulfilled,
    //     (state, action) => {
    //       state.configuration_change_by_device_data = action.payload;
    //     }
    //   )
    //   .addMatcher(
    //     extendedApi.endpoints.getRecentRcmAlarms.matchFulfilled,
    //     (state, action) => {
    //       state.recent_rcm_alarms_data = action.payload;
    //     }
    //   )
    //   .addMatcher(
    //     extendedApi.endpoints.getRecentRcmAlarmsCount.matchFulfilled,
    //     (state, action) => {
    //       state.recent_rcm_alarms_count_data = action.payload;
    //     }
    //   )
    //   .addMatcher(
    //     extendedApi.endpoints.getNcmDeviceSummaryTable.matchFulfilled,
    //     (state, action) => {
    //       state.ncm_device_summary_table_data = action.payload;
    //     }
    //   )
    //   .addMatcher(
    //     extendedApi.endpoints.getConfigurationChangeByVendor.matchFulfilled,
    //     (state, action) => {
    //       state.configuration_change_by_vendor_data = action.payload;
    //     }
    //   )
    
      ;
  },
});

export default defaultSlice.reducer;
