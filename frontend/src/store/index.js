import { configureStore } from "@reduxjs/toolkit";
import { monetxApi } from "./features/apiSlice";
import atomReducer from "./features/atomModule/atom";
import passwordGroupReducer from "./features/atomModule/passwordGroup";
import dropDownsReducer from "./features/dropDowns";

export const store = configureStore({
  reducer: {
    atom: atomReducer,
    passwordGroup: passwordGroupReducer,
    dropDowns: dropDownsReducer,
    [monetxApi.reducerPath]: monetxApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(monetxApi.middleware),
});
