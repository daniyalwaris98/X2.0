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
    checkIsAnyCompanyRegistered: builder.query({
      query: () => "/api/v1/users/user/check_end_user_existence",
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useValidateTokenMutation,
  useCheckIsAnyCompanyRegisteredQuery,
} = extendedApi;
