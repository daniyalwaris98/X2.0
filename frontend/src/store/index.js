import { configureStore } from "@reduxjs/toolkit";
import { monetxApi } from "./features/apiSlice";
import atomReducer from "./features/atomModule/atom";
import passwordGroupReducer from "./features/atomModule/passwordGroup";
import siteReducer from "./features/uamModule/sites"
import dropDownsReducer from "./features/dropDowns";

export const store = configureStore({
  reducer: {
    atom: atomReducer,
    password_group: passwordGroupReducer,
    site:siteReducer,
    drop_downs: dropDownsReducer,
    [monetxApi.reducerPath]: monetxApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(monetxApi.middleware),
});
