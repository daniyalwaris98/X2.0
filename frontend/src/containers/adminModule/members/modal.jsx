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
} from "../../../store/features/atomModule/passwordGroups/apis";
import {
  useFetchPasswordGroupNamesQuery,
  useFetchPasswordGroupTypeNamesQuery,
} from "../../../store/features/dropDowns/apis";
import { useSelector } from "react-redux";
import {
  selectPasswordGroupNames,
  selectPasswordGroupTypeNames,
} from "../../../store/features/dropDowns/selectors";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { formSetter, getTitle } from "../../../utils/helpers";
import { TYPE_SINGLE } from "../../../hooks/useErrorHandling";
import { PAGE_NAME, TELNET } from "./constants";
import { indexColumnNameConstants, TABLE_DATA_UNIQUE_ID } from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.USER_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.USER_NAME)} is required`),
  [indexColumnNameConstants.EMAIL_ADDRESS]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.EMAIL_ADDRESS)} is required`
    ),
  [indexColumnNameConstants.NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.NAME)} is required`),
  [indexColumnNameConstants.ROLE]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.ROLE)} is required`),
  [indexColumnNameConstants.STATUS]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.STATUS)} is required`),
  [indexColumnNameConstants.COMPANY_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.COMPANY_NAME)} is required`),
  [indexColumnNameConstants.ACCOUNT_TYPE]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.ACCOUNT_TYPE)} is required`),
  [indexColumnNameConstants.LAST_LOGIN]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.LAST_LOGIN)} is required`),
  [indexColumnNameConstants.TEAM]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.TEAM)} is required`),
});

const Index = ({ handleClose, open, recordToEdit }) => {
  const theme = useTheme();

  // states
  const [isSecretPasswordDisable, setIsSecretPasswordDisable] = useState(false);

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
      data[TABLE_DATA_UNIQUE_ID] = recordToEdit[TABLE_DATA_UNIQUE_ID];
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.USER_NAME}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.EMAIL_ADDRESS}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.NAME}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.ROLE}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.STATUS}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.COMPANY_NAME}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.ACCOUNT_TYPE}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.LAST_LOGIN}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.TEAM}
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
