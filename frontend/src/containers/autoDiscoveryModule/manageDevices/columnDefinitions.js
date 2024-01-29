import { indexColumnNameConstants } from "./constants";

export function useIndexTableColumnDefinitions({} = {}) {
  const columnDefinitions = [
    indexColumnNameConstants.IP_ADDRESS,
    indexColumnNameConstants.OS_TYPE,
    indexColumnNameConstants.FUNCTION,
    indexColumnNameConstants.SNMP,
    indexColumnNameConstants.LOGIN,
  ];

  const dataKeys = columnDefinitions
    .map((item) => {
      if (typeof item === "object") {
        return item.data_key;
      } else {
        return item;
      }
    })
    .filter((item) => true);

  return {
    columnDefinitions,
    dataKeys,
  };
}
