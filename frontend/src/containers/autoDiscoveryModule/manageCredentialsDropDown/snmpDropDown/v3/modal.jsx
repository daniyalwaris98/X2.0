import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../../../components/dialogs";
import Grid from "@mui/material/Grid";
import DefaultFormUnit from "../../../../../components/formUnits";
import { SelectFormUnit } from "../../../../../components/formUnits";
import DefaultDialogFooter from "../../../../../components/dialogFooters";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import {
  useUpdateRecordMutation,
  useAddRecordMutation,
} from "../../../../../store/features/atomModule/passwordGroup/apis";
import {
  useFetchPasswordGroupNamesQuery,
  useFetchPasswordGroupTypeNamesQuery,
} from "../../../../../store/features/dropDowns/apis";
import { useSelector } from "react-redux";
import {
  selectPasswordGroupNames,
  selectPasswordGroupTypeNames,
} from "../../../../../store/features/dropDowns/selectors";
import useErrorHandling from "../../../../../hooks/useErrorHandling";
import { formSetter } from "../../../../../utils/helpers";
import { TYPE_SINGLE } from "../../../../../hooks/useErrorHandling";
import { ELEMENT_NAME } from "./constants";
import { indexColumnNameConstants } from "./constants";
import { getTitle } from "../../../../../utils/helpers";

const schema = yup.object().shape({
  [indexColumnNameConstants.PROFILE_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PROFILE_NAME)} is required`),
  [indexColumnNameConstants.USER_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.USER_NAME)} is required`),
  [indexColumnNameConstants.DESCRIPTION]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.DESCRIPTION)} is required`),
  [indexColumnNameConstants.PORT]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PORT)} is required`),
  [indexColumnNameConstants.AUTHENTICATION_PROTOCOL]: yup
    .string()
    .required(
      `${getTitle(
        indexColumnNameConstants.AUTHENTICATION_PROTOCOL
      )} is required`
    ),
  [indexColumnNameConstants.ENCRYPTION_PROTOCOL]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.ENCRYPTION_PROTOCOL)} is required`
    ),
  [indexColumnNameConstants.AUTHENTICATION_PASSWORD]: yup
    .string()
    .required(
      `${getTitle(
        indexColumnNameConstants.AUTHENTICATION_PASSWORD
      )} is required`
    ),
  [indexColumnNameConstants.ENCRYPTION_PASSWORD]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.ENCRYPTION_PASSWORD)} is required`
    ),
});

const Index = ({ handleClose, open, recordToEdit }) => {
  const theme = useTheme();

  // useForm hook
  const { handleSubmit, control, setValue, watch, trigger } = useForm({
    resolver: yupResolver(schema),
  });

  // effects
  useEffect(() => {
    formSetter(recordToEdit, setValue);
  }, []);

  // post api for the form
  const [
    addRecord,
    {
      data: addRecordData,
      isSuccess: isAddRecordSuccess,
      isLoading: isAddRecordLoading,
      isError: isAddRecordError,
      error: addRecordError,
    },
  ] = useAddRecordMutation();

  const [
    updateRecord,
    {
      data: updateRecordData,
      isSuccess: isUpdateRecordSuccess,
      isLoading: isUpdateRecordLoading,
      isError: isUpdateRecordError,
      error: updateRecordError,
    },
  ] = useUpdateRecordMutation();

  // fetching dropdowns data from backend using apis
  const {
    error: passwordGroupTypeNamesError,
    isLoading: isPasswordGroupTypeNamesLoading,
  } = useFetchPasswordGroupTypeNamesQuery();

  // error handling custom hooks
  useErrorHandling({
    data: addRecordData,
    isSuccess: isAddRecordSuccess,
    isError: isAddRecordError,
    error: addRecordError,
    type: TYPE_SINGLE,
    callback: handleClose,
  });

  useErrorHandling({
    data: updateRecordData,
    isSuccess: isUpdateRecordSuccess,
    isError: isUpdateRecordError,
    error: updateRecordError,
    type: TYPE_SINGLE,
    callback: handleClose,
  });

  // getting dropdowns data from the store
  const passwordGroupTypeNames = useSelector(selectPasswordGroupTypeNames);

  // on form submit
  const onSubmit = (data) => {
    if (recordToEdit) {
      data[indexColumnNameConstants.CREDENTIALS_ID] =
        recordToEdit[indexColumnNameConstants.CREDENTIALS_ID];
      updateRecord(data);
    } else {
      addRecord(data);
    }
  };

  return (
    <FormModal
      sx={{ zIndex: "999" }}
      title={`${recordToEdit ? "Edit" : "Add"} ${ELEMENT_NAME}`}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.PROFILE_NAME}
              required
            />
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.AUTHENTICATION_PROTOCOL}
              options={passwordGroupTypeNames}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.AUTHENTICATION_PASSWORD}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.DESCRIPTION}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.USER_NAME}
              required
            />
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.ENCRYPTION_PROTOCOL}
              options={passwordGroupTypeNames}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.ENCRYPTION_PASSWORD}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.PORT}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <DefaultDialogFooter handleClose={handleClose} />
          </Grid>
        </Grid>
      </form>
    </FormModal>
  );
};

export default Index;
