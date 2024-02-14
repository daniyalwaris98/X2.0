import * as yup from "yup";
import { getTitle } from "../../../../../utils/helpers";
import {
  ALPHA_NUMERIC_REGEX_STARTING_WITH_ALPHABETS,
  ALPHA_NUMERIC_WITH_EXTRA_CHARACTERS_REGEX,
  ALPHA_NUMERIC_WITH_FOUR_EXTRA_CHARACTERS_REGEX_STARTING_WITH_ALPHABETS,
} from "../../../../../utils/constants/regex";
import { indexColumnNameConstants } from "./constants";

export const defaultFormSchema = yup.object().shape({
  [indexColumnNameConstants.USER_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.USER_NAME)} is required`)
    .matches(
      ALPHA_NUMERIC_WITH_FOUR_EXTRA_CHARACTERS_REGEX_STARTING_WITH_ALPHABETS,
      {
        message: "Invalid characters found",
        excludeEmptyString: true,
      }
    ),
  [indexColumnNameConstants.PROFILE_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PROFILE_NAME)} is required`)
    .matches(ALPHA_NUMERIC_REGEX_STARTING_WITH_ALPHABETS, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.COMMUNITY]: yup
    .string()
    .matches(ALPHA_NUMERIC_REGEX_STARTING_WITH_ALPHABETS, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
  [indexColumnNameConstants.DESCRIPTION]: yup
    .string()
    .matches(ALPHA_NUMERIC_WITH_EXTRA_CHARACTERS_REGEX, {
      message: "Invalid characters found",
      excludeEmptyString: true,
    }),
});
