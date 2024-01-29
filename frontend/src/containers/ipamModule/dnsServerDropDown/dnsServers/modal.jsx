import React, { useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import {
  useAddRecordMutation,
  useUpdateRecordMutation,
} from "../../../../store/features/ipamModule/dnsServerDropDown/dnsServers/apis";
import { formSetter, getTitle } from "../../../../utils/helpers";
import useErrorHandling from "../../../../hooks/useErrorHandling";
import { TYPE_SINGLE } from "../../../../hooks/useErrorHandling";
import FormModal from "../../../../components/dialogs";
import DefaultFormUnit from "../../../../components/formUnits";
import DefaultDialogFooter from "../../../../components/dialogFooters";
import DefaultSpinner from "../../../../components/spinners";
import {
  ELEMENT_NAME,
  TABLE_DATA_UNIQUE_ID,
  indexColumnNameConstants,
} from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.IP_ADDRESS]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.IP_ADDRESS)} is required`),
  [indexColumnNameConstants.SERVER_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.SERVER_NAME)} is required`),
  [indexColumnNameConstants.USER_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.USER_NAME)} is required`),
  [indexColumnNameConstants.PASSWORD]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PASSWORD)} is required`),
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
      title={`${recordToEdit ? "Edit" : "Add"} ${ELEMENT_NAME}`}
      open={open}
    >
      <DefaultSpinner spinning={isAddRecordLoading || isUpdateRecordLoading}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <DefaultFormUnit
                control={control}
                dataKey={indexColumnNameConstants.IP_ADDRESS}
                required
              />
              <DefaultFormUnit
                control={control}
                dataKey={indexColumnNameConstants.SERVER_NAME}
                required
              />
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
              <DefaultDialogFooter handleClose={handleClose} />
            </Grid>
          </Grid>
        </form>
      </DefaultSpinner>
    </FormModal>
  );
};

export default Index;
