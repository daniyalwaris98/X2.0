import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import {
  TABLE_DATA_UNIQUE_ID,
  ELEMENT_NAME,
} from "../../../../../containers/ipamModule/dnsServerDropDown/dnsZones/constants";
import { persistReducer } from "redux-persist";
import persistConfig from "./persistConfig";

const initialState = {
  all_data: [],
  selected_dns_zone: null,
};

const defaultSlice = createSlice({
  name: ELEMENT_NAME,
  initialState,
  reducers: {
    setSelectedDnsZone: (state, action) => {
      console.log("action.payload", action.payload);
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

const persistedReducer = persistReducer(persistConfig, defaultSlice.reducer);
export default persistedReducer;
