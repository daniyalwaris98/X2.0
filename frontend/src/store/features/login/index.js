import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  company_details: null,
  user_details: null,
};

const defaultSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("monetx_access_token");
    },
    setCompanyDetails: (state, action) => {
      state.company_details = action.payload;
    },
    setUserDetails: (state, action) => {
      state.user_details = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      extendedApi.endpoints.login.matchFulfilled,
      (state, action) => {
        localStorage.setItem(
          "monetx_access_token",
          action.payload.data.access_token
        );
      }
    );
  },
});

export const { logout, setCompanyDetails, setUserDetails } =
  defaultSlice.actions;
export default defaultSlice.reducer;
