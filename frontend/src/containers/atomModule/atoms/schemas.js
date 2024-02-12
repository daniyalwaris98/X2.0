import * as yup from "yup";
import { getTitle } from "../../../utils/helpers";
import { indexColumnNameConstants } from "./constants";

export const atomAddUpdateFormSchema = yup.object().shape({
  [indexColumnNameConstants.IP_ADDRESS]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.IP_ADDRESS)} is required`)
    .matches(
      /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d{1,2})){4}$/,
      "Invalid IP Address format"
    )
    .test(
      `valid ${[indexColumnNameConstants.IP_ADDRESS]}`,
      `Invalid ${[indexColumnNameConstants.IP_ADDRESS]}`,
      (value) => {
        // Split IP address into octets
        const octets = value.split(".");

        // Check for exactly four octets
        if (octets.length !== 4) return false;

        // Check numeric range, no leading zeros, and no trailing zeros
        for (let octet of octets) {
          // Check numeric range
          if (isNaN(octet) || octet < 0 || octet > 255) return false;

          // No leading zeros unless the value is zero itself
          if (octet.length > 1 && octet[0] === "0") return false;

          // No trailing zeros
          if (octet !== "0" && octet.endsWith("0")) return false;
        }

        // Valid separator
        if (!value.match(/^([0-9]+\.){3}[0-9]+$/)) return false;

        // Valid Zero IP
        if (value === "0.0.0.0") return true;

        // Loopback Address
        if (value === "127.0.0.1") return true;

        return true;
      }
    ),
  [indexColumnNameConstants.SECTION]: yup
    .string()
    .matches(
      /^[A-Za-z0-9,\s]+$/, // Valid characters: alphabets, digits, commas, spaces
      "Invalid characters found"
    )
    .test(
      `valid ${[indexColumnNameConstants.SECTION]}`,
      `Invalid ${[indexColumnNameConstants.SECTION]}`,
      (value) => {
        // Check for special characters
        if (/[!@#$%^&*()+]/.test(value)) {
          return false;
        }

        // Check for continuously repeating characters
        if (/(.)\1{2,}/.test(value)) {
          return false;
        }

        // Check for continuous sequence of hyphens, underscores, commas
        if (/[-_]+/.test(value)) {
          return false;
        }

        // Check for continuous sequence of dashes
        if (/[-]+/.test(value)) {
          return false;
        }

        // Check for continuous sequence of underscores
        if (/[_]+/.test(value)) {
          return false;
        }

        // Check for continuous sequence of commas
        if (/,+/.test(value)) {
          return false;
        }

        return true;
      }
    ),
  [indexColumnNameConstants.DEPARTMENT]: yup
    .string()
    .matches(
      /^[A-Za-z0-9,\s]+$/, // Valid characters: alphabets, digits, commas, spaces
      "Invalid characters found"
    )
    .test(
      `valid ${[indexColumnNameConstants.DEPARTMENT]}`,
      `Invalid ${[indexColumnNameConstants.DEPARTMENT]}`,
      (value) => {
        // Check for special characters
        if (/[!@#$%^&*()+]/.test(value)) {
          return false;
        }

        // Check for continuously repeating characters
        if (/(.)\1{2,}/.test(value)) {
          return false;
        }

        // Check for continuous sequence of hyphens, underscores, commas
        if (/[-_]+/.test(value)) {
          return false;
        }

        // Check for continuous sequence of dashes
        if (/[-]+/.test(value)) {
          return false;
        }

        // Check for continuous sequence of underscores
        if (/[_]+/.test(value)) {
          return false;
        }

        // Check for continuous sequence of commas
        if (/,+/.test(value)) {
          return false;
        }

        return true;
      }
    ),
  [indexColumnNameConstants.DOMAIN]: yup
    .string()
    .matches(
      /^[A-Za-z0-9,\s]+$/, // Valid characters: alphabets, digits, commas, spaces
      "Invalid characters found"
    )
    .test(
      `valid ${[indexColumnNameConstants.DOMAIN]}`,
      `Invalid ${[indexColumnNameConstants.DOMAIN]}`,
      (value) => {
        // Check for special characters
        if (/[!@#$%^&*()+]/.test(value)) {
          return false;
        }

        // Check for continuously repeating characters
        if (/(.)\1{2,}/.test(value)) {
          return false;
        }

        // Check for continuous sequence of hyphens, underscores, commas
        if (/[-_,]+/.test(value)) {
          return false;
        }

        // Check for continuous sequence of dashes
        if (/[-]+/.test(value)) {
          return false;
        }

        // Check for continuous sequence of underscores
        if (/[_]+/.test(value)) {
          return false;
        }

        // Check for continuous sequence of commas
        if (/,+/.test(value)) {
          return false;
        }

        // Check for specific invalid sequences
        if (/----/.test(value) || /_____/.test(value)) {
          return false;
        }

        // Check for specific invalid characters
        if (/[\u2026]/.test(value)) {
          // Ellipsis character
          return false;
        }

        return true;
      }
    ),
});
