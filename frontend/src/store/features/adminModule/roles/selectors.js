export const selectTableData = (state) => state.admin_roles_reducer.all_data;
export const selectSelectedRole = (state) =>
  state.admin_roles_reducer.selected_role;
export const selectSelectedRoleForComparison = (state) =>
  state.admin_roles_reducer.selected_role_for_comparison;
