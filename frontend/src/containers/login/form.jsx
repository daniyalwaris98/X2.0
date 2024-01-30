import React from "react";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoginMutation } from "../../store/features/login/apis";
import { getTitle } from "../../utils/helpers";
import useErrorHandling, { TYPE_SINGLE } from "../../hooks/useErrorHandling";
import DefaultFormUnit from "../../components/formUnits";
import { LoginDialogFooter } from "../../components/dialogFooters";
import DefaultSpinner from "../../components/spinners";
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
  // states

  // useForm hook
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
  });

  // post api for the form
  const [
    login,
    {
      data: loginData,
      isSuccess: isLoginSuccess,
      isLoading: isLoginLoading,
      isError: isLoginError,
      error: addLoginError,
    },
  ] = useLoginMutation();

  // error handling custom hooks
  useErrorHandling({
    data: loginData,
    isSuccess: isLoginSuccess,
    isError: isLoginError,
    error: addLoginError,
    type: TYPE_SINGLE,
  });

  // on form submit
  const onSubmit = (data) => {
    login(data);
  };

  return (
    <DefaultSpinner spinning={isLoginLoading}>
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
    </DefaultSpinner>
  );
};

export default Index;
