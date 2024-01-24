import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import {
  TABLE_DATA_UNIQUE_ID,
  ELEMENT_NAME,
} from "../../../../containers/ipamModule/devices/constants";

const initialState = {
  all_data: [],
  atoms_to_add_in_ipam_devices: [],
  ipam_devices_fetch_dates: [],
};

const defaultSlice = createSlice({
  name: ELEMENT_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.getAllIpamDevices.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.getIpamDevicesFetchDates.matchFulfilled,
        (state, action) => {
          // state.ipam_devices_fetch_dates = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.getIpamDevicesByFetchDate.matchFulfilled,
        (state, action) => {
          // state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchIpamDevices.matchFulfilled,
        (state, action) => {
          action.payload.data.forEach((responseItem) => {
            const indexToUpdate = state.all_data.findIndex((tableItem) => {
              return (
                tableItem[TABLE_DATA_UNIQUE_ID] ===
                responseItem[TABLE_DATA_UNIQUE_ID]
              );
            });
            if (indexToUpdate !== -1) {
              state.all_data[indexToUpdate] = responseItem;
            } else {
              state.all_data = [responseItem, ...state.all_data];
            }
          });
        }
      )
      .addMatcher(
        extendedApi.endpoints.getAtomsToAddInIpamDevices.matchFulfilled,
        (state, action) => {
          state.atoms_to_add_in_ipam_devices = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.addAtomsInIpamDevices.matchFulfilled,
        (state, action) => {
          action.payload.data.forEach((responseItem) => {
            const indexToUpdate = state.all_data.findIndex((tableItem) => {
              return (
                tableItem[TABLE_DATA_UNIQUE_ID] ===
                responseItem[TABLE_DATA_UNIQUE_ID]
              );
            });
            if (indexToUpdate !== -1) {
              state.all_data[indexToUpdate] = responseItem;
            } else {
              state.all_data = [responseItem, ...state.all_data];
            }
          });
        }
      );
  },
});

export default defaultSlice.reducer;
