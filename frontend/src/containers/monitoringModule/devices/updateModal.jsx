import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { selectMonitoringCredentialsNames } from "../../../store/features/dropDowns/selectors";
import {
  useUpdateRecordMutation,
  useAddRecordMutation,
} from "../../../store/features/atomModule/atoms/apis";
import { formSetter, getTitle } from "../../../utils/helpers";
import useErrorHandling, { TYPE_SINGLE } from "../../../hooks/useErrorHandling";
import FormModal from "../../../components/dialogs";
import DefaultFormUnit, {
  SelectFormUnitWithHiddenValues,
} from "../../../components/formUnits";
import DefaultDialogFooter from "../../../components/dialogFooters";
import DefaultSpinner from "../../../components/spinners";
import {
  ELEMENT_NAME,
  MONITORING_CREDENTIALS_ID,
  CREDENTIALS,
  TABLE_DATA_UNIQUE_ID,
  indexColumnNameConstants,
} from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.IP_ADDRESS]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.IP_ADDRESS)} is required`),
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

  // getting dropdowns data from the store
  const monitoringCredentialsNames = useSelector(
    selectMonitoringCredentialsNames
  );

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
                disabled={true}
              />
              <DefaultFormUnit
                control={control}
                dataKey={indexColumnNameConstants.DEVICE_TYPE}
                disabled={true}
              />
              <DefaultFormUnit
                control={control}
                dataKey={indexColumnNameConstants.DEVICE_NAME}
                disabled={true}
              />
              <DefaultFormUnit
                control={control}
                dataKey={indexColumnNameConstants.VENDOR}
                disabled={true}
              />
              <DefaultFormUnit
                control={control}
                dataKey={indexColumnNameConstants.FUNCTION}
                disabled={true}
              />
              <SelectFormUnitWithHiddenValues
                control={control}
                dataKey={indexColumnNameConstants.CREDENTIALS}
                options={monitoringCredentialsNames.map((item) => ({
                  name: item[CREDENTIALS],
                  value: item[MONITORING_CREDENTIALS_ID],
                }))}
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
