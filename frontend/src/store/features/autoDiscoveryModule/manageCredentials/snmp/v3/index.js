import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import { TABLE_DATA_UNIQUE_ID } from "../../../../../../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v3/constants";

const initialState = {
  all_data: [],
};

const v3CredentialSlice = createSlice({
  name: "v3Credential",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.fetchV3Credentials.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.deleteV3Credentials.matchFulfilled,
        (state, action) => {
          const deletedIds = action.payload?.data || [];
          if (deletedIds.length > 0) {
            state.all_data = state.all_data.filter((item) => {
              const shouldKeepItem = deletedIds.some((deletedId) => {
                return deletedId === item[TABLE_DATA_UNIQUE_ID];
              });
              return !shouldKeepItem;
            });
          }
        }
      )
      .addMatcher(
        extendedApi.endpoints.addV3Credential.matchFulfilled,
        (state, action) => {
          state.all_data = [action.payload.data, ...state.all_data];
        }
      )
      .addMatcher(
        extendedApi.endpoints.updateV3Credential.matchFulfilled,
        (state, action) => {
          let objectToReplace = action.payload.data;
          state.all_data = state.all_data.map((item) => {
            if (
              item[TABLE_DATA_UNIQUE_ID] ===
              objectToReplace[TABLE_DATA_UNIQUE_ID]
            ) {
              return { ...item, ...objectToReplace };
            } else {
              return item;
            }
          });
        }
      );
  },
});

export default v3CredentialSlice.reducer;
