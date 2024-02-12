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
    register: builder.mutation({
      query: (data) => ({
        url: "/api/v1/users/auth/sign_up",
        method: "POST",
        body: data,
      }),
    }),
    validateToken: builder.mutation({
      query: (data) => ({
        url: "/api/v1/users/auth/validate_sign_in_token",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useValidateTokenMutation,
} = extendedApi;
