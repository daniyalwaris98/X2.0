import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../components/dialogs";
import Grid from "@mui/material/Grid";
import DefaultFormUnit from "../../../components/formUnits";
import { SelectFormUnit } from "../../../components/formUnits";
import DefaultDialogFooter from "../../../components/dialogFooters";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useUpdateRecordMutation,
  useAddRecordMutation,
} from "../../../store/features/atomModule/atoms/apis";
import {
  useFetchVendorNamesQuery,
  useFetchFunctionNamesQuery,
  useFetchDeviceTypeNamesQuery,
} from "../../../store/features/dropDowns/apis";
import { useSelector } from "react-redux";
import {
  selectVendorNames,
  selectFunctionNames,
  selectDeviceTypeNames,
} from "../../../store/features/dropDowns/selectors";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { formSetter, getTitle } from "../../../utils/helpers";
import { TYPE_SINGLE } from "../../../hooks/useErrorHandling";
import { ELEMENT_NAME } from "./constants";
import { indexColumnNameConstants } from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.IP_ADDRESS]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.IP_ADDRESS)} is required`),
});

const Index = ({ handleClose, open, recordToEdit }) => {
  // useForm hook
  const { handleSubmit, control, setValue, watch, trigger } = useForm({
    resolver: yupResolver(schema),
  });

  // effects
  useEffect(() => {
    formSetter(recordToEdit, setValue);
  }, []);

  // fetching dropdowns data from backend using apis
  const { error: vendorNamesError, isLoading: isVendorNamesLoading } =
    useFetchVendorNamesQuery();
  const { error: functionNamesError, isLoading: isFunctionNamesLoading } =
    useFetchFunctionNamesQuery();
  const { error: deviceTypeNamesError, isLoading: isDeviceTypeNamesLoading } =
    useFetchDeviceTypeNamesQuery();

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
  const vendorNames = useSelector(selectVendorNames);
  const functionNames = useSelector(selectFunctionNames);
  const deviceTypeNames = useSelector(selectDeviceTypeNames);

  // on form submit
  const onSubmit = (data) => {
    if (recordToEdit) {
      data.password_group_id = recordToEdit.password_group_id;
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
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "15px" }}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.IP_ADDRESS}
              required
            />
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.DEVICE_TYPE}
              options={deviceTypeNames}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.DEVICE_NAME}
            />
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.VENDOR}
              options={vendorNames}
            />
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.FUNCTION}
              options={functionNames}
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
