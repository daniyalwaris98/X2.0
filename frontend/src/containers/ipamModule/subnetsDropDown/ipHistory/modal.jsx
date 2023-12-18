import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../../components/dialogs";
import Grid from "@mui/material/Grid";
import DefaultFormUnit from "../../../../components/formUnits";
import { SelectFormUnit } from "../../../../components/formUnits";
import DefaultDialogFooter from "../../../../components/dialogFooters";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import {
  useUpdateRecordMutation,
  useAddRecordMutation,
} from "../../../../store/features/atomModule/passwordGroup/apis";
import {
  useFetchPasswordGroupNamesQuery,
  useFetchPasswordGroupTypeNamesQuery,
} from "../../../../store/features/dropDowns/apis";
import { useSelector } from "react-redux";
import {
  selectPasswordGroupNames,
  selectPasswordGroupTypeNames,
} from "../../../../store/features/dropDowns/selectors";
import useErrorHandling from "../../../../hooks/useErrorHandling";
import { formSetter } from "../../../../utils/helpers";
import { TYPE_SINGLE } from "../../../../hooks/useErrorHandling";
import { ELEMENT_NAME } from "./constants";
import { indexColumnNameConstants } from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.NETWORK_NAME]: yup
    .string()
    .required("Network name is required"),
  [indexColumnNameConstants.SUBNET]: yup
    .string()
    .required("Subnet is required"),
  [indexColumnNameConstants.SCAN_STATUS]: yup
    .string()
    .required("Scan status is required"),
  [indexColumnNameConstants.EXCLUDED_IP_RANGE]: yup
    .string()
    .required("Excluded IP range is required"),
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
      data[indexColumnNameConstants.MANAGE_NETWORK_ID] =
        recordToEdit[indexColumnNameConstants.MANAGE_NETWORK_ID];
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
        <Grid container>
          <Grid item xs={12}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.NETWORK_NAME}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.SUBNET}
              required
            />
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.SCAN_STATUS}
              options={passwordGroupTypeNames}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.EXCLUDED_IP_RANGE}
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
