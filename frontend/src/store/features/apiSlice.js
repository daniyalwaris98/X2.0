import { API_ENDPOINT_URL } from "../../utills/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const monetxApi = createApi({
  reducerPath: "monetxApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT_URL }),
  endpoints: (build) => ({}),
});
