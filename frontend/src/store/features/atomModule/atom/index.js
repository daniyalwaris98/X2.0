import { extendedApi } from "./apiSlice";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";

const initialState = {};
export const initialItemState = {
  page: 0,
  results: [],
  total_pages: 0,
  total_results: 0,
};

const discoverSlice = createSlice({
  name: "discover",
  initialState,
  reducers: {
    setNextPage: (state, action) => {
      const { mediaType, itemKey } = action.payload;
      state[mediaType][itemKey].page += 1;
    },
    initiateItem: (state, action) => {
      const { mediaType, itemKey } = action.payload;
      if (!state[mediaType]) {
        state[mediaType] = {};
      }
      if (!state[mediaType][itemKey]) {
        state[mediaType][itemKey] = initialItemState;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        isAnyOf(
          extendedApi.endpoints.getVideosByMediaTypeAndCustomGenre
            .matchFulfilled,
          extendedApi.endpoints.getVideosByMediaTypeAndGenreId.matchFulfilled
        ),
        (state, action) => {
          const {
            page,
            results,
            total_pages,
            total_results,
            mediaType,
            itemKey,
          } = action.payload;
          state[mediaType][itemKey].page = page;
          state[mediaType][itemKey].results.push(...results);
          state[mediaType][itemKey].total_pages = total_pages;
          state[mediaType][itemKey].total_results = total_results;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchTableData.matchFulfilled,
        (state, action) => {
          state.isTableLoading = false;
          state.tableData = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.addTableData.matchFulfilled,
        (state, action) => {
          state.isTableLoading = false;
          state.tableData = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.updateTableData.matchFulfilled,
        (state, action) => {
          state.isTableLoading = false;
          state.tableData = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.deleteTableData.matchFulfilled,
        (state, action) => {
          state.isTableLoading = false;
          state.tableData = action.payload;
        }
      );
  },
});

export const { setNextPage, initiateItem } = discoverSlice.actions;
export default discoverSlice.reducer;
