import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import {
  TABLE_DATA_UNIQUE_ID,
  ELEMENT_NAME,
} from "../../../../../../containers/monitoringModule/cloudsDropDown/awsDropDown/s3/constants";

const initialState = {
  all_data: [],
};

const defaultSlice = createSlice({
  name: ELEMENT_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      extendedApi.endpoints.getAllS3s.matchFulfilled,
      (state, action) => {
        state.all_data = action.payload;
      }
    );
  },
});

export default defaultSlice.reducer;
