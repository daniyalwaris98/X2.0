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
import {
  LoginDialogFooter,
  RegisterDialogFooter,
} from "../../components/dialogFooters";
import DefaultSpinner from "../../components/spinners";
import { COMPANY, indexColumnNameConstants } from "./constants";
import { MAIN_LAYOUT_PATH } from "../../layouts/mainLayout";
import MonetxLogo from "../../resources/svgs/monetxLogo.svg";

const schema = yup.object().shape({
  [indexColumnNameConstants.USER_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.USER_NAME)} is required`),
  [indexColumnNameConstants.PASSWORD]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PASSWORD)} is required`),
});

const Index = ({
  setCurrentForm,
  isAnyCompanyRegistered,
  isCheckIsAnyCompanyRegisteredLoading,
}) => {
  // hooks
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
  });

  // apis
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
    <>
      {!isCheckIsAnyCompanyRegisteredLoading ? (
        <>
          {isAnyCompanyRegistered ? (
            <DefaultSpinner spinning={isLoginLoading}>
              <div>
                <img src={MonetxLogo} alt="logo" />
                <br />
                <br />
                <p>Sign in to your account</p>
                <br />
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
                        // onClick={handleRegister}
                      >
                        Forgot password?
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                      <LoginDialogFooter />
                    </Grid>
                  </Grid>
                </form>
              </div>
            </DefaultSpinner>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: "60%" }}>
                <img src={MonetxLogo} alt="logo" />
                <br />
                <br />
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <p>
                      Welcome to Monetx. As this is your first time here, please
                      proceed to the registration forms. Note: This is only a
                      one time step.
                    </p>
                    <br />
                  </Grid>
                  <Grid item xs={12}>
                    <RegisterDialogFooter handleRegister={handleRegister} />
                  </Grid>
                </Grid>
              </div>
            </div>
          )}
        </>
      ) : (
        <DefaultSpinner spinning={isCheckIsAnyCompanyRegisteredLoading} />
      )}
    </>
  );
};

export default Index;
