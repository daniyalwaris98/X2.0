import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../components/dialogs";
import Grid from "@mui/material/Grid";
import DefaultFormUnit from "../../../components/formUnits";
import {
  SelectFormUnit,
  AddableSelectFormUnit,
  DateFormUnit,
} from "../../../components/formUnits";
import DefaultDialogFooter from "../../../components/dialogFooters";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import {
  useUpdateRecordMutation,
  useAddRecordMutation,
} from "../../../store/features/uamModule/racks/apis";
import {
  useFetchRackNamesQuery,
  useFetchSiteNamesQuery,
  useFetchStatusNamesQuery,
} from "../../../store/features/dropDowns/apis";
import { useSelector } from "react-redux";
import { selectSiteNames } from "../../../store/features/dropDowns/selectors";
import useErrorHandling from "../../../hooks/useErrorHandling";
import {
  formSetter,
  getTitle,
  transformDateTimeToDate,
} from "../../../utils/helpers";
import { selectStatusNames } from "../../../store/features/dropDowns/selectors";
import { TYPE_SINGLE } from "../../../hooks/useErrorHandling";
import { ALPHA_NUMERIC_REGEX } from "../../../utils/constants/regex";
import { ELEMENT_NAME } from "./constants";
import { indexColumnNameConstants } from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.RACK_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.RACK_NAME)} is required`)
    .matches(
      ALPHA_NUMERIC_REGEX,
      `Invalid characters in ${getTitle(indexColumnNameConstants.RACK_NAME)}`
    ),
  [indexColumnNameConstants.SITE_NAME]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.SITE_NAME)} is required`),
  [indexColumnNameConstants.STATUS]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.STATUS)} is required`),
  [indexColumnNameConstants.MANUFACTURE_DATE]: yup
    .string()
    .transform(transformDateTimeToDate),
  [indexColumnNameConstants.RFS_DATE]: yup
    .string()
    .transform(transformDateTimeToDate),
});

const Index = ({
  handleClose,
  open,
  recordToEdit,
  handleOpenSiteModal,
  nested = false,
}) => {
  const theme = useTheme();

  // states

  // useForm hook
  const { handleSubmit, control, setValue, watch, trigger } = useForm({
    resolver: yupResolver(schema),
  });

  // effects
  useEffect(() => {
    formSetter(recordToEdit, setValue, {
      dates: [
        indexColumnNameConstants.MANUFACTURE_DATE,
        indexColumnNameConstants.RFS_DATE,
      ],
    });
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
  const { refetch: refetchRackNames } = useFetchRackNamesQuery(
    {
      site_name: watch(indexColumnNameConstants.SITE_NAME, ""),
    },
    {
      skip: !isAddRecordSuccess && !isUpdateRecordSuccess,
    }
  );
  const { error: siteNamesError, isLoading: isSiteNamesLoading } =
    useFetchSiteNamesQuery();
  const { error: statusNamesError, isLoading: isStatusNamesLoading } =
    useFetchStatusNamesQuery();

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

  // ///getting dropdowns data from the store
  const siteNames = useSelector(selectSiteNames);
  const statusNames = useSelector(selectStatusNames);

  // effects
  useEffect(() => {
    if (isAddRecordSuccess || isUpdateRecordSuccess) {
      refetchRackNames();
    }
  }, [isAddRecordSuccess, isUpdateRecordSuccess]);

  // on form submit
  const onSubmit = (data) => {
    if (recordToEdit) {
      data.rack_id = recordToEdit.rack_id;
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
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.RACK_NAME}
              disabled={recordToEdit !== null}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.SERIAL_NUMBER}
            />
            <DateFormUnit
              control={control}
              dataKey={indexColumnNameConstants.MANUFACTURE_DATE}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.PN_CODE}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.UNIT_POSITION}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            {nested ? (
              <SelectFormUnit
                control={control}
                dataKey={indexColumnNameConstants.SITE_NAME}
                options={siteNames}
                required
              />
            ) : (
              <AddableSelectFormUnit
                control={control}
                dataKey={indexColumnNameConstants.SITE_NAME}
                options={siteNames}
                onAddClick={handleOpenSiteModal}
                required
              />
            )}
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.HEIGHT}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.WIDTH}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.DEPTH}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.STATUS}
              options={statusNames}
              required
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.RU}
            />
            <DateFormUnit
              control={control}
              dataKey={indexColumnNameConstants.RFS_DATE}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.RACK_MODEL}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.FLOOR}
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
