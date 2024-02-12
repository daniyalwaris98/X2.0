import * as yup from "yup";
import { getTitle, isValidIPAddress } from "../../../../utils/helpers";
import { ALPHA_NUMERIC_REGEX } from "../../../../utils/constants/regex";
import { indexColumnNameConstants } from "./constants";

export const defaultSchema = yup.object().shape({
  [indexColumnNameConstants.IP_ADDRESS]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.IP_ADDRESS)} is required`)
    .test(
      `valid ${indexColumnNameConstants.IP_ADDRESS}`,
      `Invalid ${getTitle(indexColumnNameConstants.IP_ADDRESS)}`,
      (value) => isValidIPAddress(value)
    ),
  [indexColumnNameConstants.SERVER_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.SERVER_NAME)} is required`)
    .matches(ALPHA_NUMERIC_REGEX, "Invalid characters found"),
  [indexColumnNameConstants.USER_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.USER_NAME)} is required`)
    .matches(ALPHA_NUMERIC_REGEX, "Invalid characters found"),
  [indexColumnNameConstants.PASSWORD]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PASSWORD)} is required`),
});
