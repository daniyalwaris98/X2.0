import { configureStore } from "@reduxjs/toolkit";
import { monetxApi } from "./features/apiSlice";
import atomReducer from "./features/atomModule/atom";

export const store = configureStore({
  reducer: {
    atom: atomReducer,
    [monetxApi.reducerPath]: monetxApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(monetxApi.middleware),
});
