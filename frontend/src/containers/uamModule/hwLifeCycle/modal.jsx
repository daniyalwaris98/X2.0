import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../components/dialogs";
import Grid from "@mui/material/Grid";
import DefaultFormUnit, { DateFormUnit } from "../../../components/formUnits";
import DefaultDialogFooter from "../../../components/dialogFooters";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import { useUpdateRecordMutation } from "../../../store/features/uamModule/hwLifeCycle/apis";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { formSetter, transformDateTimeToDate } from "../../../utils/helpers";
import {
  PAGE_NAME,
  indexColumnNameConstants,
  TABLE_DATA_UNIQUE_ID,
} from "./constants";
import { TYPE_SINGLE } from "../../../hooks/useErrorHandling";

const schema = yup.object().shape({
  [indexColumnNameConstants.PN_CODE]: yup
    .string()
    .required("PN Code is required"),
  [indexColumnNameConstants.HW_EOS_DATE]: yup
    .string()
    .transform(transformDateTimeToDate),
  [indexColumnNameConstants.HW_EOL_DATE]: yup
    .string()
    .transform(transformDateTimeToDate),
  [indexColumnNameConstants.SW_EOS_DATE]: yup
    .string()
    .transform(transformDateTimeToDate),
  [indexColumnNameConstants.SW_EOL_DATE]: yup
    .string()
    .transform(transformDateTimeToDate),
  [indexColumnNameConstants.MANUFACTURE_DATE]: yup
    .string()
    .transform(transformDateTimeToDate),
});

const Index = ({ handleClose, open, recordToEdit }) => {
  const theme = useTheme();

  // useForm hook
  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  // effects
  useEffect(() => {
    formSetter(recordToEdit, setValue, {
      dates: [
        indexColumnNameConstants.HW_EOS_DATE,
        indexColumnNameConstants.HW_EOL_DATE,
        indexColumnNameConstants.SW_EOS_DATE,
        indexColumnNameConstants.SW_EOL_DATE,
        indexColumnNameConstants.MANUFACTURE_DATE,
      ],
    });
  }, []);

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

  useErrorHandling({
    data: updateRecordData,
    isSuccess: isUpdateRecordSuccess,
    isError: isUpdateRecordError,
    error: updateRecordError,
    type: TYPE_SINGLE,
  });

  // on form submit
  const onSubmit = (data) => {
    if (recordToEdit) {
      data[TABLE_DATA_UNIQUE_ID] = recordToEdit[TABLE_DATA_UNIQUE_ID];
      updateRecord(data);
    }
  };

  return (
    <FormModal
      sx={{ zIndex: "999" }}
      title={`${recordToEdit ? "Edit" : "Add"} ${PAGE_NAME}`}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.PN_CODE}
              disabled={true}
              required
            />
            <DateFormUnit
              control={control}
              dataKey={indexColumnNameConstants.HW_EOS_DATE}
            />
            <DateFormUnit
              control={control}
              dataKey={indexColumnNameConstants.HW_EOL_DATE}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateFormUnit
              control={control}
              dataKey={indexColumnNameConstants.SW_EOS_DATE}
            />
            <DateFormUnit
              control={control}
              dataKey={indexColumnNameConstants.SW_EOL_DATE}
            />
            <DateFormUnit
              control={control}
              dataKey={indexColumnNameConstants.MANUFACTURE_DATE}
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
