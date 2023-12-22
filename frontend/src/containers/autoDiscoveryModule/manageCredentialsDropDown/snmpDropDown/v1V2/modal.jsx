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
} from "../../../../../store/features/autoDiscoveryModule/manageCredentials/snmp/v1V2/apis";
import useErrorHandling from "../../../../../hooks/useErrorHandling";
import { formSetter } from "../../../../../utils/helpers";
import { TYPE_SINGLE } from "../../../../../hooks/useErrorHandling";
import { ELEMENT_NAME } from "./constants";
import { indexColumnNameConstants } from "./constants";
import { getTitle } from "../../../../../utils/helpers";

const schema = yup.object().shape({
  [indexColumnNameConstants.DESCRIPTION]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.DESCRIPTION)} is required`),
  [indexColumnNameConstants.PORT]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PORT)} is required`),
  [indexColumnNameConstants.PROFILE_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PROFILE_NAME)} is required`),
  [indexColumnNameConstants.COMMUNITY]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.COMMUNITY)} is required`),
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
        <Grid container>
          <Grid item xs={12}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.DESCRIPTION}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.PORT}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.PROFILE_NAME}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.COMMUNITY}
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
