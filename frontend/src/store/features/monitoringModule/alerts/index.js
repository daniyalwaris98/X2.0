import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  all_data: [],
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      extendedApi.endpoints.getAllAlerts.matchFulfilled,
      (state, action) => {
        state.all_data = action.payload;
      }
    );
  },
});

export default alertSlice.reducer;
