export const PAGE_NAME = "Manage Credentials";
export const ELEMENT_NAME = "Credentials";
export const PAGE_PATH = "manage_credentials";
export const FILE_NAME_EXPORT_ALL_DATA = "all_managed_credentials";
export const FILE_NAME_EXPORT_TEMPLATE = "managed_credentials_template";
export const TABLE_DATA_UNIQUE_ID = "credentials_id";
export const indexV1V2ColumnNameConstants = {
  MANAGE_NETWORK_ID: TABLE_DATA_UNIQUE_ID,
  DESCRIPTION: "description",
  VERSION: "version",
  PROFILE_NAME: "profile_name",
  COMMUNITY: "community",
  ACTIONS: "actions",
};
export const indexV3ColumnNameConstants = {
  MANAGE_NETWORK_ID: TABLE_DATA_UNIQUE_ID,
  PROFILE_NAME: "profile_name",
  USER_NAME: "user_name",
  DESCRIPTION: "description",
  PORT: "port",
  AUTHENTICATION_PROTOCOL: "authentication_protocol",
  AUTHENTICATION_PASSWORD: "authentication_password",
  ENCRYPTION_PROTOCOL: "encryption_protocol",
  ENCRYPTION_PASSWORD: "encryption_password",
  ACTIONS: "actions",
};
