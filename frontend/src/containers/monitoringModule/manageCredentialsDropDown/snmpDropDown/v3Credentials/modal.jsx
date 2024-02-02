import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import {
  selectV3CredentialsAuthorizationProtocolNames,
  selectV3CredentialsEncryptionProtocolNames,
} from "../../../../../store/features/dropDowns/selectors";
import {
  useFetchV3CredentialsAuthorizationProtocolNamesQuery,
  useFetchV3CredentialsEncryptionProtocolNamesQuery,
} from "../../../../../store/features/dropDowns/apis";
import {
  useUpdateRecordMutation,
  useAddRecordMutation,
} from "../../../../../store/features/monitoringModule/manageCredentials/snmpCredentials/v3Credentials/apis";
import { formSetter, getTitle } from "../../../../../utils/helpers";
import useErrorHandling, {
  TYPE_FETCH,
  TYPE_SINGLE,
} from "../../../../../hooks/useErrorHandling";
import FormModal from "../../../../../components/dialogs";
import DefaultFormUnit from "../../../../../components/formUnits";
import { SelectFormUnit } from "../../../../../components/formUnits";
import DefaultDialogFooter from "../../../../../components/dialogFooters";
import DefaultSpinner from "../../../../../components/spinners";
import {
  ELEMENT_NAME,
  TABLE_DATA_UNIQUE_ID,
  indexColumnNameConstants,
} from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.PROFILE_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PROFILE_NAME)} is required`),
  [indexColumnNameConstants.USER_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.USER_NAME)} is required`),
  [indexColumnNameConstants.DESCRIPTION]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.DESCRIPTION)} is required`),
  [indexColumnNameConstants.PORT]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PORT)} is required`),
  [indexColumnNameConstants.AUTHORIZATION_PROTOCOL]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.AUTHORIZATION_PROTOCOL)} is required`
    ),
  [indexColumnNameConstants.ENCRYPTION_PROTOCOL]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.ENCRYPTION_PROTOCOL)} is required`
    ),
  [indexColumnNameConstants.AUTHORIZATION_PASSWORD]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.AUTHORIZATION_PASSWORD)} is required`
    ),
  [indexColumnNameConstants.ENCRYPTION_PASSWORD]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.ENCRYPTION_PASSWORD)} is required`
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
    data: authorizationProtocolData,
    isSuccess: isAuthorizationProtocolSuccess,
    isLoading: isAuthorizationProtocolLoading,
    isError: isAuthorizationProtocolError,
    error: authorizationProtocolError,
  } = useFetchV3CredentialsAuthorizationProtocolNamesQuery();

  const {
    data: encryptionProtocolData,
    isSuccess: isEncryptionProtocolSuccess,
    isLoading: isEncryptionProtocolLoading,
    isError: isEncryptionProtocolError,
    error: encryptionProtocolError,
  } = useFetchV3CredentialsEncryptionProtocolNamesQuery();

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
    data: authorizationProtocolData,
    isSuccess: isAuthorizationProtocolSuccess,
    isError: isAuthorizationProtocolError,
    error: authorizationProtocolError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: encryptionProtocolData,
    isSuccess: isEncryptionProtocolSuccess,
    isError: isEncryptionProtocolError,
    error: encryptionProtocolError,
    type: TYPE_FETCH,
  });

  // getting dropdowns data from the store
  const authorizationProtocolNames = useSelector(
    selectV3CredentialsAuthorizationProtocolNames
  );
  const encryptionProtocolNames = useSelector(
    selectV3CredentialsEncryptionProtocolNames
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
            <Grid item xs={12} md={6}>
              <DefaultFormUnit
                control={control}
                dataKey={indexColumnNameConstants.PROFILE_NAME}
                required
              />
              <SelectFormUnit
                control={control}
                dataKey={indexColumnNameConstants.AUTHORIZATION_PROTOCOL}
                options={
                  authorizationProtocolNames ? authorizationProtocolNames : []
                }
                spinning={isAuthorizationProtocolLoading}
                required
              />
              <DefaultFormUnit
                control={control}
                dataKey={indexColumnNameConstants.AUTHORIZATION_PASSWORD}
                required
              />
              <DefaultFormUnit
                control={control}
                dataKey={indexColumnNameConstants.DESCRIPTION}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DefaultFormUnit
                control={control}
                dataKey={indexColumnNameConstants.USER_NAME}
                required
              />
              <SelectFormUnit
                control={control}
                dataKey={indexColumnNameConstants.ENCRYPTION_PROTOCOL}
                options={encryptionProtocolNames ? encryptionProtocolNames : []}
                spinning={isEncryptionProtocolLoading}
                required
              />
              <DefaultFormUnit
                control={control}
                dataKey={indexColumnNameConstants.ENCRYPTION_PASSWORD}
                required
              />
              <DefaultFormUnit
                control={control}
                dataKey={indexColumnNameConstants.PORT}
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
