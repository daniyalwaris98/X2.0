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
} from "../../../store/features/atomModule/passwordGroup/apis";
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
import { formSetter } from "../../../utils/helpers";
import { TYPE_SINGLE } from "../../../hooks/useErrorHandling";
import { PAGE_NAME } from "./constants";
import { indexColumnNameConstants } from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.PASSWORD_GROUP]: yup
    .string()
    .required("Password Group is required"),
  [indexColumnNameConstants.USER_NAME]: yup
    .string()
    .required("User name is required"),
  [indexColumnNameConstants.PASSWORD]: yup
    .string()
    .required("Password is required"),
  [indexColumnNameConstants.PASSWORD_GROUP_TYPE]: yup
    .string()
    .required("Password group type is required"),
  secret_password: yup
    .string()
    .when(
      indexColumnNameConstants.PASSWORD_GROUP_TYPE,
      (passwordGroupType, schema) => {
        if (passwordGroupType == "TELNET")
          return schema.required("Secret password is required");
        return schema;
      }
    ),
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

  useEffect(() => {
    if (watch(indexColumnNameConstants.PASSWORD_GROUP_TYPE) === "SSH") {
      setValue(indexColumnNameConstants.SECRET_PASSWORD, "");
      setIsSecretPasswordDisable(true);
    } else {
      setIsSecretPasswordDisable(false);
    }
    trigger(indexColumnNameConstants.SECRET_PASSWORD);
  }, [watch(indexColumnNameConstants.PASSWORD_GROUP_TYPE)]);

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
  const { refetch: refetchPasswordGroupNames } =
    useFetchPasswordGroupNamesQuery(undefined, {
      skip: !isAddRecordSuccess && !isUpdateRecordSuccess,
    });

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

  // effects
  useEffect(() => {
    if (isAddRecordSuccess || isUpdateRecordSuccess) {
      refetchPasswordGroupNames();
    }
  }, [isAddRecordSuccess, isUpdateRecordSuccess]);

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
      sx={{ zIndex: "999" }}
      title={`${recordToEdit ? "Edit" : "Add"} ${PAGE_NAME}`}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={12}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.PASSWORD_GROUP}
              disabled={recordToEdit !== null}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.USER_NAME}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.PASSWORD}
              required
            />
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.PASSWORD_GROUP_TYPE}
              options={passwordGroupTypeNames}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.SECRET_PASSWORD}
              disabled={isSecretPasswordDisable}
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
