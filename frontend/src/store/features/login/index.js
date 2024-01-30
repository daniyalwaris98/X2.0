import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token: null,
};

const defaultSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      extendedApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.access_token = action.payload.data.access_token;
        console.log(
          "action.payload.data.access_token",
          action.payload.data.access_token
        );
        localStorage.setItem(
          "monetx_access_token",
          action.payload.data.access_token
        );
      }
    );
  },
});

export default defaultSlice.reducer;
