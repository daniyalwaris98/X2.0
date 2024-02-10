export const selectCompanyDetails = (state) => state.login.company_details;
export const selectUserDetails = (state) => state.login.user_details;
export const selectIsValidAccessToken = (state) =>
  state.login.is_valid_access_token;
