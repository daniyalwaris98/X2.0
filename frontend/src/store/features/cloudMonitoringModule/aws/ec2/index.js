import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import {
  TABLE_DATA_UNIQUE_ID,
  ELEMENT_NAME,
} from "../../../../../containers/cloudMonitoringModule/aws/ec2/constants";

const initialState = {
  all_data: [],
};

const defaultSlice = createSlice({
  name: ELEMENT_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.getAllEC2s.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.changeEC2Status.matchFulfilled,
        (state, action) => {
          let objectToReplace = action.payload.data;
          state.all_data = state.all_data.map((item) => {
            if (
              item[TABLE_DATA_UNIQUE_ID] ===
              objectToReplace[TABLE_DATA_UNIQUE_ID]
            ) {
              return { ...item, ...objectToReplace };
            } else {
              return item;
            }
          });
        }
      );
  },
});

export default defaultSlice.reducer;
