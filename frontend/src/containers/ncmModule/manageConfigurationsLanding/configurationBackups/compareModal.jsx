import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../../components/dialogs";
import Grid from "@mui/material/Grid";
import DefaultFormUnit from "../../../../components/formUnits";
import { SelectFormUnit } from "../../../../components/formUnits";
import DefaultDialogFooter, {
  CompareDialogFooter,
} from "../../../../components/dialogFooters";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import { useGetNcmConfigurationBackupDetailsByNcmHistoryIdMutation } from "../../../../store/features/ncmModule/manageConfigurations/configurationBackups/apis";
import {
  useFetchPasswordGroupNamesQuery,
  useFetchPasswordGroupTypeNamesQuery,
} from "../../../../store/features/dropDowns/apis";
import { useSelector } from "react-redux";
import {
  selectPasswordGroupNames,
  selectPasswordGroupTypeNames,
} from "../../../../store/features/dropDowns/selectors";
import useErrorHandling from "../../../../hooks/useErrorHandling";
import { formSetter, getTitle } from "../../../../utils/helpers";
import { TYPE_SINGLE } from "../../../../hooks/useErrorHandling";
import { ELEMENT_NAME } from "./constants";
import { compareModalConstants } from "./constants";
import BackupDetails from "./backupDetails";

const schema = yup.object().shape({
  [compareModalConstants.CONFIGURATION_TO_BE_COMPARED]: yup
    .string()
    .required(
      `${getTitle(
        compareModalConstants.CONFIGURATION_TO_BE_COMPARED
      )} is required`
    ),
  [compareModalConstants.COMPARE_TO]: yup
    .string()
    .required(`${getTitle(compareModalConstants.COMPARE_TO)} is required`),
});

const Index = ({ handleClose, open, recordToEdit }) => {
  const theme = useTheme();

  // useForm hook
  const { handleSubmit, control, setValue, watch, trigger } = useForm({
    resolver: yupResolver(schema),
  });

  // effects
  useEffect(() => {
    formSetter(recordToEdit, setValue);
  }, []);

  // post api for the form

  // fetching dropdowns data from backend using apis
  const {
    error: passwordGroupTypeNamesError,
    isLoading: isPasswordGroupTypeNamesLoading,
  } = useFetchPasswordGroupTypeNamesQuery();

  // error handling custom hooks

  // getting dropdowns data from the store
  const passwordGroupTypeNames = useSelector(selectPasswordGroupTypeNames);

  // on form submit
  const onSubmit = (data) => {};

  return (
    <FormModal
      sx={{ zIndex: "999" }}
      title={`${"Compare"} ${ELEMENT_NAME}`}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "15px" }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectFormUnit
              control={control}
              dataKey={compareModalConstants.CONFIGURATION_TO_BE_COMPARED}
              options={passwordGroupTypeNames}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <SelectFormUnit
              control={control}
              dataKey={compareModalConstants.COMPARE_TO}
              options={passwordGroupTypeNames}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <BackupDetails readOnly={true} />
          </Grid>
          <Grid item xs={6}>
            <BackupDetails readOnly={true} />
          </Grid>
          <Grid item xs={12}>
            <CompareDialogFooter handleClose={handleClose} />
          </Grid>
        </Grid>
      </form>
    </FormModal>
  );
};

export default Index;
