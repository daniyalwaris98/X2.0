import React from "react";
import DefaultWrapper from "./wrappers";
import DefaultLabel from "./labels";
import { InputWrapper } from "./wrappers";
import DefaultInput from "./inputs";
import DefaultSelect from "./selects";
import { Controller } from "react-hook-form";

export default function DefaultFormUnit({
  control,
  dataKey,
  type = "text",
  required = false,
}) {
  const title = getTitle(dataKey);
  return (
    <Controller
      name={dataKey}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <DefaultWrapper sx={{ marginBottom: "10px" }}>
            <DefaultLabel htmlFor={dataKey} required={required}>
              {title}:
            </DefaultLabel>
            <InputWrapper>
              <DefaultInput
                field={field}
                name={dataKey}
                id={dataKey}
                placeholder={title}
                type={type}
              />
            </InputWrapper>
            <div style={{ color: "red", fontSize: "12px" }}>
              {fieldState.error && fieldState.error.message}
            </div>
          </DefaultWrapper>
        );
      }}
    />
  );
}

export function SelectFormUnit({ control, dataKey, required = false }) {
  const title = getTitle(dataKey);
  return (
    <Controller
      name={dataKey}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <DefaultWrapper sx={{ marginBottom: "10px" }}>
            <DefaultLabel htmlFor={dataKey} required={required}>
              {title}:
            </DefaultLabel>
            <InputWrapper>
              <DefaultSelect field={field} sx={{ width: "195px" }} id="dataKey">
                <option value="">Select a {title}</option>
                <option value="Manager">Manager</option>
                <option value="Developer">Developer</option>
                <option value="Executive">Executive</option>
              </DefaultSelect>
            </InputWrapper>
            <div style={{ color: "red", fontSize: "12px" }}>
              {fieldState.error && fieldState.error.message}
            </div>
          </DefaultWrapper>
        );
      }}
    />
  );
}

const getTitle = (dataKey) => {
  return dataKey
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
