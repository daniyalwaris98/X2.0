import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Grid from "@mui/material/Grid";
import {
  useUpdateRecordMutation,
  useAddRecordMutation,
} from "../../../../../store/features/monitoringModule/cloudsDropDown/awsDropDown/accounts/apis";
import { formSetter, getTitle } from "../../../../../utils/helpers";
import useErrorHandling, {
  TYPE_SINGLE,
} from "../../../../../hooks/useErrorHandling";
import FormModal from "../../../../../components/dialogs";
import DefaultFormUnit from "../../../../../components/formUnits";
import DefaultDialogFooter from "../../../../../components/dialogFooters";
import DefaultSpinner from "../../../../../components/spinners";
import {
  PAGE_NAME,
  TABLE_DATA_UNIQUE_ID,
  indexColumnNameConstants,
} from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.ACCOUNT_LABEL]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.ACCOUNT_LABEL)} is required`
    ),
  [indexColumnNameConstants.ACCESS_KEY]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.ACCESS_KEY)} is required`),
  [indexColumnNameConstants.SECRET_ACCESS_KEY]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.SECRET_ACCESS_KEY)} is required`
    ),
});

const Index = ({ handleClose, open, recordToEdit }) => {
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
      <DefaultSpinner spinning={isAddRecordLoading || isUpdateRecordLoading}>
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
                dataKey={indexColumnNameConstants.ACCESS_KEY}
                required
              />
              <DefaultFormUnit
                type="password"
                control={control}
                dataKey={indexColumnNameConstants.SECRET_ACCESS_KEY}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <DefaultDialogFooter handleClose={handleClose} />
            </Grid>
          </Grid>
        </form>
      </DefaultSpinner>
    </FormModal>
  );
};

export default Index;
