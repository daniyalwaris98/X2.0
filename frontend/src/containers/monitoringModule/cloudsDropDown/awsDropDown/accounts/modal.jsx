import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../../../components/dialogs";
import Grid from "@mui/material/Grid";
import DefaultFormUnit from "../../../../../components/formUnits";
import DefaultDialogFooter from "../../../../../components/dialogFooters";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import {
  useUpdateRecordMutation,
  useAddRecordMutation,
} from "../../../../../store/features/monitoringModule/cloudsDropDown/awsDropDown/accounts/apis";
import useErrorHandling from "../../../../../hooks/useErrorHandling";
import { formSetter, getTitle } from "../../../../../utils/helpers";
import { TYPE_SINGLE } from "../../../../../hooks/useErrorHandling";
import { PAGE_NAME } from "./constants";
import { indexColumnNameConstants, TABLE_DATA_UNIQUE_ID } from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.ACCOUNT_LABEL]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.ACCOUNT_LABEL)} is required`
    ),
  [indexColumnNameConstants.AWS_ACCESS_KEY]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.AWS_ACCESS_KEY)} is required`
    ),
  [indexColumnNameConstants.AWS_SECRET_ACCESS_KEY]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.AWS_SECRET_ACCESS_KEY)} is required`
    ),
});

const Index = ({ handleClose, open, recordToEdit }) => {
  const theme = useTheme();

  // useForm hook
  const { handleSubmit, control, setValue } = useForm({
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

  // on form submit
  const onSubmit = (data) => {
    if (recordToEdit) {
      data[TABLE_DATA_UNIQUE_ID] = recordToEdit[TABLE_DATA_UNIQUE_ID];
      updateRecord(data);
    } else {
      addRecord(data);
    }
  };

  return (
    <FormModal
      title={`${recordToEdit ? "Edit" : "Add"} ${PAGE_NAME}`}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.ACCOUNT_LABEL}
              required
            />
            <DefaultFormUnit
              type="password"
              control={control}
              dataKey={indexColumnNameConstants.AWS_ACCESS_KEY}
              required
            />
            <DefaultFormUnit
              type="password"
              control={control}
              dataKey={indexColumnNameConstants.AWS_SECRET_ACCESS_KEY}
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
