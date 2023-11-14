import React from "react";
import DefaultWrapper from "./wrappers";
import DefaultLabel from "./labels";
import { InputWrapper } from "./wrappers";
import DefaultInput from "./inputs";
import DefaultSelect from "./selects";
import DefaultOption from "./options";
import { Controller } from "react-hook-form";
import { getTitle } from "../utils/helpers";

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

export function SelectFormUnit({
  control,
  dataKey,
  options,
  required = false,
  ...rest
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
              <DefaultSelect
                field={field}
                sx={{ width: "195px", outline: "none" }}
                id={dataKey}
                {...rest}
              >
                <DefaultOption value="">Select a {title}</DefaultOption>
                {options?.map((value) => (
                  <DefaultOption value={value}>{value}</DefaultOption>
                ))}
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
