import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import {
  TABLE_DATA_UNIQUE_ID,
  ELEMENT_NAME,
} from "../../../../../containers/ipamModule/subnetsDropDown/ipDetails/constants";

const initialState = {
  all_data: [],
  ip_details_by_subnet_address: [
    { ip_address: "56345634" },
    { ip_address: "3214567" },
  ],
};

const defaultSlice = createSlice({
  name: ELEMENT_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.getAllIpamIPDetails.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.getIpDetailsBySubnetAddress.matchFulfilled,
        (state, action) => {
          // state.ip_details_by_subnet_address = action.payload;
        }
      );
  },
});

export default defaultSlice.reducer;
