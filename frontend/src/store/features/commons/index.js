import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  function_running_status: null,
};

const defaultSlice = createSlice({
  name: "commons",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      extendedApi.endpoints.getFunctionRunningStatus.matchFulfilled,
      (state, action) => {
        state.function_running_status = action.payload.data;
      }
    );
  },
});

export default defaultSlice.reducer;
