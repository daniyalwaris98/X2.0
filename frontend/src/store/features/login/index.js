import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const defaultSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("monetx_access_token");
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

export const { logout } = defaultSlice.actions;
export default defaultSlice.reducer;
