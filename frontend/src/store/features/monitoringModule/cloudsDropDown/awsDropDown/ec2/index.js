import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import {
  TABLE_DATA_UNIQUE_ID,
  ELEMENT_NAME,
} from "../../../../../../../src/containers/monitoringModule/cloudsDropDown/awsDropDown/e3/constants";
//  /ipamModule/dnsServerDropDown/dnsRecords/constants

const initialState = {
  all_data: [],
};

const defaultSlice = createSlice({
  name: ELEMENT_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      extendedApi.endpoints.getAllMonitoringE3Records.matchFulfilled,
      (state, action) => {
        state.all_data = action.payload;
      }
    );
  },
});

export default defaultSlice.reducer;
