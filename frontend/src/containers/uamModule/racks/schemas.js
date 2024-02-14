import * as yup from "yup";
import { getTitle, transformDateTimeToDate } from "../../../utils/helpers";
import { indexColumnNameConstants } from "./constants";
import { ALPHA_NUMERIC_REGEX } from "../../../utils/constants/regex";

export const defaultSchema = yup.object().shape({
  [indexColumnNameConstants.RACK_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.RACK_NAME)} is required`)
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.SITE_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.SITE_NAME)} is required`),
  [indexColumnNameConstants.STATUS]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.STATUS)} is required`),
  [indexColumnNameConstants.MANUFACTURE_DATE]: yup
    .string()
    .transform(transformDateTimeToDate),
  [indexColumnNameConstants.RFS_DATE]: yup
    .string()
    .transform(transformDateTimeToDate),
  [indexColumnNameConstants.PN_CODE]: yup
    .string()
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.RACK_MODEL]: yup
    .string()
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.RU]: yup.string().matches(ALPHA_NUMERIC_REGEX, {
    message: "Invalid characters found",
    excludeEmptyString: true,
  }),
  [indexColumnNameConstants.SERIAL_NUMBER]: yup
    .string()
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.UNIT_POSITION]: yup
    .string()
    .matches(ALPHA_NUMERIC_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
});
