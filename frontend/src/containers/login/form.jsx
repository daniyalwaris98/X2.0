import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { COMPANY, indexColumnNameConstants } from "./constants";
import { MAIN_LAYOUT_PATH } from "../../layouts/mainLayout";

const schema = yup.object().shape({
  [indexColumnNameConstants.USER_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.USER_NAME)} is required`),
  [indexColumnNameConstants.PASSWORD]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PASSWORD)} is required`),
});

const Index = ({ setCurrentForm }) => {
  // hooks
  const navigate = useNavigate();
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

  // effects
  useEffect(() => {
    if (isLoginSuccess) {
      navigate(`/${MAIN_LAYOUT_PATH}`);
    }
  }, [navigate, isLoginSuccess]);

  // handlers
  function handleRegister() {
    setCurrentForm(COMPANY);
  }

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
              icon="ph:user"
            />
            <DefaultFormUnit
              type="password"
              control={control}
              dataKey={indexColumnNameConstants.PASSWORD}
              required
            />
            <div
              style={{
                display: "flex",
                justifyContent: "right",
                color: "#66B127",
                cursor: "pointer",
              }}
              onClick={handleRegister}
            >
              Register
            </div>
          </Grid>

          <Grid item xs={12}>
            <LoginDialogFooter handleRegister={handleRegister} />
          </Grid>
        </Grid>
      </form>
    </DefaultSpinner>
  );
};

export default Index;
