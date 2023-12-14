import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  all_data: [],
};

const credentialSlice = createSlice({
  name: "credential",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      extendedApi.endpoints.fetchCredentials.matchFulfilled,
      (state, action) => {
        state.all_data = action.payload;
      }
    );
  },
});

export default credentialSlice.reducer;
