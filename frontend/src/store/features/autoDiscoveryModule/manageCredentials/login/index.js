import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import { TABLE_DATA_UNIQUE_ID } from "../../../../../containers/autoDiscoveryModule/manageCredentialsDropDown/login/constants";

const initialState = {
  all_data: [],
};

const passwordGroupSlice = createSlice({
  name: "ssh_login_credentials",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      extendedApi.endpoints.fetchSSHLoginCredentials.matchFulfilled,
      (state, action) => {
        state.all_data = action.payload;
      }
    );
  },
});

export default passwordGroupSlice.reducer;
