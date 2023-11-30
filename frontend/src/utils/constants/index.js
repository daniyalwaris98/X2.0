export const API_ENDPOINT_URL = "http://192.168.10.150:8080";

// Alphanumeric characters
// Single Space between words
// Hyphens or underscores between words with both of  them not coming together e.g [a_-d, a__d,a--d,a-_d, a_ -d, a -d, a _d] (not allowed)
// No space at the beginning of the string and No Space at the end of the string
// Only numbers are not allowed
export const ALPHA_NUMERIC_REGEX =
  /^(?! )(?=.*[a-zA-Z])[a-zA-Z0-9]*(?:[ _-][a-zA-Z0-9]+)*(?: [a-zA-Z0-9]+)*$/;
