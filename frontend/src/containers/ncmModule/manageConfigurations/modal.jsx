import React, { useEffect } from "react";
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
} from "../../../store/features/ncmModule/manageConfigurations/apis";
import { useFetchPasswordGroupNamesQuery } from "../../../store/features/dropDowns/apis";
import { useSelector } from "react-redux";
import { selectPasswordGroupNames } from "../../../store/features/dropDowns/selectors";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { formSetter, getTitle } from "../../../utils/helpers";
import { TYPE_SINGLE } from "../../../hooks/useErrorHandling";
import { ELEMENT_NAME } from "./constants";
import { indexColumnNameConstants } from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.DEVICE_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.DEVICE_NAME)} is required`),
  [indexColumnNameConstants.IP_ADDRESS]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.IP_ADDRESS)} is required`),
  [indexColumnNameConstants.DEVICE_TYPE]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.DEVICE_TYPE)} is required`),
  [indexColumnNameConstants.ACTIVE]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.ACTIVE)} is required`),
  [indexColumnNameConstants.VENDOR]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.VENDOR)} is required`),
  [indexColumnNameConstants.FUNCTION]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.FUNCTION)} is required`),
  [indexColumnNameConstants.PASSWORD_GROUP]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.PASSWORD_GROUP)} is required`
    ),
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

  // fetching dropdowns data from backend using apis
  const {
    error: passwordGroupNamesError,
    isLoading: isPasswordGroupNamesLoading,
  } = useFetchPasswordGroupNamesQuery();

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
  const passwordGroupNames = useSelector(selectPasswordGroupNames);

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
      sx={{ zIndex: "999" }}
      title={`${recordToEdit ? "Edit" : "Add"} ${ELEMENT_NAME}`}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "15px" }}>
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.IP_ADDRESS}
              required
            />
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.ACTIVE}
              options={passwordGroupNames}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.DEVICE_TYPE}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.PASSWORD_GROUP}
              options={passwordGroupNames}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.VENDOR}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.FUNCTION}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.DEVICE_NAME}
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
