import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import DefaultFormUnit from "../../components/formUnits";
import { LoginDialogFooter } from "../../components/dialogFooters";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import { useAddRecordMutation } from "../../store/features/atomModule/passwordGroups/apis";
import useErrorHandling from "../../hooks/useErrorHandling";
import { getTitle } from "../../utils/helpers";
import { TYPE_SINGLE } from "../../hooks/useErrorHandling";
import { PAGE_NAME, TELNET } from "./constants";
import { indexColumnNameConstants } from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.USER_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.USER_NAME)} is required`),
  [indexColumnNameConstants.PASSWORD]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PASSWORD)} is required`),
});

const Index = ({ handleClose }) => {
  const theme = useTheme();

  // states

  // useForm hook
  const { handleSubmit, control, setValue, watch, trigger } = useForm({
    resolver: yupResolver(schema),
  });

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

  // error handling custom hooks
  useErrorHandling({
    data: addRecordData,
    isSuccess: isAddRecordSuccess,
    isError: isAddRecordError,
    error: addRecordError,
    type: TYPE_SINGLE,
  });

  // on form submit
  const onSubmit = (data) => {
    addRecord(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <DefaultFormUnit
            control={control}
            dataKey={indexColumnNameConstants.USER_NAME}
            required
          />
          <DefaultFormUnit
            type="password"
            control={control}
            dataKey={indexColumnNameConstants.PASSWORD}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <LoginDialogFooter handleClose={handleClose} />
        </Grid>
      </Grid>
    </form>
  );
};

export default Index;
