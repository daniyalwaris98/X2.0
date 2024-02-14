import * as yup from "yup";
import { getTitle } from "../../../utils/helpers";
import { indexColumnNameConstants } from "./constants";
import { ALPHA_NUMERIC_REGEX } from "../../../utils/constants/regex";

export const defaultSchema = yup.object().shape({
  [indexColumnNameConstants.PASSWORD_GROUP]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.PASSWORD_GROUP)} is required`
    )
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.PASSWORD_GROUP_TYPE]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.PASSWORD_GROUP_TYPE)} is required`
    )
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.USER_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.USER_NAME)} is required`)
    .max(100, "Exceeds maximum length (100 characters)")
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.PASSWORD]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PASSWORD)} is required`),
});
