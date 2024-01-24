import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import {
  useUpdateRecordMutation,
  useAddRecordMutation,
} from "../../../store/features/atomModule/passwordGroups/apis";
import {
  useFetchPasswordGroupNamesQuery,
  useFetchPasswordGroupTypeNamesQuery,
} from "../../../store/features/dropDowns/apis";
import { selectPasswordGroupTypeNames } from "../../../store/features/dropDowns/selectors";
import { formSetter, getTitle } from "../../../utils/helpers";
import FormModal from "../../../components/dialogs";
import DefaultFormUnit from "../../../components/formUnits";
import { SelectFormUnit } from "../../../components/formUnits";
import DefaultDialogFooter from "../../../components/dialogFooters";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { TYPE_SINGLE } from "../../../hooks/useErrorHandling";
import { PAGE_NAME, TELNET } from "./constants";
import { indexColumnNameConstants, TABLE_DATA_UNIQUE_ID } from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.PASSWORD_GROUP]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.PASSWORD_GROUP)} is required`
    ),
  [indexColumnNameConstants.USER_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.USER_NAME)} is required`),
  [indexColumnNameConstants.PASSWORD]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.PASSWORD)} is required`),
  [indexColumnNameConstants.PASSWORD_GROUP_TYPE]: yup
    .string()
    .required(
      `${getTitle(indexColumnNameConstants.PASSWORD_GROUP_TYPE)} is required`
    ),
  // secret_password: yup
  //   .string()
  //   .when(
  //     indexColumnNameConstants.PASSWORD_GROUP_TYPE,
  //     (passwordGroupType, schema) => {
  //       if (passwordGroupType == TELNET)
  //         return schema.required(
  //           `${getTitle(indexColumnNameConstants.SECRET_PASSWORD)} is required`
  //         );
  //       return schema;
  //     }
  //   ),
});

const Index = ({ handleClose, open, recordToEdit }) => {
  const theme = useTheme();

  // states
  // const [isSecretPasswordDisable, setIsSecretPasswordDisable] = useState(false);

  // useForm hook
  const { handleSubmit, control, setValue, watch, trigger } = useForm({
    resolver: yupResolver(schema),
  });

  // effects
  useEffect(() => {
    formSetter(recordToEdit, setValue);
  }, []);

  // useEffect(() => {
  //   if (watch(indexColumnNameConstants.PASSWORD_GROUP_TYPE) === "SSH") {
  //     setValue(indexColumnNameConstants.SECRET_PASSWORD, "");
  //     setIsSecretPasswordDisable(true);
  //   } else {
  //     setIsSecretPasswordDisable(false);
  //   }
  //   trigger(indexColumnNameConstants.SECRET_PASSWORD);
  // }, [watch(indexColumnNameConstants.PASSWORD_GROUP_TYPE)]);

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
              type="password"
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
            {/* {watch(indexColumnNameConstants.PASSWORD_GROUP_TYPE) == TELNET ? ( */}
            <DefaultFormUnit
              type="password"
              control={control}
              dataKey={indexColumnNameConstants.SECRET_PASSWORD}
              // disabled={isSecretPasswordDisable}
            />
            {/* ) : null} */}
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
