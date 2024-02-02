import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import {
  TABLE_DATA_UNIQUE_ID,
  ELEMENT_NAME,
} from "../../../../containers/atomModule/passwordGroups/constants";

import {
  useGetConfigurationBackupSummaryQuery,
  useGetConfigurationChangeByDeviceQuery,
} from "../../../features/ncmModule/dashboard/apis";

import { useSelector } from "react-redux";

const initialState = {
  configuration_change_by_device_data: [],
  configuration_backup_summary_data: [], 
  recent_rcm_alarms_data:[],
  recent_rcm_alarms_count_data:[],
};

const defaultSlice = createSlice({
  name: ELEMENT_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.getConfigurationBackupSummary.matchFulfilled,
        (state, action) => {
          state.configuration_backup_summary_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.getConfigurationChangeByDevice.matchFulfilled,
        (state, action) => {
          state.configuration_change_by_device_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.getRecentRcmAlarms.matchFulfilled,
        (state, action) => {
          state.recent_rcm_alarms_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.getRecentRcmAlarmsCount.matchFulfilled,
        (state, action) => {
          state.recent_rcm_alarms_count_data = action.payload;
        }
      );
  },
});

export default defaultSlice.reducer;
