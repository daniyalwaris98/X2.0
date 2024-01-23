import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import {
  TABLE_DATA_UNIQUE_ID,
  ELEMENT_NAME,
} from "../../../../../containers/ipamModule/dnsServerDropDown/dnsZones/constants";

const initialState = {
  all_data: [],
  selected_dns_zone: {},
};

const defaultSlice = createSlice({
  name: ELEMENT_NAME,
  initialState,
  reducers: {
    setSelectedDnsZone: (state, action) => {
      state.selected_dns_zone = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      extendedApi.endpoints.getAllIpamDnsZones.matchFulfilled,
      (state, action) => {
        state.all_data = action.payload;
      }
    );
  },
});

export const { setSelectedDnsZone } = defaultSlice.actions;
export default defaultSlice.reducer;
