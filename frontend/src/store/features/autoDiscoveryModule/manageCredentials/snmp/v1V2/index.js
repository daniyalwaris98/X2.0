import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";
import { TABLE_DATA_UNIQUE_ID } from "../../../../../../containers/autoDiscoveryModule/manageCredentialsDropDown/snmpDropDown/v1V2/constants";

const initialState = {
  all_data: [],
};

const v1V2CredentialSlice = createSlice({
  name: "v1_v2_credential",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.fetchV1V2Credentials.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.deleteV1V2Credentials.matchFulfilled,
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
        extendedApi.endpoints.addV1V2Credential.matchFulfilled,
        (state, action) => {
          state.all_data = [action.payload.data, ...state.all_data];
        }
      )
      .addMatcher(
        extendedApi.endpoints.updateV1V2Credential.matchFulfilled,
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

export default v1V2CredentialSlice.reducer;
