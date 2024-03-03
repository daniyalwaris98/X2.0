import { monetxApi } from "../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getFunctionRunningStatus: builder.mutation({
      query: (data) => ({
        url: "/api/v1/common/common_routes/get_latest_function_state",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetFunctionRunningStatusMutation } = extendedApi;
