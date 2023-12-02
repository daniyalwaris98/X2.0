import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../components/dialogs";
import Grid from "@mui/material/Grid";
import DefaultFormUnit from "../../../components/formUnits";
import { SelectFormUnit } from "../../../components/formUnits";
import DefaultDialogFooter from "../../../components/dialogFooters";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import {
  useUpdateRecordMutation,
  useAddRecordMutation,
} from "../../../store/features/uamModule/sites/apis";
import {
  useFetchSiteNamesQuery,
  useFetchStatusNamesQuery,
} from "../../../store/features/dropDowns/apis";
import { useSelector } from "react-redux";
import { selectStatusNames } from "../../../store/features/dropDowns/selectors";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { formSetter } from "../../../utils/helpers";
import DefaultSelect from "../../../components/selects";
import { TYPE_SINGLE } from "../../../hooks/useErrorHandling";
import { ALPHA_NUMERIC_REGEX } from "../../../utils/constants/regex";
import { indexColumnNameConstants } from "./constants";
import { PAGE_NAME } from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.SITE_NAME]: yup
    .string()
    .required("Site name is required")
    .matches(ALPHA_NUMERIC_REGEX, "Invalid characters in site name"),
  [indexColumnNameConstants.STATUS]: yup
    .string()
    .required("Status is required"),
  [indexColumnNameConstants.CITY]: yup
    .string()
    .matches(/^[A-Za-z]+$/, "City must contain only alphabets"),
});

const Index = ({ handleClose, open, recordToEdit }) => {
  const theme = useTheme();

  // states

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
  const { refetch: refetchSiteNames } = useFetchSiteNamesQuery(undefined, {
    skip: !isAddRecordSuccess && !isUpdateRecordSuccess,
  });
  const { error: statusNamesError, isLoading: isStatusNamesLoading } =
    useFetchStatusNamesQuery();

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
  const statusNames = useSelector(selectStatusNames);

  // effects
  useEffect(() => {
    if (isAddRecordSuccess || isUpdateRecordSuccess) {
      refetchSiteNames();
    }
  }, [isAddRecordSuccess, isUpdateRecordSuccess]);

  // on form submit
  const onSubmit = (data) => {
    // console.log("site data", data);
    if (recordToEdit) {
      data.site_id = recordToEdit.site_id;
      updateRecord(data);
    } else {
      addRecord(data);
    }
  };

  return (
    <FormModal
      sx={{ zIndex: "999" }}
      title={`${recordToEdit ? "Edit" : "Add"} ${PAGE_NAME}`}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "15px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.SITE_NAME}
              disabled={recordToEdit !== null}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.REGION_NAME}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.CITY}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.STATUS}
              options={statusNames}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.LATITUDE}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.LONGITUDE}
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
