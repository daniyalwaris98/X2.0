import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { selectActiveStatusNames } from "../../../store/features/dropDowns/selectors";
import { useFetchActiveStatusNamesQuery } from "../../../store/features/dropDowns/apis";
import {
  useUpdateRecordMutation,
  useAddRecordMutation,
} from "../../../store/features/autoDiscoveryModule/manageNetworks/apis";
import { formSetter, getTitle } from "../../../utils/helpers";
import useErrorHandling, {
  TYPE_FETCH,
  TYPE_SINGLE,
} from "../../../hooks/useErrorHandling";
import FormModal from "../../../components/dialogs";
import DefaultFormUnit from "../../../components/formUnits";
import { SelectFormUnit } from "../../../components/formUnits";
import DefaultDialogFooter from "../../../components/dialogFooters";
import DefaultSpinner from "../../../components/spinners";
import { ELEMENT_NAME } from "./constants";
import { indexColumnNameConstants, TABLE_DATA_UNIQUE_ID } from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.NETWORK_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.NETWORK_NAME)} is required`),
  [indexColumnNameConstants.SUBNET]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.SUBNET)} is required`),
  [indexColumnNameConstants.SCAN_STATUS]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.SCAN_STATUS)} is required`),
  [indexColumnNameConstants.EXCLUDED_IP_RANGE]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.EXCLUDED_IP_RANGE)} is required`
    ),
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

  // fetching dropdowns data from backend using apis
  const {
    data: fetchActiveStatusNamesData,
    isSuccess: isFetchActiveStatusNamesSuccess,
    isLoading: isFetchActiveStatusNamesLoading,
    isError: isFetchActiveStatusNamesError,
    error: fetchActiveStatusNamesError,
  } = useFetchActiveStatusNamesQuery();

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

  useErrorHandling({
    data: fetchActiveStatusNamesData,
    isSuccess: isFetchActiveStatusNamesSuccess,
    isError: isFetchActiveStatusNamesError,
    error: fetchActiveStatusNamesError,
    type: TYPE_FETCH,
  });

  // getting dropdowns data from the store
  const activeStatusNames = useSelector(selectActiveStatusNames);

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
                options={activeStatusNames}
                spinning={isFetchActiveStatusNamesLoading}
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
      </DefaultSpinner>
    </FormModal>
  );
};

export default Index;
