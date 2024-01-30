import { monetxApi } from "../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/api/v1/users/auth/sign_in",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation } = extendedApi;
