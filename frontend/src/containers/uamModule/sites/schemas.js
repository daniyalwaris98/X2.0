import * as yup from "yup";
import { getTitle, transformDateTimeToDate } from "../../../utils/helpers";
import { indexColumnNameConstants } from "./constants";
import { ALPHA_NUMERIC_REGEX } from "../../../utils/constants/regex";

export const defaultSchema = yup.object().shape({
  [indexColumnNameConstants.SITE_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.SITE_NAME)} is required`)
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.STATUS]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.STATUS)} is required`),

  [indexColumnNameConstants.REGION_NAME]: yup
    .string()
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.LATITUDE]: yup
    .string()
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.CITY]: yup.string().matches(ALPHA_NUMERIC_REGEX, {
    message: "Invalid characters found",
    excludeEmptyString: true,
  }),
  [indexColumnNameConstants.LONGITUDE]: yup
    .string()
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
});
