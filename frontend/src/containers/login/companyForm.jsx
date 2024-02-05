import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { formSetter, getTitle } from "../../utils/helpers";
import DefaultFormUnit from "../../components/formUnits";
import { CompanyDialogFooter } from "../../components/dialogFooters";
import DefaultSpinner from "../../components/spinners";
import { LOGIN_FORM, USER_FORM, companyConstants } from "./constants";
import { setCompanyDetails } from "../../store/features/login";
import { selectCompanyDetails } from "../../store/features/login/selectors";
import { useSelector } from "react-redux/es/hooks/useSelector";

const schema = yup.object().shape({
  [companyConstants.COMPANY_NAME]: yup
    .string()
    .required(`${getTitle(companyConstants.COMPANY_NAME)} is required`),
});

const Index = ({ setCurrentForm }) => {
  // selectors
  const companyDetails = useSelector(selectCompanyDetails);

  // hooks
  const dispatch = useDispatch();
  const { handleSubmit, control, setValue, getValues } = useForm({
    resolver: yupResolver(schema),
  });

  // effects
  useEffect(() => {
    formSetter(companyDetails, setValue);
  }, []);

  // handlers
  function handleBack() {
    dispatch(setCompanyDetails(getValues()));
    setCurrentForm(LOGIN_FORM);
  }

  // on form submit
  const onSubmit = (data) => {
    dispatch(setCompanyDetails(data));
    setCurrentForm(USER_FORM);
  };

  return (
    <DefaultSpinner spinning={false}>
      <div style={{ display: "flex", marginBottom: "15px" }}>
        <div style={{ whiteSpace: "nowrap" }}>
          Company Details &nbsp;&nbsp;&nbsp;
        </div>
        <div
          style={{
            width: "100%",
            height: "2px",
            marginTop: "12px",
            backgroundColor: "#F6F6F6",
          }}
        ></div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={4}>
            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.COMPANY_NAME}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.PO_BOX}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.ADDRESS}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.STREET_NAME}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.CITY}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.COUNTRY}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.CONTACT_PERSON}
              required
            />

            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.CONTACT_NUMBER}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.EMAIL}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.DOMAIN_NAME}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.INDUSTRY_TYPE}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.LICENSE_START_DATE}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.LICENSE_END_DATE}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={companyConstants.DEVICE_ONBOARD_LIMIT}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <CompanyDialogFooter handleBack={handleBack} />
          </Grid>
        </Grid>
      </form>
    </DefaultSpinner>
  );
};

export default Index;
