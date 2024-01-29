import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  site_names: [],
  rack_names: [],
  vendor_names: [],
  function_names: [],
  device_type_names: [],
  password_group_names: [],
  password_group_type_names: [],
  status_names: [],
  subnet_names: [],
  active_status_names: [],
  monitoring_credentials_names: [],
  v3_credentials_authorization_protocols: [],
  v3_credentials_encryption_protocols: [],
  ipam_devices_fetch_dates: [],
};

const dropDownsSlice = createSlice({
  name: "drop_downs",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.fetchSiteNames.matchFulfilled,
        (state, action) => {
          state.site_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchRackNames.matchFulfilled,
        (state, action) => {
          state.rack_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchVendorNames.matchFulfilled,
        (state, action) => {
          state.vendor_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchFunctionNames.matchFulfilled,
        (state, action) => {
          state.function_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchDeviceTypeNames.matchFulfilled,
        (state, action) => {
          state.device_type_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchPasswordGroupNames.matchFulfilled,
        (state, action) => {
          state.password_group_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchPasswordGroupTypeNames.matchFulfilled,
        (state, action) => {
          state.password_group_type_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchStatusNames.matchFulfilled,
        (state, action) => {
          state.status_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchSubnetNames.matchFulfilled,
        (state, action) => {
          state.subnet_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchActiveStatusNames.matchFulfilled,
        (state, action) => {
          state.active_status_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchMonitoringCredentialsNames.matchFulfilled,
        (state, action) => {
          state.monitoring_credentials_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchV3CredentialsAuthorizationProtocolNames
          .matchFulfilled,
        (state, action) => {
          state.v3_credentials_authorization_protocols = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchV3CredentialsEncryptionProtocolNames
          .matchFulfilled,
        (state, action) => {
          state.monitoring_credentials_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchIpamDevicesFetchDates.matchFulfilled,
        (state, action) => {
          state.ipam_devices_fetch_dates = action.payload;
        }
      );
  },
});

export default dropDownsSlice.reducer;
