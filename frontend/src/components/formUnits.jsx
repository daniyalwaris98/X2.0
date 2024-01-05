import React from "react";
import DefaultWrapper from "./wrappers";
import DefaultLabel from "./labels";
import { InputWrapper } from "./wrappers";
import DefaultInput, { PasswordInput } from "./inputs";
import DefaultSelect, { AddableSelect } from "./selects";
import DefaultOption from "./options";
import { Controller } from "react-hook-form";
import { getTitle } from "../utils/helpers";
import { useTheme } from "@mui/material/styles";
import DefaultDate from "./dates";

export default function DefaultFormUnit({
  control,
  dataKey,
  type = "text",
  required = false,
  label = true,
  sx,
  ...rest
}) {
  const theme = useTheme();
  const title = getTitle(dataKey);
  return (
    <Controller
      name={dataKey}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <DefaultWrapper sx={{ marginBottom: "10px" }}>
            {label ? (
              <DefaultLabel htmlFor={dataKey} required={required}>
                {title}:
              </DefaultLabel>
            ) : null}
            <InputWrapper>
              {type === "text" ? (
                <DefaultInput
                  field={field}
                  name={dataKey}
                  id={dataKey}
                  placeholder={title}
                  type={type}
                  sx={sx}
                  {...rest}
                />
              ) : null}

              {type === "password" ? (
                <PasswordInput
                  field={field}
                  name={dataKey}
                  id={dataKey}
                  placeholder={title}
                  type={type}
                  sx={sx}
                  {...rest}
                />
              ) : null}
            </InputWrapper>
            <div
              style={{
                color: theme?.palette?.form_unit?.error_text,
                fontSize: "12px",
              }}
            >
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
  const theme = useTheme();
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
                sx={{ outline: "none" }}
                id={dataKey}
                {...rest}
              >
                <DefaultOption
                  value=""
                  sx={{
                    color: theme.palette.default_select.place_holder,
                  }}
                >
                  Select a {title}
                </DefaultOption>
                {options?.map((value) => (
                  <DefaultOption value={value}>{value}</DefaultOption>
                ))}
              </DefaultSelect>
            </InputWrapper>
            <div
              style={{
                color: theme?.palette?.form_unit?.error_text,
                fontSize: "12px",
              }}
            >
              {fieldState.error && fieldState.error.message}
            </div>
          </DefaultWrapper>
        );
      }}
    />
  );
}

export function SelectFormUnitWithHiddenValues({
  control,
  dataKey,
  options,
  required = false,
  ...rest
}) {
  const theme = useTheme();
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
                sx={{ outline: "none" }}
                id={dataKey}
                {...rest}
              >
                <DefaultOption
                  value=""
                  sx={{
                    color: theme.palette.default_select.place_holder,
                  }}
                >
                  Select a {title}
                </DefaultOption>
                {options?.map((item) => (
                  <DefaultOption value={item.value}>{item.name}</DefaultOption>
                ))}
              </DefaultSelect>
            </InputWrapper>
            <div
              style={{
                color: theme?.palette?.form_unit?.error_text,
                fontSize: "12px",
              }}
            >
              {fieldState.error && fieldState.error.message}
            </div>
          </DefaultWrapper>
        );
      }}
    />
  );
}

export function AddableSelectFormUnit({
  control,
  dataKey,
  options,
  required = false,
  ...rest
}) {
  const theme = useTheme();
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
              <AddableSelect
                field={field}
                sx={{ outline: "none" }}
                id={dataKey}
                {...rest}
              >
                <DefaultOption
                  value=""
                  sx={{
                    color: theme.palette.default_select.place_holder,
                  }}
                >
                  Select a {title}
                </DefaultOption>
                {options?.map((value) => (
                  <DefaultOption value={value}>{value}</DefaultOption>
                ))}
              </AddableSelect>
            </InputWrapper>
            <div
              style={{
                color: theme?.palette?.form_unit?.error_text,
                fontSize: "12px",
              }}
            >
              {fieldState.error && fieldState.error.message}
            </div>
          </DefaultWrapper>
        );
      }}
    />
  );
}

export function DateFormUnit({
  control,
  dataKey,
  options,
  required = false,
  ...rest
}) {
  const theme = useTheme();
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
              <DefaultDate
                field={field}
                sx={{ outline: "none" }}
                id={dataKey}
                {...rest}
              />
            </InputWrapper>
            <div
              style={{
                color: theme?.palette?.form_unit?.error_text,
                fontSize: "12px",
              }}
            >
              {fieldState.error && fieldState.error.message}
            </div>
          </DefaultWrapper>
        );
      }}
    />
  );
}
