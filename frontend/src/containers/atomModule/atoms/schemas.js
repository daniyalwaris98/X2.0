import * as yup from "yup";
import { getTitle, isValidIPAddress } from "../../../utils/helpers";
import { indexColumnNameConstants } from "./constants";
import { ALPHA_NUMERIC_REGEX } from "../../../utils/constants/regex";

export const defaultFormSchema = yup.object().shape({
  [indexColumnNameConstants.IP_ADDRESS]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.IP_ADDRESS)} is required`)
    .test(
      `valid ${indexColumnNameConstants.IP_ADDRESS}`,
      `Invalid ${getTitle(indexColumnNameConstants.IP_ADDRESS)}`,
      (value) => isValidIPAddress(value)
    ),
  [indexColumnNameConstants.SECTION]: yup
    .string()
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.DEPARTMENT]: yup
    .string()
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.DOMAIN]: yup.string().matches(ALPHA_NUMERIC_REGEX, {
    message: "Invalid characters found",
    excludeEmptyString: true,
  }),
});
